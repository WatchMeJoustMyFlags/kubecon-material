---
theme: the-unnamed # https://github.com/estruyf/slidev-theme-the-unnamed
title: 18 Bluetooth Controllers Walk Into a Bar - Observability & Runtime Configuration with CNCF Tools
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 25min
demo_host: himbeere.local

layout: cover
class: text-center
---

# 18 Bluetooth Controllers Walk Into a Bar
## Observability & Runtime Configuration with CNCF Tools

<div class="grid grid-cols-2 px-4 mx-auto mt-12 text-left">
<div class="flex items-center gap-2">
  <img src="/images/simon.jpg" alt="Simon Schrottner" class="h-20 w-20 rounded-full flex-shrink-0" />
  <div class="leading-tight">
    <p class="!text-xl font-bold !mt-0 !mb-0">Simon Schrottner</p>
    <p class="!text-lg !mt-0 !mb-0">Senior Software Engineer, Dynatrace</p>
  </div>
</div>
<div class="flex items-center gap-2">
  <img src="/images/manuel.jpg" alt="Manuel Timelthaler" class="h-20 w-20 rounded-full flex-shrink-0" />
  <div class="leading-tight">
    <p class="!text-xl font-bold !mt-0 !mb-0">Manuel Timelthaler</p>
    <p class="!text-lg !mt-0 !mb-0">Software Architect, Tractive</p>
  </div>
</div>
</div>

<div class="abs-br m-6 flex gap-2">
  Cloud Native Linz, February 2026
</div>

<!--
Speaker Notes:
- Welcome everyone.
- Briefly introduce the title and the core idea: applying familiar CNCF tools to a weird, fun problem.
-->

---
layout: default
---

# Agenda

<div class="text-xl mt-16 space-y-6">

1. **The Challenge** — Why observability for a party game?

2. **The Journey** — 6 key learnings from instrumentation to subsecond metrics

3. **Live Demo** — Watch metrics respond in real-time as we change the game

4. **The Path Forward** — What's missing and how you can help

</div>

---
layout: center
class: text-center
---

# What is JoustMania?

<div class="flex justify-center items-center my-8">
    <img src="/images/joustmania-magfest.jpg" alt="JoustMania at MagFest" class="h-64 rounded-lg shadow-lg rotate-1" />
</div>

**A motion-controlled party game for up to 18+ PlayStation Move controllers**

Keep your controller still, jostle everyone else's.<br>
_No screens, just glowing controllers and chaos._

<!--
Speaker Notes (Manuel - 2:30-5:00):
- "Quick context on what we're dealing with. JoustMania is a motion-controlled party game"
- "The rules? Keep your controller perfectly still while trying to jostle everyone else's"
- "Move too much? You're out. No screens. No UI. Just glowing controllers and chaos"
- "Which makes debugging... interesting. Because when something breaks, there's no error message"
- "Just 18 people staring at controllers wondering what happened"
-->

---
layout: default
---

# Original Architecture (IPC-Based)

<div class="grid grid-cols-2">
<div>

**Before observability:**

- Process-based (multiprocessing)
- 30 Hz game loop (33ms frames)
- IPC via queues/shared memory
- 4 Python processes

**The problem:** OpenTelemetry needs network calls for context propagation

</div>
<div class="-mt-8">

```mermaid {scale:0.85}
graph TD
    Menu[Menu]
    GC[Game Coordinator]
    CM[Controller Manager]
    Audio[Audio]
    Controllers[18+ Controllers<br/>@ 30Hz]

    Menu -->|IPC| GC
    GC -->|IPC| CM
    GC -->|IPC| Audio
    CM -->|Bluetooth| Controllers

    style Menu fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#0e131f
    style GC fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#0e131f
    style CM fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#0e131f
    style Audio fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#0e131f
    style Controllers fill:#15c2cb,stroke:#15c2cb,stroke-width:2px,color:#0e131f
```

</div>
</div>

<!--
Speaker Notes (Manuel - 2:30-5:00):
- "So, the architecture: 18 PlayStation Move controllers, all talking Bluetooth to a Raspberry Pi 5"
- "We've got four microservices—controller manager handling the hardware, game coordinator running the actual game logic, menu service for the lobby, and audio for sound effects"
- "Before we added observability, we had no idea what was actually happening inside"
- "Was it the Bluetooth stack dropping packets? The game loop running slow? Memory pressure?"
- "We just knew that sometimes, at conferences, things would mysteriously stop working. Usually right when the most people were watching"
-->

---
layout: center
class: text-center
---

# What If We Actually Observed This Thing?

<div class="grid grid-cols-3 gap-x-16 gap-y-8 items-end justify-items-center my-12 px-12">
  <div class="flex flex-col items-center gap-2">
    <img src="/images/opentelemetry.png" alt="OpenTelemetry" class="h-14" />
    <span class="text-sm text-gray-400">Telemetry Collection</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/images/prometheus.png" alt="Prometheus" class="h-20" />
    <span class="text-sm text-gray-400">Metrics Storage</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/images/jaeger-reverse.png" alt="Jaeger" class="h-20" />
    <span class="text-sm text-gray-400">Distributed Tracing</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/images/grafana.svg" alt="Grafana" class="h-20" />
    <span class="text-sm text-gray-400">Visualization</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/images/loki.png" alt="Loki" class="h-20" />
    <span class="text-sm text-gray-400">Log Aggregation</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/images/openfeature.svg" alt="OpenFeature" class="h-14 w-auto" />
    <span class="text-sm text-gray-400">Feature Flags</span>
  </div>
</div>

<div class="text-2xl mt-8 text-amber-300">
What could possibly go wrong?
</div>

<!--
Speaker Notes (Manuel - ~5:00):
- "So we did what any reasonable engineers would do. We added OpenTelemetry. And OpenFeature for runtime configuration"
- "OpenTelemetry. Prometheus. Jaeger. Grafana. The hypothesis was simple: these tools work for web apps, they should work for real-time hardware"
- Simon: "Because if we're going to over-engineer a party game, we're going all in"
-->

---
layout: section
class: text-center
---

# The Journey: 6 Learnings

What we discovered bringing CNCF tools to a real-time game

---
layout: default
---

# Learning 1: Had to Refactor to Microservices

**Problem:** IPC (pipes/queues) doesn't work with OpenTelemetry auto-instrumentation

<div class="grid grid-cols-3 gap-8 items-center mb-8">
<div>

### <span class="text-lg">Before</span><br>Process-Based IPC

</div>
<div class="col-span-2">

```mermaid {scale:0.7}
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%
graph LR
    Menu[Menu]
    GC[Game Coordinator]
    CM[Controller Manager]
    Audio[Audio]
    Controllers[Controllers]

    Menu -->|IPC| GC
    GC -->|IPC| CM
    GC -->|IPC| Audio
    CM -->|Bluetooth| Controllers

    style Menu fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#000000
    style GC fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#000000
    style CM fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#000000
    style Audio fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#000000
    style Controllers fill:#15c2cb,stroke:#15c2cb,stroke-width:2px,color:#000000
```

</div>
</div>

<div class="grid grid-cols-3 gap-8 items-center">
<div>

### <span class="text-lg">After</span><br>gRPC Microservices

</div>
<div class="col-span-2">

```mermaid {scale:0.7}
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%
graph LR
    Flagd[flagd]
    Menu[Menu]
    GC[Game Coordinator]
    CM[Controller Manager]
    Audio[Audio]
    Controllers[Controllers]

    Flagd -.->|gRPC| GC
    Menu -->|gRPC| GC
    GC -->|gRPC| CM
    GC -->|gRPC| Audio
    CM -->|Bluetooth| Controllers

    style Flagd fill:#0e131f,stroke:#ffe45e,stroke-width:2px,color:#ffe45e
    style Menu fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#000000
    style GC fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#000000
    style CM fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#000000
    style Audio fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#000000
    style Controllers fill:#15c2cb,stroke:#15c2cb,stroke-width:2px,color:#000000
```

</div>
</div>

---
layout: default
---

# Learning 1: The Full Picture

**gRPC microservices enabled the observability stack**<br>
W3C trace context flows through calls, enabling distributed tracing

```mermaid {scale:0.75}
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%
graph LR
    Dashboard[Dashboard<br/>:8080]
    Flagd[flagd<br/>:8013]
    Menu[Menu<br/>:50054]
    GC[Game Coordinator<br/>:50053]
    CM[Controller Manager<br/>:50052]
    Audio[Audio<br/>:50056]
    Controllers[Controllers]
    OTel[OTel Collector<br/>:4317]
    Observability[Grafana<br/>Jaeger<br/>Prometheus<br/>Loki]

    Dashboard -->|gRPC| Menu
    Menu -->|gRPC| GC
    GC -->|gRPC| CM
    GC -->|gRPC| Audio
    Flagd -.->|gRPC| GC
    CM -->|Bluetooth| Controllers

    Menu -.->|OTLP| OTel
    GC -.->|OTLP| OTel
    CM -.->|OTLP| OTel
    Audio -.->|OTLP| OTel
    OTel -->|metrics<br/>traces<br/>logs| Observability

    style Dashboard fill:#fe4a49,stroke:#fe4a49,stroke-width:2px,color:#0e131f
    style Flagd fill:#0e131f,stroke:#ffe45e,stroke-width:2px,color:#ffe45e
    style Menu fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#000000
    style GC fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#000000
    style CM fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#000000
    style Audio fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#000000
    style Controllers fill:#15c2cb,stroke:#15c2cb,stroke-width:2px,color:#000000
    style OTel fill:#f39c12,stroke:#f39c12,stroke-width:2px,color:#0e131f
    style Observability fill:#95a5a6,stroke:#95a5a6,stroke-width:2px,color:#0e131f
```

<!--
Speaker Notes (Simon - 5:00-6:30):
- "Learning number one: We had to refactor first"
- "The original JoustMania used separate Python processes communicating via IPC—pipes, queues, the usual"
- "We figured we'd just add OpenTelemetry and call it a day. Not even close"
- "OpenTelemetry is designed for distributed systems with network calls—gRPC, HTTP, message queues. But local IPC? You're on your own"
- "Manual context propagation, no auto-instrumentation, no service mesh benefits"
- "So we moved to microservices with gRPC. And suddenly, automatic instrumentation just... worked"
- "Traces across service boundaries. Context propagation for free"
- "Turns out, sometimes you have to change your architecture to get the observability you want"
-->

---
layout: default
---

# Learning 2: The Raspberry Pi Can Handle It

<iframe
    :src="`http://${$slidev.configs.demo_host}/grafana/d/joustmania-host-metrics/joustmania-host-metrics-raspberry-pi?orgId=1&refresh=5s&kiosk`"
    width="100%"
    height="400"
    frameborder="0"
    class="rounded-lg shadow-lg"></iframe>

<!--
Speaker Notes (Simon - 6:30-7:15):
- "Learning number two: the Raspberry Pi 5 is kind of a beast"
- "We were genuinely worried about running the entire observability stack alongside the game. Would it melt? Would it throttle?"
- "Look at this—[point to dashboard]. The Pi didn't even break a sweat"
- Manuel: "Though we did cap retention at 7 days"
- Simon: "Fair point. We're not trying to store six months of controller movement data"
-->

---
layout: default
---

# Learning 2: Pi Performance

<div class="grid grid-cols-2 gap-12 my-8">
<div>

### Raspberry Pi 5 Specs
- Quad-core ARM Cortex-A76 @ 2.4GHz
- 8GB LPDDR4X RAM
- ~$80 USD

</div>
<div>

### Observed Performance
- CPU: ~45% under full load
- Memory: ~850 MB / 8 GB (10%)
- Temp: 65°C (with fan cooling)
- 18 controllers @ 60Hz

</div>
</div>

**The Pi runs both the game AND the full observability stack.**<br>
We didn't think this was possible initially, though you could also send telemetry to external services.

<!--
Speaker Notes (Simon - 6:30-7:15 continued):
- Show the detailed metrics on this slide
- Emphasize the low resource usage despite running both game and observability stack
-->

---
layout: default
---

# Learning 3: Cardinality Low, Volume High

## The Challenge
- **Cardinality:** Only 20-30 unique metric names — not the bottleneck
- **Volume:** 18 controllers @ 60Hz ≈ 1,080 messages/second

## Solution: Two-level batching

<div class="grid grid-cols-2 gap-8">
<div>

**Level 1:** Application → Collector
```python
init_metrics(
    service_name="controller-manager",
    export_interval_ms=100 # (realtime)
    # other services: 1000ms
)
```

</div>
<div>

**Level 2:** Collector → Backends
```yaml
processors:
  batch/fast:
    timeout: 100ms
    send_batch_size: 1000
```

</div>
</div>

**Real-time exports** + **batching** = subsecond observability without overwhelming backends

<!--
Speaker Notes (Simon - 8:00-9:00):
- "Learning number three: cardinality is surprisingly low, but message volume is surprisingly high"
- "Cardinality—the number of unique metric combinations—we're tracking maybe 20-30 unique metrics across all services. Pretty manageable"
- "But the message rate? 18 controllers, streaming motion data at 60Hz, each with accelerometer, gyroscope, button states. That's [X messages per second]"
- "Not crazy for cloud scale, but for a Pi running the game itself? That adds up fast"
- "The solution? Batching. We don't need to know the exact position of every controller every 16 milliseconds"
- "We need to know when things go wrong—when latency spikes, when frames drop, when someone's controller desyncs"
- "So we aggregate at the source and push summaries, not raw telemetry"
-->

---
layout: default
---

# Learning 4: Prometheus is Too Slow

<div class="mt-10 mb-18">

<div class="timeline-container">

  <!-- Prometheus Scrape Row -->
  <div class="flex items-center gap-4 mb-8">
    <div class="font-semibold w-48" style="color: var(--slidev-theme-accents-teal)">Prometheus Scrape</div>
    <div class="flex items-center gap-0 flex-1 relative">
      <div class="timeline-block timeline-prom py-3 relative flex-1">
        10s
        <div class="absolute -bottom-8 -left-2 text-2xl" style="color: var(--slidev-theme-accents-teal)">↓</div>
      </div>
      <div class="timeline-block timeline-prom py-3 relative flex-1" style="border-left: 0">
        10s
        <div class="absolute -bottom-8 -left-2 text-2xl" style="color: var(--slidev-theme-accents-teal)">↓</div>
      </div>
      <div class="timeline-block timeline-prom py-3 relative flex-1" style="border-left: 0">
        10s
        <div class="absolute -bottom-8 -left-2 text-2xl" style="color: var(--slidev-theme-accents-teal)">↓</div>
        <div class="absolute -right-2 -bottom-8 text-2xl" style="color: var(--slidev-theme-accents-teal)">↓</div>
      </div>
    </div>
  </div>

  <!-- Game Events Row -->
  <div class="flex items-center gap-4">
    <div class="font-semibold w-48" style="color: var(--slidev-theme-accents-rose)">Game Events</div>
    <div class="relative flex-1">
      <div class="flex items-end" :style="`gap: 2px`">
        <div v-for="i in 60" :key="i"
             class="h-8 timeline-events animate-pulse"
             :class="i <= 15 ? 'timeline-events-drop' : ''"
             :style="`flex: ${i <= 15 ? 2 - (i * 0.067) : 1}; animation-delay: ${i * 0.05}s`"></div>
      </div>
      <div class="absolute top-10 left-6 font-semibold flex items-center gap-2" style="color: var(--slidev-theme-accents-yellow)">
        <span class="text-2xl">↑</span>
        <span>Frame drop? Won't see it for 10 seconds!</span>
      </div>
    </div>
  </div>

</div>

<style>
.timeline-block {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  text-align: center;
  font-weight: 600;
}
.timeline-prom {
  background-color: rgba(68, 255, 210, 0.2);
  border: 2px solid var(--slidev-theme-accents-teal);
}
.timeline-events {
  background-color: var(--slidev-theme-accents-rose);
}
.timeline-events-drop {
  background-color: var(--slidev-theme-accents-red);
  opacity: 0.7;
}
</style>

</div>

- **Pull interval:** 10 seconds (we tuned from 60s default)
- **Game loop:** 60Hz (16ms per frame)
- **Result:** 600 frames between each data point

**We needed something faster.**

<!--
Speaker Notes (Manuel - 9:00-10:00):
- "Learning number four: Prometheus is really, really chill about time"
- "15-second scrape intervals by default. Which is great if you're monitoring your web server's CPU usage"
- "But we're running a game loop at 60Hz—that's a frame every 16 milliseconds"
- "With 15-second scrapes, we'd miss entire matches"
- "So we tuned it down to 1 second, which helped but still felt laggy"
- "That's when we remembered—push metrics exist. And we'd both been doing pull-based metrics for so long we almost forgot"
-->

---
layout: default
---

# Learning 5: Push Metrics with Prometheus

**OTLP Push via PeriodicExportingMetricReader**

```python
# OpenTelemetry SDK Configuration
metric_reader = PeriodicExportingMetricReader(
    exporter=OTLPMetricExporter(endpoint="http://otel-collector:4318"),
    export_interval_millis=flagd.get_int("metrics_export_interval_ms")
    # controller-manager: 100ms (realtime) | other services: 1000ms
)
```

<div class="my-4">

```mermaid {scale:1}
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%
graph LR
    Services[Game Services] -->|OTLP Push<br/>100ms| Collector[OTEL Collector]
    Collector -->|Remote Write<br/>~500ms| Prom[Prometheus]

    style Services fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#0e131f
    style Collector fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#0e131f
    style Prom fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#0e131f
```

</div>

**Reality check** — We export at 100ms, but Prometheus remote write can only achieve ~500ms resolution due to write path limitations. Still **30x faster** than 15s scrape, but not real-time yet.

<!--
Speaker Notes (Manuel - 9:00-11:30):
- "Learning number five: push metrics to the rescue"
- "Show of hands—how many of you are using Prometheus pull exclusively? (pause) Yeah, same. Until now"
- "With OpenTelemetry's push model to Prometheus, we got down to 500-millisecond resolution. Better"
-->

---
layout: default
---

# Learning 5: VictoriaMetrics for Hardware

<div class="grid grid-cols-2 gap-8 my-8">
<div>

### Prometheus Limitations
- Built for web app monitoring
- Remote write adds latency
- Limited ingestion rate
- Storage not optimized for high-frequency data

</div>
<div>

### VictoriaMetrics Benefits
- **Native OTLP support** (no conversion)
- **10x higher ingestion rate**
- **Better compression** for time-series
- **Optimized for IoT/hardware** use cases

</div>
</div>

```mermaid {scale:1}
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%
graph LR
    Services[Game Services] -->|OTLP Push<br/>100ms| Collector[OTEL Collector]
    Collector -->|OTLP Native<br/><100ms| VM[VictoriaMetrics]

    style Services fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#0e131f
    style Collector fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#0e131f
    style VM fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#0e131f
```

**Result** — Sub-100ms resolution, native OTLP, built for hardware observability.

<!--
Speaker Notes (Manuel - 9:00-11:30 continued):
- "But then we tried VictoriaMetrics with native OTLP ingestion—no artificial caps"
- "Sub-second observability of a game running on a tiny computer. That's what we needed"
-->

---
layout: default
---

# Learning 6: These Tools Actually Work

<iframe :src="`http://${$slidev.configs.demo_host}/jaeger/`" width="100%" height="400" frameborder="0" class="rounded-lg shadow-lg"></iframe>

<!--
Speaker Notes (Manuel - 11:30-13:00):
- "Which brings us to learning number six, and honestly my favorite: these tools actually work for real-time hardware"
- "With some tweaking, but the bones are solid"
- "OpenTelemetry doesn't care if you're a microservice in Kubernetes or a PlayStation Move controller in someone's living room"
- "Look at this trace. We can see the entire game loop: controller poll, motion processing, death detection, LED feedback"
- "All correlated across services, all timestamped, all traceable back to the source"
- Simon: "And when that lag happened at the conference? We can now see exactly where it came from. It's Bluetooth"
-->

---
layout: section
---

# Live Demo: Real-time observability in action

We'll change the game frequency via feature flags and watch metrics respond across all three approaches — from 10-second pull intervals to sub-100ms VictoriaMetrics resolution.

---
layout: default
---

<iframe
  :src="`http://${$slidev.configs.demo_host}/grafana/d/metrics-pipeline-comparison/metrics-pipeline-comparison?orgId=1&refresh=5s&kiosk`"
  width="100%"
  height="360"
  frameborder="0"
  class="rounded-lg shadow-lg mb-4"
></iframe>

<iframe
  :src="`http://${$slidev.configs.demo_host}/flags/`"
  width="100%"
  height="96"
  frameborder="0"
  class="rounded-lg shadow-lg mt-4"
></iframe>

<!--
Speaker Notes (Manuel/Simon - 13:00-19:00):
- Manuel: "This dashboard shows game loop frequency—right now we're at 30Hz"
- Simon: "Increasing to 60Hz" (changes flag)
- Manuel: "And... there it goes. Look at the jump..."
- Manuel narrates the differences in each graph
- "Notice how Prometheus pull barely shows the change"
- "But VictoriaMetrics? You can see the exact moment"
- "Look at VictoriaMetrics closely - you can see individual game loop iterations"
- "That's what you need for real-time debugging"
- Simon: "Should I crank it all the way up?"
- Manuel: "Do it."
- Simon: Adjusts flag to 100Hz
- Manuel: "Aaand there's our CPU ceiling. 87%. Frame drops starting to appear."
- "Look at the metrics - you can see the exact moment performance degrades"
- Simon: "Rolling back... Done. Performance restored."
- "No restart. No deploy. Just OpenFeature."
-->

---
layout: default
---

# 4 Key Takeaways

<div class="grid grid-cols-2 gap-6 max-w-5xl mx-auto">

<div class="h-42 pl-14 pr-6 py-6 bg-gray-800/50 rounded-lg border border-gray-700 relative">
  <div class="absolute top-3 left-3 text-5xl font-bold text-teal-400/20">1</div>
  <div class="text-xl leading-relaxed">
    <strong>These tools work for real-time.</strong>
    <div class="mt-2 text-lg opacity-80">Games, IoT, embedded systems—anything real-time. Not just web apps.</div>
  </div>
</div>

<div class="h-42 pl-14 pr-6 py-6 bg-gray-800/50 rounded-lg border border-gray-700 relative">
  <div class="absolute top-3 left-3 text-5xl font-bold text-teal-400/20">2</div>
  <div class="text-xl leading-relaxed">
    <strong>But they're optimized for web apps.</strong>
    <div class="mt-2 text-lg opacity-80">Default configs assume 15-second scrapes, not 60Hz game loops.</div>
  </div>
</div>

<div class="h-42 pl-14 pr-6 py-6 bg-gray-800/50 rounded-lg border border-gray-700 relative">
  <div class="absolute top-3 left-3 text-5xl font-bold text-teal-400/20">3</div>
  <div class="text-xl leading-relaxed">
    <strong>With tuning, you can get subsecond observability on an $80 computer.</strong>
    <div class="mt-2 text-lg opacity-80">Intervals, push vs pull, storage backends.</div>
  </div>
</div>

<div class="h-42 pl-14 pr-6 py-6 bg-gray-800/50 rounded-lg border border-gray-700 relative">
  <div class="absolute top-3 left-3 text-5xl font-bold text-teal-400/20">4</div>
  <div class="text-xl leading-relaxed">
    <strong>The tools exist. The patterns exist.</strong>
    <div class="mt-2 text-lg opacity-80">What's missing is the documented path.</div>
  </div>
</div>

</div>

<!--
Speaker Notes (Simon - 19:00-21:00):
- "So, what did we actually learn from this experiment? Four big things"
- "One: CNCF observability tools are not just for web apps. They work for games, IoT, embedded systems, traffic management—anything real-time"
- "Two: But they're optimized for web apps. Default configs assume long-running processes with 15-second scrape intervals, not 60Hz game loops"
- "Three: With tuning—scrape intervals, push vs pull, storage backends—you can get subsecond observability on an $80 computer"
- "And four: The tools exist. The patterns exist. What's missing is the documented path"
-->

---
layout: default
---

# Where's the Real-Time Systems Demo?

<div class="grid grid-cols-2 gap-12 mt-8">


<div class="flex flex-col justify-center">
  <div class="text-xl leading-relaxed mb-8">
    Great for microservices—but where's the robotics? The game engines? The industrial IoT?
  </div>

  <div class="text-xl leading-relaxed">
    <strong class="text-amber-300">Try these tools on real-time systems.</strong> Document what works. Share tuning tricks. Contribute examples.
  </div>
</div>


<div>
  <div class="space-y-4">
    <img src="/images/otel-demo-1.png" alt="OTel Demo Frontend" class="rounded-lg shadow-lg w-76" />
    <img src="/images/otel-demo-2.png" alt="OTel Demo Cart" class="rounded-lg shadow-lg w-76" style="position: relative; top: -3rem; left: 6rem;"/>
  </div>
  <div class="text-center -mt-8 text-base opacity-80">
    E-commerce frontend. Payment gateway. Recommendation engine.
  </div>
</div>

</div>

<!--
Speaker Notes (Simon - 21:00-22:00):
- Simon (pointing at slide): "Look at the official OpenTelemetry demo. It's all web services—e-commerce frontend, payment gateway, recommendation engine"
- "Great for learning cloud-native observability if you're deploying microservices. But where's the robotics demo? The game engine? The industrial IoT sensor network?"
- Manuel: "That's the gap we're trying to fill"
- Simon: "Exactly. So this is our call to action"
- "If you're working on real-time systems, embedded hardware, anything with tight latency requirements—try these tools"
- "Document what works. Share the tuning tricks. Contribute examples back to the community"
- "Because right now, the technology works, but the onboarding path assumes you're deploying to Kubernetes, not controlling Bluetooth peripherals"
-->

---
layout: center
class: text-center
---

# JoustMania is Open Source

**Fork it. Break it. Make it better.**

<div class="text-lg mt-8 opacity-80">
P.S. If you solved subsecond Prometheus pull without VictoriaMetrics, tell us.
</div>

<div class="mt-8">
  <img src="/images/joustmania-qr.svg" alt="QR Code" width="200" class="inline-block" />
</div>

<div class="text-sm mt-4">
  <a href="https://github.com/WatchMeJoustMyFlags/JoustMania" class="text-blue-400">github.com/WatchMeJoustMyFlags/JoustMania</a>
</div>

<!--
Speaker Notes (Simon - 21:00-22:00 continued):
- "Everything we showed you today is open source"
- "The game, the configs, the dashboards, the Grafana setup with VictoriaMetrics, even the mock controller service if you want to simulate 18 players without buying 18 PlayStation Move controllers from eBay"
- "Fork it. Break it. Make it better"
- Manuel: "And if you figured out how to get subsecond Prometheus pull metrics without switching to VictoriaMetrics, please tell us"
-->

---
layout: section
---

# _Real-Time_ Observability with CNCF Tools

<!--
Speaker Notes (Both - 22:00-23:00):
- Manuel: "One last thing. We started this talk with a problem: Simon didn't know why the game crashed"
- Simon: "Now? We know exactly why. And when. And which controller caused it"
- Manuel: "The point isn't that we solved every observability problem for real-time systems. We didn't. The point is that we can. The tools are ready. The foundation is solid"
- Simon: "What's needed is more people trying unconventional use cases. So if you're building something real-time, something hardware-adjacent, something that doesn't fit the 'standard' observability mold—use these tools anyway. Then come tell us what broke"
- Both (turning to audience): "Thank you!"
-->


---
layout: cover
class: text-center
---

# Thank You!

<div class="grid grid-cols-2 gap-8 max-w-2xl mx-auto mt-8">
<div>

**Simon Schrottner**

<div class="text-sm mt-2 opacity-80">

Senior Software Engineer, Dynatrace

</div>

<div class="text-sm mt-2">

[@aepfli](https://github.com/aepfli) · [github.com/aepfli](https://github.com/aepfli)

</div>

</div>
<div>

**Manuel Timelthaler**

<div class="text-sm mt-2 opacity-80">

Software Architect, Tractive

</div>

<div class="text-sm mt-2">

[github.com/Lorti](https://github.com/Lorti)

</div>

</div>
</div>

<div class="text-4xl mt-16 font-bold">
Questions? 🎮
</div>

<!--
Speaker Notes (Both - 22:30-23:00):
- Thank the audience
- Open for questions
- Direct people to GitHub for code
-->


---
layout: section
---

# What questions do you have?

<div class="mt-8">

###### Quick recap of the journey
- 10s (Prometheus pull) → 500ms (push to Prom) → <100ms (push to VictoriaMetrics)
- From web app defaults to real-time hardware observability
- Everything is open source: [github.com/WatchMeJoustMyFlags/JoustMania](https://github.com/WatchMeJoustMyFlags/JoustMania) 

</div>
<div class="mt-8">

###### Topics we covered
- Microservices refactoring for OpenTelemetry
- Raspberry Pi 5 handling full observability stack
- Volume management with batching strategies
- Push metrics vs pull metrics
- VictoriaMetrics for high-frequency data
- Distributed tracing for hardware debugging

</div>

[//]: # (<img src="/images/title-slide-thumb.png" alt="Title Slide" width="480" style="position: absolute; bottom: 20px; right: 20px; border: 2px solid #44ffd2; border-radius: 4px;" />)
