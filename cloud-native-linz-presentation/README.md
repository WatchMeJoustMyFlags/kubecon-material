# Welcome to [Slidev](https://github.com/slidevjs/slidev)!

To start the slide show:

- `pnpm install`
- `pnpm dev`
- visit <http://localhost:3030>

Edit the [slides.md](./slides.md) to see the changes.

Learn more about Slidev at the [documentation](https://sli.dev/).

## Configuration

The presentation includes embedded Grafana dashboards and Jaeger tracing UI. To customize the hostnames for your infrastructure:

### Edit the frontmatter in slides.md

Open `slides.md` and modify the configuration at the top:

```yaml
---
grafana_host: your-hostname.local
jaeger_host: your-hostname.local
---
```

**Default values:**
- `grafana_host`: `himbeere.local` (German for "raspberry")
- `jaeger_host`: `himbeere.local`

Change these to match your Raspberry Pi hostname or observability stack location (e.g., `pi.local`, `localhost:3001`, or an IP address like `192.168.1.100`).
