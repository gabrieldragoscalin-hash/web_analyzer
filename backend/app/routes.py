import json
import time
import uuid
from typing import Any, Dict, Optional

import requests
from fastapi import APIRouter, BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .ai import ai_enhance, ai_generate_detailed_report
from .analyzer import detect_issues
from .pdf_report import build_detailed_pdf
from .schemas import WebsiteRequest
from .scraper import crawl_site

router = APIRouter()

ANALYSIS_CACHE_TTL = 600
PDF_CACHE_TTL = 1800
ANALYSIS_CACHE: Dict[str, Dict[str, Any]] = {}
PDF_CACHE: Dict[str, Dict[str, Any]] = {}
JOB_STORE: Dict[str, Dict[str, Any]] = {}


def cleanup_cache() -> None:
    now = time.time()
    for url in list(ANALYSIS_CACHE):
        if now - ANALYSIS_CACHE[url]["timestamp"] > ANALYSIS_CACHE_TTL:
            del ANALYSIS_CACHE[url]

    for url in list(PDF_CACHE):
        if now - PDF_CACHE[url]["timestamp"] > PDF_CACHE_TTL:
            entry = PDF_CACHE.pop(url)
            job_id = entry.get("job_id")
            if job_id and job_id in JOB_STORE and JOB_STORE[job_id]["status"] == "ready":
                del JOB_STORE[job_id]

    for job_id in list(JOB_STORE):
        if JOB_STORE[job_id]["status"] != "ready" and now - JOB_STORE[job_id]["created"] > PDF_CACHE_TTL:
            del JOB_STORE[job_id]


def get_cached_analysis(url: str) -> Optional[Dict[str, Any]]:
    cleanup_cache()
    cached = ANALYSIS_CACHE.get(url)
    return cached["payload"] if cached else None


def cache_analysis(url: str, payload: Dict[str, Any]) -> None:
    ANALYSIS_CACHE[url] = {
        "timestamp": time.time(),
        "payload": payload,
    }


def get_pdf_cache(url: str) -> Optional[Dict[str, Any]]:
    cleanup_cache()
    return PDF_CACHE.get(url)


def create_pdf_job(url: str) -> str:
    job_id = uuid.uuid4().hex
    JOB_STORE[job_id] = {
        "url": url,
        "status": "pending",
        "created": time.time(),
        "pdf_bytes": None,
        "error": None,
    }
    PDF_CACHE[url] = {
        "timestamp": time.time(),
        "job_id": job_id,
    }
    return job_id


def generate_detailed_report_job(job_id: str, url: str) -> None:
    try:
        cached_analysis = get_cached_analysis(url)
        if cached_analysis is None:
            site_pages = crawl_site(url)
            analysis = detect_issues(site_pages)
        else:
            analysis = cached_analysis["analysis"]

        detailed_report_json = ai_generate_detailed_report(url, analysis)
        detailed_report = json.loads(detailed_report_json)
        pdf_bytes = build_detailed_pdf(url, analysis, detailed_report)

        JOB_STORE[job_id].update({
            "status": "ready",
            "pdf_bytes": pdf_bytes,
            "score": analysis["score"],
        })
        PDF_CACHE[url]["timestamp"] = time.time()
    except Exception as exc:
        JOB_STORE[job_id].update({
            "status": "failed",
            "error": str(exc),
        })


@router.post("/analyze")
def analyze(request: WebsiteRequest):
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. Please include http:// or https://",
        )

    try:
        cached_response = get_cached_analysis(request.url)
        if cached_response:
            return cached_response["response"]

        site_pages = crawl_site(request.url)
        analysis = detect_issues(site_pages)
        ai_report = ai_enhance(request.url, analysis)
        response = {
            "url": request.url,
            "score": analysis["score"],
            "issues": analysis["issues"],
            "fixes": analysis["fixes"],
            "ai_report": ai_report,
        }
        cache_analysis(request.url, {"analysis": analysis, "response": response})
        return response

    except requests.exceptions.RequestException as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to reach the website: {str(exc)}",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected internal error occurred: {str(exc)}",
        ) from exc


@router.post("/generate-detailed-report")
def generate_detailed_report(request: WebsiteRequest, background_tasks: BackgroundTasks):
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. Please include http:// or https://",
        )

    try:
        cached_pdf = get_pdf_cache(request.url)
        if cached_pdf:
            job_id = cached_pdf["job_id"]
            status = JOB_STORE.get(job_id, {}).get("status", "pending")
            if status == "failed":
                JOB_STORE.pop(job_id, None)
                PDF_CACHE.pop(request.url, None)
            else:
                return {"job_id": job_id, "status": status}

        job_id = create_pdf_job(request.url)
        background_tasks.add_task(generate_detailed_report_job, job_id, request.url)
        return {"job_id": job_id, "status": "pending"}

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected internal error occurred: {str(exc)}",
        ) from exc


@router.get("/report-status/{job_id}")
def report_status(job_id: str):
    cleanup_cache()
    job = JOB_STORE.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Report not found.")

    response = {
        "job_id": job_id,
        "status": job["status"],
    }
    if job["status"] == "ready":
        response["score"] = job.get("score")
    if job["status"] == "failed":
        response["error"] = job.get("error")
    return response


@router.get("/download-report/{job_id}")
def download_report(job_id: str):
    cleanup_cache()
    job = JOB_STORE.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Report not found.")
    if job["status"] != "ready":
        raise HTTPException(status_code=409, detail="Report is not yet ready.")

    return StreamingResponse(
        iter([job["pdf_bytes"]]),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=web-analyzer-premium-report.pdf"},
    )


def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)
    return app


app = create_app()
