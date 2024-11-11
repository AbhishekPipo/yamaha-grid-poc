<template>
  <DashboardLayoutWrapper>
    <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <!-- Add Card button -->
      <div class="flex justify-end mb-6">
        <button
          class="bg-indigo-600 text-white rounded-lg py-2 px-6 shadow-lg hover:bg-indigo-700 transition-all"
          @click="navigateToAddWidget"
        >
          <i class="fas fa-plus mr-2"></i> Add a Card
        </button>
      </div>

      <!-- Grid Layout -->
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
          <div
            v-if="item.i === 'Card 1'"
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">Graph</h2>
              <button
                class="text-gray-500 hover:text-red-500"
                @click="deleteChart(item)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="relative h-[200px]">
              <Doughnut :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Default Card -->
          <div
            v-else
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col justify-center"
          >
            <h3 class="text-gray-500 text-lg">{{ item.i }}</h3>
            <p class="text-3xl font-bold mt-2">6,452</p>
          </div>
        </grid-item>
      </grid-layout>
    </div>
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
  CategoryScale,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

const router = useRouter()

// Navigation function
const navigateToAddWidget = () => {
  router.push('/add-widget')
}

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const STORAGE_KEY = 'dashboard-grid-layout'
const isResizing = ref(false)
const isDragging = ref(false)

// Chart configuration
const chartData = {
  labels: ['Value A', 'Value B', 'Value C'],
  datasets: [
    {
      data: [20, 60, 20],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      borderWidth: 0,
    },
  ],
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
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.raw}%`,
      },
    },
  },
}

const defaultLayout = [
  { i: 'Card 1',  x: 0, y: 0, w: 4, h: 4 },
  { i: 'Card 2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'Card 3', x: 8, y: 0, w: 4, h: 2 },
  { i: 'Card 4', x: 0, y: 4, w: 6, h: 2 },
  { i: 'Card 5', x: 6, y: 4, w: 6, h: 2 },
]

const layout = ref(defaultLayout)

// Delete chart function
const deleteChart = (item) => {
  layout.value = layout.value.filter((layoutItem) => layoutItem.i !== item.i)
  saveLayout(layout.value)
}

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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout))
}

function loadSavedLayout() {
  const savedLayout = localStorage.getItem(STORAGE_KEY)
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout)
  }
}

function onLayoutUpdated(newLayout) {
  if (!isResizing.value && !isDragging.value) {
    layout.value = newLayout
  }
}

function onResizeStart() {
  isResizing.value = true
}

function onResizeEnd(layout) {
  isResizing.value = false
  saveLayout(layout)
}

function onDragEnd(layout) {
  isDragging.value = false
  saveLayout(layout)
}
</script>

<style scoped>
/* Tailwind CSS classes are used for styling */
</style>
