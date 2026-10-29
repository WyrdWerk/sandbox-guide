# Security guides: source pack

Desk research for three Botperch guides, checked 2026-10-29 against `origin/main` `911a347`. No provider accounts, credentials or billable sandboxes were used, so every statement below is documentation, not measured behaviour.

`sources.json` holds 112 claims: 97 `docs-confirmed` and 15 `third-party` (OWASP and Simon Willison). Each has a URL, a contiguous quote and a checked date. Quotes were machine-checked against the fetched page text: 100 against saved official Markdown/HTML, and 12 against live TinyFish fetches (OpenAI's site and help centre block `curl`). Normalization removed Markdown links, emphasis markers, HTML tags and blockquote markers, and collapsed whitespace. Nothing else was changed.

## Guide 1: running Claude Code, Codex CLI and Gemini CLI safely

The three tools do not share a default posture, which is the main story:

- **Claude Code:** as of v2.1.283, interactive terminal and VS Code sessions start in **auto mode**, where a classifier reviews actions. Manual mode is the old read-only posture. The Bash sandbox is **off by default** and covers shell commands only; file tools, MCP servers and hooks run outside it. A sandboxed command can read most of the machine by default, including `~/.ssh` and `~/.aws/credentials`, and its network allowlist starts empty.
- **Codex CLI:** the OS-enforced sandbox is on by default, `workspace-write` is the recommended local preset, and network access is off unless enabled. Approval policy (`on-request`, `never`) is a separate layer. `--yolo` is an alias for `--dangerously-bypass-approvals-and-sandbox`, which removes both layers.
- **Gemini CLI:** sandboxing is opt-in (`-s`, `GEMINI_SANDBOX`, or settings). It offers macOS Seatbelt, Docker/Podman, Windows native, gVisor and LXC. The default Seatbelt profile confines writes but allows broad reads and network access.

On `--dangerously-skip-permissions`: Anthropic documents it as equivalent to `bypassPermissions`, warns it "offers no protection against prompt injection or unintended actions", and refuses to start in that mode as root or under `sudo`. The current docs never call it "YOLO mode". Codex and Gemini both do use "yolo", and Gemini has deprecated the bare `--yolo` flag in favour of `--approval-mode=yolo`.

The strongest cross-vendor quote for the guide is that a sandbox is not a security boundary by itself: Anthropic says sandboxing "reduces risk but is not a complete isolation boundary", Codex warns prompt injection "can cause the agent to fetch and follow untrusted instructions", and Gemini says sandboxing "reduces but doesn't eliminate all risks".

## Guide 2: whether it is safe to give an agent your API keys

The sources support a layered answer rather than a yes/no:

- **Keys are bearer credentials.** OpenAI forbids sharing them, recommends expiry and rotation, restricted scopes, hard-enforced spend limits, a key management service, and workload identity federation instead of long-lived keys. Anthropic calls API keys "static secrets" and tells users to store them in a secrets manager, rotate them, and disable or delete leaked keys. Google Cloud recommends key restrictions and rotation. Anthropic and OpenAI both offer short-lived workload identity.
- **Scoping is real but coarse.** Anthropic keys are scoped to a workspace; spend limits are per workspace, cannot be set on the Default Workspace, and never override organization limits. OpenAI user keys can be `Restricted` to read, write or endpoint-specific permissions.
- **Keep keys out of the agent's environment where possible.** Claude Code can deny named credential files and variables, unset them before each sandboxed command, or replace them with a per-session sentinel that a proxy swaps for the real value on allowed hosts. `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` strips credentials from Bash, hooks and stdio MCP servers, but the Claude Code process keeps its own API credentials. Codex Cloud's network secrets give programs a placeholder and the proxy substitutes the real value. Anthropic's cloud sessions keep GitHub credentials out of the session VM entirely.
- **Defaults leak more than buyers expect.** Claude Code's sandbox table says environment variables are "Inherited from Claude Code, including any secrets in its environment", and there is no built-in credential deny list. OWASP warns environment variables are readable by all processes and can appear in logs or dumps.
- **Prompt-level controls are not a security boundary.** OWASP LLM02 says restrictions on returning sensitive data "may not always be honored and could be bypassed via prompt injection".

MCP adds a protocol-level rule worth one line in the guide: token passthrough is an anti-pattern, and servers must not accept tokens issued for another resource.

## Guide 3: prompt injection, and what a sandbox can and cannot stop

- **The problem is not solvable at the prompt layer.** OWASP LLM01 says "it is unclear if there are fool-proof methods of prevention for prompt injection", and defines indirect injection as instructions arriving through websites or files. Its mitigations are least privilege, human approval for high-risk actions, and segregating untrusted content.
- **Excessive agency is the amplifier.** OWASP LLM06 names excessive functionality, excessive permissions and excessive autonomy as root causes. A sandbox reduces the first two; it does not reduce the model's willingness to use whatever it is allowed to use.
- **The lethal trifecta is the buyer-facing test.** Willison: private data + untrusted content + external communication. If an agent has all three, an attacker can "easily trick it into accessing your private data and sending it to that attacker". He is explicit that vendors will not solve this for users.
- **Vendors agree on containment, not prevention.** Anthropic's guidance is structural: put untrusted content only in tool results and tell the model it is untrusted. OpenAI says it sandboxes tool and code execution "to prevent the model from making harmful changes that might be the result of a prompt injection", and that dangerous actions or sensitive transmissions "should not happen silently". Anthropic's own security page says no system is "completely immune".
- **What a sandbox stops:** writes outside the workspace, arbitrary network destinations, credential reads if configured, and actions the harness blocks.
- **What it cannot stop:** the agent using an allowed tool on allowed data, reading secrets left in its environment or workspace, exfiltrating through an allowed broad domain, or being persuaded to do the wrong allowed thing. Claude Code's proxy does not inspect TLS by default and Anthropic warns broad domains such as `github.com` create exfiltration paths. Codex's network proxy does not cover web search, MCP, browser or cloud tasks.
- **MCP guidance is adjacent, not a substitute.** The official security best-practices page covers confused deputy, token passthrough, session hijacking and local proxy risks; it does not give prompt-injection guidance for tool output.

## Recent changes and contradictions

1. **Claude Code's default changed.** Anthropic's sandboxing announcement said "by default, it's read-only"; current docs say auto mode is the built-in starting mode from v2.1.283. Both quotes are in `sources.json` so the guide can say "this changed recently" without guessing a date.
2. **Claude Code's dangerous flag is no longer framed as YOLO.** It is `bypassPermissions`; a newer `CLAUDE_CODE_EVEN_MORE_DANGEROUSLY_SKIP_PERMISSIONS` (v2.1.311+) also removes the last prompt for destructive `rm`. `--restricted` (v2.1.248+) refuses bypass mode.
3. **Codex retired the `untrusted` approval policy.** Existing configs can prevent the client from starting. `--yolo` survives as an alias for full access.
4. **Gemini CLI deprecated `--yolo`** in favour of `--approval-mode=yolo`; YOLO cannot be set as a persistent default, and `security.disableYoloMode` can block it.
5. **Environment variables are both recommended and warned against.** OpenAI tells developers to use `OPENAI_API_KEY` in the environment; OWASP says environment variables are readable by all processes and should be a last resort. Both are true at different layers: fine for a developer's shell, weak for a long-running agent that spawns tools. The guide should say which layer it means.
6. **Codex's devcontainer advice is conditional.** It suggests full access inside a container when the container is the boundary, then warns a malicious project can exfiltrate "anything available inside the devcontainer, including Codex credentials". Whether that is acceptable depends on what is mounted, not on the container alone.
7. **Gemini's "complete process isolation" claim is about containers**, while the same page says sandboxing "reduces but doesn't eliminate all risks" and the default Seatbelt profile allows network and broad reads. Do not generalise the container wording to every sandbox mode.
8. **Anthropic's marketing and its sandbox page have different scopes.** "Security at its core" describes the product programme; the Bash sandbox page describes one control that is "not a complete isolation boundary". The guide should attribute each to its page.

## Gaps

- No first-party measured escape or attack-success numbers for any of the three agents; nothing here is a test result.
- Gemini CLI has no first-party prompt-injection guidance page, and its sandbox docs do not describe credential scrubbing or a credential proxy. Do not claim parity with Claude Code or Codex.
- Anthropic key scoping appears to stop at workspace level; no per-endpoint key scopes were found, unlike OpenAI's `Restricted` keys.
- MCP's security best practices address OAuth and proxy risks, not prompt injection in tool output. There is no official MCP prompt-injection standard to cite.
- Codex Cloud documentation is split between "current" and "Legacy"; the legacy page is marked for deprecation, so isolation wording may change again.
- OpenAI pages return 403 to `curl`; quotes were verified in TinyFish's rendered Markdown instead of raw HTML. That is still a live fetch, but it is one rendering layer removed from the origin HTML.

## Tools and spend

- **TinyFish (Composio):** 9 successful searches and 12 successful `fetch_content` calls. One search call failed with HTTP 400 because of an invalid parameter and was retried with a valid schema.
- **Direct `curl`:** used to fetch official Markdown/HTML for local quote checking (Claude Code, Codex, Gemini CLI, OWASP, Anthropic, Google Cloud, MCP). This is a verification fetch, not a Composio call.
- **Exa, Tavily, Parallel, Firecrawl:** not used.
- **Spend:** $0 in paid research tools; well under the $1 cap. TinyFish's usage endpoints returned HTTP 400, so exact credit consumption could not be read.
