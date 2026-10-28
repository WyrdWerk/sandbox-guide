# Vercel Sandbox: desk research

Research date: 2026-10-28. Scope: public information, not a product test. No account, sandbox or paid Vercel resources were created. Quotes are evidence, not endorsements. Each evidence bullet has one classification; interpretations identify the evidence they rely on. “Not-published” means not located in the sources examined, not proof that a capability cannot exist.

## 1. What it is and who it is for

- **docs-confirmed** — [Sandbox overview](https://vercel.com/docs/sandbox): “Run untrusted or agent-generated code in isolated Linux microVMs. Use Vercel Sandbox for agent workflows, debugging, and one-off commands.”
- **inferred** — From the overview and [concepts](https://vercel.com/docs/sandbox/concepts), this is a programmable execution environment for developers building tools for agents, rather than a consumer desktop. Vercel's other platform products are distinct from Sandbox; don't confuse its account plan with a dedicated Sandbox subscription.

## 2. Isolation and privileges

- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “Unlike Docker containers, each sandbox runs in its own Firecracker microVM with a dedicated kernel.”
- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “Provides full root access to install any package or binary”.
- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “Container runtimes: Run Docker and other container engines inside the sandbox to build images or run containerized workloads.”
- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “FUSE filesystems: Mount Filesystem in Userspace (FUSE) drivers to attach object storage, network filesystems, or other custom mounts.”
- **not-published** — Exact systemd support, nested virtualization availability, and a complete supported kernel-feature list were not established from Vercel's documentation examined here. Root inside the guest does not establish host control or every kernel feature.
- **inferred** — The microVM boundary and guest root evidence above describe a stronger isolation boundary than a shared-kernel container, not a promise that escapes are impossible.

## 3. Lifecycle, survival and timing

- **docs-confirmed** — [SDK status](https://vercel.com/docs/sandbox/sdk-reference#status): “Returns: `"pending" | "running" | "stopping" | "stopped" | "failed"`.” These are session statuses; snapshot statuses are separate.
- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “Sandboxes automatically stop after a timeout. The default timeout is 5 minutes”.
- **pricing-page** — [Runtime limits](https://vercel.com/docs/sandbox/pricing#runtime-limits): “The maximum duration applies to a single session, not to the sandbox itself.” The same page's table gives Hobby 45 minutes; Pro and Enterprise 24 hours per session.
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes): “Persistent sandboxes automatically save their filesystem state when stopped and restore it when resumed.”
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes): “Non-persistent sandboxes discard their filesystem when the session stops and don't accrue Snapshot Storage costs.”
- **inferred** — In `pending` the VM is starting; `running` is the live session; `stopping` is the transition to shutdown; `stopped` is not a running VM; `failed` is an unsuccessful state. Persistence and snapshot documentation describe filesystem restoration into a *new* session, not preservation of RAM or live processes. Restart background services using the documented `onResume` hook. A separately mounted drive survives independently; its data is not merely a subfolder of the snapshot.
- **not-published** — No idle-activity-triggered auto-stop or precise start/resume latency guarantee was found. A wall-clock timeout is not an inactivity timer. No per-status compute billing rule was located for pending, stopping, or failed transitions.
- **docs-confirmed** — [Overview](https://vercel.com/docs/sandbox): “Sandboxes start in milliseconds, making them ideal for real-time user interactions and latency-sensitive workloads.”
- **inferred** — That is a broad provider claim, not a measured percentile or SLA; [snapshots](https://vercel.com/docs/sandbox/concepts/snapshots) cautions that uncached restores take longer.

## 4. Snapshots, forks, images and drives

- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “You can also snapshot a running sandbox at any time by calling `snapshot()`, which captures its current filesystem before stopping the session.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “Snapshots outlive the sandbox they came from.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots#snapshot-states): “The snapshot is captured and ready to create or resume sandboxes from.” The page names the other snapshot states `deleted` and `failed`.
- **docs-confirmed** — [Fork API](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork): “If the source has no current snapshot, the fork falls back to a fresh create with the source's `image` plus the copied config.”
- **inferred** — The [fork API](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork) uses the current saved snapshot, not an assured copy of the running process or latest unsaved filesystem writes. Manual snapshotting stops the source. Verify this distinction before calling it a live fork.
- **docs-confirmed** — [Drives](https://vercel.com/docs/sandbox/concepts/drives): “Only one sandbox at a time can mount a given drive as read-write: use snapshots for shared access.”
- **docs-confirmed** — [Drives](https://vercel.com/docs/sandbox/concepts/drives): “Each snapshot mount reflects the drive as it was at the moment you mounted it, and does not include any writes made to the drive thereafter.”
- **docs-confirmed** — [Images](https://vercel.com/docs/sandbox/concepts/images): “Vercel Sandbox does not run Docker `ENTRYPOINT` or `CMD` for custom images.”
- **inferred** — From [images](https://vercel.com/docs/sandbox/concepts/images) and [drives](https://vercel.com/docs/sandbox/concepts/drives), a managed or custom image supplies a starting filesystem; a sandbox snapshot saves a full sandbox filesystem; a drive is a separately retained mounted directory. These are not interchangeable, and a Docker image does not mean the Docker entrypoint runs automatically.
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “Snapshots can't be moved between regions.” The page describes a failover exception for loading a snapshot into a failover region.
- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#snapshot-expiration): “Snapshots expire 30 days after their last use by default.” Expiration can be changed or removed.

## 5. Sizes, GPU, architecture and regions

- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#active-cpu): “You can provision 1 or an even number of vCPUs between 2 and 32 depending on your plan.”
- **pricing-page** — [Resource limits](https://vercel.com/docs/sandbox/pricing#resource-limits): “Each vCPU includes 2 GB of memory.” The plan table lists max 4 vCPUs/8 GB Hobby, 8/16 Pro, 32/64 Enterprise; 15 open ports each; current images get 64 GB ephemeral disk, deprecated runtimes 32 GB.
- **pricing-page** — [Regions](https://vercel.com/docs/sandbox/pricing#regions): “Vercel Sandbox is available in 19 regions. The default region is `iad1`.”
- **not-published** — A Sandbox GPU offering, ARM64 availability, and a complete CPU architecture guarantee were not established in the provider pages reviewed. Do not infer a negative solely from absence.

## 6. Networking and secrets

- **docs-confirmed** — [SDK](https://vercel.com/docs/sandbox/sdk-reference#sandbox.create): “Firewall rules for sandbox egress traffic. Defaults to `"allow-all"`.”
- **docs-confirmed** — [Firewall](https://vercel.com/docs/sandbox/concepts/firewall#credentials-brokering): “Credentials brokering injects credentials into egressing traffic. The secrets never enter the sandbox, so code running inside it cannot exfiltrate them.”
- **docs-confirmed** — [Firewall](https://vercel.com/docs/sandbox/concepts/firewall): “Matchers select requests for transformation. They never block a request.”
- **inferred** — These firewall sources distinguish proxy-injected credentials from ordinary environment variables visible to guest code. Matchers alone are not an egress deny rule; permitted destinations and permissions still matter.
- **docs-confirmed** — [Secure Compute](https://vercel.com/docs/sandbox/concepts/secure-compute#pricing): “Traffic sent over VPC peering with your AWS environment does not incur data transfer charges.” The same page describes separately billed internet traffic through the private network.
- **pricing-page** — [Networking](https://vercel.com/docs/sandbox/pricing#network): “Data your sandbox sends to the internet, plus all traffic to and from exposed ports, is billable and measured in GB.”
- **not-published** — A general raw inbound TCP, personal SSH, or direct public IPv4 interface was not confirmed here. Exposed web ports do not by themselves establish any of those interfaces.

## 7. Interfaces

- **docs-confirmed** — [Overview](https://vercel.com/docs/sandbox): “Manage sandboxes through the CLI, JS SDK, or Python SDK. Automate sandbox workflows in your application.”
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes#managing-persistent-sandboxes-in-the-dashboard): “From the dashboard you can stop the current session or permanently remove the sandbox.”
- **not-published** — A dedicated Sandbox desktop GUI, graphical browser, SSH endpoint, and Sandbox-specific webhook interface were not established in the sources reviewed. A Vercel MCP integration is not automatically proof of every Sandbox operation being available through MCP.

## 8. Agent features

- **docs-confirmed** — [Overview](https://vercel.com/docs/sandbox): “The default image is `vercel/sandbox/universal`, which includes the current Node.js LTS, Python 3.14, coding agents, and common utilities.”
- **inferred** — The [overview](https://vercel.com/docs/sandbox) describes agent-ready execution and preinstalled tools; that is different from an autonomous hosted agent service or a built-in graphical computer-use environment.

## 9. Accounts and governance

- **docs-confirmed** — [Pro plan](https://vercel.com/docs/plans/pro-plan#team-seats): “Unlimited free Viewer seats with read-only access”.
- **docs-confirmed** — [Pro plan](https://vercel.com/docs/plans/pro-plan#paid-add-ons): “SAML Single Sign-On: $300/month”.
- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#pro): “To control costs, configure Spend Management to receive alerts or pause projects when you reach a specified amount.”
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes#managing-persistent-sandboxes-in-the-dashboard): “Activity: A log of sandbox lifecycle events.”
- **inferred** — A lifecycle activity log is not evidence of a comprehensive compliance audit log. Region selection and the snapshot regional rules above are not a blanket legal data-residency guarantee.
- **not-published** — Fine-grained Sandbox-only API-key scopes, complete audit coverage, and contractual residency guarantees were not established in the sources examined.

## 10. Pricing, plans and meters

- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Sandbox Active CPU | 5 hours/month | $0.128/hour | $0.128/hour”. Columns are Hobby included, Pro, Enterprise; these are default-region rates.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Sandbox Provisioned Memory | 420 GB-hours/month | $0.0212/GB-hour | $0.0212/GB-hour”.
- **pricing-page** — [CPU](https://vercel.com/docs/sandbox/pricing#active-cpu): “Time spent waiting for I/O (such as network requests, database queries, or AI model calls) does not count toward Active CPU.”
- **pricing-page** — [Memory](https://vercel.com/docs/sandbox/pricing#provisioned-memory): “Provisioned memory is billed in 1 minute minimum increments to account for sandbox lifecycle management.”
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Sandbox Creations | 5,000/month | $0.60/1M | $0.60/1M”.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Sandbox Data Transfer | 20 GB/month | Included in Flat Rate CDN | $0.15/GB”.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Snapshot Storage | 15 GB (lifetime) | $0.08/GB-month | $0.08/GB-month”.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Drive Storage | 15 GB (lifetime) | $0.05/GB-month | $0.05/GB-month”.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Drive Reads | 30 GB/month | $0.0015/GB | $0.0015/GB”.
- **pricing-page** — [Pricing table](https://vercel.com/docs/sandbox/pricing#pricing): “Drive Writes | 30 GB/month | $0.004/GB | $0.004/GB”.
- **pricing-page** — [Drive storage](https://vercel.com/docs/sandbox/pricing#drive-storage): “Storage is measured hourly on the logical used size of each drive, not the size you provisioned, and billed for the hours the data is stored.”
- **pricing-page** — [Hobby](https://vercel.com/docs/sandbox/pricing#hobby): “Once you exceed the quotas, sandbox creation is paused until 30 days have passed since you first used the feature.” The introductory text instead says until the next billing cycle; exact reset timing needs clarification.
- **pricing-page** — [Pro](https://vercel.com/docs/sandbox/pricing#pro): “All Sandbox usage on Pro plans is charged against your $20/month credit. After the credit is exhausted, usage is billed at the rates shown above.”
- **docs-confirmed** — [Pro fee](https://vercel.com/docs/plans/pro-plan#platform-fee): “$20/month Pro platform fee”. The same page says one deploying seat and $20/month usage credit are included; the credit is shared with other infrastructure and expires.
- **pricing-page** — [Enterprise](https://vercel.com/docs/sandbox/pricing#enterprise): “Enterprise plans have custom pricing and quotas.” Treat the public rate table as indicative and the signed contract as controlling.
- **pricing-page** — [Regional pricing](https://vercel.com/docs/sandbox/pricing#regional-pricing): “Rates for Active CPU, Provisioned Memory, Sandbox Data Transfer, Drive Storage, Drive Reads, and Drive Writes vary by region.” Creations and snapshot storage are stated to have a common rate.
- **inferred** — The pricing page renders the selected `iad1` values in the retrieved live text, but other regions require interaction with its selector. The Battleships regional table is a useful secondary cross-check, not independently verified provider prices. Do not silently apply iad1 rates globally.
- **docs-confirmed** — [Overview](https://vercel.com/docs/sandbox): “Stop a sandbox when work is done to end CPU and memory charges.”
- **not-published** — CPU metering granularity, a universal CPU minimum, exact startup/shutdown billing boundaries, and every non-default regional rate were not verified. Snapshot and drive charges can continue while compute is stopped, and delete does not imply snapshot deletion.

## 11. Worked estimates

- **inferred** — All calculations below use the published `iad1` Pro rates in section 10, a hypothetical 10% average CPU utilization (the assumption in Vercel's [pricing examples](https://vercel.com/docs/sandbox/pricing#example-calculations)), no other Vercel usage, no taxes, no transfer or drive I/O, and no discounts. They are illustrations, not complete invoices. Vercel says GB and the request says GiB; these examples assume the listed 2 vCPU/4 GB and 4 vCPU/8 GB configurations are the intended nearest sizes rather than asserting a unit conversion guarantee.
- **inferred** — A: 1,000 × 10 minutes = 166.667 running hours. Memory = 4 × 166.667 × $0.0212 = $14.1333. CPU = 2 × 166.667 × 10% × $0.128 = $4.2667. Creations = 1,000 × $0.60 / 1,000,000 = $0.0006. Total = **$18.4006 before credit**, approximately $0 incremental compute/creation after an otherwise unused $20 shared credit, plus the $20 platform fee. Explicitly opt out of persistence to avoid automatic snapshot charges; otherwise deleting each sandbox does not delete its snapshots.
- **inferred** — B: One uninterrupted 730-hour session is **not possible** under the published 24-hour Pro/Enterprise per-session limit. As a non-continuous, optimistic 730-hour running-equivalent comparison: memory = 8 × 730 × $0.0212 = $123.808; CPU = 4 × 730 × 10% × $0.128 = $37.376; total = **$161.184 before credit**, plus creation, snapshot storage, restart gaps and other extras. After an otherwise unused $20 credit, usage overage is $141.184 plus the $20 platform fee. Requested 50 GiB is not the configurable ephemeral disk size established here: the standard filesystem is 64 GB. If 50 GB is instead *used* on a separate drive throughout a month, add approximately $2.50 plus reads/writes; if it means a disk capacity rather than stored data, storage cost is not determined by that capacity.
- **inferred** — C: 30 × 3 = 90 running hours, 630 stopped hours. Memory = 4 × 90 × $0.0212 = $7.632; CPU = 2 × 90 × 10% × $0.128 = $2.304; compute = **$9.936 before credit**, plus creation. If 20 GB is *used data* on a separate drive for all 720 hours, add approximately $1.00/month plus reads/writes; if 20 GiB is capacity only, used size is unknown. If retaining the sandbox filesystem as snapshots instead, size and retention determine additional charges; 30 stops can create 30 snapshots unless retention limits them. No CPU/memory is charged while stopped according to section 10, but stored data remains billable. On Pro, an otherwise unused $20 credit covers the stated $10.936 plus tiny creation fee; the $20 platform fee remains.
- **inferred** — Actual active CPU can differ materially from 10%; for A the compute range at 0%–100% CPU is $14.1333–$56.8 before creation and extras. Neither workload duration nor vCPU count alone determines active CPU usage.

## 12. Same word, different meaning

- **inferred** — From [persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes), “resume” means starting a new VM session from saved files, not continuing RAM and processes.
- **inferred** — From [snapshots](https://vercel.com/docs/sandbox/concepts/snapshots) and [drives](https://vercel.com/docs/sandbox/concepts/drives), sandbox snapshots and drive snapshot mounts both describe point-in-time files but have different scope and sharing behavior.
- **inferred** — From [fork](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork), “fork” means a new sandbox seeded from a saved snapshot/configuration, not necessarily a copy of current live execution.
- **inferred** — From [CPU pricing](https://vercel.com/docs/sandbox/pricing#active-cpu), “active CPU hours” are consumed CPU time across cores, not simply elapsed time while a VM is running.

## 13. Glossary candidates

- **inferred** — Based on the sources in sections 3–10: microVM; guest kernel; sandbox versus session; persistence; filesystem snapshot; snapshot retention; drive; read-only snapshot mount; vCPU; active CPU; provisioned memory; egress; exposed port; credentials brokering; monthly usage credit; regional pricing; timeout versus idle timeout.

## 14. Gaps, contradictions and cross-check

- **third-party** — [Battleships JSON](https://battleships.dev/data/providers/vercel-sandbox.json): “\"fork_running\": true”.
- **third-party** — [Battleships Markdown](https://battleships.dev/data/providers/vercel-sandbox.md): “Fork semantics: Sandbox.fork() of a running source forks its latest saved snapshot, not live memory”.
- **inferred** — These two descriptions can be read differently: forking while the source is running is not necessarily cloning its current live state. Vercel's [fork API](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork) says current snapshot or fresh image fallback. The Markdown's live-fork feature label can mislead; it is not proof that live writes or RAM are copied.
- **third-party** — [Battleships Markdown](https://battleships.dev/data/providers/vercel-sandbox.md): “automatic persistence may be free.”
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes): “Each automatic snapshot consumes Snapshot Storage, which is billed separately from compute.”
- **inferred** — The live docs resolve the Markdown's earlier uncertainty in favor of billed automatic snapshots, subject to plan allowances. Battleships itself notes it conservatively models them as billed.
- **third-party** — [Battleships Markdown](https://battleships.dev/data/providers/vercel-sandbox.md): “usage per sandbox (API)”. This appears in its “No” list.
- **docs-confirmed** — [SDK](https://vercel.com/docs/sandbox/sdk-reference#totaldurationms-totalactivecpudurationms-totalingressbytes-totalegressbytes): “Cumulative usage across every session this sandbox has run.”
- **inferred** — The SDK exposes cumulative usage counters; whether they constitute a complete billing/usage API is a narrower unresolved question. Battleships' blanket negative risks obscuring those counters.
- **third-party** — [Battleships Markdown](https://battleships.dev/data/providers/vercel-sandbox.md): “Engine applies min_billed_seconds=60 to CPU as well as memory”.
- **inferred** — Battleships acknowledges its calculator may overestimate short-task CPU; the [pricing page](https://vercel.com/docs/sandbox/pricing#provisioned-memory) specifies the minimum for memory. Its data also supplies region rates that were not independently verified against each live selector state here.
- **inferred** — Current [Hobby pricing](https://vercel.com/docs/sandbox/pricing#hobby) uses both billing-cycle and 30-days-since-first-use language; confirm the exact reset rule with Vercel before presenting it as a calendar-month guarantee.

## 15. Non-technical usability

- **docs-confirmed** — [Hobby plan](https://vercel.com/docs/plans/hobby): “the Hobby plan restricts users to non-commercial, personal use only.”
- **docs-confirmed** — [Hobby plan](https://vercel.com/docs/plans/hobby): “Unlock the full potential of Vercel Pro during your 14-day trial with $20 in credits.”
- **inferred** — A free Hobby allotment and a time-limited Pro trial are different things: the quota and restrictions in section 10 apply to Hobby; the trial's post-expiry treatment and billing requirements should be checked before signup.
- **inferred** — The dashboard described in section 7 supports inspection and stop/delete; the documented CLI/SDK workflows and agent configuration imply a technical setup burden. The dashboard evidence does not establish a complete no-code agent-building workflow.
- **not-published** — Whether a credit card is required for each signup/trial path, whether a waitlist applies, what happens at trial expiry for every signup path, and exact support entitlements were not verified. Do not infer “no card” from a free plan.

## 16. Concept examples for the guide

- **inferred** — Pause: filesystem-backed restart, not proven RAM freeze ([persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes)).
- **inferred** — Stop: end a session; persistent defaults create a billable snapshot ([pricing](https://vercel.com/docs/sandbox/pricing), [persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes)).
- **inferred** — Snapshot: full sandbox filesystem checkpoint, manual capture stops the session ([snapshots](https://vercel.com/docs/sandbox/concepts/snapshots)).
- **inferred** — Fork: new instance from last saved snapshot or fresh image fallback ([SDK](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork)).
- **inferred** — Persistent storage: a separately retained mounted directory, one concurrent writer ([drives](https://vercel.com/docs/sandbox/concepts/drives)).
- **inferred** — Isolation: per-sandbox Firecracker microVM and dedicated kernel ([concepts](https://vercel.com/docs/sandbox/concepts)).
- **inferred** — Billing meter: active CPU plus provisioned-memory wall time ([pricing](https://vercel.com/docs/sandbox/pricing)).
- **inferred** — Trial: free capped personal Hobby differs from time-limited Pro trial ([Hobby](https://vercel.com/docs/plans/hobby), [pricing](https://vercel.com/docs/sandbox/pricing)).
- **inferred** — Secrets: outbound proxy injection can keep credentials out of the guest ([firewall](https://vercel.com/docs/sandbox/concepts/firewall)).

## Research and verification limitations

- **inferred** — Context.dev live search and fresh scrapes, TinyFish Fetch through Composio, and Parallel Search through Composio succeeded. No native Amp web fallback was used. Battleships JSON and Markdown were read as secondary references. The changing regional selector, signup flow, and the exact trial exit were not exercised; no paid Sandbox was started.
- **inferred** — Quote audit: 61 evidence quotations were rechecked against freshly fetched live sources; 60 matched the provider's Markdown or third-party source after removing Markdown formatting, and the remaining trial quote matched the freshly rendered Hobby page via Context.dev, for 61 of 61 matches. This checks quotation text, not every compound claim or product behavior.
