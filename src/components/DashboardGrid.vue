<template>
  <DashboardLayoutWrapper>
    <v-container fluid>
      <!-- Add Card button -->
      <div class="d-flex justify-end mb-4">
        <v-btn
          class="add-card-btn"
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateToAddWidget"
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
          class="grid-item"
        >
          <!-- Donut Chart Card -->
          <v-card v-if="item.i === 'Card 1'" class="chart-card h-full">
            <div class="d-flex justify-space-between align-center pa-4 card-header">
              <v-card-title class="pa-0">Graph</v-card-title>
              <v-btn
                icon="mdi-delete"
                size="small"
                color="grey"
                variant="text"
                @click="deleteChart(item)"
                class="delete-btn"
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
          <v-card v-else class="default-card h-full">
            <v-card-title class="default-card-title">{{ item.i }}</v-card-title>
            <v-card-text class="default-card-content">Content for {{ item.i }}</v-card-text>
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

const navigateToAddWidget = () => {
  router.push('/add-widget')
}

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const STORAGE_KEY = 'dashboard-grid-layout'
const isResizing = ref(false)
const isDragging = ref(false)

const chartData = {
  labels: ['Value A', 'Value B', 'Value C'],
  datasets: [{
    data: [20, 60, 20],
    backgroundColor: ['#2196F3', '#8BC34A', '#FFC107'],
    borderColor: '#fff',
    borderWidth: 2,
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

const defaultLayout = [
  { i: 'Card 1', x: 0, y: 0, w: 4, h: 4 },
  { i: 'Card 2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'Card 3', x: 8, y: 0, w: 4, h: 2 },
  { i: 'Card 4', x: 0, y: 4, w: 6, h: 2 },
  { i: 'Card 5', x: 6, y: 4, w: 6, h: 2 },
]

const layout = ref(defaultLayout)

const deleteChart = (item) => {
  layout.value = layout.value.filter(layoutItem => layoutItem.i !== item.i)
  saveLayout(layout.value)
}

watch(layout, (newLayout) => {
  if (!isResizing.value && !isDragging.value) saveLayout(newLayout)
}, { deep: true })

onMounted(() => loadSavedLayout())

function saveLayout(newLayout) {
  const validatedLayout = validateLayout(newLayout)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedLayout))
  } catch (error) {
    console.error('Error saving layout:', error)
  }
}

function loadSavedLayout() {
  try {
    const savedLayout = localStorage.getItem(STORAGE_KEY)
    if (savedLayout) layout.value = validateLayout(JSON.parse(savedLayout))
  } catch (error) {
    layout.value = defaultLayout
  }
}

function validateLayout(layoutData) {
  return layoutData.map(item => ({
    i: item.i || '',
    x: Number.isInteger(item.x) ? item.x : 0,
    y: Number.isInteger(item.y) ? item.y : 0,
    w: Math.max(item.w, 1),
    h: Math.max(item.h, 1),
  }))
}

function onLayoutUpdated(newLayout) {
  if (!isResizing.value && !isDragging.value) layout.value = validateLayout(newLayout)
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
.add-card-btn {
  background: linear-gradient(to right, #2196F3, #21CBF3);
  color: white;
  border-radius: 12px;
  transition: transform 0.2s ease;
}
.add-card-btn:hover {
  transform: scale(1.05);
}

.grid-item {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  background: linear-gradient(to right, #F5F7FA, #ECEFF1);
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

}
.grid-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.01);
}

.chart-card,
.default-card {
  background: linear-gradient(to right, #F5F7FA, #ECEFF1);
}

.chart-card .card-header {
  border-bottom: 1px solid #E0E0E0;
}

.default-card-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.delete-btn {
  transition: color 0.2s ease;
}
.delete-btn:hover {
  color: #f44336;
}

.chart-container {
  position: relative;
  height: calc(100% - 48px);
  width: 100%;
  margin: 0 auto;
}

.v-card {
  padding: 12px;
  transition: transform 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>
