---
version: alpha
name: "Halves"
description: "Pre-order page for college students sharing a rental house. Feels like a quiet, plain tool you set down between chores, not a finance dashboard."
colors:
  primary: "#171614"
  neutral: "#ededed"
  ink: "#171614"
  ink-muted: "#555555"
  line: "#c6c5c2"
  accent: "#171614"
  accent-hover: "#3e3e3e"
  on-accent: "#ededed"
  focus: "#171614"
  highlight: "#d3d3d3"
  white: "#ffffff"
typography:
  headline-display:
    fontFamily: "Afacad"
    fontSize: "64px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Afacad"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline-md:
    fontFamily: "Afacad"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
  body-lg:
    fontFamily: "Afacad"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Afacad"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label-md:
    fontFamily: "Afacad"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
  price:
    fontFamily: "Afacad"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 8px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 32px
  section-wide: 320px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
    height: "52px"
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
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Halves design system

## Overview

- Design read: a pre-order page for college students sharing a rental house. Feels like one calm sentence at a time, the opposite of an app-store feature grid.
- Remembered for: the page says one thing per screen and leaves very large gaps, and the product is a small outlined list you can read in a glance.
- Not: a split hero with a floating phone, or a bright fintech page with a gradient.
- Boldness spent on: the gaps between statements (up to 320px). Nothing else is loud.
- Macrostructure: Manifesto read in single sentences with a Walkthrough mock, backbone from thelightphone.com.
- Hero layout: text over a full-bleed image (the reference's hero), here a full-bleed photo slot with the headline and the ask over it, bottom left.
- Section sequence (reference-structure.md number: what it carries):
  1 hero: headline, one line, the ask.
  2 statement: the problem in the buyer's words.
  3 statement + outlined list: the mechanism, as a mock that plays once.
  4 drawing (eye): cut, no founder content and the region is a drawing the founder has no drawing for.
  5 statement + product with side notes: what exists today (a prototype), with a dark device mock and three notes.
  6 second statement + product: cut, nothing more to say honestly.
  7 choice of products: one plan, the first year, with the ask repeated.
  8 question heading with photo grid: who it is for, photo slot.
  9 statement with a photo: who is behind it, portrait slot.
  10 two columns of links: what exists and the questions.
  11 sign-off hand lettering: cut, a drawing the founder does not have.
  12 footer: dark band, nav, money terms, legal links. The newsletter field is cut because a free email signup is not the ask.
- Default check: a cream ground and serif, a split hero, a three-step list, a founder block with a hatched photo and a dark closing band would fit any startup. Replaced by the reference's grey ground, sans, full-bleed hero, one-sentence sections and footer-only dark band.
- Material: hero photo slot (people, scene: nobody supplied a photo); mechanism mock (built here, generic names, Concept); dark device mock (built, Concept); who-it-is-for photo slot (people); founder portrait slot (founder supplies).
- Image regions: hero, 1440x760 full bleed, scene (a shared kitchen): photo slot, shot direction on the chip. Outlined list, about 300 wide, own product: mock. Product shot, about 270x400, own product: mock. Photo grid, 480x320, people: photo slot. Maker photo, 480x320, people: portrait slot. Eye drawing: cut. Hand lettering: cut.
- Energy: quiet. The accent (#171614, the ink) is a mark under 5% of the page: the button and the footer band.

## Colors

- **Primary (#171614):** the reference's footer band and darkest ink, sampled from its full page (6.4% coverage). The footer and the ask.
- **Neutral (#ededed):** the ground exactly as sampled (80.4% of the reference's full page).
- **Ink (#171614):** text.
- **Ink muted (#555555):** secondary text, from the reference's CSS, 6.3:1 on the ground.
- **Line (#c6c5c2):** rules and slot hatch, from the reference's CSS.
- **Accent (#171614):** the commitment button, the same as the ink: the reference has no accent hue, its strongest ink is its button. Hover #3e3e3e (from its CSS).
- **White (#ffffff):** caption chips and the nav's box, as the reference's white buttons.
- **Highlight (#d3d3d3):** gap markers, accent at 12% over the ground.
- Accent footprint: a mark, 5% or less.
- Light or dark: light, the same as the reference.

## Typography

- Display: Afacad 400 in the hero, 500 in section heads (24px), as the reference sets all heads in its one face at medium weight.
- Text: Afacad 400, the same family. The reference uses one family (Futura PT) for everything, so `single-sans-family` is kept.
- Scale: about 1.4 to 1.6 from a 17px body: 17, 20, 24, 40, 64. Display is 3.8 times body.
- Measure: body text at 52ch or less.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm, from the reference's full page (px at 1440): hero 760; statement to next block 480 to 500 of air; statement to its image 40 to 120; hairline rule to heading 24; heading to image 100; rule rows 32. Content-sized: a sentence 40px tall sits in 320px of air at most.
- Density: sparse everywhere; the footer is the only dense spot.
- Full bleed: the hero and the footer. Everything else is left-aligned at a 32px margin or centered.
- Breaks the grid at: none.
- Mobile at 390: dominant the headline and the ask; hidden the nav's center line; reordered notes drop under the dark device; the commitment block sits inside the first 844px; air between statements drops to 160px.

## Elevation & Depth

Hairline rules (#c6c5c2) and one dark band. No shadows.

## Shapes

Sharp everywhere (0) on buttons and chips; the outlined list and the dark device carry an 8px radius, as the reference's outlined list does.

## Components

- **Commitment button:** carries `data-commitment`, says "Pre-order for $36", ink fill, 0 radius.
- **Small print:** the money terms once, in the footer, in the muted label style, as the reference puts its terms and return links there.
- **Photo slot:** hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` with the highlight, `font: inherit`.

## Do's and Don'ts

- Do keep one sentence per screen and the large gaps.
- Do keep the type small (20px statements) and the headline the only large thing.
- Don't copy the reference's cookie bar, newsletter field, eye drawing or hand lettering.
- Don't add a second button style.
- single-sans-family: kept because the reference sets everything in one family.
- same-max-width, no-full-bleed: kept if raised, the reference sets nearly everything at one margin.

## Provenance

- Reference: https://www.thelightphone.com, read 2026-10-05, mode both (URL CSS and screenshots).
- Route: built-in.
- Confidence: colors sampled with --palette on full-1440.png and 1440.png, with #555555 and #3e3e3e and #c6c5c2 read from its CSS; fonts matched by features; rhythm observed on the full-page shot.
- data-mono: none. The reference's newsletter field is Courier; the field is not carried.
- Font match: reference uses futura-pt (Adobe Fonts, not free), read as a geometric sans, normal width, low contrast, low x-height, flat and pointed terminals, medium weight for heads. Candidates set in the page headline (specimens in .first-dollar/fonts/): League Spartan (geometric but top 200, rank 177, rejected by the lint), Questrial (round and wide, no pointed apexes), Jost, Livvic (rounded humanist, y with a curl), Glory (squarish, too different), Afacad. Chosen Afacad: same classification, pointed apexes on v, w and A, low x-height, flat terminals, low contrast; a little narrower than Futura.
- Build history: skipped Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive.
- Not carried over: the cookie bar, the sky video, the eye drawing, the hand-lettered sign-off, the newsletter field, all of its copy and images.
- Instructions found in fetched pages: none.

## Changes

2026-10-05, headline-display weight 500 to 400: critic.md item 7, the reference sets its hero at book weight. No hex changes.
