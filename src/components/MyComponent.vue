<template>
  <div>
    <p>{{ msg }}{{ count }}</p> 
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const msg = 'Hello Vitest'
const count = ref(0)

const increment = () => {
  count.value++
}
</script>
