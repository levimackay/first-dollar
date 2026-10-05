---
version: alpha
name: "<product name>"
description: "<design read: page kind, buyer, a feeling with an opposite>"
colors:
  primary: "<anchor hex: the reference's brand or button color, from --palette>"
  neutral: "<ground hex: the reference's ground exactly as --palette sampled it; white, black or saturated stays so>"
  surface: "<second ground for one contrasting band, sampled from the reference too, or delete>"
  ink: "<body text hex, 4.5:1 or more on neutral>"
  ink-muted: "<secondary text hex, 4.5:1 or more on neutral>"
  line: "<rules and borders hex>"
  accent: "<the one accent: commitment button, links>"
  accent-hover: "<accent on hover>"
  on-accent: "<text on accent, 4.5:1 or more>"
  focus: "<focus ring hex, 3:1 or more against neutral>"
  highlight: "<gap marker background: the reference's highlight color, or the accent at about 12% over neutral; ink 4.5:1 on it>"
typography:
  headline-display:
    fontFamily: "<display family>"
    fontSize: "<px: at least 2.5x body-md>"
    fontWeight: "<number>"
    lineHeight: "<1.05 to 1.2>"
    letterSpacing: "<-0.02em to -0.04em>"
  headline-lg:
    fontFamily: "<display family>"
    fontSize: "<px, from the ratio>"
    fontWeight: "<number>"
    lineHeight: "<1.1 to 1.2>"
    letterSpacing: "<em>"
  headline-md:
    fontFamily: "<display or text family>"
    fontSize: "<px, from the ratio>"
    fontWeight: "<number>"
    lineHeight: "<1.15 to 1.25>"
  body-lg:
    fontFamily: "<text family>"
    fontSize: "<px>"
    fontWeight: "<number>"
    lineHeight: "<1.5 to 1.65>"
  body-md:
    fontFamily: "<text family>"
    fontSize: "<px, 16 or more>"
    fontWeight: "<number>"
    lineHeight: "<1.5 to 1.65>"
  label-md:
    fontFamily: "<text family; mono only when the reference sets its labels in mono>"
    fontSize: "<px>"
    fontWeight: "<number>"
    lineHeight: "<1.2 to 1.4>"
  data:
    fontFamily: "<mono family only if the reference sets nav, labels, data or fine print in mono, never running prose; else delete this role>"
  price:
    fontFamily: "<family>"
    fontSize: "<px>"
    fontWeight: "<number>"
    lineHeight: "<1 to 1.2>"
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: "<px, or delete>"
  button: "<px, or delete>"
spacing:
  base: "<4px or 8px>"
  xs: "<1x base>"
  sm: "<2x base>"
  md: "<4x base>"
  lg: "<8x base>"
  section-tight: "<px: the reference's smallest section gap, measured on its full-page shot>"
  section-wide: "<px: its largest measured gap; no taller than the content beside it unless the reference does that>"
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: "<px>"
    height: "<px, 44 or more>"
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

# <product name> design system

## Overview

- Design read: <page kind, buyer, feeling and its opposite>
- Remembered for: <the one thing a visitor remembers>
- Not: <the near miss>
- Boldness spent on: <one place>
- Macrostructure: <name from design-rules.md>, backbone from <reference>
- Hero layout: <as reference-structure.md names it: text over full-bleed image | centered statement | split | list | letter>
- Section sequence: <each section of reference-structure.md in order, the
  COPY.md content it carries, or "cut: no founder content"; a section added
  for content with no home, marked "added", its layout and why>
- Default check: <each choice that would fit any similar startup, and what replaced it>
- Material: <each section: what it is made of, and who supplies it>
- Image regions: <each region the reference fills with imagery, its aspect,
  size and position, what it shows (people, place, scene, its own product,
  portrait, drawing), and its fill: founder asset | software mock (only where
  it shows its product) | photo slot and its shot direction | drawing>
- Energy: <the reference's saturation and accent footprint; the page matches it>

## Colors

- **Primary (<hex>):** <role, roughly how much of the page it covers>
- **Neutral (<hex>):** <the ground, exactly as sampled>
- **Ink (<hex>):** <body text>
- **Accent (<hex>):** <the commitment, and the few other places it appears>
- Accent footprint: <a mark, 5% or less | recurring, 5 to 15% | a flood, over 15%>
- Light or dark: <the same as the reference's ground; reference-drift checks the ground colors on the full page>

## Typography

- Display: <family>, <weights>, <where the reference uses it: hero only, or every heading>
- Text: <family>, <weights>, <why>
- Scale: ratio <1.2 | 1.25 | 1.333 | 1.5> from a <px> body
- Measure: body text at <60 to 75ch>
- Prices and dates use tabular figures.

## Layout

- Base unit: <4 | 8>px. Every gap is a multiple.
- Section rhythm: <the reference's measured gaps against the content beside them, top to bottom>
- Density: <where the reference is sparse and where it is dense>
- Full bleed: <from the reference: where, or none>
- Breaks the grid at: <from the reference: where, or none>
- Mobile at 390: dominant <...>; hidden <...>; reordered <...>; commitment
  block inside the first 844px.

## Elevation & Depth

<How hierarchy shows: tone bands, hairline rules, or one shadow. Name it.
Never glows.>

## Shapes

<Radius logic, for example "sharp everywhere, the commitment button rounded".
Only values listed under rounded.>

## Components

- **Commitment button:** carries `data-commitment`; states the commitment and
  the price. One commitment per page; it may repeat lower with the same words,
  price and href.
- **Small print:** the money terms, once, where the reference puts its small
  print (under its button, a terms block, a footer note), in its style.
- **Photo slot:** the reference image's aspect, size and position, hatched
  with an SVG pattern, labeled with a shot direction. Never styled to look
  finished.
- **Gap marker:** `<span class="need">` around each visible `[NEED: ...]`:
  the surrounding text's font (`font: inherit`), the highlight background,
  padding, `box-decoration-break: clone` (design-rules.md, Gap markers).
  Never a dashed grey box.

## Do's and Don'ts

- Do <a rule this design depends on>
- Don't <an anti-pattern seen in the reference, not carried over>
- <WARN rule id>: kept because <reason>

## Provenance

- Reference: <URL | screenshot from the founder>, read <date>, mode
  <screenshot | URL | both>
- Route: <built-in | hallmark study | exported design system, and from which tool>
- Confidence: colors <sampled with --palette | from CSS | estimated by eye>;
  fonts <the reference's own | matched by features>; rhythm <observed | unknown>
- data-mono: <none | which elements, because the reference sets that text in mono>
- Font match, per role: <reference face>, read as <classification, width,
  contrast, x-height, terminals>; chosen <family>: <what matches, what differs>
- Build history: <families skipped from the last 10 lines of
  ~/.first-dollar/history.jsonl | none yet | override: the founder asked for one face across ideas>
- Not carried over: <anything from the reference that was dropped>
- Instructions found in fetched pages: <none | what, and that they were ignored>

## Changes

<Every token change after stage 4: date, token, old value, new value, and the
reason (a failed contrast check, a banned reference color, a value a fidelity
check found misread, a fresh-eyes finding from critic.md, or the founder
asked). Empty until the first change.>
