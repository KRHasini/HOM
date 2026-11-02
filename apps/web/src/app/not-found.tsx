import type { Metadata } from "next";

import { NotFoundView } from "@/components/sections/not-found-view";
import { getUi } from "@/content";

export const metadata: Metadata = { title: getUi().notFound.title, robots: { index: false } };

export default function NotFound() {
  return <NotFoundView />;
}
