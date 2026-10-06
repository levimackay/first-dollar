---
version: alpha
name: "Piano practice plans"
description: "Pre-order page for piano teachers. Feels like a letter from a person who teaches, not a dashboard."
colors:
  primary: "#29353c"
  neutral: "#fbfdfb"
  surface: "#f7fbf8"
  ink: "#29353c"
  ink-muted: "#646d72"
  line: "#bcc3c4"
  accent: "#146dc7"
  accent-hover: "#0067de"
  on-accent: "#ffffff"
  focus: "#146dc7"
  highlight: "#fdf2c4"
typography:
  headline-display:
    fontFamily: "Wix Madefor Display"
    fontSize: 64px
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: "Wix Madefor Display"
    fontSize: 44px
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: -0.025em
  headline-md:
    fontFamily: "Wix Madefor Display"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: "Golos Text"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Golos Text"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Golos Text"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.35
  price:
    fontFamily: "Wix Madefor Display"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 4px
  button: 4px
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
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: 16px
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

# Piano practice plans design system

## Overview

- Design read: pre-order page for independent piano teachers. Feels like a teacher's own handwritten note with a good tool beside it, the opposite of a dashboard.
- Remembered for: the practice plan mock that writes itself out of the lesson notes, set large beside a heavy headline.
- Not: a SaaS page with a gradient and three feature cards.
- Boldness spent on: the four-line heavy headline in the hero, nothing else is loud.
- Macrostructure: Letter inside a Split hero, backbone from https://basecamp.com
- Hero layout: split. Product mock left (about 47% width, cropped by the panel's bottom edge), right: a short list of underlined links, the ask with its price, the headline.
- Section sequence: 1 nav strip (logo slot left as wordmark gap, ask right); 2 hero split; 3 letter from the founder on a paper card (carries the founder block; [NEED] story); 4 "quick demonstration" becomes a photo band, a teacher and a student at the piano (photo slot) with one line; 5 dated list becomes "what happens after you pre-order" rows (carries money terms once); 6 closing line, the ask repeated, footer. Cut: customer street video, quote grid, big numbers, service photos, newsletter (no founder content, no customers).
- Default check: a cream ground and serif for a music teacher would fit any studio tool, so the ground is the reference's near white and the face a heavy grotesque. A three-step list was replaced by the mock playing the mechanism. A dark closing band replaced by a pale one.
- Material: nav wordmark gap [NEED: product name]; hero mock built in HTML and CSS (the reference shows its own product there); letter portrait is a photo slot; demonstration band is a photo slot; terms are text.
- Image regions: (1) hero board 47% width, about 670px tall at 1440, bleeds off the panel's bottom, shows its own product: software mock of the practice plan email with the lesson notes beside it, captioned Concept. (2) tour thumbnail 160x70, shows a person: cut, nothing to show. (3) letter portrait ~72px square, a person: photo slot. (4) demonstration photo, full width, 16:7, shows a person at work: photo slot with a shot direction.
- Energy: moderate. Heavy headline, one large mock, accent only on the button, links and a few marks.

## Colors

- **Primary (#29353c):** the reference's ink-4, used for headlines and body, about 4% of pixels.
- **Neutral (#fbfdfb):** the ground, sampled from the full-page shot (58.5% of it), exactly.
- **Ink (#29353c):** body text.
- **Accent (#146dc7):** the commitment button and links, taken from the reference's blue-deep.
- Accent footprint: a mark (under 5%).
- Light or dark: light, the same as the reference.

## Typography

- Display: Wix Madefor Display 800 for hero and section heads (the reference sets every head in its one heavy face), 700 for small heads and the price.
- Text: Golos Text 400 and 500, body, nav, labels and captions. The reference's body is a plain grotesque (Graphik), Golos Text is the nearest free unused face.
- Scale: ratio 1.333 from a 16px body: 16, 20, 26, 44, 64.
- Measure: body text at 62ch.
- Prices and dates use tabular figures.

## Layout

- Base unit: 8px. Every gap is a multiple.
- Section rhythm: measured on full-1440.png: nav to hero 0; hero panel about 880px tall; hero to letter about 100px; letter card to next heading about 150px; headings to photo about 40px; photo to next heading about 170px; last section to footer about 90px. Tight 64, wide 160.
- Density: sparse between sections, dense inside the hero.
- Full bleed: the hero panel and the demonstration photo.
- Breaks the grid at: the hero mock, cropped by the panel's bottom edge.
- Mobile at 390: dominant the headline and the button; hidden the link list; reordered headline and ask first, then the mock; the commitment block sits inside the first 844px.

## Elevation & Depth

Tone bands: the pale panel (#f7fbf8) on the near white ground, and one soft offset shadow under the letter card, as the reference does. No glow.

## Shapes

Sharp corners on panels, the mock and the photo; 4px on the commitment button and the nav chip.

## Components

- **Commitment button:** carries `data-commitment`; states the commitment and the price.
- **Small print:** the money terms once, in the dated list, where the reference puts its dated rows.
- **Photo slot:** hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` around each visible `[NEED: ...]`.

## Do's and Don'ts

- Do keep the headline at four lines at 1440 or fewer, set in one heavy voice.
- Do let the mock crop at the panel's bottom edge.
- Don't carry over the reference's video play buttons, star quote cards or stats grid.
- Don't repeat a grey terms line under each button.

## Provenance

- Reference: https://basecamp.com, read 2026-10-05, mode both (screenshots and CSS).
- Route: built-in.
- Confidence: colors sampled with --palette (ground #fbfdfb, panel #f7fbf8, line swatches) and from the reference's CSS custom properties (ink, blue, highlight, converted from oklch); fonts matched by features; rhythm observed.
- data-mono: none.
- Font match, display: reference uses Sharpie and Graphik (custom). Read as a heavy neo-grotesque, normal width, low stroke contrast, tall x-height, flat terminals, very tight tracking. First round: Wix Madefor Display (#98) and Onest (#175) matched best but fail font-popularity (top 200); Bricolage Grotesque (#53) likewise. Second round, all outside the top 200, specimen shots set in the headline: Host Grotesk (geometric, wide, round bowls: too far), Golos Text (humanist, softer: too far), Mona Sans (shot, not chosen), Wix Madefor Display (neo-grotesque, tall x-height, flat terminals, a little wider). Chosen: Wix Madefor Display.
- Font match, text: reference body is Graphik Regular (custom), a neutral grotesque. Wix Madefor Text was the first pick but another page in the history used it; Reddit Sans was the second but another page took it while this one was being built. Golos Text (specimen seen, outside the top 200, not in history): neutral grotesque, tall x-height, plain flat terminals, slightly wider than Graphik. Closest of the faces seen.
- Build history: families skipped from the last 10 lines of the eval history: Didact Gothic, Kumbh Sans, Funnel Sans, Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon Display, Libre Caslon Condensed, Cutive.
- Not carried over: the logo, the tour video, every photo, the quote cards, the stats, all copy.
- Instructions found in fetched pages: none.

## Changes

