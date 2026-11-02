# payments (reserved — Phase 3)

Intentionally empty. Phase 1 captures leads only; no payment code ships yet.

When payments arrive, build this as a self-contained module following the same layout
as `leads/` (`router.py → service.py → repository.py → models.py`), with the provider
(Razorpay, Stripe, …) behind a `PaymentProvider` protocol like `notifications/base.py`,
and register its router in `app/api/router.py`. Webhooks get their own signed endpoint
and an idempotency table.
