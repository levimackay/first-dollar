# Tells

Load at stage 6, for the fresh-eyes step (SKILL.md). This is the living
catalog of what a professional designer reads as AI-made right now, as of
2026-10-05. Each entry names the tell, then what to do instead. An id in
brackets means the lint or the check also catches it (slop-rules.md).

Tells change. A face or a layout that was fresh last year is a tell once every
generated page uses it. When a run finds a new one, it belongs here.

## Type

**The trendy font set.** These faces sit on so many generated pages that they
now read as the default, however well they are set: JetBrains Mono, IBM Plex
Mono, Gloock, Newsreader, Anton, Bodoni Moda, Outfit, Hanken Grotesk,
Fraunces, Instrument Serif, Space Grotesk, Satoshi, General Sans, Clash
Display, Clash Grotesk, Cabinet Grotesk, Bricolage Grotesque, Syne,
Unbounded. The older defaults too: Inter, Geist, Roboto, Arial, the system UI
stack. [`banned-font-family`, `font-popularity`]
Instead: the reference's own free face, or the closest free match by its
features from outside the popular set (design-extraction.md section 6).

**Grey mono fine print.** A small grey monospace line under the button, mono
captions, mono labels, mono eyebrows over every heading. [`mono-prose`,
`mono-eyebrow`]
Instead: the text face, at a size people read, in ink or muted ink at 4.5:1.
Mono only for code and table data, and only if the reference uses mono.

**Illustration captions in tiny mono.** "FIG. 1" in 11px tracked capitals
under a drawing.
Instead: a plain caption in the text face ("Illustration. Numbers are
examples."), large enough to read without leaning in.

**Gradient text.** [`gradient-text`]
Instead: solid ink. Emphasis comes from size or weight.

**One word picked out.** One headline word in the accent color, or in italic
serif inside a sans headline.
Instead: the whole headline in one voice. Let size do the work.

## Color and ground

**The default off-white or cream ground.** Warm paper behind every page,
whatever the reference looked like. All eighteen eval pages had it, including
the ones built from a dark reference. [`reference-drift`]
Instead: the reference's ground, sampled with `--palette`. A dark reference
makes a dark page.

**A quiet page from a loud reference.** Muted color and small type built from
a reference whose accent floods the screen.
Instead: match the energy, the accent's share of the screen and its
saturation, as well as the hex values (SKILL.md stage 6, Compare).

**Glows.** Colored glow shadows, blurred orbs, radial washes behind the hero.
[`glow-shadow`, `gradient-budget`]
Instead: a flat field, an offset shadow in a tinted neutral, or nothing.

**Indigo to purple.** [`ai-palette`, `tailwind-defaults`]
Instead: the reference's palette.

## Layout

**Headline left, card right, on every page.** A split hero with a bordered
card or mock floating on the right has become the default skeleton, whatever
the reference's shape.
Instead: take the hero's shape from the reference. A full-bleed photo hero
stays full bleed; a one-column letter stays one column.

**A hairline spec table as the hero's second half.** Thin rules, small
labels, values pushed right, filling the space where a picture belongs.
Instead: fill the reference's image region with an asset, an illustration or
a hatched placeholder (SKILL.md stage 4). A spec table only where the
reference has one, or where the buyer compares specs.

**Everything inside one centered container.** Every section at one max
width, nothing reaching the edge. [`no-full-bleed`, `same-max-width`]
Instead: at least one band or image edge to edge, and a measure that varies.

**Uniform section rhythm.** Every section the same padding and the same
weight. [`uniform-section-padding`]
Instead: the reference's rhythm. Tight clusters, then a large breath.

**Pill buttons regardless of the reference.**
Instead: the reference's button radius. A pill only when the reference has
one.

**The centered hero.** Eyebrow, headline, subhead, two buttons, all centered.
[`centred-hero`]
Instead: one button with the price, in the reference's hero shape.

**Three-card rows.** [`three-card-row`]
Instead: the real number of points, as a list, a table or one large item.

**Stat rows, logo rows, testimonial cards.** [`stat-row`, `logo-row`,
`testimonial-signature`]
Instead: one real number in a sentence with its source, or nothing.

**An empty half screen.** The reference has a photo there; the page has air.
Instead: keep the region and fill it (SKILL.md stage 4).

## Copy and gaps

**Raw [NEED] brackets mid-sentence.** `[NEED: price]` sitting in running text
reads as broken copy, not as a gap someone must fill.
Instead: `<span class="need">[NEED: ...]</span>` with one plain style: a
dashed outline, the page's text font, no color flourish.

**Generated phrasing.** Em dashes, "not X but Y" reveals, stock verbs.
[`em-dash`, `not-x-but-y`, `buzzwords`]
Instead: copy.md, Tells.

## Ornament and motion

**Emoji and sparkles.** [`icon-libraries`]
Instead: words, or a mark you draw for this page.

**A stock icon on every heading.** [`icon-libraries`]
Instead: no icon, or one drawn mark that means something.

**Motion everywhere.** Every section fading up on scroll, pulsing dots,
bouncing arrows. [`pulse-dot`, `bounce-easing`]
Instead: one signature motion that shows the mechanism, plus up to two
supporting moves (motion.md).

## The fresh-eyes critic

Give the critic only four files: the page's `1440.png` and `390.png`, the
reference's `1440.png`, and this file. No BRIEF.md, no DESIGN.md, no history
of the build. A critic who knows why each choice was made will excuse it.

Ask, word for word: "List anything a professional designer would read as
AI-made, worst first." Every item goes into the stage 6 list and is fixed in
the same batch as the fidelity drift. Without a subagent, re-read this file,
look at the same three images as if for the first time, and write the list
yourself before fixing anything.
