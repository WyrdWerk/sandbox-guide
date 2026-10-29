import { llmsTxt, respond } from "../lib/agents";

export const GET = () => respond.text(llmsTxt(), "text/plain");
