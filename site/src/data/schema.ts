// Types for the structured content. Every page reads from these shapes, so a
// new provider or feature is a data edit, not a layout edit.

export type Confidence =
  | "docs-confirmed"
  | "pricing-page"
  | "third-party"
  | "inferred"
  | "not-published";

export type Verdict = "yes" | "partly" | "no" | "not-published" | "pending";

export interface Source {
  url: string;
  quote: string;
  confidence: Confidence;
}

export interface Offer {
  kind: string;
  card: string;
  get: string;
  ends: string;
  traps: string;
}

export interface FeatureRow {
  provider: string;
  verdict: Verdict;
  note: string;
  source?: Source;
  offer?: Offer;
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

export interface ConceptBlock {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Pick {
  situation: string;
  providers: string[];
  why: string;
}

export interface Feature {
  id: string;
  order: number;
  title: string;
  navTitle: string;
  standfirst: string;
  concept: ConceptBlock[];
  comparisonIntro: string;
  rows: FeatureRow[];
  questions: string[];
  picks: Pick[];
  gotchas: string[];
}

export interface TermMeaning {
  provider: string;
  meaning: string;
}

export interface Term {
  term: string;
  short: string;
  whyItMatters: string;
  meanings: TermMeaning[];
  checkFor: string;
}

export interface UseCase {
  id: string;
  title: string;
  standfirst: string;
  needs: string[];
  picks: { provider: string; why: string; watch: string }[];
  avoid: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  seeAlso?: string;
}
