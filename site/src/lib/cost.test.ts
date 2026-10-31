// Checks the calculator against workloads A, B and C as worked by hand from the
// providers' pricing pages on 2026-10-28 (the `cost` blocks in data/providers/*.json).
// Only cases where the rate card and the hand-worked assumptions agree are listed;
// the expected totals were not produced by this engine.
// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { price, presets, modelCost, modelCostRange, subscriptionUse, type RateCard } from "./cost.ts";

const card = (id: string): RateCard =>
  JSON.parse(readFileSync(new URL(`../data/pricing/${id}.json`, import.meta.url), "utf8"));

const handWorked: [string, "a" | "b" | "c", number][] = [
  ["blaxel", "a", 27.6], ["blaxel", "b", 247.78], ["blaxel", "c", 17.3],
  ["boat", "a", 20], ["boat", "b", 26.28],
  ["e2b", "a", 27.6], ["e2b", "c", 164.9],
  // 4 × $0.004 × 730 + 8 × $0.00225 × 730 + (50 − 20 free) GiB × $0.00011 × 730, over the $20 Pro credit.
  ["instabox", "b", 27.23],
  ["lizard", "a", 19], ["lizard", "b", 27.85], ["lizard", "c", 19],
  ["morph", "a", 16.67], ["morph", "c", 9.15],
  ["sandboxer", "a", 20], ["sandboxer", "b", 40], ["sandboxer", "c", 20],
  ["boxd", "b", 222.5],
  ["agent37", "b", 30.1],
  // C: 0.2 core × $0.07 × 90 + 4 × $0.015 × 90 + 20 × $0.0002 × 90 + 640 h × 20 GB × $0.07 / 720.
  ["tensorlake", "a", 22], ["tensorlake", "b", 250], ["tensorlake", "c", 8.26],
  // Active CPU + memory + decimal-GB disk at $0.08 / 720 (first 10 GiB free while running), less 25 vCPU-h and 100 GiB-h a month.
  ["runtime", "a", 7.79], ["runtime", "b", 53.21], ["runtime", "c", 3.58],
  // 1,000 runs at the $0.01 minimum; 730 h capped at $48; 90 on + 640 powered off, capped at $24.
  ["digitalocean", "a", 10], ["digitalocean", "b", 48], ["digitalocean", "c", 24],
  // 1,000 servers × 1 h (rounded up) × $0.0368 + 1,000 IPv4-hours × $0.001; min(730 h × $0.0673, $41.99) + $0.60 IPv4; CPX22 capped at $22.99 + $0.60.
  ["hetzner", "a", 37.8], ["hetzner", "b", 42.59], ["hetzner", "c", 23.59],
  // One KVM 2 plan runs all 1,000 tasks back to back; KVM 4 for 4 vCPU; KVM 2 billed for the month, on or off.
  ["hostinger", "a", 24.49], ["hostinger", "b", 42.99], ["hostinger", "c", 24.49],
  // Metered $8.82 under the $50 Hobby minimum; $196.21 − $13.22 allowances, over the minimum; C fits the allowances but Free keeps no stopped disk, so the Hobby minimum.
  ["freestyle", "a", 50], ["freestyle", "b", 179.85], ["freestyle", "c", 50],
  // One VPS XS plan runs all 1,000 tasks; VPS SM for 4 vCPU / 8 GB / 100 GB; VPS XS billed for the month.
  ["hostup", "a", 5.72], ["hostup", "b", 11.55], ["hostup", "c", 5.72],
  ["ovhcloud", "a", 5.35], ["ovhcloud", "b", 10], ["ovhcloud", "c", 5.35],
  ["lightsail", "a", 5.38], ["lightsail", "b", 82.42], ["lightsail", "c", 23.54],
  ["linode", "a", 36], ["linode", "b", 48], ["linode", "c", 24],
  ["vultr", "a", 29.76], ["vultr", "b", 40], ["vultr", "c", 20],
  ["contabo", "a", 6.6], ["contabo", "b", 6.6], ["contabo", "c", 6.6],
  ["scaleway", "a", 29.49], ["scaleway", "b", 44.15], ["scaleway", "c", 8.2],
];

const task = (vcpu: number, ram: number, minutes: number) =>
  ({ vcpu, ram, disk: 10, mode: "tasks", tasks: 1, taskMinutes: minutes, machines: 1, hoursPerDay: 0, daysPerMonth: 30, keepDisk: false, busy: 0, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 }) as const;

test("plan gates, minimums and fixed shapes from the providers' own pages", () => {
  // Boat's xlarge needs the $100 plan; InstaBox's 16/32 needs Builder.
  assert.equal(price(card("boat"), task(16, 32, 60)).total, 100);
  assert.equal(price(card("instabox"), task(16, 32, 60)).plan, "Builder");
  // DigitalOcean: a one-second run on the $1-an-hour 32/64 size is billed 60 seconds, more than the $0.01 floor.
  assert.ok(Math.abs(price(card("digitalocean"), task(32, 64, 1 / 60)).total - 1 / 60) < 1e-4);
  // Vercel: memory bills a whole minute, and 2 vCPU comes with 4 GB even when 1 GB is asked for.
  const mem = price(card("vercel-sandbox"), task(2, 1, 1 / 60)).lines.find((l) => l.label === "Memory")!;
  assert.ok(Math.abs(mem.amount - (1 / 60) * 4 * 0.0212) < 1e-9);
  // Blaxel: 6 cores come with 16 GB ($0.6624 an hour); 7 cores are not documented.
  assert.ok(Math.abs(price(card("blaxel"), task(6, 8, 60)).total - 0.6624) < 1e-9);
  assert.equal(price(card("blaxel"), task(7, 8, 60)).feasible, false);
  // Tensorlake's Pro rates: the browser preset is $197.60 of Pro usage, inside its $250 fee, against $331 on prepaid credits.
  const tl = price(card("tensorlake"), presets.browser.workload);
  assert.equal(tl.plan, "Pro");
  assert.ok(Math.abs(tl.usage - 197.6) < 0.01);
});

test("the model line counts the days a month the machines work", () => {
  const models = [{ id: "m", label: "M", kind: "", offerings: 1, lowest: { provider: "x", rate: 0.5 }, median: 1, url: "" }];
  // Team: 100 requests × 900k tokens × 20 working days = 1,800M tokens; personal: 30 × 160k × 30 days = 144M.
  assert.equal(modelCost({ ...presets.team.workload, model: "m" }, models)?.millions, 1800);
  assert.equal(modelCost({ ...presets.personal.workload, model: "m" }, models)?.millions, 144);
});

test("the model range prices one workload at every model, cheapest to dearest", () => {
  // Blended $/M at 4.75% fresh input / 90.25% cache read / 5% output, from TokenWatch's
  // zero-retention list prices on 2026-10-31 (fresh input billed at cache write when that is dearer):
  // Grok 4.7 (xAI):          2 × 0.0475 + 0.5 × 0.9025 + 6 × 0.05 = 0.84625 → 0.8463
  // Kimi K3.1 Pro (Moonshot): 2 × 0.0475 + 0.2 × 0.9025 + 10 × 0.05 = 0.7755
  // GPT-6.1 Terra (Azure):   1.5 × 0.0475 + 0.06 × 0.9025 + 6 × 0.05 = 0.4254
  // Claude Fable 5.1 (one zero-retention host): 10 × 0.0475 + 0.15 × 0.9025 + 50 × 0.05 = 3.1104
  const m = (id: string, kind: string, median: number) => ({ id, label: id, kind, offerings: 1, lowest: { provider: "x", rate: median }, median, url: "" });
  const models = [m("grok", "mid", 0.8463), m("fable", "frontier", 3.1104), m("kimi", "mid", 0.7755), m("terra", "mid", 0.4254)];
  const r = modelCostRange(presets.personal.workload, models)!;
  // Personal agent: 30 messages × 160k tokens × 30 days = 144M tokens.
  assert.equal(r.millions, 144);
  // 144 × 0.4254 = $61.26 (Terra) up to 144 × 3.1104 = $447.90 (Fable); mid tops out at 144 × 0.8463 = $121.87 (Grok).
  assert.equal(r.min.model.id, "terra");
  assert.ok(Math.abs(r.min.cost - 61.2576) < 1e-9);
  assert.equal(r.max.model.id, "fable");
  assert.ok(Math.abs(r.max.cost - 447.8976) < 1e-9);
  assert.equal(r.byKind.mid?.low.model.id, "terra");
  assert.equal(r.byKind.mid?.high.model.id, "grok");
  assert.ok(Math.abs(r.byKind.mid!.high.cost - 121.8672) < 1e-9);
  assert.equal(r.byKind.frontier?.low.model.id, "fable");
  assert.equal(r.byKind.cheap, undefined);
  // No model line for a workload without tokens.
  assert.equal(modelCostRange(presets.browser.workload, models), null);
});

test("a plan already paid adds nothing per token, and counts against its allowance", () => {
  // ChatGPT Plus serves about 159M GPT-6 Astra tokens a month (Real API Pricing, measured 2026-09-11).
  const subs = [{ id: "plus", plan: "ChatGPT Plus", model: "GPT-6 Astra", fee: 20, allowance: 159, confidence: "high", measured: "", catch: "" }];
  const use = subscriptionUse({ ...presets.personal.workload, model: "plus" }, subs)!;
  // 144M of 159M = 90.6%: inside the plan, but close to its limit. Extra is $0, not null.
  assert.equal(use.extra, 0);
  assert.ok(Math.abs(use.share - 144 / 159) < 1e-12);
  // The team's 1,800M tokens are over eleven times the allowance.
  assert.ok(subscriptionUse({ ...presets.team.workload, model: "plus" }, subs)!.share > 11);
  // A per-token model id is not a plan.
  assert.equal(subscriptionUse(presets.personal.workload, subs), null);
});

test("one storage allowance covers disk kept while stopped", () => {
  // Five 4 vCPU / 8 GiB / 40 GiB machines, 160 h each: 800 vCPU-h, 6,400 GiB-h memory, 146,000 GiB-h disk over the month.
  // (3,200 − 200) × $0.04032 + (6,400 − 400) × $0.0129 + (146,000 − 60,000) × $0.000086 = $120.96 + $77.40 + $7.396.
  assert.ok(Math.abs(price(card("freestyle"), presets.team.workload).total - 205.76) < 0.01);
});

for (const [id, key, expected] of handWorked) {
  test(`${id} workload ${key.toUpperCase()} matches the hand-worked $${expected}`, () => {
    assert.ok(Math.abs(price(card(id), presets[key].workload).total - expected) < 0.01);
  });
}

test("limits a workload breaks are reported, not silently priced", () => {
  // E2B Hobby sessions end after an hour and its disk stops at 10 GiB.
  const q = price(card("e2b"), presets.b.workload);
  assert.equal(q.feasible, false);
  assert.ok(q.problems.some((p) => p.includes("10 GiB")));
});

test("Modal is priced per vCPU at half its per-core rate", () => {
  // 166.67 h × 2 vCPU × $0.070956 + 166.67 h × 4 GiB × $0.024012 = $39.66 before the $30 Starter credit.
  const q = price(card("modal"), presets.a.workload);
  assert.ok(Math.abs(q.usage - 39.66) < 0.01);
});
