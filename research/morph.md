# Morph Cloud — research for sandbox-guide

Research date: 2026-10-28. Desk research only; no account or workload was created. Labels describe the evidence, not hands-on validation. `not-published` means not found in the sources inspected, not proof that a capability does not exist. Each sourced bullet contains its own quotation and URL; calculations are explicitly conditional inferences.

## 1. What it is and who it is for

- **docs-confirmed** — Devboxes target cloud development, prototyping and team collaboration: “Morph Devboxes are the simplest way to code with AI in the cloud.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — The underlying instance/snapshot primitives target advanced automation: “Branching instances is the primitives path for power-user fan-out (e.g. RL environments, test-time scaling).” [Branch](https://cloud.morph.so/docs/documentation/instances/branch)
- **pricing-page** — Actions is a separate GitHub runner product: “Actions runners bill by size from the same MCU pool.” [Pricing](https://cloud.morph.so/web/subscribe)
- **docs-confirmed** — Volumes is a separate object-storage product: “Morph Volumes are persistent S3-compatible storage for build caches, release artifacts, checkpoints, and shared datasets.” [Volumes](https://cloud.morph.so/docs/volumes/getting-started)

## 2. Isolation and permissions

- **docs-confirmed** — Devboxes are VMs and support Docker-in-Docker: “Full virtual machines capable of running any configuration of containers: docker‑in‑docker, a local Kubernetes cluster, self‑hosted Supabase, etc.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — The examples use systemd to manage Docker: `systemctl enable docker` and `systemctl start docker`. [Snapshot setup](https://cloud.morph.so/docs/documentation/instances/snapshot-setup)
- **docs-confirmed** — Root is supported in at least the documented example: “The examples assume a Debian-based instance such as `morphvm-minimal` and a root shell”. [FUSE](https://cloud.morph.so/docs/documentation/instances/fuse)
- **docs-confirmed** — FUSE kernel support and userspace utilities are separate: “Fresh current `morphvm-minimal` instances already expose the kernel side of FUSE: `nodev fuse` appears in `/proc/filesystems` and `/dev/fuse` exists.” [FUSE](https://cloud.morph.so/docs/documentation/instances/fuse)
- **docs-confirmed** — Nested virtualization and other guests are experimental: “There is experimental support for Windows, OSX (x86), and nested virtualization as well.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **not-published** — Hypervisor implementation, eBPF availability/privileges, kernel version, and a comprehensive kernel-feature guarantee were not verified.

## 3. Lifecycle

- **docs-confirmed** — The API instance status vocabulary is `pending`, `ready`, `paused`, `saving`, `error`: `"enum":["pending","ready","paused","saving","error"]`. [API](https://cloud.morph.so/docs/api-reference/start-instance-instance-post)
- **docs-confirmed** — Pause preserves execution state: “Use when you need to preserve the running state of applications, the memory contents, and all processes.” [Pause](https://cloud.morph.so/docs/documentation/instances/pause-resume)
- **docs-confirmed** — Stop releases the instance: “The instance will be completely shut down, and all resources will be released.” [TTL](https://cloud.morph.so/docs/documentation/instances/ttl)
- **inferred** — Do not assume a stopped instance can resume its former RAM or unsaved disk; save an independent snapshot or external data first. Evidence: pause and stop documentation above. The stopped instance itself is not the same as a retained snapshot.
- **docs-confirmed** — Configurable reboot preserves disk but restarts: “Under the hood, Morph preserves your on‑disk changes and restarts with the new resources.” [Resize](https://cloud.morph.so/docs/examples/resizing-instances)
- **docs-confirmed** — Devboxes have activity-based sleep: “Devboxes can branch to hundreds of parallel replicas or scale to zero after a period of inactivity, preserving all application and memory state.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Instance TTL is a duration, not explicitly an inactivity timer: “Time-to-Live (TTL) functionality allows you to specify a duration after which an instance will automatically shut down or pause.” [TTL](https://cloud.morph.so/docs/documentation/instances/ttl)
- **docs-confirmed** — Wake can be configured: “When a request comes in through HTTP or an SSH-backed access path, the instance automatically resumes”. [Wake](https://cloud.morph.so/docs/documentation/instances/wake-on)
- **not-published** — Devbox default idle interval, instance TTL activity-reset semantics, a universal maximum session duration, and end-to-end start/resume service-level guarantees were not established.
- **docs-confirmed** — Provider marketing speed claim, not a measured guarantee: “snapshot, branch, and restore entire computational environments in under 250ms.” [Developers](https://cloud.morph.so/docs/developers)

## 4. Snapshots, branches, templates, volumes

- **docs-confirmed** — Instance snapshots are more than disk copies: “Snapshots are immutable point-in-time copies of both memory and disk state.” and “it captures the complete state of a running instance, including all running processes and services.” [Snapshots](https://cloud.morph.so/docs/documentation/instances/creating-snapshot)
- **docs-confirmed** — Start and boot are different: “Boot starts a brand-new VM from a snapshot's disk image (a cold boot).” and “If you want to restore memory and running process state from a saved snapshot, use instance start instead.” [Boot](https://cloud.morph.so/docs/documentation/instances/boot-from-snapshot)
- **docs-confirmed** — Branch creates new running instances from a snapshot: “Branching creates a snapshot of an instance and then launches a specified number of new instances from that snapshot.” [Branch](https://cloud.morph.so/docs/documentation/instances/branch)
- **docs-confirmed** — API nuance: “Save one hidden synchronous snapshot and create count children from it.” [Branch API](https://cloud.morph.so/docs/api-reference/branch-instance-instance-instance-id-branch-post)
- **inferred** — A branch is not simply a disk copy; its starting point includes the snapshot's process and memory state. The evidence is the snapshot and branch documentation above. The snapshot is synchronous; an uninterrupted source or zero pause is not established by these quotes.
- **docs-confirmed** — Expiration is tied to usage, not just creation: “Snapshot TTL is based on the snapshot's last-used timestamp, with creation time as the initial baseline.” [Snapshot TTL](https://cloud.morph.so/docs/documentation/instances/snapshot-ttl)
- **docs-confirmed** — Templates create Devboxes: “Every devbox is created from a template that integrates with our secrets manager”. [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Object volumes are not automatically an attached block disk: “The user-facing surface is the S3 gateway, the first-party `morphcloud volumes` CLI, and the Python `MorphCloudClient().volumes` helper layer.” [Volumes](https://cloud.morph.so/docs/volumes/getting-started)
- **docs-confirmed** — EFS is distinct from root capacity: “EFS and other separately mounted storage retain their own capacity.” [Live disk capacity](https://cloud.morph.so/docs/documentation/instances/resize-disk)
- **not-published** — Whether snapshot billing uses allocated or actually stored bytes, RAM compression, cross-branch deduplication, separately mounted volume contents, and the lifetime or billing of the hidden branch snapshot need confirmation.

## 5. Sizes, GPUs, architecture and regions

- **docs-confirmed** — User-selected resource counts are documented: “To create a new snapshot, specify the resource specifications like” `vcpus`, `memory`, and `disk_size`. [Snapshots](https://cloud.morph.so/docs/documentation/instances/creating-snapshot)
- **pricing-page** — Actions has fixed named sizes; for example “2 vCPU / 4 GB RAM / 40 GB disk” and “3 MCU/hr”. [Pricing](https://cloud.morph.so/web/subscribe)
- **not-published** — A complete VM size catalog, GPU availability, CPU architecture for ordinary Linux VMs, host locations, region selection and data residency were not confirmed in primary material inspected. Experimental OSX x86 is not proof of all host architectures.

## 6. Network and secrets

- **docs-confirmed** — An instance can expose an HTTP service: “Expose Http Service”. [API](https://cloud.morph.so/docs/api-reference/expose-http-service-instance-instance-id-http-post)
- **docs-confirmed** — Devbox templates integrate with a secret manager: “Every devbox is created from a template that integrates with our secrets manager”. [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Secret access must be scoped carefully: “Request the smallest scope set that works.” [Agent tokens](https://cloud.morph.so/docs/devboxes/agent-tokens)
- **not-published** — Egress price, destinations and filtering guarantees, static IPs, and whether arbitrary third-party credentials are injected without exposure inside the VM were not established. A secret manager alone does not prove a secret proxy.

## 7. Interfaces

- **docs-confirmed** — SDK and CLI are documented side by side: “Python”, “TypeScript”, and “CLI”. [Pause](https://cloud.morph.so/docs/documentation/instances/pause-resume)
- **docs-confirmed** — Interactive access includes a browser interface and SSH: “through SSH, or puppeteered through the Devbox API.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Remote desktop is configurable, not necessarily preinstalled: “You can also programmatically configure devboxes with remote desktops for computer‑use”. [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — A documented example runs a browser inside a VM: “runs two containerized services (a headless Chrome and an NGINX proxy)”. [Snapshot setup](https://cloud.morph.so/docs/documentation/instances/snapshot-setup)
- **inferred** — A runnable Chrome example does not establish a managed browser API or anti-bot service; the evidence is the snapshot-setup example above.
- **not-published** — A first-party MCP server, browser automation API, and webhooks were not established by the primary sources inspected.

## 8. Agent features

- **docs-confirmed** — CLI agents can be controlled via tmux: “Devboxes expose a full tmux API, which lets you programmatically manage coding agents like OpenAI Codex or Claude Code.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Token scopes include secrets: “`devbox:secrets:read`” and “`devbox:secrets:write`”. [Agent tokens](https://cloud.morph.so/docs/devboxes/agent-tokens)
- **inferred** — This is an environment and agent-control surface, not evidence that a hosted model or agent subscription is included; see Devboxes and agent-token pages above.

## 9. Accounts and administration

- **docs-confirmed** — Devboxes support organizations: “devboxes are shareable live via URL to anyone in your Morph Cloud organization, and you can create multiple organizations as needed.” [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — There is an SSH-key audit endpoint: “Audit organization SSH public-key access”. [API](https://cloud.morph.so/docs/api-reference/list-organization-managed-ssh-keys)
- **inferred** — An SSH-key audit endpoint is not evidence of comprehensive activity audit logs. Evidence: the endpoint above.
- **not-published** — Comprehensive API-key scopes, hard spend caps, SSO, full audit coverage and data residency guarantees were not established.

## 10. Pricing and costs

- **pricing-page** — “One MCU represents any of the following resource combinations:” followed by “1 vCPU-hour”, “4 GB RAM-hours”, “16 GB disk-hours”, or “5 TB snapshot-hours”; its example uses “standard MCU rate of $0.05”. [Pricing](https://cloud.morph.so/web/subscribe)
- **pricing-page** — Devbox resource meter: “MCUs = max(vCPUs, ceil(RAM/4GiB), ceil(disk/16GiB))”. [Pricing](https://cloud.morph.so/web/subscribe)
- **docs-confirmed** — For supported instances, the documentation explicitly adds a minimum: `max(1, vCPUs, ceil(memory_MiB / 4096), ceil(disk_size_MiB / 16384))`. [Disk capacity](https://cloud.morph.so/docs/documentation/instances/resize-disk)
- **pricing-page** — Developer, Team and Scale monthly fees are “$0 / month”, “$40 / month”, “$250 / month”; starting allocations are “0 MCUs”, “1000 MCUs”, “7500 MCUs”. [Pricing](https://cloud.morph.so/web/subscribe) (Rendered pricing page; prices are not in the initial HTML.)
- **pricing-page** — On Developer: “Purchase MCUs to use compute”. [Pricing](https://cloud.morph.so/web/subscribe)
- **pricing-page** — Overage: “Additional credits billed pay-as-you-go”. [Pricing](https://cloud.morph.so/web/subscribe)
- **docs-confirmed** — During pause: “You only get charged for the snapshot taken”. [Pause](https://cloud.morph.so/docs/documentation/instances/pause-resume)
- **docs-confirmed** — Separate object-storage rate: “Current runtime price: `$0.0054794/GiB-hour`” and “Approximate monthly equivalent: `~$4.00/GiB-month`”. [Volumes](https://cloud.morph.so/docs/volumes/getting-started)
- **inferred** — At the stated $0.05 per MCU and assuming 1 TB = 1,000 GB, 5 TB snapshot-hours gives $0.00001 per GB-hour. Binary vs decimal units and the provider's measured snapshot size could change the actual calculation; evidence is the pricing page above.
- **not-published** — Per-task billing granularity, minimum billable duration, snapshot allocation versus actual-byte accounting, plan credit rollover, taxes, network charges and whether branch-created hidden snapshots incur separate storage charges are unresolved. Do not treat unlisted charges as zero.

## 11. Worked examples

All three are **inferred**, not invoices. Evidence: the pricing-page MCU formula and standard $0.05 rate and the instance meter in §10. Assume exact resource sizes can be provisioned, pay-as-you-go, continuous proportional billing, no taxes, egress, retained base snapshots or separate volumes; unverified rounding and additional costs are excluded. GB/GiB and snapshot size are assumptions, not verified billing policy.

- **inferred** — A: 1,000 × 10/60 = 166.67 hours. Assume disk ≤32 GiB, so max(2, ceil(4/4), ceil(disk/16)) = 2 MCU/hour. 333.33 MCU × $0.05 = **$16.67**, excluding any retained snapshots. Disk was not specified; a larger disk can raise the price.
- **inferred** — B: max(4, ceil(8/4), ceil(50/16)) = 4 MCU/hour. 730 × 4 × $0.05 = **$146.00**. A prepaid plan might change the final bill; this is list-rate usage only.
- **inferred** — C running: max(2, ceil(4/4), ceil(20/16)) = 2 MCU/hour. 90 × 2 × $0.05 = **$9.00**. If paused for 630 hours, and the billable snapshot is exactly 4 + 20 = 24 decimal GB with 5 TB = 5,000 GB, storage is 24 × 630 × $0.00001 = **$0.1512**, for **$9.1512** total before unknown charges. Actual snapshot size and counting are not published here. If stopped instead, the instance cost for the other 630 hours is zero but its running state is lost; any retained snapshot or volume remains separately chargeable.

## 12. Same word, different meaning

- **inferred** — Snapshot can mean a RAM-plus-disk checkpoint, not merely a disk backup; booting that same snapshot deliberately discards its in-memory state. Evidence: snapshot and boot pages in §4.
- **inferred** — Stop means release rather than a cheap parked machine retaining its own state; pause is the state-preserving option. Evidence: pause and TTL pages in §3.
- **inferred** — Volume here can mean S3 object storage rather than a mounted POSIX disk; EFS is a separate filesystem. Evidence: Volumes and disk-capacity pages in §4.
- **inferred** — Free is a $0 plan, not necessarily free compute. Evidence: the pricing page's zero credits and top-up instruction in §10, subject to the conflicting signup page in §14.

## 13. Glossary candidates

- **inferred** — MCU: bundled resource-hour accounting unit whose largest resource dimension determines the running rate; snapshot storage is another conversion. Evidence: pricing page and instance formula in §10.
- **inferred** — Branch: a new instance created from a point-in-time machine checkpoint, not a Git branch. Evidence: branch and snapshot docs in §4.
- **inferred** — Snapshot TTL: retention since last use; instance TTL: time until stop or pause. Evidence: the two TTL pages in §§3–4.
- **inferred** — Cold boot: restart the OS from saved disk rather than resume RAM and processes. Evidence: boot page in §4.

## 14. Gaps, contradictions and Battleships cross-check

- **docs-confirmed** — Signup docs promise a free allocation: “Once you have your invite, our $0/month Developer Plan provides 300 free compute hours per month”. [Signing up](https://cloud.morph.so/docs/documentation/setup/signing-up)
- **pricing-page** — Pricing instead states “0 MCUs” and “Purchase MCUs to use compute”. [Pricing](https://cloud.morph.so/web/subscribe)
- **inferred** — These primary sources conflict; do not promise either a 300-hour trial or no promotional credits without asking Morph. An invite is mentioned but a present-day waitlist requirement is not proven. Evidence: signup and pricing quotations immediately above.
- **third-party** — Battleships repeats “No free credit: Developer tier starts at 0 MCU.” [Battleships Markdown](https://battleships.dev/data/providers/morph-cloud.md)
- **inferred** — Battleships aligns with the pricing page but omits the conflicting 300-hour signup promise. Evidence: the three quotations immediately above.
- **third-party** — Battleships lists “live resize” among its No features. [Battleships Markdown](https://battleships.dev/data/providers/morph-cloud.md)
- **docs-confirmed** — Morph's page describes a limited live disk feature: “Live disk resize changes a supported native instance's usable ext4 root filesystem capacity without rebooting.” [Live disk capacity](https://cloud.morph.so/docs/documentation/instances/resize-disk)
- **docs-confirmed** — Availability is uncertain: “These API, Python SDK, and CLI examples do not announce current availability or a released package version.” [Changelog](https://cloud.morph.so/docs/changelog)
- **inferred** — Battleships' blanket no needs qualification: eligible live disk capacity is documented as preview/candidate, while general CPU/RAM live resize is not established. Evidence: the three bullets above.
- **third-party** — Battleships lists “browser” among its No features but “desktop GUI” among its Yes features. [Battleships Markdown](https://battleships.dev/data/providers/morph-cloud.md)
- **inferred** — That no may mean no managed browser product, not inability to run Chrome: Morph's own Chrome example is in §7. Evidence: Battleships and snapshot setup.
- **third-party** — Battleships says “Snapshot size = RAM + disk”. [Battleships Markdown](https://battleships.dev/data/providers/morph-cloud.md)
- **inferred** — Capturing RAM and disk does not prove billed bytes equal allocated RAM plus allocated disk; this estimate requires provider confirmation. Evidence: snapshot and pricing sources in §§4 and 10.
- **third-party** — Battleships classifies the isolation in its JSON as `"isolation": "vm"`. [Battleships JSON](https://battleships.dev/data/providers/morph-cloud.json)
- **inferred** — VM classification agrees with Morph's Devbox description (§2); the exact hypervisor remains unverified. Battleships' unsupported/no flags are leads, not independent proof of absence.
- **inferred** — Battleships' EFS price is not a substitute for Morph Volumes' object-storage rate; the two are distinct products. Evidence: Battleships Markdown and Morph Volumes quotation in §10.

## 15. Non-technical usability

- **docs-confirmed** — A dashboard workflow exists: “Create a devbox from a template (or a snapshot)” and “Open in VSCode”. [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **inferred** — A dashboard can create a workspace without writing API code, but actually using or setting up the environment may still require technical skills; the dashboard instructions above do not establish a no-code agent experience.
- **docs-confirmed** — First-run guidance explicitly asks users to install tooling and set a key: “Install the SDK (or CLI)” and “Set your API key”. [First success](https://cloud.morph.so/docs/start-here/first-success)
- **not-published** — Card requirement, whether invitations are currently required, trial expiration, what happens when credits run out, support response commitments and an independent status page were not verified. The free-credit conflict is in §14.
- **inferred** — The most likely surprises are the zero-credit/300-hour contradiction, paid snapshots after pausing, distinct boot and start actions, and separately billed object storage. Evidence: §§3, 4, 10 and 14.

## 16. Concept examples for the guide

- **inferred** — Pause: RAM-and-process-preserving suspension with snapshot storage charges; evidence: [pause](https://cloud.morph.so/docs/documentation/instances/pause-resume), quoted in §3.
- **inferred** — Stop: release the instance rather than retain a paused execution; evidence: [TTL](https://cloud.morph.so/docs/documentation/instances/ttl), quoted in §3.
- **inferred** — Snapshot: immutable memory-and-disk checkpoint; evidence: [snapshots](https://cloud.morph.so/docs/documentation/instances/creating-snapshot), quoted in §4.
- **inferred** — Fork: a synchronous snapshot creates multiple new instances; evidence: [branch](https://cloud.morph.so/docs/documentation/instances/branch) and [branch API](https://cloud.morph.so/docs/api-reference/branch-instance-instance-instance-id-branch-post), quoted in §4.
- **inferred** — Persistent storage: separately accessed S3-compatible objects, not necessarily an attached disk; evidence: [volumes](https://cloud.morph.so/docs/volumes/getting-started), quoted in §4.
- **inferred** — Isolation: full VM, including nested-container workloads; evidence: [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started), quoted in §2.
- **inferred** — Billing meter: maximum of resource dimensions rather than adding CPU, memory and disk line items; evidence: [pricing](https://cloud.morph.so/web/subscribe), quoted in §10.
- **inferred** — Trial: conflicting primary descriptions show why a free plan is not the same as guaranteed free usage; evidence: [signup](https://cloud.morph.so/docs/documentation/setup/signing-up) and [pricing](https://cloud.morph.so/web/subscribe), quoted in §14.
- **inferred** — Secrets: a template-integrated manager and scoped agent tokens, with proxy semantics unverified; evidence: [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started) and [agent tokens](https://cloud.morph.so/docs/devboxes/agent-tokens), quoted in §§6 and 8.

## Research process and limitations

Context.dev search returned no results for the first query; Context.dev live scrapes succeeded for the pricing page, Battleships Markdown and several documentation pages. TinyFish search through the active Composio connection succeeded. Direct public `curl` fetched Morph's complete documentation export and Battleships JSON for detailed inspection and live quote checking. No Morph signup, sandbox launch or billing action was performed. No assertion that an endpoint was tested with a Morph account is implied.
