<template>
  <DashboardLayoutWrapper>
    <v-container fluid>
      <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="50"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        @layout-updated="onLayoutUpdated"
        @resize="onResize"
        @resize-start="onResizeStart"
        @resize-end="onResizeEnd"
        @drag-end="onDragEnd"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :i="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
        >
          <!-- Donut Chart Card -->
          <v-card v-if="item.i === 'Card 1'" class="h-full">
            <v-card-title>Graph</v-card-title>
            <v-card-text>
              <div class="chart-container">
                <Doughnut
                  :data="chartData"
                  :options="chartOptions"
                />
              </div>
            </v-card-text>
          </v-card>
          <!-- Default Card -->
          <v-card v-else class="h-full">
            <v-card-title>{{ item.i }}</v-card-title>
            <v-card-text>Content for {{ item.i }}</v-card-text>
          </v-card>
        </grid-item>
      </grid-layout>
    </v-container>
  </DashboardLayoutWrapper>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout-v3'
import DashboardLayoutWrapper from '@/layouts/DashboardLayoutWrapper.vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'  // Changed from DoughnutChart to Doughnut

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
)

const STORAGE_KEY = 'dashboard-grid-layout'
const isResizing = ref(false)
const isDragging = ref(false)

// Chart configuration
const chartData = {
  labels: ['Value A', 'Value B', 'Value C'],
  datasets: [{
    data: [20, 60, 20],
    backgroundColor: [
      '#9E9E9E',  // Value A - grey
      '#BDBDBD',  // Value B - lighter grey
      '#E0E0E0'   // Value C - lightest grey
    ],
    borderWidth: 0
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 10,
        padding: 20
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}%`
      }
    }
  }
}

// Initial layout configuration - Updated height for chart
const defaultLayout = [
  { i: 'Card 1', x: 0, y: 0, w: 4, h: 4 }, // Increased height for chart
  { i: 'Card 2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'Card 3', x: 8, y: 0, w: 4, h: 2 },
  { i: 'Card 4', x: 0, y: 4, w: 6, h: 2 },
  { i: 'Card 5', x: 6, y: 4, w: 6, h: 2 },
]

const layout = ref(defaultLayout)

// Watch for layout changes and save them
watch(
  layout,
  (newLayout) => {
    if (!isResizing.value && !isDragging.value) {
      saveLayout(newLayout)
    }
  },
  { deep: true }
)

// Load saved layout on component mount
onMounted(() => {
  loadSavedLayout()
})

// Save layout to localStorage with validation
function saveLayout(newLayout) {
  if (!newLayout || !Array.isArray(newLayout)) {
    console.error('Invalid layout data')
    return
  }

  const validatedLayout = validateLayout(newLayout)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedLayout))
    console.log('Layout saved successfully:', validatedLayout)
  } catch (error) {
    console.error('Error saving layout:', error)
  }
}

// Load and validate saved layout
function loadSavedLayout() {
  try {
    const savedLayout = localStorage.getItem(STORAGE_KEY)
    if (savedLayout) {
      const parsedLayout = JSON.parse(savedLayout)
      layout.value = validateLayout(parsedLayout)
      console.log('Layout loaded successfully:', layout.value)
    } else {
      console.log('No saved layout found, using default')
      layout.value = defaultLayout
    }
  } catch (error) {
    console.error('Error loading layout:', error)
    layout.value = defaultLayout
  }
}

// Validate layout items
function validateLayout(layoutData) {
  return layoutData.map(item => ({
    i: item.i || '',
    x: Number.isInteger(item.x) ? item.x : 0,
    y: Number.isInteger(item.y) ? item.y : 0,
    w: Number.isInteger(item.w) ? Math.max(item.w, 1) : 4,
    h: Number.isInteger(item.h) ? Math.max(item.h, 1) : 2,
  }))
}

// Event Handlers
function onLayoutUpdated(newLayout) {
  if (!isResizing.value && !isDragging.value) {
    layout.value = validateLayout(newLayout)
  }
}

function onResizeStart() {
  isResizing.value = true
}

function onResizeEnd(layout) {
  isResizing.value = false
  saveLayout(layout)
}

function onResize(item, newLayout) {
  layout.value = validateLayout(newLayout)
}

function onDragEnd(layout) {
  isDragging.value = false
  saveLayout(layout)
}
</script>

<style scoped>
.v-card {
  height: 100%;
  width: 100%;
}

.chart-container {
  position: relative;
  height: calc(100% - 48px);
  width: 100%;
  margin: 0 auto;
}
</style>
