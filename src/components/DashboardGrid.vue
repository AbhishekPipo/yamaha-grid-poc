<template>
  <DashboardLayoutWrapper>
    <v-container fluid>
      <grid-layout
        :layout="layout"
        :col-num="12"
        :row-height="50"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        @layoutChange="saveLayout"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
        >
          <v-card>
            <v-card-title>{{ item.i }}</v-card-title>
            <v-card-text>Content for {{ item.i }}</v-card-text>
          </v-card>
        </grid-item>
      </grid-layout>
    </v-container>
  </DashboardLayoutWrapper>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import DashboardLayoutWrapper from '@/layouts/DashboardLayoutWrapper.vue'

// Initialize layout state with default layout
const layout = ref([
  { i: 'Card 1', x: 0, y: 0, w: 4, h: 2 },
  { i: 'Card 2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'Card 3', x: 8, y: 0, w: 4, h: 2 },
  { i: 'Card 4', x: 0, y: 2, w: 6, h: 2 },
  { i: 'Card 5', x: 6, y: 2, w: 6, h: 2 },
])

// Load the layout from localStorage if available
onMounted(() => {
  const savedLayout = localStorage.getItem('gridLayout')
  if (savedLayout) {
    const parsedLayout = JSON.parse(savedLayout)
    console.log('Loaded Layout:', parsedLayout)
    // Check if the loaded layout is in the correct format
    layout.value = validateLayout(parsedLayout)
  }
})

// Save the layout to localStorage whenever it changes
function saveLayout(newLayout) {
  console.log('Saving Layout:', newLayout)
  layout.value = newLayout
  localStorage.setItem('gridLayout', JSON.stringify(newLayout))  // Save to localStorage
}

// Validate the layout to ensure it's correctly formatted
function validateLayout(layout) {
  return layout.map(item => ({
    ...item,
    x: item.x ?? 0,
    y: item.y ?? 0,
    w: item.w ?? 4,
    h: item.h ?? 2
  }))
}
</script>

<style scoped>
.v-card {
  height: 100%;
}
</style>
