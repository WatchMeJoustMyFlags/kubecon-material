import { ref } from 'vue'

// Module-level singleton — fetched once, shared across all slides
const traceUrl = ref(null)
let fetched = false

export function useJaegerTrace() {
  async function prefetch(host, service, operation) {
    if (fetched) return
    fetched = true

    const params = new URLSearchParams({ service, limit: 1 })
    if (operation) params.set('operation', operation)

    const fallback = `http://${host}/jaeger/search?${params}&uiEmbed=v0&uiSearchHideGraph=1`
    try {
      const res = await fetch(`/jaeger-proxy/api/traces?${params}`)
      const data = await res.json()
      const traceId = data.data?.[0]?.traceID
      traceUrl.value = traceId
        ? `http://${host}/jaeger/trace/${traceId}?uiEmbed=v0`
        : fallback
    } catch {
      traceUrl.value = fallback
    }
  }

  return { traceUrl, prefetch }
}
