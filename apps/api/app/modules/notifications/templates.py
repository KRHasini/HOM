"""Email templates for lead notifications. Plain text first, minimal escaped HTML second."""

from __future__ import annotations

from html import escape
from urllib.parse import quote

from app.core.config import Settings
from app.modules.leads.models import EnquiryType, Lead
from app.modules.notifications.base import EmailMessage

_DAY_LABELS = {
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat",
    "sun": "Sun",
}


def _rows(lead: Lead) -> list[tuple[str, str]]:
    audience = {"self": "Themselves", "child": "Their child"}.get(
        lead.audience.value if lead.audience else "", "—"
    )
    rows = [
        ("Name", lead.name),
        ("Phone", lead.phone),
        ("Email", lead.email or "—"),
        ("Enquiry", "Free trial class" if lead.enquiry_type is EnquiryType.TRIAL else "General"),
        ("For", audience),
        ("Age", str(lead.age) if lead.age else "—"),
        ("Class", lead.class_slug.replace("-", " ").title() if lead.class_slug else "—"),
        ("Preferred days", ", ".join(_DAY_LABELS.get(d, d) for d in lead.preferred_days) or "—"),
        ("Preferred time", (lead.preferred_time or "—").title()),
        ("Message", lead.message or "—"),
        ("Source", lead.source or "—"),
        ("UTM", " / ".join(filter(None, [lead.utm_source, lead.utm_medium, lead.utm_campaign]))),
        ("Landing page", lead.landing_page or "—"),
        ("Referrer", lead.referrer or "—"),
    ]
    return [(k, v or "—") for k, v in rows]


def studio_notification(lead: Lead, settings: Settings) -> EmailMessage:
    kind = "Trial request" if lead.enquiry_type is EnquiryType.TRIAL else "New enquiry"
    digits = lead.phone.lstrip("+")
    first_name = lead.name.split()[0]
    wa_text = quote(f"Hi {first_name}, this is {settings.studio_name}. Thank you for reaching out!")
    tel_link = f"tel:{lead.phone}"
    wa_link = f"https://wa.me/{digits}?text={wa_text}"

    rows = _rows(lead)
    text = "\n".join(
        [
            f"{kind} — {settings.studio_name}",
            "",
            *(f"{label}: {value}" for label, value in rows),
            "",
            f"Call: {tel_link}",
            f"WhatsApp: {wa_link}",
            "",
            f"Lead id: {lead.id}",
        ]
    )
    html_rows = "".join(
        f'<tr><td style="padding:6px 12px 6px 0;color:#6B665D;vertical-align:top">{escape(k)}</td>'
        f'<td style="padding:6px 0;color:#0B0B0C">{escape(v)}</td></tr>'
        for k, v in rows
    )
    button = (
        "display:inline-block;padding:12px 20px;margin-right:8px;text-decoration:none;"
        "font-weight:600;letter-spacing:.08em;text-transform:uppercase;font-size:12px"
    )
    html = f"""<!doctype html><html><body style="margin:0;background:#F6F1E8;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px">
<p style="margin:0 0 4px;color:#8A6224;letter-spacing:.2em;text-transform:uppercase;font-size:11px">{escape(settings.studio_name)}</p>
<h1 style="margin:0 0 24px;font-size:24px;color:#0B0B0C">{escape(kind)}: {escape(lead.name)}</h1>
<p style="margin:0 0 24px">
<a href="{escape(tel_link)}" style="{button};background:#B8863B;color:#0B0B0C">Call now</a>
<a href="{escape(wa_link)}" style="{button};background:#0B0B0C;color:#F6F1E8">WhatsApp</a>
</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px">{html_rows}</table>
<p style="margin:24px 0 0;color:#6B665D;font-size:12px">Lead id: {escape(str(lead.id))}</p>
</td></tr></table></body></html>"""

    return EmailMessage(
        to=[settings.studio_notify_email],
        subject=f"[{settings.studio_name}] {kind}: {lead.name}",
        text=text,
        html=html,
        reply_to=lead.email,
    )


def visitor_confirmation(lead: Lead, settings: Settings) -> EmailMessage | None:
    if not lead.email:
        return None
    text = (
        f"Hi {lead.name.split()[0]},\n\n"
        f"Thank you for reaching out to {settings.studio_name}. "
        "Our team will call you shortly to confirm the details.\n\n"
        f"WhatsApp us any time: https://wa.me/{settings.studio_whatsapp}\n\n"
        "Join the movement. Be the change."
    )
    return EmailMessage(
        to=[lead.email], subject=f"We received your request — {settings.studio_name}", text=text
    )
