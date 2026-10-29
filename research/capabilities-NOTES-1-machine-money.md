# Capabilities 1 (machine + money) — notes, 29 October 2026

Scope: 19 capabilities × 16 providers = 304 rows in `capabilities-1-machine-money.json`.
Research base: `research/*.md` and `site/src/data/**` as checked on 28 October 2026, re-checked
against live vendor pages today (29 October 2026).

## How the checks were done

- Every row carries one URL and one quote. Each of the 120 distinct URLs was fetched today and each
  quote was machine-matched against the page text (whitespace, curly quotes, markdown emphasis and
  spacing before punctuation normalised). All 304 quotes matched. Nothing is quoted from memory.
- Where a vendor publishes a Markdown version of a page (`/page.md`, `llms.txt`, `llms-full.txt`),
  the source URL points at that file, because the rendered page is JavaScript-only and returns an
  empty shell to a plain fetch. This affects InstaBox, Sandboxer, Daytona (some pages), Morph
  (pricing/terms) and all Mintlify-based docs (Agent 37, Blaxel, Boat, boxd, E2B, Lizard, Modal,
  Runtime, Sprites, Tensorlake).
- Composio calls that succeeded: Firecrawl scrape of `docs.tensorlake.ai/llms.txt` (Tensorlake index)
  and Firecrawl scrape of `daytona.io/pricing`. One further Firecrawl call hit the 14-requests-per-minute
  limit and returned nothing.
- Because that limit cannot cover ~120 pages, the rest were fetched directly with `curl` from the
  vendor's own Markdown/`llms.txt` endpoints, falling back to the HTML page. No Amp-native
  `web_search` or `read_web_page` call was used.
- battleships.dev was used only as a cross-check. No row relies on it as its only source.

## Contradictions between pages (kept in the data, flagged here)

1. **Agent 37 — core ceiling.** `docs/agents-api/instance-sizing` says "4 vCPU is the ceiling on every
   instance type", and `instances/create` repeats it. `docs/agents-api/vm-instances` prices 8 vCPU / 16 GB
   ($45.08) and 16 vCPU / 32 GB ($90.16) on the `vm` type. `big-machines` is marked `partly` and the
   shortfall states the conflict. Someone should ask Agent 37 which page is right.
2. **Agent 37 — subscription.** `/pricing` says "No subscription", while `/personal` sells monthly plans
   from $3.99 to $99.99. They are different products (Cloud API vs managed hosting), but a reader on one
   page will not know that.
3. **Blaxel — idle timer.** Pricing says sandboxes "scale to zero after about 5 seconds of inactivity";
   the sandbox overview says a socket idle for 15 minutes triggers standby. This does not change the
   `cheap-pause` verdict (standby is not charged for memory either way) but it changes how quickly an
   idle sandbox stops billing.
4. **Sprites — plans.** `fly.io/pricing` says "No plans and no tiers, and nothing charged per Sprite";
   the Sprites FAQ on `fly.io/sprites` describes plans with included allowances and a $100 Hero plan.
   `no-monthly-fee` is `yes` on the strength of the pricing page, with the contradiction in the note.
5. **Morph — free usage.** The signup page promises "300 free compute hours per month" on the $0
   Developer plan; the pricing page lists "0 MCUs" and "Purchase MCUs to use compute". `free-tier` and
   `free-credit` are `partly` and say so.
6. **boxd — 8 vCPU access.** The homepage says to email for "8 vCPU / 32 GiB or larger"; the resources
   page lists 8 / 32 as a size you can name and the pricing calculator offers it. `big-machines` is `yes`
   with the caveat in the note.
7. **Cloudflare — size ceiling.** The limits page says "All instance size maximums and account limits on
   this page are defaults and can be increased", directly above a custom-instance table that states
   "Maximum vCPU | 4" and "Maximum Memory | 12 GiB" as constraints. The rows use the published maximum.
8. **Vercel — Hobby reset.** The Hobby quota is described both as paused "until 30 days have passed since
   you first used the feature" and "until the next billing cycle".
9. **InstaBox — machine counts.** The pricing page says "Pro: 500 machines"; the docs distinguish 500
   total and 100 running at once.
10. **Lizard — what a sandbox is.** Sandboxes created today are Firecracker microVMs; older sandboxes
    without a size were pods on a shared kernel and keep their old usage-based billing.

## Verdicts I am unsure about

- **Agent 37 `live-resize` = partly.** The docs say a resize can move the instance to another host and
  that in-memory state is lost whenever the instance is recreated, but no sentence says a resize always
  loses memory. Reading it as "resizes, but not without loss" is my inference.
- **`live-resize` = no for Cloudflare, E2B, Lizard, Modal, Sprites and Vercel.** In each case the verdict
  comes from the absence of any resize path in the docs and API, not from a sentence saying "not
  supported". Confidence is `inferred` and the source is the page where a resize would be documented.
- **Sprites `docker-inside` = partly.** The only evidence is a Fly community thread ("docker exec will fail
  for any container whose PID 1 is non-root"). No vendor page states that Docker works or does not.
- **Sprites `choose-region` = no, `eu-region` = partly.** Both rest on a January 2026 community answer
  that placement is automatic. No vendor page confirms or denies a region setting.
- **InstaBox `no-card` = yes.** No page mentions a card at all, and the free plan is $0. But the public
  OpenAPI has a `cardMissingAt` state that makes free-tier machines answer `402 payment_method_required`,
  so a new free account may still be asked for one. This is the least certain `yes` in the set.
- **InstaBox `custom-image` = partly.** "An operator can also build a template from a public Debian- or
  Ubuntu-based image" is the only route to a non-standard base image, and it is a support action.
- **Modal `big-machines` = yes.** Modal enforces a per-container maximum but does not publish it; the
  `yes` rests on being able to request 16+ physical cores, not on a published ceiling.
- **Tensorlake `choose-region` / `eu-region` = yes.** EU residency is a separate API endpoint for the
  whole account, not a per-sandbox region setting.
- **Tensorlake `big-machines` = yes.** 16 vCPU / 64 GB exists, but only on the $250-a-month Pro plan;
  prepaid credit stops at 4 vCPU / 16 GB.
- **Agent 37 `eu-region` = partly.** There is a French region, but backups and the control-plane record
  are stored in the US. Whether that matters is a legal question, not a technical one.
- **Cloudflare `eu-region` = partly.** Cloudflare has EU locations, but sandboxes use the
  `durable_object` scheduling policy, for which Wrangler "rejects … placement constraints". A sandbox
  therefore cannot be required to stay in the EU.

## What changed since 28 October 2026

- **Tensorlake is new** and is now the 16th provider. Its plan table, per-second metering, live resize,
  `/dev/kvm` support and request-only GPU access are all documented; it has no per-sandbox region
  setting, and its Pro plan is $250/month.
- **Sandboxer now lets you choose a region on create.** The 28 October research said placement was
  decided by your IP address and could not be pinned. The live regions page says "New sandboxes go to
  the region nearest you unless you pick one" and shows `sbx new --region us-east`. `choose-region`
  is `yes`, not `no`.
- **Daytona now documents resizing a running sandbox.** CPU and memory can be increased without
  interruption (decreases need a stop), and "Sandbox resizing must be enabled for your organization"
  through support. The 28 October research recorded no resize path at all.
- **Blaxel documents an "Update sandbox" call** that changes memory, with the warning that memory
  changes "may reset the sandbox state". This is why `live-resize` is `partly` rather than `no`.
- **Runtime's `/dev/kvm` changelog entry is dated 27 October 2026** and applies only to new sandboxes on
  current-generation hosts; sandboxes created earlier keep the old kernel.
- **E2B's EU page now says "Contact support to get access"** in addition to the payment-method
  requirement, which is why `choose-region` and `eu-region` carry that caveat.
- **No price change was found** on the pages re-read today: Boat $0.036/h default, boxd $0.047/vCPU-h,
  E2B $0.000014/vCPU-second, Vercel $0.128/CPU-hour, Modal $0.141912/core-hour, Daytona $0.0504/vCPU-hour,
  InstaBox $0.004/vCPU-hour, Lizard $0.0324/h medium, Runtime $0.025/active-vCPU-hour + $0.0075/GiB-hour,
  Cloudflare $0.072/active-vCPU-hour, Tensorlake $0.07/core-hour on credit and $0.042 on Pro. This is a
  comparison of the figures quoted in the 28 October research against today's pages, not an audit of
  every line item.

## Decisions the parent may want to make

1. **What counts as `own-vm`.** I treated a gVisor container as `partly` (Agent 37, Modal) and a plain
   shared-kernel container as `partly` too (Daytona). If the site wants a stricter line — gVisor is not a
   virtual machine, so `no` — those three rows change.
2. **Whether a size behind a paid plan is still "available".** I marked Boat's 16-core `xlarge`
   ($100 plan), Sandboxer's `xlarge` ($100 plan), InstaBox's 32-core (Team, $500) and Tensorlake's 16-core
   (Pro, $250) as `yes` with the plan named in the note. Marking them `partly` would move four rows.
3. **Whether `not-published` should be shown to readers.** 16 rows are `not-published`, 11 of them
   `nested-virt`. The site may prefer to hide that verdict or show it as "not documented".
4. **InstaBox and a card.** If the free plan does turn out to require a card, `no-card` flips to `no`.
   One support question settles it.
5. **Sprites and Docker.** One support question ("is Docker supported inside a Sprite, and with which
   capabilities?") would replace a `partly` resting on a community thread.
