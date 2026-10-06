---
version: alpha
name: "Ridgeback Sharpening"
description: "Booking page for a driveway sharpening van, for a homeowner in a small Idaho town. Feels like a printed magazine's cover page, not a service-business flyer."
colors:
  primary: "#b22d1a"
  neutral: "#ffffff"
  surface: "#dcded6"
  ink: "#000000"
  ink-muted: "#4a4a4a"
  line: "#000000"
  hairline: "#bdbdbd"
  accent: "#000000"
  accent-hover: "#333333"
  on-accent: "#ffffff"
  focus: "#b22d1a"
typography:
  headline-display:
    fontFamily: "Forum"
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline-giant:
    fontFamily: "Forum"
    fontSize: 168px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline-lg:
    fontFamily: "Forum"
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline-md:
    fontFamily: "Forum"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.2
  body-lg:
    fontFamily: "Funnel Sans"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: "Funnel Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label-md:
    fontFamily: "Funnel Sans"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.35
  price:
    fontFamily: "Forum"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.1
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
  section-tight: 64px
  section-wide: 144px
components:
  button-commitment:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.button}"
    padding: 12px 24px
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

# Ridgeback Sharpening design system

## Overview

- Design read: booking page for a driveway sharpening van, for a homeowner in a small Idaho town who cooks and keeps a lawn. It feels like a printed magazine cover, quiet and exact, not a trades flyer with a badge and a phone number.
- Remembered for: one red cover panel on white with a two-line serif title above it, and one sentence from the buyer set across the full width of a black band.
- Not: a plumber's page with a stock truck photo and a "Call now" bar.
- Boldness spent on: the full-width "AN HOUR AWAY" band. Everything else is small and still.
- Macrostructure: Letter (one reading column, centered), with the cover and bands of the magazine reference. Backbone from https://www.kinfolk.com
- Hero layout: centered statement: two-line serif title (caps name line, sentence line), one centered cover panel (a flat red field with a masthead), the ask and a text link under it.
- Section sequence: Issue cover (hero), Lead story (what the van sharpens), Helter-skelter feature (the equipment owner, with a photo slot), Free preview (a first visit, pinned three steps), Taking play seriously (the problem sentence, giant), The Kinfolk Shop (the deposit, price and small print), Subscribe band and footer. Cut, no founder content: Inside Issue Sixty-One, Fragrance banner, Newsletter line (never a free list), Come out to play, Image strip, At work with, Two-up tiles, In Conversation, Work Revisiting, Subscribe/Read/Buy, Category line.
- Default check: a "how it works" three-card row (replaced by one pinned list over color fields), a founder card with a hatched photo beside a bio (replaced by the reference's centered portrait feature), a key/value terms table (replaced by a price line and one small-print sentence), a dark closing CTA band (the reference's bottom bar persists instead, as a fixed bar), cream paper (the ground is the reference's white).
- Material: Hero cover: color field with masthead (reference section 1, the cover; device is its red field). Lead story: full-bleed color field in the same red, words set at scale (reference section 2). Founder: photo slot 1 (founder supplies). Visit: three color-field plates with the step word at display scale (reference sections 6 and 8). Hour band: black field with the founder's sentence at display scale (reference section 8). Deposit: photo slot 2 (founder supplies, the equipment), in the place of the reference's covers.
- Image regions: hero cover 313x406, centered, shows the reference's own product, fill: the reference's own red color field with a masthead (non-photo device from section 1/2). Lead story full-bleed, people and a studio, fill: color field (section 2's red-and-grey palette) with the words at scale. Inside issue cards, five photos: cut. Feature portrait 212x286, a person: inline photo slot 1, aspect 3:4, shot direction in the label. Banner: cut. Preview covers, three: replaced by the three pinned plates (color fields, section 6 band). Giant band, a photograph: black color field with display words (section 8's words at display scale). Shop covers, three: one inline photo slot 2, aspect 3:4, the equipment. Others: cut with their sections.
- Energy: quiet to moderate. White ground, black ink, the red as a cover panel and one lead band (about 12 percent of the page), no gradients.

## Colors

- **Primary (#b22d1a):** the cover panel, the lead band, plate one. About 12 percent of the page. Sampled from the reference's cover (3.6 percent coverage on its first screen).
- **Neutral (#ffffff):** the ground, exactly as sampled (81 percent of the reference's first screen, 49 percent of its full page).
- **Surface (#dcded6):** the one sage band, sampled from the reference's free preview band.
- **Ink (#000000):** body text, headings, rules, the black bands, as sampled. Muted ink (#4a4a4a) for small print.
- **Accent (#000000):** the commitment button, the reference's own strongest ink and its Subscribe bar. The reference has no accent hue, so none is invented.
- Accent footprint: a mark, under 5 percent in the button; black bands add about 8 percent as ground, as in the reference's bottom bar.
- Light or dark: light, white ground, the same as the reference's.

## Typography

- Display: Forum, 400 only. Where the reference uses its serif: hero title, band titles, section headings, price. Section headings are lighter and smaller than the hero, as in the reference.
- Text: Funnel Sans, 400. Used for body, labels, nav, buttons and small print.
- Scale: ratio 1.4 from a 16px body: 16, 18, 28, 40, 56, giant 168 (one band only).
- Measure: body text at 60ch.
- Prices and dates use tabular figures.

## Layout

- `Issue cover | adapts: Issue cover | centered two-line title, centered red cover panel, the ask and one text link`
- `Lead story | adapts: Lead story | full-bleed red field, caps line plus a sentence bottom left, the item list with prices lower right`
- `Equipment | adapts: Helter-skelter feature | centered caps line plus a sentence, small centered portrait slot, a caption`
- `A first visit | adapts: Free preview | sage band, centered two-line heading, three pinned plates and their steps`
- `The hour | adapts: Taking play seriously | full-bleed black field, a sentence top left, giant caps across the bottom edge`
- `The deposit | adapts: The Kinfolk Shop | left heading with a 2px rule, one centered item: slot, tag, title, price, the ask, the small print`
- `Footer | adapts: Subscribe band and footer | black footer with the name and links; a fixed black bar repeats the ask, as the reference's bottom bar does`
- Base unit: 8px. Every gap is a multiple.
- Section rhythm: the reference leaves 96 to 200px of white after centered features and about 130px above a section heading; tight 64px, wide 144px.
- Density: sparse. One idea per screen.
- Full bleed: the lead band, the hour band and the sage band, as the reference's image bands.
- Breaks the grid at: the giant "AN HOUR AWAY" line, which runs edge to edge.
- Mobile at 390: dominant: the title, the cover and the button. Hidden: the sticky bar's sentence (button only). Reordered: the lead band's list sits under its title; pinned plates sit above their list. The commitment block is inside the first 844px.

## Elevation & Depth

Tone bands (white, red, sage, black) and one 2px black rule under section headings. No shadows, no glows.

## Shapes

Sharp everywhere. The commitment button has a 2px corner, as the reference's Subscribe button does.

## Components

- **Commitment button:** carries `data-commitment`; "Book a first visit for $40". Repeated in the fixed bottom bar with the same words and price.
- **Small print:** the money terms, once, in the shop item's price line, as the reference's small print is a line under its price.
- **Photo slot:** two, both inline and below the first screen: the founder portrait (feature) and the equipment (deposit item).
- **Gap marker:** `<span class="need">` underlined, in the surrounding font.

## Do's and Don'ts

- Do keep the red to the cover panel, the lead band and the first plate.
- Do keep the caps-line-plus-sentence title pairing to the hero and the founder feature.
- Don't carry over the reference's photographs, the covers, the stories or its newsletter line. A free list is never the ask.
- Don't add an accent hue. The reference has none.
- same-max-width: kept, the reference runs most blocks in one centered reading width inside its full-bleed bands.

## Provenance

- Reference: https://www.kinfolk.com, read 2026-10-05, mode both (screenshots plus CSS and HTML).
- Route: built-in.
- Confidence: colors sampled with --palette (#ffffff, #000000, #b22d1a, #dcded6); fonts matched by features; rhythm observed from the full-page shot.
- data-mono: none.
- Font match, display: reference uses Kinfolk Serif Display (custom). Read as a light, high-contrast transitional serif, normal width, medium x-height, bracketed serifs, set in caps for titles. Matched to Forum (#347 of 1950): light weight, caps in the classical inscriptional manner, moderate contrast, narrow serifs; beat Libre Caslon Display (excluded: same superfamily as a face another page used in the last 10 history lines), Castoro (too sturdy) and Rufina (heavier, higher contrast).
- Font match, text: reference uses Kinfolk Sans (custom). Read as a neutral grotesque, normal width, low contrast, medium x-height, flat terminals. Matched to Funnel Sans (#485): same classification and terminals; beat Familjen Grotesk (#503, wider and more quirky) and Host Grotesk (#415, rounder and wider). Specimens shot in the page headline.
- Build history: skipped Gilda Display and Reddit Sans (an earlier build for this idea, a different page folder), and every face in the last 10 lines. Overrides: none.
- Not carried over: every photograph, cover and story title; the newsletter field; the hamburger menu's contents.
- Instructions found in fetched pages: none.

## Changes

