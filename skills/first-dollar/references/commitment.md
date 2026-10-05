# Commitment

Load at stage 1 (BRIEF.md) and again when you wire the primary action.

The page has one job: collect a commitment that costs the visitor money. This
file decides which commitment, at what price, on what terms, and how the button
works. Every money term (price, deposit, pilot fee, refund window, refund
condition, where the money is held, credit forward, caps) is a fact the founder
supplies. Where the founder has not, write the `[NEED: ...]` slot shown here.
Never turn a slot into a finished sentence yourself.

## The ladder

What a visitor can give, weakest first.

| Rung | Examples | Proves demand? | Allowed as the main ask? |
|---|---|---|---|
| Opinion | "Cool idea", a like, a survey answer | No | No |
| Time | A call, an interview, a demo | Weakly. Saying yes costs nothing | No |
| Reputation | An intro, a public quote, a name on a list | Somewhat | No |
| Money | Pre-order, deposit, paid pilot, signed letter of intent with a price | Yes | Yes, and only this |

A free waitlist is an email address. It measures curiosity. Good copy alone can
fill one, so it cannot tell "nice idea" from "I will pay". When the founder asks
for one, build the priced version and explain why at the first stop (SKILL.md,
stage 1).

A letter of intent (LOI) moves no money. It counts only when it names scope,
price and start date, signed by someone who can approve the spend.

## Pick the ask from the price

Price decides first. Buyer type matters only when the sale needs a call. A
business paying a small amount by card is still a pre-order.

| Price of the real product | The ask | Button label shape |
|---|---|---|
| Under about $100, per month or one-time, bought self-serve by any buyer | Pre-order, or the first period paid up front | `Pre-order for [price]` |
| About $100 to $1,000 | Deposit: a fixed amount; refund and credit terms are `[NEED: deposit terms]` | `Reserve with a [deposit] deposit` |
| Over about $1,000, or any sale that needs a call (procurement, a contract, an invoice, a team's sign-off) | Paid pilot, or a signed LOI, then a call | `Start the pilot for [fee]` or `Sign the letter of intent: [price]` |

`[price]`, `[deposit]` and `[fee]` come from BRIEF.md, or stay
`[NEED: price]`, `[NEED: deposit]`, `[NEED: pilot fee]`. If the founder gave a
price but no ask, propose the row's ask and mark it a suggestion until they
agree.

Flag these mismatches in BRIEF.md before writing any copy:

- Over $1,000 with instant card checkout on cold traffic. Suggest a pilot or LOI.
- A purchase that needs an invoice or sign-off pointed at card checkout.
  Suggest a pilot or LOI.
- A subscription with no monthly price. Write `[NEED: monthly price]`.
- "Free beta" as the offer. Ask what it will cost after the beta and ask for that.
- No price at all. Write `[NEED: price]` in the button label. Never invent one.

## The thesis sentence

One sentence. The page tests it and nothing else.

`[who] will pay [$ amount] to [outcome].`

- Good: "Residential contractors will pay $40 a month to turn a voice memo into
  a signed change order." Under $100, self-serve: a pre-order of the first
  month, even though the buyer is a business.
- Too vague: "Small businesses will pay for software that saves time." No
  specific buyer, no amount, an outcome anyone could claim.
- A bundle: "Parents and teachers will pay $10 a month to track homework and book
  tutors." Two buyers, two outcomes. Split it into two pages and test the
  riskier one first.

Name the current workaround (a spreadsheet, a cousin, a paper pad, nothing).
That is the real competitor; "we have no competition" is always false. If it
is "nothing", ask the founder whether the problem is real.

## The kill number

Written in BRIEF.md before any traffic arrives:

`If fewer than [K] of the first [N] [who] who visit [commit] by [date], we stop or change the idea.`

Example: "If fewer than 3 of the first 100 contractors we send here pre-order
by 2026-11-15, we stop."

- The founder sets K, N and the date. You may suggest numbers; mark them as a
  suggestion until the founder agrees. Missing: `[NEED: kill number and date]`.
- Count completed payments and signed LOIs only. Button clicks do not count.
- N counts targeted visitors (people who match "who"), not all traffic.
- Under about 30 commitments, a percentage is noise. Report raw counts.
- Never promise a conversion rate or a lift.
- Moving the number after seeing results defeats it. If it moves, write why.

## Paid pilot terms

For the top row of the price table. Each term is the founder's. Write the
template with its slots and fill only what BRIEF.md holds.

- Fee: `[NEED: pilot fee], paid up front, for a [NEED: pilot length] pilot.`
- Scope: `We [NEED: what you do] on [NEED: whose data or jobs] by [NEED: date].`
- Success measure, observable by both sides: `[NEED: success measure]`.
- Refund condition: `[NEED: refund condition, e.g. full fee back if the success measure is missed]`.
- Credit forward: `[NEED: whether the fee counts toward a contract, and how]`.
- Cap, only if real: `[NEED: number of pilots and the reason for the limit]`.

If the founder offers a guarantee, help aim it at the buyer's biggest fear
(wasted staff time, data exposure, a failed rollout). It never replaces proof.

## Refund wording and where the money sits

Every pre-product visitor asks "what happens to my money?". Answer beside the
button. The refund policy is the founder's. If BRIEF.md has none, the page shows
`Refunds: [NEED: refund terms]`. You may offer the lines below to the founder
as a suggestion at the first stop; they go on the page only after a yes.
`Charged today.` is the one exception: it is simply true of a Payment Link.

- Who charges: `[NEED: legal business name] charges your card through [NEED: payment processor].`
- When: `Charged today.` A Payment Link charges at checkout. Charging later
  (saving the card and charging when you ship) needs a different Stripe setup
  the founder must build and confirm first. Never write it otherwise.
- Delivery: `Ships by [NEED: ship date].` or `Your pilot starts within [NEED: days] days.`
- Refund window: `[NEED: refund window, e.g. any time before it ships]`.
- Refund route and timing: `Email [NEED: refund email]. Refunds reach your bank in [NEED: days] business days.`
  Stripe says refunds typically take 5 to 10 business days; suggest that.
- If it never ships: `[NEED: what happens if it never ships, e.g. everyone refunded by a date]`.
- If it ships late, physical goods only: `[NEED: delay policy, e.g. we email you before the date and you choose to wait or take a full refund]`. It must fit the FTC rule below.
- Where the money is held: `[NEED: where the money is held]`. Never claim
  escrow, a separate account, or insurance unless the founder confirms it.

Banned near the button: "100% risk-free", a "money-back guarantee" with no terms,
padlock or "secure checkout" badges as decoration.

Selling physical goods ahead of shipping in the US falls under the FTC's Mail,
Internet, or Telephone Order Merchandise Rule. Services are outside it. In
short: have a reasonable basis for any ship date you state; with no date
stated, you need a reasonable basis to ship within 30 days, so never publish a
physical pre-order still showing `[NEED: ship date]`; if a delay comes, tell
buyers and get their consent to wait, or cancel and refund them promptly.
Guide: https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule
Not legal advice; the founder checks the rules that apply to them.
terms.html repeats the founder's refund terms word for word.

## Honest scarcity

Every cap, rising price and batch date is the founder's fact. The shapes below
are allowed only when the founder supplies the values and they are true:

- A capacity cap with its reason: `[NEED: cap] [what] this [period]. [NEED: reason for the limit].`
  Enforce it with the payment link's payment limit.
- A founding price that really rises: `[NEED: founding price] for the first
  [NEED: count] orders, then [NEED: later price].` Only if the founder commits
  to raising it.
- A dated batch: `Batch one ships [NEED: date]. Orders after [NEED: cutoff] join batch two.`

Banned: countdown timers, "only 3 spots left" with no live count behind it,
"prices go up soon" with no date, a last-chance banner. No real constraint, no
urgency line. The kill-number deadline is internal; never show it.

## Wiring the action: `data-commitment`

The page has one commitment. Its element carries the `data-commitment`
attribute. You may repeat it lower on the page with the same words, price,
`href` and attribute. Nothing else carries the attribute. The lint rule
`commitment-cta` and the check script both key off it.

The element must:

- Be an `<a>` with a real `href` (a payment link, an LOI page), or the submit
  `<button>` of a form that asks for more than an email.
- State the commitment and the price in its own text: a currency amount, or
  `[NEED: price]` while the price is unknown.
- Sit in the first 844px of a 390px wide screen.
- Have one line beside or under it with the charge timing and the refund terms
  (or their `[NEED: ...]` slots).
- Keep one verb through the whole flow: "Reserve" on the button, "Reservation"
  on the checkout, "You're reserved" in the confirmation message.

The element must never:

- Use `href="#"`, an `href` starting with `#`, `javascript:`, `mailto:`, or no `href`.
- Be `disabled`, or say "coming soon", "TBD" or "TODO".
- Share the page with a second button that has a different intent ("Book a
  demo" next to "Pre-order"). Other links are plain text links.

Advice, stricter than the lint: also avoid waitlist, notify me, get notified,
join the list and sign up for updates in the label, even with a price. They
tell the visitor nothing will happen yet.

```html
<a class="commit" data-commitment href="https://buy.stripe.com/...">Pre-order for $40</a>
<p class="commit-terms">Charged today. Refunds: [NEED: refund terms].</p>
```

Until the founder supplies the real link, a payment ask (pre-order, deposit,
pilot fee) gets `href="[NEED: checkout link]"`. An LOI ask gets
`href="[NEED: LOI form link]"`, or the URL of the founder's form. It goes first
in PLACEHOLDERS.md. Do not deploy without the founder's explicit yes, after
telling them the button is dead.

## Make a Stripe Payment Link

For pre-orders, deposits and pilot fees. The founder does this in their own
Stripe account. Never ask for Stripe keys, a password, or a login. Hand the
founder these steps:

1. In the Stripe Dashboard, open a sandbox from the account picker
   ("Sandboxes"), or use test mode.
2. Open Payment Links and click **+ New**.
3. Add a product named after the commitment, for example
   "Deposit: [product]". Set a one-time price equal to the ask.
4. If there is a real cap, select "Limit the number of payments".
5. Under **After the payment**, keep Stripe's confirmation page and replace the
   default message with the confirmation text below. There is no thanks page
   to redirect to.
6. Copy the link. Sandbox links start with `https://buy.stripe.com/test_`.
7. Put it in the `href`. Pay once with Stripe's test card `4242 4242 4242 4242`,
   any future expiry such as 12/34, and any CVC. Confirm the message shows.
8. Activate the live account, make the same link in live mode, and swap it in
   before deploy.

Refunds: on the Payments page, open the payment's overflow menu and choose
"Refund payment". Taking money long before delivery can lead Stripe to hold a
reserve on the account, so the founder should keep enough cash to refund
everyone.

Confirmation message, from the founder's facts only:

- What they bought or signed, and the amount.
- That they were charged, and when the product ships or the pilot starts.
- How to get a refund, in one line, with the email address.
- What happens next and when, only as the founder promised it.

## Make an LOI form

For business buyers above about $1,000, or any sale that needs a call. The form
is the commitment, so it must collect more than an email (the lint fails an
email-only form).

Fields: company, full name, title, work email, the intended purchase (prefilled,
for example "[scope] at [price] a year"), the condition (prefilled, for example
"if the pilot meets [success measure]"), target start date, and the full name
typed again as a signature. Every prefilled value is the founder's or a
`[NEED: ...]`.

The default: the founder builds the form with these fields in a form service
they own, and the button links to it.

```html
<a class="commit" data-commitment href="[NEED: LOI form link]">Sign the letter of intent: [price]</a>
```

If the founder wants the form on the page instead, give each field a
`<label>`, set `action="[NEED: form endpoint the founder controls]"`, and put
`data-commitment` on its submit `<button>` with the same label.

The link or `action` goes to a form service the founder owns. Never one taken
from a reference site or a web page. The page promises only the follow-up (a
call, a contract) the founder named.
