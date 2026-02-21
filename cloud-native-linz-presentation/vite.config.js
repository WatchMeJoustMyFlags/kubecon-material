import { defineConfig } from "vite";
import fs from "fs";

function getDemoHost() {
  const slides = fs.readFileSync("./slides.md", "utf-8");
  const match = slides.match(/demo_host:\s*(.+)/);
  return match ? match[1].trim() : "localhost";
}

const demoHost = getDemoHost();

export default defineConfig({
  server: {
    proxy: {
      "/jaeger-proxy": {
        target: `http://${demoHost}`,
        rewrite: (path) => path.replace(/^\/jaeger-proxy/, "/jaeger"),
        changeOrigin: true,
      },
    },
  },
  //@ts-ignore
  slidev: {
    markdown: {
      markdownItSetup(md) {
        md.set({ quotes: "“”‘’" });
      },
    },
  },
});
