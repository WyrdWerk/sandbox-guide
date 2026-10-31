// Fetch model prices from TokenWatch (WyrdWerk/tokenwatch) and keep a curated set of
// models' zero-data-retention offerings, from cheap to frontier. Writes
// src/data/models.json, which is committed so the build never needs the network.
// Run: node scripts/fetch-model-prices.mjs
import { writeFileSync } from "node:fs";

const SOURCE = "https://tokenwatch.wyrdwerk.com/pricing.json";
// Agent mix: 5% of tokens are output, and 95% of input tokens are cache reads.
const MIX = { inputPct: 4.75, cacheReadPct: 90.25, outputPct: 5 };
// The models the site prices, each at the median of its zero-data-retention
// offerings. kind is the price tier: "cheap", "mid" or "frontier".
const MODELS = [
  { id: "deepseek-v4.1-flash-1017", label: "DeepSeek V4.1 Flash (1017)", kind: "cheap" },
  { id: "minimax-m3.1-flash", label: "MiniMax M3.1 Flash", kind: "cheap" },
  { id: "gpt-6.1-terra", label: "GPT-6.1 Terra", kind: "mid" },
  { id: "claude-sonnet-5.5", label: "Claude Sonnet 5.5", kind: "mid" },
  { id: "kimi-k3.1-pro", label: "Kimi K3.1 Pro", kind: "mid" },
  { id: "grok-4.7", label: "Grok 4.7", kind: "mid" },
  { id: "kimi-k3", label: "Kimi K3", kind: "mid" },
  { id: "claude-opus-5.5", label: "Claude Opus 5.5", kind: "frontier" },
  { id: "claude-fable-5.1", label: "Claude Fable 5.1", kind: "frontier" },
  { id: "gpt-6-astra", label: "GPT-6 Astra", kind: "frontier" },
];

// TokenWatch's blendedRate (shared/cost.mjs): $/M tokens for a mix.
function blended(p) {
  const input = typeof p.cache_write === "number" && p.cache_write > p.input ? p.cache_write : p.input;
  const cache = p.cache_read ?? p.input;
  if (input == null || p.output == null) return null;
  return (input * MIX.inputPct + cache * MIX.cacheReadPct + p.output * MIX.outputPct) / 100;
}
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Hosts spell one model several ways (DeepSeek-V4.1-Flash-1017, deepseek-v4-1-flash-1017,
// claude-opus-5-5 for claude-opus-5.5).
const norm = (id) => id.split("/").pop().toLowerCase().replace(/v(\d)-(\d)/, "v$1.$2").replace(/-(\d+)-(\d)$/, "-$1.$2");

const data = await (await fetch(SOURCE)).json();
const models = [];
for (const want of MODELS) {
  const rows = data.models
    .filter((m) => norm(m.id) === want.id && !m.id.includes(":") && m.zdr === true)
    .map((m) => ({ provider: m.provider_display ?? m.provider, rate: blended(m.pricing), pricing: m.pricing }))
    .filter((r) => r.rate != null && r.rate > 0)
    .sort((a, b) => a.rate - b.rate);
  if (!rows.length) throw new Error(`no zero-retention offering for ${want.id}`);
  const r = (n) => Math.round(n * 10000) / 10000;
  models.push({
    ...want,
    offerings: rows.length,
    lowest: { provider: rows[0].provider, rate: r(rows[0].rate), pricing: rows[0].pricing },
    median: r(median(rows.map((x) => x.rate))),
    url: `https://tokenwatch.wyrdwerk.com/?q=${encodeURIComponent(want.id)}`,
  });
}
const out = { source: SOURCE, generatedAt: data.generated_at, fetchedOn: new Date().toISOString().slice(0, 10), mix: MIX, models };
writeFileSync(new URL("../src/data/models.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(models.map((m) => `${m.kind} ${m.id}: ${m.offerings} ZDR, lowest ${m.lowest.rate} (${m.lowest.provider}), median ${m.median} $/M`).join("\n"));
