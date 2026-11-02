import { render, screen } from "@testing-library/react";
import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { SmartImage } from "@/components/media/smart-image";
import { ClassCard } from "@/components/sections/classes/class-card";
import { ButtonLink } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ResolvedImage } from "@/lib/media";

const withMotion = (ui: ReactNode) => render(<LazyMotion features={domAnimation}>{ui}</LazyMotion>);

const missing: ResolvedImage = {
  src: "/media/instructors/x.jpg",
  alt: "Portrait",
  width: 1600,
  height: 2000,
  motif: "portrait",
  exists: false,
  stock: false,
  path: "/media/instructors/x.jpg",
};

describe("media", () => {
  it("renders the art-directed placeholder when a file is missing", () => {
    const { container } = render(<SmartImage image={missing} sizes="100vw" />);
    const slot = container.querySelector("[data-placeholder]");
    expect(slot).toHaveAttribute("data-placeholder", "/media/instructors/x.jpg");
    expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
  });

  it("marks decorative placeholders as hidden from assistive tech", () => {
    const { container } = render(<MediaPlaceholder motif="leap" path="/media/a.jpg" />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });
});

describe("ButtonLink", () => {
  it("opens external links safely in a new tab", () => {
    render(<ButtonLink href="https://wa.me/919742508862">WhatsApp</ButtonLink>);
    const link = screen.getByRole("link", { name: "WhatsApp" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps tel: links in the same tab", () => {
    render(<ButtonLink href="tel:+919742508862">Call</ButtonLink>);
    expect(screen.getByRole("link", { name: "Call" })).not.toHaveAttribute("target");
  });
});

describe("SubmitButton", () => {
  const labels = { idle: "Send", loading: "Sending…", success: "Sent" };

  it.each([
    ["idle", "Send", false],
    ["loading", "Sending…", true],
    ["success", "Sent", true],
  ] as const)("renders the %s state", (state, text, disabled) => {
    withMotion(<SubmitButton state={state} labels={labels} />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(text);
    expect(button.hasAttribute("disabled")).toBe(disabled);
  });
});

describe("ClassCard", () => {
  it("links to the class with its name, tagline and confirmed meta only", () => {
    render(
      <ClassCard
        index={0}
        sizes="100vw"
        item={{
          slug: "yoga",
          name: "Yoga",
          tagline: "Balance and serenity",
          href: "/classes/yoga",
          cover: missing,
          accent: "#8A9A78",
          accentContrast: "#0B0B0C",
          accentOnDark: "#8A9A78",
          treatment: "calm-cream",
          meta: ["Teens · Adults", "All levels"],
        }}
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/classes/yoga");
    expect(screen.getByRole("heading", { name: "Yoga" })).toBeInTheDocument();
    expect(screen.getByText("Teens · Adults")).toBeInTheDocument();
  });
});
