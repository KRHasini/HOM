import type { Metadata } from "next";

import { LegalDocument } from "@/components/sections/legal-document";
import { getLegal, getPage, getSite } from "@/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("terms");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/terms" });

export default function TermsPage() {
  const legal = getLegal();
  return (
    <LegalDocument
      eyebrow={page.hero.eyebrow}
      doc={legal.terms}
      labels={{ draftNotice: legal.draftNotice, updated: legal.updatedLabel }}
    />
  );
}
