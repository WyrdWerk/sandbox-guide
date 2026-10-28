# Blaxel: sandbox research

Research date: 2026-10-28. Desk research only; no account was created and no service was run. Tags describe the source of each substantive claim, not independent testing. URLs and quoted evidence accompany sourced claims. `not-published` means not found in the sources consulted, not proof of absence. GB below follows the provider's labels; do not assume its GB-to-GiB conversion without checking.

## Summary

- **docs-confirmed** — Baseten announced the acquisition on September 10, 2026: “Baseten has acquired Blaxel.” [Baseten](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **docs-confirmed** — The announcement says “Blaxel is continuing” and “The product doesn't change, and features will keep shipping.” [Baseten](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **inferred** — Blaxel remains a distinct branded offering with a Baseten-linked login path, not simply a discontinued product; this does not establish a permanent standalone guarantee. Evidence: the announcement, [current pricing](https://blaxel.ai/pricing), and [managed-workspace documentation](https://docs.blaxel.ai/Security/Baseten-managed-workspaces.md).
- **docs-confirmed** — Standby preserves running state and files but not external connections; storage remains billable. “The snapshot preserves process and filesystem state, but not external network connections” and “you are charged for the storage of the snapshot and/or the volumes.” [Sandbox overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **pricing-page** — Active sandbox compute is metered by allocated memory: “$0.0000115 / GB RAM · second”. [Pricing](https://blaxel.ai/pricing).
- **inferred** — The Battleships RAM-only description is correct for active *compute*, but incomplete as a description of the entire bill because snapshots and volumes are separately billed. Evidence: [pricing](https://blaxel.ai/pricing) and [Battleships](https://battleships.dev/data/providers/blaxel.md).

## 1. Product, audience and ownership

- **docs-confirmed** — Designed for agent workloads: “Sandboxes are instant-launching virtual machines serving as **sandboxed compute runtimes for agents**.” [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — The product family includes “cloud sandboxes, AI agent hosting, MCP servers, batch jobs, and model gateway”. [Documentation index](https://docs.blaxel.ai/llms.txt).
- **docs-confirmed** — Baseten's September 10, 2026 announcement states “Baseten has acquired Blaxel.” Its customer statement says “Blaxel is continuing. The team you've been reaching out to for support will continue to assist you just the same as always. The product doesn't change, and features will keep shipping.” It also says “Over time, Baseten will add new products based on Blaxel's primitives, starting with Sandboxes.” [Announcement](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **third-party** — Financial terms were not disclosed: “The announcement did not disclose financial terms.” [The Next Web, September 10, 2026](https://thenextweb.com/news/baseten-acquires-blaxel-ai-agent-sandboxes).
- **docs-confirmed** — Integration is already documented: “Signing in with Baseten connects you to the Blaxel workspace for your Baseten organization.” [Managed workspaces](https://docs.blaxel.ai/Security/Baseten-managed-workspaces.md).
- **docs-confirmed** — The current terms landing page states “Last updated December 10, 2025” and links the terms PDF; its footer says “© 2026 Blaxel, Inc. All rights reserved.” [Terms](https://blaxel.ai/terms).
- **inferred** — The terms page's stated update predates the acquisition. The currently linked PDF still names Blaxel, Inc.; it does not prove the current corporate structure or supersede customer-specific agreements. The current docs and pricing retain Blaxel branding, and the Baseten login is a documented integration; a before/after pricing comparison and change date were not established. Evidence: [terms](https://blaxel.ai/terms), [terms PDF](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf), [pricing](https://blaxel.ai/pricing), and [managed workspaces](https://docs.blaxel.ai/Security/Baseten-managed-workspaces.md). See section 17.
- **not-published** — No discontinuation announcement, legal entity transfer details, deal consideration, or post-acquisition universal migration deadline was verified. Absence of an announcement is not a promise of permanence. The Business Wire release was inaccessible to the research fetcher; the Baseten announcement was directly verified instead.

## 2. Isolation and permissions

- **docs-confirmed** — “the microVM boundary remains the isolation guarantee between your sandbox and everything else.” [Non-root workloads](https://docs.blaxel.ai/Sandboxes/Non-root-user.md).
- **docs-confirmed** — “By default, everything inside a sandbox runs as `root`.” An unprivileged user can be configured. [Non-root workloads](https://docs.blaxel.ai/Sandboxes/Non-root-user.md).
- **docs-confirmed** — “By default, sandboxes run on a minimal kernel without iptables support.” Iptables is enabled at creation; Carbon's optional Android kernel can enable extensions. “Without `kernelExtensions`, the sandbox's kernel refuses module loading and kernel tracing to every process, including root”. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **third-party** — Battleships records Docker inside as available and systemd as unavailable: “Docker inside” and “systemd” appear respectively in its Yes and No lists. [Battleships](https://battleships.dev/data/providers/blaxel.md).
- **not-published** — This research did not independently verify the precise Docker-in-Docker and systemd compatibility matrix, nested virtualization, or a general guarantee for every Linux kernel feature. Ask for the exact image, infrastructure generation and workload requirements.

## 3. Lifecycle and timing

- **docs-confirmed** — Active state: “You are charged for memory (based on how much you allocated at sandbox creation) and storage while a sandbox is in active mode.” CPU is allocated according to memory. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — Standby: “This transition happens in approximately 15 seconds.” “if the WebSocket/TCP connection remains idle for 15 minutes with no activity, the sandbox will automatically transition to standby mode.” The snapshot includes the complete filesystem and processes, and memory charges stop; external network connections are not preserved. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **pricing-page** — Marketing instead says “Sandboxes scale to zero after about 5 seconds of inactivity and resume from standby in roughly 25ms”. [Pricing FAQ](https://blaxel.ai/pricing).
- **inferred** — The 5-second and 15-second idle claims conflict; neither is a measured guarantee. A socket can extend active billing; ask Blaxel which timer applies to the chosen configuration. Evidence: [pricing](https://blaxel.ai/pricing), [overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — Archive exports filesystem changes, not memory; “All processes that were running are restarted automatically from their configuration, with new IDs, when the sandbox is unarchived.” It is private preview. [Archive](https://docs.blaxel.ai/Sandboxes/Archive.md).
- **docs-confirmed** — Deletion is different from standby: “Deleted sandboxes cannot be recovered, while sandboxes in standby mode can be resumed instantly.” [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md). Separately created snapshots can survive deletion; see section 4.
- **docs-confirmed** — Expiration: “Some quota tiers enforce expiration dates (Tier 0 and 1, with respectively up to 7 and 30 days). In higher tiers, unlimited persistence is permitted.” An idle TTL can delete an actively used sandbox: “activity” counts resume or suspend, not activity in between. [Expiration](https://docs.blaxel.ai/Sandboxes/Expiration.md).
- **docs-confirmed** — Deployment statuses are “`UPLOADING`”, “`BUILDING`”, “`DEPLOYING`”, “`DEPLOYED`”, “`FAILED`”, “`DEACTIVATING`”, “`DEACTIVATED`”, “`TERMINATED`”, “`DELETING`”, “`ARCHIVING`”, “`ARCHIVED`”, and “`UNARCHIVING`”; “`DEPLOYED`: The sandbox is ready to use. It is either in active mode or standby mode.” [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — “Sandboxes resume from standby in under 25 milliseconds” is a provider claim, not an independently tested latency distribution. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **not-published** — A universal initial-start SLA, archive restore time, and maximum continuously running session across every tier were not established.

## 4. Snapshots, forks, images and volumes

- **docs-confirmed** — Explicit snapshots: “A snapshot captures the state of a sandbox at a point in time: its filesystem, its running processes, and its memory.” “This feature is currently in private preview and is not recommended for production use.” [Snapshots](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **docs-confirmed** — “A snapshot outlives the sandbox it was captured from: it stays usable, and forkable, after that sandbox is deleted.” “Deleting a snapshot is the only thing that removes it. Snapshots have no expiration, and Blaxel never prunes them for you.” [Snapshots](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **docs-confirmed** — A fork inherits configuration differently depending on whether the source exists: “When the source sandbox is gone, the fork runs with the configuration stored on the snapshot.” [Snapshots](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **not-published** — Whether every fork avoids pausing the live source was not independently established here. Do not conflate a point-in-time clone with a continuously shared filesystem.
- **docs-confirmed** — “Create reusable sandbox images with pre-configured tools, languages, and frameworks using Dockerfiles.” [Documentation index](https://docs.blaxel.ai/llms.txt).
- **docs-confirmed** — Volumes survive sandbox destruction, but “you can only attach one volume to a sandbox. A volume can also only be attached to one sandbox at a time.” [Volumes](https://docs.blaxel.ai/Sandboxes/Volumes.md).
- **docs-confirmed** — Shared alternative: “Agent Drive is a distributed filesystem mountable to multiple sandboxes or agents simultaneously, with concurrent read-write access and built-in replication.” [Documentation index](https://docs.blaxel.ai/llms.txt).

## 5. Sizes, GPU, architecture, regions

- **docs-confirmed** — The overview specifies “a sandbox with 8 GB memory is allocated 4 CPU cores, while one with 16 GB memory is allocated 6 CPU cores.” Its creation example specifies “memory: 4096” in MB. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **third-party** — Battleships lists “4 GB 2 vCPU/4 GiB $0.1656/h” and “8 GB 4 vCPU/8 GiB $0.3312/h”. [Battleships](https://battleships.dev/data/providers/blaxel.md). The 4-GB CPU mapping needs direct vendor confirmation before treating it as guaranteed.
- **pricing-page** — Custom deployments advertise “Up to 256 GB RAM per sandbox or job” and “Custom hardware options”. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — Mark 3 region table lists “Oregon”, “North Virginia”, “London”, and “Frankfurt”; “All regions are not necessarily available in self-service by default.” [Regions](https://docs.blaxel.ai/Infrastructure/Regions.md).
- **not-published** — A complete current standard-size/CPU table, GPU availability for sandboxes, and architecture guarantees were not independently confirmed. Custom hardware wording alone does not establish GPU availability.

## 6. Networking and secrets

- **docs-confirmed** — “You can expose specific non-reserved ports” and preview URLs open ports dynamically. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — “The Blaxel proxy intercepts outbound HTTPS requests from the sandbox and injects headers, body fields, and secrets server-side.” It is public preview, not recommended for production. [Secret injection](https://docs.blaxel.ai/Sandboxes/Proxy-secrets-injection.md).
- **docs-confirmed** — Filtering is not automatically foolproof: “Traffic from tools that ignore proxy environment variables will not be filtered unless [domain filter enforcement](#domain-filter-enforcement) is enabled.” [Domain filtering](https://docs.blaxel.ai/Sandboxes/Proxy-domains.md).
- **pricing-page** — Dedicated IPs, gateway runtime, and proxy data are listed as “Free during beta”; internet egress is “Included”. [Pricing](https://blaxel.ai/pricing).
- **not-published** — Exact default ingress authentication, TCP/SSH support, future beta pricing and all protocol restrictions need confirmation for the intended setup.

## 7. Interfaces

- **docs-confirmed** — “Python, TypeScript, and Go SDKs for Blaxel” and “HTTP API for every Blaxel resource” are linked on the [pricing page](https://blaxel.ai/pricing).
- **docs-confirmed** — Sandboxes expose “an [MCP server](https://docs.blaxel.ai/Sandboxes/MCP.md) that makes these capabilities available as tool calls.” The console has a “Terminal” tab and the CLI offers `bl connect sandbox`. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **docs-confirmed** — “Render an application in real-time through a direct preview URL backed by a running Blaxel sandbox, with optional auth and custom domains.” [Documentation index](https://docs.blaxel.ai/llms.txt).
- **not-published** — Native SSH, managed desktop/browser-control APIs, and outbound webhook support were not independently confirmed. A web terminal or preview is not itself proof of SSH or a graphical desktop.

## 8. Agent features

- **docs-confirmed** — “Every Blaxel sandbox exposes a built-in MCP server so agents can operate the sandbox using tool calls for files, processes, ports, and previews.” [Documentation index](https://docs.blaxel.ai/llms.txt).
- **docs-confirmed** — “Execute shell commands, retrieve process information, stream output, and control process lifecycle” and use “file editing, formatting, search, and execution helpers”. [Documentation index](https://docs.blaxel.ai/llms.txt).
- **pricing-page** — Agent Runtime is labelled “Coming soon”, whereas batch jobs and MCP hosting have published compute rates. [Pricing](https://blaxel.ai/pricing).

## 9. Accounts and governance

- **docs-confirmed** — “There are three roles that a user or service account can have in a workspace: **admin**, **member** and **viewer**.” [Workspace access](https://docs.blaxel.ai/Security/Workspace-access-control.md).
- **docs-confirmed** — “Use Blaxel service accounts with non-user API credentials” and “creating, scoping, rotating, and revoking tokens” are documented. [Documentation index](https://docs.blaxel.ai/llms.txt).
- **docs-confirmed** — SAML and directory sync “require the **SAML** feature flag on your account”. [SSO](https://docs.blaxel.ai/Security/SSO-Directory-sync.md).
- **docs-confirmed** — On Baseten-managed workspaces, “Removing a user from Baseten does not delete their Blaxel user identity.” Immediate offboarding requires contacting Blaxel support to remove access. [Managed workspaces](https://docs.blaxel.ai/Security/Baseten-managed-workspaces.md).
- **docs-confirmed** — “A resource will never be deployed in a region that is prohibited by an existing deployment policy.” [Regions](https://docs.blaxel.ai/Infrastructure/Regions.md).
- **not-published** — A hard spend cap, detailed audit-log coverage and data residency of every metadata/backup component were not verified. Region selection alone is not proof of complete data residency.

## 10. Pricing, free tier and extras

- **pricing-page** — Sandbox active compute: “$0.0000115 / GB RAM · second”; “billed by its allocated memory (CPU scales automatically)”. Snapshot storage: “$0.20 / GB · month”; image storage: “$0.045 / GB · month”. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — “CPU resources are allocated accordingly by Blaxel based on your selected memory allocation and are not charged separately.” [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **pricing-page** — Volumes cost “$0.12 / GB · month” on “the volume size you provision, for as long as the volume exists, regardless of how much data you actually write in it.” Agent Drive operations and storage are free during beta. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — Archive documentation says “nothing runs and no memory is kept, and you stop paying for it.” [Archive](https://docs.blaxel.ai/Sandboxes/Archive.md).
- **not-published** — Whether that includes archive storage after preview is unclear; request written rates.
- **pricing-page** — Batch compute is “$0.000006 / GB RAM · second”; MCP hosting is “$0.000007 / GB RAM · second”; both list image storage at $0.045/GB-month. [Pricing](https://blaxel.ai/pricing).
- **pricing-page** — The pay-as-you-go plan advertises “$0.00”, “+ USAGE”, and “Up to $200 in free credits”; custom pricing requires a quote. [Pricing](https://blaxel.ai/pricing).
- **pricing-page** — Quota listings show “Tier 0” free with “10” sandboxes, “Tier 1” with “$20 / month” and “50”, and “Tier 2” with “$50 / month” and “200”. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — These are wallet top-ups, not monthly subscription fees: “Funds added to meet a tier requirement are deposited directly into your account balance.” “Promotional credits do not unlock tiers”. [Quotas](https://docs.blaxel.ai/Security/Quotas.md).
- **pricing-page** — Domain and support examples: “$0.25 / domain · month”, “$20 / domain · month”, “$800” “/ MONTH + 3% OF USAGE”, “$1,600” “/ MONTH + 10% OF USAGE”, and HIPAA “$250” “/ MONTH”. [Pricing](https://blaxel.ai/pricing).
- **not-published** — Per-start or per-resume minimum billed duration, actual credit grant, treatment at exhaustion, and precise snapshot GB measurement were not verified. Avoid treating the maximum credit offer as guaranteed. See section 17 for the published credit-expiry term and no-card claim.

## 11. Worked examples

- **inferred** — Arithmetic below uses the published sandbox compute rate of $0.0000115/GB-second and volume rate of $0.12/GB-month, with 1 month = 730 hours and GB treated numerically as requested GiB only for illustration. Evidence: [pricing](https://blaxel.ai/pricing). No free credits, tax, images, networking extras, minimums or retained snapshots are included unless stated. Actual bills can differ. The 4-GB/2-vCPU mapping is third-party only; see section 5.
- **inferred** — A: 1,000 × 10 minutes = 600,000 seconds. 4 × 600,000 × $0.0000115 = **$27.60 active compute**. Deletion immediately after each task is assumed; snapshot, volume and image charges are not calculable without usage details. Evidence: [pricing](https://blaxel.ai/pricing), [overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **inferred** — B: exact 4 CPU/8 GB mapping is documented. 8 × 730 × 3,600 × $0.0000115 = **$241.776 compute**. Assuming a continuously provisioned 50-GB volume, 50 × $0.12 = **$6.00**, total **$247.776 before image or other charges**. A 50-GB volume is assumed rather than 50 GB of ordinary local disk because the local writable filesystem uses RAM. Evidence: [overview](https://docs.blaxel.ai/Sandboxes/Overview.md), [pricing](https://blaxel.ai/pricing).
- **inferred** — C: 90 active hours: 4 × 90 × 3,600 × $0.0000115 = **$14.904**. A continuously provisioned 20-GB volume costs 20 × $0.12 = **$2.40**, subtotal **$17.304**. The remaining 630 hours are standby, for which snapshot storage costs additional **S × $0.20 × 630/730**, where S is billable snapshot GB. S is not established, so the complete total cannot be calculated. Higher-than-free TTL tier is required to retain a sandbox throughout this scenario. Evidence: [pricing](https://blaxel.ai/pricing), [expiration](https://docs.blaxel.ai/Sandboxes/Expiration.md).

## 12. Same word, different meaning

- **inferred** — Standby is closer to memory hibernation than deleting a machine; external connections still break. Evidence: [overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **inferred** — Archive is a filesystem-delta export, not a memory snapshot; restarted processes have new identities. Evidence: [archive](https://docs.blaxel.ai/Sandboxes/Archive.md).
- **inferred** — A top-up tier is money added to a wallet, not necessarily an extra subscription charge. Evidence: [quotas](https://docs.blaxel.ai/Security/Quotas.md).
- **inferred** — The pricing label active CPU describes a RAM-based meter, not a separate CPU-hour charge. Evidence: [pricing](https://blaxel.ai/pricing).

## 13. Glossary candidates

- **inferred** — MicroVM: a small isolated virtual computer; standby: suspended state that can be resumed; snapshot: captured point-in-time state; volume: independently persistent mounted storage; Agent Drive: shared filesystem; secret proxy: service adding credentials to outgoing requests; TTL: time before automatic deletion. Evidence: [overview](https://docs.blaxel.ai/Sandboxes/Overview.md), [snapshots](https://docs.blaxel.ai/Sandboxes/Fork.md), [volumes](https://docs.blaxel.ai/Sandboxes/Volumes.md), [proxy](https://docs.blaxel.ai/Sandboxes/Proxy-secrets-injection.md), [expiration](https://docs.blaxel.ai/Sandboxes/Expiration.md).

## 14. Gaps, contradictions and Battleships cross-check

- **third-party** — Both requested Battleships files were consulted: the [Markdown](https://battleships.dev/data/providers/blaxel.md) says “Sandbox (active time, RAM-only pricing, CPU bundled)”; the [JSON](https://battleships.dev/data/providers/blaxel.json) is its structured feature and pricing companion. Battleships is a secondary source built by the Boat team, not the provider's contract.
- **inferred** — Its active-compute meter agrees with provider sources, but a casual reading as a RAM-only *total bill* omits standby snapshot, volume and image storage. Evidence: [Battleships](https://battleships.dev/data/providers/blaxel.md), [pricing](https://blaxel.ai/pricing).
- **inferred** — The 5-versus-15-second discrepancy is already acknowledged by Battleships and exists between provider pages, not a new disagreement between Battleships and Blaxel. Evidence: [Battleships](https://battleships.dev/data/providers/blaxel.md), [pricing](https://blaxel.ai/pricing), [overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **third-party** — Battleships lists “extra volumes, shared volumes” as Yes. [Battleships](https://battleships.dev/data/providers/blaxel.md).
- **docs-confirmed** — The current sandbox volume documentation says “you can only attach one volume to a sandbox” and “A volume can also only be attached to one sandbox at a time.” [Volumes](https://docs.blaxel.ai/Sandboxes/Volumes.md).
- **inferred** — This is a material terminology or feature discrepancy: Agent Drive is shared, but it is not the documented single-attachment Volume product. Confirm scope and generation with Blaxel. Evidence: [Battleships](https://battleships.dev/data/providers/blaxel.md), [Volumes](https://docs.blaxel.ai/Sandboxes/Volumes.md), [index](https://docs.blaxel.ai/llms.txt).
- **inferred** — Battleships' Yes for snapshots and forks needs the prominent private-preview qualification from current vendor docs. Evidence: [Battleships](https://battleships.dev/data/providers/blaxel.md), [forks](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **not-published** — We did not independently audit every Battleships feature flag; a listed flag is not a verified guarantee. Confirm actual snapshot size billing, deletion of attached objects, account grant, architecture, live-fork effects and availability before publishing categorical claims.

## 15. Non-technical usability

- **docs-confirmed** — Console creation requires choosing an image, resources, TTL and region: “Click **+Create sandbox** -> **Deploy from console**.” A browser terminal is also documented. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **inferred** — The dashboard can create and inspect a sandbox without writing API code, but doing useful work may still require commands, configuration or a developer. Evidence: [overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **pricing-page** — The site says “Up to $200 in free credits” and “Community support on Discord”. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — The site links “Documentation”, “Changelog”, and “Status”. [Pricing](https://blaxel.ai/pricing).
- **not-published** — Whether signup has a waitlist, how much each new user receives, and what happens at exhaustion were not verified; signup was not attempted. See section 17 for the provider's no-card claim and the standard credit-expiry term.
- **inferred** — A non-engineer could mistake standby for free storage, delete the sandbox while leaving a separately created snapshot or volume, misunderstand wallet top-ups as a flat fee, or assume a proxy filter automatically controls every program. Evidence: [overview](https://docs.blaxel.ai/Sandboxes/Overview.md), [snapshots](https://docs.blaxel.ai/Sandboxes/Fork.md), [quotas](https://docs.blaxel.ai/Security/Quotas.md), [domain filtering](https://docs.blaxel.ai/Sandboxes/Proxy-domains.md).

## 16. Concept examples

- **inferred** — Pause: automatic memory-and-filesystem standby; connections do not survive. [Overview](https://docs.blaxel.ai/Sandboxes/Overview.md).
- **inferred** — Stop: archive retains filesystem changes but not memory, unlike standby. [Archive](https://docs.blaxel.ai/Sandboxes/Archive.md).
- **inferred** — Snapshot: point-in-time RAM, process and filesystem checkpoint, independently retained, private preview. [Fork](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **inferred** — Fork: create a new sandbox from captured state, with configuration inheritance caveats. [Fork](https://docs.blaxel.ai/Sandboxes/Fork.md).
- **inferred** — Persistent storage: a separate, provisioned volume survives sandbox deletion; Agent Drive serves a different sharing need. [Volumes](https://docs.blaxel.ai/Sandboxes/Volumes.md), [index](https://docs.blaxel.ai/llms.txt).
- **inferred** — Isolation: per-sandbox microVM boundary; optional unprivileged user adds defense in depth. [Non-root](https://docs.blaxel.ai/Sandboxes/Non-root-user.md).
- **inferred** — Billing meter: active allocated RAM × time, plus separate stored-state charges. [Pricing](https://blaxel.ai/pricing).
- **inferred** — Trial: advertised maximum promotional credits rather than a precisely published universal grant. [Pricing](https://blaxel.ai/pricing).
- **inferred** — Secrets: proxy inserts credentials in outbound HTTPS requests instead of exposing raw keys to sandbox code; preview status matters. [Proxy](https://docs.blaxel.ai/Sandboxes/Proxy-secrets-injection.md).

## 17. The company behind it

### Ownership, legal entity, and direction

- **docs-confirmed** — On September 10, 2026, Baseten announced: “Baseten has acquired Blaxel.” [Baseten announcement](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **third-party** — “The announcement did not disclose financial terms.” [The Next Web](https://thenextweb.com/news/baseten-acquires-blaxel-ai-agent-sandboxes).
- **docs-confirmed** — The currently linked standard terms, dated December 10, 2025 on the [terms page](https://blaxel.ai/legal/terms), name “Blaxel, Inc (formerly known as Beamlit, Inc.), a Delaware corporation, d/b/a Blaxel” as the contracting party. [Standard terms PDF, p. 1](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **inferred** — The published standard terms still name Blaxel, not Baseten, and predate the acquisition; they do not establish the present corporate structure or prove which entity contracts under a particular customer's order. Ask the vendor to confirm the legal counterparty and any updated contract. Evidence: [terms page](https://blaxel.ai/legal/terms), [PDF](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf), and [acquisition announcement](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **docs-confirmed** — Baseten said “Blaxel is continuing” and “The product doesn't change, and features will keep shipping.” It also said “Over time, Baseten will add new products based on Blaxel's primitives, starting with Sandboxes.” [Announcement](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).
- **docs-confirmed** — Blaxel's current company page says “Blaxel continues as a product and platform. Your sandboxes, storage, networking, API keys, credits, and support contacts stay the same.” [About](https://blaxel.ai/company/about).
- **docs-confirmed** — Baseten organization access is already integrated: “Each Baseten organization maps to one dedicated Blaxel workspace and one dedicated Blaxel account.” The docs say a new account is created rather than using an existing one. [Baseten-managed workspaces](https://docs.blaxel.ai/Security/Baseten-managed-workspaces.md).
- **not-published** — A mandatory migration, retirement date, final legal-entity structure after acquisition, and the date or scope of any change to pricing or customer-specific terms were not established. Future Baseten products are not evidence of a forced migration.

### Founders, leadership, age and funding

- **docs-confirmed** — Blaxel identified its six founders in its seed announcement: “Paul Sinai” teamed up with “Christophe Ploujoux, Nicolas Lecomte, Thomas Crochet, Charles Drappier, and Mathis Joffre”; “we all joined forces to build Blaxel.” [Blaxel seed announcement](https://blaxel.ai/blog/Blaxel-Raises-7-3M-Seed-Round-led-by-First-Round-to-Build-Cloud-Infrastructure-for-the-AI-Agent-Eco-23247e47b1ea8067b923d998364e3ced).
- **third-party** — Y Combinator's directory lists “Paul Sinaï” as “Founder/CEO”, “Christophe Ploujoux” as “Founder/CTO”, and Mathis Joffre says “I’m the co-founder and engineering lead at Blaxel”. [YC directory](https://www.ycombinator.com/companies/blaxel). These are public directory descriptions, not independently verified current post-acquisition titles.
- **not-published** — A complete, current post-acquisition organization chart or definitive continuing executive titles were not established.
- **third-party** — YC lists “Founded:2024” and “Team Size:12”. [YC directory](https://www.ycombinator.com/companies/blaxel). The directory does not date its team-size figure; it is not a verified current post-acquisition headcount.
- **docs-confirmed** — Blaxel says “Blaxel raised a $7.3M seed round led by First Round.” [About](https://blaxel.ai/company/about). Its seed announcement names “First Round, Y Combinator, Liquid 2, Multimodal and several others”. [Seed announcement](https://blaxel.ai/blog/Blaxel-Raises-7-3M-Seed-Round-led-by-First-Round-to-Build-Cloud-Infrastructure-for-the-AI-Agent-Eco-23247e47b1ea8067b923d998364e3ced).
- **not-published** — A complete, independently verified lifetime pre-acquisition funding total and precise founding day or month were not established; the $7.3M seed should not be represented as necessarily the total.
- **docs-confirmed** — Baseten described its own scale in the acquisition announcement: “running at scale across dozens of regions, with more than $2B raised to build it.” This is Baseten's claim, not Blaxel's funding. [Baseten announcement](https://www.baseten.co/blog/blaxel-is-joining-baseten-to-build-the-future-of-agentic-cloud/).

### Status, service levels, support, and security

- **docs-confirmed** — On October 28, 2026, Blaxel's [public status page](https://status.blaxel.ai/) displayed the period “Jul 2026-Oct 2026”, “Sandboxes”, and “99.33% uptime”; it displayed “Platform” at “99.30% uptime”. These are provider-reported, changing status-page figures, not independent measurements or an SLA.
- **pricing-page** — The Custom plan lists “Custom SLAs”. [Pricing](https://blaxel.ai/pricing).
- **not-published** — A standard numerical uptime SLA, eligibility for pay-as-you-go, calculation exclusions and service credits were not found in the public pricing or standard terms; ask for the signed SLA. The historical uptime figure is not a contractual guarantee.
- **pricing-page** — Pay-as-you-go includes “Community support on Discord”. The email add-on promises “Private email support with 24-hour response time during business hours”; dedicated support includes “A shared Slack channel, live architecture workshops with our engineers”. [Pricing](https://blaxel.ai/pricing).
- **docs-confirmed** — Blaxel's own security page lists “SOC 2, HIPAA, ISO 27001” and says “Request access there for the full SOC 2 report.” Its [Blaxel compliance portal](https://compliance.blaxel.ai) is linked by [Blaxel security](https://blaxel.ai/company/security); these are Blaxel's claims, not proof that Baseten's independent certifications cover the same services.
- **pricing-page** — The HIPAA add-on is “$250” per month and says “Get a signed Business Associate Agreement (BAA) to use Blaxel on our HIPAA-compliant infrastructure.” [Pricing](https://blaxel.ai/pricing).
- **not-published** — The actual SOC report's audit period, scope, exceptions, and whether a Baseten-issued report independently covers Blaxel were not verified. Obtain the report and signed BAA rather than treating a website label as a compliance guarantee.

### Buyer-relevant standard terms

- **docs-confirmed** — On termination, “Blaxel will be under no obligation to store or retain the applicable Customer Data and may delete the applicable Customer Data at any time in its sole discretion.” The terms add “No Customer Data will be retained for more than 90 days after expiration or termination of this Agreement”, with exceptions for standard backups and applicable law. [Standard terms PDF, §12.4](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **inferred** — Export needed data before cancellation; the 90-day provision is not a promise of a 90-day retrieval window, and backup/legal exceptions require examination. Evidence: [standard terms PDF, §12.4](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **docs-confirmed** — Renewal pricing: “Fees for Renewal Terms (defined below) are at Blaxel’s then-current rates, regardless of any discounted pricing in a prior Order.” [Standard terms PDF, §10.1](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **not-published** — No specific advance notice period for a price increase was found in the reviewed standard terms. This is separate from the subscription non-renewal notice below; a signed order may differ.
- **docs-confirmed** — For non-renewal, the standard terms require “at least 30 days before the end of the Initial Term or applicable Renewal Term, if the Initial Term or applicable Renewal Term is twelve (12) months or more”, or notice before the end for shorter terms, including month-to-month. [Standard terms PDF, §12.2](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **docs-confirmed** — “Unused Service Credits expire one year after the date of purchase or issuance, unless otherwise specified at the time of purchase or when the applicable Service Credits are issued.” [Standard terms PDF, §10.2](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf).
- **docs-confirmed** — Blaxel's security page advertises “Up to $200 in credits, no credit card required.” This is an advertised offer; signup was not tested. [Security](https://blaxel.ai/company/security).
- **inferred** — These are vendor standard terms, not legal advice or a substitute for the actual signed order, data processing agreement, SLA, or counsel's review. Evidence: [standard terms PDF](https://blaxel.ai/legal/terms/2025-12-10-blaxel-terms-and-conditions.pdf), [pricing](https://blaxel.ai/pricing).
