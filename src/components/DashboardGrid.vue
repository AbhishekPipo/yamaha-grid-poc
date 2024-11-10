<template>
  <DashboardLayoutWrapper>
    <!-- Parent Container with Gradient Background -->
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
          <v-card v-if="item.i === 'Card 1'" class="h-full card-gradient">
            <div class="d-flex justify-space-between align-center pa-4">
              <v-card-title class="pa-0">Graph</v-card-title>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="grey"
                variant="text"
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
          <v-card v-else class="h-full card-gradient">
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

<style scoped>
/* Apply the gradient background to the parent container */
.gradient-background {
  background: linear-gradient(to right, #F5F7FA, #ECEFF1);
  min-height: 100vh;  /* Ensure the gradient fills the whole screen */
  padding: 20px;
}

/* Apply gradient background to the v-card */
.card-gradient {
  background: linear-gradient(to right, #F5F7FA, #ECEFF1);
  height: 100%;
  width: 100%;
}

/* Customize the chart container */
.chart-container {
  position: relative;
  height: calc(100% - 48px); /* Adjust to leave space for card title */
  width: 100%;
  margin: 0 auto;
}

/* Style for the Add Card button */
.add-card-btn {
  background-color: #6200EE; /* Vibrant purple */
  color: white;
  border-radius: 24px;
  padding: 12px 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.add-card-btn:hover {
  background-color: #3700B3; /* Darker shade on hover */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.add-card-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(98, 0, 238, 0.5);
}
</style>
