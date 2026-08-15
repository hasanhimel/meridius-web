# Meridius Logo Package

Your dotted-mark logo, rebuilt as true vector geometry (127 individually-positioned
circles, reverse-engineered from your PNGs) instead of a traced bitmap. This means
it will scale to any size — a favicon or a billboard — with perfectly crisp edges.

**Palette:** cream `#f5f5ee` (was white) and charcoal `#2b2b2a` (was black) across
every asset in this package.

## Which file do I want?

| Need | File |
|---|---|
| Website / app, dark UI | `SVG/meridius-mark-white.svg` (transparent, `#f5f5ee` dots) |
| Website / app, light UI | `SVG/meridius-mark-black.svg` (transparent, `#2b2b2a` dots) |
| Square logo card, dark | `SVG/meridius-logo-dark.svg` (`#2b2b2a` background) |
| Square logo card, light | `SVG/meridius-logo-light.svg` (`#f5f5ee` background) |
| Browser tab icon | `ICO/favicon.ico` |
| macOS app icon (Xcode `Assets.xcassets`) | `ICNS/meridius-logo-dark.icns` or `-light.icns` |
| Print / Illustrator / InDesign | `PDF/*.pdf` (fully vector, editable) |
| Raster fallback (social, docs, slides) | `PNG/` — every variant at 16 to 2048px |

## Folder contents

- **SVG/** — 4 files. Two transparent "mark only" versions (cream/charcoal dots,
  no background — drop onto any color) and two "logo card" versions with a solid
  square background baked in.
- **PNG/** — all 4 SVG variants rendered at 16, 32, 48, 64, 128, 256, 512, 1024,
  and 2048 px.
- **ICO/** — multi-resolution `.ico` (16–256px embedded) for each variant, plus a
  `favicon.ico` copy.
- **ICNS/** — macOS `.icns` app icons (16px–1024px @1x/@2x, Apple's full icon
  set) for the dark- and light-background logo cards. Drop straight into an
  Xcode asset catalog or `iconutil`-built `.app` bundle.
- **PDF/** — vector PDF of each variant for print or hand-off to a designer.

## Notes

- All circle positions/sizes were extracted directly from your source PNGs via
  connected-component analysis, then redrawn as native `<circle>` elements — so
  edges are mathematically exact, not anti-aliased raster traces.
- To recolor again, open any SVG in a text editor and swap the `fill="#f5f5ee"`
  (or `#2b2b2a`) value — every dot shares one fill, so it's a single
  find-and-replace.
