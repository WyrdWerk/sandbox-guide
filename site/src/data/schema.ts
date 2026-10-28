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
  note: string;
  source?: Source;
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
  question: string;
  answer: string;
  features: string[];
  providers: { provider: string; why: string; watch: string }[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}
