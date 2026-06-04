def detect_issues(data):
    issues = []
    fixes = []
    score = 100

    if data["load_time"] > 2.5:
        issues.append("Your website feels slow to load")
        fixes.append("Make the page faster by compressing images and removing heavy scripts.")
        score -= 25

    if not data["has_viewport"]:
        issues.append("Your site may not look right on phones")
        fixes.append("Add a mobile-friendly viewport setting so the layout scales correctly on small screens.")
        score -= 20

    if not data["title"] or len(data["title"]) < 5:
        issues.append("The page title is not clear enough")
        fixes.append("Use a short, clear title that tells visitors what your business offers.")
        score -= 10

    text_lower = data["text"].lower()
    cta_words = ["call", "contact", "book", "order", "get in touch"]

    if not any(word in text_lower for word in cta_words):
        issues.append("Visitors may not know what to do next")
        fixes.append("Add a clear button such as Contact us, Book now, or Get a quote.")
        score -= 25

    return {
        "issues": issues,
        "fixes": fixes,
        "score": max(score, 0),
    }
