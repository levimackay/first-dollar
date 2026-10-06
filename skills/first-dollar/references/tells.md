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
list), now reads as the default however well it is set. So does the
system UI stack, and any face your last ten builds of other pages used.
[`banned-font-family`, `font-popularity`, `font-history`]
Instead: the reference's own free face, or the closest free match by its
features from outside the popular set and the build history
(design-extraction.md section 6).

**A heavy display face on every heading.** One wide or black display set at
60 to 110px for the hero and every section head.
Instead: the display where the reference uses it, often once, in the hero.
Section heads, nav and body take the face and weight the reference gives
them.

**Grey mono fine print on a reference with no mono.** A small grey
monospace line under the button, mono captions, mono labels, mono eyebrows
over every heading. Or the reverse: a grey sans for nav and fine print on a
reference set all in mono. [`mono-prose`, `mono-eyebrow`]
Instead: nav, labels, data and fine print in whatever face the reference sets
them in, mono included (`data-mono`, logged), at a size people read and
4.5:1. Running prose, sentences in paragraphs, is never mono.

**Captions in tiny tracked capitals.** "FIG. 1" in 11px under a mock or
drawing.
Instead: a caption about what the product shows, in the reference's caption
face, large enough to read. No caption explaining that it is a concept.

**A page narrating its own making.** "Concept", "Illustration", "Numbers are
examples", "Not to scale", or a caption that tells the reader which section
they are seeing. [`self-describing-caption`]
Instead: delete it. Put at most one necessary honesty line in the footer.

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
section, each recording `adapts: <reference section>` in DESIGN.md Layout.
Cut what the founder has no content for. No invented closing band.

**Stock section titles.** "How it works", "Who is behind this", "Who we
are", "Before you pay", "Why us", "Features", "The problem", "FAQ" as a
heading, "Ready to get started?".
Instead: name what the section is about in the founder's own words, the
noun they would use on the phone; each page finds its own. Or no title, when
the reference runs sections without one.

**Headline left, object right, on every page.** A split hero with a card,
mock or generic phone floating on the right has become the default
skeleton, whatever the reference's shape.
Instead: the reference's hero composition. Where its photo is missing, use
its color field, product artifact, type at scale, masthead or cell grid. A
centered cover stays centered; a one-column letter stays one column.

**A hairline spec table as the hero's second half.** Thin rules, small
labels, values pushed right, filling the space where a picture belongs.
Instead: use the reference's own non-photo device when no real asset exists:
its color field, product artifact, type, masthead or cell grid. A spec table
belongs where the reference has one.

**Everything inside one centered container.** Every section at one max
width, nothing reaching the edge. [`no-full-bleed`, `same-max-width`]
Instead: the reference's bleeds and measures. When it has none, keep none
and the warnings with a Do's and Don'ts line.

**Uniform section rhythm.** Every section the same padding and the same
weight. [`uniform-section-padding`]
Instead: the reference's measured gap-to-content rhythm. No gap taller than
the content beside it unless the reference does that.

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
Instead: replace the photo's job with the reference's non-photo device. No
gap taller than the content beside it unless the reference does that.

## Imagery

**Clip art standing in for a photo.** Flat geometric vector drawings where
the reference has photography: a bin with three "text lines", a sprout in a
box, a hand tool that reads as something else, a structure drawn as a box
with braces, a barcode waveform.
Instead: a real founder asset or the reference's non-photo device. Use at
most two inline photo slots, never in the hero or full bleed
[`photo-slot-budget`, `photo-slot-placement`]. Draw only where the reference itself draws.

**Copying the reference's unloaded grey.** Grey or tinted blocks taken from
a full-page capture whose images did not load.
Instead: treat those boxes as image regions and fill them.

**Hatch as the page's leading visual.** A placeholder fills the hero or a
full-bleed band, or three or more slots make most of the page a wireframe.
[`photo-slot-budget`]
Instead: use the reference's color field, artifact, type, masthead or cell
grid as the leading visual. Keep at most two inline slots for real shots.

## Copy and gaps

**Dashed grey NEED boxes.** A 1px dashed or dotted box in a grey sans, with no
padding, splitting into two half boxes at a line break and butting against
the next word ("Within[NEED: days]days"). Or raw brackets with no marker at
all. Both read as a broken render.
Instead: the gap marker in design-rules.md: the page's own text face, a soft
highlight whose hue differs from all DESIGN.md accents [`need-marker-hue`],
or an underline; keep a real space each side.

**The same grey terms line under every button.** "Charged today. Refunds:
[NEED]" in 13px grey under each ask, on every page.
Instead: the money terms once, where the reference puts its small print, in
its style (SKILL.md, Rules for every stage).

**A label/value table for every offer.** The same price, timing and refund
rows appear regardless of the reference.
Instead: put the terms once in the reference's small-print form.

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
1440, the reference at 1440 and as a full page (or the founder's screenshot),
and this catalog. You know nothing about why the page was made this way; a
critic who knows will excuse it.

"List anything a professional designer would read as AI-made, worst first.
Compare the two full pages section by section: order, layouts, gaps,
imagery."
Write the list to `<page>/.first-dollar/critic.md`, numbered, worst first.
One item each: the tell, its region (section, and 1440 or 390), and what to
do, from the "Instead" lines here. Mark an item "ref" when the reference does
the same thing. Tells not in this catalog count too.
