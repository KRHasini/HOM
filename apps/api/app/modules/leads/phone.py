"""Phone normalisation to E.164 with India as the default region."""

from __future__ import annotations

import phonenumbers

DEFAULT_REGION = "IN"


def normalize_phone(raw: str, region: str = DEFAULT_REGION) -> str:
    """Return the number in E.164 form or raise ``ValueError`` if it is not valid."""
    candidate = raw.strip()
    if not candidate:
        raise ValueError("Enter a phone number.")
    try:
        parsed = phonenumbers.parse(candidate, region)
    except phonenumbers.NumberParseException as exc:
        raise ValueError("Enter a valid phone number.") from exc
    if not phonenumbers.is_valid_number(parsed):
        raise ValueError("Enter a valid phone number.")
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
