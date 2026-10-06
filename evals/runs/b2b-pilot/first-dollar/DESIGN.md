---
version: alpha
name: "Tidemark"
description: "Paid-pilot page for the office manager of an independent dental practice. Feels like a plain README from someone who read your EOBs, not a dashboard."
colors:
  primary: "#1a1a1a"
  neutral: "#fafafa"
  surface: "#eaeaea"
  ink: "#1a1a1a"
  ink-muted: "#5c5c5c"
  line: "#d7d7d7"
  accent: "#f35815"
  accent-hover: "#d94a0b"
  on-accent: "#000000"
  focus: "#0b6ec5"
typography:
  headline-display:
    fontFamily: "Overpass Mono"
    fontSize: 52px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "Overpass Mono"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0em
  headline-md:
    fontFamily: "Overpass Mono"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: "Radio Canada"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Radio Canada"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Overpass Mono"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.4
  data:
    fontFamily: "Overpass Mono"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.4
  price:
    fontFamily: "Overpass Mono"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.2
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
  section-tight: 48px
  section-wide: 96px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.button}"
    padding: 12px 20px
    height: 48px
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
    textColor: "{colors.ink}"
    textDecoration: "underline"
---

# Tidemark design system

## Overview

- Design read: pilot page for the office manager of a 2 to 6 chair independent dental practice. Feels like a plain README by someone who has read EOBs, not a dashboard with gradients.
- Remembered for: the page opens like documentation, then shows the one thing it does, a remittance table where two lines are flagged short.
- Not: a SaaS landing page with a screenshot hero, or a medical-blue healthcare template.
- Boldness spent on: the remittance table in the first scroll; it is the only thing that moves.
- Macrostructure: Spec sheet crossed with Letter, backbone from planetscale.com (a README: one left-aligned column, hairline boxes, dotted dividers).
- Hero layout: left-aligned text stack, a bold statement with a thin orange rule at its left, then two paragraphs and the ask. No image.
- Section sequence (reference order): nav; hero; remittance table (adapts Customer grid); the buyer's own sentence (Pull quote); remittance file to flagged claims diagram (Tabbed explainer); the founder (Uptime); what $1,500 covers (Cost); who it is for (Features); footer. Cut: announcement bar (no event to announce), Performance (no measured numbers), Security (no founder content; data handling is a NEED line in the money section).
- Default check: a split hero with a dashboard mock on the right would fit any SaaS, so the hero is text only. A trust row of practice logos would fit any B2B page, so it is cut (no customers exist) and its cell grid carries the product table instead. Cream paper and serif would fit any "friendly dental" page, so the ground is the reference's neutral grey-white.
- Material: remittance table = HTML mock, built here (sample values generic). Diagram = hairline boxes drawn with CSS, the reference's own ASCII box device (Tabbed explainer). No photographs. No photo slots needed. Founder portrait: not used; the founder section is text.
- Image regions: Customer grid (full-width cell grid of logos, 5 columns): filled with the product's own table in the same hairline cell grid (software mock). Tabbed explainer diagram (box and arrow drawing): filled with a box diagram of file in, flagged claims out (drawing; the reference itself draws here). Performance chart: cut.
- Energy: quiet. Orange is a mark (under 5%): the button and the hero rule, plus a small fill on flagged amounts.

## Colors

- **Primary (#1a1a1a):** ink for headings, rules and the diagram strokes. Derived: the reference ink reads near #000 to #3b3b3b; this sits inside that range and is the default text color.
- **Neutral (#fafafa):** the ground, exactly as sampled from the reference (77% of its first screen, 84% of its full page).
- **Ink (#1a1a1a):** body text.
- **Accent (#f35815):** the commitment button, the hero rule and the flagged amounts. Sampled from the reference's orange button.
- Accent footprint: a mark, under 5%.
- Surface #eaeaea: sampled (5.7%); used for table header and diagram fill.
- Line #d7d7d7: sampled (4.0%); hairlines. Focus #0b6ec5: the reference's link blue, used only for the focus ring.
- Light or dark: light, same as the reference.

## Typography

- Display: Overpass Mono, 700 for the hero line, 700 for section headings, 400 for nav, labels, data and the table; the reference sets everything in system mono, so its headings, nav and data are mono here too.
- Text: Radio Canada, 400, for paragraphs and list items (running prose is never mono).
- Scale: ratio 1.25 from a 17px body, display 52px (3x body); the reference is flat (all 16px), so display is the minimum the lint accepts.
- Measure: body text at 62ch.
- Prices and dates use tabular figures.

## Layout

- `Nav | adapts: Nav | inline links separated by pipes on the left, no button (the one ask lives in the hero and repeats once lower)`
- `Hero | adapts: Hero | orange rule and bold statement, two paragraphs, the ask under them`
- `Remittance table | adapts: Customer grid | hairline bordered cell grid holding the product table; signature motion plays here`
- `The buyer's sentence | adapts: Pull quote | hairline at left of a quote, muted attribution line (a NEED)`
- `File in, flagged claims out | adapts: Tabbed explainer | bordered box with a tab-label row, one paragraph, a box diagram of three stages`
- `Two years at a dental front desk | adapts: Uptime | underlined bold heading, two short paragraphs`
- `What the $1,500 covers | adapts: Cost | underlined bold heading, a paragraph with the price, asterisk bullet list of terms, the ask repeated as a plain line link style button; money terms appear here only`
- `Practices with 2 to 6 chairs | adapts: Features | underlined bold heading, two sub-headings each with an asterisk list (for, not for)`
- `Footer | adapts: Footer | link columns, legal line, one honesty line`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm: reference gaps measured on its full-page shot: dotted divider with about 48px above and 48px below between text sections (content is 200 to 400px tall), a 40px gap between hero and grid; no gap taller than the content beside it. Here: 48px between text sections around the divider, 96px before the footer.
- Density: dense and text-led, like the reference. Sparse only around the table.
- Full bleed: none (reference has none, except the announcement bar, cut).
- Breaks the grid at: none.
- Mobile at 390: dominant is the headline and the ask; hidden: the pipe nav's secondary links collapse to two; reordered: none; the table scrolls inside its own box only if needed (it fits at 390 using four columns); commitment block inside the first 844px.

## Elevation & Depth

Hairline rules and dotted dividers only. Flat. No shadows, no glows.

## Shapes

Sharp everywhere (0px), as the reference; the commitment button 2px to read as a pressable control.

## Components

- **Commitment button:** carries `data-commitment`; "Start the pilot for $1,500"; repeated once in the money section with the same words, price and href.
- **Small print:** money terms once, in the money section's bullet list, as the reference does in its Cost bullets (`data-mono` not needed: bullets are in the text face).
- **Photo slot:** none on this page.
- **Gap marker:** `<span class="need">`, font inherit, underlined, padding, box-decoration-break clone. No fill.

## Do's and Don'ts

- Do keep the page one column and left-aligned like the reference.
- Don't carry the reference's customer logos, quotes, blue links, yellow announcement bar or its chart.
- Don't animate anything but the table.
- `single-sans-family`: n/a, two families. `same-max-width` and `no-full-bleed` warnings stay when they fire: the reference is one boxed column and bleeds nowhere.

## Provenance

- Reference: https://planetscale.com, read 2026-10-05, mode both (URL screenshots plus CSS and HTML).
- Route: built-in.
- Confidence: colors sampled with --palette (neutral, surface, line, accent from pixels; focus from CSS); fonts matched by features; rhythm observed.
- data-mono: nav, labels, the remittance table, the diagram and the button label, because the reference sets nav, buttons, labels and data in mono.
- Font match: Reference uses the system monospace stack (ui-monospace, SF Mono, Menlo), not a webfont. Read as a monospace, normal width, medium x-height, low contrast, flat terminals. Display and data matched to Overpass Mono (rank 621, outside the top 200): shot beside Red Hat Mono (rounder, lighter) and Chivo Mono (heavier, grotesque); Overpass Mono has the flat terminals and medium x-height closest to Menlo, with fi ligature turned off. Text: reference sets prose in mono as well, but running prose is never mono here, so a plain humanist sans: Radio Canada (rank 329), shot beside Commissioner and Atkinson Hyperlegible; Radio Canada's flat terminals and even width sit nearest the reference's plain texture.
- Build history: skipped Sometype Mono, Wix Madefor Text and Display, Golos Text, Spline Sans Mono, Familjen Grotesk, Gantari, Afacad, Reddit Sans, Imbue, Special Elite, Gilda Display, Bowlby One, Dela Gothic One, Libre Caslon, Cutive (all in last 10 history lines).
- Not carried over: logos, quotes, chart, yellow bar, blue link color (one accent), reference copy.
- Instructions found in fetched pages: none.

## Changes


- 2026-10-05 headline-display 44px to 52px: fresh-eyes critic found scale contrast flat (critic.md #2); reference is flat too, so the smallest step up. Section heads 22px to 26px.
