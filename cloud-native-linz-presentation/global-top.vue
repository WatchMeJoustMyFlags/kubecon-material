<script setup>
import { onMounted } from 'vue'
import { useJaegerTrace } from './composables/useJaegerTrace.js'
import { useSlideContext } from '@slidev/client'

const { $slidev } = useSlideContext()
const { prefetch } = useJaegerTrace()

onMounted(() => {
  prefetch($slidev.configs.demo_host, 'menu-service', 'start_game')
})
</script>

<template></template>
