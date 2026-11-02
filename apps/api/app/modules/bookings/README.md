# bookings (table only — Phase 2)

`bookings` exists and is migrated so Phase 2 can schedule trial classes from leads
(`lead_id`, `class_id`, `scheduled_for`, `status`). Add `schemas.py`, `repository.py`,
`service.py` and an authenticated `router.py` (using a `require_role` dependency from
`core/security.py`) when the admin dashboard is built.
