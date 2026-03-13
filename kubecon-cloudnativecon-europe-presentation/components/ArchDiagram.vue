<template>
  <div ref="el" class="flex justify-center items-center w-full h-full" v-html="html" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import lz from 'lz-string'
import mermaid from 'mermaid'

const props = defineProps({
  step: {
    type: Number,
    default: 1,
  },
})

const INIT = `%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 30, 'rankSpacing': 40}}}%%`
const STYLES = `
    style Menu fill:#f141a8,stroke:#f141a8,stroke-width:2px,color:#000000
    style GC fill:#5eadf2,stroke:#5eadf2,stroke-width:2px,color:#000000
    style CM fill:#44ffd2,stroke:#44ffd2,stroke-width:2px,color:#000000
    style Audio fill:#ffe45e,stroke:#ffe45e,stroke-width:2px,color:#000000
    style Controllers fill:#15c2cb,stroke:#15c2cb,stroke-width:2px,color:#000000
    style RaspberryPi fill:transparent,stroke:#aaaaaa,stroke-width:2px,color:#aaaaaa
    linkStyle default stroke:#ffffff,fill:none`

const STYLES_INFRA = `
    style Flagd fill:#0e131f,stroke:#ffe45e,stroke-width:2px,color:#ffe45e
    style OTel fill:#f39c12,stroke:#f39c12,stroke-width:2px,color:#0e131f
    style Observability fill:#95a5a6,stroke:#95a5a6,stroke-width:2px,color:#0e131f
    style Infrastructure fill:transparent,stroke:#aaaaaa,stroke-width:2px,color:#aaaaaa`

const DIAGRAM_STEP1 = `${INIT}
graph LR
    subgraph RaspberryPi["Raspberry Pi"]
        direction LR
        Menu[Menu<br/>:50054]
        GC[Game Coordinator<br/>:50053]
        CM[Controller Manager<br/>:50052]
        Audio[Audio<br/>:50056]
        Controllers[Controllers]
    end
    Menu -->|gRPC| GC
    Menu <-->|gRPC Stream| CM
    GC <-->|gRPC Stream| CM
    GC -->|gRPC| Audio
    Menu -->|gRPC| Audio
    CM -->|Bluetooth| Controllers
${STYLES}`

const DIAGRAM_STEP2 = `${INIT}
graph LR
    subgraph RaspberryPi["Raspberry Pi"]
        direction LR
        Menu[Menu<br/>:50054]
        GC[Game Coordinator<br/>:50053]
        CM[Controller Manager<br/>:50052]
        Audio[Audio<br/>:50056]
        Controllers[Controllers]
    end
    subgraph Infrastructure["Infrastructure"]
        direction LR
        Flagd[flagd<br/>:8015]
        OTel[OTel Collector<br/>:4317]
        Observability[Grafana<br/>Jaeger<br/>Prometheus<br/>Loki]
    end
    Menu -->|gRPC| GC
    Menu <-->|gRPC Stream| CM
    GC <-->|gRPC Stream| CM
    GC -->|gRPC| Audio
    Menu -->|gRPC| Audio
    Flagd -.->|gRPC| GC
    Flagd -.->|gRPC| Audio
    Flagd -.->|gRPC| Menu
    Flagd -.->|gRPC| CM
    CM -->|Bluetooth| Controllers
    Menu -.->|OTLP| OTel
    GC -.->|OTLP| OTel
    CM -.->|OTLP| OTel
    Audio -.->|OTLP| OTel
    OTel -->|metrics<br/>traces<br/>logs| Observability
${STYLES}${STYLES_INFRA}`

mermaid.initialize({ startOnLoad: false })

const html = ref('')
const makeId = () => `mermaid-${Math.random().toString(36).slice(2)}`

watchEffect(async () => {
  const diagram = props.step >= 2 ? DIAGRAM_STEP2 : DIAGRAM_STEP1
  const id = makeId()
  const el = document.createElement('div')
  document.body.appendChild(el)
  try {
    const { svg } = await mermaid.render(id, diagram, el)
    html.value = svg
  } finally {
    document.body.removeChild(el)
  }
})
</script>
