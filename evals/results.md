# first-dollar eval results

Generated 2026-10-06T00:56:30.560Z.

## plain

| Case | Slop fails | Rendered | Ask | Unconfirmed numbers |
|---|---|---|---|---|
| b2b-pilot | 2 | 1 failed (overflow) | contact: "Ask about the 90-day pilot" | 8 |
| consumer-preorder | 1 | 0 failed | money: "Pre-order for $89" | 0 |
| high-ticket-loi | 2 | 0 failed | other: "Reserve the 2027 season" | 0 |
| local-service | 1 | 0 failed | money: "Book a first visit, $40 deposit" | 0 |
| low-ticket-app | 1 | 0 failed | money: "Pre-pay year one for $36" | 2 |
| one-liner | 1 | 0 failed | free: "Get early access" | 3 |

Not scored: 0.

## prompted

| Case | Slop fails | Rendered | Ask | Unconfirmed numbers |
|---|---|---|---|---|
| b2b-pilot | 10 | 0 failed | money: "Commit to a 90-day pilot for $1,500" | 0 |
| consumer-preorder | 5 | 0 failed | money: "Pre-order Loam for $89" | 0 |
| high-ticket-loi | 15 | 1 failed (contrast) | none: "" | 0 |
| local-service | 1 | 1 failed (contrast) | money: "BOOK MY FIRST VISIT: $40 DEPOSIT Applied to your bill" | 0 |
| low-ticket-app | 2 | 0 failed | money: "Pre-pay $36 for your first year" | 0 |
| one-liner | 1 | 0 failed | money: "Start my plan for $35/month" | 1 |

Not scored: 0.

## first-dollar

| Case | Slop fails | Rendered | Ask | Unconfirmed numbers |
|---|---|---|---|---|
| b2b-pilot | 0 | 0 failed | money: "Start the pilot for $1,500" | 23 |
| consumer-preorder | 0 | 0 failed | money: "Pre-order for $89" | 2 |
| high-ticket-loi | 0 | 0 failed | money: "Sign the letter of intent: $12,000" | 1 |
| local-service | 0 | 0 failed | other: "RIDGEBACK SHARPENING" | 2 |
| low-ticket-app | 0 | 0 failed | money: "Pre-order for $36" | 5 |
| one-liner | 0 | 2 failed (hidden-after-reveal, reduced-motion) | money: "Pre-order for $35" | 1 |

Not scored: 0.

## Summary

| Arm | Pages scored | Slop fails (total) | Money asks | Contact asks | Unique display families | Mean background deltaE | Unique CTA hue buckets |
|---|---|---|---|---|---|---|---|
| plain | 6 | 8 | 3 of 6 | 1 | 2 of 6 | 0.013 | 4 |
| prompted | 6 | 34 | 5 of 6 | 0 | 5 of 6 | 0.032 | 3 |
| first-dollar | 6 | 0 | 5 of 6 | 0 | 6 of 6 | 0.034 | 4 |

## Method

1. Slop: the bundled lint on each run, minus the convention rules commitment-cta, design-tokens and reference-copy.
2. Rendered: the bundled rendered checks at their own widths; every failed check id counts except commitment-above-fold, which keys off the data-commitment convention (like the three excluded lint rules) and is recorded separately as `convention` in results.json.
3. Ask: at 1440x900, the largest visible button or link in the first viewport (nav links only if styled as buttons), classified money / contact / free / other / none by one text pattern for every arm (contact is checked before money).
4. Unconfirmed numbers: number tokens in the visible text that are absent from the case file. A list for a human to confirm, not a count of inventions.
5. Look: body background, first h1 font family and the ask button color, compared across each arm's pages.
The slop lint is first-dollar's own tool, and the first-dollar arm runs it while building, so its zero is by construction; the comparison shows what a stock agent produces without it.

Losing rows stay in the tables.
