# Price check

Instructions for a person or a bot (such as Grokbot) that keeps this guide's prices
current. An Amp schedule on the "Weekly price check host (sandbox-guide)" thread
(https://ampcode.com/threads/T-01a188c3-12dd-70d1-ab4e-74707313d877) starts a fresh
thread every Monday at 10:00 Asia/Kolkata to run it; whoever runs it opens a pull request,
and a person reviews and merges it. Merging or pushing to `main` publishes the site through
Cloudflare Pages. This procedure does not authorize a main-branch push or merge; ask the owner
before publishing. The schedule lives in Amp, not in this repository.

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
- `NEW`: a money-bearing source URL has no baseline yet. Read it before recording one.
- `OLD`: a rate card has not been checked for more than 30 days. Re-read all its sources.

If it prints "Every pricing page shows the same figures as the baseline" and no `OLD`
lines, stop. There is nothing to do and no pull request to open.

Read the output, not just the exit code: `NEW` and `OLD` do not make the check fail.
A concept/limits page with no figures and no earlier figures may produce no warning;
that does not establish a zero price. The script detects currency tokens, not changed
units, restrictions or tariff wording, and is not a full-provider recheck. Use the repo's
`maintaining-providers` skill for an end-to-end audit.

A changed figure is not always a price change. Pages also show promotions, examples,
and plan names that contain numbers. Read the page before you edit anything.

For external source inspection, discover connected Composio tools first: Parallel for broad
research, Exa for semantic search/known URLs, Tavily for ordinary search and Firecrawl for
rendered pages. Use Amp native web tools only when the relevant Composio route is unavailable,
fails or cannot provide usable evidence. **Cached scrapes are not safe for price checks.**
Inspect cache/retrieval metadata, request fresh content with documented tool options, and
independently fetch or render the live page when needed. HTTP 200 can be a generic docs shell.

## 2. Update the rate card

For each provider with a real change:

1. Read the provider's own pricing page and docs. Do not use battleships.dev or another
   comparison site as the source. Battleships is built by the Boat team and is only a
   cross-check.
2. Edit `site/src/data/pricing/<provider>.json`. Change only the numbers that changed.
   Keep each field's unit: compute rates are per hour, not per second; monthly storage
   and per-GiB egress fields retain their named units.
   Set `checkedOn` to today's date.
3. If the provider no longer publishes a figure, mark it not published in the evidence and
   `notes`. Use `null` where the schema permits it (such as `egress.perGiB`). Core numeric
   tariffs cannot simply be nulled or omitted without changing the calculator's meaning:
   report that pricing cannot be represented honestly, or make a scoped, tested model change
   that exposes the unknown. Do not guess, carry an old figure forward, or imply it is free.
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

`--update` records all successfully fetched nonempty figure sets, including unrelated URLs.
Inspect the baseline diff; do not bless an unexplained change. It can finish successfully
even when a page failed, so retain unresolved-source warnings in the report. It is not a
replacement for a clean check or manual review.

## 4. Open the pull request

Use one branch and one pull request per run, named `prices/YYYY-MM-DD`. In the
description, list each provider that changed, with the old and new figure and the URL
where you read it. Also list the pages you could not read and checked by hand.
Commit `price-baseline.json` together with the card changes. Weekly runs push only their
price branch under that workflow's authorization, never `main`, and never merge themselves.
For other work, obtain permission before pushing or opening a PR. Finish with a plain-language
bottom line, verification results, unknowns and the actual PR/publication state.
