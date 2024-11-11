<template>
     <!-- Include the Sidebar component -->
     <DashboardSidebar />
     <!-- Include the Header component -->
     <DashboardHeader />
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
          <!-- Dynamic Chart Card -->
          <div
            v-if="item.chartType"
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold">{{ item.title || 'Chart' }}</h2>
              <button
                class="text-gray-500 hover:text-red-500"
                @click="deleteWidget(item)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="relative h-[200px]">
              <component
                :is="getChartComponent(item.chartType)"
                :data="item.chartData"
                :options="item.chartOptions"
              />
            </div>
          </div>
          <!-- Static Cards -->
          <div
            v-else
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col justify-center"
          >
            <h3 class="text-gray-500 text-lg">{{ getCardTitle(item.i) }}</h3>
            <p class="text-3xl font-bold mt-2">{{ getCardValue(item.i) }}</p>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </DashboardLayoutWrapper>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import { Doughnut, Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);
const router = useRouter();
const layout = ref([]);
// Chart component mapping
const chartComponents = {
  doughnut: Doughnut,
  pie: Pie,
  bar: Bar
};
const getChartComponent = (type) => chartComponents[type] || Doughnut;
const getCardTitle = (cardId) => {
  const titles = {
    'Card 2': 'All Devices Health',
    'Card 3': 'Total Devices Status',
    'Card 4': 'Active Projects',
    'Card 5': 'Total Users',
    'Card 6': 'Total Devices'
  };
  return titles[cardId] || 'Statistics';
};
const getCardValue = (cardId) => {
  const values = {
    'Card 2': '6,452',
    'Card 3': '42,502',
    'Card 4': '56,201',
    'Card 5': '6,452',
    'Card 6': '62,303'
  };
  return values[cardId] || '0';
};
const navigateToAddWidget = () => {
  router.push('/add-widget');
};
const deleteWidget = (item) => {
  layout.value = layout.value.filter(widget => widget.i !== item.i);
  saveLayout(layout.value);
};
const saveLayout = (newLayout) => {
  localStorage.setItem('dashboard-grid-layout', JSON.stringify(newLayout));
};
const loadSavedLayout = () => {
  const savedLayout = localStorage.getItem('dashboard-grid-layout');
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout);
  }
};
const onLayoutUpdated = (newLayout) => {
  layout.value = newLayout;
};
const onResizeEnd = (layout) => {
  saveLayout(layout);
};
const onDragEnd = (layout) => {
  saveLayout(layout);
};
onMounted(() => {
  loadSavedLayout();
});
</script>
