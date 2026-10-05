# Inspiration

Load at stage 3 when the founder has no reference of their own.

Every URL returned HTTP 200 to `curl -s -o /dev/null -w "%{http_code}" -L <url>`
on 2026-10-05, and each note describes the page as it looked that day. Sites
change. Screenshot before you rely on a note.

These are other people's live sites. Take the structural move named in the
note. Never their copy, images, illustrations, logos or brand
(design-extraction.md, section 1, Reference hygiene).

## How to use this list

The list has six registers: Editorial, Technical, Warm, Bold, Minimal and
Playful. Each heading says which buyers tend to trust that register.

1. Pick three registers the buyer in BRIEF.md would trust, then one entry from
   each. Three different registers give the founder three different looks.
2. Take a reference shot of each:
   `node ${CLAUDE_SKILL_DIR}/scripts/first-dollar-check.mjs <url> --out <page>/.first-dollar/reference/<host>`
3. At the stop, show the founder the three `1440.png` files numbered, with each
   entry's register and note (with no browser, the three URLs). Ask for one
   number. That page becomes the backbone reference.
4. Running without stops: take the one whose register best fits the buyer and
   log why in BRIEF.md.
5. A URL that no longer loads, or now looks nothing like its note: skip it and
   take another entry from the same register. Tell the founder which one you
   skipped.

## Editorial

For buyers who read before they buy: writers, consultants, premium services.

1. https://stripe.press : the catalogue is a stack of book spines drawn as 3D
   objects, with a thin tick rail on the left as the only navigation. The
   product is the image.
2. https://www.robinsloan.com : one column set like a letter inside a light
   panel on a full orange ground. A blackletter display face, then a plain
   two-column directory of everything he has made.
3. https://thecreativeindependent.com : opens with "Dear reader" and a short
   letter, then a dot-leader index of words and counts. A table can carry a
   page.
4. https://www.kinfolk.com : one magazine cover centered on white with two text
   links under it ("Buy", "Read"). The object and the two actions, nothing else
   in the first screen.
5. https://craigmod.com : a book shown large beside its reviews and plain
   purchase links, then a big portrait next to a long first-person bio. "Who are
   you?" answered in his own voice.

## Technical

For buyers who check the specs: developers, engineers, operations leads.

6. https://planetscale.com : no hero. The page opens with two plain
   paragraphs set entirely in a monospace face, as if it were documentation.
   (Its customer logo grid only works because the customers are real. Skip it.)
7. https://oxide.computer : the two old options shown side by side as ASCII
   diagrams with their costs listed under each, then the product as the way out
   of both.
8. https://htmx.org : the homepage is a README. Lowercase section names, a
   short code sample near the top does the explaining, a haiku in the footer.
9. https://ciechanow.ski : long prose with working diagrams you drag inline.
   The mechanism explained by letting the reader operate it.
10. https://mullvad.net : a manifesto line as the hero, full-bleed photography
    between flat color bands, and one flat price in one box near the end. No
    tiers.

## Warm

For buyers who want a person behind it: small businesses, households, makers.

11. https://basecamp.com : the pitch is a letter from the founder, set on a
    paper card, signed by hand with his face and email address under it.
12. https://buttondown.com : the argument is told as running body text between
    two pull quotes on yellow cards. Reads like a person talking.
13. https://daylightcomputer.com : full-bleed photograph of the product outside
    in daylight. The order button sits bottom right with one line above it about
    stock and shipping time.
14. https://graza.co : a headline broken across two lines and offset left and
    right, small line drawings, then the wordmark set edge to edge as the page's
    largest element.
15. https://mymind.com : a manifesto in a serif, then a short list of what the
    product will never do, each line starting with a bold orange "NO". (Skip its
    glowing gradient backdrop; the lint bans it.)

## Bold

For buyers who like a strong opinion: consumer products, games, culture.

16. https://teenage.engineering : a huge condensed headline over a line
    drawing, then one product per screen on black. The nav is a row of icons,
    each with three small links under it.
17. https://play.date : a pre-order sticker on the product photo, the name set
    huge in the brand yellow, then the whole page flooded yellow with an
    exploded view of the hardware beside the text.
18. https://www.cardsagainsthumanity.com : black and white, blunt imperative
    headings ("Buy the game.", "Steal the game."), and the free option stated
    as plainly as the paid one.
19. https://37signals.com : the whole homepage is a numbered list of short
    principles in white on one flat color (it changes between visits). One
    color, one list, no images.

## Minimal

For buyers who distrust marketing: privacy tools, hardware, utilities.

20. https://www.are.na : one narrow column of plain text. The business model is
    stated outright: who pays, how many members support it.
21. https://pinboard.in : the price is inside the button ("Sign up for $22 /
    year"). Four press quotes set in large red serif names are the only
    decoration.
22. https://www.thelightphone.com : one sentence per screen with very large
    gaps between them. The product's features drawn as a plain list inside an
    outline of the device.
23. https://www.analogue.co : the product photographed on grey, one headline,
    one "Preorder now" button, and one small line under it saying when shipping
    starts.

## Playful

For buyers who enjoy the brand: creative tools, communities, side projects.

24. https://posthog.com : the site is a desktop. Pages open as windows over a
    wallpaper with app icons down both sides, and the pricing line admits most
    users pay nothing.
25. https://panic.com : three one-line sentences about what the company does,
    each followed by its own row of product icons, with sections cut on a
    diagonal.
26. https://mschf.com : the homepage is a numbered list of every project in
    large uppercase mono. An archive as the brand.
27. https://poolsuite.net : a retro desktop with a dock of apps along the bottom
    and "Become a member" in the menu bar. The membership ask lives in the
    chrome.
28. https://www.tldraw.com : no marketing page at all. The URL opens the working
    tool. Before launch, the equivalent is a clickable prototype as the hero.
