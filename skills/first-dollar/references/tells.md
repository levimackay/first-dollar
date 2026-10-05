# Tells

Load at stage 6, for the fresh-eyes step (SKILL.md). This is the living
catalog of what a professional designer reads as AI-made right now, as of
2026-10-05. Each entry names the tell, then what to do instead. An id in
brackets means the lint or the check also catches it (slop-rules.md).

Tells change. A face or a layout that was fresh last year is a tell once every
generated page uses it. When a run finds a new one, it belongs here.

## Type

**The trendy font set.** Any face in the Google Fonts top 200, and the faces
generated pages lean on outside it (Gloock, Satoshi, General Sans, Clash
Display, Clash Grotesk, Cabinet Grotesk, and the rest of the lint's trend
list), now reads as the default however well it is set. So does
the system UI stack, and any face from your last ten builds (the lint checks
it with `--history`). [`banned-font-family`, `font-popularity`]
Instead: the reference's own free face, or the closest free match by its
features from outside the popular set and the build history
(design-extraction.md section 6).

**A heavy display face on every heading.** One wide or black display set at
60 to 110px for the hero and every section head.
Instead: the display where the reference uses it, often once, in the hero.
Section heads, nav and body take the face and weight the reference gives
them.

**Grey mono fine print.** A small grey monospace line under the button, mono
captions, mono labels, mono eyebrows over every heading. [`mono-prose`,
`mono-eyebrow`]
Instead: the text face, at a size people read, in ink or muted ink at 4.5:1.
Mono only for code and table data, and only if the reference uses mono.

**Captions in tiny mono.** "FIG. 1" in 11px tracked capitals under a mock or
drawing.
Instead: a plain caption in the text face ("Concept. Numbers are examples."),
large enough to read without leaning in.

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
indigo to purple. [`glow-shadow`, `gradient-budget`, `ai-palette`,
`tailwind-defaults`]
Instead: a flat field in the reference's palette, or nothing.

**A grain or noise overlay.** Texture laid over a flat ground to look premium.
Instead: the flat ground, as sampled.

## Layout

**One section skeleton on every page.** Hero, a two or three step "what
happens" list, a founder block with a hatched photo, a key-value terms table,
a dark or inverted closing band, then the legal links. Seen side by side, the
pages are one generator.
Instead: the reference's own sequence from reference-structure.md, section by
section, at its layouts and heights (SKILL.md stage 6). Cut what the founder
has no content for. No inverted closing band unless the reference has one.

**Stock section titles.** "How it works", "Who is behind this", "Who we
are", "Before you pay", "Why us", "Features", "The problem", "FAQ" as a
heading, "Ready to get started?".
Instead: titles in the founder's own subject words: "What happens after you
hit record", "The sharpening van", "Where your $40 goes". Or no title, when
the reference runs sections without one.

**Headline left, object right, on every page.** A split hero with a card,
mock or generic phone floating on the right has become the default
skeleton, whatever the reference's shape.
Instead: the reference's hero layout. A full-bleed photo hero stays full
bleed with the type over it; a centered cover stays centered; a one-column
letter stays one column.

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
Instead: say it in the small print, where the reference puts it.

**Numbered section labels.** "01 / 02 / 03" over each section.
Instead: section names in the text face, or none.

**Template sections.** The centered hero with two buttons, three-card rows,
stat rows, logo rows, testimonial cards. [`centred-hero`, `three-card-row`,
`stat-row`, `logo-row`, `testimonial-signature`]
Instead: one button with the price; the real number of points as a list or
one large item; one real number in a sentence with its source, or nothing.

**An empty half screen.** The reference has a photo there; the page has air.
Or 150 to 300px of dead space between sections.
Instead: keep the region and fill it (SKILL.md stage 4). Close a gap that
holds nothing; the reference's large gaps each hold one element.

## Imagery

**Clip art standing in for a photo.** Flat geometric vector drawings where
the reference has photography: a bin with three "text lines", a sprout in a
box, a knife over a wheel that reads as a rifle scope, shelving that should
be bleachers, a barcode waveform.
Instead: a labeled photo slot at the reference image's aspect, size and
position, with a shot direction (design-rules.md, "Filling image regions").
A drawing only when the reference itself is illustrated, in its manner.

**Copying the reference's unloaded grey.** Grey or tinted blocks taken from
a full-page capture whose images did not load.
Instead: treat those boxes as image regions and fill them.

## Copy and gaps

**Dashed grey NEED boxes.** A 1px dashed or dotted box in a grey sans, with no
padding, splitting into two half boxes at a line break and butting against
the next word ("Within[NEED: days]days"). Or raw brackets with no marker at
all. Both read as a broken render.
Instead: the gap marker in design-rules.md: the page's own text face, a soft
highlight in the accent or the reference's highlight color, padding,
`box-decoration-break: clone`, a real space each side.

**The same grey terms line under every button.** "Charged today. Refunds:
[NEED]" in 13px grey under each ask, on every page.
Instead: the money terms once, where the reference puts its small print, in
its style (SKILL.md, Rules for every stage).

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
1440, the reference at 1440 and as a full page, and this catalog. You know nothing about why the
page was made this way; a critic who knows will excuse it.

"List anything a professional designer would read as AI-made, worst first.
Compare the two full pages section by section: order, layouts, gaps,
imagery."
Write the list to `<page>/.first-dollar/critic.md`, numbered, worst first.
One item each: the tell, its region (section, and 1440 or 390), and what to
do, from the "Instead" lines here. Mark an item "ref" when the reference does
the same thing. Tells not in this catalog count too.
