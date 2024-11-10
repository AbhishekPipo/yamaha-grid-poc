<template>
  <DashboardLayoutWrapper>
    <v-container fluid>
      <!-- Add Card button -->
      <div class="d-flex justify-end mb-4">
        <v-btn
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
        >
          <!-- Donut Chart Card -->
          <v-card v-if="item.i === 'Card 1'" class="h-full">
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
      '#9E9E9E',
      '#BDBDBD',
      '#E0E0E0'
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

// Rest of the functions remain the same...
// [Previous functions: saveLayout, loadSavedLayout, validateLayout,
// onLayoutUpdated, onResizeStart, onResizeEnd, onResize, onDragEnd]

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
