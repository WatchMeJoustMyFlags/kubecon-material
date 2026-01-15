import { defineConfig } from "vite";

export default defineConfig({
  //@ts-ignore
  slidev: {
    markdown: {
      markdownItSetup(md) {
        md.set({ quotes: "“”‘’" });
      },
    },
  },
});
