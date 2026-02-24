<template>
  <div style="position: relative; width: 504px; height: 284px; margin: 0 auto; border-radius: 0.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.6); overflow: hidden; transform: rotate(1deg);">
    <img
      v-for="(img, i) in images"
      :key="img"
      :src="img"
      alt="J.S. Joust gameplay photo"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 1s ease-in-out',
        opacity: i === current ? 1 : 0,
      }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const base = import.meta.env.BASE_URL
const images = [
  `${base}images/jsjoust-images/jsjoust-brent01.jpg`,
  `${base}images/jsjoust-images/jsjoust-sara1.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent02.jpg`,
  `${base}images/jsjoust-images/jsjoust-photo1.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent03.jpg`,
  `${base}images/jsjoust-images/jsjoust-sara2.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent04.jpg`,
  `${base}images/jsjoust-images/jsjoust-photo2.png`,
  `${base}images/jsjoust-images/jsjoust-brent05.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent06.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent09.jpg`,
  `${base}images/jsjoust-images/jsjoust-brent10.jpg`,
]

const current = ref(0)
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % images.length
  }, 2500)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
