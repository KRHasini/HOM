import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import type { ResolvedEvent } from "@/content";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: ResolvedEvent;
  labels: { register: string; enquire: string; status: string };
  enquireHref: string;
  past?: boolean;
}

const dateParts = (iso: string) => {
  const date = new Date(iso);
  const tz = { timeZone: "Asia/Kolkata" } as const;
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit", ...tz }),
    month: date.toLocaleDateString("en-IN", { month: "short", ...tz }),
    year: date.toLocaleDateString("en-IN", { year: "numeric", ...tz }),
    time: date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", ...tz }),
  };
};

/** Event with a date badge, venue, image and a register / enquire action. */
export function EventCard({ event, labels, enquireHref, past = false }: EventCardProps) {
  const d = dateParts(event.startsAt);
  return (
    <article
      className={cn(
        "group/event grid overflow-hidden border border-hairline-soft bg-ink-soft md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
        past && "opacity-75",
      )}
    >
      <div className="relative aspect-[16/10] md:aspect-auto md:min-h-80">
        {event.image ? (
          <SmartImage image={event.image} sizes="(min-width: 768px) 40vw, 100vw" />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_20%,rgb(184_134_59/0.3),transparent_70%)]"
          />
        )}
        <div className="absolute top-4 left-4 flex flex-col items-center bg-gold px-4 py-3 text-ink">
          <span className="display text-4xl leading-none">{d.day}</span>
          <span className="eyebrow text-[0.65rem]">{d.month}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 p-6 md:p-10">
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-gold-light">
            {d.month} {d.day}, {d.year} · {d.time}
            {event.status !== "scheduled" ? ` · ${labels.status}` : ""}
          </p>
          <h3 className="display text-4xl leading-[0.95] md:text-5xl">{event.title}</h3>
          <p className="text-sm text-muted-dark">{event.venue}</p>
          <p className="text-bone/80">{event.description}</p>
        </div>
        {!past ? (
          <ButtonLink
            href={event.registrationUrl ?? enquireHref}
            variant={event.registrationUrl ? "primary" : "secondary"}
            arrow
            className="w-fit text-ivory"
          >
            {event.registrationUrl ? labels.register : labels.enquire}
          </ButtonLink>
        ) : null}
      </div>
    </article>
  );
}

/** Elegant empty state shown when no events are scheduled. */
export function EventsEmpty({
  title,
  text,
  cta,
}: {
  title: string;
  text: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="relative overflow-hidden border border-hairline p-10 md:p-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_80%_at_100%_0%,rgb(184_134_59/0.18),transparent_70%)]"
      />
      <div className="relative flex flex-col gap-5">
        <p className="display text-section text-gold-light">{title}</p>
        <p className="max-w-lg font-serif text-lede text-bone/85 italic">{text}</p>
        {cta ? (
          <ButtonLink href={cta.href} variant="secondary" arrow className="w-fit text-ivory">
            {cta.label}
          </ButtonLink>
        ) : null}
      </div>
    </div>
  );
}
