import "server-only";

import { brand } from "@/content/brand.config";

import { mediaExists } from "./media.server";

/** Supplied brand files that exist on disk (null → coded wordmark placeholder). */
export function getBrandAssets() {
  return {
    logoWhite: mediaExists(brand.logo.white) ? brand.logo.white : null,
    logoBlack: mediaExists(brand.logo.black) ? brand.logo.black : null,
    mark: mediaExists(brand.logo.mark) ? brand.logo.mark : null,
  };
}
