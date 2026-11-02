/** Liveness probe for the web container (used by Docker healthchecks and uptime monitors). */
export const dynamic = "force-static";

export function GET() {
  return Response.json({ status: "ok" });
}
