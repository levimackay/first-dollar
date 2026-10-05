# Copy

Load at stage 2. Output: COPY.md, written before any design exists. Real copy
at real lengths is what the layout gets built around.

## Order of work

1. Read BRIEF.md: thesis, ask, price, kill number, and what is real so far.
2. Write the spine: four sentences.
3. Write three headlines, one per angle. Pick the one to test first.
4. Write each section from the spine. Length follows the price (below).
5. Write the objection pairs.
6. Run the self-check and the swap test on every headline, heading and button.
7. Run the final audit. List every placeholder.

## The spine

One sentence each, before any section exists. A slot you cannot fill becomes
`[NEED: ...]`. Never pad it.

- Promise: the outcome the buyer gets, in the buyer's words.
- Mechanism: how the product produces it. The one specific thing that is new.
- Proof: why believe it now. Before launch, proof is thin and that is fine:
  the founder's relevant history, a working prototype, a video of it running,
  a design partner who agreed to be named. No proof yet: `[NEED: proof]`.
- Action: the commitment, its price, the refund terms, and what happens right
  after the click (see commitment.md). Money terms are the founder's or a
  `[NEED: ...]` slot.

Example, for a fictional voice memo tool:

- Promise: "Every change on the job gets signed before the crew leaves."
- Mechanism: "Record a voice memo. It becomes a priced change order the client
  signs on their phone."
- Proof: `[NEED: proof, e.g. prototype video or the founder's years on crews]`
- Action: "Pre-order your first month for $40. Refunds: [NEED: refund terms]."
  (The $40 is the founder's price in this example.)

## Three headline angles

| Angle | Says | Example |
|---|---|---|
| Outcome | What is true after | "Get every change order signed before you leave the driveway." |
| Pain | Today's cost, in the buyer's words | "Stop eating the cost of changes nobody wrote down." |
| Mechanism | The new way, concretely | "Talk through the change. Your client signs it on their phone." |

Which to test first:

- Pain, when the visitors already said they have the problem (outreach to
  people who complained, a community thread).
- Outcome, for cold traffic that has not named the problem yet.
- Mechanism, when buyers already compare tools in a crowded category.

Filter: put "Now you can" in front of the headline. If the result is false, or
nobody would want it, rewrite.

Hero limits: headline at most two lines at 1440, one supporting sentence, then
the commitment block. Nothing else competes in the first screen.

## The swap test

Replace the product name with the closest competitor, or the current
workaround. If the line is still true, it says nothing. Run it on the headline,
the subhead, every section heading and the button.

| Before (passes for anyone) | After (only true here) |
|---|---|
| "The smarter way to manage change orders." | "Talk through the change. Your client signs it on their phone." |
| "Built for teams who care about quality." | "Built for crews of 2 to 10 who bill by the change." (only if the founder said so) |
| "Features" (section heading) | "What happens after you hit record" |

## Tells

Each row is a pattern readers now recognize as generated. Where a lint rule
catches it, the id is in the second column.

| Tell | Lint rule | Why it reads as generated | Rewrite |
|---|---|---|---|
| Stock marketing verbs and adjectives: streamline, seamless, empower, unleash, elevate your, robust, cutting-edge, all-in-one, next-gen | `buzzwords` | They fit every product, so the reader learns nothing | Name the action and the object: "seamless invoicing" becomes "the invoice goes out when the job closes" |
| "It's not X, it's Y", "Not a tool. A platform." | `not-x-but-y` | A reveal aimed at a strawman nobody raised | Say Y and drop X |
| Em dashes in copy | `em-dash` | The punctuation habit most associated with generated text | A period, comma, colon or parentheses |
| A number with nothing behind it: "Trusted by 10,000 teams", "40% faster" | `invented-metric` | A page with no customers cannot have these. A precise fake reads honest and is false | The founder's real number with its source, or `[NEED: metric]`, or cut the line |
| Testimonial cards: first name and initial, five stars, "Amazing!" | `testimonial-signature` | Pre-product pages have no customers to quote | No testimonials. Use the founder's own reason for building it, or `[NEED: quote from design partner, with permission]` |
| "Trusted by" logo strips | `logo-row` | Borrowed logos stand in for evidence the page lacks | Cut. Name a real design partner only with written permission |
| A row of three big numbers with tiny captions | `stat-row` | The template's stand-in for proof | One real number in a sentence, with its source |

Patterns the lint cannot see. Judge by clusters, not single hits:

- Self-answered questions: "The result? Hours saved."
- Colon reveals: "One word: speed."
- A list of three in every paragraph. One per section at most.
- Sentences that trail into extra comma clauses.
- Fragments for drama: "Fast. Simple. Yours."
- Openers like "Imagine a world where", "In today's fast-paced world",
  "Say goodbye to".
- Vague section headings: "Features", "Why us", "How it works".

Self-check, mechanically:

1. Search headlines, subheads and buttons for ` not `, `no `, `without`, `?`
   and `:`. Each hit is a reveal or a question. Keep it only if it is plain.
2. Reread every sentence over 20 words. Split or cut.
3. Count lists of three per section.
4. Read the page aloud. Rewrite any line you would not say to a buyer.

Keep the signs of a person: odd specifics, uneven sentence lengths, a plain
admission ("We have not shipped yet.").

## Length follows the price

- Pre-order under $100: the first screen, the objection answers, the founder,
  the legal links. Often one screen plus a short scroll.
- Deposit: add how it works and when it ships.
- Pilot or LOI: add scope, success measure, who runs it, and the pilot terms in full.

Never add a section to fill space. Every section answers a question the buyer
has before paying.

## Objections

Write a table in COPY.md: objection, the line that answers it, where it goes.
Defaults for any page before launch:

| Objection | Answer on the page | Placement |
|---|---|---|
| What happens to my money? | Who charges, when, and the founder's refund terms, or `[NEED: refund terms]` | Beside the button |
| When do I get it? | The founder's date, or `[NEED: ship date]` | Beside the button |
| What if it never ships? | The founder's answer, or `[NEED: what happens if it never ships]` | Beside the button |
| Why pay now? | Only a real reason the founder gave: a founding price, batch one, a pilot slot | Near the button, or nothing |
| Who is behind this? | Founder name or `[NEED: founder name]`, real photo or `[PLACEHOLDER: founder photo]`, one line of history from BRIEF.md | After the mechanism |
| Is it for someone like me? | Who it is for and who it is not for | Mid page |

Find extra objections in competitor reviews and community threads. Never write
softballs ("Is it easy to use?" "Yes!"). Every answer is a fact from the founder
or a `[NEED: ...]`.

## Customer language

Before reviews exist, borrow the buyer's words from where they complain:
1 to 3 star reviews of competitors, app store reviews, forums, Reddit, Hacker
News, the founder's interview notes.

- Record each phrase in COPY.md with its source URL, the date, and the tag
  `provisional`.
- Use it to choose words for the pain angle and the objections. Paraphrase into
  your own sentence.
- Never show it as a testimonial, attach a name, or quote a stranger on the page.
- Fewer than 5 phrases from different people is an anecdote, not a pattern.
  Say so in COPY.md.

## Placeholders

- `[NEED: what fact, from whom]` for a missing fact: price, date, legal name,
  founder bio, proof.
- `[PLACEHOLDER: what asset, size]` for a missing asset: founder photo, product
  shot, prototype video.
- They show on the page as plain bracketed text in a plain box (hatched when
  it stands in for an image, design-rules.md). Never styled to look finished
  (`placeholder-styled`), never hidden in comments.
- Never trade one invention for a vaguer one. "10,000 teams" changed to
  "hundreds of teams" is still invented.
- List them in COPY.md. At ship, the ones still in the published pages move
  to PLACEHOLDERS.md with the marker, file:line, who supplies it, and whether
  it blocks deploy. These block deploy: the checkout or LOI link, the price,
  the refund terms, the legal entity, and for physical goods the ship date and
  the delay policy (SKILL.md stage 7).

## Final audit

Run before leaving stage 2, and again after the build.

1. List every number, name, date, company, logo, quote and capability on the page.
2. Beside each, the line of BRIEF.md (the founder's input) it came from.
3. No source: replace it with `[NEED: ...]` or cut it.
4. Answer in COPY.md: "Does the page state any fact the founder did not give?"
   The answer must be no.
5. Answer: "What three things make this read as generated?" Fix them.

## COPY.md layout

```
# COPY
Thesis: [who] will pay [$] to [outcome].
Workaround today: ...
## Spine (Promise, Mechanism, Proof, Action)
## Headlines (angle, line, test order and why)
## Sections (page order, final copy)
## Objections (objection | answer | placement)
## Legal pages (what privacy.html and terms.html must say: legal entity, contact, payment processor, refund terms, data collected; each the founder's or a [NEED: ...])
## Customer language (phrase | source URL | date, all provisional)
## Placeholders (marker | who supplies it | blocks deploy?)
## Audit (fact | source line in BRIEF.md)
```
