import { llmsFullTxt, respond } from "../lib/agents";

export const GET = () => respond.text(llmsFullTxt(), "text/plain");
