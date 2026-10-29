# Capability index — access group: verification notes

Checked 2026-10-29. 15 capabilities × 16 providers = 240 rows.

## How this was checked

- Started from `research/*.md`, `site/src/data/providers/*.json` and the provider rows in
  `site/src/data/features/{reaching-it,custom-domains,outbound-network,keys-secrets}.json`
  (checked 2026-10-28), then re-read each provider's live docs and pricing page today.
- Every one of the 240 quotes was machine-compared against the text of the page fetched today
  (Firecrawl, Parallel extraction, or the page's own markdown endpoint). Zero mismatches remain.
- Tensorlake is new to the repo: its 15 rows come from `docs.tensorlake.ai` — networking, local
  tunnels, SSH and PTY sessions, billing, authentication, environment variables and process logs.

## Changed since 2026-10-28 — the site data is now stale here

1. **InstaBox private ports.** `docs/ports` now documents `--private`, a `?_token=` link, token
   rotation and a 401 for everyone else. The reaching-it row still says "No auth; URL is secret".
2. **InstaBox raw TCP.** `instabox port publish --tcp` exists: "In preview (admins only) until the
   server opens it to everyone; then paid plans only, up to 5 per workspace." The site says there
   is no raw TCP inbound.
3. **InstaBox egress.** Plans now include a monthly allowance — 100 GiB on Free, 1 TiB Pro, 5 TiB
   Builder, 50 TiB Team — then $0.02/GiB. The site row says metered with no allowance.
4. **Cloudflare Containers egress.** The pricing page now lists 1 TB/month included per region, then
   $0.025/GB in North America and Europe. The site row lists the rate without the allowance.
5. **Vercel Sandbox browser terminal.** The dashboard's Connect tab runs commands in the browser
   (changelog, 2026-07-23). The site says no browser terminal is published.
6. **Agent 37 custom domains.** Paid workspaces only, requiring $100 of total top-ups, maximum 10
   domains. The site row says yes without the gate.
7. **Sandboxer browser terminal.** Documented on the SSH page: "The dashboard's Terminal tab opens a
   full PTY in your browser over the same exec WebSocket the CLI uses."
8. **Lizard SSH.** `lizard ssh` into services is now turned off (HTTP 403); `lizard sandbox ssh`
   still works. The site says Lizard has no SSH at all; the accurate verdict is partly.
9. **Sprites URL auth.** A Sprite URL can be switched to public with `sprite config update
   --url-auth public`. The site only describes the org-private default.
10. **Blaxel.** Dedicated egress gateways are documented but in private preview; custom domains come
    with a managed certificate; internet egress is listed as "Included".

## Contradictions between pages

- **Cloudflare.** The sandbox security page says a container starts with `enableInternet: false`;
  the Containers "outbound traffic" page says "By default, a Container will allow internet access".
  I used the sandbox default (off) for `no-internet` and the Containers page for the allowlist.
- **InstaBox.** The ports page says a visit wakes an idle-paused machine; the OpenAPI says preview
  links remain offline until resumed.
- **Sprites.** `fly.io/pricing` says "No plans and no tiers"; the Sprites FAQ describes plans with
  CPU, RAM and storage allowances. Neither says egress is metered.
- **Agent 37.** The domains page sets a $100 top-up threshold; the pricing page does not mention
  domains at all.
- **Vercel.** The pricing table lists 20 GB/month of included sandbox transfer; the Secure Compute
  page says traffic leaving the private network is billed separately as Private Data Transfer.
- **Modal.** Custom domains are Team and Enterprise only, but no price for either plan is published.

## Verdicts I am not fully sure of

- **Tensorlake `secrets-store` and `hidden-secrets` = no.** Inferred from the sandbox docs, which
  only describe per-command and per-session environment variables. Its "Secrets" page covers
  Applications (functions), a different product. Worth asking Tensorlake whether sandbox secrets
  exist.
- **Blaxel `ssh` = no.** No SSH server or SSH address appears in its docs; `bl connect sandbox` is
  the provider's own terminal. Inferred from absence.
- **Boxd `private-url` = no.** No token or login option is documented for the machine address; the
  only gate is bot protection on wake.
- **Agent 37 `tunnel` = yes.** Inferred: standard `ssh` over the documented ProxyCommand supports
  `-L`, but the docs never show a port forward.
- **Morph `tunnel` = yes.** Inferred from its documented SSH.
- **Runtime `ssh` = partly.** The docs say SSH and port forwarding run "through Runtime's API ...
  over one WebSocket per connection"; not confirmed that a plain `ssh` client works.
- **InstaBox `static-ip` = not-published.** A third-party review says all machines share one NAT
  address, but InstaBox publishes nothing about outbound addresses, so the row cannot claim a no.
- **E2B `egress-included` = not-published.** The billing page has no egress line at all; it may
  simply be free.
- **Modal `web-terminal` = not-published.** No browser terminal in the docs; the dashboard may have
  one that is undocumented.
- **Lizard `public-url` = no.** The access token is mandatory on every preview URL.
- **Cloudflare `auto-https` = yes.** Inferred from Cloudflare holding the certificate for the zone,
  not from a sandbox-specific page.

## Scope notes

- Counts across the 240 rows: 118 yes, 44 partly, 25 no, 53 not-published.
- `not-published` means nothing on the provider's site answers the question. It is not a "no".
- Suggested additions in the file: private network between machines, desktop in the browser,
  graphics card, event notifications, agent tool connection (MCP).
