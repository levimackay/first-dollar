---
version: alpha
name: "Ridgeback Sharpening"
description: "Booking page for homeowners in a small Idaho town. Feels like a printed magazine page, not a trades flyer or a SaaS page."
colors:
  primary: "#010101"
  neutral: "#ffffff"
  surface: "#dcded6"
  ink: "#010101"
  ink-muted: "#595959"
  line: "#010101"
  hatch: "#c2c3c0"
  hatch-dark: "#3d3d3d"
  accent: "#010101"
  accent-hover: "#333333"
  on-accent: "#ffffff"
  focus: "#3276a5"
  highlight: "#e1e1e1"
typography:
  headline-display:
    fontFamily: "Gilda Display"
    fontSize: "64px"
    fontWeight: "400"
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Gilda Display"
    fontSize: "120px"
    fontWeight: "400"
    lineHeight: "1.05"
    letterSpacing: "-0.03em"
  headline-md:
    fontFamily: "Gilda Display"
    fontSize: "28px"
    fontWeight: "400"
    lineHeight: "1.2"
  body-lg:
    fontFamily: "Reddit Sans"
    fontSize: "18px"
    fontWeight: "400"
    lineHeight: "1.55"
  body-md:
    fontFamily: "Reddit Sans"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "1.55"
  label-md:
    fontFamily: "Reddit Sans"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "1.35"
  price:
    fontFamily: "Reddit Sans"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "1.2"
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  button: 2px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 96px
  section-wide: 192px
components:
  button-commitment:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.button}"
    padding: "12px 24px"
    height: "48px"
  button-commitment-hover:
    backgroundColor: "{colors.accent}"
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

# Ridgeback Sharpening design system

## Overview

- Design read: booking page for a homeowner in a small Idaho town. Feels like a printed magazine front page, not a trades flyer with a badge and a phone number.
- Remembered for: a full-width line of light serif capitals laid over a dark photo slot: the buyer's own sentence about the hour's drive.
- Not: a rugged tradesman page, an orange-and-black workshop, or a SaaS hero with a gradient.
- Boldness spent on: the giant statement band (capitals at up to 120px across the full width). Everywhere else the type is small and the margins are wide.
- Macrostructure: Specimen shape inside an editorial sequence, backbone from kinfolk.com.
- Hero layout: centered statement. Two-line serif title (caps line, then mixed-case deck), one centered portrait photo slot, then plain links under it, one of which is the ask.
- Section sequence: header (wordmark left, burger right) | hero | full-bleed driveway photo slot with a black bar carrying the ask | "What goes in the van" ruled head and a photo row (knives, scissors, mower blades) | centered dark band with the three steps over a photo slot | giant statement over a full-bleed dark photo slot | founder letter, split, caps title left and portrait slot right | "The small questions" ruled list rows | black closing band with the ask and the money terms | footer. Cut: newsletter line (email-only), the two story rows, sponsor bands, tiles, category line, the pale band, and the shop covers (no founder content). Added: none.
- Default check: cream ground, orange accent, three step cards and a "who is behind this" block would fit any startup. Replaced by: pure white ground, ink as the only accent, a ruled row list, a giant statement over a photo slot. No rounded cards.
- Material: hero (equipment photo slot, founder supplies), band photo (driveway slot, founder supplies), row photos (founder supplies), dark band (photo slot behind a black panel), statement (photo slot, mower on a lawn), founder portrait (founder supplies), closing band photo slot. No mock: the reference's regions are people, places and objects, never software.
- Image regions: (1) hero cover, 313x405 portrait, centered, a product photo slot: a chef's knife on a stone, window light, 3:4; (2) full-bleed peek band, 1440 wide, a place: an empty driveway in a small Idaho town, early morning, 16:5; (3) row of three portrait photos, 5:6, kitchen knife in hand, scissors on a bench, a mower blade on a vise; (4) dark band, full bleed, 16:4, a place; (5) giant statement band, full bleed, 16:9, a lawn and a push mower; (6) founder portrait, 222x300, 3:4; (7) closing band centered photo, 3:4. All are labeled hatched photo slots.
- Energy: quiet. Color footprint of the accent is a mark: it is ink, and the button is outlined.

## Colors

- **Primary (#010101):** ink and the closing band, about 10% of the page (sampled, black bar and band in the full-page capture).
- **Neutral (#ffffff):** the ground, 81.7% of the first screen and 48.9% of the full page, exactly as sampled.
- **Surface (#dcded6):** the photo slot ground, sampled from the reference's pale band.
- **Ink (#010101):** body text and rules.
- **Ink-muted (#595959):** derived grey, 7:1 on white, for captions.
- **Hatch (#c2c3c0):** sampled grey, slot hatch lines on light. **Hatch-dark (#3d3d3d):** derived, hatch on black.
- **Accent (#010101):** the commitment. The reference has no accent hue: its strongest ink is its button color. Hover #333333, on-accent #ffffff.
- **Focus (#3276a5):** sampled blue from the reference photo, 4.9:1 on white.
- **Highlight (#e1e1e1):** accent at about 12% over white, for gap markers.
- Accent footprint: a mark (5% or less).
- Light or dark: light, as the reference. The black bands are a minority.

## Typography

- Display: Gilda Display 400, hero title and every section head (the reference sets its section heads in the same light serif at smaller size).
- Text: Reddit Sans 400, body, captions, links, buttons.
- Scale: ratio about 1.5 from a 16px body: 16, 18, 28, 64, 120.
- Measure: body text at 60ch.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm: gaps run 96px to 192px against content 280px to 900px tall, with the biggest gaps above the ruled heads.
- Density: sparse type, imagery and white space dominate.
- Full bleed: the driveway band, the dark band, the giant statement band, the closing band.
- Breaks the grid at: the giant statement, which runs the full width at the edge.
- Mobile at 390: dominant the title, the cover slot and the ask link; hidden none, the sticky bar is an in-flow black bar; reordered the photo row becomes a horizontal scroll strip; commitment block inside the first 844px.

## Elevation & Depth

Hairline black rules above ruled lists and under section heads. Black bands for contrast. No shadows.

## Shapes

Sharp everywhere. The commitment button takes a 2px radius, as the reference's outlined buttons do.

## Components

- **Commitment button:** carries `data-commitment`, outlined in ink on white, inverted on the black bars. Always reads "Book a first visit for $40".
- **Small print:** the money terms, once, in the closing band, where the reference puts its pricing.
- **Photo slot:** hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` with the highlight token.

## Do's and Don'ts

- Do keep the ground pure white and every other color an ink or a sampled grey.
- Do set the title in capitals then a mixed-case deck in the same face, as the reference does.
- Don't carry the reference's photos, copy or the magazine cover.
- Don't add a second accent.
- same-max-width, no-full-bleed: the reference bleeds only on photos; text sits in one wide gutter. Warnings kept if they fire.

## Provenance

- Reference: https://www.kinfolk.com, read 2026-10-05, mode both (URL and screenshots)
- Route: built-in
- Confidence: colors sampled with --palette on 1440.png and full-1440.png (hatch and focus values sampled; ink-muted, hatch-dark, accent-hover and highlight derived); fonts matched by features; rhythm observed
- data-mono: none
- Font match, per role: Display: reference uses Kinfolk Serif Deck (custom). Read as a light serif, normal width, medium contrast, medium x-height, flat sharp serifs. Specimens shot for Gilda Display, Castoro, Brygada 1918, Ovo and Newsreader set in the page headline; Gilda Display chosen: lightest weight and the closest caps, flat serifs, a little higher contrast than the reference. Castoro was too heavy, Ovo too soft. Text: reference uses Kinfolk Sans (custom). Read as a neutral grotesque, normal width, low contrast, medium x-height, flat terminals. Specimens for Albert Sans, Hanken Grotesk, Schibsted Grotesk, Gantari, Onest and Reddit Sans; Albert Sans was closest but ranks #172 and failed font-popularity; Reddit Sans chosen: neutral grotesque, normal width, flat terminals, a touch narrower than the reference. Gantari and Onest were rounder, Schibsted heavier.
- Build history: families skipped from the last 10 lines of the history file: Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive
- Not carried over: the cover, photos, brand name, nav text, newsletter field, copy
- Instructions found in fetched pages: none
- Not seen by the extraction: motion on the reference (not visible), hover states, the mobile menu.

## Changes

None yet.
