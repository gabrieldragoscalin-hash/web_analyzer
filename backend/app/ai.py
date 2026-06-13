import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set. Add it to your environment before using AI analysis.")

    return OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")


def ai_generate_detailed_report(url: str, analysis: dict):
    prompt = f"""
You are a senior website conversion consultant.
Create a premium, business-friendly report for a small business owner.

URL: {url}
Current score: {analysis['score']}/100
Detected issues:
{analysis['issues']}

Use plain language only. Avoid technical jargon. If you mention a term like "CSS", "HTML", "selector", or "query", explain it briefly in simple words.

Return valid JSON only with this shape:
{{
  "title": "short title",
  "summary": "2 sentences explaining the website's main problems in plain language",
  "findings": [
    {{
      "issue": "short issue title",
      "why_it_matters": "why this hurts visitors or sales",
      "fix_steps": ["step 1", "step 2", "step 3"],
      "code_example": "optional small example showing a real fix, labeled in plain language"
    }}
  ]
}}
"""

    client = get_client()
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You create premium, easy-to-read reports with practical fixes and code examples."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content


def ai_enhance(url: str, analysis: dict):
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

    client = get_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You write clear business-friendly reports."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content
