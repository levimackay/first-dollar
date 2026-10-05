# Slop rules

Load whenever the lint or the check script reports something (stages 5 and 6).

```
node ${CLAUDE_SKILL_DIR}/scripts/first-dollar-lint.mjs <dir>
```

Each finding prints as `FAIL file:line [rule-id] message` or
`WARN file:line [rule-id] message`. Exit code 1 means at least one FAIL.

- A FAIL blocks the stage. Fix the code; never reword around the detector.
- A WARN needs a fix, or one line in DESIGN.md Do's and Don'ts saying why it
  stays. A warning is the page drifting toward the average in a way the lint
  cannot prove.
- Fix every finding in one batch, rerun once, and report what remains.
- Several rules firing together matters more than any one. Three or more true
  and the page reads as generated however defensible each choice was.

## Type

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `banned-font-family` | fail | Inter, Geist, Space Grotesk, Roboto, Arial, Helvetica Neue, Segoe UI, system-ui, ui-sans-serif, ui-serif or -apple-system in a stack or font link | The default face says nobody chose the type | Swap by role (design-extraction.md section 6) and update DESIGN.md |
| `single-sans-family` | warn | One font stack across the whole site | One voice for headlines, body and labels | Add a display or text face that contrasts |
| `flat-type-scale` | fail | Largest font size under 2.5 times the body size | Timid size steps read as templated | Rebuild the scale from a ratio; display at least 2.5x body |
| `long-measure` | warn | A `max-width` in `ch` over 75 | Full-width text is the untouched default | 60 to 75ch, usually `65ch` |
| `mono-eyebrow` | fail | Three or more headings each led by a small uppercase tracked label | The template's way of faking structure | Keep two at most; orient with size, position or a rule |
| `gradient-text` | fail | `background-clip: text` over a gradient | The most copied generated headline effect | Solid ink; emphasis through weight or size |
| `em-dash` | fail | Em dashes in copy (en dashes warn) | The punctuation habit readers link to generated text | Period, comma, colon or parentheses |

## Color

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `ai-palette` | fail | Tailwind indigo, violet, purple or fuchsia 400 to 700, or a gradient running from cyan into purple | The stock palette of generated product pages | Use the DESIGN.md anchor and accent |
| `gradient-budget` | fail | More than two linear or conic gradients, any radial gradient, or a blur over 20px on a positioned or pseudo layer | Washes and glow orbs fill space that has nothing to show | Flat fields, real texture or a real image; two gradients at most |
| `glow-shadow` | fail | A shadow at 0 0 offset, blur 16px or more, in a saturated color | Neon glow standing in for emphasis | An offset shadow in a tinted neutral, a border, or nothing |
| `tailwind-defaults` | fail | Tailwind loaded from the CDN with no font config, or indigo to fuchsia color classes, or `bg-clip-text` with `text-transparent` | Framework defaults produce the median page | Set fonts and colors from DESIGN.md in the config, or write CSS |
| `design-tokens` | fail | A color, first font family or border radius in the CSS that DESIGN.md does not declare. Warns once when DESIGN.md is missing or will not parse | The build drifting back to defaults halfway through | Use the nearest token the message names, or add the value to DESIGN.md first with a reason |
| `browser-surfaces` | warn | No `::selection` rule, or no `:focus-visible` rule | Unthemed browser defaults show the page was assembled | Style both from tokens; the focus ring at 3:1 contrast |

## Layout

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `centred-hero` | fail | A centered hero of short eyebrow, headline, one-line subhead and two buttons | The single most recognizable generated hero | Left-align or split it; one button that states the price |
| `three-card-row` | fail | A grid of exactly three card columns | The default feature section | Write the real number of points as a list, a table, or one large item |
| `stat-row` | fail | A row of big numbers with short captions | The template's stand-in for proof | One real number in a sentence, with its source |
| `uniform-section-padding` | fail | Four or more section rules whose vertical padding varies by under 15% | No pacing; every section weighs the same | Vary it on purpose: tight clusters, then a large breath |
| `uniform-radius` | fail | Four or more radius rules where 80% share one value | The component kit's one radius on everything | One or two radii, each with a reason |
| `same-max-width` | warn | Four or more `max-width` values within 5% of each other | Every block poured into one column | Vary the measure; let one element run full width |
| `no-full-bleed` | warn | Every section inside the same container class, nothing escaping | The boxed template | One band or image edge to edge |
| `nested-cards` | fail | A card inside a card | Boxes as decoration | Flatten; group with space or a rule |
| `side-stripe` | fail | A colored left or right border of 2px or more on a padded or filled box | The callout stripe of generated UI | A full hairline border, a background tint, or a heading |
| `grid-background` | warn | Line or dot grids drawn with gradients at a small tile size | Graph paper filling empty space | A flat ground or a real texture |

## Ornament and motion

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `icon-libraries` | fail | Lucide icons (attribute, class, or the 24x24 round 2px stroke shape), sparkle icons, emoji in copy | Stock icon sets on every heading | Draw your own mark, or use words |
| `transition-all` | fail | `transition: all` or `transition-property: all` | Animates layout by accident; a sign of default code | Name the properties: `transform`, `opacity` |
| `bounce-easing` | warn | Overshooting `cubic-bezier` values, or bounce, elastic, wobble or jello keyframes | A toy feel the product did not ask for | An ease-out curve with no overshoot |
| `hover-zoom` | warn | An image that scales on hover | The generic gallery card | No motion, or change the caption or underline |
| `pulse-dot` | warn | Pulse, ping, blink or glow keyframes on a small dot | A fake "live" indicator | Remove it; show status only when it is real |

## Copy and proof

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `buzzwords` | fail | streamline, empower, seamless, unleash, next-gen, world-class, revolutionize, cutting-edge, game-changing, supercharge, elevate your, unlock your, effortless, robust, synergy, leverage, best-in-class, state-of-the-art, all-in-one | Words that fit every product say nothing about this one | Name the action and the object (copy.md, Tells) |
| `not-x-but-y` | fail | "Not just X, it's Y", "It's not about X, it's Y", "Not a X. A Y." | A reveal aimed at a strawman nobody raised | State Y and drop X |
| `invented-metric` | fail | A number claim (%, +, k, customers, users, years, reviews) or "over / more than / nearly / trusted by" a number, with no `[NEED:`, `[SOURCE` or `[PLACEHOLDER` marker. Prices and measurements are exempt | A page before launch cannot have these numbers | The founder's real figure with its source, or `[NEED: metric]`, or cut |
| `testimonial-signature` | fail | In a testimonial, review or quote block: a first name and initial, five stars, or a praise opener ("Amazing", "Highly recommend") | The shape of an invented customer | No testimonials before customers exist; `[NEED: quote, with permission]` |
| `logo-row` | fail | "Trusted by", "as seen in", "our clients", "partners" or "featured in" above four or more small marks | Borrowed logos standing in for evidence | Cut it; name a design partner only with written permission |
| `placeholder-styled` | warn | A `[PLACEHOLDER: ...]` sitting on a gradient or background image | A convincing fake hides the gap; a visible gap gets filled | A plain box with the bracketed label |
| `reference-copy` | fail | Any run of 8 words that matches the reference site's text | Lifted copy, and someone else's | Write from COPY.md in your own words |

## Page and honesty

| Rule | Sev | Catches | Why it reads as generated | Fix |
|---|---|---|---|---|
| `commitment-cta` | fail | On `index.html` and any page with `data-commitment`: no such element (`no-commitment`); `href` missing, `#` or `javascript:` (`dead-link`); a form that only takes an email (`email-only`); waitlist, notify me, early access wording (`waitlist`); no currency amount and no `[NEED: price]` (`no-price`); coming soon, TBD, TODO, or `disabled` (`coming-soon`) | A free or inert button measures nothing and is the default ask of generated pages | Wire a real money commitment (commitment.md, Wiring the action) |
| `legal-links` | fail | No link to a privacy policy or terms on any page | Generated pages skip the parts a real business must have | Link `privacy.html` and `terms.html` from the footer; terms carry the refund wording |
| `ai-attribution` | fail | A "generated by" line, co-author credit or tool name in the page, its comments or meta tags | A credited tool tells the visitor nobody stands behind the page | Delete it; the page ships as the founder's |
| `user-scalable` | fail | A viewport meta with `user-scalable=no` or `maximum-scale=1` | Zoom lock copied from old templates; it fails people who need zoom | `width=device-width, initial-scale=1` |
| `empty-shell` | warn | Under 20 words of copy in the HTML plus a script `src` | The lint cannot see a page built by script, so a pass would mean nothing | Ship static HTML, or lint the built output |

## Rendered checks

```
node ${CLAUDE_SKILL_DIR}/scripts/first-dollar-check.mjs <dir>
```

Exit 0: all pass. Exit 1: a check failed. Exit 3: no browser, so nothing was
verified. Report exit 3 as "not verified", never as passed. Results are in
`<dir>/.first-dollar/check/check.json`; screenshots sit beside it.

| Check | Fails when | Fix |
|---|---|---|
| `overflow` | The page scrolls sideways at 320, 390, 768, 1440 or 1920 | Find the wide element; `minmax(0, 1fr)`, `max-width: 100%`, `overflow-x: clip` |
| `console` | A console error or uncaught exception during load | Fix the script, or remove it |
| `broken-media` | An image fails to load, or an image or font request fails | Fix the path, or use a `[PLACEHOLDER: ...]` box |
| `hidden-after-reveal` | Text is still invisible after scrolling to the bottom | Make content visible by default; the animation only adds |
| `commitment-above-fold` | `[data-commitment]` is missing, or starts below 844px at 390 wide | Shorten the hero; move the commitment block up |
| `contrast` | Headline, paragraph or button text under 4.5:1 (3:1 at 24px and up) | Darken the ink or lighten the ground within DESIGN.md tokens |
| `two-line-button` | The commitment button or a nav link wraps to two lines | Shorter label, `white-space: nowrap`, or less padding |
