// Fetch model prices from TokenWatch (WyrdWerk/tokenwatch) and keep a few models'
// zero-data-retention offerings. Writes src/data/models.json, which is committed so
// the build never needs the network. Run: node scripts/fetch-model-prices.mjs
import { writeFileSync } from "node:fs";

const SOURCE = "https://tokenwatch.wyrdwerk.com/pricing.json";
// Same mix TokenWatch uses for tool-using agents: most input is a cached prompt.
const MIX = { inputPct: 5, cacheReadPct: 90, outputPct: 5 };
const MODELS = [
  { id: "deepseek-v4.1-flash", label: "DeepSeek V4.1 Flash", kind: "Cheap open model" },
  { id: "glm-5.3", label: "GLM 5.3", kind: "Strong open model" },
  { id: "gpt-6-luna", label: "GPT-6 Luna", kind: "Small closed model" },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", kind: "Frontier closed model" },
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

const data = await (await fetch(SOURCE)).json();
const models = [];
for (const want of MODELS) {
  const rows = data.models
    .filter((m) => m.id.split("/").pop() === want.id && !m.id.includes(":") && m.zdr === true)
    .map((m) => ({ provider: m.provider_display ?? m.provider, rate: blended(m.pricing), pricing: m.pricing }))
    .filter((r) => r.rate != null && r.rate > 0)
    .sort((a, b) => a.rate - b.rate);
  if (!rows.length) throw new Error(`no zero-retention offering for ${want.id}`);
  const r = (n) => Math.round(n * 10000) / 10000;
  models.push({
    ...want,
    offerings: rows.length,
    lowest: { provider: rows[0].provider, rate: r(rows[0].rate) },
    median: r(median(rows.map((x) => x.rate))),
    url: `https://tokenwatch.wyrdwerk.com/?q=${encodeURIComponent(want.id)}`,
  });
}
const out = { source: SOURCE, generatedAt: data.generated_at, fetchedOn: new Date().toISOString().slice(0, 10), mix: MIX, models };
writeFileSync(new URL("../src/data/models.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(models.map((m) => `${m.id}: ${m.offerings} ZDR, lowest ${m.lowest.rate} (${m.lowest.provider}), median ${m.median} $/M`).join("\n"));
