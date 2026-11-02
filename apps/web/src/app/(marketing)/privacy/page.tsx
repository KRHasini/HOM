import type { Metadata } from "next";

import { LegalDocument } from "@/components/sections/legal-document";
import { getLegal, getPage, getSite } from "@/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("privacy");

export const metadata: Metadata = buildMetadata(getSite(), { ...page.seo, path: "/privacy" });

export default function PrivacyPage() {
  const legal = getLegal();
  return (
    <LegalDocument
      eyebrow={page.hero.eyebrow}
      doc={legal.privacy}
      labels={{ draftNotice: legal.draftNotice, updated: legal.updatedLabel }}
    />
  );
}
