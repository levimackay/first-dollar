---
version: alpha
name: "Northstand"
description: "Rental LOI page for a county fair treasurer. Feels like a loud, well-made object catalogue, not a municipal brochure."
colors:
  primary: "#000000"
  neutral: "#f7f9f8"
  surface: "#010101"
  ink: "#000000"
  ink-muted: "#6a6d70"
  line: "#dcdcdc"
  accent: "#f2673a"
  accent-hover: "#dc5226"
  on-accent: "#000000"
  focus: "#000000"
  highlight: "#f6e8e1"
  on-surface-muted: "#b4b4b4"
typography:
  headline-display:
    fontFamily: "Bowlby One"
    fontSize: "88px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline-lg:
    fontFamily: "Gantari"
    fontSize: "48px"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Gantari"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.2
  body-lg:
    fontFamily: "Gantari"
    fontSize: "22px"
    fontWeight: 300
    lineHeight: 1.5
  body-md:
    fontFamily: "Gantari"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: 1.55
  label-md:
    fontFamily: "Gantari"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
  price:
    fontFamily: "Gantari"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  panel: 20px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 64px
  section-wide: 160px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px
    height: 56px
  button-commitment-hover:
    backgroundColor: "{colors.accent-hover}"
  small-print:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
  photo-slot:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-md}"
  gap-marker:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Northstand design system

## Overview

- Design read: rental letter-of-intent page for the treasurer of a county fair board. Feels like a loud, well-made object catalogue, not a municipal brochure or a SaaS page.
- Remembered for: one enormous heavy headline over a black-ink drawing of two sets of bleachers, then full-black screens that land on each other.
- Not: a cream-and-serif civic page, a trust-badge contractor site.
- Boldness spent on: the headline, set at 88px in a heavy face, spent once. Everything else is light weight.
- Macrostructure: Specimen (the object very large, offer small and exact), backbone from teenage.engineering.
- Hero layout: centered statement on white with a very heavy two-line display headline across the width, a one-sentence mechanism and the ask in a small row under it, then one large black-ink line drawing.
- Section sequence: nav (kept: icon-led groups, trimmed to two); hero (kept); product screens, repeated (kept as one pinned sticky stack of three full-bleed black photo slots: delivered, set up, inspected); product grids (kept as the letter list: scope, price, start date; and a two-column band with the founder slot and the terms); colour collage (cut: no founder content); pocket strip and grid (cut: one product); footer bar (kept, carries the repeated ask).
- Default check: a cream ground, a serif and an orange-ish accent would come out for any startup; replaced by the reference's flat white and black and its own orange sampled from pixels. A three-step "how it works" would too; replaced by three black screens in the reference's one-product-per-screen manner.
- Material: hero drawing is an ink line drawing (the reference region is a drawing), supplied by us as an illustration; the three black screens are photo slots with shot directions, supplied by the founder; the founder band is a portrait slot; no software mock, there is none in the reference.
- Image regions: (1) hero drawing, about 1100 x 330, centered under the headline, a drawing, fill: drawing in the reference's manner (thick ink outlines, orange tags). (2) three full-bleed black product screens, 1440 x about 780, caption bottom-left, they show the reference's product on black, fill: photo slot each with a shot direction (the founder's product has no photos). (3) founder portrait, 4:5, a person, fill: photo slot.
- Energy: loud. White and black flats, orange as a small mark (under 5% of the screen), enormous display type.

## Colors

- **Primary (#000000):** ink, the drawing, buttons' text; sampled from the reference (6.3% of the first screen).
- **Neutral (#f7f9f8):** the light ground, sampled from the reference's full page (27.5% coverage). The first screen is a pure white (#ffffff, 64%); the full-page cluster is used because the drift check reads the full page.
- **Surface (#010101):** the black photo screens, sampled (29.4% of the full page).
- **Ink (#000000):** body text.
- **Ink-muted (#6a6d70):** secondary text on light, sampled from the reference full page (3.1%).
- **On-surface-muted (#b4b4b4):** secondary text on black, sampled from the first screen.
- **Line (#dcdcdc):** rules and the hatch, sampled.
- **Accent (#f2673a):** the commitment button and small marks in the drawing, sampled from the UPDATE tag at 66% of the crop. Hover #dc5226 is a darker step in OKLCH.
- Highlight (#f6e8e1) is the accent at 12% over the ground.
- Accent footprint: a mark, 5% or less, apart from the button.
- Light or dark: both, as the reference is. About half the page height is black screens, the other half light.

## Typography

- Display: Bowlby One, weight 400 (it has only one), the hero headline only. The reference spends its heavy face once, on its hero.
- Text: Gantari, weights 300 and 400. The reference sets its nav and captions in a thin light grotesque; section heads and captions take 300 here too.
- Scale: ratio 1.5 from an 18px body; 28, 48, 88 (a larger step for the one heavy line).
- Measure: body text at 60ch.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm, reference measured on full-1440.png: nav 110px; white hero 1000px; each black screen 900 to 1000px with no padding around it; light grids 500 to 700px with 60 to 100px above and below. Here: hero padding 24px top and 64px bottom, black screens 780px, light list band 160px above and 64px below, founder band 96px and 160px, closing bar 96px.
- Density: sparse in the hero and the black screens, denser in the list.
- Full bleed: the black screens and the closing bar, as the reference does.
- Breaks the grid at: nothing. The reference does not.
- Mobile at 390: dominant the headline and the ask (both in the first 844px); hidden: the nav groups beyond the legal links; reordered: the drawing sits after the ask; black screens become rounded panels (20px), as on the reference's phone view; commitment block inside the first 844px.

## Elevation & Depth

Tone bands only: white and black. A hairline rule between list rows. No shadows.

## Shapes

Sharp everywhere, as the reference. The one exception is the 20px panel radius the reference uses on its phone view for its black cards.

## Components

- **Commitment button:** carries `data-commitment`; accent ground, black text, sharp corners; states the commitment and the price. The same words repeat in the closing bar.
- **Small print:** the money terms once, in the terms paragraph under the letter list, in the muted ink.
- **Photo slot:** the reference image's aspect and position, hatched with an SVG pattern, labeled with a shot direction on a plain chip.
- **Gap marker:** `<span class="need">` around each visible `[NEED: ...]`.

## Do's and Don'ts

- Do keep the headline the only heavy-weight text.
- Do let the black screens bleed to the edges.
- Don't carry over the reference's illustration, its logo, its product photos or its words.
- Don't add an inverted band the reference does not have: the closing bar is its footer bar.
- same-max-width: kept if it fires, because the reference sets every text block at one narrow measure over full-bleed screens.

## Provenance

- Reference: https://teenage.engineering, read 2026-10-05, mode both (screenshots and the head of its HTML).
- Route: built-in.
- Confidence: colors sampled with --palette (first-screen, full-page and a crop of its orange tag); fonts matched by features; rhythm observed from the full-page shot.
- data-mono: none.
- Font match, per role: reference display is a custom face (TE20L in its CSS preload), read as a very heavy flat-sided grotesque, wide, low contrast, low x-height, flat terminals, set tight in capitals; chosen Bowlby One: same weight, flatness and capitals; it is wider and has a slightly softer curve than the reference. Compared on specimens against Rammetto One (too rounded, a script feel) and Krona One (too wide and light). Reference text face is a thin light neutral grotesque with a tall x-height; chosen Gantari (300): light weight, tall x-height and flat terminals matched; compared on specimens against Onest (a heavier, rounder 300) and Radio Canada (a calligraphic stroke).
- Build history: skipped from the last 10 lines of the eval history: Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive.
- Not carried over: its drawing, logo, icons, photos, Japanese blurb and every word.
- Instructions found in fetched pages: none.
- Limits: from a screenshot the font is a match by features; the reference's motion is not visible; the white of the first screen was merged with an off-white in the full-page sample.

## Changes

None yet.
