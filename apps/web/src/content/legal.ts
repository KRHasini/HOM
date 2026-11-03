/**
 * Privacy and terms copy. PLACEHOLDER legal text — TODO(confirm): have it reviewed by
 * a qualified professional before launch (DPDP Act 2023 for India).
 */
import type { z } from "zod";

import type { LegalSchema } from "./schema";
import { site } from "./site.config";

type LegalInput = z.input<typeof LegalSchema>;

export const legal = {
  privacy: {
    title: "Privacy Policy",
    updated: "2 November 2026",
    placeholder: true, // TODO(confirm): legal review
    intro: `${site.name} ("we", "us") respects your privacy. This notice explains what we collect through this website and how we use it.`,
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you send an enquiry or book a trial we collect the details you give us: your name, phone number, optional email address, the class you are interested in, preferred days and times, and any message.",
          "We also record how you found us (for example a campaign link or referring website) and a one-way hashed form of your IP address to prevent spam. We never store your raw IP address.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "Only to respond to your enquiry, arrange your trial class and, if you join, to manage your classes. We do not sell or rent your personal data.",
        ],
      },
      {
        heading: "Analytics and cookies",
        body: [
          "If enabled, we use privacy-friendly analytics only after you accept the cookie notice. You can decline and the site works fully.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Enquiries are kept only as long as needed to respond and for reasonable record keeping, after which they are deleted or anonymised.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask us to access, correct or delete your data at any time. Email ${site.email} or call ${site.phone.display} and we will act on your request.`,
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    updated: "2 November 2026",
    placeholder: true, // TODO(confirm): legal review
    intro: `These terms apply to your use of the ${site.name} website and to trial classes booked through it.`,
    sections: [
      {
        heading: "Trial classes",
        body: [
          "A trial booking is a request, confirmed by our team by phone or WhatsApp. Trial availability depends on batch capacity.",
        ],
      },
      {
        heading: "Health and safety",
        body: [
          "Please tell your instructor about any injury or medical condition before class. Participation is at your own risk; follow instructor guidance at all times.",
        ],
      },
      {
        heading: "Fees and payments",
        body: ["Fees, payment schedules and refund terms are shared on enrolment."],
      },
      {
        heading: "Photos and videos",
        body: [
          "We may photograph classes and performances. We will always ask for consent (from a parent or guardian for minors) before publishing identifiable images.",
        ],
      },
      {
        heading: "Website content",
        body: [
          `All content on this website belongs to ${site.name} unless stated otherwise and may not be reused without permission.`,
        ],
      },
    ],
  },
  registration: {
    text: "GSTIN: to be confirmed", // TODO(confirm): GST / business registration text
    visible: false,
  },
  draftNotice: "Draft — pending legal review.", // shown while `placeholder: true`
  updatedLabel: "Last updated",
  formConsent:
    "I agree to be contacted about my enquiry. My details are used only to respond — see our",
  cookie: {
    text: "We use optional analytics to understand what helps visitors. Nothing loads unless you accept.",
    accept: "Accept",
    decline: "Decline",
  },
} satisfies LegalInput;
