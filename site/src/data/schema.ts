// Types for the structured content. Every page reads from these shapes, so a
// new provider or feature is a data edit, not a layout edit.

export type Confidence =
  | "docs-confirmed"
  | "pricing-page"
  | "third-party"
  | "inferred"
  | "not-published";

export type Verdict = "yes" | "partly" | "no" | "not-published" | "pending";

export type FeatureGroup =
  | "machine"
  | "state"
  | "staying-on"
  | "access"
  | "running"
  | "money"
  | "company";

export interface Source {
  url: string;
  quote: string;
  confidence: Confidence;
}

export interface FeatureRow {
  provider: string;
  verdict: Verdict;
  /** The number that decides this feature for this provider: a timer, a price, a size. */
  figure: string;
  /** One line for the worked scenario: what this provider does in it. */
  scenario: string;
  note: string;
  source?: Source;
}

export interface ScenarioBeat {
  /** Clock label, e.g. "00:20". */
  at: string;
  what: string;
}

export interface Scenario {
  title: string;
  setup: string;
  beats: ScenarioBeat[];
  /** The moment in the walkthrough where the providers diverge. */
  turn: string;
}

export interface CostLine {
  label: string;
  arithmetic: string;
  amount: string;
}

export interface CostCase {
  headline: string;
  shape: string;
  lines: CostLine[];
  total: string;
  notes: string[];
  /** Shown as a warning box: a size mismatch, a contradiction, or a number to re-check. */
  flag?: string;
}

export interface Caveat {
  issue: string;
  detail: string;
  status: "open" | "rechecking" | "contradiction";
  /** The two statements that disagree, for a contradiction. */
  evidence?: Source[];
}

export interface CompanyFact {
  label: string;
  value: string;
  /** Omitted when the research found nothing; the value then says so. */
  source?: Source;
}

export interface Provider {
  id: string;
  name: string;
  url: string;
  status: "researched" | "pending";
  checkedOn?: string;
  oneLiner: string;
  whatItIs: string[];
  whoFor: string;
  isolation: string;
  sizes: string;
  billing: {
    model: string;
    meter: string;
    stopped: string;
    planFee: string;
    minimum: string;
  };
  cost?: { A: CostCase; B: CostCase; C: CostCase };
  /** Section 17 of the profile: who the company is, and what a buyer can check. */
  company: {
    facts: CompanyFact[];
  };
  fits: {
    well: string[];
    badly: string[];
  };
  usability: {
    dashboard: string;
    withoutCode: string;
    signup: string;
    docs: string;
    tripsUp: string[];
  };
  caveats: Caveat[];
  strengths: string[];
  sources: { label: string; url: string }[];
}

export interface Split {
  heading?: string;
  body: string[];
  quote?: { text: string; cite: string; url: string; tag: Confidence };
}

export interface Feature {
  id: string;
  group: FeatureGroup;
  order: number;
  title: string;
  navTitle: string;
  standfirst: string;
  idea: string[];
  splits: Split[];
  watchFor: string[];
  /** Column header for the key-figure column in the comparison table. */
  figureLabel: string;
  scenario: Scenario;
  /** Questions to ask a provider before signing, drawn from the research gaps. */
  questions: string[];
  rows: FeatureRow[];
}

export interface Group {
  id: FeatureGroup;
  title: string;
  intro: string;
}

export interface Situation {
  id: string;
  title: string;
  icon: SituationIcon;
  question: string;
  answer: string;
  features: string[];
  providers: { provider: string; why: string; watch: string }[];
  /** The evidence behind the situation's central claim. */
  sources?: Source[];
}

export type SituationIcon =
  | "screen"
  | "layers"
  | "clock"
  | "code"
  | "browser"
  | "users"
  | "chip"
  | "flag";

export interface Change {
  /** ISO date of the change, as reported by the source. */
  date: string;
  title: string;
  provider?: string;
  what: string;
  sources: Source[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

/** How a person gets a given agent running on a provider, easiest first. */
export type RouteTier = "one-click" | "preinstalled" | "guide" | "manual" | "backend" | "none";

export interface UseCase {
  id: string;
  title: string;
  kicker: string;
  /** The reader's own words: what they want the agent to do. */
  question: string;
  standfirst: string;
  /** Calculator preset this use case opens with. */
  preset: string;
  /** Paragraphs; may contain [text](url) links and **bold**. */
  whatItIs: string[];
  needs: { label: string; value: string; source: string }[];
  twoWays?: { title: string; body: string[] };
  routes: {
    provider: string;
    tier: RouteTier;
    /** Can someone get it running without typing commands? */
    noTerminal: "yes" | "partly" | "no";
    what: string;
    link: { title: string; url: string } | null;
  }[];
  picks: { provider: string; for: string; why: string; watch: string; link: string }[];
  outside: string;
  features: string[];
  sources: { label: string; url: string }[];
}
