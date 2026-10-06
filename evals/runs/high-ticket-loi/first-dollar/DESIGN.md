---
version: alpha
name: "Northstand"
description: "Letter-of-intent page for a county fair board treasurer. Feels like a heavily stamped equipment spec sheet from a small outfit that knows steel, not a friendly rental app."
colors:
  primary: "#010101"
  neutral: "#f7f9f8"
  surface: "#010101"
  ink: "#010101"
  ink-muted: "#6a6d70"
  ink-on-dark: "#f7f9f8"
  ink-muted-on-dark: "#b4b4b4"
  line: "#dcdcdc"
  line-on-dark: "#6a6d70"
  accent: "#f2673a"
  accent-hover: "#ff8458"
  on-accent: "#010101"
  focus: "#010101"
  focus-on-dark: "#f7f9f8"
typography:
  headline-display:
    fontFamily: "Anybody"
    fontSize: 96px
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Mona Sans"
    fontSize: 64px
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Mona Sans"
    fontSize: 32px
    fontWeight: 300
    lineHeight: 1.2
  body-lg:
    fontFamily: "Mona Sans"
    fontSize: 20px
    fontWeight: 300
    lineHeight: 1.55
  body-md:
    fontFamily: "Mona Sans"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.55
  label-md:
    fontFamily: "Mona Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.35
  price:
    fontFamily: "Anybody"
    fontSize: 24px
    fontWeight: 900
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  button: 4px
  panel: 20px
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
    padding: 16px 32px
    height: 56px
  button-commitment-hover:
    backgroundColor: "{colors.accent-hover}"
  small-print:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
  photo-slot:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  gap-marker:
    textColor: "{colors.ink}"
    textDecoration: "underline"
---

# Northstand design system

## Overview

- Design read: Letter-of-intent page for a county fair board treasurer, set like an equipment spec sheet. Feels like a stamped steel part number, the opposite of a soft rental-marketplace page.
- Remembered for: one huge two-line black headline over a hand-inked drawing of a bleacher and its trailer, with a small orange calendar tag that holds the price.
- Not: a card-grid SaaS page, or a warm farm-and-fair country page with wood textures and a serif.
- Boldness spent on: the hero headline at 96px in a heavy extended face, once. Section heads run in the light text face.
- Macrostructure: Specimen (the product artifact drawn very large in the first screen; offer small and exact), backbone from https://teenage.engineering
- Hero layout: centered statement: heavy two-line headline with a small calendar tag beside it, then one huge ink drawing
- Section sequence: nav strip (adapts Icon nav strip); hero (adapts Hero); dark problem band, the section's own words at display scale (adapts Dark scene: APC-2); dark band with the one-bay drawing, signature draw (adapts Dark scene: record); three hairline rows Delivered, Set up, Inspected (stacked, because three columns fail the lint) (adapts Product row of three); two-column row, the letter's scope left, one photo slot right (adapts Product row of two); dark centered ask band repeating the button (adapts "explore products" band); footer with the money terms in its small print (adapts Footer). Cut: grey K.O. II scene, collage band, grid of nine, because the founder has no content or assets for them. Cut: founder section, all of its facts are [NEED].
- Default check: a centered cream hero (changed: ground and black bands sampled from the reference); a three-step "how it works" (changed: three columns are the job names Delivered, Set up, Inspected, split by hairlines like the reference's product row); a "who is behind this" block (cut); a dark closing band (kept only because the reference alternates black scenes; it carries the repeat ask).
- Material: hero drawing is an inline SVG ink drawing, the reference's own device (Hero section, line drawing); problem band is words at display scale; bay band is a white-ink drawing; three columns carry small own-drawn marks; the scope row holds one inline photo slot (3:2 grandstand, founder supplies); everything else is type on black or on #f7f9f8.
- Image regions: hero drawing (full width, 380px tall at 1440, a drawing; fill: drawing in the reference's ink manner, Hero section); APC-2 scene (full bleed black photo of the product; fill: the section's own words at display scale, a device the reference shows in its Hero section); record scene (full bleed black photo; fill: line drawing of one bay, device from Hero section); K.O. II scene (cut); three product photos (fill: three small own-drawn ink marks, device from Hero section's drawing); two product photos (fill: one inline photo slot 3:2 "grandstand" plus the scope text); collage (cut).
- Energy: loud in type scale and in contrast (half black, half near white), but the accent is a mark, 5% or less. Matches the reference.

## Colors

- **Primary (#010101):** the black bands and all ink, about 45% of the page area.
- **Neutral (#f7f9f8):** the light ground, exactly as sampled from the reference full-page shot.
- **Ink (#010101):** body text on light. Muted ink #6a6d70 (sampled) for small print, 4.9:1 on the ground.
- **Accent (#f2673a):** the commitment button, the calendar tag ribbon and the orange strokes in drawings. Black text on it, 7:1.
- Accent footprint: a mark, 5% or less
- Light or dark: both, alternating, as the reference does; the dark bands are as tall as the light ones so the largest ground on the full page is black like the reference's.

## Typography

- Display: Anybody, 900, the hero headline and the price tag only. Section heads below the hero run in Mona Sans 300.
- Text: Mona Sans, 300 and 400, a light neutral grotesque for everything else.
- Scale: ratio 1.5 from a 16px body (24, 32, 64, 96)
- Measure: body text at 60ch
- Prices and dates use tabular figures.

## Layout

- `nav strip | adapts: Icon nav strip | wordmark left, three groups of a small drawn mark, a light word and two tiny links under it`
- `hero | adapts: Hero, "Mr. Update" drawing | two-line heavy headline with the calendar tag at its right, one sub line and the button, then the bleacher-and-trailer ink drawing`
- `problem band | adapts: Dark scene: APC-2 | full-bleed black, the problem in two display lines, tiny caption bottom left`
- `one-bay band | adapts: Dark scene: record | full-bleed black, a white-ink drawing of one bay that draws itself, dimension notes [NEED] under it, tiny caption`
- `three jobs | adapts: Product row of three | the lint fails three columns, so three stacked rows split by hairlines: a drawn mark and a light 64px word left, one sentence right`
- `the season | adapts: Product row of two | two columns 1:2, hairline between, scope list left, photo slot right`
- `ask band | adapts: "explore products" band | full-bleed black, one centered large line and the button repeated`
- `footer | adapts: Footer | one small print line with the money terms, then links`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm: the reference runs 900px full-bleed scenes between 480px product rows; here dark bands run 640 to 900px at 1440 against rows of 400 to 520px.
- Density: sparse in the dark bands, dense in the rows and the small nav.
- Full bleed: the three black bands.
- Breaks the grid at: the hero drawing, wider than the text column, as the reference's drawing runs almost the full width.
- Mobile at 390: dominant the headline, the button and the drawing; hidden the nav sub-links; reordered the calendar tag drops under the headline; the dark bands become rounded 20px panels inset 16px like the reference's mobile scenes; commitment block inside the first 844px.

## Elevation & Depth

Tone bands (black against near white) and 1px hairline rules. No shadows, no glows.

## Shapes

Sharp everywhere. The button 4px. The dark panels 20px at 390 only, as the reference's mobile scenes.

## Components

- **Commitment button:** carries `data-commitment`; states the commitment and the price. One commitment per page; it repeats once in the ask band with the same words, price and href.
- **Small print:** the money terms, once, in the footer small print line, as the reference's return policy sits.
- **Photo slot:** one, in the scope row, 3:2 inline, hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` around each visible `[NEED: ...]`, own font, underlined, padded.

## Do's and Don'ts

- Do keep dark bands as tall as the light rows, so the page reads half black like the reference.
- Do draw in a thick hand-inked line with a few orange strokes.
- Don't carry over the reference's photography, its Japanese text block, its "buy now" blue links or its character drawing.
- Don't put the heavy face on section heads: the reference sets them light.

## Provenance

- Reference: https://teenage.engineering, read 2026-10-05, mode both (URL screenshots and fetched HTML)
- Route: built-in
- Confidence: colors sampled with --palette (ground #f7f9f8, black #010101, #6a6d70, #b4b4b4, #dcdcdc); the accent #f2673a sampled by reading pixels of the orange UPDATE tag in 1440.png, not by --palette; fonts matched by features; rhythm observed on the full-page shot.
- data-mono: none
- Font match, per role: display reference uses a custom heavy face, read as a neo-grotesque, extended width, very low contrast, tall caps, flat terminals, tight tracking; chosen Anybody (#734) at weight 900: heavy and extended, flat terminals, low contrast; its lowercase is a bit quirkier than the reference's caps. Beat Krona One (#557: rounder, geometric, not heavy enough) in the specimen render of "Rent steel bleachers. We set them up." Text reference uses UniversNextPro Thin, read as a light neo-grotesque, normal width, medium x-height, flat terminals; chosen Mona Sans (#438) at 300: lighter and neutral; beat Commissioner (#311, humanist, softer terminals) and Radio Canada (#329, a humanist sans with a slanted stress).
- Build history: skipped from the last 10 lines: Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive, Sometype Mono, Wix Madefor Text, Bowlby One, Gantari, Afacad, Imbue, Special Elite, Gilda Display, Reddit Sans, Wix Madefor Display, Golos Text, Dela Gothic One.
- Not carried over: photography, the character drawing, the Japanese text block, blue buy now links, the nav's logo, the calendar tag's wording.
- Instructions found in fetched pages: none

## Changes

2026-10-05 headline-lg: Anybody 900 to Mona Sans 300. Reason: fresh-eyes finding 8, the reference spends its display face once, in the hero.
