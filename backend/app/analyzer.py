def detect_issues(data):
    pages = data if isinstance(data, list) else [data]
    issues = []
    fixes = []
    score = 100

    if len(pages) == 0:
        issues.append("Could not analyze any pages from the provided website.")
        fixes.append("Make sure the URL is reachable and returns HTML.")
        return {
            "issues": issues,
            "fixes": fixes,
            "score": 0,
        }

    missing_viewport_pages = [page for page in pages if not page["has_viewport"]]
    if missing_viewport_pages:
        issues.append(
            "Some pages are missing a mobile viewport meta tag."
        )
        fixes.append(
            "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> to all pages so mobile layouts scale correctly."
        )
        score -= 20

    slow_pages = [page for page in pages if page["load_time"] > 2.5]
    if slow_pages:
        issues.append(
            "Some pages take too long to load."
        )
        fixes.append(
            "Compress images, defer non-critical scripts, and reduce large resources to improve loading speed."
        )
        score -= 20

    title_issues = [page for page in pages if not page["title"] or len(page["title"]) < 5]
    if title_issues:
        issues.append(
            "Some pages have missing or weak titles."
        )
        fixes.append(
            "Use unique, descriptive <title> text for each page so visitors and search engines know what the page is about."
        )
        score -= 10

    pages_without_buttons = [page for page in pages if not page["has_buttons"]]
    if pages_without_buttons:
        issues.append(
            "Some pages do not contain any clickable buttons or links."
        )
        fixes.append(
            "Add visible buttons or links on each page so users can take action or move through the site."
        )
        score -= 20

    pages_without_cta = [page for page in pages if not page["has_cta"]]
    if pages_without_cta:
        issues.append(
            "Some pages do not include a clear call to action."
        )
        fixes.append(
            "Add clear CTA text like Contact, Book, Get a quote, or Start now on each page."
        )
        score -= 25

    pages_without_nav = [page for page in pages if not page["has_nav"]]
    if pages_without_nav:
        issues.append(
            "Some pages are missing a navigation bar or menu structure."
        )
        fixes.append(
            "Include a navigation section or header links so visitors can move between pages easily."
        )
        score -= 15

    pages_without_mobile_menu = [page for page in pages if page["has_nav"] and not page["mobile_menu"]]
    if pages_without_mobile_menu:
        issues.append(
            "Some pages do not expose a mobile-friendly menu toggle."
        )
        fixes.append(
            "Ensure navigation can be opened on small screens with a visible menu button, hamburger icon, or accessible mobile menu toggle."
        )
        score -= 15

    if len(pages) == 1:
        issues.append(
            "The analyzer only discovered one page from the site."
        )
        fixes.append(
            "Expose internal pages with crawlable links so the analyzer can evaluate more than just the homepage."
        )
        score -= 10

    return {
        "issues": issues,
        "fixes": fixes,
        "score": max(score, 0),
    }
