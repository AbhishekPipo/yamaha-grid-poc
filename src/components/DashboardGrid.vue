<template>
  <DashboardLayoutWrapper>
    <v-container fluid class="gradient-background">
      <!-- Add Card button -->
      <div class="d-flex justify-end mb-4">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateToAddWidget"
          class="add-card-btn"
        >
          Add a Card
        </v-btn>
      </div>

      <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="50"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[16, 16]"
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
          <v-card
            v-if="item.i === 'Card 1'"
            class="h-full dashboard-card"
            elevation="0"
          >
            <div class="d-flex justify-space-between align-center px-4 pt-4">
              <v-card-title class="card-title">Graph</v-card-title>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="grey-darken-1"
                variant="text"
                class="delete-btn"
                @click="deleteChart(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
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
          <v-card
            v-else
            class="h-full dashboard-card"
            elevation="0"
          >
            <div class="card-content px-4 py-4">
              <v-card-title class="text-subtitle-1 text-grey-darken-1 font-weight-normal mb-2 pl-0">
                {{ item.i }}
              </v-card-title>
              <v-card-text class="text-h2 font-weight-normal pa-0">
                6,452
              </v-card-text>
            </div>
          </v-card>
        </grid-item>
      </grid-layout>
    </v-container>
  </DashboardLayoutWrapper>
</template>

<style scoped>
/* Enhanced gradient background */
.gradient-background {
  background: linear-gradient(135deg, #F5F7FA 0%, #ECEFF1 100%);
  min-height: 100vh;
  padding: 24px;
}

/* Enhanced card styling */
.dashboard-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

/* Card content styling */
.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-subtitle-1 {
  font-size: 1.125rem !important;
  line-height: 1.5 !important;
  color: rgba(0, 0, 0, 0.6) !important;
  letter-spacing: 0.015em;
  padding: 0 !important;
  margin: 0 !important;
}

.text-h2 {
  font-size: 2.5rem !important;
  line-height: 1.2 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  letter-spacing: -0.005em;
  padding: 0 !important;
}

/* Enhanced Add Card button */
.add-card-btn {
  background: linear-gradient(135deg, #6200EE 0%, #3700B3 100%);
  color: white;
  border-radius: 12px;
  padding: 0 24px;
  height: 44px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: none;
  box-shadow: 0 4px 20px rgba(98, 0, 238, 0.2);
  transition: all 0.3s ease;
}

.add-card-btn:hover {
  background: linear-gradient(135deg, #7722FF 0%, #4400D1 100%);
  box-shadow: 0 6px 25px rgba(98, 0, 238, 0.3);
  transform: translateY(-1px);
}

/* Chart container enhancement */
.chart-container {
  position: relative;
  height: calc(100% - 56px);
  width: 100%;
  margin: 0 auto;
  padding: 16px;
}

/* Delete button styling */
.delete-btn {
  opacity: 0.6;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.04);
}

/* Card title styling */
.card-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  letter-spacing: 0.0075em;
  padding: 0 !important;
  margin: 0 !important;
}

/* Override any default padding */
.v-card-title {
  padding-left: 0 !important;
}

.v-card-text {
  padding-left: 0 !important;
}
</style>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
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
import { Doughnut } from 'vue-chartjs'

const router = useRouter()

// Navigation function
const navigateToAddWidget = () => {
  router.push('/add-widget')
}

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
      '#FF6384',  // Full color palette for a vibrant look
      '#36A2EB',
      '#FFCE56'
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

// Initial layout configuration
const defaultLayout = [
  { i: 'Card 1', x: 0, y: 0, w: 4, h: 4 },
  { i: 'Card 2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'Card 3', x: 8, y: 0, w: 4, h: 2 },
  { i: 'Card 4', x: 0, y: 4, w: 6, h: 2 },
  { i: 'Card 5', x: 6, y: 4, w: 6, h: 2 },
]

const layout = ref(defaultLayout)

// Delete chart function
const deleteChart = (item) => {
  layout.value = layout.value.filter(layoutItem => layoutItem.i !== item.i)
  saveLayout(layout.value)
}

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

onMounted(() => {
  loadSavedLayout()
})

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

function validateLayout(layoutData) {
  return layoutData.map(item => ({
    i: item.i || '',
    x: Number.isInteger(item.x) ? item.x : 0,
    y: Number.isInteger(item.y) ? item.y : 0,
    w: Number.isInteger(item.w) ? Math.max(item.w, 1) : 4,
    h: Number.isInteger(item.h) ? Math.max(item.h, 1) : 2,
  }))
}

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


