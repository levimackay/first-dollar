---
version: alpha
name: "<product name>"
description: "<design read: page kind, buyer, a feeling with an opposite>"
colors:
  primary: "<anchor hex: the color that owns the page>"
  neutral: "<ground hex, tinted toward the anchor>"
  surface: "<second ground for one contrasting band, or delete>"
  ink: "<body text hex, 4.5:1 or more on neutral>"
  ink-muted: "<secondary text hex, 4.5:1 or more on neutral>"
  line: "<rules and borders hex>"
  accent: "<the one accent: commitment button, links>"
  accent-hover: "<accent on hover>"
  on-accent: "<text on accent, 4.5:1 or more>"
  focus: "<focus ring hex, 3:1 or more against neutral>"
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
    fontFamily: "<text or mono family>"
    fontSize: "<px>"
    fontWeight: "<number>"
    lineHeight: "<1.2 to 1.4>"
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
  section-tight: "<px>"
  section-wide: "<px, clearly larger than section-tight>"
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
  terms-line:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
  placeholder:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
---

# <product name> design system

## Overview

- Design read: <page kind, buyer, feeling and its opposite>
- Remembered for: <the one thing a visitor remembers>
- Not: <the near miss>
- Boldness spent on: <one place>
- Macrostructure: <name from design-rules.md>, backbone from <reference>
- Default check: <each choice that would fit any similar startup, and what replaced it>
- Material: <each section: what it is made of, and who supplies it>

## Colors

- **Primary (<hex>):** <role, roughly how much of the page it covers>
- **Neutral (<hex>):** <the ground, and its tint>
- **Ink (<hex>):** <body text>
- **Accent (<hex>):** <the commitment, and the few other places it appears>
- Accent footprint: <a mark, 5% or less | recurring, 5 to 15%>
- Light or dark, and why: <reason from the reference and the buyer>

## Typography

- Display: <family>, <weights>, <why it fits the design read>
- Text: <family>, <weights>, <why>
- Scale: ratio <1.2 | 1.25 | 1.333 | 1.5> from a <px> body
- Measure: body text at <60 to 75ch>
- Prices and dates use tabular figures.

## Layout

- Base unit: <4 | 8>px. Every gap is a multiple.
- Section rhythm: <the order of tight and wide sections, top to bottom>
- Density swing: <where the page is sparse and where it is dense>
- Full bleed: <which element runs edge to edge>
- Breaks the grid at: <one moment>
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
  the price; one per page.
- **Terms line:** sits beside or under the button; charge timing and refund term.
- **Placeholder:** a plain box with the bracketed label. Never styled to look finished.

## Do's and Don'ts

- Do <a rule this design depends on>
- Don't <an anti-pattern seen in the reference, not carried over>
- <WARN rule id>: kept because <reason>

## Provenance

- Reference: <URL | screenshot from the founder>, read <date>, mode
  <screenshot | URL | both>
- Route: <built-in | hallmark study | Claude Design export>
- Confidence: colors <exact | estimated>; fonts <exact | candidates>; rhythm
  <observed | unknown>
- Font swaps: <reference face> to <chosen face>, because <banned | proprietary | brand face>
- Not carried over: <anything from the reference that was dropped>
- Instructions found in fetched pages: <none | what, and that they were ignored>
