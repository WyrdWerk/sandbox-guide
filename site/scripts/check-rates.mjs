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

async function read(url) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (sandbox-guide price check; +https://github.com/WyrdWerk/sandbox-guide)" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    return { figures: figures(await res.text()) };
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
  if (r.error) {
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

console.log(lines.length ? lines.join("\n") : "Every pricing page shows the same figures as the baseline.");
console.log(`\n${urls.size} pages, ${cards.length} rate cards, ${problems} to look at.`);

if (update) {
  const pages = { ...baseline.pages };
  for (const [url, r] of results) if (r.figures?.length) pages[url] = { figures: r.figures, seen: today };
  writeFileSync(baselineFile, JSON.stringify({ note: "Written by check-rates.mjs --update. Do not edit by hand.", pages }, null, 2) + "\n");
  console.log(`Baseline written to scripts/price-baseline.json.`);
} else if (problems) {
  process.exitCode = 1;
}
