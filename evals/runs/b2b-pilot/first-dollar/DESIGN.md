---
version: alpha
name: "Tidemark"
description: "Paid-pilot page for dental office managers. Feels like documentation you can read in a minute, not a dashboard pitch."
colors:
  primary: "#f35815"
  neutral: "#fafafa"
  surface: "#eaeaea"
  ink: "#111111"
  ink-muted: "#616161"
  line: "#d7d7d7"
  accent: "#f35815"
  accent-hover: "#b83a05"
  on-accent: "#111111"
  on-accent-hover: "#fafafa"
  focus: "#0b6ec5"
  link: "#0b6ec5"
  banner: "#fbcc0a"
  highlight: "#fff1a8"
typography:
  headline-display:
    fontFamily: "Sometype Mono"
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "Sometype Mono"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: "Sometype Mono"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.25
  body-lg:
    fontFamily: "Wix Madefor Text"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Wix Madefor Text"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Sometype Mono"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.3
  data:
    fontFamily: "Sometype Mono"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  price:
    fontFamily: "Sometype Mono"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 4px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 48px
  section-wide: 112px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 12px
    height: 48px
  button-commitment-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.on-accent-hover}"
  small-print:
    textColor: "{colors.ink-muted}"
    typography: "{typography.data}"
  photo-slot:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  gap-marker:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
---

# Tidemark design system

## Overview

- Design read: pilot-sale page for the office manager of an independent dental practice. Feels like a README you can trust, not a SaaS landing page.
- Remembered for: the page reads like documentation, and the one product picture is a plain table of claims with the underpaid ones marked.
- Not: a dental-blue clinic template, or a gradient dashboard pitch.
- Boldness spent on: the 44px mono headline with the orange rule at its left. Everything else is quiet.
- Macrostructure: Spec sheet leaning Letter, backbone from planetscale.com.
- Hero layout: left-aligned text stack in one column, orange rule at the headline, no image, not centered (as reference-structure.md item 3).
- Section sequence: 1 banner "Tidemark is not built yet"; 2 nav (inline links, pipes); 3 hero (headline, two paragraphs, the ask); 4 customer grid: cut, no customers exist; 5 pull quote: the buyer's sentence, with a [NEED] for its source; 6 sharded engines: "Claims paid under contract", a boxed three-part flow diagram (remittance file, contract fee, flagged claims); 7 performance: "Claim by claim", the Concept mock of the flag list with the signature motion; 8 uptime: "What the 90 days cover", prose and a bullet list of [NEED] terms; 9 cost: "$1,500, 90 days", the money terms once and the repeated ask; 10 security: "Your remittance files", bullets of [NEED] answers, no compliance claim; 11 features: cut, nothing is built; added (layout of the quote slot, after section 10): "Two years at the front desk", founder text and portrait photo slot; 12 footer in columns, legal strip.
- Default check: a cream ground and serif headline would fit any startup: replaced by the reference's flat #fafafa and mono. A three-step "how it works" would fit any startup: replaced by the reference's diagram-then-product-picture pair. A trust badge row: cut. Dental blue and teeth icons: not used.
- Material: banner text (founder facts); nav (text); hero (copy); buyer quote (founder's sentence); diagram (HTML and CSS boxes, drawn here); flag-list mock (HTML and CSS, Concept); terms lists ([NEED] from founder); founder section (founder name [NEED], photo slot); footer (links).
- Image regions: (a) customer logo grid, 5 by 12 cells, shows other companies' logos: dropped, no customers. (b) architecture diagram, bordered panel full column width, shows its own product architecture, a drawing in boxes and dashed lines: filled with a drawn flow of Tidemark's three parts in the same boxes and dashed lines. (c) product chart screenshot, bordered, full column width, its own product UI: filled with an HTML and CSS mock of the claims table, captioned Concept. (d) founder portrait (added): hatched photo slot, portrait 4:5.
- Energy: quiet. A single flat ground, accent (orange) on the button and little else, a yellow strip once. Accent footprint a mark.

## Colors

- **Primary (#f35815):** the one accent, sampled at the reference's nav button. Button only, plus the hero rule.
- **Neutral (#fafafa):** the ground, exactly as sampled, about 77% of the reference.
- **Surface (#eaeaea):** hover and photo-slot ground, sampled.
- **Ink (#111111):** body text and headings, the reference's gray-900.
- **Ink-muted (#616161):** fine print, gray-600 from its CSS.
- **Line (#d7d7d7):** rules and table borders, sampled.
- **Banner (#fbcc0a):** the yellow strip, sampled, once.
- **Highlight (#fff1a8):** gap markers, the reference's yellow-100.
- **Link (#0b6ec5):** links and focus ring, the reference's link blue, used only on text links.
- Accent footprint: a mark, under 5%.
- Light or dark: light, the same as the reference.

## Typography

- Display: Sometype Mono, 700, headline and section headings (the reference sets its headline and section heads in mono too).
- Text: Wix Madefor Text, 400, paragraphs. The reference sets prose in mono as well; the skill forbids mono prose, so only prose changes.
- Scale: ratio about 1.4 from a 16px body: 20, 28, 44.
- Measure: body text at 65ch.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm (estimated on full-1440.png): banner 40px; hero starts 64px under nav and runs about 240px of text; the grid follows 24px under the hero; each later section is separated by roughly 96 to 128px, with 24px between a heading and its prose.
- Density: sparse prose, dense bullet lists.
- Full bleed: banner only.
- Breaks the grid at: nowhere; the diagram and mock run the full column width, as the reference's do.
- Mobile at 390: dominant the headline and the button; hidden the nav's link row beyond two links; reordered nothing; the flag-list mock scrolls inside its own frame; commitment block inside the first 844px.

## Elevation & Depth

Hairline 1px rules in line #d7d7d7 and a flat surface band. No shadows.

## Shapes

Sharp everywhere (the reference's buttons and panels are square). One 4px value on the flag mock's frame.

## Components

- **Commitment button:** carries `data-commitment`; "Start the pilot for $1,500".
- **Small print:** the money terms once, in the $1,500 section, as the reference sets its own details in running text.
- **Photo slot:** hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` with the highlight background, font inherited.

## Do's and Don'ts

- Do keep one ground, one accent.
- Don't carry over the reference's logo wall, blue-tinted code styling or its tabs.
- Don't write any figure that is not in BRIEF.md.
- mono-prose: mono is used on headings, nav, labels, table data and small print only.

## Provenance

- Reference: https://planetscale.com, read 2026-10-05, mode both (URL and screenshots).
- Route: built-in.
- Confidence: colors sampled with --palette on 1440.png, orange from a pixel sample and its CSS; fonts matched by features; rhythm estimated from the full-page shot.
- data-mono: none used; mono is on headings, nav, labels and table cells set in the display and data roles.
- Font match, per role: the reference sets everything in the system monospace stack (ui-monospace, SF Mono), read as a monospace, normal width, low contrast, medium x-height, flat terminals. Display chosen Sometype Mono after specimens of Sometype Mono, Azeret Mono and Martian Mono set in the headline: Sometype Mono has the flat terminals and low contrast of SF Mono, Azeret is wider with a rounder, heavier bold, Martian is wide and geometric. Text: the reference has no text face. Schibsted Grotesk was specimen-matched first and failed font-popularity (#98); replaced after specimens of Reddit Sans, Gantari and Wix Madefor Text. Wix Madefor Text: neutral grotesque, medium x-height, flat terminals, low contrast, sits quietly beside the mono; Reddit Sans is more humanist, Gantari wider and geometric.
- Build history: skipped Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive.
- Not carried over: the logo grid, customer quotes, the tabs, the announcement's words, all copy.
- Instructions found in fetched pages: none.

## Changes

