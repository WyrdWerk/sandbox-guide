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

- **docs-confirmed** — [SDK status](https://vercel.com/docs/sandbox/sdk-reference#status): “The `status` accessor reports the lifecycle state of the current session.”
- **docs-confirmed** — [SDK status](https://vercel.com/docs/sandbox/sdk-reference#status): “Returns: `"pending" | "running" | "stopping" | "stopped" | "failed"`.”
- **docs-confirmed** — [Concepts](https://vercel.com/docs/sandbox/concepts): “Sandboxes automatically stop after a timeout. The default timeout is 5 minutes”.
- **pricing-page** — [Runtime limits](https://vercel.com/docs/sandbox/pricing#runtime-limits): “The maximum duration applies to a single session, not to the sandbox itself.”
- **pricing-page** — [Runtime limits table](https://vercel.com/docs/sandbox/pricing#runtime-limits), plan and maximum session duration: “Hobby | 45 minutes”.
- **pricing-page** — [Runtime limits table](https://vercel.com/docs/sandbox/pricing#runtime-limits), plan and maximum session duration: “Pro | 24 hours”.
- **pricing-page** — [Runtime limits table](https://vercel.com/docs/sandbox/pricing#runtime-limits), plan and maximum session duration: “Enterprise | 24 hours”.
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes): “Persistent sandboxes automatically save their filesystem state when stopped and restore it when resumed.”
- **docs-confirmed** — [Persistence](https://vercel.com/docs/sandbox/concepts/persistent-sandboxes): “Non-persistent sandboxes discard their filesystem when the session stops and don't accrue Snapshot Storage costs.”
- **inferred** — In `pending` the VM is starting; `running` is the live session; `stopping` is the transition to shutdown; `stopped` is not a running VM; `failed` is an unsuccessful state. Persistence and snapshot documentation describe filesystem restoration into a *new* session, not preservation of RAM or live processes. Restart background services using the documented `onResume` hook. A separately mounted drive survives independently; its data is not merely a subfolder of the snapshot.
- **not-published** — No idle-activity-triggered auto-stop or precise start/resume latency guarantee was found. A wall-clock timeout is not an inactivity timer. No per-status compute billing rule was located for pending, stopping, or failed transitions.
- **docs-confirmed** — [Overview](https://vercel.com/docs/sandbox): “Sandboxes start in milliseconds, making them ideal for real-time user interactions and latency-sensitive workloads.”
- **inferred** — That is a broad provider claim, not a measured percentile or SLA; [snapshots](https://vercel.com/docs/sandbox/concepts/snapshots) cautions that uncached restores take longer.

## 4. Snapshots, forks, images and drives

- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “You can also snapshot a running sandbox at any time by calling `snapshot()`, which captures its current filesystem before stopping the session.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “Snapshots outlive the sandbox they came from.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots#snapshot-states): “created | The snapshot is captured and ready to create or resume sandboxes from.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots#snapshot-states): “deleted | The snapshot was removed, either because you called `delete()` or because it reached its expiration.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots#snapshot-states): “failed | The capture didn't complete, so the snapshot can't be used. Take a new snapshot to retry.”
- **docs-confirmed** — [Fork API](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork): “If the source has no current snapshot, the fork falls back to a fresh create with the source's `image` plus the copied config.”
- **inferred** — The [fork API](https://vercel.com/docs/sandbox/sdk-reference#sandbox.fork) uses the current saved snapshot, not an assured copy of the running process or latest unsaved filesystem writes. Manual snapshotting stops the source. Verify this distinction before calling it a live fork.
- **docs-confirmed** — [Drives](https://vercel.com/docs/sandbox/concepts/drives): “Only one sandbox at a time can mount a given drive as read-write: use snapshots for shared access.”
- **docs-confirmed** — [Drives](https://vercel.com/docs/sandbox/concepts/drives): “Each snapshot mount reflects the drive as it was at the moment you mounted it, and does not include any writes made to the drive thereafter.”
- **docs-confirmed** — [Images](https://vercel.com/docs/sandbox/concepts/images): “Vercel Sandbox does not run Docker `ENTRYPOINT` or `CMD` for custom images.”
- **inferred** — From [images](https://vercel.com/docs/sandbox/concepts/images) and [drives](https://vercel.com/docs/sandbox/concepts/drives), a managed or custom image supplies a starting filesystem; a sandbox snapshot saves a full sandbox filesystem; a drive is a separately retained mounted directory. These are not interchangeable, and a Docker image does not mean the Docker entrypoint runs automatically.
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots): “Snapshots can't be moved between regions.”
- **docs-confirmed** — [Snapshots](https://vercel.com/docs/sandbox/concepts/snapshots#snapshots-and-regions): “When creation falls back to a failover region, Vercel loads the snapshot from the closest region where it's available.”
- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#snapshot-expiration): “Snapshots expire 30 days after their last use by default.”
- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#snapshot-expiration): “You can configure the expiration time to control how long snapshots are retained, including removing the expiration so they are kept indefinitely.”

## 5. Sizes, GPU, architecture and regions

- **pricing-page** — [Pricing](https://vercel.com/docs/sandbox/pricing#active-cpu): “You can provision 1 or an even number of vCPUs between 2 and 32 depending on your plan.”
- **pricing-page** — [Provisioned memory](https://vercel.com/docs/sandbox/pricing#provisioned-memory): “Each vCPU includes 2 GB of memory.”
- **pricing-page** — [Resource limits table](https://vercel.com/docs/sandbox/pricing#resource-limits), columns plan, maximum vCPUs, maximum memory, maximum open ports, disk size: “Hobby | 4 | 8GB | 15 | 64 GB”.
- **pricing-page** — [Resource limits table](https://vercel.com/docs/sandbox/pricing#resource-limits), same columns: “Pro | 8 | 16GB | 15 | 64 GB”.
- **pricing-page** — [Resource limits table](https://vercel.com/docs/sandbox/pricing#resource-limits), same columns: “Enterprise | 32 | 64GB | 15 | 64 GB”.
- **pricing-page** — [Resource limits](https://vercel.com/docs/sandbox/pricing#resource-limits): “Each sandbox created with Sandbox SDK 3.0.0 or above, or from a custom image, is automatically provisioned 64 GB of ephemeral NVMe storage.”
- **pricing-page** — [Resource limits](https://vercel.com/docs/sandbox/pricing#resource-limits): “Sandboxes created with runtimes (deprecated) receive 32 GB.”
- **pricing-page** — [Regions](https://vercel.com/docs/sandbox/pricing#regions): “Vercel Sandbox is available in 19 regions. The default region is `iad1`.”
- **not-published** — A Sandbox GPU offering, ARM64 availability, and a complete CPU architecture guarantee were not established in the provider pages reviewed. Do not infer a negative solely from absence.

## 6. Networking and secrets

- **docs-confirmed** — [SDK](https://vercel.com/docs/sandbox/sdk-reference#sandbox.create): “Firewall rules for sandbox egress traffic. Defaults to `"allow-all"`.”
- **docs-confirmed** — [Firewall](https://vercel.com/docs/sandbox/concepts/firewall#credentials-brokering): “Credentials brokering injects credentials into egressing traffic. The secrets never enter the sandbox, so code running inside it cannot exfiltrate them.”
- **docs-confirmed** — [Firewall](https://vercel.com/docs/sandbox/concepts/firewall): “Matchers select requests for transformation. They never block a request.”
- **inferred** — These firewall sources distinguish proxy-injected credentials from ordinary environment variables visible to guest code. Matchers alone are not an egress deny rule; permitted destinations and permissions still matter.
- **docs-confirmed** — [Secure Compute](https://vercel.com/docs/sandbox/concepts/secure-compute#pricing): “Traffic sent over VPC peering with your AWS environment does not incur data transfer charges.”
- **docs-confirmed** — [Secure Compute](https://vercel.com/docs/sandbox/concepts/secure-compute#pricing): “When a sandbox is attached to Secure Compute, traffic that leaves the private network via the public internet is billed as Private Data Transfer.”
- **pricing-page** — [Networking](https://vercel.com/docs/sandbox/pricing#network): “Data your sandbox sends to the internet, plus all traffic to and from exposed ports, is billable and measured in GB.”
- **docs-confirmed** — [Sandbox concepts](https://vercel.com/docs/sandbox/concepts#network-access): “Exposed ports are accessible via a public URL, so be mindful of what services you run.”
- **not-published** — Directly attaching a customer's own domain to a Sandbox port was not confirmed. Searches covered Vercel's Sandbox concepts and SDK reference, custom-domain documentation, and public queries for Sandbox ports, custom domains, subdomains and proxies. A Vercel-generated public URL is not proof that a custom hostname can be attached; ask Vercel whether a separately managed proxy is supported.
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
- **pricing-page** — [Hobby](https://vercel.com/docs/sandbox/pricing#hobby): “Once you exceed the quotas, sandbox creation is paused until 30 days have passed since you first used the feature.”
- **pricing-page** — [Pricing introduction](https://vercel.com/docs/sandbox/pricing#pricing): “Once you exceed your included limit on Hobby, sandbox creation is paused until the next billing cycle.”
- **pricing-page** — [Pro](https://vercel.com/docs/sandbox/pricing#pro): “All Sandbox usage on Pro plans is charged against your $20/month credit. After the credit is exhausted, usage is billed at the rates shown above.”
- **docs-confirmed** — [Pro fee](https://vercel.com/docs/plans/pro-plan#platform-fee): “$20/month Pro platform fee”.
- **docs-confirmed** — [Pro fee](https://vercel.com/docs/plans/pro-plan#platform-fee): “1 deploying team seat included”.
- **docs-confirmed** — [Pro fee](https://vercel.com/docs/plans/pro-plan#platform-fee): “$20/month in usage credit”.
- **docs-confirmed** — [Pro credit](https://vercel.com/docs/plans/pro-plan#monthly-credit): “You can use your monthly credit across all infrastructure resources.”
- **docs-confirmed** — [Pro credit expiration](https://vercel.com/docs/plans/pro-plan#credit-expiration): “Your credit expires at the end of the month if you don't use it, and resets at the beginning of the following month.”
- **pricing-page** — [Enterprise](https://vercel.com/docs/sandbox/pricing#enterprise): “Enterprise plans have custom pricing and quotas.”
- **inferred** — Given the [Enterprise pricing statement](https://vercel.com/docs/sandbox/pricing#enterprise), confirm actual rates and quotas in the proposed contract rather than treating the public table as a guaranteed quote.
- **pricing-page** — [Regional pricing](https://vercel.com/docs/sandbox/pricing#regional-pricing): “Rates for Active CPU, Provisioned Memory, Sandbox Data Transfer, Drive Storage, Drive Reads, and Drive Writes vary by region.”
- **pricing-page** — [Regional pricing](https://vercel.com/docs/sandbox/pricing#regional-pricing): “Sandbox Creations and Snapshot Storage are billed at the same rate in all regions where Sandbox is available.”
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
- **not-published** — Whether a credit card is required for each signup/trial path, whether a waitlist applies, and what happens at trial expiry for every signup path were not verified. Do not infer “no card” from a free plan. For published support terms, see section 17.

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

## 17. The company behind it

### Entity, people, funding and launch

- **docs-confirmed** — Vercel's [data processing addendum](https://vercel.com/legal/dpa) identifies “Vercel Inc., a Delaware corporation”. Delaware is the incorporation jurisdiction, not a data-storage location.
- **docs-confirmed** — The [Series F announcement](https://vercel.com/blog/series-f) identifies its author as “Guillermo Rauch CEO and Founder, Vercel”.
- **docs-confirmed** — [Series F announcement](https://vercel.com/blog/series-f): “Our founding insight back in 2015 was simple”. This establishes a founding year, not a precise day.
- **docs-confirmed** — Vercel's [original Sandbox announcement](https://vercel.com/changelog/run-untrusted-code-with-vercel-sandbox) is dated “25 Jun 2025”. This is the announcement date, not an independently verified first-customer-access date.
- **docs-confirmed** — [Sandbox GA changelog](https://vercel.com/changelog/vercel-sandboxes-ga), dated “30 Jan 2026”: “Vercel Sandboxes are now generally available, providing an ephemeral compute primitive for safely executing untrusted code.”
- **inferred** — The [GA announcement](https://vercel.com/changelog/vercel-sandboxes-ga) identifies Sandbox itself as generally available rather than beta; that does not establish the release status of every individual Sandbox feature.
- **docs-confirmed** — Vercel's [Series F announcement](https://vercel.com/blog/series-f), dated “30 Sep 2025”: “Today, Vercel announced an important milestone: a Series F funding round valuing our company at $9.3 billion.”
- **docs-confirmed** — [Series F announcement](https://vercel.com/blog/series-f): “The $300M investment is co-led by longtime partners at Accel and new investors at GIC, alongside other incredible supporters.”
- **third-party** — [Forbes company profile](https://www.forbes.com/companies/vercel/), last updated September 3, 2025: “Employees 600”. This is a dated third-party figure, not a current verified employee count.
- **not-published** — The sources examined did not establish a more precise company founding date, current independently verified headcount, or a complete current investor/capitalization table. The cited Series F is the latest round verified in this pass, not proof that no later financing occurred.

### Status and SLA

- **docs-confirmed** — Vercel's [public status page](https://www.vercel-status.com/), observed 2026-10-28: “Sandbox Operational”.
- **not-published** — The status page listed Sandbox but did not show a Sandbox-specific 90-day uptime percentage in the retrieved live page. Other products have percentages; do not attribute those numbers to Sandbox. A status snapshot is not an SLA or an independently audited reliability measurement.
- **docs-confirmed** — The [Enterprise SLA](https://vercel.com/legal/sla#services-availability) says Vercel “will use commercially reasonable efforts to make the platform as a service that serves your content to your websites and/or applications”.
- **docs-confirmed** — The [Enterprise SLA](https://vercel.com/legal/sla#services-availability) defines the target as “available 99.99% of the time, excluding any Excused Downtime events”.
- **docs-confirmed** — The [Enterprise SLA](https://vercel.com/legal/sla#unscheduled-downtime): “For the avoidance of doubt, this SLA does not apply to components of the Vercel platform that do not serve customer content to your websites and/or applications (by way of example only, the API's or CLI).”
- **docs-confirmed** — [Support queue guide](https://vercel.com/kb/guide/vercel-support-queue-time): “Our Pro and Hobby tiers are not covered by a support plan or SLA.”
- **not-published** — The public Enterprise SLA does not expressly name Sandbox in the text reviewed; no Sandbox-specific availability commitment was found. Whether a particular sandbox port serving content qualifies is contract-dependent and not established here. Ask for Sandbox and control-plane coverage in the signed order; do not equate a 99.99% platform claim with a Sandbox SLA.

### Support by plan

- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#community-support-forum): “All Customers have access to our Community Support Forum.”
- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#community-support-forum): “Customers on our Hobby plan are expected to use the Forum to discuss suspected platform issues.”
- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#submitting-a-support-ticket): “The Customer holds a current paid subscription with Vercel (e.g. an Enterprise or Pro tier subscription).” This is one listed condition for submitting a ticket; the same section also requires the scope and best-practice conditions.
- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#submitting-a-support-ticket), Hobby ticket exceptions: “The request is in relation to a billing issue, or” and “The request is in relation to a login or registration issue.”
- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#responses): “We only commit to respond to Customers with an Enterprise subscription, using the target response time guidelines below.”
- **docs-confirmed** — [Support terms](https://vercel.com/legal/support-terms#enterprise-target-response-time-guidelines), table row for the highest severity: “Severity 1 | < 4 business hours | < 2 hours (24/7)”. The headings are Standard and Premium, respectively.
- **inferred** — The [support terms](https://vercel.com/legal/support-terms) distinguish a target initial response from a guaranteed repair time; check the order form for the actual tier and any negotiated terms.

### Security and compliance scope

- **docs-confirmed** — [Vercel compliance documentation](https://vercel.com/docs/security/compliance#soc-2-type-2): “Vercel has a SOC 2 Type 2 attestation for Security, Confidentiality, and Availability.”
- **docs-confirmed** — [Vercel compliance documentation](https://vercel.com/docs/security/compliance#iso-27001:2022): “Vercel is ISO 27001:2022 certified.”
- **docs-confirmed** — [Vercel compliance documentation](https://vercel.com/docs/security/compliance#hipaa): “Signing Business Associate Agreements (BAAs) with eligible Pro and Enterprise customers”.
- **docs-confirmed** — [Vercel compliance documentation](https://vercel.com/docs/security/compliance#hipaa): “Pro teams can purchase the HIPAA BAA add-on from their team's Billing settings.”
- **docs-confirmed** — [Self-serve terms](https://vercel.com/legal/terms#103-hipaa-compliance): “You shall not use the Services to host any Protected Health Information or information that is subject to the Health Insurance Portability and Accountability Act (HIPAA), unless you first obtain Vercel's prior written approval.”
- **docs-confirmed** — [Vercel compliance documentation](https://vercel.com/docs/security/compliance#pci-dss): “A copy of our PCI DSS compliance documentation can be obtained through our Trust Center”. The linked trust center is [security.vercel.com](https://security.vercel.com/).
- **not-published** — The public compliance pages reviewed do not establish whether Sandbox specifically falls within the current SOC 2 audit boundary, ISO certificate scope, or a customer's HIPAA BAA. Request the actual reports, product scope and written confirmation before handling regulated data; platform-wide statements alone do not establish Sandbox coverage.

### Terms a buyer should read

- **docs-confirmed** — [Self-serve terms](https://vercel.com/legal/terms#term-and-termination): “All of Your Content on the Services (if any) may be permanently deleted by Vercel upon any termination of your account.”
- **docs-confirmed** — [Data processing addendum](https://vercel.com/legal/dpa): “Termination or expiration of the Agreement serves as instruction for Vercel to delete all Customer Data within a commercially reasonable timeframe.”
- **docs-confirmed** — [Data processing addendum](https://vercel.com/legal/dpa): “This Addendum applies to Vercel's Processing of Personal Data as a Processor under the Agreement for Customers who are on Enterprise and Pro plans.”
- **inferred** — The [self-serve terms](https://vercel.com/legal/terms) permit deletion on account termination; the [DPA](https://vercel.com/legal/dpa) states a commercially reasonable timeframe for covered Customer Data, not a fixed number of days. These clauses address different scopes; export needed data before terminating and check applicable contractual exceptions.
- **docs-confirmed** — [Self-serve payment terms](https://vercel.com/legal/terms#182-payments): “Vercel may change its fees and payment terms; provided however, that such changes will not take effect for you until the start of the next payment period.”
- **docs-confirmed** — [Self-serve payment terms](https://vercel.com/legal/terms#182-payments): “Vercel will provide written notice to you for any changes to the fees that affect the Services purchased by you.”
- **docs-confirmed** — [Enterprise terms](https://vercel.com/legal/enterprise-terms#13-payment-of-fees): “Vercel may change its Fees and payment terms at its discretion; provided however, that such changes will not take effect for you until the start of the next Order Form or Statement of Work, as applicable.”
- **not-published** — These quoted fee clauses do not state a fixed number of days' advance notice. A separate signed agreement, order form or mandatory law may change the position; do not substitute the account-termination notice period for a price-change notice period.
- **docs-confirmed** — [Self-serve terms](https://vercel.com/legal/terms#3-your-content): “In addition, if you are on a Hobby plan or trial Pro plan, you agree that we may use Your Content to train our artificial intelligence (“AI”) and machine learning models, and we may share Your Content with third parties for the purpose of developing and improving their products, including training and improving their AI and machine learning models (collectively, “Model Training”).”
- **docs-confirmed** — [Self-serve terms](https://vercel.com/legal/terms#3-your-content): “If you are on a paid Pro plan, Model Training is not enabled by default and you may opt in to Model Training.”
- **docs-confirmed** — [Self-serve terms](https://vercel.com/legal/terms#3-your-content): “You may opt-out of Model Training at any time by adjusting your Team account settings or by upgrading to an Enterprise plan.”
- **inferred** — The [self-serve content terms](https://vercel.com/legal/terms#3-your-content) are consequential for confidential workloads; confirm the exact treatment of Sandbox content, the relevant plan and team setting with Vercel. This is a reading of public terms, not legal advice.

## Research and verification limitations

- **inferred** — Context.dev live search and fresh scrapes, TinyFish Fetch through Composio, and Parallel Search through Composio succeeded. No native Amp web fallback was used. Battleships JSON and Markdown were read as secondary references. The changing regional selector, signup flow, and the exact trial exit were not exercised; no paid Sandbox was started.
- **inferred** — Quote audit after the claim-level revision: 81 evidence quotations were rechecked against freshly fetched live sources; 80 matched the provider's Markdown or third-party source after removing Markdown formatting, and the remaining trial quote matched the freshly rendered Hobby page via Context.dev, for 81 of 81 matches. This checks quotation text, not product behavior.
- **inferred** — Company-info pass: 38 newly added quote excerpts were checked against fresh public pages on 2026-10-28; direct HTML matched 31, and the remaining 7 were matched against fresh Context.dev Markdown, including the custom-domain port evidence and the model-training clause. No account or paid resource was created.
