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
  /** How the provider puts an idle machine to sleep and wakes it. Omit when it does not. */
  sleeps?: string;
  /** What happens to the files when a machine stops between sessions. */
  between: "kept" | "lost";
  /** Said when `between` is "lost" and the reader needs their files back. */
  lostNote?: string;
  maxDisk?: number;
  maxVcpu?: number;
  maxRam?: number;
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
      return { s, short, cost: hourOf(s) * MONTH_HOURS + extra };
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
        ? `Sessions end after ${plan.maxSessionHours} hours, so an always-on machine has to be restarted by your own code.`
        : `Sessions end after ${plan.maxSessionHours} hours, shorter than the ${num(h.session)} hours asked for.`,
    );
  }
  if (h.keep && card.between === "lost") {
    problems.push(card.lostNote ?? "Stopping deletes the machine's files; keeping them needs a snapshot or separate storage.");
  }

  if (shape?.hourly !== undefined) {
    lines.push({ label: `Machine time (${shape.name})`, math: `${runH} h × ${rate(shape.hourly)}`, amount: h.run * shape.hourly });
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
    const diskLine = lines.find((l) => l.label === "Disk while running");
    const offs: [Line | undefined, number | undefined, number | undefined, string][] = [
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
