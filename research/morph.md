# Morph Cloud — research for sandbox-guide

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

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

- **docs-confirmed** — The API reports instance statuses `pending`, `ready`, `paused`, `saving`, and `error`: `"enum":["pending","ready","paused","saving","error"]`. These are statuses, not a list of actions. [API](https://cloud.morph.so/docs/api-reference/start-instance-instance-post)
- **not-published** — For `pending`, the inspected documentation does not establish what disk, memory, or processes survive, or whether the status always has the same cause.
- **not-published** — For `ready`, the inspected status schema does not itself establish a guarantee about persistence of disk, memory, or processes across a subsequent failure or lifecycle action.
- **not-published** — For `saving`, the inspected documentation does not establish the survival or consistency guarantees for disk, memory, or processes if saving fails or is interrupted.
- **not-published** — For `error`, the inspected documentation does not establish whether disk, memory, or processes remain recoverable; it may depend on the error.
- **docs-confirmed** — Pause preserves execution state: “Use when you need to preserve the running state of applications, the memory contents, and all processes.” [Pause](https://cloud.morph.so/docs/documentation/instances/pause-resume)
- **docs-confirmed** — Pause creates a snapshot: “We create a new snapshot and suspend the VM”. [Pause](https://cloud.morph.so/docs/documentation/instances/pause-resume) Instance snapshots capture disk as well as memory: “Snapshots are immutable point-in-time copies of both memory and disk state.” [Snapshots](https://cloud.morph.so/docs/documentation/instances/creating-snapshot)
- **docs-confirmed** — Stop releases the instance: “The instance will be completely shut down, and all resources will be released.” [TTL](https://cloud.morph.so/docs/documentation/instances/ttl)
- **docs-confirmed** — Stop is an action that deletes the instance, not a `stopped` status in the listed API enum: “Stop and delete an instance by ID.” [Stop API](https://cloud.morph.so/docs/api-reference/stop-instance-instance-instance-id-delete)
- **not-published** — The inspected stop documentation does not explicitly establish whether the deleted instance's own disk data is retained or recoverable. It does not establish survival of unsnapshotted processes or memory either.
- **inferred** — Do not rely on recovering unsnapshotted data or execution state from a stopped instance; preserve a separate snapshot or external data first. Evidence: stop API and pause documentation above. A separately retained snapshot is distinct from the deleted instance.
- **docs-confirmed** — Configurable reboot preserves disk but restarts: “Under the hood, Morph preserves your on‑disk changes and restarts with the new resources.” [Resize](https://cloud.morph.so/docs/examples/resizing-instances)
- **inferred** — Reboot is an action, not a status from the listed enum. Configurable reboot restarts rather than promising live-process continuity; evidence: resize quotation above and the cold-boot description in §4.
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
- **pricing-page** — Scale lists organization-level limits “Up to 1024 vCPU”, “Up to 4096 GB”, and “Up to 16384 GB”. [Pricing](https://cloud.morph.so/web/subscribe)
- **inferred** — These are plan-wide ceilings, not evidence that a single VM can reach those sizes. Evidence: the resource allocation table on the pricing page above.
- **not-published** — Maximum CPU, RAM and disk per individual VM; GPU availability; ordinary Linux VM architecture; host locations and customer-selectable regions remain unverified. Searched Morph's [docs index](https://cloud.morph.so/docs/llms-full.txt), [pricing](https://cloud.morph.so/web/subscribe), API reference and web search on GPU, x86, architecture and region. The experimental OSX x86 claim in §2 does not establish ordinary host architecture; metadata examples mentioning regions do not establish placement.

## 6. Network and secrets

- **docs-confirmed** — An instance can expose an HTTP service: “Expose Http Service”. [API](https://cloud.morph.so/docs/api-reference/expose-http-service-instance-instance-id-http-post)
- **docs-confirmed** — Devbox templates integrate with a secret manager: “Every devbox is created from a template that integrates with our secrets manager”. [Devboxes](https://cloud.morph.so/docs/devboxes/getting-started)
- **docs-confirmed** — Secret access must be scoped carefully: “Request the smallest scope set that works.” [Agent tokens](https://cloud.morph.so/docs/devboxes/agent-tokens)
- **docs-confirmed** — Outbound connectivity is illustrated, not comprehensively guaranteed: the Claude Code example runs `instance.exec("curl -fsSL https://claude.ai/install.sh | sh")`. [Claude Code example](https://cloud.morph.so/docs/examples/claude-code)
- **inferred** — The external download example is evidence of intended internet access, but not a guarantee of unrestricted ports or destinations. Evidence: the Claude Code example above.
- **docs-confirmed** — The terms say egress can be charged: “Typical components may include but are not limited to compute, snapshot storage, and egress.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **not-published** — Outbound domain/IP allowlists, static egress IP and a per-GB egress price were not found. Searched the [pricing page](https://cloud.morph.so/web/subscribe), [HTTP services](https://cloud.morph.so/docs/documentation/instances/http-services), [docs index](https://cloud.morph.so/docs/llms-full.txt), terms and web search for egress, outbound, allowlist and static IP. Do not assume egress is free.
- **not-published** — Custom-domain support for exposed HTTP services was not found in [HTTP services](https://cloud.morph.so/docs/documentation/instances/http-services), the [API reference](https://cloud.morph.so/docs/api-reference/expose-http-service-instance-instance-id-http-post), the docs index or web search. A Morph-generated public URL is not proof that a buyer can attach their own domain.
- **not-published** — Whether arbitrary third-party credentials are injected without exposure inside the VM was not established; searched Devbox secrets and agent-token docs. A secret manager alone does not prove a secret proxy.

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
- **docs-confirmed** — The terms state “Per-second compute; per-operation Snapshot / Instance charges; snapshot / lineage storage (GB-hour); egress.” [Terms, Exhibit B](https://cloud.morph.so/web/legal/terms-of-service)
- **inferred** — This newly found per-second billing statement corrects the earlier claim that compute granularity was unpublished. The terms mention per-operation charges without listing their amounts; the worked examples remain estimates, not complete invoices. Evidence: the terms quotation above.
- **inferred** — At the stated $0.05 per MCU and assuming 1 TB = 1,000 GB, 5 TB snapshot-hours gives $0.00001 per GB-hour. Binary vs decimal units and the provider's measured snapshot size could change the actual calculation; evidence is the pricing page above.
- **not-published** — Minimum billable duration, per-operation prices, snapshot allocation versus actual-byte accounting, plan credit rollover, applicable taxes, egress rates and whether branch-created hidden snapshots incur separate storage charges are unresolved. Do not treat unlisted charges as zero.

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
- **not-published** — Card requirement, whether invitations are currently required, trial expiration, what happens when credits run out and support response commitments were not verified. The free-credit conflict is in §14; the provider's public status page is in §17.
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

## 17. The company behind it

### Entity, people and capital

- **docs-confirmed** — The terms identify the company as “Morph Labs, Inc.” and give the address “2565 3rd Street, San Francisco, CA 94107, USA”. [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **not-published** — State or country of incorporation and registry number were not established: searched the [terms](https://cloud.morph.so/web/legal/terms-of-service), Morph site and public web for the exact legal name and incorporation. A San Francisco contact address is not proof of incorporation in California.
- **third-party** — Tracxn describes the company as “founded in 2023 by Jesse Han” and lists him as “Founder & CEO of Morph Labs.” [Tracxn](https://tracxn.com/d/companies/morph-labs/__8ZZWlPNWnRct4CJf-JJjU940HzzVxh1CEZxBQBG6tXg)
- **third-party** — RL List reports Christian Szegedy as “Chief Scientist (joined 2025, reported; also reported to be a seed investor). Current status not re-verified in this window.” [RL List](https://www.rl-list.com/vendors/morph)
- **third-party** — Cogniscendo reports “Szegedy had written a 2019 paper proposing autoformalization and was a seed investor in Morph”. [Cogniscendo](https://www.cogniscendo.com/p/the-superhuman-mathematician-5d1b)
- **third-party** — Grokipedia says “Morph Labs raised $5.75 million in seed funding led by Khosla Ventures”. [Grokipedia](https://grokipedia.com/page/Morph_Labs)
- **third-party** — Tracxn contradicts that amount and stage: “Morph Labs has not raised any funding yet.” [Tracxn](https://tracxn.com/d/companies/morph-labs/__8ZZWlPNWnRct4CJf-JJjU940HzzVxh1CEZxBQBG6tXg)
- **inferred** — Funding stage, total amount and Khosla's involvement cannot be treated as verified: the two third-party sources conflict, and the original announcement was not found live. Cogniscendo separately reports Szegedy as a seed investor. Evidence: the three immediately preceding bullets and Battleships' company block, which also flags its estimate.
- **third-party** — RL List estimates “~9-11 employees (as of 2026)”; this is an aggregator estimate, not a company disclosure. [RL List](https://www.rl-list.com/vendors/morph)
- **not-published** — Company-confirmed headcount, a definitive investor list, accelerator participation, and an acquisition or other change in ownership were not established. Searched Morph's site and terms, Tracxn, RL List, Grokipedia, and web searches for funding, accelerator, acquisition and Jesse Han. Absence of a found acquisition is not proof that none occurred.
- **inferred** — Avoid confusing this company with morphllm.com / AutoInfra, Inc.; the trust-portal evidence below makes the distinction material. Evidence: Morph Labs' terms and the AutoInfra trust page below.

### Status, SLA and support

- **docs-confirmed** — The provider's [status page](https://status.cloud.morph.so/) displayed “All services are online” and “100% uptime” for “Morph Cloud API” when checked on 2026-10-28; it also displayed “90 days ago” and “Today” on the chart.
- **inferred** — The chart shows a 90-day timeline, but the displayed percentage's exact calculation, monitoring coverage and exclusions are not explained in the inspected page. It is a point-in-time provider-reported status, not a contractual guarantee; evidence: the status page above.
- **docs-confirmed** — The public terms say “If a separate SLA is attached to the Order, that SLA controls with respect to any service-credit mechanics.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **not-published** — No numeric SLA, uptime target, credit schedule or qualifying plan was found in the public [terms](https://cloud.morph.so/web/legal/terms-of-service), [pricing page](https://cloud.morph.so/web/subscribe), docs index or web search for Morph Cloud SLA. Ask for the applicable order and SLA before relying on one.
- **docs-confirmed** — The terms say “Support levels and response targets (if any) are as set forth in Customer’s Order or the Documentation.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — The terms give the security/data-handling contact: “Questions about data handling or security? Email support@morph.so.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **not-published** — Guaranteed response times or support levels by plan were not found in the public pricing, documentation or terms searched.

### Security, compliance and buyer terms

- **docs-confirmed** — The terms commit to “encryption in transit / at rest; multi-factor authentication for production access; least-privilege access”. [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — The terms say “Upon request, we’ll provide available third-party security attestations (e.g., SOC reports) under appropriate confidentiality.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **third-party** — RL List states “SOC 2 Type 2 is claimed only on the Delve-hosted trust portal (trust.delve.co/morph), which returned 429. Treat it as claimed-unverified.” [RL List](https://www.rl-list.com/vendors/morph)
- **third-party** — The live [Delve portal](https://trust.delve.co/morph) instead identifies its report as “AutoInfra, Inc. SOC 2 Type 2 Report 2025” and its “Privacy Policy” link points to morphllm.com.
- **inferred** — That Delve page belongs to the similarly named AutoInfra/morphllm business, not established as an attestation for Morph Labs, Inc.; do not repeat RL List's SOC 2 claim for Morph Cloud without a report naming the right entity and service. Evidence: both quotations above and Morph Labs' legal name in its terms.
- **not-published** — A verified Morph Labs, Inc. SOC 2 report, other certifications, and a public audit scope were not found after checking the [terms](https://cloud.morph.so/web/legal/terms-of-service), the Delve portal, RL List and searches for Morph Cloud SOC 2. Availability of reports on request is not itself evidence of certification.
- **docs-confirmed** — Price changes ordinarily have notice: “We may update prices with 30 days’ notice by email to Admin Contacts and a dashboard banner.” If increases cross a threshold: “If cumulative increases exceed 15% in a rolling 12-month period, we will give 60 days’ notice.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — An exception applies: “If a third-party provider imposes a surcharge or regulatory fee outside our control, we may adjust affected charges with as much advance notice as practicable.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — The terms restrict sensitive-data uploads: “Upload regulated/sensitive data (for example, PHI, children’s data, cardholder data, export-controlled technical data) without a signed addendum that permits it.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — The restrictions include “Publish public benchmarks without our prior written consent (internal testing is fine).” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — Publicity clause: “to identify Customer as a Morph customer and to use Customer’s name, mark, and / or logo on Morph’s website”. [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **docs-confirmed** — Month-to-month termination is effective “the next billing cycle.” [Terms](https://cloud.morph.so/web/legal/terms-of-service)
- **not-published** — A post-cancellation customer-data export window, deletion deadline and backup retention period were not found in the [public terms](https://cloud.morph.so/web/legal/terms-of-service), the [docs index](https://cloud.morph.so/docs/llms-full.txt), or web search for Morph Cloud cancellation and data deletion. The terms' deletion language for diagnostic artifacts and confidential information does not establish deletion of all customer snapshots after cancellation.
- **inferred** — Buyers should request the signed order, SLA, current data-processing and deletion terms, applicable security report and egress pricing before relying on these provisions. Evidence: the terms and missing details above; this is not legal advice.

## Research process and limitations

Context.dev search returned no results for the first query; Context.dev live scrapes succeeded for the pricing page, Battleships Markdown and several documentation pages. TinyFish search through the active Composio connection succeeded. Direct public `curl` fetched Morph's complete documentation export and Battleships JSON for detailed inspection and live quote checking. No Morph signup, sandbox launch or billing action was performed. No assertion that an endpoint was tested with a Morph account is implied.

For the 2026-10-28 company and policy pass, Context search and fresh scrapes, TinyFish search via Composio, and direct public HTTP retrieval succeeded. All 35 newly added quote occurrences matched live sources: 29 prose quotations in §17, five prose quotations in §§5–6 and 10, and one code excerpt in §6. Some required Context's fresh rendered Markdown because direct HTML extraction was inaccessible or split formatting. The status figure is time-sensitive. No Morph account or service was used.
