# Rate cards, checked 2026-10-29

Machine-readable pricing for the three providers, written from their live pages on 2026-10-29 and
cross-checked against `research/<id>.md` (2026-10-28) and the Battleships cards.

| File | Provider | Plans | Compute model |
|---|---|---|---|
| `boat.json` | Boat (boat.dev) | 4 monthly plans, prepaid as VM time | 4 fixed sizes, per second |
| `sandboxer.json` | Sandboxer | 4 monthly plans, prepaid as machine time | 4 fixed sizes, per second |
| `boxd.json` | boxd (boxd.sh) | none (credit, pay as you go) + Custom + Self-host | per vCPU-hour, per resident GiB-hour, per written GiB-hour |

Every number and claim in the JSON carries a `url` and a verbatim `quote`. Each file was checked
mechanically against the fetched page, then every flagged quote was re-read by hand:

- Boat: 40 quotes, all matched except one that the checker cannot normalise (a FAQ answer written as a
  blockquote). Re-read against the page; verbatim.
- Sandboxer: 33 quotes, 3 flagged because the pricing page renders its FAQ in JavaScript and `curl`
  returns the unrendered HTML. Re-checked against the rendered page; all 3 verbatim.
- boxd: 40 quotes, 6 flagged because they sit behind the USD currency toggle (the raw page defaults to
  EUR). Re-checked with the toggle clicked; all 6 verbatim.

## What changed since our research (2026-10-28)

**Boat — no price change, six corrections, five of them to the Battleships card.**

- Prices, plan ladder, trial, egress and the 14-day stopped-disk rule are unchanged.
- The Battleships card is dated 2026-09-29 and is wrong on disk sizes (12/50/125/251 vs live
  51/51/111/251), on egress (it still says 2 TB/sandbox/month free), on snapshot retention ("life of
  the sandbox" vs 14 days) and on xlarge access ("operator allocation on request" vs "You do not need
  to contact us"). It also still describes $20 credit packs, which Boat replaced with a dollar wallet.
- The Battleships card also predates the 2026-10-28 seat change: extra seats add **20% of the limits**
  below the $2000 plan (full limits on $2000). Our file has that number.

**Sandboxer — no price change and no disagreements found.**

- Same four sizes, same plan ladder, same trial, same storage quotas.
- One row is new to us: time packs bought without a plan include 50 GB of storage.
- The rendered pricing page now states which sizes each plan includes ("small, default and large" on
  $20; "All sizes, including xlarge" on $100+). That is consistent with what we wrote, just more
  explicit.
- Battleships has **no Sandboxer card** (`/data/providers/sandboxer.json` returns 404), so every diff
  for Sandboxer is against our own file only.

**boxd — the 20% cut is real and already reflected everywhere except our own diff table.**

- The 9 Oct 2026 Wayback capture still shows EUR 0.049 / 0.015 / 0.0001 and "50 machines included"
  (`http://web.archive.org/web/20261009152053/https://boxd.sh/pricing`, verified today). Today's page
  shows EUR 0.039 / 0.012 / 0.00008 and "100 machines included". So the cut and the quota doubling
  landed after 15:20 UTC on 9 October.
- Our file said Battleships was still on the old rates. It is not: today's card carries
  $0.047 / $0.014 / $0.000096, dated 2026-10-14. That entry in `research/boxd.md` §14 is stale.
- The machine quota is now contradictory in three places, not two: pricing page 100, pricing FAQ 100,
  resources guide 50, main FAQ 50.
- 8 vCPU / 32 GiB is still unresolved: the docs list it as a size and as the quota, the FAQ tells you
  to email for it.

## The diffs that matter for the calculator

1. **Boat disk is not what Battleships says.** `small` has 51 GB, not 12; `default` 51, not 50;
   `large` 111, not 125. Any size-fit calculation built on the Battleships card is wrong for Boat.
2. **Boat egress has no published cap.** Battleships models 2 TB/sandbox/month; the live page only says
   egress is not billed.
3. **boxd has no egress price at all.** The rate card has three meters. We record `null` and
   "not published" rather than assuming free.
4. **boxd's per-GiB-month disk figure is ours, not theirs.** $0.000096/GiB-hour × 730 = $0.07008;
   EUR 0.00008 × 730 = €0.0584. The page only publishes the hourly figure.
5. **boxd's headline hourly rate is not a machine's hourly rate.** The default shape at full memory is
   $0.206/h of vCPU+RAM before disk; boxd's own "about $0.12" anchor assumes 2 GiB resident and 20 GiB
   written. Both quotes are in `boxd.json`.
6. **Boat and Sandboxer look identical on the plan ladder but not on disk.** Boat gives 51/51/111/251,
   Sandboxer 12/50/125/251 at the same hourly prices. A workload that fits Boat `small` does not fit
   Sandboxer `small`.

## Could not confirm

- **boxd:** egress price or allowance; snapshot, checkpoint and backup storage prices; extra-disk
  prices; Custom and self-host prices; any region documentation page (the only region statement is
  marketing copy: bare-metal in Germany, US "coming"); whether 8 vCPU / 32 GiB is self-serve.
- **Boat:** minimum billed increment or rounding (docs say only "per second"); whether provisioning
  time is billed; any egress ceiling; SSO/SAML and audit logs.
- **Sandboxer:** minimum billed increment (per second, no rounding rule stated); any SLA; whether the
  trial's "25 hours" means default-hours or size-hours.
- **Deploy, all three:** none of them publishes a one-click Hermes Agent or OpenClaw install, a
  template, or a managed option. Boat is the only one that preinstalls both CLIs (`hermes`,
  `openclaw` on every sandbox) but neither is a `boat prompt` harness. boxd documents OpenClaw by name
  as a pattern, not a template. Sandboxer preinstalls neither and has no guide. Nous Research does run
  a managed "Hermes Cloud", but that is outside these three providers.

## Files

- `.amp/out/rates/boat.json`
- `.amp/out/rates/sandboxer.json`
- `.amp/out/rates/boxd.json`
- `.amp/out/rates/SUMMARY.md` (this file)

## Sources fetched today

Boat: `docs.boat.dev/pricing`, `/billing`, `/free-trial`, `/limits`, `/machines`, `/long-running-tasks/auto-stop`,
`/long-running-tasks/always-on-services`, `/hosting`, `/hosting/firewall`, `/faq`, `/organizations/seats-and-limits`,
`/machines/tools`, `/security`, `/concepts`, `/data-retention`, `/snapshots/resume-and-fork`, `/environments/secrets`,
`/sdks/overview`, `/integrated-agents`, `/organizations`, `/quickstart`, `/account`, `/llms.txt`, `/llms-full.txt`.
All fetched with a cache-buster because the `.md` endpoints serve cached revisions.

Sandboxer: `sandboxer.com/pricing` (rendered), `/pricing.md`, `/docs/llms.txt`, `/docs/billing`, `/docs/machines`,
`/docs/long-running`, `/docs/security`, `/docs/regions`, `/docs/hosting`, `/docs/agents`, `/docs/organizations`,
`/docs/machines`, `/docs/quickstart`.

boxd: `boxd.sh/pricing` (both currency toggles), `boxd.sh/faq`, `boxd.sh/`, `docs.boxd.sh/llms.txt`,
`/guides/resources`, `/guides/suspend-resume`, `/guides/egress`, `/guides/custom-domains`, `/guides/https`,
`/guides/env-secrets`, `/guides/snapshots`, `/guides/fork`, `/guides/disks`, `/guides/organizations`,
`/use-cases/personal-assistants`, `/use-cases/sandboxes`, `/quickstart`, `/cli/commands`, plus the
2026-10-09 Wayback capture.

Agent context: `NousResearch/hermes-agent` README and `hermes-agent.nousresearch.com` docs; `docs.openclaw.ai`
getting-started. These are used only to describe the deploy route, not to price anything.
