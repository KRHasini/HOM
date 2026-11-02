from __future__ import annotations

import pytest

from app.modules.leads.phone import normalize_phone


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("97425 08862", "+919742508862"),
        ("9742508862", "+919742508862"),
        ("09742508862", "+919742508862"),
        ("+91 97425-08862", "+919742508862"),
        ("+91 (974) 250 8862", "+919742508862"),
        ("919742508862", "+919742508862"),
        ("+44 20 7946 0958", "+442079460958"),
    ],
)
def test_normalizes_to_e164(raw: str, expected: str) -> None:
    assert normalize_phone(raw) == expected


@pytest.mark.parametrize("raw", ["", "12345", "abcdefghij", "+91 12345", "0000000000"])
def test_rejects_invalid_numbers(raw: str) -> None:
    with pytest.raises(ValueError):
        normalize_phone(raw)
