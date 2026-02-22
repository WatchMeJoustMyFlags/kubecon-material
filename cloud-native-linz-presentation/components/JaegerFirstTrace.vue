<script setup lang="ts">
import { useJaegerTrace } from '../composables/useJaegerTrace.js'

const { traceUrl } = useJaegerTrace()
</script>

<template>
  <iframe v-if="traceUrl" :src="traceUrl" class="w-full h-full border-none" />
</template>
