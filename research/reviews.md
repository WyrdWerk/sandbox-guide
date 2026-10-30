# Public sentiment collection — method, spend and gaps

Read on 2026-10-30 (Asia/Kolkata) for the 21 providers in `site/src/data/providers/` plus six VPS providers being added: Contabo, Vultr, Akamai/Linode, OVHcloud, Scaleway and AWS Lightsail.

This is opinion gathered from review sites and forums. It is kept out of the site's sourced facts: nothing here changes a verdict, price, capability row or use-case pick.

## What was collected

- `reviews.json` — one entry per provider with the Trustpilot page URL, score, review count and read date (or a note that no page exists), the sample size, 0–5 recurring themes with at least two dated sources and verbatim excerpts each, a two-sentence buyer summary, and per-provider caveats.
- 27 providers, 67 themes, 138 dated evidence items.

## Endpoints used (treg)

All calls went through treg's catalog; no keys were handled directly.

| Endpoint | Price per call | Calls | Notes |
| --- | --- | --- | --- |
| `crawl4ai.trustpilot.business.reviews` | $0.00135 | ~50 attempted, 31 charged | Charged only when rows came back; "no page for <domain>" answers were free. |
| `crawl4ai.reddit.search.posts` | $0.0009 | 26 | 17 results per query, site-wide or scoped with `subreddit`. |
| `crawl4ai.reddit.post.comments` | $0.0009 | 6 attempted, 5 charged | Used for four threads: two sandbox-comparison threads, the Vercel Sandbox billing thread and the Sprites launch thread. |

Trustpilot lookups read the newest 20 reviews (page 1) per provider, plus page 6 for DigitalOcean because page 1 was almost entirely five-star support reviews. The review ID returned for each row builds the `trustpilot.com/reviews/<id>` link used in the JSON.

## Spend

- Balance before: **$5.44313**
- Balance after: **$5.36978**
- Spent: **$0.07335** of a $1 budget (~7%).

Itemised at list price: 31 Trustpilot calls $0.04185, 26 Reddit searches $0.0234, 5 comment calls $0.0045 — about $0.0698. The remaining ~$0.003 is consistent with one or two calls that completed server-side after the tool connection timed out, so the balance delta is the figure to trust.

## Limits of the evidence

- **Review sites skew to complaints.** Trustpilot scores here range from 1.3 (AWS) to 4.6 (DigitalOcean, Contabo, Hostinger) and rarely sit near the middle. A low score mostly says "people with a grievance post"; a high score mostly says "the vendor asks happy customers to post".
- **Solicitation and fake-review signals** are noted per provider where visible: every Agent37 review is five stars and six name the founder; Hostinger has many one-line five-star entries posted the same day; DigitalOcean's first page reads as reviews written after a support ticket closed; Contabo's page alternates five-star support praise with one-star outage complaints in the same week.
- **Company pages are not product pages.** Cloudflare, Vercel, AWS, DigitalOcean, Hostinger, OVHcloud and Fly.io (for Sprites) have one page covering many products. Those entries say what the reviews are actually about and should not be read as sandbox or VPS scores.
- **Reddit search returns titles, dates, subreddits and the first ~300 characters of each post**, without score or comment counts. Themes built on Reddit therefore rest on post bodies and the comment threads actually read, not on vote counts.
- **Name collisions** wasted several searches: "Instabox" mostly returns a Swedish parcel locker company; "Lizard", "Morph", "Boat" and "Sandboxer" return games and unrelated projects.

## Gaps

- **Runtime (withruntime.com):** the Trustpilot lookup timed out twice with no rows. Whether a page exists is unresolved, not disproved.
- **Two Reddit comment threads timed out** and were not retried: r/VPS "Does anyone else still use like Vultr and Digital Ocean" (2026-07-21) and r/VPS "Hetzner price hikes" (2026-09-26). Their post bodies are used; the replies are not.
- **Seven providers have no public sentiment at all:** Blaxel, Boat, boxd, Freestyle, Lizard, Morph and Sandboxer. Blaxel has one acquisition news post, Freestyle has a launch post and a self-disclosed employee comparison, and the rest return nothing relevant. All are marked "too few reviews to judge".
- **InstaBox** has two Reddit posts, one of which is an automated domain-age flag rather than a customer report.
- **Tensorlake** has no product reviews; the only substantial public discussion is the October 2026 compromised npm package.
- **No hands-on testing** was done. Nothing here is a measured result.
