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
import img0 from '/jsjoust-brent01.jpg'
import img1 from '/jsjoust-sara1.jpg'
import img2 from '/jsjoust-brent02.jpg'
import img3 from '/jsjoust-photo1.jpg'
import img4 from '/jsjoust-brent03.jpg'
import img5 from '/jsjoust-sara2.jpg'
import img6 from '/jsjoust-brent04.jpg'
import img7 from '/jsjoust-photo2.png'
import img8 from '/jsjoust-brent05.jpg'
import img9 from '/jsjoust-brent06.jpg'
import img10 from '/jsjoust-brent09.jpg'
import img11 from '/jsjoust-brent10.jpg'

const images = [img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11]

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
