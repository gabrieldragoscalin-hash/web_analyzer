import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()


def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set. Add it to your environment before using AI analysis.")

    return OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")


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
