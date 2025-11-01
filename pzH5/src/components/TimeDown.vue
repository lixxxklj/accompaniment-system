<template>
  <div>{{ display }}</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const { second } = defineProps(['second'])
const emit = defineEmits(['finish'])

const left = ref(second)
const display = computed(() => {
  const hh = String(Math.floor(left.value / 3600)).padStart(2, '0')
  const mm = String(Math.floor((left.value % 3600) / 60)).padStart(2, '0')
  const ss = String(Math.floor(left.value % 60)).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
})

const timer = setInterval(() => {
  if(left.value <= 0) {
    clearInterval(timer)
    emit('finish')
    return
  }
  left.value -= 1
}, 1000)
</script>


<style scoped>
.read-the-docs {
  color: #888;
}
</style>
