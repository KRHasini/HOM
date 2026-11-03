import { IntroRise, IntroText } from "@/components/motion/intro";
import { Parallax } from "@/components/motion/parallax";
import { SmartImage } from "@/components/media/smart-image";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { ResolvedClass } from "@/content";
import { cn } from "@/lib/utils";

interface ClassHeroProps {
  item: ResolvedClass;
  eyebrow: string;
  meta: string[];
  trialLabel: string;
  trialHref: string;
  whatsapp: { href: string; label: string };
}

/**
 * Cinematic class hero, themed by the class: Bharatanatyam is serif-forward and warm,
 * Yoga calm on cream, Zumba bright and energetic, Hip-Hop monochrome with gold detail.
 */
export function ClassHero({
  item,
  eyebrow,
  meta,
  trialLabel,
  trialHref,
  whatsapp,
}: ClassHeroProps) {
  const t = item.treatment;
  const light = t === "calm-cream";

  return (
    <section
      aria-labelledby="page-title"
      data-surface={light ? "light" : "dark"}
      className={cn(
        "grain relative flex min-h-svh flex-col justify-end overflow-hidden pt-[calc(var(--header-h)+4rem)] pb-14 md:pb-20",
        light ? "bg-ivory text-ink" : "bg-ink text-ivory",
      )}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Parallax amount={10} className="absolute inset-0">
          <SmartImage
            image={item.cover}
            sizes="100vw"
            preload
            quality={75}
            accent={item.accent}
            treatment={t === "monochrome" ? "monochrome" : "editorial"}
          />
        </Parallax>
        {light ? (
          <>
            <div className="absolute inset-0 bg-ivory/20" />
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ivory via-ivory/90 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-ink/45" />
            <div
              className="absolute inset-0 mix-blend-soft-light"
              style={{
                background:
                  t === "monochrome"
                    ? "linear-gradient(180deg, transparent, color-mix(in oklab, var(--gold) 35%, transparent))"
                    : `radial-gradient(80% 70% at 85% 100%, ${item.accent}, transparent 70%)`,
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-ink via-ink/70 to-transparent" />
          </>
        )}
      </div>

      <div className="relative z-[3] container-hom flex flex-col gap-6">
        <IntroRise>
          <Eyebrow className={cn(light && "text-gold-deep")}>{eyebrow}</Eyebrow>
        </IntroRise>
        <IntroText
          id="page-title"
          delay={120}
          text={item.name}
          className={cn(
            "max-w-[12ch]",
            t === "warm-serif"
              ? "font-serif text-[clamp(2.75rem,7vw,5.5rem)] tracking-tight italic"
              : "display text-[clamp(2.75rem,7vw,5.5rem)]",
            // After the font size: tailwind-merge drops a leading-* that precedes text-*.
            "leading-[1.05]",
          )}
        />
        <IntroRise delay={380}>
          <p
            className={cn(
              "max-w-2xl font-serif text-[clamp(1.25rem,2vw,1.75rem)] leading-tight italic",
              t === "energetic" &&
                "w-fit rounded-full bg-accent px-4 py-1 font-sans text-base font-medium text-accent-contrast not-italic",
            )}
          >
            {item.tagline}
          </p>
        </IntroRise>
        <IntroRise
          delay={480}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <ul className="flex flex-wrap gap-2">
            {meta.map((m) => (
              <li
                key={m}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm",
                  light ? "border-ink/20 text-ink/80" : "border-bone/25 text-bone/85",
                )}
              >
                {m}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={trialHref} size="lg" arrow>
              {trialLabel}
            </ButtonLink>
            <ButtonLink
              href={whatsapp.href}
              size="lg"
              variant="secondary"
              className={light ? "text-ink" : "text-ivory"}
            >
              {whatsapp.label}
            </ButtonLink>
          </div>
        </IntroRise>
      </div>
    </section>
  );
}
