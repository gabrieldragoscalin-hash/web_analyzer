import time

import requests
from bs4 import BeautifulSoup


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
        "has_viewport": bool(soup.find("meta", attrs={"name": "viewport"})),
    }
