import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def build_detailed_pdf(url: str, analysis: dict, detailed_report: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=LETTER, rightMargin=0.75 * inch, leftMargin=0.75 * inch)
    styles = getSampleStyleSheet()

    story = []
    story.append(Paragraph("Premium Website Fix Report", styles["Title"]))
    story.append(Paragraph(f"URL: {url}", styles["Heading2"]))
    story.append(Paragraph(f"Current score: {analysis['score']}/100", styles["Heading3"]))
    story.append(Spacer(1, 0.2 * inch))

    summary = detailed_report.get("summary", "This report explains your website issues in simple terms and gives clear next steps.")
    story.append(Paragraph("What this means", styles["Heading2"]))
    story.append(Paragraph(summary, styles["BodyText"]))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Key issues and fixes", styles["Heading2"]))
    for item in detailed_report.get("findings", []):
        story.append(Paragraph(item.get("issue", "Issue"), styles["Heading3"]))
        story.append(Paragraph(item.get("why_it_matters", ""), styles["BodyText"]))

        steps = item.get("fix_steps", [])
        if steps:
            story.append(Paragraph("What to do next:", styles["Heading4"]))
            for step in steps:
                story.append(Paragraph(f"• {step}", styles["BodyText"]))

        code_example = item.get("code_example", "")
        if code_example:
            story.append(Paragraph("Developer example (optional):", styles["Heading4"]))
            code_table = Table([[code_example]], colWidths=[6.5 * inch])
            code_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ("FONTNAME", (0, 0), (-1, -1), "Courier"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]))
            story.append(code_table)
        story.append(Spacer(1, 0.15 * inch))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("This premium report is written for business owners, not developers. It uses simple terms and explains why each fix matters.", styles["BodyText"]))

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
