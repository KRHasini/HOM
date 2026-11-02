import { describe, expect, it } from "vitest";

import { site } from "@/content/site.config";
import { formatAddress, telHref, whatsappHref } from "@/lib/contact";

describe("contact links (derived from site.config only)", () => {
  it("builds tap-to-call from the E.164 number", () => {
    expect(telHref(site.phone.e164)).toBe("tel:+919742508862");
  });

  it("builds the WhatsApp link with the prefilled message", () => {
    expect(whatsappHref(site.whatsapp.number, site.whatsapp.prefill)).toBe(
      `https://wa.me/919742508862?text=${encodeURIComponent(site.whatsapp.prefill)}`,
    );
  });

  it("formats the address", () => {
    expect(
      formatAddress({
        line: "12 MG Road",
        locality: "Indiranagar",
        city: "Bengaluru",
        pincode: "560038",
      }),
    ).toBe("12 MG Road, Indiranagar, Bengaluru 560038");
  });
});
