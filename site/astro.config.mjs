import { defineConfig } from "astro/config";

// Static output only: no backend, no adapters, no client-side framework.
export default defineConfig({
  site: "https://botperch.com",
  output: "static",
  build: { format: "directory" },
});
