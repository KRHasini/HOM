"""Erase a person's leads on request (privacy / right to erasure).

Personal fields are scrubbed and the rows are soft-deleted, so aggregate funnel
counts survive but nothing identifies the person.

Usage::

    python -m app.scripts.delete_lead --phone "+919876543210"
    python -m app.scripts.delete_lead --email "someone@example.com" --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
from datetime import UTC, datetime

from sqlalchemy import delete

from app.core.config import get_settings
from app.core.db import create_engine, create_session_factory
from app.modules.leads.models import LeadEvent
from app.modules.leads.phone import normalize_phone
from app.modules.leads.repository import LeadRepository


async def erase(phone: str | None, email: str | None, *, dry_run: bool) -> int:
    settings = get_settings()
    engine = create_engine(settings)
    try:
        async with create_session_factory(engine)() as session:
            repo = LeadRepository(session)
            leads = await repo.find_by_contact(normalize_phone(phone) if phone else None, email)
            if dry_run:
                return len(leads)
            now = datetime.now(UTC)
            for lead in leads:
                lead.name = "Erased"
                lead.phone = "+00000000000"
                lead.email = None
                lead.message = None
                lead.ip_hash = None
                lead.user_agent = None
                lead.referrer = None
                lead.deleted_at = now
                await session.execute(delete(LeadEvent).where(LeadEvent.lead_id == lead.id))
            await session.commit()
            return len(leads)
    finally:
        await engine.dispose()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--phone")
    parser.add_argument("--email")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    if not args.phone and not args.email:
        parser.error("Provide --phone and/or --email.")
    count = asyncio.run(erase(args.phone, args.email, dry_run=args.dry_run))
    verb = "Would erase" if args.dry_run else "Erased"
    print(f"{verb} {count} lead(s).")


if __name__ == "__main__":
    main()
