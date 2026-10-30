// The cost calculator. One engine prices every provider from its rate card in
// src/data/pricing/<id>.json, and shows its arithmetic line by line, so a reader
// can redo any figure with the provider's pricing page open.
//
// It runs at build time (use-case pages print a fixed table) and in the browser
// (the calculator and the side-by-side page reprice as you change the inputs).

export const MONTH_HOURS = 730;

/** What someone wants to run, in the reader's terms. */
export interface Workload {
  vcpu: number;
  ram: number; // GiB
  disk: number; // GiB
  /** "tasks": many short throwaway runs. "machines": machines you keep. */
  mode: "tasks" | "machines";
  tasks: number; // tasks a month
  taskMinutes: number;
  machines: number;
  hoursPerDay: number; // 24 means always on
  daysPerMonth: number;
  /** Machines mode only: the files must still be there next session. */
  keepDisk: boolean;
  /** Share of running time the CPU is actually working, 0 to 1. */
  busy: number;
  /**
   * Machines mode only: share of the running hours the machine must be awake.
   * Providers that put an idle machine to sleep and wake it on a request bill
   * only this share; the rest is billed as stopped time.
   */
  awake: number;
  /** Optional model estimate: a model id from data/models.json, or "" for none. */
  model: string;
  /** Messages or tasks a day that call the model. */
  messagesPerDay: number;
  /** Thousands of tokens per message, mostly a re-sent cached prompt. */
  kTokens: number;
}

/** A model's price per million tokens at TokenWatch's agent mix, zero-retention offerings only. */
export interface ModelPrice {
  id: string;
  label: string;
  kind: string;
  offerings: number;
  lowest: { provider: string; rate: number };
  median: number;
  url: string;
}

/** Monthly model cost at the median and the lowest zero-retention price, over 30 days. */
export function modelCost(w: Workload, models: ModelPrice[]) {
  const m = models.find((x) => x.id === w.model);
  if (!m || w.messagesPerDay <= 0 || w.kTokens <= 0) return null;
  const millions = (w.messagesPerDay * 30 * w.kTokens) / 1000;
  return { model: m, millions, median: millions * m.median, lowest: millions * m.lowest.rate };
}

export interface Shape {
  name: string;
  vcpu: number;
  ram: number;
  /** Disk that comes with the shape, or the most it allows. */
  disk: number;
  /** A flat hourly price for the whole shape. Omit when the shape is priced by its parts. */
  hourly?: number;
  /** The most one machine of this shape costs in a month: hourly billing stops at this price. */
  monthly?: number;
}

export interface Plan {
  name: string;
  fee: number;
  /** Dollars of usage the plan includes each month (a fee that comes back as usage counts here). */
  credit?: number;
  /** Monthly free allowances, in resource hours, before any rate applies. */
  allowance?: { cpuHours?: number; ramHours?: number; diskHours?: number; mcuHours?: number };
  /** Overage is bought in packs of this many dollars rather than billed exactly. */
  pack?: number;
  maxSessionHours?: number;
  maxDisk?: number;
  maxVcpu?: number;
  maxRam?: number;
  /** Usage beyond the allowance is refused rather than billed (a free tier that pauses). */
  capped?: boolean;
  /** Shapes this plan may not use. */
  excludesShapes?: string[];
  /** The plan cannot keep a stopped machine's disk (no persistent machines). */
  noKeep?: boolean;
  note?: string;
}

export interface RateCard {
  provider: string;
  checkedOn: string;
  /** One sentence: how this provider turns time into money. */
  summary: string;
  /** Per-resource rates, USD per hour. Omitted parts cost nothing extra. */
  cpu?: { rate: number; billing: "allocated" | "active"; floor?: number; unit?: string };
  ram?: { rate: number; billing?: "allocated" | "requested" };
  /** Morph-style unit: the hourly price is the largest of vCPU, RAM/ramPer and disk/diskPer. */
  mcu?: { rate: number; ramPer: number; diskPer: number };
  disk?: {
    /** USD per GiB-hour while running. */
    running?: number;
    /** USD per GiB-hour while stopped with the disk kept. */
    stopped?: number;
    /** GiB free before the disk rate applies. */
    included?: number;
    /** Apply `included` only while running. */
    includedRunningOnly?: boolean;
    /** Priced in decimal GB: GiB are converted at 1.0737. */
    decimalGB?: boolean;
    /** Kept-disk storage that replaces both rates when the files must persist (a volume). */
    persistentMonthly?: number;
    /** The stopped rate is charged on disk plus memory (a memory snapshot). */
    stoppedIncludesRam?: boolean;
    /** Disk is billed at the chosen size's full disk, not the disk asked for. */
    shapeSize?: boolean;
    /** Extra disk beyond a shape's own, bought as a volume, USD per GiB-month. */
    extraMonthly?: number;
  };
  shapes?: Shape[];
  /** A stopped machine keeps billing at its shape's hourly price (a virtual server reserved until deleted). */
  billedWhileStopped?: boolean;
  /** Tasks mode: each run is billed at least this much, in USD (a per-machine minimum charge). */
  minimumPerRun?: number;
  /** Tasks mode: each run is billed in whole hours, rounded up (a server that lives ten minutes bills one hour). */
  wholeHours?: boolean;
  /** Sold only as whole monthly plans: each machine costs its shape's monthly price, and tasks share as few plans as their hours need. */
  monthlyPlans?: boolean;
  /** A fee for every machine for as long as it exists, such as a public IPv4, capped at a monthly price. */
  perMachine?: { label: string; hourly: number; monthly: number };
  /** How the provider puts an idle machine to sleep and wakes it. Omit when it does not. */
  sleeps?: string;
  /** What happens to the files when a machine stops between sessions. */
  between: "kept" | "lost";
  /** Said when `between` is "lost" and the reader needs their files back. */
  lostNote?: string;
  maxDisk?: number;
  maxVcpu?: number;
  maxRam?: number;
  /** Outbound data, USD per GiB beyond `included`. Not priced by the calculator; shown on the
   *  outbound-network feature. null means no price is published. */
  egress?: { perGiB: number | null; included?: string; note: string; url: string };
  plans: Plan[];
  /** Always shown under the result: credits, minimums, things not priced. */
  notes: string[];
  sources: { label: string; url: string }[];
}

export interface Line {
  label: string;
  math: string;
  amount: number;
}

export interface Quote {
  provider: string;
  plan: string;
  shape: string;
  lines: Line[];
  usage: number;
  total: number;
  feasible: boolean;
  problems: string[];
  notes: string[];
}

const money = (n: number) =>
  n >= 100 ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  : `$${n.toFixed(2)}`;
const rate = (n: number) => `$${+n.toPrecision(4)}`;
const num = (n: number) => (Number.isInteger(n) ? n.toLocaleString("en-US") : (+n.toFixed(2)).toLocaleString("en-US"));

export const formatMoney = money;

/** Hours each machine runs, total running machine-hours, and the longest single session. */
export function hoursOf(w: Workload, canSleep = false) {
  if (w.mode === "tasks") {
    const run = (w.tasks * w.taskMinutes) / 60;
    return { run, stopped: 0, machines: 0, session: w.taskMinutes / 60, keep: false };
  }
  const always = w.hoursPerDay >= 24;
  const perMachine = always ? MONTH_HOURS : Math.min(MONTH_HOURS, w.hoursPerDay * w.daysPerMonth);
  const awake = canSleep ? Math.min(1, Math.max(0, w.awake)) : 1;
  const stopped = w.keepDisk ? (MONTH_HOURS - perMachine * awake) * w.machines : 0;
  return {
    run: perMachine * awake * w.machines,
    stopped,
    machines: w.machines,
    session: always ? MONTH_HOURS : w.hoursPerDay,
    keep: w.keepDisk,
  };
}

function pickShape(card: RateCard, w: Workload, plan: Plan): { shape?: Shape; extraDisk: number; problem?: string } {
  if (!card.shapes) return { extraDisk: 0 };
  const allowed = card.shapes.filter((s) => !plan.excludesShapes?.includes(s.name));
  const fits = allowed.filter((s) => s.vcpu >= w.vcpu && s.ram >= w.ram);
  if (fits.length === 0) {
    const biggest = allowed[allowed.length - 1];
    return { shape: biggest, extraDisk: 0, problem: `No size has ${w.vcpu} vCPU and ${w.ram} GiB; the largest is ${biggest.vcpu} vCPU / ${biggest.ram} GiB.` };
  }
  // Cheapest shape that fits, counting any volume needed for extra disk.
  const hourOf = (s: Shape) =>
    s.hourly ?? (card.cpu ? card.cpu.rate * s.vcpu : 0) + (card.ram ? card.ram.rate * s.ram : 0);
  const options = fits
    .map((s) => {
      const short = Math.max(0, w.disk - s.disk);
      if (short > 0 && !card.disk?.extraMonthly) return null;
      const extra = short * (card.disk?.extraMonthly ?? 0);
      return { s, short, cost: (card.monthlyPlans && s.monthly !== undefined ? s.monthly : Math.min(hourOf(s) * MONTH_HOURS, s.monthly ?? Infinity)) + extra };
    })
    .filter((o): o is { s: Shape; short: number; cost: number } => o !== null)
    .sort((a, b) => a.cost - b.cost);
  if (options.length === 0) {
    const roomiest = fits.reduce((a, b) => (b.disk > a.disk ? b : a));
    return { shape: roomiest, extraDisk: 0, problem: `No size with ${w.vcpu} vCPU allows ${w.disk} GiB of disk; the most is ${roomiest.disk} GiB on ${roomiest.name}.` };
  }
  return { shape: options[0].s, extraDisk: options[0].short };
}

function priceOnPlan(card: RateCard, w: Workload, plan: Plan): Quote {
  const h = hoursOf(w, Boolean(card.sleeps));
  const lines: Line[] = [];
  const problems: string[] = [];
  const notes: string[] = [];
  const { shape, extraDisk, problem } = pickShape(card, w, plan);
  if (problem) problems.push(problem);
  if (card.sleeps && w.mode === "machines" && w.awake < 1) {
    notes.push(`Sleeps when idle: billed for ${Math.round(w.awake * 100)}% of the running hours. ${card.sleeps}`);
  }

  const vcpu = shape ? shape.vcpu : w.vcpu;
  const ramBilled = card.ram?.billing === "requested" || !shape ? w.ram : shape.ram;
  const diskSize =
    shape && (card.disk?.shapeSize || (!card.disk?.running && !card.disk?.stopped && !card.disk?.persistentMonthly))
      ? Math.min(shape.disk, Math.max(w.disk, shape.disk))
      : w.disk;
  const runH = num(h.run);

  // Limits that make the workload impossible as asked.
  const maxDisk = plan.maxDisk ?? card.maxDisk;
  if (maxDisk !== undefined && w.disk > maxDisk && !problem) problems.push(`${w.disk} GiB of disk is over the ${maxDisk} GiB limit.`);
  const maxVcpu = plan.maxVcpu ?? card.maxVcpu;
  if (maxVcpu !== undefined && w.vcpu > maxVcpu) problems.push(`${w.vcpu} vCPU is over the ${maxVcpu} vCPU limit.`);
  const maxRam = plan.maxRam ?? card.maxRam;
  if (maxRam !== undefined && w.ram > maxRam) problems.push(`${w.ram} GiB of memory is over the ${maxRam} GiB limit.`);
  if (plan.maxSessionHours !== undefined && h.session > plan.maxSessionHours) {
    problems.push(
      h.session >= MONTH_HOURS
        ? `Sessions end after ${plan.maxSessionHours} hour${plan.maxSessionHours === 1 ? "" : "s"}, so an always-on machine has to be restarted by your own code.`
        : `Sessions end after ${plan.maxSessionHours} hour${plan.maxSessionHours === 1 ? "" : "s"}, shorter than the ${num(h.session)} hours asked for.`,
    );
  }
  if (plan.noKeep && h.keep && h.stopped > 0) {
    problems.push(`${plan.name} does not keep a stopped machine's disk.`);
  }
  if (h.keep && card.between === "lost") {
    problems.push(card.lostNote ?? "Stopping deletes the machine's files; keeping them needs a snapshot or separate storage.");
  }

  if (card.monthlyPlans && shape?.monthly !== undefined) {
    // Tasks run one after another on a plan, so they need one plan per 730 hours of work.
    const plans = w.mode === "tasks" ? Math.max(1, Math.ceil(h.run / MONTH_HOURS)) : h.machines;
    lines.push({
      label: `Monthly plan (${shape.name})`,
      math: `${plans} × ${money(shape.monthly)} a month${w.mode === "tasks" ? `, running ${runH} h of tasks back to back` : ""}`,
      amount: plans * shape.monthly,
    });
  } else if (shape?.hourly !== undefined) {
    const r = shape.hourly;
    const runHours = Math.ceil(h.session - 1e-9);
    if (w.mode === "tasks" && card.wholeHours && runHours > h.session) {
      lines.push({
        label: `Machine time (${shape.name})`,
        math: `${num(w.tasks)} runs × ${runHours} h each, rounded up × ${rate(r)}`,
        amount: w.tasks * runHours * r,
      });
    } else {
      lines.push({ label: `Machine time (${shape.name})`, math: `${runH} h × ${rate(r)}`, amount: h.run * r });
    }
    const stoppedBilled = card.billedWhileStopped ? h.stopped : 0;
    if (stoppedBilled > 0) {
      lines.push({ label: "Stopped, still billed", math: `${num(stoppedBilled)} h × ${rate(r)}`, amount: stoppedBilled * r });
    }
    const perRun = h.session * r;
    if (w.mode === "tasks" && card.minimumPerRun && perRun < card.minimumPerRun) {
      lines.push({
        label: "Minimum charge per run",
        math: `${num(w.tasks)} runs × (${rate(card.minimumPerRun)} − ${rate(perRun)})`,
        amount: w.tasks * (card.minimumPerRun - perRun),
      });
    }
    const billed = (h.run + stoppedBilled) * r;
    if (w.mode === "machines" && shape.monthly !== undefined && billed > shape.monthly * h.machines) {
      lines.push({
        label: "Monthly price cap",
        math: `${h.machines} × ${money(shape.monthly)} a month`,
        amount: shape.monthly * h.machines - billed,
      });
    }
    const pm = card.perMachine;
    if (pm) {
      if (w.mode === "tasks") {
        const each = card.wholeHours ? runHours : h.session;
        lines.push({ label: pm.label, math: `${num(w.tasks)} runs × ${num(each)} h × ${rate(pm.hourly)}`, amount: w.tasks * each * pm.hourly });
      } else {
        const perMachineHours = (h.run + stoppedBilled) / Math.max(1, h.machines);
        const each = Math.min(pm.monthly, perMachineHours * pm.hourly);
        lines.push({
          label: pm.label,
          math: `${h.machines} × min(${money(pm.monthly)}, ${num(perMachineHours)} h × ${rate(pm.hourly)})`,
          amount: h.machines * each,
        });
      }
    }
  } else if (card.mcu) {
    const m = card.mcu;
    // Each dimension rounds up to whole units, with at least one unit an hour.
    const units = Math.max(1, Math.ceil(vcpu), Math.ceil(w.ram / m.ramPer), Math.ceil(w.disk / m.diskPer));
    lines.push({
      label: "Compute units",
      math: `${runH} h × max(1, ${vcpu}, ⌈${w.ram}/${m.ramPer}⌉, ⌈${w.disk}/${m.diskPer}⌉) = ${num(h.run * units)} units × ${rate(m.rate)}`,
      amount: h.run * units * m.rate,
    });
  } else {
    if (card.cpu) {
      const c = card.cpu;
      if (c.billing === "active") {
        const used = Math.max(c.floor ?? 0, vcpu * w.busy);
        lines.push({
          label: "CPU, while working",
          math: `${runH} h × ${num(used)} vCPU busy × ${rate(c.rate)}`,
          amount: h.run * used * c.rate,
        });
      } else {
        lines.push({ label: "CPU", math: `${runH} h × ${vcpu} vCPU × ${rate(c.rate)}`, amount: h.run * vcpu * c.rate });
      }
    }
    if (card.ram) {
      lines.push({ label: "Memory", math: `${runH} h × ${ramBilled} GiB × ${rate(card.ram.rate)}`, amount: h.run * ramBilled * card.ram.rate });
    }
  }

  // Disk.
  const d = card.disk;
  if (d) {
    const unit = d.decimalGB ? 1.073741824 : 1;
    const size = diskSize * unit;
    const label = d.decimalGB ? `${num(size)} GB` : `${num(size)} GiB`;
    if (h.keep && d.persistentMonthly) {
      const months = h.machines;
      lines.push({ label: "Kept disk (volume)", math: `${h.machines} × ${label} × ${rate(d.persistentMonthly)} a month`, amount: months * size * d.persistentMonthly });
    } else {
      if (d.running) {
        const billed = Math.max(0, size - (d.included ?? 0) * unit);
        if (billed > 0) {
          lines.push({
            label: "Disk while running",
            math: `${runH} h × ${num(billed)}${d.decimalGB ? " GB" : " GiB"}${d.included ? ` (after ${d.included} free)` : ""} × ${rate(d.running)}`,
            amount: h.run * billed * d.running,
          });
        }
      }
      if (h.keep && h.stopped > 0 && d.stopped) {
        const base = d.includedRunningOnly ? size : Math.max(0, size - (d.included ?? 0) * unit);
        const billed = base + (d.stoppedIncludesRam ? w.ram : 0);
        lines.push({
          label: "Disk while stopped",
          math: `${num(h.stopped)} h × ${num(billed)}${d.decimalGB ? " GB" : " GiB"} × ${rate(d.stopped)}`,
          amount: h.stopped * billed * d.stopped,
        });
      }
    }
    if (extraDisk > 0 && d.extraMonthly) {
      const months = h.keep ? h.machines : h.run / MONTH_HOURS;
      lines.push({
        label: "Extra disk (volume)",
        math: `${num(extraDisk)} GiB × ${rate(d.extraMonthly)} a month${h.keep ? ` × ${h.machines}` : ` × ${num(months)} machine-months`}`,
        amount: extraDisk * d.extraMonthly * months,
      });
    }
  }

  // Free monthly allowances, valued at the card's own rates.
  const a = plan.allowance;
  if (a) {
    const cpuLine = lines.find((l) => l.label.startsWith("CPU"));
    const ramLine = lines.find((l) => l.label === "Memory");
    // One storage budget covers disk kept while stopped as well as disk while running.
    const diskAmount = lines
      .filter((l) => l.label === "Disk while running" || l.label === "Disk while stopped")
      .reduce((s, l) => s + l.amount, 0);
    const diskLine = diskAmount > 0 ? { amount: diskAmount } : undefined;
    const offs: [Pick<Line, "amount"> | undefined, number | undefined, number | undefined, string][] = [
      [cpuLine, a.cpuHours, card.cpu?.rate, "vCPU-h"],
      [ramLine, a.ramHours, card.ram?.rate, "GiB-h"],
      [diskLine, a.diskHours, card.disk?.running, "GB-h"],
    ];
    for (const [line, hours, r, unit] of offs) {
      if (line && hours && r) {
        const off = Math.min(line.amount, hours * r);
        if (off > 0) lines.push({ label: "Included in the plan", math: `−${num(hours)} ${unit} × ${rate(r)}`, amount: -off });
      }
    }
  }

  const usage = Math.max(0, lines.reduce((s, l) => s + l.amount, 0));
  if (plan.capped && usage > 0.005) {
    problems.push(`${plan.name} is a free allowance that stops at its limit; this workload needs ${money(usage)} more than it includes.`);
  }
  let total = usage;
  const credit = plan.credit ?? 0;
  if (plan.fee > 0 || credit > 0) {
    const over = Math.max(0, usage - credit);
    const overCash = plan.pack && over > 0 ? Math.ceil(over / plan.pack) * plan.pack : over;
    total = plan.fee + overCash;
    const parts = [`${money(plan.fee)} plan`];
    if (credit > 0) parts.push(`${money(credit)} of usage included`);
    if (over > 0) parts.push(plan.pack ? `${money(overCash)} in ${money(plan.pack)} packs for the ${money(over)} over` : `${money(over)} over`);
    notes.push(`${plan.name}: ${parts.join(", ")}.`);
  }
  if (plan.note) notes.push(plan.note);

  return {
    provider: card.provider,
    plan: plan.name,
    shape: shape
      ? `${shape.name}: ${num(shape.vcpu)} vCPU / ${num(shape.ram)} GiB / ${diskSize === shape.disk ? shape.disk : w.disk} GiB${extraDisk ? ` + ${num(extraDisk)} GiB volume` : ""}`
      : `${w.vcpu} vCPU / ${w.ram} GiB / ${w.disk} GiB`,
    lines,
    usage,
    total,
    feasible: problems.length === 0,
    problems,
    notes: [...notes, ...card.notes],
  };
}

/** Price a workload on every plan and keep the cheapest one that can run it as asked. */
export function price(card: RateCard, w: Workload): Quote {
  const quotes = card.plans.map((p) => priceOnPlan(card, w, p));
  quotes.sort((a, b) => a.problems.length - b.problems.length || a.total - b.total);
  return quotes[0];
}

/** Ready-made workloads, so a use case can open the calculator already filled in. */
export const presets: Record<string, { label: string; workload: Workload; why: string }> = {
  personal: {
    label: "A personal agent that stays on (Hermes, OpenClaw)",
    why: "One always-on 2 vCPU / 4 GiB / 20 GiB machine that keeps its files. It waits for messages most of the time: about 6% CPU on average, with peaks near 100% when it browses or runs a command.",
    workload: { vcpu: 2, ram: 4, disk: 20, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 24, daysPerMonth: 30, keepDisk: true, busy: 0.06, awake: 1, model: "glm-5.3", messagesPerDay: 30, kTokens: 40 },
  },
  coding: {
    label: "A coding agent for one developer",
    why: "One 4 vCPU / 8 GiB / 40 GiB machine for Claude Code or Codex, eight hours a day on 20 working days, stopped otherwise with the repository kept. The CPU works about 4% of the time on average.",
    workload: { vcpu: 4, ram: 8, disk: 40, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 8, daysPerMonth: 20, keepDisk: true, busy: 0.04, awake: 1, model: "claude-sonnet-5", messagesPerDay: 20, kTokens: 300 },
  },
  interpreter: {
    label: "A code interpreter inside your product",
    why: "20,000 one-minute runs a month on 2 vCPU / 4 GiB / 10 GiB machines, thrown away after each run; results go to your own storage. The CPU works about 17% of the time.",
    workload: { vcpu: 2, ram: 4, disk: 10, mode: "tasks", tasks: 20000, taskMinutes: 1, machines: 1, hoursPerDay: 0, daysPerMonth: 30, keepDisk: false, busy: 0.17, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  browser: {
    label: "A browser agent for a small team",
    why: "30,000 ten-minute browser sessions a month on 2 vCPU / 4 GiB / 10 GiB machines, thrown away after each. Chromium needs memory more than CPU: about 3% CPU on average.",
    workload: { vcpu: 2, ram: 4, disk: 10, mode: "tasks", tasks: 30000, taskMinutes: 10, machines: 1, hoursPerDay: 0, daysPerMonth: 30, keepDisk: false, busy: 0.03, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  automation: {
    label: "Self-hosted n8n for a small team",
    why: "One always-on 2 vCPU / 4 GiB / 20 GiB machine that keeps its database and encryption key: 730 hours, because webhooks and schedules stop when it sleeps. About 6% CPU on average, with peaks near 100% when a big workflow runs. The model line assumes 50 workflow steps a day that ask a cheap model, 10,000 tokens each.",
    workload: { vcpu: 2, ram: 4, disk: 20, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 24, daysPerMonth: 30, keepDisk: true, busy: 0.058, awake: 1, model: "deepseek-v4.1-flash", messagesPerDay: 50, kTokens: 10 },
  },
  chatbot: {
    label: "A Discord or Slack bot for one server",
    why: "One always-on 1 vCPU / 2 GiB / 10 GiB machine that keeps its history: 730 hours, because a bot holding a Discord or Slack connection cannot sleep. About 3% CPU on average, since one community sees little traffic. The model line assumes 100 replies a day at 10,000 tokens each (instructions plus recent messages).",
    workload: { vcpu: 1, ram: 2, disk: 10, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 24, daysPerMonth: 30, keepDisk: true, busy: 0.03, awake: 1, model: "glm-5.3", messagesPerDay: 100, kTokens: 10 },
  },
  team: {
    label: "Claude Code for a team of five",
    why: "Five 4 vCPU / 8 GiB / 40 GiB machines, one per developer, eight hours a day on 20 working days (800 machine-hours), stopped otherwise with each repository and login kept. About 3% CPU on average. The model line is 20 requests a day per developer at 300,000 tokens each, at API prices; developers who sign in with Claude subscriptions pay per seat instead.",
    workload: { vcpu: 4, ram: 8, disk: 40, mode: "machines", tasks: 0, taskMinutes: 0, machines: 5, hoursPerDay: 8, daysPerMonth: 20, keepDisk: true, busy: 0.034, awake: 1, model: "claude-sonnet-5", messagesPerDay: 100, kTokens: 300 },
  },
  scraper: {
    label: "A scraper that runs four times a day",
    why: "Four ten-minute runs a day, 120 a month (20 machine-hours), each on a fresh 1 vCPU / 2 GiB / 10 GiB machine thrown away afterwards; the results go to your own storage. The CPU is about 40% busy while a headless browser renders pages. No model.",
    workload: { vcpu: 1, ram: 2, disk: 10, mode: "tasks", tasks: 120, taskMinutes: 10, machines: 1, hoursPerDay: 0, daysPerMonth: 30, keepDisk: false, busy: 0.4, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  mcp: {
    label: "Your own remote MCP server",
    why: "One small 1 vCPU / 1 GiB / 10 GiB server that must answer at a public address all month. About 2% CPU, because it only passes tool calls on. Where a provider sleeps an idle machine and wakes it on a request, it is awake about a third of the time (roughly the working day when people call it) and billed as stopped the rest. No model: the AI runs in the client.",
    workload: { vcpu: 1, ram: 1, disk: 10, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 24, daysPerMonth: 30, keepDisk: true, busy: 0.02, awake: 0.33, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  a: {
    label: "A: 1,000 short tasks",
    why: "The site's shared workload A: 1,000 ten-minute tasks a month on 2 vCPU / 4 GiB, deleted after each.",
    workload: { vcpu: 2, ram: 4, disk: 10, mode: "tasks", tasks: 1000, taskMinutes: 10, machines: 1, hoursPerDay: 0, daysPerMonth: 30, keepDisk: false, busy: 0.5, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  b: {
    label: "B: one always-on box",
    why: "The site's shared workload B: one 4 vCPU / 8 GiB / 50 GiB machine running all month.",
    workload: { vcpu: 4, ram: 8, disk: 50, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 24, daysPerMonth: 30, keepDisk: true, busy: 0.1, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
  c: {
    label: "C: three hours a day",
    why: "The site's shared workload C: one 2 vCPU / 4 GiB / 20 GiB machine, three hours a day for 30 days, stopped otherwise with its files kept.",
    workload: { vcpu: 2, ram: 4, disk: 20, mode: "machines", tasks: 0, taskMinutes: 0, machines: 1, hoursPerDay: 3, daysPerMonth: 30, keepDisk: true, busy: 0.1, awake: 1, model: "", messagesPerDay: 0, kTokens: 0 },
  },
};

/** The billing catches a buyer should know, read from the rate card's own fields. */
export function catches(card: RateCard): { label: string; detail: string }[] {
  const out: { label: string; detail: string }[] = [];
  if (card.billedWhileStopped || card.monthlyPlans) {
    out.push({ label: "Bills while switched off", detail: "A stopped machine is charged like a running one; only deleting it ends the bill." });
  }
  if (card.monthlyPlans) out.push({ label: "Whole months only", detail: "Sold as monthly plans, with no hourly price." });
  if (card.wholeHours) out.push({ label: "Billed in whole hours", detail: "Each server costs at least an hour, so a ten-minute task pays for sixty." });
  if (card.minimumPerRun) out.push({ label: `Minimum ${money(card.minimumPerRun)} a run`, detail: `Each short run is charged at least ${money(card.minimumPerRun)}.` });
  if (card.perMachine) {
    out.push({ label: `${card.perMachine.label} extra`, detail: `${money(card.perMachine.monthly)} a month per machine on top of the machine price.` });
  }
  if (card.plans.length && card.plans.every((p) => p.fee > 0)) {
    const cheapest = card.plans.reduce((a, b) => (b.fee < a.fee ? b : a));
    const fee = money(cheapest.fee);
    out.push((cheapest.credit ?? 0) >= cheapest.fee
      ? { label: `Minimum spend ${fee} a month`, detail: `The cheapest plan is ${fee} a month; it comes back as usage, but a quiet month still costs ${fee}.` }
      : { label: `Monthly fee from ${fee}`, detail: `Every plan has a fee, from ${fee} a month, on top of usage.` });
  }
  if (card.plans.some((p) => p.pack)) out.push({ label: "Usage bought in packs", detail: "Usage beyond what a plan includes is bought in fixed packs, not billed to the cent." });
  if (card.sleeps) out.push({ label: "Sleeps when idle", detail: card.sleeps });
  if (card.between === "lost") {
    out.push({ label: "Files lost when stopped", detail: card.lostNote ?? "Stopping deletes the machine's files; keeping them needs a snapshot or separate storage." });
  }
  if (card.egress && card.egress.perGiB === null) out.push({ label: "Data out price unpublished", detail: card.egress.note });
  return out;
}
