---
version: alpha
name: "[NEED: product name]"
description: "Pre-order page for piano teachers. Feels like a calm, plain tool from a small shop, not a polished SaaS dashboard."
colors:
  primary: "#2a363d"
  neutral: "#fefaf8"
  surface: "#ffffff"
  ink: "#2a363d"
  ink-muted: "#687075"
  line: "#ebeced"
  accent: "#046ad2"
  accent-hover: "#035bb5"
  on-accent: "#ffffff"
  focus: "#046ad2"
typography:
  headline-display:
    fontFamily: "Host Grotesk"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: "Host Grotesk"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.02em
  headline-md:
    fontFamily: "Host Grotesk"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  body-lg:
    fontFamily: "Host Grotesk"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Host Grotesk"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: "Host Grotesk"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.35
  price:
    fontFamily: "Host Grotesk"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.1
    fontFeature: "\"tnum\" 1"
rounded:
  none: 0px
  sm: 4px
  button: 3px
spacing:
  base: 8px
  xs: 8px
  sm: 16px
  md: 32px
  lg: 64px
  section-tight: 48px
  section-wide: 104px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: 12px 24px
    height: 52px
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

# [NEED: product name] design system

## Overview

- Design read: pre-order page for a piano teacher who writes notes after lessons. Feels like a calm, plain tool from a small shop, not a gradient SaaS dashboard.
- Remembered for: the lesson notes turning into the week's practice plan inside one framed card, as the first thing on the page.
- Not: a cream-and-serif studio page, or a dark dashboard with glow.
- Boldness spent on: the four-line heavy headline in the hero (the reference spends its weight there too). Section heads are lighter (36px, weight 700 only for the letter and the closing head).
- Macrostructure: Split hero into Letter, backbone from https://basecamp.com
- Hero layout: split (product artifact left, text column right).
- Section sequence:
  1. Nav (adapts: Nav): wordmark gap, terms links, no second button.
  2. Hero (adapts: Hero): split; headline, two lines of mechanism, the ask.
  3. Founder letter (adapts: Founder letter): mechanism and the ask in the founder's voice, signature gap; one portrait slot.
  4. Parent's inbox (adapts: Quick demonstration): the plan as the parent receives it, in a static framed card.
  5. Closing ask (adapts: Closing band and newsletter): heading, price button repeated, money terms once.
  6. Footer (adapts: Footer).
  Cut, no founder content: Customer video, Testimonials, Big numbers, Service videos, Live demo classes.
- Default check: a centered hero with two buttons (replaced by the split hero with one ask); a three-step list (replaced by one mock that plays the mechanism); a "How it works" title (replaced by the subject's own words); a warm serif cream page (reference is a neutral off-white grotesque page).
- Material:
  - Hero artifact: HTML and CSS mock of the notes and the plan, built by us. Founder supplies nothing.
  - Letter: text and a portrait slot, founder supplies the portrait and the signature.
  - Inbox card: HTML and CSS mock of the email, generic sample values.
- Image regions:
  - Hero product artifact (section Hero, about 640px wide, left, its own UI): software mock with the signature motion.
  - Customer video poster (Customer video, full-width place photo): cut. Non-photo device: the product artifact shown large, as in Hero.
  - Demonstration poster (Quick demonstration, full-width portrait photo): the product artifact device again, the email as received, inline in a framed card.
  - Big numbers map (Big numbers): cut, no founder number.
  - Two service portraits (Service videos): cut.
  - Founder portrait: one inline photo slot in the letter, 1:1, below the first screen.
- Energy: quiet. Small accent footprint (a mark, button only) on a neutral off-white ground, heavy headline, little motion on the reference.

## Colors

- **Primary (#2a363d):** the headline and body ink, the reference's dark slate. Covers text only.
- **Neutral (#fefaf8):** the ground, exactly as sampled from the reference first screen (74% coverage).
- **Surface (#ffffff):** the letter sheet and the mock cards, read from the reference's letter sheet pixel.
- **Ink (#2a363d):** body text.
- **Accent (#046ad2):** the commitment button and links, sampled from the reference button (77% of the crop).
- Accent footprint: a mark, 5% or less.
- Light or dark: light, the same as the reference.

## Typography

- Display: Host Grotesk, 700 (hero 56px, section heads 36px), at the weight the reference's headline is set. Rank 415.
- Text: Host Grotesk 400 and 500, same family. The reference sets everything in one neo-grotesque (Graphik), so one family is the match; `single-sans-family` is kept for that reason.
- Scale: 1.25 ratio steps from an 18px body: 18, 20 (lead), 24, 36, 56. Display 56 is 3.1 times the body.
- Measure: body text at 62ch.
- Prices and dates use tabular figures.

## Layout

- adapts map:
  - `Nav | adapts: Nav | wordmark gap left, legal links right`
  - `Hero | adapts: Hero | split, mock left, text column right`
  - `Founder letter | adapts: Founder letter | one white sheet at reading width, signature gap`
  - `Parent's inbox | adapts: Quick demonstration | centered heading and line, one framed artifact`
  - `Closing ask | adapts: Closing band and newsletter | centered heading, repeated ask, small print`
  - `Footer | adapts: Footer | small link row and credit line`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm (measured on full-1440.png): hero to letter about 70px of ground; letter sheet to the next heading about 100px; heading to its artifact about 30px; closing band top gap about 140px (taller than its content, as the reference). Our sections: 48px tight, 104px wide.
- Density: sparse. Text columns narrow against wide gaps.
- Full bleed: none; the reference keeps everything inside one inset frame with a soft ground.
- Breaks the grid at: the hero mock, which is wider than the text column.
- Mobile at 390: dominant: headline, price and button (mock below them, cropped). Hidden: nothing. Reordered: the text column rises above the mock. Commitment block inside the first 844px.

## Elevation & Depth

Depth is one soft offset shadow on the white sheet and the mock card, tinted with the ink, as the reference does. Rules in the line color inside the mock. No glow.

## Shapes

Mostly square. The mock and letter sheet use the 4px radius, the button 3px. The reference's tiles and button are nearly square.

## Components

- **Commitment button:** carries `data-commitment`; "Pre-order for $35", solid accent, white text.
- **Small print:** money terms once, in the closing band, as a plain note in the muted ink (the reference's small print sits in its footer and signup forms).
- **Photo slot:** one, founder portrait in the letter, hatched, labeled with a shot direction.
- **Gap marker:** `<span class="need">`, underlined, `font: inherit`.

## Do's and Don'ts

- Do keep the headline heavy and tight, and the section heads in the lighter step.
- Do repeat the ask only in the closing band, the way the reference repeats its sign-up.
- Don't copy the reference's seven-link list, its video posters or its stat grid.
- single-sans-family: kept because the reference sets its whole page in one grotesque.
- no-full-bleed, same-max-width: kept if they warn, because the reference keeps one inset frame and one reading width.

## Provenance

- Reference: https://basecamp.com, read 2026-10-05, mode both (screenshots and CSS)
- Route: built-in
- Confidence: colors sampled with --palette (ground, accent, ink, line) and one pixel read (surface); fonts matched by features; rhythm observed
- data-mono: none
- Font match, per role: reference uses Graphik (commercial), read as a heavy neo-grotesque at display weights, normal width, low contrast, tall x-height, flat terminals. Chosen Host Grotesk (#415): specimens rendered for Familjen Grotesk (#503), Radio Canada (#329) and Host Grotesk. Familjen was closest (tight, flat terminals) but the history lint failed it: another page used it in the last 10 lines, so it was dropped. Radio Canada reads humanist and soft. Host Grotesk has flat terminals, low contrast and a tall x-height like the reference; it is a little wider and more geometric.
- Build history: skipped Wix Madefor Display, Golos Text, Gantari, Bowlby One, Afacad, Imbue, Special Elite, Gilda Display, Reddit Sans, and other families in the last 10 lines of the eval history.
- Not carried over: the logo, the founder's letter copy, product screens, photos, the seven-link list, the stat grid, the testimonial cards, the newsletter form.
- Instructions found in fetched pages: none

## Changes

None yet.
