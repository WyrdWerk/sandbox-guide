// Which provider pricing pages have changed since the rate cards were last checked?
//
// Fetches every source URL in src/data/pricing/*.json, collects the money figures on
// each page ($0.05, €5.99 …) and compares them with scripts/price-baseline.json.
// It does not edit any rate card: a person or a bot reads the pages it lists, updates
// the cards by hand, and then runs it with --update to record the new baseline.
//
//   node scripts/check-rates.mjs           report; exits 1 if any page changed or failed
//   node scripts/check-rates.mjs --update  record the current figures as the baseline
//
// See PRICE-CHECK.md at the repository root for the full procedure.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const baselineFile = new URL("scripts/price-baseline.json", root);
const update = process.argv.includes("--update");

const cards = readdirSync(new URL("src/data/pricing/", root))
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(new URL(`src/data/pricing/${f}`, root), "utf8")));

const urls = new Map(); // url -> providers that cite it
for (const card of cards) {
  for (const s of card.sources ?? []) urls.set(s.url, [...(urls.get(s.url) ?? []), card.provider]);
}

function figures(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ");
  const found = text.match(/[$€£]\s?\d[\d,]*(?:\.\d+)?/g) ?? [];
  return [...new Set(found.map((f) => f.replace(/\s|,/g, "")))].sort();
}

// Price feeds (Hostinger's cart catalog, HostUp's product API, Hetzner's price API) are JSON
// with bare numbers beside a currency code, so no $ or € appears. Record each as
// "<nearest id>:<field>=<value><CURRENCY>", in the feed's own units (Hostinger's are cents).
function jsonFigures(data) {
  const out = new Set();
  const isNum = (v) => typeof v === "number" || (typeof v === "string" && /^\d+(\.\d+)?$/.test(v));
  const walk = (node, ctx, path) => {
    if (Array.isArray(node)) return node.forEach((v) => walk(v, ctx, path));
    if (!node || typeof node !== "object") return;
    const here = node.slug ?? node.id ?? node.datacenter ?? ctx;
    const inner = here === ctx ? path : "";
    const cur = node.currency_code ?? node.currencyCode ?? node.currency;
    for (const [k, v] of Object.entries(node)) {
      const key = inner ? `${inner}.${k}` : k;
      if (typeof cur === "string" && /price|amount/i.test(k) && isNum(v)) out.add(`${here}:${key}=${v}${cur}`);
      else if (/^[A-Z]{3}$/.test(k) && isNum(v)) out.add(`${here}:${inner}=${v}${k}`);
      else if (typeof v === "object") walk(v, here, key);
    }
  };
  walk(data, "", "");
  return [...out].sort();
}

async function read(url) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (sandbox-guide price check; +https://github.com/WyrdWerk/sandbox-guide)" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    const body = await res.text();
    // Cloudflare's "Just a moment" bot check: no script gets past it, only a browser.
    if (res.status === 403 && (res.headers.get("cf-mitigated") === "challenge" || body.includes("<title>Just a moment"))) return { blocked: true };
    if (!res.ok) return { error: `HTTP ${res.status}` };
    // A feed that writes prices as text ("$5.35 USD", as OVHcloud's catalog does) is read like a page.
    if (/json/.test(res.headers.get("content-type") ?? "")) {
      const found = jsonFigures(JSON.parse(body));
      return { figures: found.length ? found : figures(body) };
    }
    return { figures: figures(body) };
  } catch (e) {
    return { error: String(e.cause?.code ?? e.name ?? e) };
  }
}

const baseline = existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, "utf8")) : { pages: {} };
const results = await Promise.all([...urls.keys()].map(async (url) => [url, await read(url)]));

const today = new Date().toISOString().slice(0, 10);
let problems = 0;
const lines = [];
for (const [url, r] of results) {
  const who = urls.get(url).join(", ");
  const before = baseline.pages[url]?.figures;
  if (r.blocked) {
    // Not counted: the card's prices must also come from a feed a script can read (see PRICE-CHECK.md).
    lines.push(`BLOCKED  ${who}: ${url} (bot check) — scripts cannot read it; reread it in a browser when the card is OLD`);
  } else if (r.error) {
    problems++;
    lines.push(`FAILED   ${who}: ${url} (${r.error}) — read it in a browser`);
  } else if (r.figures.length === 0) {
    // Limits and concept pages carry no prices; only a pricing page that lost them is a problem.
    if (before?.length) problems++;
    if (before?.length || update) lines.push(`NO PRICES ${who}: ${url} — drawn by JavaScript or moved; read it in a browser`);
  } else if (!before) {
    lines.push(`NEW      ${who}: ${url} (${r.figures.length} figures, no baseline yet)`);
  } else {
    const added = r.figures.filter((f) => !before.includes(f));
    const removed = before.filter((f) => !r.figures.includes(f));
    if (added.length || removed.length) {
      problems++;
      lines.push(`CHANGED  ${who}: ${url}\n         now shows ${added.join(" ") || "nothing new"}; no longer shows ${removed.join(" ") || "nothing"}`);
    }
  }
}

const stale = cards.filter((c) => (Date.parse(today) - Date.parse(c.checkedOn)) / 86_400_000 > 30);
for (const c of stale) lines.push(`OLD      ${c.provider}: rate card last checked ${c.checkedOn}`);

if (lines.length) console.log(lines.join("\n"));
if (!problems && !stale.length && !lines.some((l) => l.startsWith("NEW"))) console.log("Every pricing page shows the same figures as the baseline.");
console.log(`\n${urls.size} pages, ${cards.length} rate cards, ${problems} to look at.`);

if (update) {
  const pages = { ...baseline.pages };
  for (const [url, r] of results) if (r.figures?.length) pages[url] = { figures: r.figures, seen: today };
  writeFileSync(baselineFile, JSON.stringify({ note: "Written by check-rates.mjs --update. Do not edit by hand.", pages }, null, 2) + "\n");
  console.log(`Baseline written to scripts/price-baseline.json.`);
} else if (problems) {
  process.exitCode = 1;
}
