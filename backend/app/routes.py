import json

import requests
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from .ai import ai_enhance, ai_generate_detailed_report
from .analyzer import detect_issues
from .pdf_report import build_detailed_pdf
from .schemas import WebsiteRequest
from .scraper import crawl_site, fetch_site

router = APIRouter()


@router.post("/analyze")
def analyze(request: WebsiteRequest):
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. Please include http:// or https://",
        )

    try:
        site_pages = crawl_site(request.url)
        analysis = detect_issues(site_pages)
        ai_report = ai_enhance(request.url, analysis)

        return {
            "url": request.url,
            "score": analysis["score"],
            "issues": analysis["issues"],
            "fixes": analysis["fixes"],
            "ai_report": ai_report,
        }

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
def generate_detailed_report(request: WebsiteRequest):
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400,
            detail="Invalid URL format. Please include http:// or https://",
        )

    try:
        site_pages = crawl_site(request.url)
        analysis = detect_issues(site_pages)
        detailed_report_json = ai_generate_detailed_report(request.url, analysis)
        detailed_report = json.loads(detailed_report_json)
        pdf_bytes = build_detailed_pdf(request.url, analysis, detailed_report)

        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=web-analyzer-premium-report-{analysis['score']}.pdf"},
        )

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
