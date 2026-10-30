// Checks the calculator against workloads A, B and C as worked by hand from the
// providers' pricing pages on 2026-10-28 (the `cost` blocks in data/providers/*.json).
// Only cases where the rate card and the hand-worked assumptions agree are listed;
// the expected totals were not produced by this engine.
// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { price, presets, type RateCard } from "./cost.ts";

const card = (id: string): RateCard =>
  JSON.parse(readFileSync(new URL(`../data/pricing/${id}.json`, import.meta.url), "utf8"));

const handWorked: [string, "a" | "b" | "c", number][] = [
  ["blaxel", "a", 27.6], ["blaxel", "b", 247.78], ["blaxel", "c", 17.3],
  ["boat", "a", 20], ["boat", "b", 26.28],
  ["e2b", "a", 27.6], ["e2b", "c", 164.9],
  ["instabox", "b", 28.84],
  ["lizard", "a", 19], ["lizard", "b", 27.85], ["lizard", "c", 19],
  ["morph", "a", 16.67], ["morph", "c", 9.15],
  ["sandboxer", "a", 20], ["sandboxer", "b", 40], ["sandboxer", "c", 20],
  ["boxd", "b", 222.5],
  ["agent37", "b", 30.1],
  ["tensorlake", "a", 22], ["tensorlake", "b", 250], ["tensorlake", "c", 8.25],
  // 1,000 runs at the $0.01 minimum; 730 h capped at $48; 90 on + 640 powered off, capped at $24.
  ["digitalocean", "a", 10], ["digitalocean", "b", 48], ["digitalocean", "c", 24],
  // 1,000 servers × 1 h (rounded up) × $0.0368 + 1,000 IPv4-hours × $0.001; min(730 h × $0.0673, $41.99) + $0.60 IPv4; CPX22 capped at $22.99 + $0.60.
  ["hetzner", "a", 37.8], ["hetzner", "b", 42.59], ["hetzner", "c", 23.59],
];

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
