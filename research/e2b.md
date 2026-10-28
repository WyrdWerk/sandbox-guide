# E2B: sandbox research

Research date: 2026-10-28. Desk research only; no account, sandbox, purchase, or runtime test. Evidence tags describe the source, not independent verification. Each quoted excerpt below was checked against its linked live source; source content can change. `not-published` means not found in the sources inspected, not a definitive statement that the feature does not exist. `inferred` identifies reasoning and its evidence.

## 1. What it is

- **docs-confirmed** — Agent execution environments, aimed at developers integrating agents: “E2B provides isolated sandboxes that let agents safely execute code, process data, and run tools.” [Documentation](https://docs.e2b.dev/index.md).
- **docs-confirmed** — Its principal building blocks are “A fast, secure Linux VM created on demand for your agent” and a template that “Defines what environment a sandbox starts with”. [Documentation](https://docs.e2b.dev/index.md).
- **docs-confirmed** — Code interpreter: “the Code Interpreter server inside the sandbox is reachable through the sandbox's [public URL](https://docs.e2b.dev/network/public-url.md) and runs any code it receives.” [Data analysis](https://docs.e2b.dev/code-interpreting/analyze-data-with-ai.md). Desktop: “The [E2B Desktop](https://github.com/e2b-dev/desktop) SDK gives your agent a full Linux desktop with mouse, keyboard, and screen capture APIs.” [Computer use](https://docs.e2b.dev/use-cases/computer-use.md).
- **inferred** — This is infrastructure to build an application around, not evidence of a turnkey consumer AI assistant. Evidence: the SDK-based [quickstart](https://docs.e2b.dev/quickstart.md) and [desktop guide](https://docs.e2b.dev/use-cases/computer-use.md).

## 2. Isolation and privileges

- **docs-confirmed** — “Every sandbox is a [Firecracker](https://firecracker-microvm.github.io/) microVM, not a container. Each one boots its own kernel and is isolated from every other sandbox and from the host by the hypervisor” [Security](https://docs.e2b.dev/security.md). A microVM is a small virtual computer; a hypervisor separates it from the host.
- **docs-confirmed** — Docker-in-sandbox is documented: “Sandbox with Docker or Docker Compose installed for running containers” [Docker example](https://docs.e2b.dev/template/examples/docker.md).
- **docs-confirmed** — The normal template user is not root: “The default user in the template is `user` with the `/home/user` (home directory) as the working directory.” [User and workdir](https://docs.e2b.dev/template/user-and-workdir.md). Root can be specified in a template: “], { user: 'root' })” [SSH example](https://docs.e2b.dev/sandbox/ssh-access.md).
- **docs-confirmed** — Kernel features are not unlimited: “The E2B sandbox kernel does not ship the `xt_owner` module” [FAQ](https://docs.e2b.dev/faq.md).
- **not-published** — A comprehensive systemd, nested virtualization, eBPF, and kernel-module compatibility matrix was not established from primary documentation inspected. Test the exact service and module required; a separate kernel does not imply arbitrary kernel configuration.

## 3. Lifecycle

- **docs-confirmed** — Published principal states: “**Running**: The sandbox is actively running and can execute code.”; “**Paused**: The sandbox execution is suspended but its state is preserved.”; “**Snapshotting**: The sandbox is briefly paused while a persistent snapshot is being created.”; “**Killed**: The sandbox is terminated and all resources are released.” [Persistence](https://docs.e2b.dev/sandbox/persistence.md).
- **docs-confirmed** — Full pause saves the whole sandbox filesystem and RAM: “When you pause a sandbox, both the sandbox's filesystem and memory state will be saved.” and “all the running processes, loaded variables, data, etc. will be restored.” [Persistence](https://docs.e2b.dev/sandbox/persistence.md).
- **docs-confirmed** — Optional disk-only pause instead: “disk survive, but RAM and running processes do not.” [Filesystem-only snapshots](https://docs.e2b.dev/sandbox/filesystem-only-snapshots.md). Existing external connections drop in either case: “Network connections to clients **outside** the sandbox drop when it pauses” [same page](https://docs.e2b.dev/sandbox/filesystem-only-snapshots.md).
- **docs-confirmed** — “A killed sandbox cannot be resumed, and its state is gone.” [Lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md). Volumes and separately created snapshots are separate objects, not proof the killed VM is resumable; see sections 4 and 12.
- **docs-confirmed** — “Every sandbox has a timeout, and it defaults to **5 minutes** if you do not set one.” The default is destructive: “`onTimeout: 'kill'` (the default) terminates the sandbox and releases its resources.” [Lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md). Opt-in “`onTimeout: 'pause'` pauses the sandbox instead.” [same page](https://docs.e2b.dev/faq/sandbox-lifetime.md).
- **docs-confirmed** — Timeout is not necessarily an idle detector: “Running commands, reading or writing files, and requests to the sandbox's URL do not reset the timeout of a running sandbox.” [Auto-resume](https://docs.e2b.dev/sandbox/auto-resume.md).
- **docs-confirmed** — Continuous runtime limits are 1 hour Hobby, 24 hours Pro, and custom Enterprise; “Pausing and resuming resets it” and “Paused sandboxes are kept indefinitely.” [Lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md).
- **docs-confirmed** — After request wake-up, “a paused sandbox wakes up when activity arrives” and “a **5-minute minimum timeout**” applies. [Auto-resume](https://docs.e2b.dev/sandbox/auto-resume.md). Filesystem-only auto-pause “can't be combined with auto-resume.” [same page](https://docs.e2b.dev/sandbox/auto-resume.md).
- **docs-confirmed** — Resume timing is approximate, not an SLA: “a memory restore takes about a
second, while a reboot costs roughly a fresh boot.” [Reboot on resume](https://docs.e2b.dev/sandbox/resume-without-memory.md).
- **not-published** — A contractual start-time or resume-time guarantee, a complete internal transition-state inventory, and pause-transition billing were not established. Measure the actual workload and region.

## 4. Snapshots, forks, templates and volumes

- **docs-confirmed** — “Snapshots let you create a persistent point-in-time capture of a running sandbox, including both its filesystem and memory state.” [Snapshots](https://docs.e2b.dev/sandbox/snapshots.md). “The original sandbox continues running after the snapshot is created” [same page](https://docs.e2b.dev/sandbox/snapshots.md). Filesystem-only snapshots are also supported subject to project availability: “If filesystem-only snapshots are not enabled for your project yet, the request is refused” [Filesystem-only snapshots](https://docs.e2b.dev/sandbox/filesystem-only-snapshots.md).
- **docs-confirmed** — Forking starts from a running VM, but is not interruption-free: “The sandbox is snapshotted in place — paused, captured with its full filesystem and memory state, and resumed — and new sandboxes boot from that snapshot.” [Fork](https://docs.e2b.dev/sandbox/fork.md). “The pause also causes all active connections (e.g. WebSocket, PTY, command streams) to be dropped” [same page](https://docs.e2b.dev/sandbox/fork.md).
- **docs-confirmed** — “With the SDKs and the CLI you can request up to 20 forks at once.” The fork timeout “defaults to 15 seconds.” [Fork](https://docs.e2b.dev/sandbox/fork.md).
- **docs-confirmed** — Templates can start from container images: “Use any Docker image from Docker Hub or other registries” [Base image](https://docs.e2b.dev/template/base-image.md). “Multi-stage Dockerfiles are not supported.” [same page](https://docs.e2b.dev/template/base-image.md).
- **docs-confirmed** — Volumes are independent shared storage: “Data written to a volume persists even after a sandbox is shut down, and volumes can be mounted to multiple sandboxes over time.” But “Volumes are currently in private beta.” [Volumes](https://docs.e2b.dev/volumes.md).
- **docs-confirmed** — Volume caveats: “File locking can hang, file metadata caching is disabled, read/write permission bits are not enforced between users, mounts are fixed at sandbox creation, and snapshots and read-only mounts are not yet supported.” [FAQ](https://docs.e2b.dev/faq.md).

## 5. Sizes, GPU, architecture and regions

- **docs-confirmed** — Billing documentation says “| **Max vCPUs** | 8 | 8+” and “| **Disk size** | 10 GiB | 20+ GiB” for Hobby then Pro; the Pro row says contact support for more disk. [Billing](https://docs.e2b.dev/billing.md).
- **docs-confirmed** — “No. E2B sandboxes are CPU-only, sized by vCPU and RAM only, with no GPU option in the SDKs, CLI, API, or a template definition. BYOC does not change this.” [FAQ](https://docs.e2b.dev/faq.md).
- **docs-confirmed** — “E2B offers a shared EU cluster on every plan, for workspaces verified by adding a payment method.” [EU FAQ](https://docs.e2b.dev/faq/eu-region.md). “Each region is a separate deployment.” [FAQ](https://docs.e2b.dev/faq.md).
- **docs-confirmed** — “E2B's managed sandboxes run on **Google Cloud**, and in the US West (AWS) region on **AWS**.” [Security](https://docs.e2b.dev/security.md).
- **docs-confirmed** — Current managed regions include “| US | Google Cloud `us-west1` | All plans”, “| US West (AWS) | AWS `us-west-2` | All plans”, “| EU | Google Cloud `europe-west1` | All plans, workspace verified by adding a payment method”, and “| APAC | Google Cloud `asia-southeast1` | All plans, workspace verified by adding a payment method”. [Egress regions](https://docs.e2b.dev/faq/egress-ip-ranges.md). Except default US, the table says contact support.
- **not-published** — A CPU-architecture matrix was not established here; do not infer architecture availability from another provider's comparison.

## 6. Networking and secrets

- **docs-confirmed** — “Every sandbox has outbound access to the internet by default.” Domain/IP allow and deny rules are documented. [Internet access](https://docs.e2b.dev/network/internet-access.md).
- **docs-confirmed** — “there are no dedicated or static egress IP addresses on any plan (including Enterprise).” [Egress IPs](https://docs.e2b.dev/faq/egress-ip-ranges.md). A customer-operated proxy can provide a stable address.
- **docs-confirmed** — “By default, a sandbox's public URLs are reachable by anyone who knows them.” [Public URL](https://docs.e2b.dev/network/public-url.md). Restrict access before exposing sensitive services.
- **docs-confirmed** — Credentials can be kept outside the VM: “The egress proxy injects the real value into matching outbound HTTPS requests outside the sandbox.” [Secrets](https://docs.e2b.dev/secrets.md). “Only inject credentials into destinations you trust. The destination receives the value and could expose it in its response to the sandbox.” [same page](https://docs.e2b.dev/secrets.md).
- **docs-confirmed** — A custom domain guide uses customer-operated infrastructure: “We will set up a GCP VM running Caddy server with Docker and Cloudflare DNS to proxy the requests to the Sandboxes.” [Custom domain](https://docs.e2b.dev/network/custom-domain.md).
- **not-published** — A complete public tariff for network transfer, reserved egress IPs, private networking, or native custom-domain hosting was not established.

## 7. Interfaces

- **docs-confirmed** — Python and JavaScript SDKs are demonstrated: “npm i e2b” and “pip install e2b” [Docs](https://docs.e2b.dev/index.md). The browser documentation links the API reference and console: “API Reference” [Docs](https://docs.e2b.dev/).
- **docs-confirmed** — SSH is a configured proxy rather than an assumed built-in SSH port: “Connect to your sandbox via SSH using a WebSocket proxy” [SSH](https://docs.e2b.dev/sandbox/ssh-access.md).
- **docs-confirmed** — “Webhooks provide a way for notifications to be delivered to an external web server whenever certain sandbox lifecycle events occur.” [Webhooks](https://docs.e2b.dev/sandbox/lifecycle-events-webhooks.md).
- **docs-confirmed** — “E2B provides a batteries-included MCP gateway that runs inside sandboxes” [MCP gateway](https://docs.e2b.dev/mcp-gateway.md). Separately, docs themselves have an MCP server: “public, no authentication needed” [Docs](https://docs.e2b.dev/index.md).
- **docs-confirmed** — Browser example is not necessarily inside E2B: “Cloud browsers run on Kernel's managed infrastructure, not inside your sandbox.” [Cloud browser](https://docs.e2b.dev/use-cases/remote-browser.md). Desktop automation is a different option; see section 1.
- **not-published** — Native sandbox-management MCP server and a complete supported-language SDK matrix were not independently established; do not conflate the MCP gateway and documentation MCP with a sandbox control API.

## 8. Agent features

- **docs-confirmed** — “Run AI coding agents like Claude Code, Codex, and Amp in secure E2B sandboxes with full terminal, filesystem, and git access.” [Coding agents](https://docs.e2b.dev/use-cases/coding-agents.md).
- **docs-confirmed** — Computer-use examples use “viewing the screen, clicking, typing, and scrolling” with VNC visual feedback. [Computer use](https://docs.e2b.dev/use-cases/computer-use.md).
- **inferred** — These examples demonstrate an execution environment and integration guides, not necessarily a provider-hosted agent subscription. Evidence: [coding agents](https://docs.e2b.dev/use-cases/coding-agents.md) and [computer use](https://docs.e2b.dev/use-cases/computer-use.md).

## 9. Accounts and governance

- **docs-confirmed** — “Each project still has its own plan and spending limit.” A workspace shares payment method, credits and invoice. [Workspaces](https://docs.e2b.dev/workspaces.md).
- **docs-confirmed** — “When a project reaches its spending limit, only that project is blocked.” [Workspaces](https://docs.e2b.dev/workspaces.md).
- **docs-confirmed** — “E2B has a SOC 2 Type II report” and the provider describes how to request “A **HIPAA business associate agreement (BAA)**”. [Security](https://docs.e2b.dev/security.md). A BAA is an agreement, not proof every workload is compliant.
- **not-published** — Specific API-key permission scopes, roles, audit-log coverage, SSO availability, and a comprehensive data-residency commitment were not verified. Ask E2B, especially about control-plane data and support access; the EU compute-region claim alone does not settle residency.

## 10. Pricing and limits

- **pricing-page** — “We charge per second of a running sandbox.” [Pricing](https://e2b.dev/pricing). **docs-confirmed** — “Paused and killed sandboxes are not billed.” [Calculation FAQ](https://docs.e2b.dev/faq/calculate-sandbox-price.md). Running but idle is still running; billing is based on allocated resources, not measured CPU utilization: “based on the vCPU and RAM allocated to it.” [same page](https://docs.e2b.dev/faq/calculate-sandbox-price.md).
- **pricing-page** — Rates: “$0.000014 per vCPU-second” and “$0.0000045 per GiB-second” [Pricing Markdown](https://e2b.dev/pricing.md). These equal $0.0504/vCPU-hour and $0.0162/GiB-hour, respectively (**inferred**, arithmetic from those rates).
- **pricing-page** — Hobby: “One-time $100 in usage credits.” and “No credit card required to start.” [Pricing Markdown](https://e2b.dev/pricing.md). **docs-confirmed** — When credits run out, “If you have no payment method, every project in your [workspace](https://docs.e2b.dev/workspaces.md#billing) is blocked shortly afterwards.” [Billing](https://docs.e2b.dev/billing.md).
- **pricing-page** — Pro is “$150 monthly plan fee, plus usage.” [Pricing Markdown](https://e2b.dev/pricing.md). **docs-confirmed** — “Upgrading to the Pro tier does not grant additional credits.” [Billing](https://docs.e2b.dev/billing.md).
- **docs-confirmed** — The billing table specifies 20 concurrent Hobby, 100–1,100 Pro and 20 concurrent template builds: “Each add-on adds 500 slots for \$500/month, up to 1,100 on Pro.” [Billing](https://docs.e2b.dev/billing.md).
- **pricing-page** — “A $3,000 monthly minimum applies to Enterprise usage.” [Pricing Markdown](https://e2b.dev/pricing.md). **not-published** — Enterprise negotiated rates and whether this minimum is applied as a credit against usage were not established.
- **docs-confirmed** — “Disk | Included (10 GiB Hobby / 20 GiB Pro)” [Calculation FAQ](https://docs.e2b.dev/faq/calculate-sandbox-price.md). **not-published** — More-than-included disk, volume storage, separately retained snapshot storage, template builds, network, startup fees and minimum billed seconds do not have confirmed published prices in sources inspected. Do not treat an omitted price as zero.
- **inferred** — Pricing-page default configuration conflicts with the billing FAQ: pricing says “The default sandbox has 2 vCPUs and 4 GiB of RAM.” [Pricing Markdown](https://e2b.dev/pricing.md), while billing says “Start with default resources (2 vCPU, 512 MiB RAM)” [Billing](https://docs.e2b.dev/billing.md). Both are provider quotes; inspect the actual sandbox allocation or ask E2B before estimating.
- **inferred** — Hobby sizing is also ambiguous: the [pricing page](https://e2b.dev/pricing) says “Default sandbox CPU and RAM”, while the [billing table](https://docs.e2b.dev/billing.md) lists “| **Max memory** | 8 GiB | 8+ GiB”. A ceiling does not prove self-service customization is enabled.

## 11. Worked examples

All figures below are **inferred** from the [published rate card](https://e2b.dev/pricing.md), [billing limits](https://docs.e2b.dev/billing.md), and [paused billing](https://docs.e2b.dev/faq/calculate-sandbox-price.md); they exclude taxes, model/API costs, undocumented charges and transition time. 2 vCPU/4 GiB costs $0.1656/hour; 4 vCPU/8 GiB costs $0.3312/hour. Exact requested compute sizes appear on the rate card, but actual plan access is subject to the conflicts above.

- **inferred** — A: 1,000 × 10 minutes = 166.6667 hours; 166.6667 × $0.1656 = **$27.60 compute**. With an unused $100 Hobby credit and assuming 2/4 is available there, cash due for compute could be $0, leaving $72.40 credit. Otherwise Pro costs **$177.60** before any remaining credit: $150 + $27.60. No minimum per task is assumed.
- **inferred** — B: 730 × $0.3312 = **$241.776 compute**, but 50 GiB exceeds the documented included 20 GiB Pro disk and a truly uninterrupted 730-hour run exceeds Pro's 24-hour continuous limit. Enterprise/custom quote is required; **total cannot be calculated** from published prices. $241.776 is only an illustrative compute subtotal, not a feasible all-in quote.
- **inferred** — C: 30 × 3 = 90 running hours; 720 − 90 = 630 paused hours; 90 × $0.1656 = **$14.904 compute**. With Pro's included 20 GiB and no credit, **$164.904** including the $150 plan fee, assuming each daily session is explicitly paused, and no other charges. Paused time has no compute charge. Actual continuous runtime, timeout handling and volume/snapshot costs must be checked.

## 12. Same word, different meaning

- **inferred** — Stop is dangerous shorthand: E2B's kill destroys the VM, whereas pause preserves it. Evidence: [lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md) and [persistence](https://docs.e2b.dev/sandbox/persistence.md). Ask what survives, not merely whether a provider can stop.
- **inferred** — A snapshot can include RAM and running processes, not just disk; a filesystem-only option instead reboots. Evidence: [snapshots](https://docs.e2b.dev/sandbox/snapshots.md) and [filesystem-only](https://docs.e2b.dev/sandbox/filesystem-only-snapshots.md).
- **inferred** — Fork from a running VM still briefly interrupts the source and drops connections; live does not mean uninterrupted. Evidence: [fork](https://docs.e2b.dev/sandbox/fork.md).
- **inferred** — Session limit is continuous running time, not paused-object retention; pause/resume resets the clock. Evidence: [lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md).
- **inferred** — E2B's timeout is a countdown, not necessarily inactivity detection. Evidence: [auto-resume](https://docs.e2b.dev/sandbox/auto-resume.md).

## 13. Glossary candidates

- **inferred** — MicroVM: a small isolated virtual computer with its own kernel; evidence [security](https://docs.e2b.dev/security.md).
- **inferred** — Full snapshot: a checkpoint with disk and RAM; evidence [snapshots](https://docs.e2b.dev/sandbox/snapshots.md).
- **inferred** — Volume: separate storage that can outlive and be mounted into sandboxes; evidence [volumes](https://docs.e2b.dev/volumes.md).
- **inferred** — Egress secret injection: adding a credential to an outgoing request outside the sandbox; evidence [secrets](https://docs.e2b.dev/secrets.md).
- **inferred** — Continuous runtime: time without a pause, not total lifetime; evidence [lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md).

## 14. Battleships cross-check, contradictions and gotchas

- **third-party** — Battleships says “fork (no pause)” in its feature list; its own caveat says “source sandbox is "briefly paused" during snapshot”. [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **inferred** — The no-pause phrase is misleading: E2B expressly describes a pause and dropped connections ([fork](https://docs.e2b.dev/sandbox/fork.md)).
- **third-party** — Battleships says “count<=100” for fork; [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **docs-confirmed** — E2B says “up to 20 forks at once.” [Fork](https://docs.e2b.dev/sandbox/fork.md).
- **third-party** — Battleships lists “public IPv4, custom domains, raw TCP inbound” under No [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **inferred** — E2B documents a customer-operated proxy workaround, not necessarily a native custom-domain feature; both statements can be true depending on definition ([custom domain](https://docs.e2b.dev/network/custom-domain.md)).
- **third-party** — Battleships says “4/8” in its Hobby credit calculation and “$100 one-time credit (~302 h of 4/8)” [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **inferred** — This assumes Hobby allows that custom size, which conflicts with the pricing card's default-only wording; verify entitlement.
- **third-party** — Battleships claims “with no SDK/HTTP activity” for idle auto-pause [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **docs-confirmed** — E2B says “Running commands, reading or writing files, and requests to the sandbox's URL do not reset the timeout of a running sandbox.” [Auto-resume](https://docs.e2b.dev/sandbox/auto-resume.md).
- **third-party** — Battleships JSON lists “"snapshot_auto": true” and “"custom_domain": false” [Battleships JSON](https://battleships.dev/data/providers/e2b.json). **inferred** — Those booleans hide the important distinction between a timeout-triggered pause checkpoint and a reusable named snapshot, and between native domains and external proxying; see [persistence](https://docs.e2b.dev/sandbox/persistence.md), [snapshots](https://docs.e2b.dev/sandbox/snapshots.md), and [custom domain](https://docs.e2b.dev/network/custom-domain.md).
- **third-party** — Battleships says “Default base template is 2 vCPU / 512 MiB” [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **inferred** — This matches billing docs but conflicts with the pricing Markdown's 2/4 default; neither value is a safe universal assumption.
- **third-party** — Battleships says “EU (Pro+ via support)” in one regional pricing passage, while also saying “BYOC (Enterprise) is now also available on Azure” and elsewhere “Azure not yet”. [Battleships Markdown](https://battleships.dev/data/providers/e2b.md). **docs-confirmed** — Current E2B EU FAQ says “on every plan, for workspaces verified by adding a payment method.” [EU FAQ](https://docs.e2b.dev/faq/eu-region.md). **not-published** — Azure BYOC availability was not independently resolved here.
- **inferred** — Public default URLs and secret injection do not eliminate exfiltration risk: recipients can disclose secrets, and URL holders can access services unless restricted. Evidence: [secrets](https://docs.e2b.dev/secrets.md), [public URL](https://docs.e2b.dev/network/public-url.md).

## 15. Non-technical usability

- **docs-confirmed** — A console/dashboard exists: “The fastest way to reach our support team is through **Contact support** in the **Help** menu of your [E2B Console](https://console.e2b.dev/?support=true).” [Support](https://docs.e2b.dev/support.md).
- **pricing-page** — “No credit card required to start.” [Pricing Markdown](https://e2b.dev/pricing.md). **docs-confirmed** — The one-time credit is shared at workspace level and projects block shortly after exhaustion if no payment method is added: “When a workspace without a payment method runs out of credits, every project in it is blocked shortly afterwards” [Workspaces](https://docs.e2b.dev/workspaces.md).
- **inferred** — Dashboard access is not proof a non-programmer can create and operate an end-to-end agent without code; examples use SDKs, terminals and API keys. Evidence: [quickstart](https://docs.e2b.dev/quickstart.md), [support](https://docs.e2b.dev/support.md). No account was created to test the user journey.
- **not-published** — Signup identity requirements, waitlist, credit expiry and support response commitments were not established. Check before recommending to beginners.
- **inferred** — The most surprising beginner hazards are destructive default timeout, public URLs, separate Pro fee, and computer-use setup. Evidence: [lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md), [public URL](https://docs.e2b.dev/network/public-url.md), [pricing](https://e2b.dev/pricing.md), [desktop](https://docs.e2b.dev/use-cases/computer-use.md).

## 16. Concept examples

- **inferred** — Pause: full disk and RAM freeze by default; [persistence](https://docs.e2b.dev/sandbox/persistence.md).
- **inferred** — Stop: kill is terminal and destructive; [lifetime](https://docs.e2b.dev/faq/sandbox-lifetime.md).
- **inferred** — Snapshot: reusable checkpoint, full or filesystem-only; [snapshots](https://docs.e2b.dev/sandbox/snapshots.md).
- **inferred** — Fork: running-source clone with a brief interruption; [fork](https://docs.e2b.dev/sandbox/fork.md).
- **inferred** — Persistent storage: independent shareable volume, private beta; [volumes](https://docs.e2b.dev/volumes.md).
- **inferred** — Isolation: one Firecracker microVM and kernel per sandbox; [security](https://docs.e2b.dev/security.md).
- **inferred** — Billing meter: allocated vCPU and RAM per running second, not idle utilization; [price FAQ](https://docs.e2b.dev/faq/calculate-sandbox-price.md).
- **inferred** — Trial: one-time credits, not a recurring monthly allowance; [pricing](https://e2b.dev/pricing.md).
- **inferred** — Secrets: outbound HTTPS proxy injection outside the VM; [secrets](https://docs.e2b.dev/secrets.md).

## Research method and limits

**inferred** — Sources were public provider pages and the requested Battleships JSON and Markdown, retrieved live on the research date. Context.dev MCP scrape and search succeeded; Context's site-restricted search returned no results. TinyFish search through Composio succeeded. Composio discovery succeeded for Exa and Firecrawl but neither was called for retrieval. Direct HTTPS fetched provider-published Markdown and Battleships. No native Amp web search was needed. No signup, sandbox, account change or paid E2B usage was performed. Pricing and capabilities are time-sensitive; this is not a guarantee of product availability or a tested deployment.
