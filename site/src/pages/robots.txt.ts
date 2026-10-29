import { abs, respond } from "../lib/agents";

// Search engines and AI crawlers are all welcome; agents are pointed at the plain files.
export const GET = () =>
  respond.text(
    `# AI agents: start at ${abs("/llms.txt")} (plain Markdown and JSON, same facts as the pages)
User-agent: *
Allow: /
Disallow: /search.json

Sitemap: ${abs("/sitemap.xml")}
`,
    "text/plain",
  );
