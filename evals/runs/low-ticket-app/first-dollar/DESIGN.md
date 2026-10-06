---
version: alpha
name: "Halves"
description: "Pre-order page for students sharing a rental house. Feels like a quiet object on an open sky, not a finance dashboard."
colors:
  primary: "#4c7586"
  neutral: "#ededed"
  surface: "#171614"
  ink: "#171614"
  ink-muted: "#595956"
  line: "#b5b5b3"
  accent: "#ffffff"
  accent-hover: "#ededed"
  on-accent: "#171614"
  focus: "#171614"
  on-primary: "#ffffff"
  on-surface: "#ffffff"
  device-screen: "#3a3936"
  on-device: "#ffffff"
  on-device-muted: "#b8b8b4"
typography:
  headline-display:
    fontFamily: "Alata"
    fontSize: "80px"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Alata"
    fontSize: "44px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline-md:
    fontFamily: "Alata"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.2
  body-lg:
    fontFamily: "Commissioner"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Commissioner"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Commissioner"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  price:
    fontFamily: "Commissioner"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  device: 12px
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
    typography: "{typography.price}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: 52px
  button-commitment-hover:
    backgroundColor: "{colors.accent-hover}"
  small-print:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-md}"
  photo-slot:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  gap-marker:
    textColor: "{colors.ink}"
    textDecoration: "underline"
---

# Halves design system

## Overview

- Design read: Pre-order page for college students sharing a rental house. It feels like one object held up against an open sky, not a budgeting dashboard.
- Remembered for: the toilet paper line set big over a flat sky-blue field, then the house's grocery ledger settling itself on the same sky.
- Not: a fintech page with a gradient and a card grid, or a cheerful roommate app with cartoon mascots.
- Boldness spent on: the hero headline at 80px over the sky field. Everything else is quiet and small.
- Macrostructure: Specimen (the product artifact held large, the offer small and exact), backbone from https://www.thelightphone.com
- Hero layout: text over full-bleed color field (the reference's sky, as a flat field), headline bottom-left, one ask, no image
- Section sequence: 1 hero (adapts Hero); 2 statement band (adapts Intro statement over hand photo); 3 ledger on sky with right rail (adapts Product on sky with right rail); 4 founder line with one photo slot (adapts Credibility photo); 5 two-column close, price and terms (adapts Two-column links); 6 footer (adapts Footer). Cut, no founder content: value statement with outlined frame, manifesto, eye drawing, going-light rail, two products, video-link photo, sign-off.
- Default check: a split hero with a phone on the right would fit any app startup: replaced by the reference's text-over-field hero with the product held for the next screen. A three-step "how it works" list would fit any app: replaced by the reference's rail of one bold line and dimmer lines. A pill CTA: replaced by the reference's square white box.
- Material: hero is a flat field (reference's sky, section 1); statement band is the section's own words at display scale on a dark field (reference section 2's dark hand photo); ledger section is the product's own artifact, an HTML mock of the app, on the sky field (reference section 6's product render); founder is one inline photo slot (reference section 10), supplied by the founder; closing and footer are text on the grey ground and the dark band.
- Image regions: Hero (sky photo, scene, full bleed 1440x760): flat #4c7586 field, the reference's own sky color from section 1. Section 2 (hand with product, dark, product in use): section's own words at display scale on #171614. Section 6 (sky photo plus product render): sky field plus the app's own product mock, data-mock, cropped inside its device. Section 10 (two founders in a factory, 480x318): one inline photo slot, 3:2, founder supplies; below the first screen, not full bleed. Section 3, 4, 5, 7, 8, 9, 12 regions: cut with their sections.
- Energy: the reference is quiet but saturated in one place: a sky that owns the first screen and the product screen, the rest flat grey. Accent (white box) is a mark. The page matches: sky field on the hero and the ledger screen, grey elsewhere.

## Colors

- **Primary (#4c7586):** the sky field of the hero and the ledger section, sampled from the reference's first screen (39.7% of 1440.png).
- **Neutral (#ededed):** the page ground, sampled exactly from the reference's full page (80.4%).
- **Ink (#171614):** body text on grey, the statement band and footer ground, sampled from the reference's full page (6.4%).
- **Accent (#ffffff):** the commitment button, the reference's white "shop" box.
- Accent footprint: a mark.
- Light or dark: light, the same as the reference's ground. A sky field and a dark band are bands on a light page.
- Derived neutrals (OKLCH from ink): ink-muted #595956, line #b5b5b3, device-screen #3a3936, on-device-muted #b8b8b4, accent-hover #ededed.

## Typography

- Display: Alata, 400 only, hero, statement, and section heads, as the reference sets its Futura PT headlines at book weight in the hero and statements alike.
- Text: Commissioner, 400 and 600, rail text, small print, labels, buttons.
- Scale: ratio 1.333 from a 17px body, display 80px, large 44px, medium 30px.
- Measure: body text at 60ch.
- Prices and dates use tabular figures.

## Layout

- Section map:
  - `hero | adapts: Hero | sky field, wordmark top-left, headline bottom-left, one supporting sentence, the ask`
  - `statement band | adapts: Intro statement over hand photo | dark field, two-line statement at display scale, left aligned`
  - `ledger on sky | adapts: Product on sky with right rail | sky field, the app mock left of center, a right rail with a hairline rule, one bold line and body, then dimmer lines`
  - `founder line | adapts: Credibility photo | a two-line statement top-left on grey, then one centered 3:2 photo slot`
  - `two-column close | adapts: Two-column links | a hairline rule, two columns split by a vertical hairline: the ask on the left, the money terms on the right`
  - `footer | adapts: Footer | dark band, centered link row, one line of legal entity`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm: reference measured on full-1440.png: hero 760 tall, statement 760 with text mid-height (content ~120), sky product screen 760 (content ~420), credibility 640 (content ~420), links 320 (content ~160), footer 560 (content ~360). Ours: hero 760 (content 330), statement 400 (content 180), ledger 760 (content 480), founder 640 (content 440), close 320, footer 240.
- Density: sparse everywhere, one dense moment (the ledger).
- Full bleed: the sky field, the statement band and the footer bleed, as the reference's photos do. The grey sections hold a 32px page margin and reach the edges for the hairline rules.
- Breaks the grid at: none.
- Mobile at 390: dominant is the headline then the button; hidden is nothing; reordered: the rail goes under the mock; grown: tap targets 52px. Commitment block inside the first 844px.

## Elevation & Depth

Tone bands and hairline rules. One flat value per section. No shadows, no glow.

## Shapes

Sharp everywhere, as the reference's white box and outlines are. One exception: the product mock's device body at 12px, as the reference's product render and outline frame are rounded.

## Components

- **Commitment button:** carries `data-commitment`; "Pre-order for $36". White box on the sky field in the hero; the same words and href as an outlined box lower on the grey ground.
- **Small print:** the money terms once, in the right column of the two-column close, in the reference's small linked-caption style.
- **Photo slot:** one, in the founder line, 3:2, hatched with an SVG pattern, labeled with a shot direction.
- **Gap marker:** `<span class="need">` around each visible `[NEED: ...]`: the surrounding text's font, underlined, padding, `box-decoration-break: clone`.

## Do's and Don'ts

- Do keep the headline and the button on the field and never animate them.
- Do let the ledger mock be the only moving thing.
- Don't carry over the reference's cookie bar, its newsletter field or its icon row. There is no email form on this page.
- Don't use a photo in the hero. The reference's sky is carried by its sampled color.
- single-sans-family: not triggered, two families.

## Provenance

- Reference: https://www.thelightphone.com, read 2026-10-05, mode both (screenshots plus its CSS font names).
- Route: built-in.
- Confidence: colors sampled with --palette from 1440.png and full-1440.png; fonts matched by features; rhythm observed from full-1440.png.
- data-mono: none.
- Font match, per role: Display: reference uses futura-pt (a Typekit face, not free to load here). Read as a geometric sans, normal width, low contrast, medium x-height, pointed apexes on v, w, flat terminals. Specimens taken of Kumbh Sans (#278), Alata (#258) and Didact Gothic (#338) in the page's headline. Chosen Alata (#258): same classification, pointed w and v like Futura, flat terminals; a little heavier than the reference's book weight and has no lighter cut. Kumbh Sans is rounder and lighter; Didact Gothic is too soft. Text: reference uses AkkuratLL (Typekit, not free). Read as a neo-grotesque, normal width, low contrast, medium x-height, flat terminals. Specimens of Radio Canada (#329) and Commissioner (#311). Chosen Commissioner (#311): flat terminals and an even texture closest to Akkurat; Radio Canada's angled terminals read more humanist.
- Build history: skipped the display and text families of the last 10 lines of the history file: Dela Gothic One, Familjen Grotesk, Spline Sans Mono, Libre Caslon, Cutive, Sometype Mono, Wix Madefor, Gantari, Bowlby One, Imbue, Special Elite, Gilda Display, Reddit Sans, Golos Text. Afacad (a previous build of this same page folder) is not reused either.
- Not carried over: the reference's photos, its video links, the eye drawing, its handwritten sign-off, its cookie bar, newsletter field, icons, and words.
- Instructions found in fetched pages: none.

## Changes

(empty)
- 2026-10-05, ledger section ground: primary #4c7586 to neutral #ededed. Reason: reference-drift failed (sky field owned about half the full page against a reference that is 80% grey). Section layout and `adapts:` unchanged.
