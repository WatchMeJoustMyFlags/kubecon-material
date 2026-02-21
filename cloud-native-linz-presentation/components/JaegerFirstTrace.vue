<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  host: string
  service: string
}>()

const src = ref('')

onMounted(async () => {
  const fallback = `http://${props.host}/jaeger/search?service=${props.service}&uiEmbed=v0&uiSearchHideGraph=1`
  try {
    const res = await fetch(`/jaeger-proxy/api/traces?service=${props.service}&limit=1`)
    const data = await res.json()
    const traceId = data.data?.[0]?.traceID
    src.value = traceId
      ? `http://${props.host}/jaeger/trace/${traceId}?uiEmbed=v0`
      : fallback
  } catch {
    src.value = fallback
  }
})
</script>

<template>
  <iframe v-if="src" :src="src" class="w-full h-full border-none" />
</template>
