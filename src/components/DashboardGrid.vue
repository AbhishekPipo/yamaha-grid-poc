<!-- dashboardgrid.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
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
import { Doughnut, Pie, Bar } from 'vue-chartjs';

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

// Watch for any changes to the layout
watch(
  () => layout.value,
  (newLayout) => {
    saveLayout(newLayout);
  },
  { deep: true }
);

const chartComponents = {
  doughnut: Doughnut,
  pie: Pie,
  bar: Bar
};

const getChartComponent = (type) => chartComponents[type] || Doughnut;

const getChartOptions = (item) => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12
          }
        }
      }
    }
  };

  if (item.chartType === 'doughnut' || item.chartType === 'pie') {
    return {
      ...baseOptions,
      cutout: item.chartType === 'doughnut' ? '70%' : 0,
    };
  }

  if (item.chartType === 'bar') {
    return {
      ...baseOptions,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  }

  return baseOptions;
};

// Static card data
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

const getCardIcon = (cardId) => {
  const icons = {
    'Card 2': 'fas fa-heartbeat',
    'Card 3': 'fas fa-server',
    'Card 4': 'fas fa-project-diagram',
    'Card 5': 'fas fa-users',
    'Card 6': 'fas fa-microchip'
  };
  return icons[cardId] || 'fas fa-chart-line';
};

// Initialize default layout with static cards
const initializeDefaultLayout = () => {
  return [
    { i: 'Card 2', x: 0, y: 0, w: 3, h: 4 },
    { i: 'Card 3', x: 3, y: 0, w: 3, h: 4 },
    { i: 'Card 4', x: 6, y: 0, w: 3, h: 4 },
    { i: 'Card 5', x: 9, y: 0, w: 3, h: 4 },
    { i: 'Card 6', x: 0, y: 4, w: 3, h: 4 }
  ];
};

const navigateToAddWidget = () => {
  router.push('/add-widget');
};

// const editWidget = (item) => {
//   localStorage.setItem('editing-widget', JSON.stringify(item));
//   router.push('/edit-widget');
// };

const deleteWidget = (item) => {
  layout.value = layout.value.filter(widget => widget.i !== item.i);
  saveLayout(layout.value);
};

// Enhanced layout saving function with validation
const saveLayout = (newLayout) => {
  if (!Array.isArray(newLayout)) return;

  // Ensure all required properties exist before saving
  const validLayout = newLayout.map(item => ({
    i: item.i,
    x: parseInt(item.x) || 0,
    y: parseInt(item.y) || 0,
    w: parseInt(item.w) || 3,
    h: parseInt(item.h) || 4,
    chartType: item.chartType,
    chartData: item.chartData,
    title: item.title
  }));

  localStorage.setItem('dashboard-grid-layout', JSON.stringify(validLayout));
};

// Enhanced layout loading function with validation
const loadSavedLayout = () => {
  try {
    const savedLayout = localStorage.getItem('dashboard-grid-layout');
    if (savedLayout) {
      const parsedLayout = JSON.parse(savedLayout);

      // Validate each item in the layout
      const validatedLayout = parsedLayout.map(item => ({
        i: item.i,
        x: parseInt(item.x) || 0,
        y: parseInt(item.y) || 0,
        w: parseInt(item.w) || 3,
        h: parseInt(item.h) || 4,
        chartType: item.chartType,
        chartData: item.chartData,
        title: item.title
      }));

      layout.value = validatedLayout.length > 0 ? validatedLayout : initializeDefaultLayout();
    } else {
      layout.value = initializeDefaultLayout();
    }
  } catch (error) {
    console.error('Error loading layout:', error);
    layout.value = initializeDefaultLayout();
  }
};

// Event handlers that trigger layout saves
const onLayoutUpdated = (newLayout) => {
  // Create a deep copy to ensure reactivity
  const layoutCopy = JSON.parse(JSON.stringify(newLayout));
  layout.value = layoutCopy;
  saveLayout(layoutCopy);
};

const onResizeEnd = (newLayout) => {
  const layoutCopy = JSON.parse(JSON.stringify(newLayout));
  layout.value = layoutCopy;
  saveLayout(layoutCopy);
};

const onDragEnd = (newLayout) => {
  const layoutCopy = JSON.parse(JSON.stringify(newLayout));
  layout.value = layoutCopy;
  saveLayout(layoutCopy);
};

onMounted(() => {
  loadSavedLayout();
});
</script>

<template>
  <DashboardSidebar />
  <DashboardHeader />
  <DashboardLayoutWrapper>
    <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <div class="flex justify-end mb-6">
        <button
          class="bg-indigo-600 text-white rounded-lg py-2 px-6 shadow-lg hover:bg-indigo-700 transition-all"
          @click="navigateToAddWidget"
        >
          <i class="fas fa-plus mr-2"></i> Add a Card
        </button>
      </div>

      <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="50"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[16, 16]"
        :use-css-transforms="true"
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
          :min-w="3"
          :min-h="3"
        >
          <!-- Dynamic Chart Card -->
          <div
            v-if="item.chartType"
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-800">{{ item.title || 'Chart' }}</h2>
              <div class="flex items-center space-x-2">
                <!-- <button
                  class="text-gray-500 hover:text-blue-500 transition-colors"
                  @click="editWidget(item)"
                >
                  <i class="fas fa-edit"></i>
                </button> -->
                <button
                  class="text-gray-500 hover:text-red-500 transition-colors"
                  @click="deleteWidget(item)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="relative h-[calc(100%-3rem)]">
              <component
                :is="getChartComponent(item.chartType)"
                :data="item.chartData"
                :options="getChartOptions(item)"
                class="h-full w-full"
              />
            </div>
          </div>

          <!-- Static Cards -->
          <div
            v-else
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <div class="flex justify-between items-center h-full">
              <div class="flex flex-col justify-between py-2">
                <div>
                  <h3 class="text-gray-500 text-lg font-medium">{{ getCardTitle(item.i) }}</h3>
                  <p class="text-3xl font-bold text-gray-800 mt-2">{{ getCardValue(item.i) }}</p>
                </div>
                <div class="flex items-center mt-4">
                  <span class="text-green-500 text-sm">
                    <i class="fas fa-arrow-up mr-1"></i>4.75%
                  </span>
                  <span class="text-gray-400 text-sm ml-1">vs last week</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <i :class="getCardIcon(item.i)" class="text-indigo-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </DashboardLayoutWrapper>
</template>

<style scoped>
.vue-grid-item {
  transition: all 200ms ease;
  transition-property: left, top, right;
}

.vue-grid-item.vue-grid-placeholder {
  background: #f0f0f0;
  opacity: 0.5;
  border: 2px dashed #999;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: transparent;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.hover\:-translate-y-1:hover {
  transition: transform 0.2s ease-in-out;
}

button {
  transition: all 0.2s ease-in-out;
}
</style>
