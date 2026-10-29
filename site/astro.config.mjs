import { writeFileSync } from "node:fs";
import { defineConfig } from "astro/config";

const site = "https://botperch.com";

// Writes dist/sitemap.xml from the built pages plus the agent files, without a dependency.
const sitemap = {
  name: "sitemap",
  hooks: {
    "astro:build:done": ({ dir, pages }) => {
      const paths = pages
        .map((p) => `/${p.pathname}`)
        .filter((p) => p.endsWith("/") && p !== "/search/" && p !== "/404/")
        .concat(["/llms.txt", "/llms-full.txt"])
        .sort();
      const urls = paths.map((p) => `<url><loc>${site}${p}</loc></url>`).join("\n");
      writeFileSync(
        new URL("sitemap.xml", dir),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  },
};

// Static output only: no backend, no adapters, no client-side framework.
export default defineConfig({
  site,
  output: "static",
  build: { format: "directory" },
  integrations: [sitemap],
});
