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
whatever the reference looked like. [`reference-drift`]
Instead: the reference's ground exactly as `--palette` sampled it. A white
reference makes a white page; a dark one, a dark page.

**A quiet page from a loud reference.** Muted color and small type built from
a reference whose accent floods the screen.
Instead: match the energy, the accent's share of the screen and its
saturation, as well as the hex values (SKILL.md stage 6, Compare).

**Glows and purple.** Colored glow shadows, blurred orbs, radial washes,
indigo to purple. [`glow-shadow`, `gradient-budget`, `ai-palette`]
Instead: a flat field in the reference's palette, or nothing.

**A grain or noise overlay.** Texture laid over a flat ground to look premium.
Instead: the flat ground, as sampled.

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

**A badge above the headline.** A pill with a dot: "Now taking pre-orders".
Instead: say it in the terms line under the button, in the text face.

**Numbered section labels.** "01 / 02 / 03" over each section.
Instead: section names in the text face, or none.

**Template sections.** The centered hero with two buttons, three-card rows,
stat rows, logo rows, testimonial cards. [`centred-hero`, `three-card-row`,
`stat-row`, `logo-row`, `testimonial-signature`]
Instead: one button with the price; the real number of points as a list or
one large item; one real number in a sentence with its source, or nothing.

**An empty half screen.** The reference has a photo there; the page has air.
Instead: keep the region and fill it (SKILL.md stage 4).

## Copy and gaps

**Raw [NEED] brackets mid-sentence.** `[NEED: price]` sitting in running text
reads as broken copy, not as a gap someone must fill.
Instead: `<span class="need">[NEED: ...]</span>` with one plain style: a
dashed outline, the page's text font, no color flourish.

## Ornament and motion

**Emoji, sparkles, a stock icon on every heading.** [`icon-libraries`]
Instead: words, or one mark drawn for this page that means something.

**Arrows on every button and link.** "Pre-order →".
Instead: the label alone. The price is the pull.

**Fake window chrome.** Three traffic-light dots on the concept mock.
Instead: crop the mock the way the reference crops its photo. Chrome only if
the reference shows it.

**A marquee ticker.** A strip of scrolling keywords or claims between
sections.
Instead: cut it. Motion goes to the mechanism (motion.md). A marquee of the
buyer's own real words can stay when the reference has one, carrying real
facts only (motion.md, ticker proof).

**Motion everywhere.** Every section fading up on scroll, pulsing dots,
bouncing arrows. [`pulse-dot`, `bounce-easing`]
Instead: one signature motion that shows the mechanism, plus up to two
supporting moves (motion.md).

## The fresh-eyes critic

You are the critic. You have the page at 1440, at 390 and as a full page at
1440, the reference at 1440, and this catalog. You know nothing about why the
page was made this way; a critic who knows will excuse it.

"List anything a professional designer would read as AI-made, worst first."
Write the list to `<page>/.first-dollar/critic.md`, numbered, worst first.
One item each: the tell, its region (section, and 1440 or 390), and what to
do, from the "Instead" lines here. Mark an item "ref" when the reference does
the same thing. Tells not in this catalog count too.
