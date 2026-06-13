import time
from typing import List
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

CTA_KEYWORDS = [
    "call",
    "contact",
    "book",
    "order",
    "get in touch",
    "quote",
    "demo",
    "free",
    "buy",
    "start",
]


def is_internal_link(base_url: str, link: str) -> bool:
    base_host = urlparse(base_url).netloc
    target_host = urlparse(link).netloc
    return target_host == base_host or target_host == ""


def build_absolute_url(base_url: str, link: str) -> str:
    return urljoin(base_url, link.split("#")[0])


def fetch_page_data(url: str) -> dict:
    start = time.time()
    response = requests.get(url, timeout=10)
    load_time = time.time() - start

    soup = BeautifulSoup(response.text, "html.parser")
    page_text = soup.get_text(separator=" ", strip=True)
    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    button_text = " ".join(
        element.get_text(" ", strip=True).lower()
        for element in soup.find_all(["button", "a"])
    )

    return {
        "url": url,
        "html": response.text,
        "text": page_text,
        "title": title,
        "load_time": load_time,
        "has_viewport": bool(soup.find("meta", attrs={"name": "viewport"})),
        "has_buttons": bool(soup.find(["button", "a"])),
        "has_cta": any(word in page_text.lower() for word in CTA_KEYWORDS)
        or any(word in button_text for word in CTA_KEYWORDS),
        "has_nav": bool(soup.find("nav"))
        or bool(
            soup.find(["header", "ul"], attrs={"class": lambda value: value and "nav" in value.lower()})
        ),
        "mobile_menu": bool(
            soup.find("button", attrs={"aria-controls": True})
            or soup.find("button", attrs={"aria-expanded": True})
            or soup.find("button", string=lambda value: value and "menu" in value.lower())
            or soup.find("a", string=lambda value: value and "menu" in value.lower())
            or soup.find(attrs={"data-menu": True})
        ),
    }


def fetch_site(url: str) -> dict:
    return fetch_page_data(url)


def crawl_site(start_url: str, max_pages: int = 5) -> List[dict]:
    visited = set()
    queue = [start_url]
    pages = []

    while queue and len(pages) < max_pages:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)

        page_data = fetch_page_data(url)
        pages.append(page_data)

        soup = BeautifulSoup(page_data["html"], "html.parser")

        for anchor in soup.find_all("a", href=True):
            link = build_absolute_url(url, anchor["href"])
            if is_internal_link(start_url, link) and link not in visited and link not in queue:
                queue.append(link)
                if len(queue) + len(pages) >= max_pages:
                    break

    return pages
