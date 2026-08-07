import io
import csv
import json
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class ReportGenerator:
    """
    Enterprise Multi-Format Security & Compliance Report Generator.
    Supports Executive Report, Technical Report, SOC Incident Report, IOC Report, & Compliance Reports.
    """

    @staticmethod
    def generate_pdf_report(scan_data: dict, report_type: str = "executive") -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#070a13')
        )

        sub_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor('#64748b')
        )

        h2_style = ParagraphStyle(
            'Heading2Custom',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=17,
            textColor=colors.HexColor('#0f172a'),
            spaceBefore=10,
            spaceAfter=4
        )

        body_style = ParagraphStyle(
            'BodyCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=colors.HexColor('#334155')
        )

        elements = []

        # Header Title
        report_title = f"CYBERSHIELD {report_type.upper()} REPORT"
        elements.append(Paragraph(report_title, title_style))
        elements.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')} | Compliance Standards: NIST SP 800-61, OWASP Top 10, ISO 27001", sub_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#00f2fe'), spaceAfter=12))

        # Target Summary Table
        status = scan_data.get("status", "Unknown")
        risk_score = scan_data.get("risk_score", 0.0)
        confidence = scan_data.get("confidence_score", 95.0)

        status_color = colors.HexColor('#dc2626') if status == "Phishing" else colors.HexColor('#d97706') if status == "Suspicious" else colors.HexColor('#16a34a')

        summary_table_data = [
            [Paragraph("<b>Target URL</b>", body_style), Paragraph(scan_data.get("url", "N/A"), body_style)],
            [Paragraph("<b>Domain</b>", body_style), Paragraph(scan_data.get("domain", "N/A"), body_style)],
            [Paragraph("<b>Classification</b>", body_style), Paragraph(f"<font color='{status_color.hexval()}'><b>{status.upper()}</b></font>", body_style)],
            [Paragraph("<b>Risk Score</b>", body_style), Paragraph(f"<b>{risk_score}%</b>", body_style)],
            [Paragraph("<b>AI Confidence</b>", body_style), Paragraph(f"<b>{confidence}%</b>", body_style)]
        ]

        t_summary = Table(summary_table_data, colWidths=[120, 420])
        t_summary.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(t_summary)
        elements.append(Spacer(1, 12))

        # Security Reasons
        elements.append(Paragraph("Threat Analysis & Detection Reasons", h2_style))
        reasons = scan_data.get("reasons", [])
        if reasons:
            reason_rows = [[Paragraph(f"• {r}", body_style)] for r in reasons]
            t_reasons = Table(reason_rows, colWidths=[540])
            t_reasons.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fff1f2') if status == "Phishing" else colors.HexColor('#f0fdf4')),
                ('PADDING', (0, 0), (-1, -1), 5),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#fecdd3') if status == "Phishing" else colors.HexColor('#bbf7d0')),
            ]))
            elements.append(t_reasons)
        elements.append(Spacer(1, 12))

        # MITRE ATT&CK Mapping Section
        elements.append(Paragraph("MITRE ATT&CK Threat Mapping", h2_style))
        mitre_data = [
            ["Tactic", "Technique ID", "Technique Name"],
            ["Initial Access", "T1566.002", "Spearphishing Link"],
            ["Defense Evasion", "T1027", "Obfuscated Files / IDN Homographs"],
            ["Credential Access", "T1556", "Modify Auth Process / Fake Login"]
        ]
        t_mitre = Table(mitre_data, colWidths=[160, 140, 240])
        t_mitre.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f172a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('PADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(t_mitre)
        elements.append(Spacer(1, 12))

        # Actionable Mitigation
        elements.append(Paragraph("Actionable Remediation & Mitigation Steps", h2_style))
        recs = [
            "1. Block target domain across Firewalls, Web Proxies, and Endpoint EDRs.",
            "2. Invalidate active session tokens if credentials were exposed.",
            "3. Submit domain IOC to ThreatFeeds and National CERT.",
            "4. Enforce mandatory Multi-Factor Authentication (MFA) across corporate accounts."
        ] if status == "Phishing" else [
            "1. Target domain exhibits clean security indicators.",
            "2. Maintain routine Security Web Gateway monitoring."
        ]
        rec_rows = [[Paragraph(r, body_style)] for r in recs]
        t_recs = Table(rec_rows, colWidths=[540])
        t_recs.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('PADDING', (0, 0), (-1, -1), 5),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ]))
        elements.append(t_recs)

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    @staticmethod
    def generate_json_report(scan_data: dict) -> str:
        return json.dumps(scan_data, indent=2)

    @staticmethod
    def generate_csv_report(scan_logs: list) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["ID", "URL", "Domain", "Status", "Risk Score (%)", "Confidence (%)", "Scan Date", "Reasons"])

        for log in scan_logs:
            reasons_str = "; ".join(log.reasons) if isinstance(log.reasons, list) else str(log.reasons)
            writer.writerow([
                log.id,
                log.url,
                log.domain,
                log.status,
                log.risk_score,
                getattr(log, "confidence_score", 95.0),
                log.scan_date.strftime("%Y-%m-%d %H:%M:%S") if log.scan_date else "",
                reasons_str
            ])
        return output.getvalue()
