# Morph Cloud — full provider recheck, 2026-11-12

**Repository / revision:** `sandbox-guide`, `origin/main` `4432d00` (worktree inspected; no repo data files edited).
**Provider ID:** `morph` — Morph Cloud, operated by Morph Labs, Inc.
**Site baseline:** provider profile checked 2026-10-28; rate card checked 2026-10-29.
**This pass:** 2026-11-12, desk research only. No account, credentials, invitation or billable sandbox was used.
**Scope:** 16 features, 78 capabilities, `docs.json`, `pricing/morph.json`, `research/morph.md`, `research/rates/morph.json`, the 10 use cases, 8 situations, `changes.json`, price baseline and cost fixtures.
**Change convention:** “changed” below means **changed against the site baseline**, not “the provider changed on 2026-11-12”. Several corrections are baseline misses. Morph publishes no dated changelog entries for these features (the changelog has only “Unreleased candidate” and “2024-11-19 Initial beta release”), so no launch dates are invented.

## Bottom line

No MCU rate changed: $0.05 per MCU-hour, Team $40 for 1,000 MCUs, Scale $250 for 7,500 MCUs, and the same `max(vCPU, RAM/4, disk/16)` meter. The site was **too pessimistic about access and storage**, and **too vague about what is not supported**. Morph exposes HTTP services publicly by default or behind the account API key, has a real SSH daemon, a browser terminal and SSH tunnels; it now documents admin/member roles, a 16 vCPU / 32 GiB shape, a 1 TiB live disk resize, and a named shared FUSE filesystem (Morph EFS). Custom domains are explicitly **not** supported. The 300-free-hours contradiction is still unresolved and now has four first-party pages on both sides. Two products the 16 features/78 capabilities miss are **Morph Actions** (GitHub Actions runners at 3/5/10 MCU per hour) and **Responses Proxy** (an OpenAI/Anthropic-compatible model gateway that injects provider keys; live service, docs now 404). EFS is the third: live product, full docs section removed, still referenced by the resize page.

## Method and tools that actually succeeded

- **Context (Composio) `web_scrape`** — primary. Fresh retrieval with `maxAgeMs: 0` for the pricing page, terms, status, product FAQ, docs pages and archived EFS/Responses Proxy pages. `cache_metadata.status` was `miss`, `age_ms` 0 on the first pricing fetch; the hydrated browser read was used for the final price quotes. `context.web_map` enumerated `cloud.morph.so`.
- **TinyFish (Composio) `search`** — discovery and connection check; returned the Morph pricing page and corroborating third-party pages.
- **`curl`** — `https://cloud.morph.so/docs/llms.txt`, `llms-full.txt` (725,002 bytes, 124 documents), `sitemap.xml`, raw HTML/JS for pages whose Markdown renderer normalises text, the Devboxes OpenAPI (`https://devbox.svc.cloud.morph.so/openapi.json`), the Responses Proxy OpenAPI, PyPI and npm registries.
- **`agent-browser`** — hydrated the pricing page (the static HTML says “Purchase MCUs”; React replaces it with “Purchase credits”, so the visible quote is the latter), opened all seven Devboxes FAQ accordions (answers are client-rendered), and confirmed the pricing table's commas and tab layout.
- **Changelog** — `https://cloud.morph.so/docs/changelog` has two blocks: “Unreleased candidate” (live disk capacity; “These API, Python SDK, and CLI examples do not announce current availability or a released package version.”) and “2024-11-19 — Initial beta release”. No dated entry for EFS, Actions or Responses Proxy, so none is inferred.
- **`npm run check-rates`** from `site/` — read-only; **no `morph` CHANGED / NEW / BLOCKED line**, so the currency-figure set on `https://cloud.morph.so/web/subscribe` is unchanged from the 2026-10-30 baseline (`$0 $0.05 $0.12 $250 $375 $40 $50`).
- **Not used:** Parallel, Exa, Tavily, Firecrawl and Amp native `web_search`/`read_web_page` were not needed; the Context/TinyFish routes returned usable content. No Composio connection was created, reconnected or modified.

### Freshness and quote checking

- Pricing was fetched twice: Context `web_scrape` with `maxAgeMs: 0` (`cache_metadata: miss, age_ms: 0`) and a fresh `agent-browser` navigation after hydration. The two agree on every rate; they disagree only on the word “MCUs” vs “credits” in one call-to-action, which is a hydration variant (see contradiction 6).
- Every capability quote in this file was machine-checked against the saved live page text (or the saved Wayback snapshot for EFS / Responses Proxy) after normalising HTML entities, whitespace, Markdown backticks/bold markers, typographic quotes and dashes to ASCII. All **78/78** capability quotes and all **16/16** feature quotes pass. The normalisation is stated because it is not literal byte matching.
- The status page and the Devboxes FAQ were additionally read in the rendered browser; the FAQ answers exist only after the accordion is opened.
- Cached scrapes were not used for prices. The pricing page, terms and status page were all re-fetched on 2026-11-12.

## Source inventory (live on 2026-11-12 unless marked archive)

| Source | URL | Use |
|---|---|---|
| Pricing / Subscribe | https://cloud.morph.so/web/subscribe | MCU rate, plans, limits, Actions rates, snapshot example |
| Devboxes product page + FAQ | https://cloud.morph.so/web/product/devboxes | Custom domains, free tier, scale-to-zero, Windows/nested status |
| Devboxes docs | https://cloud.morph.so/docs/devboxes/getting-started | VM isolation, templates, secrets, tmux, SSH, sharing |
| HTTP Services | https://cloud.morph.so/docs/documentation/instances/http-services | Public URLs, `api_key` mode |
| Pause / Resume | https://cloud.morph.so/docs/documentation/instances/pause-resume | Memory preservation, paused billing, stop semantics |
| Live Disk Capacity | https://cloud.morph.so/docs/documentation/instances/resize-disk | 1 TiB resize, preview gate, EFS references |
| Resizing / Configurable reboot | https://cloud.morph.so/docs/examples/resizing-instances, https://cloud.morph.so/docs/examples/configurable-reboot | 16 vCPU / 32 GiB shape, CPU/RAM reboot |
| Snapshots / Branch / Boot | https://cloud.morph.so/docs/documentation/instances/creating-snapshot, .../branch, .../boot-from-snapshot | Memory+disk snapshots, clones, cold boot |
| TTL / Wake-on | https://cloud.morph.so/docs/documentation/instances/ttl, .../wake-on | Auto-pause, wake paths |
| SSH / SSH sharing / Reverse tunnel | https://cloud.morph.so/docs/documentation/instances/ssh, .../ssh-sharing, .../reverse-tunnel | Real SSH, instance-scoped bundles, `ssh -R` |
| FUSE | https://cloud.morph.so/docs/documentation/instances/fuse | FUSE support, s3fs/sshfs examples |
| Volumes | https://cloud.morph.so/docs/volumes/getting-started | S3-compatible object storage, $0.0054794/GiB-hour |
| Agent tokens | https://cloud.morph.so/docs/devboxes/agent-tokens | Scoped secrets, smallest scope |
| Org member role | https://cloud.morph.so/docs/api-reference/update-member-role | `org:admin` / `org:member` |
| SSH-key audit | https://cloud.morph.so/docs/api-reference/list-organization-managed-ssh-keys | Key metadata audit |
| Revoke SSH key | https://cloud.morph.so/docs/api-reference/revoke-managed-ssh-key | “Browser terminal access … separate” |
| Plans | https://cloud.morph.so/docs/documentation/setup/plans | 300 MCUs free claim, Developer quotas |
| Signing up | https://cloud.morph.so/docs/documentation/setup/signing-up | 300 free compute hours/month claim, invite |
| Docs FAQ | https://cloud.morph.so/docs/faq | “Yes! … 300 free compute hours per month” |
| Infinibranch blog | https://cloud.morph.so/docs/blog/developers | <250 ms claim, 2024 “custom DNSes” claim |
| Developers page | https://cloud.morph.so/docs/developers | <250 ms table, “sub-second boot” |
| Terms | https://cloud.morph.so/web/legal/terms-of-service | Entity, per-second, egress, SLA, security, price notice |
| Status | https://status.cloud.morph.so/ | 100% over 90 days, no incidents Sep–Nov |
| Trust portal | https://trust.delve.co/morph | “SOC 2 Type II Compliant” vs AutoInfra report |
| EFS docs (archive) | http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/concepts | Named FUSE filesystem, shared mounts, TTL |
| EFS billing (archive) | http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/usage-and-billing | $0.12/$0.15/$0.18 GiB-month, 5/25/100 filesystems |
| Responses Proxy (archive) | http://web.archive.org/web/20260718093544/https://cloud.morph.so/docs/responses-proxy/getting-started | Provider-key injection, Codex/Claude Code aliases |
| Changelog | https://cloud.morph.so/docs/changelog | Only “Unreleased candidate” (live disk capacity) and “2024-11-19 Initial beta release”; no dated EFS/Actions/Responses Proxy entries |
| PyPI | https://pypi.org/pypi/morphcloud/json | Python SDK 0.1.116, 2026-10-20 |
| npm | https://registry.npmjs.org/morphcloud | TypeScript SDK 0.0.20, 2025-10-06 |
| RL List | https://www.rl-list.com/vendors/morph | Headcount 1–10, funding unknown, SOC 2 claimed |
| Grokipedia | https://grokipedia.com/page/Morph_Labs | $5.75M Khosla-led seed claim |

---

## Feature verdicts (16)

Each entry gives the current verdict, the buyer-relevant specifics, one first-party URL with a short verbatim quote, and whether it changed against the 2026-10-28 site. The full contradiction evidence is in the next section; the quote here is the one that decides the verdict.


### `isolation` — **yes** — verdict unchanged; specifics updated

**Specifics.** Full VMs with Docker-in-Docker, a local Kubernetes cluster, systemd, root and FUSE. Windows, macOS (x86) and nested virtualisation are experimental; the Devboxes FAQ says they are 'soon'.


**Evidence.** [https://cloud.morph.so/docs/devboxes/getting-started](https://cloud.morph.so/docs/devboxes/getting-started): “Full virtual machines capable of running any configuration of containers”


**Changed vs baseline.** Specifics: added the docs-vs-FAQ contradiction on Windows and nested virtualisation; verdict unchanged.


### `sizes-regions` — **partly** — verdict unchanged; specifics updated

**Specifics.** vCPU, memory and disk are chosen at creation. A 16 vCPU / 32 GiB shape is documented, and live disk resize reaches 1 TiB on eligible native instances in a limited preview. GPU, a per-VM maximum, host locations and selectable regions are unpublished. The pricing table's vCPU/RAM/storage ceilings are labelled 'Instances/RAM/Storage' but do not say whether they are per-VM or account-wide.


**Evidence.** [https://cloud.morph.so/docs/examples/configurable-reboot](https://cloud.morph.so/docs/examples/configurable-reboot): “Scale UP for builds (16 vCPU, 32 GiB RAM, 64 GiB disk)”


**Changed vs baseline.** Specifics: big-machines partly→yes; big-disk not-published→partly; 1 TiB live resize and the 16/32 shape documented. Feature verdict unchanged.


### `lifecycle` — **partly** — verdict unchanged; specifics updated

**Specifics.** Pause snapshots memory and disk and suspends the VM; start restores memory, boot is a cold boot. Stop releases the instance and deletes it. Infinibranch claims under 250 ms startup. Disk capacity can change live on eligible native instances in a limited preview; CPU and memory changes still need a reboot.


**Evidence.** [https://cloud.morph.so/docs/documentation/instances/pause-resume](https://cloud.morph.so/docs/documentation/instances/pause-resume): “Pausing an instance suspends its execution while preserving the memory state.”


**Changed vs baseline.** Specifics: fast-start not-published→yes; live disk resize documented. Feature verdict unchanged.


### `snapshots-forks` — **yes** — verdict unchanged; specifics updated

**Specifics.** Immutable memory-and-disk snapshots; branch creates clones from one snapshot; snapshot TTL; templates; snapshot tokens and pull-snapshot let another organisation pull a snapshot.


**Evidence.** [https://cloud.morph.so/docs/documentation/instances/creating-snapshot](https://cloud.morph.so/docs/documentation/instances/creating-snapshot): “Snapshots are immutable point-in-time copies of both memory and disk state.”


**Changed vs baseline.** Specifics: snapshot tokens and pull-snapshot added; verdict unchanged.


### `storage` — **partly** — verdict unchanged; specifics updated

**Specifics.** The root disk is released on stop (pause keeps it as a snapshot). Morph Volumes is S3-compatible object storage. Morph EFS is a separate named FUSE filesystem mounted at ~/morph-efs/<name>, shareable across hosts, with optional TTL; its docs section now returns 404, but the resize page still references it. Neither is an attached block disk.


**Evidence.** [https://cloud.morph.so/docs/volumes/getting-started](https://cloud.morph.so/docs/volumes/getting-started): “Morph Volumes are persistent S3-compatible storage for build caches, release artifacts, checkpoints, and shared datasets.”


**Changed vs baseline.** Specifics: EFS identified as a mounted shared filesystem; volumes and shared-volume partly→yes, mount-buckets no→partly. Feature verdict unchanged.


### `idle-timers` — **partly** — verdict unchanged; specifics updated

**Specifics.** Auto-sleep/TTL pauses idle devboxes; wake on HTTP or SSH-backed access (SSH, exec, SDK/CLI/REST). The idle interval and allowed values are unpublished; auto-sleep can be disabled for a persistent-VPS mode. No scheduler.


**Evidence.** [https://cloud.morph.so/docs/documentation/instances/wake-on](https://cloud.morph.so/docs/documentation/instances/wake-on): “When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes”


**Changed vs baseline.** Specifics: exec explicitly uses the SSH wake path. Verdict unchanged.


### `reaching-it` — **yes** — **verdict changed: partly → yes**

**Specifics.** Exposed HTTP services are public by default (auth_mode none) or gated by the account's Morph API key (auth_mode api_key). SSH is a real daemon; ssh -L and ssh -R both work. The devbox web UI has a browser terminal. Raw non-web ports are not documented.


**Evidence.** [https://cloud.morph.so/docs/documentation/instances/http-services](https://cloud.morph.so/docs/documentation/instances/http-services): “Morph Cloud allows you to expose HTTP services running within your instances to the public internet.”


**Changed vs baseline.** Verdict: partly→yes. public-url and private-url not-published→yes; web-terminal not-published→yes.


### `custom-domains` — **no** — **verdict changed: not-published → no**

**Specifics.** Apps are served over HTTPS on a Morph-generated hostname. Custom domains are not supported. A 2024 Infinibranch blog post promised 'Instantaneous deployment of applications to custom DNSes', but no current page explains it.


**Evidence.** [https://cloud.morph.so/web/product/devboxes](https://cloud.morph.so/web/product/devboxes): “Custom domains aren’t supported yet.”


**Changed vs baseline.** Verdict: not-published→no. custom-domain and auto-https not-published→no.


### `outbound-network` — **not-published** — unchanged

**Specifics.** The terms name egress as a chargeable component; no per-GB rate, allowance, allowlist, no-internet switch or fixed outbound IP is published. Do not assume egress is free.


**Evidence.** [https://cloud.morph.so/web/legal/terms-of-service](https://cloud.morph.so/web/legal/terms-of-service): “Typical components may include but are not limited to compute, snapshot storage, and egress.”


**Changed vs baseline.** no


### `keys-secrets` — **partly** — verdict unchanged; specifics updated

**Specifics.** Devbox templates integrate a secrets manager; agent tokens carry scoped secret permissions; org/user secret APIs exist. The Responses Proxy injects model-provider credentials, so Codex or Claude Code can use a Morph proxy key instead of the provider key. Other API keys are ordinary secrets inside the VM; no general proxy is published.


**Evidence.** [https://cloud.morph.so/docs/devboxes/getting-started](https://cloud.morph.so/docs/devboxes/getting-started): “Every devbox is created from a template that integrates with our secrets manager”


**Changed vs baseline.** Specifics: Responses Proxy documented as model-key injection; hidden-secrets not-published→partly. Verdict unchanged.


### `ways-to-drive` — **partly** — verdict unchanged; specifics updated

**Specifics.** Dashboard, CLI, Python SDK (0.1.116, 2026-10-20), TypeScript SDK (0.0.20, 2025-10-06), REST API, SSH, tmux and file API. No first-party MCP server or webhooks are documented.


**Evidence.** [https://registry.npmjs.org/morphcloud](https://registry.npmjs.org/morphcloud): “"latest":"0.0.20"”


**Changed vs baseline.** Specifics: the TypeScript SDK has not been published since October 2025; ts-sdk yes→partly. Verdict unchanged.


### `built-in-agents` — **partly** — verdict unchanged; specifics updated

**Specifics.** No agent is preinstalled and no sandbox prompt API is documented; tmux drives Claude Code, Codex or Gemini CLI. A separate Responses Proxy gives Codex and Claude Code a model endpoint, but it is not an agent. Remote desktops are configurable; the browser is a headless-Chrome example.


**Evidence.** [https://cloud.morph.so/docs/devboxes/getting-started](https://cloud.morph.so/docs/devboxes/getting-started): “Devboxes expose a full tmux API, which lets you programmatically manage coding agents like OpenAI Codex or Claude Code.”


**Changed vs baseline.** Specifics: Responses Proxy noted; no verdict change.


### `teams-accounts` — **partly** — verdict unchanged; specifics updated

**Specifics.** Organisations share devboxes by URL and can be multiple. Members carry org:admin or org:member; owners/admins can change roles and audit SSH public keys. SSO/SAML, hard spend caps, usage alerts and an account-wide audit log are unpublished.


**Evidence.** [https://cloud.morph.so/docs/api-reference/update-member-role](https://cloud.morph.so/docs/api-reference/update-member-role): “Update a member's role in an organization.”


**Changed vs baseline.** Specifics: roles not-published→yes; audit-log not-published→partly. Feature verdict unchanged.


### `billing-models` — **partly** — unchanged (rates and meter identical)

**Specifics.** Prepaid MCUs at $0.05. The hourly meter is max(vCPU, ceil(RAM/4GiB), ceil(disk/16GiB)); 5 TB of snapshot-hours is the other MCU. Compute is per-second. Paused bills only the snapshot; stopped is deleted. Developer $0, Team $40 with 1,000 MCUs, Scale $250 with 7,500 MCUs.


**Evidence.** [https://cloud.morph.so/web/subscribe](https://cloud.morph.so/web/subscribe): “MCUs = max(vCPUs, ceil(RAM/4GiB), ceil(disk/16GiB))”


**Changed vs baseline.** no (rates unchanged; the page's '+' wording is a bundle, not a sum)


### `trials-free-tiers` — **partly** — verdict unchanged; specifics updated

**Specifics.** Four first-party pages disagree: signup and the docs FAQ say 300 free compute hours a month; the Plans doc says 300 MCUs free; the pricing table says 0 MCUs of starting credit and 'Purchase credits to use compute'; the Devboxes FAQ says the Developer tier includes 0 MCUs and you must buy credits before creating a devbox. An invite is mentioned; card requirement is unpublished.


**Evidence.** [https://cloud.morph.so/docs/documentation/setup/signing-up](https://cloud.morph.so/docs/documentation/setup/signing-up): “Once you have your invite, our $0/month Developer Plan provides 300 free compute hours per month”


**Changed vs baseline.** Specifics: the contradiction now spans four pages, including the Devboxes FAQ and the docs FAQ. Verdict unchanged.


### `company` — **partly** — verdict unchanged; specifics updated

**Specifics.** Morph Labs, Inc., 2565 3rd Street, San Francisco. Founded 2023 by Jesse Han. Funding unconfirmed: Grokipedia reports a $5.75M Khosla-led seed; RL List (2026-10-05) says total raised and last round are unknown; Tracxn returns 500. Headcount 1–10 (RL List). Status page reports 100% over 90 days, no incidents Sep–Nov. No numeric SLA. No verified SOC 2 for Morph Labs: the Delve portal claims 'SOC 2 Type II Compliant' but its only report is AutoInfra, Inc. and its links point to morphllm.com. No DPA, privacy policy or deletion deadline on cloud.morph.so. 30-day price notice, 60 days if cumulative increases exceed 15% in 12 months; month-to-month termination next billing cycle.


**Evidence.** [https://cloud.morph.so/web/legal/terms-of-service](https://cloud.morph.so/web/legal/terms-of-service): “Morph Labs, Inc., 2565 3rd Street, San Francisco, CA 94107, USA”


**Changed vs baseline.** Specifics: funding/headcount updated; the trust portal now loads and claims SOC 2 Type II Compliant while naming AutoInfra; no DPA/privacy page. Verdict unchanged.

---


---

## Capability verdicts (78)

Grouped by feature. Every row has the current verdict, the figure or shortfall, a first-party URL, a short verbatim quote and the change against the 2026-10-29 baseline. `partly` rows carry a one-sentence **Shortfall**; `not-published` rows carry the unanswered question. Quotes are normalised only for whitespace, HTML entities, Markdown markers and typographic quotes/dashes; all 78 were machine-checked against the saved page text.


### Isolation (5)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `own-vm` | **yes** | **full VM.** Every MorphVM is a full virtual machine, not a shared-kernel container. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Full virtual machines capable of running any configuration of containers” *(docs-confirmed)* | — |
| `root` | **yes** | **root shell.** The documented examples run as root; an unprivileged user is possible but not the default. | [link](https://cloud.morph.so/docs/documentation/instances/fuse) — “The examples assume a Debian-based instance such as `morphvm-minimal` and a root shell” *(docs-confirmed)* | — |
| `docker-inside` | **yes** | **Docker-in-Docker.** Docker-in-Docker, a local Kubernetes cluster and self-hosted Supabase are documented. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “docker‑in‑docker, a local Kubernetes cluster, self‑hosted Supabase” *(docs-confirmed)* | — |
| `nested-virt` | **partly** | **experimental.** **Shortfall:** Running another operating system or a virtual machine inside is described as experimental; the Devboxes FAQ says it is 'soon'. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “There is experimental support for Windows, OSX (x86), and nested virtualization as well.” *(docs-confirmed)* | — |
| `custom-image` | **partly** | **templates and snapshots.** **Shortfall:** There is no documented way to import your own Docker/OCI image; you start from a Morph base image, a template or a snapshot you saved. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Every devbox is created from a template that integrates with our secrets manager” *(docs-confirmed)* | — |

### Sizes and regions (6)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `any-size` | **yes** | **cores, memory, disk.** vCPU, memory and disk are chosen at snapshot/instance creation; there is no fixed size menu. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “To create a new snapshot, specify the resource specifications like” *(docs-confirmed)* | — |
| `big-machines` | **yes** | **16 vCPU / 32 GiB.** A 16 vCPU / 32 GiB shape is documented. The Scale plan lists up to 1024 vCPU and 4096 GB, but the page does not say whether those are per-VM or account-wide. | [link](https://cloud.morph.so/docs/examples/configurable-reboot) — “Scale UP for builds (16 vCPU, 32 GiB RAM, 64 GiB disk)” *(docs-confirmed)* | was **partly (ceiling unpublished)** |
| `live-resize` | **partly** | **disk live; cores need reboot.** **Shortfall:** Only disk capacity can change live, and only on eligible native instances in a limited preview; CPU and memory changes still need a reboot. | [link](https://cloud.morph.so/docs/examples/resizing-instances) — “CPU and memory changes still require reboot.” *(docs-confirmed)* | specifics: preview gate added |
| `gpu` | **not-published** | **Not published.** No page states whether graphics processors are available. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Full virtual machines capable of running any configuration of containers” *(not-published)* | — |
| `choose-region` | **not-published** | **Not published.** No page lists regions or says whether you can choose one; metadata examples using `us-east-1` are user labels, not placement evidence. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Full virtual machines capable of running any configuration of containers” *(not-published)* | — |
| `eu-region` | **not-published** | **Not published.** No page says where machines run or promises an EU location. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Full virtual machines capable of running any configuration of containers” *(not-published)* | — |

### Lifecycle (3)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `pause-memory` | **yes** | **RAM + processes.** Pause preserves memory, processes and disk; resume continues where it stopped. | [link](https://cloud.morph.so/docs/documentation/instances/pause-resume) — “Pausing an instance suspends its execution while preserving the memory state.” *(docs-confirmed)* | — |
| `warm-pool` | **no** | **no pool.** There is no pool of pre-started machines; templates can be cached as snapshots, but a new devbox still starts from a snapshot. | [link](https://cloud.morph.so/docs/documentation/instances/basic-lifecycle) — “Each instance runs from a saved snapshot.” *(docs-confirmed)* | — |
| `fast-start` | **yes** | **<250 ms claim.** The provider's Infinibranch page and developer guide claim under 250 ms startup; this is a first-party claim, not a measurement here. | [link](https://cloud.morph.so/docs/blog/developers) — “<250 ms startup times” *(docs-confirmed)* | was **not-published** |

### Snapshots and forks (6)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `snapshot-files` | **yes** | **memory + disk.** A snapshot captures disk as well as memory. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “Snapshots are immutable point-in-time copies of both memory and disk state.” *(docs-confirmed)* | — |
| `snapshot-memory` | **yes** | **running processes.** A snapshot captures the complete running state, including processes and services. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “When you take a snapshot, it captures the complete state of a running instance, including all running processes and services.” *(docs-confirmed)* | — |
| `fork-running` | **yes** | **branch.** Branching snapshots the source and launches clones from that state. | [link](https://cloud.morph.so/docs/documentation/instances/branch) — “Branching an instance creates multiple clone instances based on the current state of the original instance.” *(docs-confirmed)* | — |
| `older-snapshot` | **yes** | **any immutable snapshot.** Snapshots are immutable and can be started again; older ones are not overwritten. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “Snapshots are immutable point-in-time copies of both memory and disk state.” *(docs-confirmed)* | — |
| `templates` | **yes** | **devbox templates.** Devboxes are created from templates; templates can be cached, shared and bookmarked. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “They serve as templates for starting instances.” *(docs-confirmed)* | — |
| `backups` | **no** | **no schedule.** There is no automatic backup schedule; snapshots are taken when you ask, and snapshot TTL is opt-in cleanup. | [link](https://cloud.morph.so/docs/documentation/instances/creating-snapshot) — “Snapshots are immutable point-in-time copies of both memory and disk state.” *(inferred)* | — |

### Storage (5)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `files-survive-stop` | **no** | **root disk released.** The root disk is released on stop; only files on a separate EFS mount survive. Pause or snapshot keeps the root disk. | [link](https://cloud.morph.so/docs/documentation/instances/pause-resume) — “Use when you're completely done with the instance and want to release all resources.” *(docs-confirmed)* | specifics: EFS exception noted |
| `volumes` | **yes** | **EFS + S3.** Morph EFS is a named FUSE filesystem you create and mount at ~/morph-efs/<name>; it has a durable identity independent of the host and can be mounted to a new one. Morph Volumes is separate S3-compatible object storage. Neither is a block disk. | [link](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/concepts) — “The durable EFS identity you create by name.” *(docs-confirmed)* | was **partly (S3 object storage only)** |
| `shared-volume` | **yes** | **EFS multi-mount.** The same EFS filesystem can be mounted read-write from more than one supported host in one Morph context; writes are visible after sync, and concurrent writers must coordinate. | [link](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/concepts) — “The same EFS filesystem can be mounted from more than one supported host in the same Morph context.” *(docs-confirmed)* | was **partly (S3 bucket sharing only)** |
| `mount-buckets` | **partly** | **EFS mount.** **Shortfall:** Morph EFS mounts as a folder at ~/morph-efs/<name>, but an outside S3 bucket is not mounted natively; you add s3fs or rclone. | [link](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/getting-started) — “Use EFS when a workload needs a mounted path such as `~/morph-efs/shared-files` rather than an object-storage API.” *(docs-confirmed)* | was **no (mounting not documented)** |
| `big-disk` | **partly** | **1 TiB resize.** **Shortfall:** The 1 TiB ceiling is documented only for live resize, a limited preview for enabled organisations; the size at creation is unpublished. | [link](https://cloud.morph.so/docs/documentation/instances/resize-disk) — “The target must be an integer from 256 through 1,048,576 MiB, subject to the instance's supported limits and your organization's quota.” *(docs-confirmed)* | was **not-published** |

### Idle timers (4)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `stay-on` | **yes** | **auto-sleep off.** Auto-sleep and TTL can be disabled, so a devbox behaves like a persistent VPS. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “optionally disable auto-sleep / TTL policies to behave like a persistent VPS” *(docs-confirmed)* | — |
| `choose-idle` | **partly** | **on/off only.** **Shortfall:** You can switch the idle pause off with never_sleep, but the docs never publish the default interval or a range of values. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Devboxes support wake-on-SSH/HTTP and TTL policies to auto-pause idle machines.” *(docs-confirmed)* | — |
| `wake-on-request` | **yes** | **HTTP or SSH.** An HTTP request or an SSH-backed access (SSH, exec, SDK/CLI/REST) resumes a paused instance. | [link](https://cloud.morph.so/docs/documentation/instances/wake-on) — “When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes” *(docs-confirmed)* | specifics: exec uses the SSH path |
| `schedules` | **no** | **no scheduler.** No scheduler for starting machines or jobs; a cron inside the VM stops while the VM is paused. | [link](https://cloud.morph.so/docs/documentation/instances/basic-lifecycle) — “Each instance runs from a saved snapshot.” *(inferred)* | — |

### Reaching it (6)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `public-url` | **yes** | **Anyone with link.** HTTP services are exposed to the public internet by default; auth_mode is `none` unless set to `api_key`. | [link](https://cloud.morph.so/docs/documentation/instances/http-services) — “Morph Cloud allows you to expose HTTP services running within your instances to the public internet.” *(docs-confirmed)* | was **not-published (default auth unknown)** |
| `private-url` | **yes** | **Account API key.** `auth_mode="api_key"` requires `Authorization: Bearer <Morph API key>`; the key is account-wide, not a per-service token. | [link](https://cloud.morph.so/docs/documentation/instances/http-services) — “You can enable API key authentication for your exposed services for enhanced security.” *(docs-confirmed)* | was **not-published (default auth unknown)** |
| `ssh` | **yes** | **ssh.cloud.morph.so.** A standard SSH client connects to a real SSH daemon at ssh.cloud.morph.so. | [link](https://cloud.morph.so/docs/documentation/instances/ssh) — “You can directly SSH into any MorphVM instance using standard SSH clients with your public key” *(docs-confirmed)* | — |
| `web-terminal` | **yes** | **Browser terminal.** The API reference distinguishes browser terminal access from SSH and Morph-generated credentials; the Devboxes web UI loads a terminal module. | [link](https://cloud.morph.so/docs/api-reference/revoke-managed-ssh-key) — “Browser terminal access and Morph-generated instance credentials are separate and unchanged.” *(docs-confirmed)* | was **not-published** |
| `tunnel` | **yes** | **ssh -L / -R.** Local forwarding works over the documented SSH connection; the reverse-tunnel page also documents ssh -R. | [link](https://cloud.morph.so/docs/documentation/instances/ssh) — “You can directly SSH into any MorphVM instance using standard SSH clients with your public key” *(docs-confirmed)* | specifics: reverse tunnel documented |
| `raw-tcp` | **not-published** | **Not published.** Only HTTP services are documented; there is no public arbitrary TCP port. SSH is the exception. | [link](https://cloud.morph.so/docs/documentation/instances/http-services) — “Morph Cloud allows you to expose HTTP services running within your instances to the public internet.” *(inferred)* | — |

### Custom domains (2)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `custom-domain` | **no** | **Not supported.** Custom domains are explicitly unsupported; apps answer on a Morph-generated hostname. | [link](https://cloud.morph.so/web/product/devboxes) — “Custom domains aren’t supported yet.” *(docs-confirmed)* | was **not-published** |
| `auto-https` | **no** | **provider URL only.** There is no custom domain to certify, so only the Morph-generated URL gets HTTPS; no certificate is issued for your own name. | [link](https://cloud.morph.so/web/product/devboxes) — “it’ll be reachable over HTTPS. Custom domains aren’t supported yet.” *(docs-confirmed)* | was **not-published** |

### Outbound network (4)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `egress-included` | **not-published** | **Charged, no rate.** Outbound traffic is named as a chargeable component; no rate or allowance is published. | [link](https://cloud.morph.so/web/legal/terms-of-service) — “Typical components may include but are not limited to compute, snapshot storage, and egress.” *(docs-confirmed)* | — |
| `egress-allowlist` | **not-published** | **Not published.** No outbound allowlist or firewall setting is published. | [link](https://cloud.morph.so/web/legal/terms-of-service) — “Typical components may include but are not limited to compute, snapshot storage, and egress.” *(inferred)* | — |
| `no-internet` | **not-published** | **Not published.** No setting that removes internet access entirely is published. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Full virtual machines capable of running any configuration of containers” *(inferred)* | — |
| `static-ip` | **not-published** | **Not published.** No fixed outbound address is published; exposed services get a Morph URL, not a dedicated IP product. | [link](https://cloud.morph.so/docs/documentation/instances/http-services) — “Morph Cloud allows you to expose HTTP services running within your instances to the public internet.” *(inferred)* | — |

### Keys and secrets (3)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `secrets-store` | **yes** | **template manager.** A template carries a secrets manager; org-level and user-level secret APIs exist; agent tokens can read or write secrets. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Every devbox is created from a template that integrates with our secrets manager” *(docs-confirmed)* | — |
| `hidden-secrets` | **partly** | **Model keys only.** **Shortfall:** The Responses Proxy injects model-provider credentials, so Codex or Claude Code can run on a Morph proxy key instead of an OpenAI/Anthropic key. Other API keys are ordinary secrets inside the VM. | [link](http://web.archive.org/web/20260718093544/https://cloud.morph.so/docs/responses-proxy/getting-started) — “The data plane does not require a provider key such as an OpenAI key. Send your Responses Proxy key as the request bearer token; the proxy injects the selected provider credential after resolving the model alias.” *(docs-confirmed)* | was **not-published** |
| `scoped-keys` | **yes** | **Token scopes.** Agent tokens are scoped and expiring; service delegation tokens add short-lived service/org/scope sets. | [link](https://cloud.morph.so/docs/devboxes/agent-tokens) — “Request the smallest scope set that works.” *(docs-confirmed)* | specifics: service delegation tokens added |

### Ways to drive it (8)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `dashboard-create` | **yes** | **Devboxes UI.** The Devboxes dashboard creates from a template or snapshot and opens VS Code/Cursor. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Create a devbox from a template (or a snapshot)” *(docs-confirmed)* | — |
| `cli` | **yes** | **morphcloud.** The Python package installs the `morphcloud` CLI, including volumes and EFS helpers. | [link](https://cloud.morph.so/docs/documentation/setup/installation-guide) — “Once installed, the CLI and the first-party Volumes helpers are automatically available in your environment:” *(docs-confirmed)* | — |
| `python-sdk` | **yes** | **0.1.116.** `pip install morphcloud`; the latest PyPI release is 0.1.116 (2026-10-20). | [link](https://cloud.morph.so/docs/documentation/setup/installation-guide) — “pip install morphcloud” *(docs-confirmed)* | — |
| `ts-sdk` | **partly** | **0.0.20 (2025).** **Shortfall:** The official TypeScript SDK exists, but its last npm release is 0.0.20 on 2025-10-06; the Python SDK is at 0.1.116 on 2026-10-20, so newer APIs may be Python/CLI-only. | [link](https://registry.npmjs.org/morphcloud) — “"0.0.20":"2025-10-06T18:59:53.028Z"” *(third-party)* | was **yes (stale release)** |
| `rest-api` | **yes** | **OpenAPI.** A documented REST API with OpenAPI descriptions. | [link](https://cloud.morph.so/docs/api-reference/start-instance-instance-post) — “Start a new instance from a snapshot.” *(docs-confirmed)* | — |
| `mcp-server` | **no** | **none.** No first-party MCP server is documented; agents are driven through SSH, the devbox API or tmux. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “through SSH, or puppeteered through the Devbox API” *(inferred)* | — |
| `pty` | **yes** | **tmux.** A tmux API creates sessions, sends keys and captures panes, which is a live terminal for an agent. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Automate agents with tmux (create a session and send keys)” *(docs-confirmed)* | — |
| `file-api` | **yes** | **SFTP / uploads.** Upload and download files and directories through the SDK/SFTP, plus an authenticated upload endpoint. | [link](https://cloud.morph.so/docs/documentation/instances/file-management) — “SSH enables secure file transfers between your local machine and Morph instances using SFTP.” *(docs-confirmed)* | — |

### Built-in agents (7)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `agents-preinstalled` | **no** | **none.** Devboxes boot from templates you build; no coding agent is in the default image. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Devboxes expose a full tmux API” *(inferred)* | — |
| `prompt-api` | **no** | **none.** No documented sandbox prompt API; the tmux API lets your program type into an agent you installed. The Devboxes OpenAPI has an /api/agent/chat SSE endpoint, but the docs do not describe it as a sandbox agent. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Devboxes expose a full tmux API, which lets you programmatically manage coding agents like OpenAI Codex or Claude Code.” *(docs-confirmed)* | specifics: agent/chat endpoint noted as unresolved |
| `one-click-hermes` | **no** | **none.** No Hermes template or guide is published. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Create a devbox from a template (or a snapshot)” *(inferred)* | — |
| `one-click-openclaw` | **no** | **none.** No OpenClaw template or guide is published. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Create a devbox from a template (or a snapshot)” *(inferred)* | — |
| `browser` | **partly** | **headless Chrome example.** **Shortfall:** A documented example runs headless Chrome in a container, but no browser is installed in the default image or offered as a browser API. | [link](https://cloud.morph.so/docs/documentation/instances/snapshot-setup) — “runs two containerized services (a headless Chrome and an NGINX proxy)” *(docs-confirmed)* | — |
| `desktop` | **yes** | **remote desktop.** A full XFCE desktop with VNC/noVNC is documented; it is configured per devbox, not on by default. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “You can also programmatically configure devboxes with” *(docs-confirmed)* | — |
| `hosts-other-agents` | **no** | **none.** No page documents another platform's cloud agents (Cursor, Devin, Claude Managed Agents) using Morph as their machine. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Devboxes expose a full tmux API” *(inferred)* | — |

### Teams and accounts (6)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `team-workspace` | **yes** | **organisations.** Devboxes are shareable by URL inside an organisation, and you can create multiple organisations. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “devboxes are shareable live via URL to anyone in your Morph Cloud organization” *(docs-confirmed)* | — |
| `roles` | **yes** | **admin / member.** Organisation membership carries org:admin or org:member; owners/admins can change roles and audit SSH keys. No finer permission table is published. | [link](https://cloud.morph.so/docs/api-reference/update-member-role) — “Update a member's role in an organization.” *(docs-confirmed)* | was **not-published** |
| `sso` | **not-published** | **Not published.** No SSO or SAML page or plan line is published; sign-in is a Morph account, not an identity-provider flow. | [link](https://cloud.morph.so/web/subscribe) — “Up to 1024 vCPU” *(not-published)* | — |
| `spend-cap` | **not-published** | **Not published.** No budget or hard spend cap is published; plans sell prepaid MCUs and overage is pay-as-you-go. | [link](https://cloud.morph.so/web/subscribe) — “Purchase credits to use compute” *(pricing-page)* | — |
| `usage-alerts` | **not-published** | **Not published.** No usage alert or threshold feature is published; the Usage page reports after the fact. | [link](https://cloud.morph.so/web/subscribe) — “Additional credits billed pay-as-you-go” *(pricing-page)* | — |
| `audit-log` | **partly** | **SSH keys only.** **Shortfall:** The only customer-facing audit view is SSH public-key metadata (owner, expiry, last use); there is no record of devbox, snapshot or billing actions. | [link](https://cloud.morph.so/docs/api-reference/list-organization-managed-ssh-keys) — “Owner/admin-only metadata view of active and expired user-owned keys for current organization members.” *(docs-confirmed)* | was **not-published** |

### Billing models (5)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `per-second` | **yes** | **per second.** The terms and the Devboxes FAQ both say compute is billed per second. | [link](https://cloud.morph.so/web/legal/terms-of-service) — “Per-second compute” *(pricing-page)* | — |
| `active-cpu` | **no** | **largest resource counts.** The rate follows the largest of vCPU, RAM/4 and disk/16, so spare capacity is paid for; CPU is not billed only while working. | [link](https://cloud.morph.so/web/subscribe) — “MCUs = max(vCPUs, ceil(RAM/4GiB), ceil(disk/16GiB))” *(inferred)* | — |
| `cheap-pause` | **yes** | **snapshot only.** A paused instance bills only the snapshot it created, not CPU or memory. | [link](https://cloud.morph.so/docs/documentation/instances/pause-resume) — “You only get charged for the snapshot taken” *(docs-confirmed)* | — |
| `no-monthly-fee` | **yes** | **Developer $0.** The Developer plan has no monthly fee; you buy MCUs as you go. | [link](https://cloud.morph.so/web/subscribe) — “Purchase credits to use compute” *(pricing-page)* | — |
| `flat-price` | **no** | **one rate per unit.** The price is a rate per MCU-hour, not a fixed monthly price per machine. | [link](https://cloud.morph.so/web/subscribe) — “Based on standard MCU rate of $0.05” *(inferred)* | — |

### Trials and free tiers (3)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `free-tier` | **partly** | **300 h/month claimed.** **Shortfall:** The signup page and docs FAQ promise 300 free compute hours a month, while the pricing table shows 0 MCUs and the Devboxes FAQ says the Developer tier includes 0 MCUs and you must buy credits first. | [link](https://cloud.morph.so/docs/documentation/setup/signing-up) — “Once you have your invite, our $0/month Developer Plan provides 300 free compute hours per month” *(docs-confirmed)* | — |
| `free-credit` | **partly** | **300 MCUs claimed.** **Shortfall:** The Plans doc says 300 MCUs free; the pricing table lists 0 MCUs of starting credit and the Devboxes FAQ says 0 MCUs. | [link](https://cloud.morph.so/docs/documentation/setup/plans) — “Starting Credit Allocation: 300 MCUs free” *(docs-confirmed)* | — |
| `no-card` | **not-published** | **Not published.** No page says whether a card is needed; an invitation is mentioned. | [link](https://cloud.morph.so/docs/documentation/setup/signing-up) — “Once you have your invite” *(not-published)* | — |

### Company (5)

| Capability | Verdict | Figure / shortfall | Evidence | Changed |
|---|---|---|---|---|
| `status-page` | **yes** | **100% over 90 days.** A public status page reports all services online and 100% uptime for the Morph Cloud API over 90 days; no incidents in Sep–Nov 2026. | [link](https://status.cloud.morph.so/) — “All services are online” *(docs-confirmed)* | — |
| `sla` | **no** | **no public SLA.** No numeric uptime target or credit schedule is published; a separately signed SLA would control. | [link](https://cloud.morph.so/web/legal/terms-of-service) — “If a separate SLA is attached to the Order, that SLA controls” *(docs-confirmed)* | — |
| `soc2` | **not-published** | **AutoInfra report.** The terms promise attestations on request. The Delve portal brands itself 'Morph Trust Center' and claims 'SOC 2 Type II Compliant', but its only report is 'AutoInfra, Inc. SOC 2 Type 2 Report 2025' and its links point to morphllm.com; no report names Morph Labs, Inc. | [link](https://trust.delve.co/morph) — “AutoInfra, Inc. SOC 2 Type 2 Report 2025” *(third-party)* | specifics: portal claim vs report entity |
| `dpa` | **not-published** | **Not published.** No DPA page or reference appears in the terms; the terms offer security attestations on request instead. No privacy policy or subprocessor page is published on cloud.morph.so. | [link](https://cloud.morph.so/web/legal/terms-of-service) — “we’ll provide available third-party security attestations” *(docs-confirmed)* | — |
| `open-source` | **no** | **hosted only.** Morph Cloud is hosted; no self-hosted or open-source edition is published. The Python and TypeScript SDKs are Apache-2.0, but the service is not self-hostable. | [link](https://cloud.morph.so/docs/devboxes/getting-started) — “Morph Devboxes are the simplest way to code with AI in the cloud.” *(inferred)* | — |
## Rate card and arithmetic

### Inputs that did **not** change

| Input | Original unit | Value | Evidence |
|---|---|---:|---|
| MCU rate | USD per MCU-hour | **$0.05** | [Pricing](https://cloud.morph.so/web/subscribe): “Based on standard MCU rate of $0.05” |
| MCU bundle | vCPU-hour + RAM-hours + disk-hours | **1 vCPU-hour + 4 GB RAM-hours + 16 GB disk-hours** | [Pricing](https://cloud.morph.so/web/subscribe): “1 vCPU-hour”, “4 GB RAM-hours”, “16 GB disk-hours” |
| Snapshot bundle | TB-hours per MCU | **5 TB snapshot-hours** | [Pricing](https://cloud.morph.so/web/subscribe): “5 TB snapshot-hours” |
| Devbox meter | largest dimension | **max(vCPU, ceil(RAM/4 GiB), ceil(disk/16 GiB))** | [Pricing](https://cloud.morph.so/web/subscribe): “MCUs = max(vCPUs, ceil(RAM/4GiB), ceil(disk/16GiB))” |
| Team plan | USD/month; included MCUs | **$40; 1,000 MCUs** (“20% Discount ($50 value)”) | [Pricing](https://cloud.morph.so/web/subscribe) |
| Scale plan | USD/month; included MCUs | **$250; 7,500 MCUs** (“33% Discount ($375 value)”) | [Pricing](https://cloud.morph.so/web/subscribe) |
| Developer plan | USD/month; starting MCUs | **$0; 0 MCUs** | [Pricing](https://cloud.morph.so/web/subscribe): “0 MCUs”; “Purchase credits to use compute” |
| Devbox concurrency / total | count | **8 / 32**, **32 / 128**, **128 / 512** | [Pricing](https://cloud.morph.so/web/subscribe) |
| Volumes | USD per GiB-hour | **$0.0054794** (~$4.00/GiB-month) | [Volumes](https://cloud.morph.so/docs/volumes/getting-started): “Current runtime price: `$0.0054794/GiB-hour`” |
| Egress | USD per GiB | **null / unpublished** | [Terms](https://cloud.morph.so/web/legal/terms-of-service): “compute, snapshot storage, and egress” |

The price-baseline figures on the subscribe page are unchanged (`$0 $0.05 $0.12 $250 $375 $40 $50`); `npm run check-rates` printed no `morph` line. The `$0.12` is the snapshot example, not a plan price.

### Inputs that changed, are new, or are missing from the card

**1. No numeric sandbox rate changed.** The $0.05 MCU, the 1/4/16 bundle, the 5 TB snapshot bundle, the $40/$250 plans and the $0/$50/$375 credits are identical to 2026-10-28. The only money-bearing wording change is the pricing page's call to action: the server-rendered HTML says “Purchase **MCUs** to use compute”; the hydrated page says “Purchase **credits** to use compute”. The visible page is the latter. This is a copy change, not a rate change.

**2. Morph EFS is a new (to the site) storage product with its own rates.** The live pricing page does not list it; the archived EFS billing page does:

| Plan | EFS storage | Concurrent filesystems |
|---|---:|---:|
| Free / trial | included allowance controlled by account policy | **1** |
| Developer | **$0.12 / GiB-month** | **5** |
| Team | **$0.15 / GiB-month** | **25** |
| Scale | **$0.18 / GiB-month** | **100** |

Source: [EFS usage and billing](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/usage-and-billing) — “Current approved plan defaults”; “$0.12/GiB-month”; “5 concurrent filesystems”. Billing is on stored data, not active mounts; non-zero sampled bytes round up to the next GiB-month. The current live docs do not contain this page (see contradiction 5). Do not treat it as a currently published rate without checking access.

**3. Morph Actions is a separate CI product priced from the same MCU pool.**

| Runner | Shape | MCU/hour | Effective $/hour at $0.05 |
|---|---|---:|---:|
| Small | 2 vCPU / 4 GB / 40 GB | **3** | **$0.15** |
| Medium | 4 vCPU / 8 GB / 80 GB | **5** | **$0.25** |
| Large | 8 vCPU / 16 GB / 160 GB | **10** | **$0.50** |

Sources: [Pricing](https://cloud.morph.so/web/subscribe): “Small 3 MCU/hr 2 vCPU / 4 GB RAM / 40 GB disk”, “Medium 5 MCU/hr”, “Large 10 MCU/hr”; [Actions docs](https://cloud.morph.so/docs/actions/getting-started): “Current runner shapes map to: `small`: 2 vCPU / 4 GB RAM / 40 GB disk (`3 MCU/hr`) …”. The pricing page says “about 30-45% below industry-leading alternatives”; the Actions product page says “30-40% less expensive”. Minor first-party contradiction, no rate impact.

**4. The 1 TiB live disk ceiling is a plan input, but not in the card.** [Live Disk Capacity](https://cloud.morph.so/docs/documentation/instances/resize-disk): “The target must be an integer from 256 through 1,048,576 MiB, subject to the instance's supported limits and your organization's quota.” 1,048,576 MiB = **1 TiB**. It is a limited preview for organisations enabled by Morph; CPU and memory changes still use configurable reboot. The `RateCard` has no `maxDisk` set for Morph, so the calculator will not flag a 2 TiB request as over the documented resize ceiling. Because the ceiling is preview-gated and the creation maximum is unpublished, leaving `maxDisk` unset is defensible, but the limitation should be stated.

**5. Plan ceilings are published but ambiguous, so the card leaves them out.** [Pricing](https://cloud.morph.so/web/subscribe) lists:

| Plan | vCPU | RAM | Storage |
|---|---:|---:|---:|
| Developer | 64 | 256 GB | 1,024 GB |
| Team | 256 | 1,024 GB | 4,096 GB |
| Scale | 1,024 | 4,096 GB | 16,384 GB |

The table is headed “MorphVM” and the rows are “Instances”, “RAM”, “Storage”; the separate “Devboxes” block gives concurrency and total counts. It is not stated whether the first block is a **per-VM** ceiling or an **account-wide** pool. The site's `research/rates/morph.json` reads them as organisation-wide (`poolVcpu` etc.). The 1 TiB live-resize ceiling is consistent with “Storage” being an account total, not a per-disk maximum. Until Morph says which, the safe reading is: **the 16 vCPU / 32 GiB shape is documented; the largest single VM is not; do not turn 1,024 vCPU into a per-VM `maxVcpu`.** The card currently leaves `maxVcpu`, `maxRam` and `maxDisk` unset.

**6. TypeScript SDK is stale; Python SDK is current.** PyPI `morphcloud` **0.1.116**, uploaded **2026-10-20** (requires Python ≥3.10). npm `morphcloud` **0.0.20**, published **2025-10-06** — the latest of 37 versions, no release in ~13 months. The docs still say `npm install morphcloud`. Newer APIs (agent tokens, service delegation, snapshot tokens, EFS, live disk resize) are documented with Python/CLI examples; the TS SDK's coverage of them is unverified. This is a capability-row shortfall, not a rate change.

### A/B/C: inputs, not totals

The task says not to recompute totals; these are the inputs and the one arithmetic inconsistency found.

- **A** — 2 vCPU / 4 GiB / 10 GiB, 1,000 × 10 min = 166.67 h, disk deleted after each task. `max(2, 4/4, 10/16) = 2 MCU/h`; 333.33 MCU × $0.05 = **$16.67**. The disk dimension is below 16 GiB, so CPU sets the rate. Unchanged.
- **B** — 4 vCPU / 8 GiB / 50 GiB, 730 h uninterrupted. `max(4, 8/4, 50/16) = max(4, 2, 3.125) = 4 MCU/h`; 2,920 MCU × $0.05 = **$146.00**. CPU, not disk, sets the rate; the baseline note “The disk dimension sets the rate at 4 MCU/hour” is wrong — disk gives 3.125, CPU gives 4. This is a prose error, not a total error. **Fix the note.**
- **C** — 2 vCPU / 4 GiB / 20 GiB, 90 running + 640 stopped hours (730 total). Running: `max(2, 1, 20/16=1.25) = 2 MCU/h`; 90 × 2 × $0.05 = **$9.00**. Paused: the snapshot is RAM + disk = 24 GB; 24 × 640 × $0.00001 = **$0.1536**; total **$9.1536 → $9.15**. The site's line says “24 GB × 630 h”, which is 90 + 630 = 720 h, not 730. **Change 630 → 640**; the total stays $9.15 at 2 dp under the current per-GiB reading (see the unit note below). The engine's `hoursOf()` uses 730 − 90 = 640, so the executable card is right and the hand-written line is wrong.

**Snapshot example confirms the paused basis.** The pricing page says “Persisting an 8vCPU MorphVM with 8GB RAM and 8GB disk as a snapshot costs: **$0.12/month**”. At 5 TB = 5,000 GB per MCU: 16 GB × 730 h ÷ 5,000 = 2.336 MCU × $0.05 = **$0.1168 → $0.12**. Disk alone would be $0.0584 → $0.06; RAM alone the same. The $0.12 therefore confirms **RAM + disk** and **decimal GB/TB**, not GiB. This supports `stoppedIncludesRam: true` and the $0.00001/GB-hour figure.

### Unit and model limitations

- **GB vs GiB in the meter.** The pricing page's unit legend uses **GB** and the snapshot example uses **GB/TB**; the devbox formula uses **GiB** (`RAM/4GiB`, `disk/16GiB`). The site follows the formula (GiB). For the snapshot rate, the site's `$0.00001` is treated as per **GiB**-hour because `decimalGB` is not set, while the page's example is consistent with **decimal GB**. A strict conversion is `$0.000010737/GiB-hour`. On C's 24 GiB × 640 h this is $0.1649 instead of $0.1536 — about **1.1 cents**, enough to move the displayed total from $9.15 to $9.16 if `decimalGB: true` is set. The site currently shows $9.15. State the assumption rather than silently mixing units; do not change the total without deciding the unit.
- **5 TB is decimal.** The example confirms 5,000 GB, not 5,120 GiB. Do not use 5,120.
- **The “+” in the MCU legend is a bundle, not a sum.** “1 vCPU-hour + 4 GB RAM-hours + 16 GB disk-hours” describes what one MCU buys; the devbox meter is `max(...)`, not the sum. A 2 vCPU / 4 GiB / 32 GiB box is 2 MCU/h, not 2 + 1 + 2 = 5. The site's note is correct; the pricing page's wording is easy to misread.
- **Plan ceilings may be per-VM or account-wide.** See input 5. This affects `big-machines`, `big-disk`, and whether a 1,024 vCPU / 4,096 GB single VM is real. The 16 vCPU / 32 GiB example is safe; the 1,024 figure is not.
- **EFS has no `RateCard` field.** The per-plan $0.12/$0.15/$0.18 GiB-month rate and the 5/25/100 filesystem quotas are outside the card. If EFS is added to a workload, the engine will silently omit it. Add a note or a new field; do not treat EFS as free.
- **Actions has no `RateCard` field.** The 3/5/10 MCU/hour runner rates are outside the sandbox card. Same caveat.
- **Egress is `null`, not zero.** The terms name it as billable; no rate or allowance is published. The model must not present $0 egress.
- **No minimum duration.** The terms say per-second compute; no minimum billable interval is published. Do not invent one.

### Rate-card disposition

`site/src/data/pricing/morph.json` needs **no rate-field change**:

- `mcu.rate` 0.05 — unchanged.
- `mcu.ramPer` 4, `mcu.diskPer` 16 — unchanged.
- `disk.stopped` 1e-5, `disk.stoppedIncludesRam` true — unchanged; the $0.12 snapshot example now supports both.
- `between` “kept” — unchanged (pause keeps the snapshot; stop deletes).
- `egress.perGiB` null — unchanged.
- `plans` Developer 0, Team 40/50, Scale 250/375 — unchanged.

Change `checkedOn` to **2026-11-12** and update `notes` / `summary` to mention the four-page free-tier contradiction, EFS and Actions as unmodelled products, and the decimal-GB vs GiB assumption. Do **not** add EFS or Actions rates to `mcu`/`disk`; they are different products.

## First-party contradictions and ambiguities

These are places where two pages on `cloud.morph.so` (or two parts of one page) disagree. The site should preserve both sides in its evidence and say which reading the verdict uses.

### 1. Free tier: 0 MCUs vs 300 MCUs vs 300 hours/month

| Side | Quote | Source |
|---|---|---|
| A | “Starting credit allocation **0 MCUs**”; Developer CTA “**Purchase credits** to use compute” | [Pricing](https://cloud.morph.so/web/subscribe) |
| B | “Starting Credit Allocation : **300 MCUs free**” | [Plans](https://cloud.morph.so/docs/documentation/setup/plans) |
| C | “our $0/month Developer Plan provides **300 free compute hours per month** here with pay-as-you-go pricing after that” | [Signing Up](https://cloud.morph.so/docs/documentation/setup/signing-up) |
| D | “Yes! The Developer Plan provides **300 free compute hours per month** with pay-as-you-go pricing after that.” | [Docs FAQ](https://cloud.morph.so/docs/faq) |
| E | “The Developer tier includes **0 Morph Compute Units (MCUs)**. Purchase credits on Billing before creating a devbox.” | [Devboxes FAQ](https://cloud.morph.so/web/product/devboxes) |

**Reading used:** `free-tier` = **partly** and `free-credit` = **partly**. The 300-hour/month figure is repeated on two docs pages, but the current pricing table says 0 and the Devboxes FAQ says 0 and requires a purchase before creating a devbox. The Plans page's “300 MCUs free” is the weakest of the five (it is the only one that calls the 300 an MCU *starting allocation*). A new user may or may not get 300 hours; the site says so. Do not claim “300 free hours” as a clean yes, and do not claim “no free tier” as a clean no.

**Why it matters:** the free tier is the first thing a nontechnical reader checks. The contradiction is also a sign the pricing table was changed without updating the docs, or vice versa. The site's `free-tier` and `free-credit` rows should carry the four-way conflict, not a single quote.

### 2. Custom domains: “not supported yet” vs “instantaneous deployment … to custom DNSes”

| Side | Quote | Source |
|---|---|---|
| A (current FAQ) | “Yes—add a service with a name and port in the Devbox Network tab and it’ll be reachable over HTTPS. **Custom domains aren’t supported yet.**” | [Devboxes FAQ](https://cloud.morph.so/web/product/devboxes) |
| B (Nov 2024 launch post) | “**Instantaneous deployment of applications to custom DNSes**” | [Introducing Infinibranch](https://cloud.morph.so/docs/blog/developers) |

**Reading used:** `custom-domains` = **no**; `custom-domain` = **no**. The FAQ is the current, specific statement; the blog is a 2024 launch claim and its own example URL is `web.morphvm-1234.cloud.morph.so`, a Morph subdomain, not a customer domain. “Custom DNSes” may have meant the automatic per-service DNS name, not a user-supplied domain. The site should say “no custom domains; HTTPS on a Morph-provided hostname” and note the older blog wording only if it adds confusion.

### 3. Windows and nested virtualization: “experimental support” vs “soon”

| Side | Quote | Source |
|---|---|---|
| A | “There is **experimental support for Windows, OSX (x86), and nested virtualization** as well.” | [Devboxes product page](https://cloud.morph.so/web/product/devboxes) |
| B | “You can run any configuration of docker containers … and **soon with support for Windows and nested virtualization**.” | Same page, body copy |

**Reading used:** `windows` = **no** (not a documented, selectable guest); `nested-virtualization` = **no/not-published**. The page contradicts itself within a few paragraphs. “Experimental support” is stronger than “soon”, but neither is a docs page with an image name, a launch command or a limitation. Treat Windows and nested virtualization as preview/undocumented, not as capabilities a buyer can rely on.

### 4. SOC 2: the portal says “Morph”, the report says “AutoInfra, Inc.”

| Side | Quote | Source |
|---|---|---|
| A | “**SOC 2 Type II Compliant**”; “**SOC 2 Type I Compliant**” | [Delve “Morph Trust Center”](https://trust.delve.co/morph) |
| B | “**AutoInfra, Inc. SOC 2 Type 2 Report 2025**”; “security@**morphllm**.com”; “**morphllm**.com/privacy” | Same portal |
| C | “we’ll provide available **third-party security attestations**” (no SOC 2 named) | [Terms](https://cloud.morph.so/web/legal/terms-of-service) |

**Reading used:** `soc2` = **not-published** for Morph Labs, Inc. The portal's only report is issued for **AutoInfra, Inc.**, and every contact/link points to **morphllm.com**, not **morph.so** or “Morph Labs, Inc.” The badge is a claim, not a report naming the entity. There are three plausible readings: (i) AutoInfra is Morph Labs' legal entity (then the report is theirs, but the site should say so); (ii) the portal is shared with Morph LLM, a different company (then the badge is a name collision); (iii) the report is a template/placeholder (then it proves nothing). The site uses the cautious reading (iii/ii) and says “no report naming Morph Labs”. This is honest but may understate a real certification; the parent should decide whether to query Morph or leave the caveat.

### 5. Morph EFS: live product, 404 docs

| Side | Quote | Source |
|---|---|---|
| A (live) | “Morph EFS” and “`morphcloud plugin install efs`” in the live disk-resize page | [Resize Disk Capacity](https://cloud.morph.so/docs/documentation/instances/resize-disk) |
| B (live) | `/web/efs` returns 200 and markets EFS | [EFS product page](https://cloud.morph.so/web/efs) |
| C (dead) | `/docs/efs/getting-started`, `/docs/efs/concepts`, `/docs/efs/usage-and-billing`, `/docs/efs/mount`, `/docs/efs/limits`, `/docs/efs/ttl`, `/docs/efs/quickstart` all **404** | Checked 2026-11-12 |
| D (archive) | “**Morph Ephemeral File System (Morph EFS)** is a fast, shared, ephemeral filesystem … mount the same EFS from multiple Morph instances” | [Archived docs](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/getting-started) |

**Reading used:** EFS is **live** (product page, CLI, resize page, `/web/efs`) but its docs are **not currently published** at the URLs the product page and older pages use. The archive is dated 2026-07-18 and is the best available description. Cite it with a “docs currently 404; archived July 2026” note. The 2026-10-28 baseline missed EFS entirely, probably because it only crawled `/docs` and `/llms.txt`; EFS is not in the current `llms.txt` index. This is a real coverage gap in the site's research method, not just a Morph quirk.

### 6. Responses Proxy: live service, 404 docs

| Side | Quote | Source |
|---|---|---|
| A (live) | `{"status":"ok"}` | [`/healthz`](https://agent-responses-proxy.svc.cloud.morph.so/healthz) |
| B (live) | OpenAPI document with `/v1/responses`, `/v1/messages`, `/v1/models`, aliases, telemetry | [`/openapi.json`](https://agent-responses-proxy.svc.cloud.morph.so/openapi.json) |
| C (dead) | `/docs/responses-proxy` **404** | Checked 2026-11-12 |
| D (archive) | “Responses Proxy … OpenAI Responses-compatible … Anthropic Messages-compatible” | [Archived docs](http://web.archive.org/web/20260718093544/https://cloud.morph.so/docs/responses-proxy/getting-started) |

**Reading used:** the service is live; the docs page is not. The archived July 2026 page plus the live OpenAPI is enough to describe it, with a caveat that the public docs are currently 404. Do not call it “discontinued” just because the docs link is dead.

### 7. The MCU unit legend uses “+” but the meter uses `max`

| Side | Quote | Source |
|---|---|---|
| A (legend) | “1 vCPU-hour **+** 4 GB RAM-hours **+** 16 GB disk-hours” | [Pricing](https://cloud.morph.so/web/subscribe) |
| B (meter) | “MCUs = **max**(vCPUs, ceil(RAM/4GiB), ceil(disk/16GiB))” | Same page |

**Reading used:** A describes the bundle one MCU buys; B is the billing formula. They are consistent if read as “one MCU covers up to 1 vCPU-hour **and** up to 4 GB RAM-hours **and** up to 16 GB disk-hours, whichever is largest”. A 2 vCPU / 4 GiB / 32 GiB box is 2 MCU/h, not 2 + 1 + 2 = 5. The site's note says this; keep it. This is a wording trap for nontechnical readers, not a provider contradiction.

### 8. Plan ceilings: per-VM maximum or account-wide pool?

| Side | Quote | Source |
|---|---|---|
| A | “MorphVM — **Instances**: Up to 1024 vCPU; **RAM**: Up to 4096 GB; **Storage**: Up to 16384 GB” | [Pricing](https://cloud.morph.so/web/subscribe), Scale column |
| B | “The target must be an integer from 256 through **1,048,576 MiB**” (1 TiB per disk) | [Resize Disk](https://cloud.morph.so/docs/documentation/instances/resize-disk) |
| C | “Devboxes — Concurrency: 128; Total: 512” | [Pricing](https://cloud.morph.so/web/subscribe) |

**Reading used:** unresolved. A is headed “MorphVM” and the row is “Instances”, which could mean “the largest single instance” or “the total instances in the plan”. C is clearly account-level (concurrent and total devboxes). If A is per-VM, Scale offers a 1,024 vCPU / 4 TiB single VM, which is plausible for a VM company but far above the 16 vCPU example; if A is account-wide, it is a pool, and the 1 TiB per-disk cap is consistent. The site's rate card leaves the maxima unset and its `big-machines` row uses the 16 vCPU example. Do not turn 1,024 into a per-VM ceiling without a sentence that says “account-wide or per-VM, not stated”.

### 9. Actions discount: 30–45% vs 30–40%

| Side | Quote | Source |
|---|---|---|
| A | “effective pricing that lands about **30-45% below** industry-leading alternatives” | [Pricing](https://cloud.morph.so/web/subscribe) |
| B | “Compared to industry-leading alternatives, Morph Actions is **30-40% less expensive**.” | [Actions product FAQ](https://cloud.morph.so/web/product/actions) |

**Reading used:** quote A on the pricing page, B on the product page; do not repeat either as a measured fact. The runner rates (3/5/10 MCU/hr) are the hard numbers. The percentage is a marketing comparison with an unnamed baseline. Minor.

### 10. TypeScript SDK is a year behind the Python SDK

| Side | Quote | Source |
|---|---|---|
| A (npm) | `morphcloud` **0.0.20**, published **2025-10-06**; 37 versions | [npm](https://www.npmjs.com/package/morphcloud) |
| B (PyPI) | `morphcloud` **0.1.116**, uploaded **2026-10-20** | [PyPI](https://pypi.org/project/morphcloud/) |
| C (docs) | “npm install morphcloud” / Python install, presented as equals | [SDK Installation](https://cloud.morph.so/docs/documentation/setup/installation-guide) |

**Reading used:** `ts-sdk` = **partly**. The package exists and is installable, but it has not been released in ~13 months while Python has. Newer APIs are documented with Python/CLI examples; TS coverage is unverified. Not a contradiction, a currency gap.

### 11. Third-party funding and headcount conflict

| Side | Quote | Source |
|---|---|---|
| A | “In September 2024, Morph Labs raised **$5.75 million** in seed funding led by **Khosla Ventures**.” | Grokipedia (third-party) |
| B | “**Total raised** unknown”; “**Last round** unknown”; “Headcount **1-10** estimated” | [RL List](https://www.rl-list.com/vendors/morph), updated 2026-10-05 |
| C | Tracxn: **500** (page no longer renders the old “has not raised any funding yet” line) | Tracxn (login wall) |

**Reading used:** the site says “funding unconfirmed” and gives the Grokipedia figure as a report, not a fact; headcount “1–10” from RL List. The baseline's “another says no funding” quote from Tracxn is no longer verifiable (500), so don't repeat it as a live counter-quote. This is third-party, not first-party; keep it out of the provider's own claims.

### 12. Server-rendered “MCUs” vs hydrated “credits”

| Side | Quote | Source |
|---|---|---|
| A (raw HTML) | “Purchase **MCUs** to use compute” | `curl` of `/web/subscribe` |
| B (hydrated) | “Purchase **credits** to use compute” | Browser after JS |

**Reading used:** B is what a user sees; A is the fallback. Same product, different word. Not a substantive contradiction, but a reminder that `curl` of this SPA can capture stale copy. The site's pricing quote uses B.

### 13. Internal inconsistencies in the current site data (not first-party)

These are in `site/src/data/providers/morph.json`, `pricing/morph.json` or `research/morph.md`, not on Morph's pages. Fix them in the integration commit:

| Where | Current text | Problem | Suggested |
|---|---|---|---|
| `provider.cost.B.notes` | “The disk dimension sets the rate at 4 MCU/hour.” | 50/16 = 3.125; **CPU** (4) sets the rate | “The CPU dimension sets the rate at 4 MCU/hour; disk is 3.125.” |
| `provider.cost.C.shape`, `.lines[1].arithmetic` | “630 paused”; “24 GB × **630** h” | 730 − 90 = **640**; 90 + 630 = 720 | “640 paused”; “24 GB × **640** h” |
| `provider.usability.docs` | “No independent status page was verified.” | `status.cloud.morph.so` exists and `research/morph.md` §17 cites it | “Status page at status.cloud.morph.so; docs at cloud.morph.so/docs.” |
| `provider.fits.badly` | “An attached block volume: Morph Volumes is S3-compatible object storage behind a gateway.” | Morph EFS is an attached filesystem (FUSE); the sentence ignores it | “An attached block volume with a normal Linux disk: Volumes is S3-compatible object storage behind a gateway, and EFS is a FUSE filesystem, not a block device.” |
| `provider.caveats` | “Volumes are S3-compatible object storage, not an attached block disk.” | True of Volumes, but ignores EFS | “Volumes is object storage; EFS is a shared FUSE filesystem; neither is a block device.” |
| `provider.billing.planFee` | “including 0 … MCUs” | Plans says 300 MCUs free | “including 0 MCUs on the pricing table (the Plans doc says 300)” |
| `pricing/morph.json.notes[1]` | “0 units … 300 units … 300 compute hours” (three pages) | The Devboxes FAQ adds a fourth: “0 MCUs … Purchase credits … before creating a devbox.” | Add the Devboxes FAQ to the contradiction note. |
| `research/morph.md` §11 | “If paused for 630 hours … 24 × 630” | 730 − 90 = 640 | “640 hours … 24 × 640” (total still $9.15 at 2 dp). |
| `research/morph.md` §4 | Mentions EFS as “distinct from root capacity” but gives it no product row | EFS is a named FUSE filesystem with its own rate/quota; the archive is now the only docs | Add an EFS bullet with the archive URL and the 404 caveat. |
| `research/morph.md` §7 | “Python”, “TypeScript”, “CLI” documented side by side, no currency note | npm is 0.0.20 (2025-10-06); PyPI 0.1.116 (2026-10-20) | Add the version/date gap. |
| `research/morph.md` §14 | Free-credit conflict lists pricing/plans/signup, not the Devboxes FAQ | The FAQ is the strongest “0 MCUs” statement | Add it. |
| `research/morph.md` §17 | SOC 2 bullet says the portal “instead identifies” AutoInfra; no mention of the badge claim | The portal simultaneously says “SOC 2 Type II Compliant” | Quote both the badge and the report. |

The `provider.cost.C` line and `fits.badly`/`caveats` are the ones that most affect a reader; the `usability.docs` line is a factual error. The rest are stale research notes or missing caveats.

---

## Products the 16 features and 78 capabilities miss

The comparison axes are sandbox-centric: compute, isolation, lifecycle, snapshots, storage, networking, reach, interfaces, agents, accounts, billing, support, company. Morph now sells three adjacent products that do not fit any axis cleanly. A reader comparing “sandbox providers” will not see them, and the site's cost model will silently omit them.

### 1. Morph Actions — GitHub Actions runners on the same MCU pool

**What it is.** “Morph Actions is **GitHub Actions on Morph Cloud**.” Install the Morph GitHub App, merge a generated migration PR that changes the workflow `runs-on` labels, and GitHub jobs execute on Morph-managed runners. GitHub still owns workflow files, triggers and PR review; Morph adds setup state, repository visibility sync, a migration PR, `workflow_dispatch` from the Morph UI, run list, run details, live logs and CI analytics. ([Actions getting started](https://cloud.morph.so/docs/actions/getting-started), [product page](https://cloud.morph.so/web/product/actions))

**Runner shapes and price.** Small 2 vCPU / 4 GB / 40 GB = **3 MCU/hr** ($0.15/hr); Medium 4 / 8 / 80 = **5 MCU/hr** ($0.25/hr); Large 8 / 16 / 160 = **10 MCU/hr** ($0.50/hr). Billed hourly from the same MCU balance; “Additional credits billed pay-as-you-go”. ([Pricing](https://cloud.morph.so/web/subscribe))

**Why the matrix misses it.** No feature asks “does it run GitHub Actions jobs?”. `ways-to-drive` is about how *you* reach a sandbox, not where CI runs. `billing-models` is about the sandbox meter. `snapshots-forks` is about state. Actions is a separate control plane that happens to share the meter. It is also the strongest answer to “why not just use GitHub-hosted runners?”: the claimed 30–45% discount and the same MCU pool as devboxes.

**What to do.** Add it to the provider's `whatItIs` or a caveat, and to the relevant use-case notes (`build-and-test`, `github-actions-ci`). Do **not** add a new feature row for the fan-out; the parent can decide whether the site needs a 17th axis. If a reader is comparing CI cost, the site currently gives them no Actions number.

### 2. Morph EFS — an actual shared filesystem, not object storage

**What it is.** “**Morph Ephemeral File System (Morph EFS)**” — “named filesystems that can be mounted into a supported Linux environment and used through ordinary file operations.” The CLI installs as `morphcloud efs`; the default mount path is `~/morph-efs/<name>`; the same filesystem can be mounted from multiple Morph instances; optional TTL; a TUI and browser dashboard; per-plan concurrent-filesystem quotas. ([Concepts](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/concepts), [Getting started](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/getting-started))

**Rates and quotas.** Developer **$0.12/GiB-month**, Team **$0.15**, Scale **$0.18**; concurrent filesystems **5 / 25 / 100**; free/trial **1**, allowance by account policy. Billing is on stored data, sampled; non-zero rounds up to the next GiB-month; mounts are not charged. ([Usage and billing](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/efs/usage-and-billing))

**Why the matrix misses it.** `storage` distinguishes “disk” from “bucket”; EFS is neither. `snapshots-forks` covers snapshot state; EFS is a live shared mount. The archive says “ephemeral” and “shared”, but does not state what happens to the mount when the host is paused or stopped — that lifetime question is the important one and is under-documented. `mount-buckets` asks whether an S3 bucket can be mounted; EFS asks whether a *filesystem* can be shared. The current `volumes` and `shared-volume` rows are about the same product (Morph Volumes, S3); EFS is a second, different answer. The baseline's `volumes` = partly and `shared-volume` = partly may understate the provider now that EFS exists, even though EFS's docs are 404.

**What to do.** Add an EFS bullet to `storage`/`snapshots-forks` caveats, update `fits.badly` and `caveats` (see contradictions 13), and mention the 404 in the evidence. Do not mark `volumes` = yes on the strength of a product page whose docs are missing; “partly” with an EFS note is the honest verdict.

### 3. Responses Proxy — a model gateway, not a sandbox

**What it is.** “Responses Proxy exposes an **OpenAI Responses-compatible endpoint** for Codex and other agent clients. … Claude Code uses the same registry through the **Anthropic Messages-compatible gateway** at `/v1/messages`. The proxy resolves that alias to a registered provider, **injects the provider credential**, translates the request when needed, and records durable telemetry for sessions, requests, routing decisions, token usage, and proxy-owned response state.” ([Archived getting started](http://web.archive.org/web/20260718091200/https://cloud.morph.so/docs/responses-proxy/getting-started))

**Surface.** Org-scoped `rprx-` proxy keys; registered model aliases such as `openai/gpt-mini`, `kimi/k2`, `anthropic/sonnet`; provider registration (OpenAI, Anthropic, Kimi/OpenRouter, custom); routing pools with weighted least-connections, session affinity and response affinity; admin history APIs (`/admin/overview`, `/admin/metrics`, `/admin/requests`, `/admin/decisions`); a browser “Responses” console page; Claude Code BYOS (bring-your-own-subscription) OAuth sessions; Codex OAuth sessions; usage pricing rules and alerts; audit events; incidents and notifications. The live OpenAPI has 87 paths, far more than the getting-started page.

**Why the matrix misses it.** `built-in-agents` asks whether the provider has its own agent; Responses Proxy is a *gateway for other agents' models*, with credential injection. `keys-secrets` asks about secrets; the proxy's “provider credential injected, never exposed to the client” is a distinct pattern. `outbound-network` asks what the sandbox can reach; the proxy is a service the sandbox (or your laptop) calls. `custom-domains`/`reaching-it` are about the sandbox's HTTP surface. No axis covers “model routing / OpenAI-compatible gateway”.

**What to do.** Mention it in `built-in-agents` (Morph's agent story includes a model gateway, not just a chat box) and in `keys-secrets` (model-provider keys can be injected by the proxy). If the site ever adds a “model access” axis, this is the product. The 404 docs are a caveat; the live `/healthz` and `/openapi.json` are evidence it runs.

### 4. Snapshot sharing across organizations

**What it is.** A snapshot can be exported as a **stateless token** and pulled into another organization: “Generate a stateless token for sharing a snapshot”; “Copy a valid shared snapshot into the authenticated organization. Supply a sharing token in the body or query; bearer fallback is retained.” There is also an admin “Copy snapshot to another organization”. ([Create Snapshot Token](https://cloud.morph.so/docs/api-reference/create-snapshot-token-snapshot-snapshot-id-token-post), [Pull Snapshot](https://cloud.morph.so/docs/api-reference/pull-snapshot-snapshot-pull-post))

**Why the matrix misses it.** `snapshots-forks` covers create/branch/restore and TTL, not cross-org distribution. This is the “share a golden image with a customer/partner” primitive that a template marketplace or a CI cache needs. It also changes the security story: a snapshot token is a bearer capability, so treat it like a secret.

**What to do.** Add a sentence to the `snapshots-forks` row and to `keys-secrets` (tokens are shareable credentials). No verdict change.

### 5. Managed SSH keys and instance-scoped access bundles

**What it is.** Two layers beyond the per-instance key pair:

- **Managed SSH public keys** registered at the org/user level, with an expiry, listed/revoked/renamed by owners and admins: “Register an SSH public key”, “Revoke a managed SSH public key”, “Rename a key or change its expiry”; “Owner/admin-only metadata view of active and expired user-owned keys for current organization members. Public-key text is omitted.”
- **Instance-scoped access bundles** for sharing SSH without the API key: “a trusted operator mints **instance-scoped SSH credentials** once (using `MORPH_API_KEY`), then shares only an **instance-scoped access bundle** with the recipient.” The bundle contains the private key and password; the recipient uses only `ssh.cloud.morph.so`. ([Share SSH access](https://cloud.morph.so/docs/documentation/instances/ssh-sharing), [Audit SSH keys](https://cloud.morph.so/docs/api-reference/list-organization-managed-ssh-keys))

**Why the matrix misses it.** `keys-secrets` is about API keys and env vars; `teams-accounts` is about roles. SSH credential lifecycle is a third thing. The access bundle is a neat answer to “how do I let a contractor into one box without giving them my account?” — worth a sentence in `reaching-it` and `teams-accounts`.

**What to do.** Mention in `reaching-it` (SSH is real, and can be delegated per instance) and `keys-secrets` (bundle is a credential; revoke by rotating the instance key). The audit endpoint is the only “audit log” Morph has; keep `audit-log` = partly.

### 6. Service delegation tokens

**What it is.** “Exchange the authenticated user's web/API session for a **short-lived service delegation token** scoped to one service, organization, and scope set. This does not create a persistent Morph API key.” Used by the dashboard's same-origin BFF to call the Responses Proxy. ([Create Service Delegation Token](https://cloud.morph.so/docs/api-reference/create-service-delegation-token))

**Why the matrix misses it.** It is an internal auth primitive, not a user-facing key type. But it is a third answer to “scoped credentials” alongside org API keys and agent tokens, and it shows the dashboard is a BFF, not a direct API client. Mention only if the `keys-secrets` row is being expanded; otherwise skip.

### 7. Reverse SSH tunnel (`ssh -R`)

**What it is.** “Tunnel laptop `localhost:` to a MorphVM with `ssh -R`, then expose that VM port to get a public URL.” The page gives the exact command: `ssh -N -R 0.0.0.0:8000:127.0.0.1:8000 morphvm_XXXX@ssh.cloud.morph.so`, then `morphcloud instance expose-http morphvm_XXXX local-8000 8000 --auth-mode api_key`. ([Expose Localhost](https://cloud.morph.so/docs/documentation/instances/reverse-tunnel))

**Why the matrix misses it.** `reaching-it` covers inbound reach to the sandbox. Reverse SSH covers outbound-from-laptop-to-sandbox, i.e. exposing a local dev server through the sandbox's public URL. It is the mirror image and a common agent workflow (preview a local app). Add it as a “way to reach” example, not a new verdict.

### 8. Instant Devbox from a cached template

**What it is.** `POST /api/templates/{template_id}/instant-devbox` and `GET .../availability`; a template can be pre-cached, then a devbox is created “instantly” from it. The product calls environments “instantly cached and shareable with anyone on your team.” ([Devbox OpenAPI](https://cloud.morph.so/api/openapi.json), [Devboxes product page](https://cloud.morph.so/web/product/devboxes))

**Why the matrix misses it.** `fast-start` is about snapshot/boot latency (<250 ms claim); `snapshots-forks` is about state capture. Instant-devbox is a *template cache* — a third speed primitive. It sits between “cold boot” and “warm pool”, and the site's warm-pool row says no. The honest answer is still no warm pool, but the template cache is why “deployment in seconds” is plausible without one.

**What to do.** Mention in `fast-start` or `snapshots-forks` specifics; do not change `warm-pool` = no.

### 9. Instance metrics, promo codes, saved templates, notifications, uploads

Small API surface that no feature covers:

- `GET /api/instance/{instance_id}/metrics` — “Get a point-in-time CPU and memory usage report for an instance.” ([Get Instance Metrics](https://cloud.morph.so/docs/api-reference/get-instance-metrics-instance-instance-id-metrics-get))
- `POST /api/user/promo-code/redeem` — “Redeem a promo code. Applies to the active organization and is single-use.” ([Redeem Promo Code](https://cloud.morph.so/docs/api-reference/redeem-promo-code-user-promo-code-redeem-post))
- `/api/saved-templates` — saved template aliases, distinct from snapshots.
- `/api/notifications` — in-product notifications.
- `/api/uploads` — file upload sessions (the file-transfer page uses them).
- `/api/templates/{id}/events` — template build/refresh events.
- `tmux` pane snapshot — `GET /api/devboxes/{id}/tmux/panes/{pane_id}/snapshot`, plus paste; the `tmux` row covers sessions but not the pane-level API.

These are “specifics” for existing rows, not new verdicts. There is no metrics row, so `get-instance-metrics` is a gap rather than a change; promo codes belong in `billing-models`; saved templates in `snapshots-forks`; notifications in `support`; uploads in `file-api`.

### 10. Experimental Windows and macOS guests

**What it is.** “There is experimental support for **Windows, OSX (x86), and nested virtualization** as well.” The same page also says “soon with support for Windows and nested virtualization.” ([Devboxes product page](https://cloud.morph.so/web/product/devboxes))

**Why the matrix misses it.** `isolation` says “Full virtual machine … nested virtualisation and other guest operating systems are experimental.” That is accurate but vague. If Morph can boot a Windows or macOS x86 guest, it is a different kind of sandbox from a Linux-container-with-a-VM. No docs page shows the image name or the command, so keep it experimental; but the `isolation` row should name Windows/macOS and the contradiction.

### 11. Agent chat SSE endpoint (`/api/agent/chat`)

**What it is.** The Devbox OpenAPI has `POST /api/agent/chat` — “**SSE chat endpoint backed by OpenAI tool-calling.**” It is not in the docs index and not in the provider profile. It may be the backend for the devbox's built-in agent chat, or an internal endpoint. ([Devbox OpenAPI](https://cloud.morph.so/api/openapi.json))

**Why the matrix misses it.** `built-in-agents` currently describes Morph's agent as “a chat panel” (if at all). The endpoint suggests the panel is a real streaming tool-calling agent, not a prompt box. But without a docs page, do not upgrade the verdict; mark it “documented only in OpenAPI” and keep `built-in-agents` = partly.

### What is *not* a new product

- **MorphVM / Devbox** — same compute, two names. The site's glossary should keep saying so.
- **Volumes** — S3-compatible object storage; already covered as `volumes`.
- **Snapshots / branches / templates** — already covered; the new bits are sharing and instant-devbox, not a new primitive.
- **Remote desktop** — already covered by `desktop`.
- **Agent tokens** — already covered by `scoped-keys`.
- **Wake-on-HTTP/SSH** — already covered by `wake-on-request`.

The three genuine additions are **Actions**, **EFS** and **Responses Proxy**. The rest are API surface or distribution features that belong in existing rows' specifics.

---

---

## Integration notes for the parent

No repo data file was edited in this thread. These are the exact edits the parent should make when reconciling the fan-out.

### A. Verdict changes (must edit)

**Feature rows** — `site/src/data/features/*.json`, the object whose `provider` is `"morph"`:

| File | Old | New | Why |
|---|---|---|---|
| `reaching-it.json` | `partly` | **`yes`** | HTTP services are public by default with `auth_mode:none`, optional account-key `auth_mode:api_key`, real SSH, browser terminal and `ssh -L/-R`. Raw TCP is still unpublished, but that is not the feature's question. |
| `custom-domains.json` | `not-published` | **`no`** | Devboxes FAQ: “Custom domains aren’t supported yet.” |

All other 14 feature verdicts are unchanged. Update their `figure`, `scenario`, `note`, `source` only where the specifics below say so; do not churn unchanged rows.

For the two changed rows, the exact fields:

```json
// reaching-it.json — morph row
{
  "provider": "morph",
  "verdict": "yes",
  "figure": "Public by default; API-key option",
  "scenario": "An HTTP service is reachable on the public internet by default; auth_mode api_key puts the account's Morph API key in front, and SSH and a browser terminal are also available.",
  "note": "HTTP services default to auth_mode none (public) and can be set to auth_mode api_key. SSH is a real daemon, ssh -L and ssh -R work, and the devbox web UI has a browser terminal. Raw non-web TCP ports are not documented.",
  "source": {
    "url": "https://cloud.morph.so/docs/documentation/instances/http-services",
    "quote": "Morph Cloud allows you to expose HTTP services running within your instances to the public internet.",
    "confidence": "docs-confirmed"
  }
}
```

```json
// custom-domains.json — morph row
{
  "provider": "morph",
  "verdict": "no",
  "figure": "Morph hostname only",
  "scenario": "Apps are served over HTTPS on a Morph-generated hostname; a customer-owned domain cannot be attached yet.",
  "note": "The Devboxes FAQ says custom domains are not supported yet. A 2024 Infinibranch post promised deployment to custom DNSes, but no current page explains how; the current FAQ is the deciding statement.",
  "source": {
    "url": "https://cloud.morph.so/web/product/devboxes",
    "quote": "Custom domains aren’t supported yet.",
    "confidence": "docs-confirmed"
  }
}
```


**Capability rows** — `site/src/data/capabilities.json`, the `providers` entry with `"provider":"morph"` for each `id`:

| Capability id | Old | New | Short reason |
|---|---|---|---|
| `big-machines` | `partly` | **`yes`** | 16 vCPU / 32 GiB / 64 GiB example on the configurable-reboot page. |
| `fast-start` | `not-published` | **`yes`** | “<250 ms startup times” on the Infinibranch blog and developer page. |
| `volumes` | `partly` | **`yes`** | Morph EFS is a named FUSE filesystem, separate from Volumes S3. |
| `shared-volume` | `partly` | **`yes`** | The same EFS can be mounted from multiple hosts. |
| `mount-buckets` | `no` | **`partly`** | EFS mounts at `~/morph-efs/<name>`; an outside S3 bucket needs s3fs/rclone. |
| `big-disk` | `not-published` | **`partly`** | 1,048,576 MiB live-resize maximum, limited preview. |
| `public-url` | `not-published` | **`yes`** | HTTP services are public by default. |
| `private-url` | `not-published` | **`yes`** | `auth_mode="api_key"` on an HTTP service. |
| `web-terminal` | `not-published` | **`yes`** | “Browser terminal access and Morph-generated instance credentials are separate and unchanged.” |
| `custom-domain` | `not-published` | **`no`** | “Custom domains aren’t supported yet.” |
| `auto-https` | `not-published` | **`no`** | No automatic HTTPS for a user domain; only the provider hostname. |
| `roles` | `not-published` | **`yes`** | `org:admin` / `org:member`; “Update a member's role in an organization.” |
| `audit-log` | `not-published` | **`partly`** | Owner/admin SSH public-key metadata view; no account-action log. |
| `hidden-secrets` | `not-published` | **`partly`** | Responses Proxy injects model-provider keys; other keys are ordinary. |
| `ts-sdk` | `yes` | **`partly`** | npm `morphcloud` 0.0.20, 2025-10-06; Python 0.1.116, 2026-10-20. |

That is **15 capability changes**: 3 `partly`→`yes`, 5 `not-published`→`yes`, 3 `not-published`→`partly`, 2 `not-published`→`no`, 1 `no`→`partly`, 1 `yes`→`partly`. All other 63 capability rows keep their verdict; update specifics only if the row's evidence is now stale.

### B. Provider profile — `site/src/data/providers/morph.json`

- `checkedOn`: `2026-10-28` → **`2026-11-12`**.
- `isolation`: keep “full VM”; change the tail to name the contradiction: “Windows, macOS (x86) and nested virtualisation are labelled experimental on one part of the product page and ‘soon’ on another; no docs page gives an image name or limitation.”
- `sizes`: add the only concrete large shape, “16 vCPU / 32 GiB / 64 GiB is documented on the configurable-reboot example”, and the 1 TiB live-resize ceiling. Keep “no GPU, region or full catalogue”.
- `billing.planFee`: “Developer $0, Team $40 and Scale $250 a month, including **0** on the pricing table, **1,000** and **7,500** MCUs. The Plans doc says Developer includes **300** MCUs free.”
- `billing.minimum`: add the Devboxes FAQ as a third free-tier statement: “The pricing page shows 0 MCUs, the Plans doc 300 MCUs, and the Devboxes FAQ says 0 MCUs and purchase credits before creating a devbox; the signup page says 300 compute hours a month.”
- `billing.meter`: add “EFS is billed per GiB-month and Actions runners per MCU-hour, outside the devbox meter.”
- `company.facts`:
  - Funding: replace the Tracxn “has not raised any funding yet” quote (page now 500) with RL List “Total raised unknown / Last round unknown”; keep Grokipedia’s $5.75M Khosla-led seed as the other side.
  - Headcount: “1–10 estimated” (RL List, updated 2026-10-05), not “~9–11”.
  - Status: 100% over 90 days, no incidents Sep–Nov 2026 (still true).
  - SOC 2: quote both the portal badge and the AutoInfra report; keep the entity caveat.
  - Add “No DPA, privacy policy, subprocessor page or deletion deadline on cloud.morph.so”; the terms mention “available third-party security attestations” on request.
- `fits.badly`: replace the Volumes-only sentence with “An attached block volume with a normal Linux disk: Volumes is S3-compatible object storage behind a gateway, and EFS is a FUSE filesystem; neither is a block device.”
- `usability.docs`: “Documentation covers devboxes, instances, snapshots, volumes, EFS, Actions and Responses Proxy. Status page at status.cloud.morph.so; EFS and Responses Proxy docs currently 404 but the products are live.”
- `usability.tripsUp`: add “Custom domains are not supported” and “EFS and Responses Proxy docs 404 even though the products run”; keep the free-credit and stop-deletes lines.
- `caveats`:
  - Free credit: add the Devboxes FAQ quote and the Plans 300 quote.
  - Volumes: change to “Volumes is S3 object storage; EFS is a shared FUSE filesystem; neither is a block device.”
  - Add “EFS docs 404” (open).
  - Add “Responses Proxy docs 404” (open).
  - Add “Actions is a separate CI product” (open).
  - Keep the snapshot-billing, region/GPU and no-SOC2 caveats.
- `strengths`: add “Real SSH, a browser terminal and public/private HTTP services”, “EFS shared filesystem and S3 Volumes”, “GitHub Actions runners on the same MCU pool”, “Snapshot sharing across orgs”.
- `sources`: add Devboxes FAQ, EFS archive, Actions docs, Responses Proxy archive, status page, docs FAQ, Plans doc. Keep the existing five.
- `oneLiner` / `whatItIs` / `whoFor`: no change needed; optionally mention Actions and EFS in `whatItIs`.

### C. Pricing card — `site/src/data/pricing/morph.json`

- `checkedOn`: `2026-10-29` → **`2026-11-12`**.
- `notes`: add the Devboxes FAQ to the free-tier contradiction; add “EFS is $0.12/$0.15/$0.18 per GiB-month and Actions runners are 3/5/10 MCU/hour; neither is in this card.”
- `summary`: unchanged (“the largest of vCPU, RAM ÷ 4 and disk ÷ 16, at $0.05 each”).
- `mcu`, `disk`, `between`, `egress`, `plans`: **no numeric change**.
- Consider `disk.stopped` note: “per GB-hour; the engine treats GiB as GB, ~7.4% understatement” — optional, but it documents the unit issue.

### D. Rate research — `research/rates/morph.json`

- `checkedOn`: → **`2026-11-12`**.
- `plans[].includedUsage`: update Developer to “Pricing page 0 MCUs; Plans doc 300 MCUs free; Devboxes FAQ 0 MCUs and purchase credits first; signup 300 compute hours/month.”
- `plans[].limits`: **leave the 64/256/1,024 vCPU, 256/1,024/4,096 GB, 1,024/4,096/16,384 GB figures** but add a note that the table is headed “MorphVM” and it is not stated whether these are per-VM or account-wide; the 1 TiB per-disk ceiling is the only per-disk number.
- `compute.increment`: unchanged (per-second).
- `compute.floor`: unchanged.
- `perResourceRates`: unchanged.
- Add `efs` and `actions` blocks **only if the schema allows unknown keys**; otherwise put them in `notes`. Do not jam them into `disk`/`mcu`.
- `freeTier`: if present, keep “partly” and add the Devboxes FAQ.
- `docs` / `deploy` URLs: no change.
- `diffs`: add a dated line: “2026-11-12: no rate change; EFS/Actions are separate products; TS SDK stale; free-tier four-way conflict.”

### E. Research notes — `research/morph.md`

Add a **dated** “2026-11-12 recheck” section at the top or before “Research process and limitations”:

- No MCU rate change; $0.05, 1/4/16 bundle, 5 TB snapshot, $40/$250 plans stand.
- Free-tier contradiction is now four pages, not three; quote the Devboxes FAQ.
- EFS is live (product page, CLI, resize page) but `/docs/efs/*` 404; archived July 2026 pages describe it; $0.12/$0.15/$0.18 GiB-month and 5/25/100 filesystems.
- Actions is live; 3/5/10 MCU/hr; 30–45% vs 30–40% claim.
- Responses Proxy is live (`/healthz` 200) but `/docs/responses-proxy` 404; OpenAI Responses + Anthropic Messages gateway; `rprx-` keys; provider credential injection.
- Snapshot tokens, cross-org copy, managed SSH keys, access bundles, service delegation, reverse SSH, instant-devbox, metrics, promo codes.
- TypeScript SDK 0.0.20 (2025-10-06) vs Python 0.1.116 (2026-10-20).
- Windows/macOS experimental vs “soon”.
- SOC 2 portal: badge says Morph, report says AutoInfra, links morphllm.com.
- Funding/headcount: Grokipedia vs RL List; Tracxn 500.
- Fix the C arithmetic in §11: 640 paused hours, not 630; total still $9.15 at 2 dp.
- Fix the B note if it is in the provider profile, not research: CPU, not disk, sets 4 MCU/h.

Do not rewrite old sections' verdicts wholesale; add a dated section and change only the numbers/quotes that are now wrong. The skill's rule is that research notes are historical and the data files are the source of truth.

### F. Docs index — `site/src/data/docs.json`

Add under `"morph"`:

```json
"custom-domains": {
  "title": "Devboxes FAQ — custom domains",
  "url": "https://cloud.morph.so/web/product/devboxes"
},
"built-in-agents": {
  "title": "Devboxes — development",
  "url": "https://cloud.morph.so/docs/devboxes/development"
}
```

Optionally update `"storage"` to the EFS archive (but the current Volumes page is live and canonical for Volumes; keep it, and let the provider caveat carry EFS). Optionally add `"outbound-network"` only if a docs page exists — the FAQ answer is not a docs page, so leave it out unless the parent wants the FAQ URL.

### G. Changes feed — `site/src/data/changes.json`

Add one entry, newest first, with `date: "2026-11-12"`, `provider: "morph"`, a title such as “Morph recheck: EFS, Actions and a model gateway; no rate change”, and `sources` for the pricing page, Devboxes FAQ, EFS archive, Actions docs, Responses Proxy archive, status page. Keep it factual: no “launch” date (the changelog has none), say “documented now” not “launched”. Mention the four-page free-tier conflict and the 15 capability changes. Do not add one entry per capability.

### H. Price baseline — `site/scripts/price-baseline.json`

No Morph change. The MCU rate, plan fees and volume rate are identical. `check-rates` produced no Morph `CHANGED`/`NEW`/`BLOCKED` line. If the parent adds EFS/Actions as separate rows, add them with their original units and a `not-modeled` note; do not fold them into the MCU baseline.

### I. Cost tests — `site/src/lib/cost.test.ts`

No new test is required for the rate change (there is none). If the parent edits the C line from 630 to 640, the existing total test still passes ($9.15 at 2 dp). A regression test for the 640-hour split would be reasonable but is not necessary; the engine's `hoursOf()` already uses 730 − 90. Do **not** add EFS/Actions to the engine in this integration; they are separate products and would need a `RateCard` change.

### J. Use cases — `site/src/data/usecases.json`

- `coding-agent` (index 2), Morph route: “An official example installs Claude Code in a Devbox with one-click VS Code or Cursor access and SSH; nothing on teams or per-developer logins.” → “An official example installs Claude Code in a Devbox with one-click VS Code or Cursor access and SSH. Orgs and admin/member roles exist, but there is no SSO or per-developer isolation.”
- `claude-code-team` (index 7), Morph route: “An official example installs Claude Code in a Devbox with Anthropic's installer. Nothing on teams or logins.” → “An official example installs Claude Code in a Devbox with Anthropic's installer. Orgs, admin/member roles and SSH-key audit exist; no SSO or per-developer isolation.”
- No tier changes: Morph stays `manual` for Hermes/OpenClaw/n8n/Discord/MCP, `guide` for coding-agent/code-interpreter/browser-agent/Claude Code. The new products do not add a guided route for those use cases.
- If the parent wants an Actions use case, it would be a new route, not a tier change; the 10 use cases are fixed in this recheck.

### K. Situations — `site/src/data/situations.json`

`build-and-test`, Morph `watch`:

> “Stop deletes the instance; volumes are S3-compatible object storage, not an attached disk.”

→

> “Stop deletes the instance; Volumes is S3-compatible object storage and EFS is a shared FUSE filesystem, not an attached block disk. EFS docs currently 404, so treat it as preview.”

No other situation pick changes. Do not add a “CI runner” situation; the 16 features and 10 use cases are the site's axes, and Actions is a product note, not a new axis.

### L. Side-by-side — `site/src/pages/compare/side-by-side.astro`

`morph: "Full VM"` is still correct. The manual `kinds` map and static counts do not change (no provider added/removed). If the parent adds Actions/EFS to the comparison table, that is a new column/row decision, not a Morph fix.

### M. Counts and dates

- Providers: **16** (unchanged; no new provider).
- Features: **16** (unchanged; do not add an Actions/EFS feature in this integration).
- Capabilities: **78** (unchanged; no new capability IDs).
- Provider rows: **1,248** (unchanged; 16 × 78).
- Use cases: **10** (unchanged).
- `providers/morph.json.checkedOn`: **2026-11-12**.
- `pricing/morph.json.checkedOn`: **2026-11-12**.
- `research/rates/morph.json.checkedOn`: **2026-11-12**.
- `capabilities.json.checkedOn`: **leave as is** (dataset-wide date; one provider recheck does not advance it).
- `usecases.json.checkedOn`: **leave as is**.
- `changes.json`: one entry dated **2026-11-12**.

### N. Contradiction discipline

When the parent edits, keep both sides of each contradiction in the evidence:

- Free tier: quote pricing (0), Plans (300), signup/FAQ (300 h/month), Devboxes FAQ (0 + purchase). Do not “resolve” it by picking one.
- Custom domains: quote the FAQ (no) and the 2024 blog (custom DNSes) if the history matters; the verdict is no.
- Windows/nested: quote “experimental” and “soon”.
- SOC 2: quote the badge and the AutoInfra report; do not say “SOC 2 certified” or “no SOC 2” without the entity caveat.
- EFS/Responses Proxy: quote the live product and the 404 docs; say “live, docs currently 404; archived July 2026”.
- MCU “+” vs max: explain the bundle, keep the max formula.
- Plan ceilings: say “per-VM or account-wide, not stated”; do not turn 1,024 vCPU into a per-VM maximum.
- Actions discount: 30–45% vs 30–40%; quote the page you use.
- TS SDK: 0.0.20 vs 0.1.116; call it stale, not absent.

---

## Verification and limitations

### What was actually run

| Check | Command / method | Result |
|---|---|---|
| Feature count | `grep -c '^### '` + manual section count | **16/16** feature sections; each has current verdict, specifics, URL, quote, changed status |
| Capability count | `python3 check_quotes.py` | `ROWS 78 MISSING MAP 0 QUOTE FAILS 0` |
| Morph rows in feature data | Python over `site/src/data/features/*.json` | **16** rows (one per feature) |
| Capability dataset size | `site/src/data/capabilities.json` | **78** capabilities |
| Price movement | `cd site && npm run check-rates` | No `morph` `CHANGED`/`NEW`/`BLOCKED` line; checker exit 0 |
| Pricing freshness | Context `web_scrape` with `maxAgeMs: 0` | Cache miss, age 0; fresh HTML/Markdown |
| Pricing hydration | `agent-browser` opened `https://cloud.morph.so/web/subscribe`, waited for network idle | Hydrated table and CTAs visible; screenshot captured |
| Devboxes FAQ | `agent-browser` opened all 7 accordions | Answers visible; `devboxes-faq.txt` saved |
| Full docs corpus | `curl https://cloud.morph.so/docs/llms-full.txt` | **725,002 bytes**, **124** doc pages; saved as `morph-llms-full.txt` |
| Sitemap | `curl https://cloud.morph.so/docs/sitemap.xml` | Saved; used to find EFS/Actions/Responses Proxy URLs |
| Devbox API | `curl https://cloud.morph.so/api/openapi.json` | Saved as `devbox-openapi.json`; `/api/agent/chat`, metrics, templates, SSH keys, orgs, snapshots |
| Responses Proxy API | `curl https://agent-responses-proxy.svc.cloud.morph.so/openapi.json` | Saved; ~60 paths; live `/healthz` `{"status":"ok"}` |
| SDK versions | `curl https://pypi.org/pypi/morphcloud/json`, `https://registry.npmjs.org/morphcloud` | PyPI **0.1.116** (2026-10-20); npm **0.0.20** (2025-10-06) |
| Status page | `curl https://status.cloud.morph.so/` + browser | “All services are online”, 100% over 90 days |
| Terms | `curl https://cloud.morph.so/web/legal/terms-of-service` | Last revised **2025-10-23**; saved |
| Trust portal | `curl https://trust.delve.co/morph` | “SOC 2 Type II Compliant”; AutoInfra report; morphllm.com links |
| EFS docs | `curl` live URLs + Wayback | Live `/docs/efs/*` **404**; July 2026 archive complete |

### Tools that succeeded

- **Context MCP** — `web_scrape` (fresh `maxAgeMs: 0`) for the pricing page, Devboxes product/FAQ, Plans, Signup, Docs FAQ, status page, terms, trust portal, blog, EFS/Actions/Responses Proxy pages; `web_map` for the docs tree. This was the primary research tool.
- **TinyFish MCP** — `search` for discovery (Morph EFS, Actions, Responses Proxy, funding, SOC 2, status page). It found the archived EFS/Responses Proxy URLs and the Grokipedia/RL List/Tracxn pages.
- **curl** — provider Markdown (`llms.txt`, `llms-full.txt`), sitemap, raw HTML, OpenAPI specs, PyPI/npm JSON, Wayback snapshots, `status.cloud.morph.so`, `trust.delve.co`. This was the primary *verbatim* tool because it preserves exact text.
- **agent-browser** — hydrated pricing page, opened all 7 Devboxes FAQ accordions, read the status page and the trust portal. This was the primary *rendered* tool; it confirmed the FAQ answers that the SSR HTML omits.
- **Python 3** — quote normalization/checking, JSON parsing, page counting, arithmetic cross-checks.

### Tools that were not needed / did not succeed

- **Amp native `web_search` / `read_web_page`** — not used; Context and curl covered every URL.
- **Parallel, Exa, Tavily, Firecrawl** — not used. Context `web_scrape` + TinyFish `search` + curl were sufficient; no fallback was needed.
- **Other Composio connectors** — not used; Context and TinyFish were the only Composio routes needed.
- **Tracxn** — page returns **500** behind the login wall; the old “has not raised any funding yet” quote is no longer verifiable. Reported as a limitation, not a fact.
- **Delve portal** — loads, but its report is for AutoInfra, Inc.; no Morph Labs report. Reported as an entity mismatch.
- **Morph changelog** — only a 2024-11-19 “Initial beta release” entry and an “Unreleased candidate” entry; no dated entries for EFS/Actions/Responses Proxy. **No launch dates were inferred.**

### What was not verified

- **No account, no credentials, no billable resources.** Everything is desk research. Dashboard-only claims — the browser terminal UI, the EFS TUI/dashboard, org invites, card requirement, promo-code redemption, the Actions GitHub App install flow, the Responses console — are documented but not exercised. Where a page says “dashboard”, the report says so; it does not say “tested”.
- **No measured performance.** “<250 ms startup”, “deployment in seconds”, “instant devbox” and “30–45% cheaper” are first-party claims, not measurements. The report labels them.
- **No raw TCP test.** The `raw-tcp` row remains `not-published` because no page states that arbitrary TCP ports are exposed; only HTTP services are documented. SSH is TCP/22 and works, but that is a protocol-specific exception, not a general raw-TCP service.
- **No custom-domain test.** The FAQ is an explicit negative; the 2024 blog is an old positive. The verdict follows the FAQ.
- **No SOC 2 report access.** The Delve portal shows a badge and a report title; the report itself may be gated. The entity mismatch is visible without the PDF. If the parent wants a stronger claim, request the report and check the auditor/entity.
- **No DPA review.** No DPA page was found; the terms' security section is not a DPA. Absence is reported as “not published”, not “not offered”.
- **No EFS mount.** The EFS docs are 404 live; the archived pages and the live CLI reference are the evidence. The archive is dated **2026-07-18**; the product may have changed since. The live resize page still references EFS, which is why the verdict is not “discontinued”.
- **No Responses Proxy request.** The live `/healthz` and `/openapi.json` are evidence the service runs; no model call was made (would need a key/credit). The archived July 2026 getting-started page is the behavioural evidence.
- **No GitHub Actions run.** The Actions docs and pricing are live; no repo was connected. Runner shapes and MCU rates are first-party; the 30–45% claim is not independently measured.
- **No TypeScript SDK install.** npm metadata (0.0.20, 2025-10-06) is the evidence; the package was not imported. The “stale” verdict is a release-date comparison, not a compatibility test.
- **No region/GPU test.** No region list or GPU page was found; `choose-region`/`eu-region`/`gpu` stay `not-published`. The pricing table's “MorphVM” block is not a region list.
- **No benchmark reproduction.** The site's A/B/C totals are arithmetic, not invoices; taxes, egress, retained snapshots, volumes and EFS are excluded. The report lists input changes, not new totals.

### Confidence and freshness

- **High** for the 15 capability changes and the two feature changes: each has a live first-party URL and a verbatim quote, and the quote checker passes 78/78.
- **Medium** for EFS and Responses Proxy *product* claims: the docs are 404; the archive is July 2026; the live product pages/health endpoints corroborate existence, not every detail.
- **Medium** for the free-tier contradiction: four first-party pages, no resolution, and the pricing page is a hydrated SPA whose SSR copy differs.
- **Low** for company funding/headcount: third-party sources conflict, Tracxn is 500, and Morph does not publish a funding page.
- **Point-in-time**: status page, pricing page and docs were read on **2026-11-12** (Asia/Calcutta). A later change will not be reflected.

### Delivery state

- Work product: `.amp/in/scratchpad/morph-recheck.md` (this file), plus `morph_features.py`, `morph_caps.py`, `check_quotes.py`, `pages/`, `efs-archive/`, `rproxy.txt`, `morph-llms-full.txt`, `devbox-openapi.json`, `responses-proxy-openapi.json`.
- **No repo data file was edited.**
- **No commit, push, PR or deployment.**
- **No subagent or new thread.**
- The parent thread `T-01a1cef3-a324-777e-b91c-ac13deb55735` receives a short summary via `send_thread_message`.
- The site's `checkedOn` dates remain `2026-10-28`/`2026-10-29` until the parent integrates; this report is the proposed update.
