from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import time
import os
from dotenv import load_dotenv
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv() 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your Next.js app to connect
    allow_credentials=True,
    allow_methods=["*"], # Allows POST, GET, etc.
    allow_headers=["*"], # Allows all headers
)

client = OpenAI(api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1")


# -------------------------
# Input model
# -------------------------
class WebsiteRequest(BaseModel):
    url: str


# -------------------------
# Step 1: basic scraping
# -------------------------
def fetch_site(url: str):
    start = time.time()
    response = requests.get(url, timeout=10)
    load_time = time.time() - start

    soup = BeautifulSoup(response.text, "html.parser")

    return {
        "html": response.text,
        "text": soup.get_text(separator=" ", strip=True),
        "title": soup.title.string if soup.title else "",
        "load_time": load_time,
        "has_viewport": bool(soup.find("meta", attrs={"name": "viewport"}))
    }


# -------------------------
# Step 2: rule-based detection
# -------------------------
def detect_issues(data):
    issues = []
    fixes = []
    score = 100

    # Speed
    if data["load_time"] > 2.5:
        issues.append("slow_loading")
        fixes.append("Optimize images and reduce scripts")
        score -= 25

    # Mobile
    if not data["has_viewport"]:
        issues.append("no_mobile_viewport")
        fixes.append("Add mobile viewport meta tag")
        score -= 20

    # Title
    if not data["title"] or len(data["title"]) < 5:
        issues.append("weak_title")
        fixes.append("Add clear business-focused title")
        score -= 10

    # CTA detection
    text_lower = data["text"].lower()
    cta_words = ["call", "contact", "book", "order", "get in touch"]

    if not any(word in text_lower for word in cta_words):
        issues.append("no_cta")
        fixes.append("Add visible call-to-action button")
        score -= 25

    return {
        "issues": issues,
        "fixes": fixes,
        "score": max(score, 0)
    }


# -------------------------
# Step 3: AI explanation layer
# -------------------------
def ai_enhance(url, analysis):
    prompt = f"""
You are a business website consultant.

A small business owner has a website analysis.

URL: {url}

Detected issues:
{analysis['issues']}

Basic score: {analysis['score']}

Fix suggestions:
{analysis['fixes']}

TASK:
Turn this into a simple report for a non-technical business owner.

Return JSON with:
- summary (1-2 sentences)
- explanation (simple paragraph)
- priority_fixes (top 3 most important fixes)
- business_impact (what they are losing, e.g. customers, trust, sales)
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You write clear business-friendly reports."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4
    )

    return response.choices[0].message.content


# -------------------------
# API endpoint
# -------------------------
@app.post("/analyze")
def analyze(request: WebsiteRequest):
    # 1. Validate URL presence and basic format
    if not request.url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=400, 
            detail="Invalid URL format. Please include http:// or https://"
        )

    try:
        # 2. Attempt to fetch and parse the site
        site_data = fetch_site(request.url)
        analysis = detect_issues(site_data)
        
        ai_report = ai_enhance(request.url, analysis)

        return {
            "url": request.url,
            "score": analysis["score"],
            "issues": analysis["issues"],
            "fixes": analysis["fixes"],
            "ai_report": ai_report
        }

    except requests.exceptions.RequestException as e:
        # Catch network errors, timeouts, or DNS issues gracefully
        raise HTTPException(
            status_code=400, 
            detail=f"Failed to reach the website: {str(e)}"
        )
    except Exception as e:
        # Catch any other unexpected errors (like OpenAI API issues)
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected internal error occurred: {str(e)}"
        )