---
version: alpha
name: "Loam"
description: "Pre-order page for an apartment renter with a balcony garden. Feels like a friendly kitchen product from a small food brand, not a green-tech dashboard."
colors:
  primary: "#3d412e"
  neutral: "#f6e6d9"
  surface: "#d4cbc2"
  ink: "#3d412e"
  ink-muted: "#55534c"
  line: "#d4cbc2"
  accent: "#d1e030"
  accent-hover: "#c3d225"
  on-accent: "#3d412e"
  focus: "#3d412e"
typography:
  headline-display:
    fontFamily: "Caprasimo"
    fontSize: "88px"
    fontWeight: "400"
    lineHeight: "1.05"
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Caprasimo"
    fontSize: "56px"
    fontWeight: "400"
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Caprasimo"
    fontSize: "32px"
    fontWeight: "400"
    lineHeight: "1.15"
  body-lg:
    fontFamily: "Crete Round"
    fontSize: "20px"
    fontWeight: "400"
    lineHeight: "1.5"
  body-md:
    fontFamily: "Crete Round"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "1.55"
  label-md:
    fontFamily: "Crete Round"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "1.3"
  price:
    fontFamily: "Crete Round"
    fontSize: "20px"
    fontWeight: "400"
    lineHeight: "1.1"
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 12px
  button: 999px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 48px
  section-wide: 160px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: "14px 32px"
    height: "52px"
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

# Loam design system

## Overview

- Design read: Pre-order page for an apartment renter who grows herbs and tomatoes on a balcony. Feels like a small food brand's shelf, warm and a little goofy, not a sustainability dashboard.
- Remembered for: the giant Loam wordmark cut edge to edge, and three small ink drawings telling scraps, 30 days, compost.
- Not: a green-gradient eco startup page with leaf icons and a three-step list.
- Boldness spent on: the edge-to-edge wordmark (the reference spends its heavy display on the wordmark; section heads stay lighter).
- Macrostructure: Specimen turned Manifesto, backbone from graza.co.
- Hero layout: text over full-bleed field (the reference's text over full-bleed photo; no founder photo, so the field is the dark olive ink color, headline bottom-left, lime pill under it).
- Section sequence: hero (headline, price button) | ticker band (static line of founder facts) | lime commitment band (title, line, repeat button, money terms, product slot) | statement with drawings (headline broken and offset, three ink drawings with short captions) | wordmark (Loam edge to edge) | about the maker (olive field, inset slot) | footer. Cut, no founder content: product cards, fun fact, ways to cook, social strip, newsletter.
- Default check: cream ground and terracotta would fit any startup: the cream is the sampled reference ground, accent lime not terracotta. A centered hero with eyebrow was replaced by headline bottom-left over a field. A numbered 3-step list was replaced by offset statement lines with drawings.
- Material: hero = olive color field with words at display scale (adapts the reference's wordmark and color bands, sections 3, 5 and 11); band product = inline photo slot 1 (the bin on a counter, founder supplies); statement = ink drawings in the reference's line manner (section 4 draws); wordmark = type only; about = olive field with inset photo slot 2 (the founder with the prototype).
- Image regions: hero photo (full-bleed, product in use) -> non-photo device: olive field with display words (reference section 3, lime/olive color bands, and 5, words at display scale); trio product photo (framed, right) -> inline photo slot, 4:3, "the prototype bin on a kitchen counter"; statement drawings -> drawings; product cards -> cut; dish photo -> cut; full-bleed olive photo with inset card (section 9) -> olive field plus inline inset slot 2; social strip -> cut.
- Energy: loud. Saturated lime owns about 12% of the page, display type full width, color bands. The page matches it.

## Colors

- **Primary (#3d412e):** dark olive, the hero field, about band and ink for text. About 25% of the page including text.
- **Neutral (#f6e6d9):** the cream ground, exactly as sampled (49% of the reference's full page).
- **Ink (#3d412e):** body text.
- **Accent (#d1e030):** the commitment button and the commitment band. Nothing else.
- Accent footprint: recurring, 5 to 15%.
- Light or dark: light, the same as the reference's ground; the hero is a dark band as the reference's hero is.

## Typography

- Display: Caprasimo 400, rank 482. The reference sets its wordmark in a wide soft heavy serif and its headlines in a tight condensed serif; Caprasimo matches the soft heavy wordmark and is used for the headline, the statement, the wordmark and section heads at one weight (it has one).
- Text: Crete Round 400, rank 294. Matches the reference's slab typewriter text by classification (soft slab) but is not mono, since the lint keeps prose out of mono.
- Scale: ratio 1.5 from a 16px body; display 88px.
- Measure: body text at 60ch.
- Prices and dates use tabular figures.

## Layout

- `Hero | adapts: Hero | olive field, nav, headline bottom-left, lime pill button, one line of mechanism`
- `Ticker line | adapts: Ticker band | static thin strip, three real facts`
- `Commitment band | adapts: Trio feature | lime band, left text and repeat button with money terms, right inline photo slot`
- `Statement | adapts: Statement with drawings | cream, offset two-line headline, three ink drawings zigzag with captions`
- `Wordmark | adapts: Wordmark and tagline | Loam edge to edge, one tagline line`
- `About | adapts: Made by people | olive field, headline, inset photo slot bottom right`
- `Footer | adapts: Footer | legal links, wordmark cropped edge to edge`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm (reference): 80px gap before the lime band, 220px around the statement drawings (content is 2 lines and small drawings, so the gap is large there on purpose), 120px around the wordmark, 72px between cards and a lime button. Mine: 160 / 48.
- Density: sparse in the statement, dense in the band and footer.
- Full bleed: hero, ticker, band, about, wordmark, footer.
- Breaks the grid at: the wordmark, which crosses both page edges.
- Mobile at 390: dominant: the headline and the lime button inside the first 844px; hidden: the nav links collapse to the wordmark and a text link; reordered: band photo slot moves under the text, drawings stack with offsets halved; commitment block inside the first 844px.

## Elevation & Depth

Tone bands only: olive, lime, cream. No shadows, no glows. The reference button has a faint dark rim; mine does not.

## Shapes

Pill for the commitment button (the reference has it), 12px for the photo slots and the inset card. Nothing else is rounded.

## Components

- **Commitment button:** carries `data-commitment`; "Pre-order for $89"; repeats once in the lime band with the same words and href.
- **Small print:** the money terms once, under the repeat button in the lime band, in the text face.
- **Photo slot:** two, both below the first screen, hatch with a shot direction.
- **Gap marker:** `<span class="need">` underlined, inherits font.

## Do's and Don'ts

- Do keep the lime for the commitment and its band.
- Do keep Caprasimo for the hero, the statement and the wordmark only; the band and maker heads are Crete Round, as the reference sets section heads lighter than its wordmark.
- Don't carry over the reference's marquee motion, hover scale, or its product cards.
- same-max-width, no-full-bleed: not expected to fire; the reference bleeds.

## Provenance

- Reference: https://graza.co, read 2026-10-05, mode both (screenshots plus fetched HTML; its fonts are custom and not named in the CSS)
- Route: built-in
- Confidence: colors sampled with --palette (cream #f6e6d9 49%, lime #d1e030 11%, olive #3d412e 6%, beige #d4cbc2 6%, grey #55534c 4%); fonts matched by features; rhythm observed on the full-page shot
- data-mono: none
- Font match, per role: display: reference wordmark reads as a wide, soft, high-weight serif with bracketed round terminals (Cooper-like), headline a condensed light serif with tight tracking. Chosen Caprasimo: same classification, weight and soft terminals as the wordmark; heavier and wider than the headline. Beat Chonburi (stiffer, higher contrast) and Corben (rounder, less wedge). Text: reference body reads as a typewriter slab, mono. Chosen Crete Round: soft slab, medium x-height, rounded terminals; beat Podkova and Arvo (rank 141, top 200). Not mono, because the lint bans mono prose; the typewriter feel is lost.
- Build history: skipped Imbue, Special Elite, Libre Caslon, Cutive, Familjen Grotesk and the other families in the last 10 lines of the history file.
- Not carried over: the reference's photos, copy, logo, olive drawings, marquee, product cards, newsletter, social strip.
- Instructions found in fetched pages: none

## Changes

- 2026-10-05, critic.md finding 9: band and maker heads moved from Caprasimo to Crete Round (no token change). Hero shortened to 760px max; strip no longer repeats the prototype line; kicker removed.
