# Cloudflare Sandbox — provider profile

Disclosure: battleships.dev, cited in this document, is built by the Boat team; Boat is one of the providers compared here. It is used as a cross-check, never as the sole source of a rate or verdict.

**Researched:** 28 October 2026. Desk research only; no Cloudflare account, container, or sandbox was created, started, or billed.
**Primary sources:** `developers.cloudflare.com/sandbox` (all 121 pages listed in its `llms.txt`, fetched as per-page `.md`), `developers.cloudflare.com/containers` (41 pages), the Containers/Workers/Durable Objects/R2/Dynamic Workers pricing pages, the Wrangler configuration reference, `cloudflare.com/products/sandboxes`, the `cloudflarestatus.com` components API, the Cloudflare Self-Serve Subscription Agreement, the Cloudflare Customer DPA, the Workers SLA, the SOC 2 and HIPAA compliance pages, Cloudflare's FY2025 Form 10-K, and the `cloudflare.net` leadership page.
**Secondary:** `battleships.dev` provider record for Cloudflare Sandbox / Containers (cross-check only).
**Quote audit (28 Oct 2026):** every quotation below was checked mechanically against the page it cites, using the `.md` copy of that page retrieved the same day; the checker normalises whitespace, HTML tags and Markdown emphasis/link syntax before matching. 225 quotations matched their cited page; 4 on Cloudflare's investor-relations leadership page were verified by a live scrape because that host serves a bot challenge to direct fetches. Mismatches found during drafting were corrected, not paraphrased. Quotes are taken from the per-page `.md` files rather than the `llms-full.txt` bundle; both exist for this docs set, and the bundle mixes 1.0 and 0.x text, which is one more way to quote the wrong lifecycle model.
**Tags (exactly five):** `docs-confirmed` = stated on a provider-owned surface (Cloudflare docs, changelog, product page, legal terms) · `pricing-page` = stated on a rate card (Cloudflare publishes its Containers rate card as a docs page, `developers.cloudflare.com/containers/platform/pricing/`) · `third-party` = someone other than Cloudflare · `inferred` = my reading of the evidence, with that evidence named · `not-published` = absent from every Cloudflare surface I checked. Vendor claims remain the vendor's own words, quoted verbatim, with the URL showing which page they come from.

> **Naming warning up front.** Three different things are called "sandbox" here. **Sandboxes** is the product (`developers.cloudflare.com/sandbox/`), generally available since 13 April 2026. **`@cloudflare/sandbox`** is a helper library; version 1.0 (30 September 2026) is a thin set of classes over the container API, and version 0.x is a legacy SDK with a completely different lifecycle model, supported with bug and security fixes only until 31 December 2026. **A Container** is the Linux microVM that actually runs the code. Almost every stale claim about this product, including the lifecycle note this profile was asked to check, comes from reading 0.x behaviour as if it were 1.0.

---

## 1. What it is, who it is for, product lines

**One paragraph.** Cloudflare sells sandboxes as a feature of its Workers developer platform: you write a Worker, its Durable Object starts a Linux container on Cloudflare's network, and that container runs untrusted or generated code with its own kernel. There is no separate sandbox service to sign up for and no sandbox-specific console; the unit of identity is a Durable Object name, the unit of compute is a Container instance, and the unit of persistence is a snapshot you take yourself. A second, lighter environment — Dynamic Workers — runs JavaScript, Python or WebAssembly inside the Workers runtime when the code only needs to call methods you pass in. *(Synthesis of the sourced claims in this section — `inferred` as a paragraph; each element is tagged where it appears.)*

- "A sandbox is an isolated place to run code. The code cannot directly read the memory or data of your application. Your Worker decides which application APIs and data the code receives, and whether the code can reach the public Internet." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`
- "Cloudflare provides two sandbox environments. Both are accessible through a Worker, the application that already handles your traffic." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`
- "Each instance is a microVM with its own kernel and network, so no other workload shares it." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`
- "Dynamic Workers let you spin up an unlimited number of Workers to execute arbitrary code specified at runtime. Use Dynamic Workers as a lightweight alternative to containers for securely sandboxing code you do not trust." — [Dynamic Workers](https://developers.cloudflare.com/dynamic-workers/) · `docs-confirmed`
- "Available on Workers Paid plan" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`

**Who it is for.** The docs name the jobs rather than an industry: agent-written code, user-uploaded applications, data analysis, development previews and build pipelines — "You can use a sandbox for agent-written code, user-uploaded applications, data analysis, development previews, build pipelines, or any other work that should not share a process with your application." [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`. The guides are written for people already running a Worker: every sandbox page starts from "A Worker with a Durable Object that starts a container with the Durable Object scheduling policy." [Preview a web application](https://developers.cloudflare.com/sandbox/previews/) · `docs-confirmed`

**Product lines.** One product, no tiers of its own:

| Line | What it is | Evidence |
|---|---|---|
| Sandboxes (Containers) | Linux microVM per sandbox, started by a Durable Object | "A Durable Object in your Worker starts the instance from an image and runs a command in it" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed` |
| Sandboxes (Dynamic Workers) | Runtime-created Workers for JS/Python/WASM | "Dynamic Workers create a new Worker at runtime." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed` |
| `@cloudflare/sandbox` 1.0 | Helper library: `Files`, `S3Mount`, `DirectoryBackup` | "The package does not start, stop, or monitor the container." — [@cloudflare/sandbox](https://developers.cloudflare.com/sandbox/reference/) · `docs-confirmed` |
| `@cloudflare/sandbox` 0.x | Legacy SDK that owns the `Sandbox` Durable Object | "These pages document `@cloudflare/sandbox` 0.x for existing applications." — [Sandbox SDK 0.x](https://developers.cloudflare.com/sandbox/sdk/) · `docs-confirmed` |

There is no sandbox SKU, no per-seat price and no separate contract: usage lands on the account's Workers Paid bill as Containers, Workers, Durable Objects, egress, R2 and optionally Logs (§10).

**Maturity: generally available, with two named features still in public beta.** The GA statement is unambiguous, and it is a changelog entry rather than marketing copy:

- "Cloudflare Containers and Sandboxes are now generally available." — [Changelog, 13 April 2026](https://developers.cloudflare.com/changelog/post/2026-04-13-containers-sandbox-ga/) · `docs-confirmed`
- "Sandbox SDK 1.0 is available." — [Changelog, 30 September 2026](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/) · `docs-confirmed`
- The beta parts are specific: "A sandbox container uses the Durable Object scheduling policy, which is in public beta." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`; "Container snapshots are in public beta. The API and behavior may change." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- The old SDK has a published end date: "Sandbox SDK 0.x receives bug and security fixes until 2026-12-31" — [Changelog, 30 September 2026](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/) · `docs-confirmed`. **Inferred:** a 0.x application is on a nine-week clock from this research date, and the migration is one-way for an existing class ("The deploy that moves an existing class to the new policy is one-way" — same page · `docs-confirmed`).

**Company.** Cloudflare, Inc., a Delaware corporation incorporated in July 2009, listed on the NYSE since 13 September 2019 — [Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party` (SEC filing by the company). Detail in §17.

---

## 2. Isolation technology, and what it actually allows

**It is a Firecracker microVM per container, with its own kernel — and inside it, everything runs as root.** That is a stronger boundary than a shared-kernel container and a weaker boundary than "one user per sandbox", which the docs say outright.

- "Each container instance runs in a Firecracker microVM with its own kernel and network. No other workload on the Cloudflare network shares that kernel. Your image runs as a Linux container inside the VM." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`
- "A Container runs in a Firecracker microVM with its own kernel and network, which no other workload shares." — [Choose a sandbox environment](https://developers.cloudflare.com/sandbox/concepts/) · `docs-confirmed`
- "Every process in a Container runs on the same Linux system. The processes can read the same files, see each other, and connect to the same `localhost` ports." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- "A separate Linux user does not keep a command away from files. In a deployed sandbox, every process has the same Linux capabilities as `root`, so file permissions do not restrict it, and it can switch back to `root`." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- "The sandbox is therefore the smallest unit of trust." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`

**What that permits inside the guest** — the usual Linux toolbox, with two Cloudflare-specific caveats:

- Docker-in-Docker: "Yes. Use the `docker:dind` image, and start the Docker daemon with iptables and IP forwarding turned off" — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`; "Run the Docker daemon as `root`. Rootless Docker does not start in Containers." — same page · `docs-confirmed`
- The exception that bites: "Containers that use the `durable_object` policy cannot turn on IP forwarding." — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`, and "Cloudflare Containers do not support iptables manipulation." — same page · `docs-confirmed`. Inner containers need `--network=host` (same page).
- Architecture: "Containers should be built for the `linux/amd64` architecture" — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`.

**What it does not offer**

- No memory snapshot, no pause/resume, no fork: the only save mechanism is a filesystem snapshot (§4).
- Nested virtualisation: no statement either way in the docs, FAQ, limits page or changelog · `not-published`.
- GPU: no GPU instance type, price or availability anywhere in the Containers or Sandboxes docs · `not-published` (the instance table in §5 tops out at 4 vCPU / 12 GiB, CPU only).
- ARM guests: `not-published`; the documented build target is `linux/amd64` only, and the `sandbox-shim` helper is "a statically linked `linux/amd64` binary" — [@cloudflare/sandbox](https://developers.cloudflare.com/sandbox/reference/) · `docs-confirmed`.

**Dynamic Workers are a different boundary.** "V8, the JavaScript engine in Chrome, runs each Dynamic Worker in a sandbox that cannot read memory outside itself." — [Choose a sandbox environment](https://developers.cloudflare.com/sandbox/concepts/) · `docs-confirmed`. The limits are real: "A Dynamic Worker cannot start child processes or load native add-ons" — same page · `docs-confirmed`.

**Practical reading for a non-specialist** (`inferred` from the quotes above): the microVM protects Cloudflare and your other customers from the code. It does **not** protect one user's files from another user's code inside the same sandbox, because there is no privilege boundary in there at all. The vendor's own instruction is to use "A sandbox for each user, or for each job" — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`.

---

## 3. Lifecycle: every state, what survives, and the timers

**Two objects with two lifetimes: the Durable Object persists, the container instance does not.** The Durable Object keeps its storage until your code deletes it; the instance ends when something stops it, and the next `start()` builds a new one from an image or a snapshot.

- "A Linux sandbox is a Durable Object that starts and stops a container." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "The Durable Object and the instance last for different lengths of time." — same page · `docs-confirmed`
- "An instance runs only until something stops it, and its processes and the files on its disk end with it. The next `start()` creates a new instance." — same page · `docs-confirmed`

| State | What it is | Disk | Processes / memory | Billed | Source |
|---|---|---|---|---|---|
| starting | `start()` called, not yet accepting traffic | from image or snapshot | booting | memory + disk + active CPU | "`start()` boots a container. It returns before the container is ready to accept requests." — [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed` |
| running / ready | instance up, port ready | writable, ephemeral | live | memory + disk + active CPU | "The `ctx.container.running` property becomes `true` before the process is ready to accept traffic." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed` |
| running / idle | no requests, still inside the inactivity window | writable, ephemeral | live | memory + disk, no CPU | "While an instance runs, Containers bill its memory and disk, whether or not anything inside it does work." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| stopping | SIGTERM sent | still there | being killed | until it stops | "every process in the instance receives `SIGTERM`, and Cloudflare stops the instance shortly after" — same page · `docs-confirmed` |
| stopped | instance gone | **gone** | **gone** | **$0** | "After the instance stops, it is not billed." — same page · `docs-confirmed` |
| snapshot | a saved root filesystem, not a running thing | saved copy | not saved | price not published | §4 |

The quoted columns are from the cited pages; the billing column is `inferred` from the rate card's rule that charges start when a request reaches the container and that memory and disk bill while it runs.

**What counts as activity — and what does not.** This is the single most consequential rule in the product.

- "An instance keeps running while its Durable Object is active." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "The Durable Object is active while it handles a request, runs an alarm, streams a response, or holds open a WebSocket that it accepted with `accept()`." — same page · `docs-confirmed`
- "Code that runs inside the instance does not count as activity. If no requests arrive, the instance stops when the inactivity timeout ends, even while a build, a test suite, or an agent task still runs inside it." — same page · `docs-confirmed`
- The documented workaround: "A Durable Object alarm that runs more often than the timeout and checks the work keeps the instance running until the work ends." — same page · `docs-confirmed`

**The timer.** There is no default inactivity timeout in the 1.0 sandbox API, a hard ceiling of six hours, and the setting is lost on every Durable Object restart:

- "After the Durable Object becomes inactive, the instance keeps running for the time set with `setInactivityTimeout()`, up to 6 hours." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "Without a timeout, Cloudflare stops the instance shortly after the Durable Object becomes inactive." — same page · `docs-confirmed`
- "The value must be greater than `0` and at most 6 hours" — [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed` (the ceiling is given in the API as `21600000` milliseconds)
- "The restarted Durable Object starts without an inactivity timeout, so the instance stops shortly after the Durable Object becomes inactive." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- The legacy `Container` class is where "10 minutes" comes from: "The `Container` class sets `sleepAfter` to 10 minutes by default." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`; restated as "The `Container` class sets `sleepAfter` to 10 minutes by default." — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`.

**What stops an instance**

- "The inactivity timeout ends." · "Your Worker calls `destroy()`." · "The main process exits." · "A platform event stops it, for example a server restart. Cloudflare does not guarantee that an instance runs for a set time." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "`destroy()` stops the instance at once, with no time for processes to clean up." — same page · `docs-confirmed`
- The graceful path: "Waits up to 15 minutes for that process to exit." and then "Sends `SIGKILL` if the process is still running." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`
- "Cloudflare does not stop a container instance after a fixed maximum runtime." — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`. No maximum session length is published; the six-hour cap is on the *inactivity timeout*, not on runtime · `not-published` for a runtime cap.
- A stop wakes nothing: "Cloudflare does not wake the Durable Object when its instance stops." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. The name still routes: "Your Worker reaches the Durable Object by name, for example a session ID, and the same name always reaches the same Durable Object." — same page · `docs-confirmed`. So the next request reaches the object and can start a new instance; nothing restarts on its own.

**Deploys do not restart sandboxes, and that cuts both ways.** "Deploying a new version of your Worker restarts every Durable Object. A running instance keeps running" — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. "A running instance keeps the image, entrypoint, and environment variables that it started with. `start()` throws while an instance runs" — same page · `docs-confirmed`. So a new image only reaches sandboxes that stop and start again; the old code path can persist for as long as the instance does.

### The earlier lifecycle note, checked

The note said: the sandbox goes idle after 10 minutes, all files are deleted, and the next request gets a fresh container. Each part, against live pages:

| Claim | Verdict | Evidence |
|---|---|---|
| Idle after 10 minutes | **True only for Sandbox SDK 0.x and the legacy `Container` class.** Not true for Sandboxes 1.0, which has no default and a 6-hour maximum. | 0.x: "After a period of inactivity (10 minutes by default, configurable via `sleepAfter`), the container stops to free resources." — [Sandbox SDK 0.x lifecycle](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/) · `docs-confirmed`. 1.0: "Without a timeout, Cloudflare stops the instance shortly after the Durable Object becomes inactive." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| All files are deleted | **True when the instance stops, unless you saved a snapshot or wrote to a mounted bucket.** | "Stopping the instance deletes the files on its disk." — [Work with files](https://developers.cloudflare.com/sandbox/files/) · `docs-confirmed`; "A snapshot then carries its files to the next instance" — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| Next request gets a fresh container | **True.** | "The next `start()` creates a new instance." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |

**What the note left out:** three persistence mechanisms (filesystem snapshots with a 30-day life, directory backups into your own R2 bucket with no expiry, and R2/S3 mounts that outlive every instance — §4), and the fact that the "10 minutes" figure belongs to a deprecated SDK whose support ends 31 December 2026. The note is not wrong about 0.x; it is wrong as a description of the product as sold today.

### Decisive figures

| Figure | Value | Source |
|---|---|---|
| Cold start (new instance from image) | "often be in the 1-3 second range" | [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed` |
| Start from snapshot | not published | · `not-published` |
| Default inactivity timeout (1.0) | none; stops "shortly after" the Durable Object goes inactive | [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| Maximum inactivity timeout | 6 hours (`21600000` ms) | [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed` |
| Legacy default sleep (`Container` class / 0.x) | 10 minutes | [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed` |
| Grace period after SIGTERM | up to 15 minutes | [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed` |
| Maximum runtime | none published | · `not-published` |
| Snapshot retention | 30 days from creation or last restore | [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed` |
| Price while stopped | $0 | [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |

---

## 4. State tools: snapshots, backups, mounts and images

**Three ways to keep files, and none of them is a paused machine.** A snapshot is a root filesystem; a directory backup is one directory in your R2 bucket; a mount is a bucket prefix visible as a directory. None saves memory or processes, and there is no fork.

**Snapshot — filesystem only, immutable, tied to an image, 30 days.**
- "`snapshotContainer()` saves the writable root filesystem of a running instance. It does not save separately mounted filesystems, memory, or processes." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "Starting with a snapshot creates a new instance with the saved files, and the new instance runs its entrypoint. The processes that were running do not continue." — same page · `docs-confirmed`
- "Files in `/run` are in memory, and a snapshot does not save them." — same page · `docs-confirmed`
- "The new instance reuses the same process IDs, so a process ID saved in a file can belong to another process after a restore." — same page · `docs-confirmed`
- "A snapshot expires 30 days after it is created or last restored." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`; "Maximum snapshot size | 20 GB" and "Snapshot retention | 30 days from creation or the most recent restore" — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`
- "Snapshots capture the Container's complete filesystem state, but not its memory or running processes. A snapshot is tied to the Container image version it was created from and is not portable to a different image." — [Use snapshots](https://developers.cloudflare.com/containers/guides/snapshots/) · `docs-confirmed`
- **Nothing is automatic:** "Cloudflare does not restore a snapshot on its own." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. The docs publish a pattern that saves on idle with a Durable Object alarm — [Save a sandbox automatically](https://developers.cloudflare.com/sandbox/files/save-a-sandbox-automatically/) · `docs-confirmed` — but it is code you write.
- **Public beta:** "Container snapshots are in public beta. The API and behavior may change." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`

**Directory backup — one directory into your own R2 bucket, no expiry.**
- "The `DirectoryBackup` class from `@cloudflare/sandbox` saves one directory as one object in your R2 bucket and restores it as ordinary files." — [Back up a directory to R2](https://developers.cloudflare.com/sandbox/files/back-up-a-directory-to-r2/) · `docs-confirmed`
- "A backup restores after the instance stops or after you deploy a new image. R2 keeps each backup until you delete it." — same page · `docs-confirmed`. That is the opposite of the 30-day snapshot: retention is your R2 lifecycle policy, and the storage bill is R2's (§10).
- Decisive figure: **no expiry**; you pay R2 Standard storage until you delete the object · `docs-confirmed` for "until you delete it", `pricing-page` for the rate.

**Mount — an R2 or S3 prefix as a directory, outliving every instance.**
- "The `S3Mount` class from `@cloudflare/sandbox` mounts one prefix of a bucket as a directory with `s3fs`. Your Worker keeps the R2 credentials and signs each storage request." — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) · `docs-confirmed`
- "Files in a mounted R2 bucket are objects in that bucket. They remain after every instance stops, and other sandboxes and Workers with access to the bucket can read them." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`
- "A snapshot does not include mounted directories, and a mount ends with its instance, so each new instance mounts the bucket again." — same page · `docs-confirmed`
- The caveats are POSIX-shaped: "File locks, hard links, ownership, permissions, and atomic replacement do not work as they do on a local filesystem." — [S3Mount API](https://developers.cloudflare.com/sandbox/reference/s3-mounts/) · `docs-confirmed`; and "Any process in the sandbox can read, change, or delete every object under the prefix." — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) · `docs-confirmed`.
- A leak worth knowing: "Each new mount adds an outbound intercept, and `unmount()` does not remove it." — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) · `docs-confirmed`

**Images.**
- Named images are declared in Wrangler and chosen per start: "Named images that Durable Object code can access through `ctx.container.images`." and "A configuration can contain up to 100 named images" — [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · `docs-confirmed`
- Bring your own Dockerfile or a digest-pinned image: "Each named image must set exactly one of `dockerfile` or `image`." — same page · `docs-confirmed`; "A digest-pinned image reference in the Cloudflare Registry." — same page · `docs-confirmed`
- A managed base exists: "`cloudflare/debian-trixie`" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`, described as including "Node.js 24.20.0 on Debian Trixie slim" — [Changelog, 30 September 2026](https://developers.cloudflare.com/changelog/post/2026-09-30-durable-object-scheduling-policy/) · `docs-confirmed`
- Image storage cap: "Total image storage per account | 50 GB" — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`

**What does not exist here** (each a real difference from providers that market "fork" or "pause"): no memory snapshot, no fork/clone, no pause/resume, no live migration. `not-published` in the Sandboxes and Containers docs; the snapshot page's own definition excludes memory and processes, quoted above.

---

## 5. Machine sizes, GPU, architecture, regions

**Six preset sizes, all memory-heavy, plus custom sizes with a hard ceiling of 4 vCPU / 12 GiB / 20 GB.**

| Instance type | vCPU | Memory | Disk |
|---|---|---|---|
| lite | 1/16 | 256 MiB | 2 GB |
| basic | 1/4 | 1 GiB | 4 GB |
| standard-1 | 1/2 | 4 GiB | 8 GB |
| standard-2 | 1 | 6 GiB | 12 GB |
| standard-3 | 2 | 8 GiB | 16 GB |
| standard-4 | 4 | 12 GiB | 20 GB |

— [Limits and Instance Types](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`

- Custom sizes: "Minimum vCPU | 1", "Maximum vCPU | 4", "Maximum Memory | 12 GiB", "Maximum Disk | 20 GB", "Memory to vCPU ratio | Minimum 3 GiB memory per vCPU" — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`
- Default when omitted: "If you omit `instance`, the Container uses `lite`." — [Scheduling Policies](https://developers.cloudflare.com/containers/configuration/scheduling-policy/) · `docs-confirmed`
- **Consequence:** a 2 vCPU / 4 GiB sandbox cannot be bought (2 vCPU needs at least 6 GiB), a 4 vCPU / 8 GiB sandbox cannot be bought (4 vCPU needs 12 GiB), and no sandbox can have a 50 GB disk. The site's three workloads all need substituting; §11 names the nearest shapes.
- Account ceilings, which are the real concurrency limit: "Concurrent memory | 6 TiB", "Concurrent vCPU | 1,500", "Concurrent disk | 30 TB" — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`. At 2 vCPU each that is roughly 750 concurrent `standard-3` sandboxes (`inferred`, arithmetic).
- **Contradiction inside the limits page:** "All instance size maximums and account limits on this page are defaults and can be increased." — same page · `docs-confirmed` — sits directly above a custom-instance table that states "Maximum vCPU | 4" and "Maximum Memory | 12 GiB" as constraints. Whether a support request can lift the per-instance ceiling is `not-published`; ask before designing for it.

**GPU:** none. No GPU shape, price or region appears in the Containers or Sandboxes docs; the largest shape is 4 vCPU / 12 GiB of CPU · `not-published` for any GPU option.

**Architecture:** `linux/amd64` only — "Containers should be built for the `linux/amd64` architecture" — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`. No ARM guest option is published · `not-published`.

**Regions: global placement, no way to pin a sandbox.**

- "By default, containers run in the location nearest to the incoming request with a pre-fetched image." — [Placement](https://developers.cloudflare.com/containers/concepts/placement/) · `docs-confirmed`
- "Container placement is optimized for request routing and startup speed, so a Container may start in a different location than its Durable Object." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`
- Containers *do* have region and jurisdiction constraints — `ENAM`, `WNAM`, `EEUR`, `WEUR`, `APAC`, `SAM`, `ME`, `OC`, `AFR`, and `jurisdiction` values `eu`, `us`, `fedramp` — [Placement](https://developers.cloudflare.com/containers/concepts/placement/) · `docs-confirmed`; "Limited capacity regions (ME, OC, AFR) cannot be used exclusively." — same page · `docs-confirmed`.
- **But not for sandboxes:** "A `durable_object` entry accepts only the following options. Wrangler rejects every other Container application field for this policy, including `image`, `instance_type`, `max_instances`, rollout settings, and placement constraints." — [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · `docs-confirmed`. Sandboxes use that policy (§1), so **no documented way exists to pin a sandbox to the EU, the US or a FedRAMP boundary** · `not-published` for any sandbox-level residency control.
- Placement is best-effort even so: "Because prepared capacity is finite, some Container instances may start in locations farther from the end user." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`. And a stopped instance that restarts can land elsewhere: "once that container instance stops and restarts, future requests could be routed to a *different* location" — same page · `docs-confirmed`.

---

## 6. Networking

**Inbound: there is no public port. A sandbox is reachable from the internet only through your Worker, and only over HTTP.** (Wrangler SSH is the other path, and it is not a public port — below.)

- "HTTP from the Internet reaches the instance only through your Worker." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`
- "Because all Container requests are passed through a Worker, end-users cannot make non-HTTP TCP or UDP requests to a Container instance." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed`
- Previews: "The server has no public port, so your Worker forwards requests to it." — [Preview a web application](https://developers.cloudflare.com/sandbox/previews/) · `docs-confirmed`
- The recommended preview shape is one hostname per sandbox: "Serve each sandbox preview from its own hostname" and "Code in one preview cannot read your application pages or the storage of another preview." — [Serve previews on their own hostnames](https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/) · `docs-confirmed`
- **Authentication is yours.** The docs' warning is explicit: "When your Worker forwards a page from a sandbox, the page runs under the hostname that served it. On your application hostname, the page can use your application cookies and call its APIs." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`. No built-in preview auth, token or IP allowlist is documented · `not-published`.
- Custom domains are a Worker route + wildcard DNS, not a sandbox feature: "A wildcard DNS record and the route `*.example-previews.com/*` send every preview hostname to your Worker." — [Serve previews on their own hostnames](https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/) · `docs-confirmed`.

**Outbound: off unless you turn it on, and intercepted per hostname when you leave it off.**

- "A Container starts with `enableInternet: false` by default, so it cannot reach the Internet. Only requests that an outbound handler in your Worker intercepts leave it." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- The API reference is stricter than that sentence: "Whether to allow outbound Internet access. Required when you pass `options`." — [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed`. Either way, access is a per-start decision, and every documented example passes `false`.
- "When `enableInternet` is `false`, only traffic that `allowedHosts` or an outbound handler allows can leave the container. Only ports `80` and `443` are available." — [Handle outbound traffic](https://developers.cloudflare.com/containers/configuration/outbound-traffic/) · `docs-confirmed`
- "Keep Internet access off when you use an outbound handler." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`; with it on, "every other connection goes out directly" — same page · `docs-confirmed`.
- **The opposite default is documented for the other API:** "By default, a Container will allow internet access, and you can set `deniedHosts` to disallow specific hosts or IPs" — [Handle outbound traffic](https://developers.cloudflare.com/containers/configuration/outbound-traffic/) · `docs-confirmed`. See §14, contradiction 2.
- No static egress IP, NAT gateway or private network (VPC/tailnet) is offered · `not-published`. Egress leaves through Cloudflare's network and is priced by destination region (§10).

**Secrets.** The model is "keep it in the Worker, inject on the way out", not "store it in the sandbox":

- "A Container can send its request without the credential, and an outbound handler in your Worker adds the credential after the request leaves the sandbox." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- "Add the credential only to HTTPS requests. The handler fetches with the scheme that the container used, so a credential added to a plain HTTP request crosses the Internet unencrypted." — same page · `docs-confirmed`
- For storage, `S3Mount` does the same with R2 keys: "The sandbox receives placeholder credentials, because `s3fs` requires a key pair." — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) · `docs-confirmed`
- The limit of the model is stated plainly: "Once a value is in the sandbox, all the code there can read it and send it anywhere the sandbox can reach." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`

**SSH** exists, but only through Wrangler: "SSH does not expose a publicly accessible port on the Container. The only way to connect is through Wrangler with `wrangler containers ssh`" — [SSH](https://developers.cloudflare.com/containers/guides/ssh/) · `docs-confirmed`. "SSH will not start a stopped Container, and an active SSH connection alone will not keep a Container alive." — same page · `docs-confirmed`

---

## 7. Interfaces

| Interface | Status | Evidence |
|---|---|---|
| **TypeScript in a Worker** | The primary and only first-class surface | "`@cloudflare/sandbox` works with a container you start from a Durable Object." — [@cloudflare/sandbox](https://developers.cloudflare.com/sandbox/reference/) · `docs-confirmed` |
| **Durable Object container API** | The real control plane: `start`, `exec`, `destroy`, `monitor`, `snapshotContainer` | "`this.ctx.container` does what the 0.x SDK server did." — [Changes in Sandbox SDK 1.0](https://developers.cloudflare.com/sandbox/sdk/migrate/changes-in-1-0/) · `docs-confirmed` |
| **Wrangler CLI** | Deploy, tail, list instances, SSH | "`wrangler containers ssh <INSTANCE_ID>`" — [SSH](https://developers.cloudflare.com/containers/guides/ssh/) · `docs-confirmed` |
| **Dashboard** | Read/manage Workers, Containers, instances, logs | "Find the instance ID for your Container by running `wrangler containers instances` or in the Cloudflare dashboard" — [SSH](https://developers.cloudflare.com/containers/guides/ssh/) · `docs-confirmed` |
| **REST/HTTP API** | **None hosted.** A reference bridge Worker exists for 0.x only | "The sandbox bridge is a reference-implementation Cloudflare Worker that exposes the Sandbox SDK as an HTTP API." and "You deploy the Worker in your account; it is not a Cloudflare-hosted shared API." — [Sandbox bridge](https://developers.cloudflare.com/sandbox/sdk/bridge/) · `docs-confirmed` |
| **Python / Go / other SDKs** | **None official** | No sandbox SDK in another language appears in the docs index — [Sandboxes llms.txt](https://developers.cloudflare.com/sandbox/llms.txt) · `not-published` |
| **MCP server** | **None for sandbox control** | The docs' MCP-adjacent surface is the Agents SDK tool (§8); no `mcp` endpoint or server package for sandboxes is documented · `not-published` |
| **Webhooks** | **None** | No lifecycle webhook product; the substitute is a Durable Object alarm — [Run code when a sandbox stops](https://developers.cloudflare.com/sandbox/manage/run-code-when-a-sandbox-stops/) · `docs-confirmed` |
| **Browser terminal** | Yes, xterm.js over WebSocket into tmux | "Expose a live shell in a Linux sandbox on a web page." and "The shell keeps running when the page reloads or the connection drops." — [Open a terminal in the browser](https://developers.cloudflare.com/sandbox/commands/open-a-terminal-in-the-browser/) · `docs-confirmed` |
| **SSH** | Yes, Wrangler-only, no public port | §6 |
| **File watching** | 0.x only; 1.0 gives a pattern | The 1.0 API map replaces `watch()` and `checkChanges()` with "`inotifywait -m` through `container.exec()`" — [API map](https://developers.cloudflare.com/sandbox/sdk/migrate/api-map/) · `docs-confirmed` |

**No console for sandboxes.** The dashboard manages the Worker and its containers; the docs never describe creating or driving a sandbox from the dashboard. Sandbox identity is a name you choose in code, and the runtime keeps no registry: "The runtime does not record which names belong to which user" — [Manage sandboxes](https://developers.cloudflare.com/sandbox/manage/) · `docs-confirmed`.

---

## 8. Agent features

**Cloudflare ships the environment and the recipes, not the agent.** There is no hosted agent loop of Cloudflare's own; the docs show two patterns.

**Pattern 1 — your sandbox, their agent.** The Worker starts the sandbox, holds the credentials and decides reachability:

- "Run Claude Code in a Linux sandbox to edit a GitHub repository from a prompt, then read its changes as a diff." — [Run Claude Code in a sandbox](https://developers.cloudflare.com/sandbox/coding-agents/claude-code/) · `docs-confirmed`
- "Your Worker starts the sandbox, holds the credentials, and decides which hostnames the sandbox can reach. The agent calls its model over HTTP, for example through AI Gateway." — [Run coding agents in a sandbox](https://developers.cloudflare.com/sandbox/coding-agents/) · `docs-confirmed`
- Guides exist for Claude Code, Codex, OpenCode and Pi — [Coding agents](https://developers.cloudflare.com/sandbox/coding-agents/) · `docs-confirmed`

**Pattern 2 — their agent loop, your sandbox.** Devin, Cursor, Claude Managed Agents and the OpenAI Agents API run the loop in their own service and call into sandboxes in your account:

- "Devin, Cursor, Claude Managed Agents, and the OpenAI Agents API run their agent loop in their own service. The loop sends commands and file edits to sandboxes in your Cloudflare account." — [Run coding agents in a sandbox](https://developers.cloudflare.com/sandbox/coding-agents/) · `docs-confirmed`
- The credential warning: "In the Devin, Cursor, and OpenAI Agents API templates, the vendor worker process runs inside the sandbox, so the sandbox also holds a vendor credential." — same page · `docs-confirmed`

**Agents SDK integration.** "Give an agent a Linux sandbox for shell commands, language runtimes, package installation, and project files that last across turns." — [Agents SDK: Sandbox](https://developers.cloudflare.com/agents/tools/sandbox/) · `docs-confirmed`. The lighter alternative is Code Mode on a Dynamic Worker: "Code Mode runs the code in a Dynamic Worker, which starts faster than a container." — same page · `docs-confirmed`.

**Built-in agents inside the image:** none by default. The 0.x image shipped Python, Git, `curl`, `wget`, `jq`, `unzip` and `ps`; 1.0's documented base images "include none of them" — [Changes in Sandbox SDK 1.0](https://developers.cloudflare.com/sandbox/sdk/migrate/changes-in-1-0/) · `docs-confirmed`. `inferred`: you install `claude`, `codex` or `opencode` in your own Dockerfile, exactly as the guides do.

---

## 9. Accounts, orgs, keys, controls

**One account, one bill, no sandbox-level tenancy.** Sandboxes inherit Cloudflare's account model: members and API tokens at the account level, Durable Objects and Containers inside a Worker, and no per-sandbox permission object.

- "Available on Workers Paid plan" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`; the plan is "a minimum charge of $5 USD per month for an account" — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · `pricing-page`
- Sandbox identity is naming, not authorisation: "Your Worker reaches each sandbox by name. The runtime does not record which names belong to which user, and it does not wake a Durable Object when its container stops." — [Manage sandboxes](https://developers.cloudflare.com/sandbox/manage/) · `docs-confirmed`
- The security consequence is spelled out: "The name decides which sandbox, and which saved files, a request reaches. It does not show who sent the request. Authenticate the caller in your Worker, and derive the sandbox name from that identity." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- Concurrency is account-wide: "Running instances count toward your account limits." — [Scheduling Policies](https://developers.cloudflare.com/containers/configuration/scheduling-policy/) · `docs-confirmed`; the limits are 1,500 vCPU, 6 TiB and 30 TB (§5).
- **No per-app instance cap on sandboxes:** "The `durable_object` policy does not support `max_instances`." — [Scheduling Policies](https://developers.cloudflare.com/containers/configuration/scheduling-policy/) · `docs-confirmed`. (The default policy's `max_instances` "Defaults to 20." — [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · `docs-confirmed`.)
- **Spend controls:** account-level budget alerts exist but do not stop anything: "Budget alerts are informational only. They do not pause or cap usage." — [Budget alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/) · `docs-confirmed`
- **Audit:** Cloudflare's account audit log records control-plane actions — "All user-initiated actions are recorded automatically across both the Cloudflare API and dashboard." — [Audit Logs](https://developers.cloudflare.com/fundamentals/account/account-security/audit-logs/) · `docs-confirmed`. It does not document per-sandbox commands, file writes or network requests · `not-published`. `inferred`: if you need to know what an agent did inside a sandbox, capture it from `exec()` output or the terminal, not from Cloudflare.
- **SSO:** dashboard SSO is a Cloudflare account feature and is not sandbox-specific: "Cloudflare Dashboard SSO is available for free to all plans." — [Set up dashboard SSO](https://developers.cloudflare.com/fundamentals/manage-members/dashboard-sso/) · `docs-confirmed`. No sandbox-level SSO or per-sandbox access policy is published · `not-published`. Cloudflare Access in front of the Worker is the documented-shaped workaround (`inferred`; the previews guide assumes your own authentication — [Serve previews on their own hostnames](https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/) · `docs-confirmed`).

---

## 10. Pricing, exactly

### The meter

Four meters, and only CPU depends on how hard the sandbox works. This is the most important thing to get right, because Cloudflare's "active CPU" pricing makes an idle sandbox look cheap and a busy one look expensive.

| Resource | Rate (USD list) | Hourly equivalent | Billed on | When |
|---|---|---|---|---|
| CPU | **$0.000020 / vCPU-second** | **$0.072 / vCPU-hour** | "active usage only" | while the instance runs |
| Memory | **$0.0000025 / GiB-second** | **$0.009 / GiB-hour** | "the provisioned resources for the instance type" | while the instance runs, busy or idle |
| Disk | **$0.00000007 / GB-second** | **$0.000252 / GB-hour** | provisioned disk for the instance type | while the instance runs |
| Egress | **$0.025 / GB** (NA/EU) | — | bytes leaving, by destination region | monthly |

- "Containers are billed for every 10ms that they are actively running at the following rates" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`
- "Memory and disk usage are based on the *provisioned resources* for the instance type you select, while CPU usage is based on *active usage* only." — same page · `pricing-page`
- "You only pay for what you use — charges start when a request is sent to the container or when it is manually started. Charges stop after the container instance goes to sleep" — same page · `pricing-page`
- Included each month on Workers Paid: "25 GiB-hours/month included", "375 vCPU-minutes/month", "200 GB-hours/month" — same page · `pricing-page`. Valued at list price that is $0.225 + $0.45 + $0.0504 = **$0.73** of container usage (`inferred`, arithmetic).
- **The $5 is a plan fee, not credit:** "The Workers Paid plan includes Workers, Pages Functions, Workers KV, Hyperdrive, and Durable Objects usage for a minimum charge of $5 USD per month for an account." — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · `pricing-page`
- **Free plan cannot run this:** the Containers rate card's Free column is "N/A" for memory, CPU and disk — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`

**Egress, by destination:**

| Region | Price per GB | Included per month |
|---|---|---|
| North America & Europe | $0.025 | 1 TB |
| Oceania, Korea, Taiwan | $0.05 | 500 GB |
| Everywhere Else | $0.04 | 500 GB |

— [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`

**Everything else on the bill**

| Item | Rate | Source |
|---|---|---|
| Workers requests | 10M/month included, then $0.30/M | [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · `pricing-page` |
| Durable Object requests | 1M/month included, then $0.15/M | [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) · `pricing-page` |
| Durable Object duration | 400,000 GB-s/month included, then $12.50/M GB-s, on a 128 MB allocation | same page · `pricing-page` |
| R2 storage for backups/mounts | $0.015/GB-month standard, 10 GB-month free | [R2 pricing](https://developers.cloudflare.com/r2/pricing/) · `pricing-page` |
| Workers Logs | 20M events/month included, then $0.60/M | [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · `pricing-page` |
| Dynamic Workers | 1,000 unique per month included, then "$0.002 per Dynamic Worker per day"; requests and CPU at Workers rates | [Dynamic Workers pricing](https://developers.cloudflare.com/dynamic-workers/pricing/) · `pricing-page` |
| Snapshot storage | — | `not-published` |
| Image storage beyond 50 GB | — | `not-published` (50 GB is a limit, not a priced allowance) |
| Enterprise / committed-use pricing | — | `not-published` |

**Price while asleep: $0.00/hour.** "After the instance stops, it is not billed." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. There is no paused state to pay for, and equally no paused state to resume from (§4).

**Price while awake but idle: memory + disk, no CPU.** For `standard-4` that is 12 × $0.009 + 20 × $0.000252 = **$0.11304/hour** (`inferred`, arithmetic from the rate card). A five-minute task with a ten-minute inactivity timeout pays for fifteen minutes of memory and disk, not five — the tail is a property of the timeout you set, not of the work.

**The model in plain words** (restates the tagged figures above; no new claims). You pay a $5 monthly plan fee, then per ten milliseconds for every running sandbox: the CPU it actually burns, plus the full memory and disk of the size you chose. When it stops you pay nothing for it, and its disk is gone. Persistence is a separate purchase: R2 storage for backups and mounts, or an unpriced snapshot.

---

## 11. Worked cost examples

All arithmetic uses the [Containers rate card](https://developers.cloudflare.com/containers/platform/pricing/) of 28 Oct 2026 ($0.072/vCPU-h active CPU, $0.009/GiB-h memory, $0.000252/GB-h disk), subtracts the monthly included allotments (375 vCPU-min = 6.25 vCPU-h, 25 GiB-h, 200 GB-h), adds the $5 Workers Paid plan, and excludes egress, R2, Logs and taxes. CPU is the uncertain term: Cloudflare bills active CPU only and publishes no utilisation figure for a typical agent task, so each example gives a floor (CPU inside the included allotment), a 25%-utilisation middle, and a ceiling (every provisioned vCPU saturated for the whole run). Those three are **inferred**; the rates are `pricing-page`.

**Shape substitutions, once, because they apply to all three examples:**

| Brief | Buyable? | Nearest shape used | Gap |
|---|---|---|---|
| A: 2 vCPU / 4 GiB | No — 2 vCPU requires ≥ 6 GiB | `standard-3`: 2 vCPU / 8 GiB / 16 GB | 4 GiB more RAM; 16 GB disk included |
| B: 4 vCPU / 8 GiB / 50 GiB | No — 4 vCPU requires 12 GiB; max disk 20 GB | `standard-4`: 4 vCPU / 12 GiB / 20 GB | 4 GiB more RAM, 30 GB less disk |
| C: 2 vCPU / 4 GiB / 20 GiB | No — same ratio rule; 20 GB disk only on `standard-4` | `standard-3`: 2 vCPU / 8 GiB / 16 GB | 4 GiB more RAM, 4 GB less disk |

— instance table and "Memory to vCPU ratio | Minimum 3 GiB memory per vCPU" — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`

### (A) 1,000 agent tasks a month, 10 minutes each, 2 vCPU / 4 GiB, deleted after each

**Shape:** `standard-3` (2 vCPU / 8 GiB / 16 GB). 1,000 × 10 min = 166.667 running hours; deletion means nothing persists and nothing is billed between tasks.

Per running hour:
- Memory: 8 × $0.009 = **$0.072/h**
- Disk: 16 × $0.000252 = **$0.004032/h**
- CPU at 100%: 2 × $0.072 = **$0.144/h**; at 25% = **$0.036/h**

| Line | CPU floor | CPU at 25% | CPU at 100% |
|---|---|---|---|
| Memory (166.667 h) | $12.00 − $0.225 = **$11.78** | $11.78 | $11.78 |
| Disk (166.667 h) | $0.672 − $0.050 = **$0.62** | $0.62 | $0.62 |
| CPU | **$0.00** (inside 6.25 vCPU-h) | $6.00 − $0.45 = **$5.55** | $24.00 − $0.45 = **$23.55** |
| Workers Paid plan | **$5.00** | $5.00 | $5.00 |
| **Total** | **≈ $17.40** | **≈ $22.95** | **≈ $40.95** |

The CPU floor holds whenever average utilisation stays under 1.9% (6.25 vCPU-h ÷ 333.3 vCPU-h) — `inferred`. A cheaper shape exists if 4 GiB really is enough: a custom `1 vCPU / 4 GiB / 8 GB` instance gives the same 166.667 hours at **≈ $11.06** (floor) to **≈ $22.61** (one vCPU saturated), because it halves both the memory and the CPU ceiling (`inferred`, same rates).

### (B) One always-on 4 vCPU / 8 GiB / 50 GiB box, 730 hours a month

**Shape:** `standard-4` (4 vCPU / 12 GiB / 20 GB). The 50 GiB disk is not purchasable at any size, so the extra 30 GB has to live outside the sandbox (R2 at $0.015/GB-month would be about $0.45/month for 30 GB, `pricing-page`) — and a stopped instance cannot mount it back automatically.

Per running hour:
- Memory: 12 × $0.009 = **$0.108/h**
- Disk: 20 × $0.000252 = **$0.00504/h**
- CPU at 100%: 4 × $0.072 = **$0.288/h**; at 25% = **$0.072/h**

| Line | CPU floor | CPU at 25% | CPU at 100% |
|---|---|---|---|
| Memory (730 h) | $78.84 − $0.225 = **$78.62** | $78.62 | $78.62 |
| Disk (730 h) | $3.679 − $0.050 = **$3.63** | $3.63 | $3.63 |
| CPU | **$0.00** | $52.56 − $0.45 = **$52.11** | $210.24 − $0.45 = **$209.79** |
| Workers Paid plan | **$5.00** | $5.00 | $5.00 |
| **Total** | **≈ $87.24** | **≈ $139.35** | **≈ $297.03** |

Durable Object duration stays inside the included 400,000 GB-s for one sandbox: 730 h × 460.8 GB-s/h = 336,384 GB-s, so **$0** (`inferred`, using the 128 MB allocation on the [Durable Objects pricing page](https://developers.cloudflare.com/durable-objects/platform/pricing/) · `pricing-page`). "Always-on" is also not guaranteed: a host restart stops the instance and wipes it (§3).

### (C) One 2 vCPU / 4 GiB / 20 GiB box, three hours a day for 30 days, stopped otherwise

**Shape:** `standard-3` (2 vCPU / 8 GiB / 16 GB), 90 running hours and 630 stopped hours. Stopped hours cost **$0**; the cost of stopping is that the disk is recreated from the image next time unless a snapshot or backup restores it.

| Line | CPU floor | CPU at 25% | CPU at 100% |
|---|---|---|---|
| Memory (90 h) | $6.48 − $0.225 = **$6.26** | $6.26 | $6.26 |
| Disk (90 h) | $0.363 − $0.050 = **$0.31** | $0.31 | $0.31 |
| CPU | **$0.00** | $3.24 − $0.45 = **$2.79** | $12.96 − $0.45 = **$12.51** |
| Workers Paid plan | **$5.00** | $5.00 | $5.00 |
| **Total** | **≈ $11.57** | **≈ $14.36** | **≈ $24.08** |

If the 20 GiB disk matters more than the vCPU count, `standard-4` (4 vCPU / 12 GiB / 20 GB) costs **≈ $14.90** at the CPU floor and **≈ $40.37** saturated (`inferred`, same rates). Persisting the workspace between daily sessions adds R2 storage for a directory backup (16 GB × $0.015 ≈ $0.24/month) or a snapshot whose price is `not-published`.

**What these examples cannot include:** snapshot storage (unpriced), egress beyond 1 TB, Workers requests/CPU beyond the included 10M/30M, Durable Object requests, Logs, and Enterprise discounts. They also assume one wake per task; each cold start adds 1–3 seconds of billed memory and disk (`inferred` from the cold-start figure and the "charges start when a request is sent" rule).

---

## 12. Same word, different meaning

| Word | What Cloudflare means (quoted) | What people often assume elsewhere (`inferred`) | Practical consequence |
|---|---|---|---|
| **sandbox** | A Durable Object that starts a container, or a Dynamic Worker | A long-lived VM you own | The VM dies; the name and its storage survive — "The next `start()` creates a new instance." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| **sleep / stop** | The instance ends; disk and processes are gone | Paused, resumable, still billing a little | Nothing is billed and nothing is kept — "After the instance stops, it is not billed." — same page · `docs-confirmed` |
| **snapshot** | Root filesystem only, immutable, 30-day life, tied to an image | Disk + memory, resumable, permanent | A restore reboots the entrypoint and loses running processes — "The processes that were running do not continue." — same page · `docs-confirmed` |
| **backup** | One directory as one object in your R2 bucket | Provider-managed, retained, restorable in place | Retention is your R2 lifecycle; "R2 keeps each backup until you delete it." — [Back up a directory to R2](https://developers.cloudflare.com/sandbox/files/back-up-a-directory-to-r2/) · `docs-confirmed` |
| **mount** | An S3/R2 prefix over `s3fs`, signed by your Worker | A real block device | No locks, ownership or atomic rename — [S3Mount API](https://developers.cloudflare.com/sandbox/reference/s3-mounts/) · `docs-confirmed` |
| **idle timeout** | How long the instance survives after the Durable Object goes inactive | A CPU-idle detector | Code inside does not count as activity — "Code that runs inside the instance does not count as activity." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| **6 hours** | The maximum inactivity timeout | The maximum runtime | Runtime has no published cap; the timer does — [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed` |
| **instance type** | A fixed vCPU/RAM/disk bundle, chosen at start | Independently sized CPU and RAM | 2 vCPU/4 GiB and 4 vCPU/8 GiB do not exist — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed` |
| **root** | The only privilege level; every process has it | A user you can drop to | A separate user does not restrict files — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed` |
| **free** | The Workers Paid plan's included allotments | A free tier that runs sandboxes | The Free column is "N/A" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page` |
| **scale to zero** | Stop the instance; lose its disk | Stop the process; keep the machine | "This makes it easy to scale to zero" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page` — but §4 is the price of coming back |
| **generally available** | The product is GA; two features inside it are public beta | Everything in it is stable | Snapshots and the scheduling policy can change — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed` |
| **sandbox name** | A routing key, not an identity | A tenant boundary with auth | "It does not show who sent the request." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed` |

---

## 13. Glossary candidates

### 13.1 Cloudflare's own terms (quoted)

| Term | What it means here | Quote and source | Tag |
|---|---|---|---|
| **Sandboxes** | The product name for both environments | "Cloudflare provides two sandbox environments." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) | `docs-confirmed` |
| **Container** | The Linux microVM that runs your image | "Each container instance runs in a Firecracker microVM with its own kernel and network." — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) | `docs-confirmed` |
| **Dynamic Worker** | A Worker created at runtime to run untrusted JS/Python/WASM | "Dynamic Workers create a new Worker at runtime." — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) | `docs-confirmed` |
| **Durable Object** | The named, stateful object that owns a sandbox | "A Linux sandbox is a Durable Object that starts and stops a container." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) | `docs-confirmed` |
| **inactivity timeout** | Grace period after the Durable Object goes inactive, max 6 h | "up to 6 hours" — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) | `docs-confirmed` |
| **sleepAfter** | The legacy `Container` class's 10-minute idle stop | "The `Container` class sets `sleepAfter` to 10 minutes by default." — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) | `docs-confirmed` |
| **snapshot** | Saved writable root filesystem, 30-day life | "`snapshotContainer()` saves the writable root filesystem of a running instance." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) | `docs-confirmed` |
| **DirectoryBackup** | One directory archived into your R2 bucket | "saves one directory as one object in your R2 bucket" — [Back up a directory to R2](https://developers.cloudflare.com/sandbox/files/back-up-a-directory-to-r2/) | `docs-confirmed` |
| **S3Mount** | Bucket prefix mounted with `s3fs`, Worker-signed | "mounts one prefix of a bucket as a directory with `s3fs`" — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) | `docs-confirmed` |
| **sandbox-shim** | Helper binary the SDK needs in your image | "The container image contains the helper binary at `/usr/local/bin/sandbox-shim`." — [@cloudflare/sandbox](https://developers.cloudflare.com/sandbox/reference/) | `docs-confirmed` |
| **outbound handler** | Worker code that intercepts a container's egress | "Outbound handlers let you intercept and modify HTTP traffic from a container with trusted code." — [Handle outbound traffic](https://developers.cloudflare.com/containers/configuration/outbound-traffic/) | `docs-confirmed` |
| **preview** | A web server in a sandbox, reached through your Worker | "The server has no public port, so your Worker forwards requests to it." — [Preview a web application](https://developers.cloudflare.com/sandbox/previews/) | `docs-confirmed` |
| **active CPU** | CPU actually burned; the only compute meter based on utilisation | "CPU usage is based on *active usage* only" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) | `pricing-page` |

### 13.2 Standard computing terms (plain-language, not Cloudflare claims)

Tagged `inferred` as a group: these are general definitions, not statements about Cloudflare. Where a Cloudflare sentence anchors the term, the anchor is given.

- **microVM** — a small virtual machine with its own kernel, started quickly; Cloudflare's own use is quoted in §2.
- **Firecracker** — the open-source microVM monitor Cloudflare names as the boundary — [Lifecycle of a Container](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed` for the claim, `inferred` for the definition.
- **hypervisor** — the layer that runs VMs and keeps them apart. `inferred`
- **kernel** — the core of an operating system; "its own kernel" is the isolation claim.
- **container** — here, a Linux container *inside* the microVM: "Your image runs as a Linux container inside the VM." — same page · `docs-confirmed`
- **root / capabilities** — full administrator rights; Cloudflare says every process has them — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`
- **vCPU-second** — one virtual CPU busy for one second; the CPU billing unit — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`
- **GiB-hour / GB-hour** — one gibibyte (or gigabyte) held for an hour; the memory and disk units — same page · `pricing-page`
- **cold start** — boot from a stopped state; "often be in the 1-3 second range" — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`
- **egress** — traffic leaving the sandbox; priced by destination region — §10.
- **FUSE / `s3fs`** — a filesystem implemented in user space over object storage; the mechanism behind mounts — [S3Mount API](https://developers.cloudflare.com/sandbox/reference/s3-mounts/) · `docs-confirmed` for the mechanism.
- **POSIX** — the Unix file-semantics family; mounts do not fully implement it — [S3Mount API](https://developers.cloudflare.com/sandbox/reference/s3-mounts/) · `docs-confirmed`
- **V8 isolate** — the JavaScript engine's isolated heap; Dynamic Workers' boundary — [Choose a sandbox environment](https://developers.cloudflare.com/sandbox/concepts/) · `docs-confirmed`
- **Durable Object alarm** — a scheduled callback used here to keep or stop a sandbox — [Run code when a sandbox stops](https://developers.cloudflare.com/sandbox/manage/run-code-when-a-sandbox-stops/) · `docs-confirmed`

---

## 14. Gaps, contradictions and gotchas

### Unpublished facts (do not guess in the explainer)

1. **Snapshot storage price.** No line item on the Containers rate card, the Sandboxes pricing page or the snapshots guide. The rate card has four meters only — "Containers are billed for every 10ms that they are actively running at the following rates" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page` — and snapshots are not one of them · `not-published`.
2. **Snapshot restore time.** No figure for starting from a snapshot, only for a cold start from an image · `not-published`.
3. **Sandbox-level region pinning.** Containers document `regions` and `jurisdiction` constraints, but the `durable_object` policy rejects "placement constraints" — [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · `docs-confirmed` — so no sandbox residency control is published · `not-published`.
4. **An SLA for Containers or Sandboxes.** The Workers SLA "applies to use of Workers only" — [Workers SLA](https://www.cloudflare.com/workers-service-level-agreement/) · `docs-confirmed` — and `cloudflare.com/containers-service-level-agreement/` returns HTTP 404 (checked 28 Oct 2026) · `not-published`.
5. **Per-product uptime.** The status page publishes component status, not a Sandboxes uptime percentage · `not-published`.
6. **Audit of what ran inside a sandbox.** No command, file or network audit log for sandbox activity is documented · `not-published`.
7. **GPU, ARM guests, nested virtualisation.** None published; §2 and §5.
8. **Static egress IP or private networking.** None published; §6.
9. **Webhooks and a sandbox-control MCP server.** None published; §7.
10. **Deletion deadline after cancellation.** The DPA requires delete-or-return "following termination or expiry of the Main Agreement", with no number of days — [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · `docs-confirmed` · `not-published` for a deadline.
11. **Compliance scope for this product.** Cloudflare holds SOC 2 Type II, ISO 27001/27701, PCI DSS L1 and a HIPAA AoC, but no public statement says the audit boundary includes Containers or Sandboxes · `not-published` (see §17).
12. **Image storage beyond 50 GB, and Enterprise rates.** Both unpublished · `not-published`.
13. **Maximum session length.** No cap is published; only the inactivity-timeout ceiling · `not-published`.

### Contradictions between Cloudflare's own pages

| # | Conflict | Both sides |
|---|---|---|
| 1 | **Start time: milliseconds or 1–3 seconds?** | Product page: "Sandboxes start in milliseconds, not minutes. Execute code immediately without waiting for cold starts." — [Sandboxes product page](https://www.cloudflare.com/products/sandboxes/) · `docs-confirmed`. Docs: "Container cold starts can often be in the 1-3 second range, but this is dependent on image size and code execution time, among other factors." — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`. A 1–3 s cold start is not milliseconds; the marketing line describes an idealised warm path, not a cold container. |
| 2 | **Is internet access off by default?** | Security guide: "A Container starts with `enableInternet: false` by default, so it cannot reach the Internet." — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`. API reference: "Whether to allow outbound Internet access. Required when you pass `options`." — [Durable Object Container API](https://developers.cloudflare.com/containers/api/durable-object-container/) · `docs-confirmed`. And the Containers guide says the opposite default for the other API: "By default, a Container will allow internet access" — [Handle outbound traffic](https://developers.cloudflare.com/containers/configuration/outbound-traffic/) · `docs-confirmed`. Three statements, two defaults and one required field. Treat egress as explicit per start and verify on your own deployment. |
| 3 | **10 minutes vs no default** | 0.x: "After a period of inactivity (10 minutes by default, configurable via `sleepAfter`), the container stops" — [Sandbox SDK 0.x lifecycle](https://developers.cloudflare.com/sandbox/sdk/concepts/sandboxes/) · `docs-confirmed`. 1.0: "Without a timeout, Cloudflare stops the instance shortly after the Durable Object becomes inactive." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. Not a typo: two products, one word. |
| 4 | **Are the instance maximums hard?** | "All instance size maximums and account limits on this page are defaults and can be increased." — [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed`. Same page: "Maximum vCPU \| 4", "Maximum Memory \| 12 GiB", "Maximum Disk \| 20 GB" — `docs-confirmed`. The first sentence reads as "ask support"; the table reads as "no". |
| 5 | **Does the product still have a code interpreter?** | Product page shows `runCode()` with "Code interpreter built-in" — [Sandboxes product page](https://www.cloudflare.com/products/sandboxes/) · `docs-confirmed`. The 1.0 migration map replaces the whole interpreter with a pattern: "An IPython kernel for each context, or a Dynamic Worker for JavaScript" — [API map](https://developers.cloudflare.com/sandbox/sdk/migrate/api-map/) · `docs-confirmed`. The 0.x feature exists; the 1.0 equivalent is code you write. |
| 6 | **"Free"** | Product page CTA: "Start building for free" — [Sandboxes product page](https://www.cloudflare.com/products/sandboxes/) · `docs-confirmed`. Rate card: the Free column is "N/A" for memory, CPU and disk — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`; and the docs say "Available on Workers Paid plan" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`. You can sign up free; you cannot run a sandbox free. |
| 7 | **Marketing code samples are 0.x** | The product page's examples import `getSandbox` and `export { Sandbox } from '@cloudflare/sandbox'` — [Sandboxes product page](https://www.cloudflare.com/products/sandboxes/) · `docs-confirmed` — while 1.0 "moves the work of the 0.x `Sandbox` class into a Durable Object that you write" — [Changes in Sandbox SDK 1.0](https://developers.cloudflare.com/sandbox/sdk/migrate/changes-in-1-0/) · `docs-confirmed`. Copying the marketing sample gives you the deprecated API. |

### Discrepancies with battleships.dev

battleships is the most detailed third-party record of this product and gets the rate card right, but several of its structural claims describe 0.x or the default scheduling policy, not Sandboxes today.

- **Rates match.** "**Pay-as-you-go (active CPU, provisioned RAM/disk)** (resource): $0.072/vCPU-h, $0.009/GiB-h" — [battleships.dev](https://battleships.dev/data/providers/cloudflare-sandbox.md) · `third-party` — equals Cloudflare's $0.000020/vCPU-s and $0.0000025/GiB-s · `pricing-page`.
- **Stale: "Instance type is per container class (deploy-time), not per sandbox."** — [battleships.dev](https://battleships.dev/data/providers/cloudflare-sandbox.md) · `third-party`. Since 30 September 2026 the `durable_object` policy lets each `start()` choose `instance` — "If you omit `instance`, the Container uses `lite`." — [Scheduling Policies](https://developers.cloudflare.com/containers/configuration/scheduling-policy/) · `docs-confirmed`. Mixed sizes in one Worker are now possible, one class per policy.
- **Stale: a universal "default 10-minute idle tail".** Its gotcha says the default tail "triples the RAM bill" for five-minute sessions — same source · `third-party`. For 1.0 there is no default timeout; for 0.x there is. Both statements are true of different products (§14, row 3).
- **Wrong for sandboxes: "EU data residency" listed under Yes** — same source · `third-party`. Containers support `jurisdiction: eu`; the `durable_object` policy rejects placement constraints — [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · `docs-confirmed`.
- **Unverified: "Max disk is 20 GB (<= 2 GB per GiB RAM)"** — same source · `third-party`. The current limits page states a 20 GB maximum and a *minimum* of 3 GiB RAM per vCPU; no 2 GB-per-GiB disk rule appears · `not-published`.
- **Stale: snapshots "private beta"** — same source · `third-party`. Cloudflare says "Container snapshots are in public beta." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`.
- **Unverified: "Backup TTL default 3 days, but expired objects are not deleted (you need R2 lifecycle rules)"** — [battleships.dev](https://battleships.dev/data/providers/cloudflare-sandbox.md) · `third-party` (emphasis removed). The current Cloudflare page says "R2 keeps each backup until you delete it." — [Back up a directory to R2](https://developers.cloudflare.com/sandbox/files/back-up-a-directory-to-r2/) · `docs-confirmed`. No TTL is documented for `DirectoryBackup`.
- **Overstated: "code interpreter" under Yes** — same source · `third-party`. Removed in 1.0 (§14, row 5).
- **Correct but easy to misread: "SOC 2, HIPAA" under Yes.** Cloudflare holds both company-wide; neither page states that the audit scope covers this product (§17).

### Operational gotchas (the ones that bite)

1. **A running sandbox bills even when nothing happens.** "While an instance runs, Containers bill its memory and disk, whether or not anything inside it does work." — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`. At `standard-4` that is $0.113/h of pure idle.
2. **A long job with no requests gets killed.** "Code that runs inside the instance does not count as activity." — same page · `docs-confirmed`. A two-hour build with no inbound request dies at the timeout unless an alarm pings the Durable Object.
3. **The timeout is lost on restart or deploy.** "The restarted Durable Object starts without an inactivity timeout" — same page · `docs-confirmed`. Set it in the constructor as well as after `start()`, as every example does.
4. **A deploy does not update running sandboxes.** "`start()` throws while an instance runs" — same page · `docs-confirmed`. Stop and start to pick up a new image, and lose the disk doing it.
5. **Stopping wipes the disk.** "Stopping the instance deletes the files on its disk." — [Work with files](https://developers.cloudflare.com/sandbox/files/) · `docs-confirmed`. Snapshot before you stop, or mount a bucket.
6. **Snapshots expire in 30 days and are tied to an image.** §4. A snapshot taken before an image update cannot be restored onto the new image — [Use snapshots](https://developers.cloudflare.com/containers/guides/snapshots/) · `docs-confirmed`.
7. **The disk ceiling is 20 GB, and 50 GiB is not for sale.** §5. Plan external storage for anything larger.
8. **Previews are unauthenticated unless you authenticate them.** "the page can use your application cookies and call its APIs" — [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed`.
9. **Each mount leaks an intercept.** "Each new mount adds an outbound intercept, and `unmount()` does not remove it." — [Mount an R2 bucket](https://developers.cloudflare.com/sandbox/files/mount-an-r2-bucket/) · `docs-confirmed`. Use one sandbox per job rather than remounting.
10. **No region pinning.** §5. If a regulator needs the bytes in the EU, this product cannot promise it today.
11. **Sandbox names are not authorisation.** §9. Derive the name from an authenticated identity, or one user reaches another's files.
12. **0.x has an end date.** "Sandbox SDK 0.x receives bug and security fixes until 2026-12-31" — [Changelog](https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/) · `docs-confirmed`.

### One decisive figure per feature (for the site's tables)

| Site feature | The single decisive figure | Status |
|---|---|---|
| Isolation | 1 Firecracker microVM and 1 kernel per sandbox; every process inside runs with root capabilities | [Lifecycle](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed` |
| Sizes and regions | Max 4 vCPU / 12 GiB / 20 GB; no region pinning for sandboxes | [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed` |
| Lifecycle | 6 h maximum inactivity timeout; no default | [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| Snapshots and forks | Snapshots only, 30-day retention, 20 GB max; no fork, no pause | [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed` |
| Storage | Snapshot 20 GB max / 30 days; directory backup no expiry; mount outlives the instance | [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| Idle timers | Idle but running still bills memory and disk; code inside does not reset the timer | [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed` |
| Reaching it | 0 public ports; inbound is HTTP through your Worker only | [Lifecycle](https://developers.cloudflare.com/containers/concepts/architecture/) · `docs-confirmed` |
| Custom domains | Your own wildcard route and TLS, not a sandbox feature | [Previews](https://developers.cloudflare.com/sandbox/previews/serve-previews-on-their-own-hostnames/) · `docs-confirmed` |
| Outbound network | Off unless `enableInternet: true`; ports 80 and 443 only | [Outbound traffic](https://developers.cloudflare.com/containers/configuration/outbound-traffic/) · `docs-confirmed` |
| Keys and secrets | Credential stays in the Worker; injected per hostname; no sandbox secret store | [Sandbox security](https://developers.cloudflare.com/sandbox/concepts/security/) · `docs-confirmed` |
| Ways to drive it | TypeScript in a Worker only; no hosted REST API | [@cloudflare/sandbox](https://developers.cloudflare.com/sandbox/reference/) · `docs-confirmed` |
| Built-in agents | None preinstalled; guides for Claude Code, Codex, OpenCode and Pi, plus four vendor-loop templates | [Coding agents](https://developers.cloudflare.com/sandbox/coding-agents/) · `docs-confirmed` |
| Teams and accounts | 1,500 concurrent vCPU per account; no per-sandbox IAM | [Limits](https://developers.cloudflare.com/containers/platform/limits/) · `docs-confirmed` |
| Billing model | $0.072/vCPU-h active CPU, $0.009/GiB-h, $0.000252/GB-h, per 10 ms | [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page` |
| Trials and free tiers | None; $5/month plan includes ~$0.73 of container usage | [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page` |
| Company | 5,156 employees; NYSE: NET; no sandbox SLA | [Form 10-K](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party` |

---

## 15. Non-technical usability

**Is there a web dashboard?** Yes, but it is a Cloudflare account dashboard for Workers and containers, not a sandbox workbench. The docs point at it for instance IDs and logs — "Find the instance ID for your Container by running `wrangler containers instances` or in the Cloudflare dashboard" — [SSH](https://developers.cloudflare.com/containers/guides/ssh/) · `docs-confirmed` — and for container logs: "logs from that container will show in both the Containers and Observability sections of the Cloudflare dashboard" — [Containers pricing](https://developers.cloudflare.com/containers/platform/pricing/) · `pricing-page`. There is no documented "create a sandbox" button; `inferred` from the absence of any such step in 121 sandbox pages.

**Can someone use it without writing code?** No, not to start one (`inferred`, with evidence):

- The first step is a Worker project: "A Worker with a Durable Object that starts a container with the Durable Object scheduling policy." — [Preview a web application](https://developers.cloudflare.com/sandbox/previews/) · `docs-confirmed`
- Building the image needs Docker locally: "You must have Docker running locally when you run `wrangler deploy`." — [Open a terminal in the browser](https://developers.cloudflare.com/sandbox/commands/open-a-terminal-in-the-browser/) · `docs-confirmed`
- Driving it needs TypeScript: every guide's control path is `this.ctx.container.exec(...)` or the `Files` class — [Run a Linux command](https://developers.cloudflare.com/sandbox/get-started/) · `docs-confirmed`
- Once a sandbox exists, a non-engineer can use the browser terminal — "Expose a live shell in a Linux sandbox on a web page." — [Open a terminal in the browser](https://developers.cloudflare.com/sandbox/commands/open-a-terminal-in-the-browser/) · `docs-confirmed` — and a preview URL, if whoever built it added authentication.
- **Verdict** (`inferred`): this is a developer platform with a dashboard attached, not a product a non-coder can try in five minutes. The realistic no-code path is "ask an agent to write the Worker", which is exactly what Cloudflare's own agent guides demonstrate.

**What does signup take?** A Cloudflare account, then the Workers Paid plan at "$5 USD per month for an account" — [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) · `pricing-page` — which needs a payment method. No waitlist is documented for Sandboxes · `not-published`. The account model is Cloudflare's standard one: members, roles and API tokens at account level (§9).

**Docs, support, status.**

- Docs quality is high and machine-readable: every page has a `.md` twin and the set publishes `llms.txt` — "Fetch the complete documentation index at: https://developers.cloudflare.com/sandbox/llms.txt" — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`. The weak spot is version drift: the product page still shows 0.x code (§14, row 7).
- Support: "As a Cloudflare customer, you can contact Cloudflare for support via the community portal or by opening a support case, live chat, or phone. Support options can vary depending on your plan." — [Contacting Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) · `docs-confirmed`. The plan table covers Enterprise/Business/Pro/Free and says only "Response times depend on your plan." — same page · `docs-confirmed`; **no response-time commitment for Workers Paid is published** · `not-published`. There is a developer Discord: "Join the Discord community to ask basic troubleshooting questions (mainly focused on the Developer Platform)." — same page · `docs-confirmed`.
- Status: a public page with a Containers component (§17).

**What would trip up a non-engineer** (`inferred` from the quoted behaviour):

1. **"Sandbox" sounds like a place; it is a name plus a disposable VM.** The name survives, the machine does not — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`.
2. **Doing nothing costs money** while the instance is up — $0.113/h on the largest shape.
3. **Stopping deletes the work.** "Stopping the instance deletes the files on its disk." — [Work with files](https://developers.cloudflare.com/sandbox/files/) · `docs-confirmed`.
4. **The sizes are not the ones in the brief.** 2 vCPU/4 GiB and 4 vCPU/8 GiB are unbuildable (§5).
5. **The bill has five lines, not one.** Containers, Workers, Durable Objects, egress, R2 — §10.
6. **"Free" in the marketing is a signup, not a tier.** §14, row 6.
7. **The 30-day snapshot clock is silent.** Nothing warns you; the restore simply fails after expiry — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`.

---

## 16. Concept examples

- **Pause:** not supported. There is no paused state; the instance stops and the disk goes with it — [Sandbox lifetime](https://developers.cloudflare.com/sandbox/concepts/lifetime/) · `docs-confirmed`.
- **Stop:** terminal for the instance, free while stopped, destructive to disk and processes — same page · `docs-confirmed`.
- **Snapshot:** filesystem-only checkpoint with a 30-day life and a 20 GB cap — §4.
- **Backup:** one directory into your own R2 bucket, retained until you delete it — §4.
- **Persistent storage:** a mounted R2/S3 prefix that outlives every instance — §4.
- **Isolation:** one Firecracker microVM and kernel per sandbox, all-root inside — §2.
- **Billing meter:** active vCPU-seconds plus provisioned GiB-hours and GB-hours, per 10 ms, while running — §10.
- **Trial:** none for Containers; the $5 Workers Paid plan includes about $0.73 of container usage — §10.
- **Secrets:** held in the Worker and injected into outbound HTTPS, or signed by the Worker for mounts — §6.
- **Region:** chosen by Cloudflare for latency, not by you — §5.
- **Wake:** a request to the Durable Object; a cold start "often be in the 1-3 second range" — [Containers FAQ](https://developers.cloudflare.com/containers/faq/) · `docs-confirmed`.

---

## 17. The company behind it

Company and terms research checked 28 October 2026. This section is not legal advice; the status observation is a point-in-time reading, not a guarantee.

### Identity, leadership and ownership

- **third-party** — Legal entity and domicile: "The Company was incorporated in Delaware in July 2009. The Company is headquartered in San Francisco, California." — [Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party` (a filing by the company with the SEC; I tag SEC filings `third-party` because they are not a Cloudflare marketing or docs surface). Registered address on the docs' schema: "101 Townsend St", San Francisco, CA 94107 — [Sandboxes overview](https://developers.cloudflare.com/sandbox/) · `docs-confirmed`.
- **docs-confirmed** — Founding: "Mr. Prince is one of our Co-Founders and has served as our Chief Executive Officer and Chair of our Board of Directors since July 2009." — [Cloudflare leadership](https://cloudflare.net/governance/leadership/default.aspx) · `docs-confirmed` (company investor-relations site). `inferred`: July 2009 is the operating start, matching the July 2009 incorporation; no separate "founded on" date is published.
- **docs-confirmed** — Public-company status: "On 13 September 2019, Cloudflare made its debut on the public market as it rang the bell at the New York Stock Exchange and became a publicly traded company (NYSE: NET)." — [About Cloudflare](https://www.cloudflare.com/about-overview/) · `docs-confirmed`; the 10-K cover lists "Class A Common Stock, $0.001 par value NET The New York Stock Exchange" — [Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party`.
- **docs-confirmed** — Current leadership, from the investor-relations page: "Matthew Prince" — "Chief Executive Officer & Co-Chair of the Board of Directors"; "Michelle Zatlyn" — "President & Co-Chair of the Board of Directors"; "Thomas Seifert" — "Chief Financial Officer"; "Alissa Starzak" — "Chief Legal Officer" — [Cloudflare leadership](https://cloudflare.net/governance/leadership/default.aspx) · `docs-confirmed`. Zatlyn's bio adds: "She served as our Head of User Experience from 2009 until she was appointed as our Chief Operating Officer in 2016 and President in 2020." — same page · `docs-confirmed`.
- **docs-confirmed** — Scale: "As of December 31, 2025, we had 5,156 full-time employees, including 2,452 employees located outside of the United States." and "As of December 31, 2025, we had approximately 332,000 paying customers across more than 190 countries." — [Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party`.
- **not-published** — A current, dated, company-confirmed headcount for the Workers or Sandboxes organisation, and any statement of which team owns the product. The 10-K gives company-wide figures only.
- **inferred** — Ownership is dispersed public-market ownership with a dual-class structure: "Our Class B common stock has 10 votes per share and our Class A common stock has one vote per share." — [Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm) · `third-party`. Founders therefore retain voting control disproportionate to economic ownership; the exact percentages are in the proxy statement, which I did not read · `not-published` here.

### Funding

- **third-party** — Pre-IPO venture rounds and the 2019 IPO are historical facts; battleships lists "Total raised: $332M (estimated: Widely cited aggregator figure (Crunchbase-style tally of Cloudflare's pre-IPO venture rounds, Seed through Series E, 2010-2019); not independently re-confirmed against a primary filing in this pass.)" and "Last round: public (IPO), $525M, 2019-09 (confirmed)" — [battleships.dev](https://battleships.dev/data/providers/cloudflare-sandbox.md) · `third-party`. I did not re-verify those totals against a primary filing, so treat them as an aggregator's tally · `not-published` for a company-confirmed cumulative figure in the sources I read.
- **inferred** — Funding is not a stability question for this product in the way it is for a startup: the developer platform is funded by a much larger network business, so the relevant risk is product priority, not solvency.

### Status, SLA, support and security

- **docs-confirmed** — Status page: `cloudflarestatus.com` lists a **Containers** component under "Cloudflare Sites and Services" — [Cloudflare Status components API](https://www.cloudflarestatus.com/api/v2/components.json) · `docs-confirmed`. There is **no separate "Sandboxes" component**: the same API returned 481 components and none named Sandboxes, Workers Sandbox or similar (checked 28 Oct 2026) · `not-published` for sandbox-specific status. At check time the page's summary reported `"indicator": "major"` with `"description": "Partial System Outage"`, and the visible active incident was "Network Performance Issues in Ashburn, IAD" — [Cloudflare Status](https://www.cloudflarestatus.com/) · `docs-confirmed`. `inferred`: a sandbox outage surfaces as a Workers, Durable Objects or Containers incident, and you have to know which to watch.
- **docs-confirmed** — SLA: there is a Workers SLA, and it is narrowly scoped. "This Workers Service Level Agreement (“Workers SLA”) applies to use of Workers only." — [Workers SLA](https://www.cloudflare.com/workers-service-level-agreement/) · `docs-confirmed`. The commitment is an SLO, not a guarantee: "Cloudflare will use commercially reasonable efforts to provide a Monthly Uptime Percentage of 99.99% for Customer’s use of Workers (“Service Level Objective”)." — same page · `docs-confirmed`, with credits of 10/25/50% of the previous 30 days' Workers fees at the <99.99/<99.9/<95% bands — same page · `docs-confirmed`. The claim route runs through the enterprise terms: "all Claim requirements, procedures, limitations, and exclusions set forth in the Enterprise Customer Support and Service Level Agreement shall apply to any Claim submitted pursuant to this Workers SLA." — same page · `docs-confirmed` (`inferred`: the SLO text names no plan, but the credit mechanics assume an Enterprise support relationship). **It does not cover Containers or Sandboxes**: no Containers SLA page exists (`cloudflare.com/containers-service-level-agreement/` returned 404 on 28 Oct 2026), and the Workers SLA's exclusions include "the unavailability or performance degradation of interdependent Cloudflare services upon which the Worker relies" — same page · `docs-confirmed`. **So: no published SLA for the sandbox runtime, on any plan** · `not-published`.
- **docs-confirmed** — Support: "As a Cloudflare customer, you can contact Cloudflare for support via the community portal or by opening a support case, live chat, or phone. Support options can vary depending on your plan." — [Contacting Cloudflare Support](https://developers.cloudflare.com/support/contacting-cloudflare-support/) · `docs-confirmed`. The plan matrix gives support cases to Enterprise, Business and Pro, "Recommended" community/Discord for Free, and chat/emergency phone to Enterprise only — same page · `docs-confirmed`. Workers Paid is not one of the four columns, so which row applies to a $5 developer account is `not-published`; no response-time target is published for it · `not-published`.
- **docs-confirmed** — Security certifications, company-wide. SOC 2: "Cloudflare's SOC 2 Type II report covers security, confidentiality, and availability controls to protect customer data and is available to download from the Cloudflare dashboard." — [SOC 2 Type II](https://www.cloudflare.com/trust-hub/compliance-resources/soc-2/) · `docs-confirmed`. HIPAA: "Cloudflare supports HIPAA compliance and offers a HIPAA-compliant environment for in scope services." — [HIPAA](https://www.cloudflare.com/trust-hub/compliance-resources/hipaa/) · `docs-confirmed`.
- **docs-confirmed** — ISO and PCI, from the DPA's annex: "The implementation of Cloudflare’s ISMS and related security risk management processes have been externally certified to the industry-standard ISO/IEC 27001" and "Cloudflare maintains PCI DSS Level 1 compliance" — [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · `docs-confirmed`.
- **not-published** — Whether the SOC 2, ISO 27001/27701, PCI DSS or HIPAA audit boundary includes Containers or Sandboxes. The HIPAA page says "in scope services" without listing them; the SOC 2 report is only "available to download from the Cloudflare dashboard" — [SOC 2 Type II](https://www.cloudflare.com/trust-hub/compliance-resources/soc-2/) · `docs-confirmed`; and the trust hub's compliance library sits behind a login — "Access Cloudflare's compliance documentation through the dashboard." — [Compliance resources](https://www.cloudflare.com/trust-hub/compliance-resources/) · `docs-confirmed`. **Ask for the report and read its system description before treating any badge as covering this product** (`inferred`).
- **docs-confirmed** — Data protection: a customer DPA exists and is published, with EU SCCs, a sub-processor list mechanism and audit rights — [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · `docs-confirmed`.
- **inferred** — Residency: Containers can be constrained to `eu`, `us` or `fedramp` jurisdictions **only under the default scheduling policy**; Sandboxes use `durable_object`, which rejects placement constraints (§5). So the EU-residency claim does not extend to this product, from the two quoted pages.

### Buyer-relevant terms

The self-serve contract is the Cloudflare Self-Serve Subscription Agreement. Terms below are quoted from it; enterprise customers sign the Enterprise Subscription Terms instead, which I did not read · `not-published` here.

| Question | What the contract says | Source |
|---|---|---|
| Notice before a price change? | "We reserve the right to change the fees that we charge for the Service, at any time in our sole discretion, provided that we give you at least thirty (30) days' prior notice of such changes." | [Terms](https://www.cloudflare.com/terms/) §4.2 · `docs-confirmed` |
| Refunds? | "FEES ARE NONREFUNDABLE. YOU WILL BE BILLED IN FULL FOR THE SUBSCRIPTION TERM IN WHICH YOU CANCEL AND NO REFUNDS WILL BE PROVIDED FOR THE UNUSED PORTION OF SUCH SUBSCRIPTION TERM." | [Terms](https://www.cloudflare.com/terms/) §4.3 · `docs-confirmed` |
| Can I cancel? | "You may terminate your account at any time through the Service's account dashboard." | [Terms](https://www.cloudflare.com/terms/) §8 · `docs-confirmed` |
| Can they suspend or change the service? | "We may at our sole discretion terminate your user account or Suspend or terminate your use or access to the Service at any time, with or without notice for any reason or no reason at all." and "We also reserve the right to modify or discontinue the Service at any time (including, without limitation, by limiting or discontinuing certain features of the Service) without notice to you." | [Terms](https://www.cloudflare.com/terms/) §8 · `docs-confirmed` |
| What happens to my data when I cancel? | "following termination or expiry of the Main Agreement or completion of the Service, at the choice of Customer, delete or return all Personal Data (including copies thereof) processed pursuant to this DPA" — no deadline stated, and the clause covers Personal Data, not sandbox files or snapshots | [Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · `docs-confirmed`; deadline `not-published` |
| Liability ceiling? | "IS LIMITED TO THE AMOUNTS YOU HAVE PAID TO CLOUDFLARE TO ACCESS AND USE THE SERVICE IN THE 12 MONTHS PRIOR TO THE CLAIM." | [Terms](https://www.cloudflare.com/terms/) §12 · `docs-confirmed` |
| Which law and courts? | "governed by the laws of the State of California" and "the state and federal courts located within San Francisco County, California" | [Terms](https://www.cloudflare.com/terms/) §13 · `docs-confirmed` |
| Can they change the terms? | "Cloudflare reserves the right to make modifications to this Agreement at any time. If a revision materially alters your rights we will use reasonable efforts to contact you" | [Terms](https://www.cloudflare.com/terms/) §14 · `docs-confirmed` |
| Free-tier liability? | "We will have no liability for any harm or damage arising out of or in connection with any Free Services." | [Terms](https://www.cloudflare.com/terms/) §2 · `docs-confirmed` |

**The practical reading** (`inferred` from the clauses above): 30 days' notice before a price change, no refunds, cancellation by dashboard click, a 12-month-fees liability cap, California law, and a DPA that promises delete-or-return after termination without saying when. The gap that matters for a sandbox buyer is not the contract but the missing SLA: the only uptime commitment in the stack covers the Worker, not the machine that runs the code.

**The company in one line.** A 17-year-old, 5,156-person public company (NYSE: NET) that added sandboxes as a feature of its developer platform, GA since April 2026 — deep infrastructure, a real security programme and standard contract terms, but no sandbox SLA, no sandbox-specific compliance scope, no region pinning for sandboxes, and a documentation set still half-written for a deprecated SDK (`inferred`, from the quotes above).

---

## Appendix: sources and how they were retrieved

| Source | URL | Retrieved | Note |
|---|---|---|---|
| Sandboxes docs corpus | https://developers.cloudflare.com/sandbox/llms.txt | 28 Oct 2026 | 121 page URLs; each fetched as its `.md` twin |
| Sandbox lifetime | https://developers.cloudflare.com/sandbox/concepts/lifetime/ | 28 Oct 2026 | §3, §4; the page that corrects the earlier note |
| Sandbox security | https://developers.cloudflare.com/sandbox/concepts/security/ | 28 Oct 2026 | §2, §6, §9 |
| Choose a sandbox environment | https://developers.cloudflare.com/sandbox/concepts/ | 28 Oct 2026 | Container vs Dynamic Worker |
| Work with files; snapshots; backups; mounts | https://developers.cloudflare.com/sandbox/files/ and sub-pages | 28 Oct 2026 | §4 |
| Previews | https://developers.cloudflare.com/sandbox/previews/ | 28 Oct 2026 | §6 |
| Manage sandboxes | https://developers.cloudflare.com/sandbox/manage/ | 28 Oct 2026 | §7, §9 |
| Coding agents | https://developers.cloudflare.com/sandbox/coding-agents/ | 28 Oct 2026 | §8 |
| `@cloudflare/sandbox` reference | https://developers.cloudflare.com/sandbox/reference/ | 28 Oct 2026 | §4, §7 |
| Sandbox SDK 0.x | https://developers.cloudflare.com/sandbox/sdk/ | 28 Oct 2026 | Legacy lifecycle, §3, §14 |
| Containers docs corpus | https://developers.cloudflare.com/containers/llms.txt | 28 Oct 2026 | 41 pages, same method |
| Lifecycle of a Container | https://developers.cloudflare.com/containers/concepts/architecture/ | 28 Oct 2026 | §2, §3, §5 |
| Containers pricing | https://developers.cloudflare.com/containers/platform/pricing/ | 28 Oct 2026 | §10, §11 |
| Limits and instance types | https://developers.cloudflare.com/containers/platform/limits/ | 28 Oct 2026 | §4, §5, §10 |
| Scheduling policies | https://developers.cloudflare.com/containers/configuration/scheduling-policy/ | 28 Oct 2026 | §5, §9 |
| Placement | https://developers.cloudflare.com/containers/concepts/placement/ | 28 Oct 2026 | §5 |
| Outbound traffic | https://developers.cloudflare.com/containers/configuration/outbound-traffic/ | 28 Oct 2026 | §6, §14 |
| SSH | https://developers.cloudflare.com/containers/guides/ssh/ | 28 Oct 2026 | §6, §7 |
| Use snapshots | https://developers.cloudflare.com/containers/guides/snapshots/ | 28 Oct 2026 | §4 |
| Containers FAQ | https://developers.cloudflare.com/containers/faq/ | 28 Oct 2026 | Cold start, runtime, Docker, disk |
| Wrangler configuration | https://developers.cloudflare.com/workers/wrangler/configuration/ | 28 Oct 2026 | `durable_object` field restrictions, `max_instances` |
| Workers pricing | https://developers.cloudflare.com/workers/platform/pricing/ | 28 Oct 2026 | $5 plan, requests, Logs |
| Durable Objects pricing | https://developers.cloudflare.com/durable-objects/platform/pricing/ | 28 Oct 2026 | Requests, duration, 128 MB |
| R2 pricing | https://developers.cloudflare.com/r2/pricing/ | 28 Oct 2026 | Backup storage rate |
| Dynamic Workers pricing | https://developers.cloudflare.com/dynamic-workers/pricing/ | 28 Oct 2026 | Per-Worker-per-day rate |
| Budget alerts | https://developers.cloudflare.com/billing/manage/budget-alerts/ | 28 Oct 2026 | Informational only |
| Changelog: GA | https://developers.cloudflare.com/changelog/post/2026-04-13-containers-sandbox-ga/ | 28 Oct 2026 | Maturity quote |
| Changelog: SDK 1.0 | https://developers.cloudflare.com/changelog/post/2026-09-30-sandbox-sdk-1-0/ | 28 Oct 2026 | 1.0 and 0.x support end |
| Changelog: snapshots | https://developers.cloudflare.com/changelog/post/2026-09-30-snapshots/ | 28 Oct 2026 | Public beta status |
| Changelog: scheduling policy | https://developers.cloudflare.com/changelog/post/2026-09-30-durable-object-scheduling-policy/ | 28 Oct 2026 | Public beta status, managed image |
| Product page | https://www.cloudflare.com/products/sandboxes/ | 28 Oct 2026 | Marketing claims, §14 |
| Status components | https://www.cloudflarestatus.com/api/v2/components.json | 28 Oct 2026 | 481 components; Containers present, Sandboxes absent |
| Workers SLA | https://www.cloudflare.com/workers-service-level-agreement/ | 28 Oct 2026 | Scope: Workers only |
| Self-Serve Subscription Agreement | https://www.cloudflare.com/terms/ | 28 Oct 2026 | §4.2, §4.3, §8, §12, §13, §14 |
| Customer DPA | https://www.cloudflare.com/cloudflare-customer-dpa/ | 28 Oct 2026 | Deletion clause, ISO/SOC/PCI claims |
| SOC 2 | https://www.cloudflare.com/trust-hub/compliance-resources/soc-2/ | 28 Oct 2026 | Company-wide certification, report gated |
| HIPAA | https://www.cloudflare.com/trust-hub/compliance-resources/hipaa/ | 28 Oct 2026 | "in scope services", scope not listed |
| Compliance hub | https://www.cloudflare.com/trust-hub/compliance-resources/ | 28 Oct 2026 | Library behind dashboard login |
| Form 10-K FY2025 | https://www.sec.gov/Archives/edgar/data/1477333/000147733326000016/cloud-20251231.htm | 28 Oct 2026 | Entity, listing, headcount, customers |
| Leadership | https://cloudflare.net/governance/leadership/default.aspx | 28 Oct 2026 | Names, titles, founding date |
| About Cloudflare | https://www.cloudflare.com/about-overview/ | 28 Oct 2026 | IPO date |
| battleships.dev record | https://battleships.dev/data/providers/cloudflare-sandbox.md | 28 Oct 2026 | Cross-check only, §14 |

**Method.** Discovery used Context.dev search, and page content was read through Context.dev scrape; every page was then fetched directly over HTTPS as its `.md` variant (Cloudflare publishes one per docs page), and the `llms.txt` index was used to confirm the page inventory rather than a crawl. Quotes were verified by a local script that maps each cited URL to the fetched file, normalises whitespace, HTML tags and Markdown emphasis, and requires the quoted string to appear verbatim; it covered 225 quotations. Four more, on the investor-relations leadership page, were checked against a live Context.dev scrape because that host serves a bot challenge to direct fetches. No native Amp web search was needed and no Composio tool was used. No account, signup, deployment, container or billable action was performed. Prices and lifecycle behaviour are time-sensitive, and the 0.x/1.0 split means any figure needs a version stamp as well as a date.
