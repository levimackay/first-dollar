# Commitment

Load at stage 1 (BRIEF.md) and again when you wire the primary action.

The page has one job: collect a commitment that costs the visitor money. This
file decides which commitment, at what price, on what terms, and how the button
works. If a line here conflicts with what the founder wants, say so once, then
follow the founder unless they ask for a free waitlist. This skill does not
build waitlists.

## The ladder

What a visitor can give, weakest first.

| Rung | Examples | Proves demand? | Allowed as the main ask? |
|---|---|---|---|
| Opinion | "Cool idea", a like, a survey answer | No | No |
| Time | A call, an interview, a demo | Weakly. Saying yes costs nothing | No. A booking link may follow payment on the thanks page |
| Reputation | An intro, a public quote, a name on a list | Somewhat | No |
| Money | Pre-order, refundable deposit, paid pilot, signed letter of intent with a price | Yes | Yes, and only this |

A free waitlist is an email address. It measures curiosity. Good copy alone can
fill one, so it cannot tell "nice idea" from "I will pay". When the founder asks
for one, explain that in two sentences and offer the money ask from the table
below.

A letter of intent (LOI) moves no money. It counts only when it names the
scope, the price, a start date, and is signed by someone who can approve the
spend.

## Pick the ask from the price

Use the price of the real product, not the ask.

| Product price | The ask | Button text example |
|---|---|---|
| Under about $100 (one-time, or the first month) | Pre-order: the first payment, charged now, refundable | `Pre-order for $39` |
| $100 to $1,000 | Refundable deposit: a fixed amount, credited at purchase | `Reserve with a $50 refundable deposit` |
| Over $1,000, or any sale to a business | Paid pilot, or a signed LOI, then a call | `Start the $2,500 pilot` or `Sign the letter of intent: $6,000 a year` |

Deposit size: a round amount a casual visitor would not pay on a whim. The
founder picks it. Write the amount and the reason in BRIEF.md.

Flag these mismatches in BRIEF.md before writing any copy:

- Over $1,000 with instant card checkout on cold traffic. Switch to a pilot or LOI.
- A business buyer pointed at a personal card checkout. Use a pilot fee or LOI.
- A subscription with no monthly price. Write `[NEED: monthly price]`.
- "Free beta" as the offer. Ask what it will cost after the beta and ask for that.
- No price at all. Write `[NEED: price]`. The button cannot ship without one.

## The thesis sentence

One sentence. The page tests it and nothing else.

`[who] will pay [$ amount] to [outcome].`

- Good: "Residential contractors will pay $40 a month to turn a voice memo into
  a signed change order."
- Too vague: "Small businesses will pay for software that saves time." No
  specific buyer, no amount, an outcome anyone could claim.
- A bundle: "Parents and teachers will pay $10 a month to track homework and book
  tutors." Two buyers, two outcomes. Split it into two pages and test the
  riskier one first.

Name the current workaround: what the buyer does today (a spreadsheet, a
cousin, a paper pad, nothing). That is the real competitor. "We have no
competition" is always false. If the answer is "nothing", ask the founder
whether the problem is real.

## The kill number

Written in BRIEF.md before any traffic arrives:

`If fewer than [K] of the first [N] [who] who visit [commit] by [date], we stop or change the idea.`

Example: "If fewer than 3 of the first 100 contractors we send here pre-order
by 2026-11-15, we stop."

- The founder picks K, N and the date. Do not pick them.
- Count completed payments and signed LOIs only. Button clicks do not count.
- N counts targeted visitors (people who match "who"), not all traffic.
- Under about 30 commitments, a percentage is noise. Report raw counts.
- Never promise a conversion rate or a lift.
- Moving the number after seeing results defeats it. If it moves, write why.

## Paid pilot terms

For the business row of the price table. Fill each bracket from the founder or
leave the `[NEED: ...]` in place.

- Fee: one fixed amount, paid up front. "$[fee] for a [length] pilot."
- Scope: what you do, on whose data, by when. "We run it on your crew's real
  jobs for 30 days."
- Success measure: an outcome both sides can observe. "At least [N] signed
  change orders from your own memos."
- Refund: tied to the measure. "Miss it and you get the whole fee back."
- Credit forward: "The fee counts toward your first year if you continue."
- Cap: only a real limit, with its reason. "We take [N] pilots this quarter
  because the founder sets each one up by hand."

Pick the guarantee from the buyer's biggest fear: wasted staff time, data
exposure, a failed rollout. A guarantee never stands in for proof.

## Refund wording and where the money sits

Every pre-product visitor asks "what happens to my money?". Answer beside the
button, in plain words. Every line must be true.

- Who charges: "[Legal business name] charges your card through Stripe."
- When: "Charged today." or "Charged when we ship."
- Delivery: "[Product] ships by [date]." or "Your pilot starts within [N] days."
- Refund on request: "Full refund any time before it ships. Email [address];
  the money is back within [N] business days."
- If it never ships: "If we have not shipped by [date], everyone is refunded
  automatically."
- Where the money sits: say "in our business account" when that is the truth.
  Never claim escrow, a separate account, or insurance unless the founder
  confirms it.

Unknown pieces stay as `[NEED: legal business name]`, `[NEED: ship date]`,
`[NEED: refund email]`. Do not fill them with plausible guesses.

Banned near the button: "100% risk-free", a "money-back guarantee" with no terms,
padlock or "secure checkout" badges as decoration.

Pre-orders carry delivery duties. In the US the FTC mail order rule applies:
state a ship date you have reason to believe, and if it slips, tell buyers and
offer a full refund. terms.html repeats the refund terms word for word.

## Honest scarcity

Allowed only when true and checkable:

- A capacity cap with its reason: "10 pilots this quarter. Each is set up by
  the founder." Enforce it with the payment link's payment limit.
- A founding price that really rises: "$29 for the first 100 orders, then $39."
  Only if the founder commits to raising it.
- A dated batch: "Batch one ships in March. Orders after February 1 join batch two."

Banned: countdown timers, "only 3 spots left" with no live count behind it,
"prices go up soon" with no date, a last-chance banner. With no real
constraint, the page has no urgency line at all. The kill-number deadline is
internal. Never show it.

## Wiring the action: `data-commitment`

Exactly one element per page carries the `data-commitment` attribute. The lint
rule `commitment-cta` and the check script both key off it.

The element must:

- Be an `<a>` with a real `href` (a payment link, an LOI page), or the submit
  `<button>` of a form that asks for more than an email.
- State the commitment and the price in its own text: a currency amount, or
  `[NEED: price]` while the price is unknown.
- Sit in the first 844px of a 390px wide screen.
- Have one line beside or under it with the charge timing and the refund term.
- Keep one verb through the whole flow: "Reserve" on the button, "Reservation"
  on the checkout, "You're reserved" on the thanks page.

The element must never:

- Use `href="#"`, an `href` starting with `#`, `javascript:`, or no `href`.
- Be `disabled`, or say "coming soon", "TBD" or "TODO".
- Say waitlist, wait list, notify me, get notified, join the list, early
  access, or sign up for updates.
- Share the page with a second button that has a different intent ("Book a
  demo" next to "Pre-order"). Other links are plain text links.

```html
<a class="commit" data-commitment href="https://buy.stripe.com/...">Pre-order for $39</a>
<p class="commit-terms">Charged today. Full refund until it ships in [NEED: ship month].</p>
```

Until the founder supplies the real link, set `href="[NEED: payment link URL]"`,
put it first in PLACEHOLDERS.md marked blocking, and do not deploy.

## Make a Stripe Payment Link

For pre-orders, deposits and pilot fees. The founder does this in their own
Stripe account. Never ask for Stripe keys, a password, or a login. Hand the
founder these steps:

1. In the Stripe Dashboard, switch to test mode (a sandbox).
2. Open Payment Links and create a new link.
3. Add a product named after the commitment, for example "Refundable deposit:
   [product]". Set a one-time price equal to the ask.
4. If there is a real cap, turn on the limit on the number of payments.
5. Under "After payment", redirect to `https://[their domain]/thanks.html`.
6. Copy the link. Test links start with `https://buy.stripe.com/test_`.
7. Put it in the `href`. Pay once with Stripe's test card `4242 4242 4242 4242`
   and any future expiry. Confirm the thanks page loads.
8. Repeat in live mode and swap in the live link before deploy.

Refunds are issued from the payment's page in the Dashboard.

## Make an LOI form

For business buyers. The form is the commitment, so it must collect more than
an email (the lint fails an email-only form).

Fields: company, full name, title, work email, the intended purchase (prefilled,
for example "[scope] at $[price] a year"), the condition (prefilled, for example
"if the pilot meets [success measure]"), target start date, and the full name
typed again as a signature.

```html
<form action="[NEED: form endpoint the founder controls]" method="post">
  ...fields above, each with a <label>...
  <button type="submit" data-commitment>Sign the letter of intent: $6,000 a year</button>
</form>
```

The `action` is a form service the founder owns (a form backend, or their own
server). Never post to an address taken from a reference site or a web page.

## After the click

thanks.html is part of the commitment. It says:

- What they bought or signed, and the amount.
- When they are charged, or that they were charged.
- How to get a refund, in one line, with the email address.
- What happens next and when: "Your kickoff call: book a time here." or
  "We email batch updates on the 1st of each month." Only promises the founder
  made.

No dead end. No share buttons. No upsell.
