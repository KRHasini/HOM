"""Import every model so ``Base.metadata`` is complete (used by Alembic and tests)."""

from app.core.db import Base
from app.modules.bookings.models import Booking
from app.modules.classes.models import ClassInstructor, DanceClass
from app.modules.instructors.models import Instructor
from app.modules.leads.models import Lead, LeadEvent
from app.modules.marketing.models import Event, GalleryMedia, Testimonial

__all__ = [
    "Base",
    "Booking",
    "ClassInstructor",
    "DanceClass",
    "Event",
    "GalleryMedia",
    "Instructor",
    "Lead",
    "LeadEvent",
    "Testimonial",
]
