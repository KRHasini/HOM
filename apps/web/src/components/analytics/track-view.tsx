"use client";

import { useEffect, useRef } from "react";

import { type AnalyticsEvent, type AnalyticsParams, track } from "@/lib/analytics";

/** Fires one analytics event per page view (e.g. class_viewed). */
export function TrackView({ event, params }: { event: AnalyticsEvent; params?: AnalyticsParams }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, params);
  }, [event, params]);
  return null;
}
