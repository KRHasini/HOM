/**
 * pnpm media:optimize
 *
 * 1. Downscales oversized images in public/media to MAX_EDGE (originals are kept in
 *    media-originals/, which is git-ignored) and re-encodes JPEGs with mozjpeg.
 * 2. Writes src/content/generated/media-manifest.json with intrinsic sizes and tiny
 *    blur placeholders, which next/image uses for zero-layout-shift, blurred loading.
 *
 * Next.js serves AVIF/WebP variants at request time, so originals stay JPEG/PNG.
 * `--check` exits non-zero when the manifest is out of date (used in CI).
 */
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const ORIGINALS_DIR = path.join(ROOT, "media-originals");
const MANIFEST = path.join(ROOT, "src", "content", "generated", "media-manifest.json");
const MAX_EDGE = 2400;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

type Manifest = Record<string, { width: number; height: number; blurDataURL: string }>;

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function optimize(file: string): Promise<boolean> {
  const image = sharp(file, { failOn: "none" });
  const meta = await image.metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (longest <= MAX_EDGE || ![".jpg", ".jpeg"].includes(path.extname(file).toLowerCase())) {
    return false;
  }
  const backup = path.join(ORIGINALS_DIR, path.relative(MEDIA_DIR, file));
  await mkdir(path.dirname(backup), { recursive: true });
  await copyFile(file, backup);
  const buffer = await sharp(backup)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();
  await writeFile(file, buffer);
  return true;
}

async function describe(file: string) {
  const image = sharp(file).rotate();
  const { width = 0, height = 0 } = await image.metadata();
  const blur = await sharp(file)
    .rotate()
    .resize(16, 16, { fit: "inside" })
    .modulate({ saturation: 0.8 })
    .webp({ quality: 40 })
    .toBuffer();
  return { width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
}

async function main() {
  const check = process.argv.includes("--check");
  const manifest: Manifest = {};
  let resized = 0;

  for await (const file of walk(MEDIA_DIR)) {
    if (!check && (await optimize(file))) resized += 1;
    const key = `/${path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/")}`;
    manifest[key] = await describe(file);
  }

  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  const next = `${JSON.stringify(sorted, null, 2)}\n`;

  if (check) {
    const current = await readFile(MANIFEST, "utf8").catch(() => "");
    if (current !== next) {
      console.error("media-manifest.json is out of date. Run `pnpm media:optimize`.");
      process.exit(1);
    }
    console.log("Media manifest is up to date.");
    return;
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, next);
  const total = Object.keys(sorted).length;
  const size = (await stat(MANIFEST)).size;
  console.log(
    `Optimized ${resized} image(s); manifest lists ${total} image(s) (${(size / 1024).toFixed(1)} KB).`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
