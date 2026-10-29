# Capability index — running a company: method, contradictions, open questions

Checked 2026-10-29 against each provider's live documentation, pricing page, terms or trust page.
Output: `capabilities-4-running-company.json` — 26 capabilities × 16 providers = 416 rows.

## Method

- Started from `research/<id>.md`, `site/src/data/providers/<id>.json`, the three feature files and
  `research/rates/*.json` (checked 2026-10-29), then re-read the live page behind every verdict.
- 260+ pages were fetched and kept locally; every quote in the JSON was machine-checked as a
  normalised substring of the page at the cited URL (416 rows, 0 misses). Normalisation collapses
  whitespace and drops Markdown emphasis, backticks and heading marks; nothing else is altered.
- Composio's Firecrawl (`FIRECRAWL_SCRAPE`) rendered `instabox.sh/pricing`, whose HTML is a
  JavaScript shell. The full response is stored by Composio as a remote file, so the rendered page
  was re-read in the orb's browser (`agent-browser read`) and cached locally for quote checking.
  `agent-browser` was also used for `trust.daytona.io` (403 to curl) and the Lizard and Tensorlake
  status pages.
- `no` rows are either a sentence saying the feature is absent, or the page where it would be
  documented, marked `inferred`. Where the docs are simply silent, the row is `not-published`
  rather than `no`.

## What changed since 2026-10-28

| Provider | Change | Effect here |
|---|---|---|
| Daytona | `trust.daytona.io` now reports a **SOC 2 Type II report issued 28 July 2026**, covering 16 Dec 2025 – 15 Mar 2026 with an unqualified opinion. The earlier research recorded only a management bridge letter. | `soc2` moved from `partly` to `yes`. |
| Daytona | The public `daytonaio/daytona` repo is now archived (3 Oct 2026) and read-only. | `open-source` stays `no`, with a firmer quote. |
| Blaxel | Agent Runtime is still labelled **Soon** in the site navigation. | `prompt-api` stays `no`. |
| InstaBox | Pricing and terms are JavaScript-only. The agent-readable fallback (`llms.txt`) omits plan features; the rendered page confirms Enterprise carries 99.9% SLA, SSO/SAML + SCIM, audit logs, HIPAA BAA and BYOC. | Used the rendered page for `sso`, `sla`, `audit-log`, `spend-cap`. |
| Tensorlake | New provider, researched from `docs.tensorlake.ai` (llms.txt, sandbox docs, pricing, security, SSO, access control) and the main site's pricing and DPA. | 26 new rows. |
| Lizard | The status page is client-rendered; its HTML contains no uptime figure. | `status-page` is `yes` on the page's existence, not on a number. |

## Contradictions between pages

1. **Tensorlake, roles.** The pricing page lists "SSO / SAML · RBAC · DPA" only under Enterprise,
   while `platform/access-control.md` describes organisation and project roles with no plan gate.
   The row says `yes` for roles and `partly` for SSO, and this note records the conflict.
2. **Tensorlake, SSO.** The docs say "SSO access must be enabled for your organization" and the
   pricing page puts it on Enterprise. Both point to a gated feature; the row is `partly`.
3. **Daytona, audit logs.** Pricing lists "SSO, audit logs" under Enterprise; the audit-log page
   gates them by permission instead, and export is "coming soon". The row is `partly` on the export
   gap, not on the plan.
4. **Blaxel, idle timing.** Pricing says sandboxes scale to zero after about 5 seconds; the sandbox
   docs say 15 minutes of idle WebSocket/TCP. Not one of these capabilities, but it changes what
   "standby" costs.
5. **boxd, machine cap.** The resources page says 50 machines per org; the pricing page says 100.
6. **Agent 37, dashboard creation.** The only sentence saying instances can be created from the
   dashboard is in the **Terms**, not the docs or quickstart.
7. **Cloudflare, spend.** Budget alerts are described as "informational only" and are the only
   spend control on the account; there is no cap anywhere.
8. **Modal, SSO.** Pricing says "Okta SSO", not generic SAML or OIDC, so the row is scoped to that
   wording.

## Verdicts I was unsure about, and how I resolved them

- **`dashboard-create` = no for boat, boxd, e2b, sandboxer and tensorlake.** Each quickstart starts
  with a CLI or SDK call, and the docs never show a create button, but a console button could exist
  undocumented. These are `inferred`, not `docs-confirmed`.
- **`browser` = not-published for Daytona.** Computer Use gives a desktop, but no page names a
  browser inside it.
- **`status-page` = yes for Lizard.** The page exists but is JavaScript-only, so no figure could be
  quoted.
- **`python-sdk` = partly for InstaBox.** One sentence mentions "the Python SDK's
  `persistent_disk_gib`"; there is no page, package name or install command.
- **`python-sdk` = no for Sprites.** Only `@fly/sprites` (JavaScript) is shown; a Python client may
  exist unpublished.
- **`mcp-server` = no for Cloudflare.** "Code Mode MCP Server" is a separate Cloudflare GitHub
  project, not a server that starts sandboxes.
- **`mcp-server` = partly for E2B.** The gateway runs third-party tools inside a sandbox; no E2B
  server creates sandboxes.
- **`roles` = partly for Sandboxer.** Owner and member are the only roles the docs name; a read-only
  role may exist without being documented.
- **`open-source` mixes licensing with self-hosting.** The capability as defined is "open-source
  **or self-hostable", so a row can be satisfied by self-hosting alone. The rule used here is:
  `yes` when the vendor documents running the sandbox stack on your own servers, `partly` when only
  client or SDK code is open, or self-hosting is partial or gated, and `no` when neither is offered.
  Rows that are `yes` or `partly` say in the note which half they meet. No row claims a licence the
  vendor does not publish.
- **`open-source` = yes for Boxd.** Not because it is open source — it publishes no licence or
  repository — but because it documents self-hosting in three FAQ answers and on its pricing page:
  one binary, all roles, on your own KVM hosts, under an annual licence.
- **`open-source` = yes for E2B.** Its BYOC product is explicitly "a managed deployment in your
  account rather than self-hosting", but the docs also point to **E2B Embed**, the open-source
  runtime packaged for a single machine. That is genuine self-hosting, with the scale-out path
  remaining managed.
- **`open-source` = partly for Daytona and Tensorlake.** Both run sandbox compute in your own cloud
  but keep the control plane, and both need the arrangement enabled on an Enterprise plan. Daytona's
  public repository is also archived.
- **`open-source` = no for Agent 37, Blaxel, Boat, InstaBox, Lizard, Modal, Morph, Runtime,
  Sandboxer, Sprites and Vercel.** These are `inferred` from hosted-only docs; none publishes a
  self-host path. Modal's open-source client libraries do not make the sandbox software runnable.

## Concentration of `not-published`

39 of 416 rows are `not-published`: usage alerts (10), SSO (6), audit logs (6), spend caps (4) and
DPA (4) account for most of them.
Those are the areas where providers publish least: several billing pages describe meters without
describing notifications, and several trust pages list certifications without a customer-facing log.
