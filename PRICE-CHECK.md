# Price check

Instructions for a person or a bot (such as Grokbot) that keeps this guide's prices
current. An Amp schedule runs it every Monday morning (India time) in the thread that
built this guide; whoever runs it opens a pull request, and a person reviews and merges
it. Merging to `main` publishes the site.

Every "Prices checked" date on the site comes from the rate cards' `checkedOn`: a provider
page shows its own card's date, and site-wide lines show the oldest card's date. Set
`checkedOn` only after reading the provider's pages, never just to make a date look fresh.

## 1. Find what changed

```sh
cd site
npm ci
npm run check-rates
```

The script fetches every pricing page cited in `site/src/data/pricing/*.json` and
compares the money figures on each page with `site/scripts/price-baseline.json`. It
prints one line per page that needs a look:

- `CHANGED`: figures appeared or disappeared. The line says which.
- `NO PRICES` / `FAILED`: the page could not be read as plain HTML. Open it in a browser.
- `OLD`: a rate card has not been checked for more than 30 days. Re-read all its sources.

If it prints "Every pricing page shows the same figures as the baseline" and no `OLD`
lines, stop. There is nothing to do and no pull request to open.

A changed figure is not always a price change. Pages also show promotions, examples,
and plan names that contain numbers. Read the page before you edit anything.

## 2. Update the rate card

For each provider with a real change:

1. Read the provider's own pricing page and docs. Do not use battleships.dev or another
   comparison site as the source. Battleships is built by the Boat team and is only a
   cross-check.
2. Edit `site/src/data/pricing/<provider>.json`. Change only the numbers that changed.
   Keep every rate in the unit the card already uses, which is per hour, not per second.
   Set `checkedOn` to today's date.
3. If the provider no longer publishes a figure, set it to `null` and say so in `notes`.
   Do not guess, and do not carry an old number forward.
4. If the provider's prose page (`site/src/data/providers/<provider>.json`) states the
   old price, update that sentence and its quote to match.
5. Add a dated entry to `site/src/data/changes.json` describing what changed, with the link.

## 3. Check and record

```sh
npm test               # the engine still matches the hand-worked reference workloads
npm run build          # the site builds and its content checks pass
npm run check-rates -- --update   # record the new figures as the baseline
```

If `npm test` fails because a provider really changed its prices, update the expected
total in `site/src/lib/cost.test.ts`. Work the new total out by hand from the provider's
page and show the arithmetic in the commit message. Do not copy the number the engine
prints.

## 4. Open the pull request

Use one branch and one pull request per run, named `prices/YYYY-MM-DD`. In the
description, list each provider that changed, with the old and new figure and the URL
where you read it. Also list the pages you could not read and checked by hand.
Commit `price-baseline.json` together with the card changes.
