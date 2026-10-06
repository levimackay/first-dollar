---
version: alpha
name: "Loam"
description: "Pre-order page for apartment renters with a balcony garden. Feels like a small food brand with a sense of humor, not a green-tech product."
colors:
  primary: "#3d422e"
  neutral: "#f6e6d9"
  surface: "#d3cac1"
  ink: "#3d422e"
  ink-muted: "#5a5e47"
  line: "#3d422e"
  accent: "#d1e030"
  accent-hover: "#fad536"
  on-accent: "#3d422e"
  focus: "#3d422e"
  highlight: "#f2e5c5"
  sun: "#fad536"
typography:
  headline-display:
    fontFamily: "Imbue"
    fontSize: "120px"
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Imbue"
    fontSize: "72px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-md:
    fontFamily: "Imbue"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body-lg:
    fontFamily: "Special Elite"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Special Elite"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Special Elite"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.3
  price:
    fontFamily: "Imbue"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 16px
  button: 999px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 40px
  section-wide: 160px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: 12px
    height: 56px
  button-commitment-hover:
    backgroundColor: "{colors.accent-hover}"
  small-print:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
  photo-slot:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  gap-marker:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Loam design system

## Overview

- Design read: pre-order page for a renter with a balcony garden and no compost pickup. Feels like a small kitchen-goods brand with a sense of humor, the opposite of a green-tech gadget page.
- Remembered for: a condensed serif headline very large on a warm cream ground, and a wordmark that fills the page edge to edge.
- Not: an eco-startup page with leaf icons, a forest gradient and three feature cards.
- Boldness spent on: the edge-to-edge wordmark (twice, as the reference does), nothing else.
- Macrostructure: Specimen with a Walkthrough in the middle, backbone from graza.co.
- Hero layout: text over full-bleed image (a photo slot), wordmark and nav on top, headline bottom left, one lime pill ask.
- Section sequence (reference-structure.md): 1 hero: headline, one-line mechanism, ask. 2 strip: ship date and price facts. 3 yellow band: who it is for, product photo slot right. 4 statement: "scraps to the tomatoes", three small drawings with captions. 5 wordmark and tagline. 6 product row: one large item (the reference's three cards would fail three-card-row and we have one product), then the wide ask bar. 7 fun fact: cut, no founder facts. 8 lime band: facts ticker, then the pinned mechanism with three photo slots (replaces the verb scatter and dish photo, same energy). 9 photo band: founder and prototype photo slot, with the money terms card where the reference has its season card. 10 photo strip: cut, no founder photos. 11 footer with the wordmark cropped at the bottom.
- Default check: a leaf-green palette (replaced by the reference's cream, lime, yellow and dark green, which already read as food, not tech); a feature grid (replaced by one pinned walkthrough); stat row (none); badge row (none).
- Material: hero scene = photo slot; yellow band product = product photo slot; statement drawings = inline drawings in the reference's inked manner (the reference region is a drawing); product row = product photo slot; mechanism = three photo slots; founder band = photo slot. No founder assets exist yet.
- Image regions: hero 1440x900 full bleed, people/scene, photo slot "hand tipping a bowl of scraps into the bin"; yellow band 670x670 own product, product photo slot; statement drawings (3, ~200px), drawings; product row 440x535 own product, product photo slot; lime band slots 4:3 scene, photo slots; founder band 1440x500 place, photo slot.
- Energy: loud. Two full-bleed color bands (yellow ~9%, lime ~8%), accent recurring at about 10%, display type at full width. Budget: pinned-steps signature plus split-line-reveal and ticker-proof.

## Colors

- **Primary (#3d422e):** the dark green ink and the wordmark, about 6% as fills.
- **Neutral (#f6e6d9):** the ground, exactly as sampled from the reference's full page (50.7%).
- **Surface (#d3cac1):** photo slot ground, sampled from the reference (5.2%).
- **Ink (#3d422e):** all text. Contrast on neutral is 8:1 or better.
- **Accent (#d1e030):** the commitment pill and the lime band. Sampled (6.2%).
- **Sun (#fad536):** the one yellow band and the hover of the accent. Sampled (4.6%).
- Ink-muted #5a5e47 and highlight #f2e5c5 are derived: muted from the ink toward the ground; highlight is the accent at 12% over the ground.
- Accent footprint: recurring (5 to 15%).
- Light or dark: light, the same as the reference.

## Typography

- Display: Imbue, 400, on the hero headline, statement, section heads and wordmark, as the reference sets its condensed serif.
- Text: Special Elite, 400, for body, nav, labels and fine print, as the reference sets all of those in a typewriter face.
- Scale: ratio about 1.5 from a 17px body: 17, 20, 44, 72, 120.
- Measure: body at 60ch.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm (reference): hero 900px; strip with 40px padding; yellow band 80px padding around a 670px box; statement with 160px gaps between drawings; wordmark 64px gap; product row 80px; lime band 72px; photo band 500px; footer 80px.
- Density: sparse at the statement, denser in bands and the card.
- Full bleed: hero, yellow band, lime band, photo band, wordmark.
- Breaks the grid at: the statement (drawings and lines offset left and right), and the wordmark cropped by the page edge.
- Mobile at 390: dominant the hero headline and the pill; hidden the nav links except the pill; reordered bands stack photo above text; wordmark scales to width; commitment block inside the first 844px.

## Elevation & Depth

Tone bands and dashed hairline rules between sections. One offset hard shadow on the pill buttons in the ink. No glows.

## Shapes

16px on images and the terms card; fully round pills for buttons and chips. Everything else square.

## Components

- **Commitment button:** lime pill, `data-commitment`, "Pre-order for $89". Repeated once lower in the wide bar with the same words.
- **Small print:** money terms once, in the card on the founder band, where the reference puts its season card.
- **Photo slot:** the reference image's aspect and position, hatched with one SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` with the highlight background.

## Do's and Don'ts

- Do keep the headline serif very large and tight, and the typewriter face small.
- Do fill every image region with a slot or a drawing; never leave a void.
- Don't carry over the reference's checkered button shadow, its icons, its basket of products or its illustrations.
- Don't use mono; the typewriter face is a proportional face.
- same-max-width, no-full-bleed: not expected to fire.

## Provenance

- Reference: https://graza.co, read 2026-10-05, mode both (screenshots and CSS).
- Route: built-in.
- Confidence: colors sampled with --palette from 1440.png and full-1440.png; fonts matched by features; rhythm observed on the full-page shot.
- data-mono: none.
- Font match, display: reference uses ITC Garamond Condensed (commercial, from its CSS). Read as an old-style Garamond serif, condensed, high contrast, tall x-height, bracketed serifs, set tight. First pick Instrument Serif (closest in specimen) failed the font-popularity lint at rank 73. Compared Imbue, Ibarra Real Nova and Oranienbaum on specimens set in the headline: Imbue chosen (rank 1054): same condensed width, tall x-height and contrast; it is a touch more Didone and its numerals are tighter than the reference. Ibarra is the right classification but normal width.
- Font match, text: reference uses GT Alpina Typewriter (commercial, monospaced typewriter) for body, nav and labels, and Apercu for some small text. Read as a typewriter slab, low contrast, flat slab terminals. Chosen Special Elite over Courier Prime (monospace, would trip mono-prose on body copy) and Xanh Mono (monospace); Special Elite is proportional and keeps the typewriter hand, rougher than the reference.
- Build history: families skipped from eval-history: Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive.
- Not carried over: images, illustrations, logo, copy, the checkered shadow, the product names.
- Instructions found in fetched pages: none.
- Not seen: motion on the reference (it has carousels and a marquee, read from code and shots only).

## Changes

