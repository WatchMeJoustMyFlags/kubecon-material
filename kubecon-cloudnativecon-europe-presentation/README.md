# Welcome to [Slidev](https://github.com/slidevjs/slidev)!

To start the slide show:

- `pnpm install`
- `pnpm dev`
- visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

## Configuration

The presentation includes embedded Grafana dashboards, Jaeger tracing UI, and feature flags controls. To customize the hostname for your infrastructure:

### Edit the frontmatter in slides.md

Open `slides.md` and modify the configuration at the top:

```yaml
---
demo_host: your-hostname.local
---
```

**Default value:**
- `demo_host`: `himbeere.local` (German for "raspberry")

Change this to match your Raspberry Pi hostname or demo infrastructure location (e.g., `pi.local`, `localhost:3001`, or an IP address like `192.168.1.100`).

## Presenting / Mirror Mode

Slidev's built-in presenter mode (`/presenter`) doesn't work well when slides contain embedded iframes or live demo components — the presenter overlay breaks the demo display.

**Workaround:** Use two browser windows both pointing to the regular slide view:

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3030` in two browser windows
3. Put one window on the projector/external display, keep one on your laptop
4. Navigate both in sync (or use keyboard shortcuts on each)

**For presenter notes:** Open `http://localhost:3030/presenter` in a *third* window on your laptop only. This gives you notes without interfering with the demo slides on the projector.

> **Note for demos:** The live Grafana/Jaeger slides load from `demo_host` in the frontmatter. Make sure your Pi is reachable on the network before presenting, or use the static image fallback slides (the hidden `iframe` slides each have a corresponding image slide immediately after them).
