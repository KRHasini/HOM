# Replacing photos and videos

Drop a file at the path below and it is used automatically on the next build — no code
changes. Until a file exists, the site shows an art-directed ink-and-gold placeholder.
Append `?placeholders=1` to any URL in development to list every slot on that page that
still needs real media (red = missing, gold = stock stand-in).

After adding or replacing images run:

```bash
pnpm media:optimize   # resizes oversized originals, records sizes + blur previews
pnpm content:export   # only if you also edited content files (refreshes the DB seed)
```

## Slots

| Path | Used for | Recommended |
| --- | --- | --- |
| `hero/hero.mp4` + `hero/hero.webm` | Home hero loop | 1920×1080, 10–20 s, **no audio**, < 6 MB (H.264 MP4 + VP9 WebM) |
| `hero/hero-poster.jpg` | First frame shown instantly | 1920×1080 JPG, < 250 KB |
| `classes/{slug}/cover.jpg` | Class card, showcase, class hero | 2400 px long edge, portrait 3:4 works best |
| `classes/{slug}/gallery-1.jpg` … `gallery-3.jpg` | Class page "In the studio" | 1600–2400 px, portrait 3:4 |
| `instructors/vignesh-k.jpg` | Founder portrait (home, about, instructors) | Portrait 4:5, ≥ 1600 px tall |
| `instructors/{slug}.jpg` | Other instructors | Portrait 4:5, ≥ 1200 px tall |
| `gallery/photo-NNN.jpg` | Gallery grid + home strip | 1600–2400 px, any orientation |
| `gallery/video-NNN.mp4` / `.webm` / `-poster.jpg` | Gallery video tiles | 1280×720, 8–15 s, no audio, < 3 MB |
| `about/studio-1.jpg`, `studio-2.jpg`, `studio-3.jpg` | About page, trial page | 2400 px long edge |
| `events/{name}.jpg` | Event cards | 16:10, ≥ 1600 px wide |

Class slugs: `bharatanatyam`, `western-hip-hop`, `contemporary`, `bollywood`, `free-style`,
`gymnastics`, `yoga`, `zumba`.

New gallery items or events also need an entry in `src/content/gallery.ts` /
`src/content/events.ts` (caption, category, alt text).

## Video encoding (ffmpeg)

```bash
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=24" -c:v libx264 -preset slow -crf 26 \
  -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i source.mov -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -b:v 0 -crf 38 hero.webm
ffmpeg -i hero.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```

Images: high contrast with warm highlights suits the brand. Avoid text baked into photos.
Always have consent (a parent's or guardian's for minors) before publishing people.
