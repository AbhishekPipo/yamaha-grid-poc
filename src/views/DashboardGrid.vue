<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { GridLayout, GridItem } from 'vue-grid-layout-v3';
import DashboardLayoutWrapper from '@/layouts/DashboardLayoutWrapper.vue';
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
  
  <DashboardLayoutWrapper>
    <div class="tw-min-h-screen tw-bg-gradient-to-r tw-from-gray-100 tw-to-gray-200 tw-p-6">
      <div class="tw-flex tw-justify-end tw-mb-6">
        <button
          class="tw-bg-indigo-600 tw-text-white tw-rounded-lg tw-py-2 tw-px-6 tw-shadow-lg hover:tw-bg-indigo-700 tw-transition-all"
          @click="navigateToAddWidget"
        >
          <i class="fas fa-plus tw-mr-2"></i> Add a Card
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
            class="tw-h-full tw-p-4 tw-bg-white tw-rounded-xl tw-shadow-lg tw-transition-transform hover:tw-translate-y-1"
          >
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <h2 class="tw-text-lg tw-font-semibold tw-text-gray-800">{{ item.title || 'Chart' }}</h2>
              <div class="tw-flex tw-items-center tw-space-x-2">
                <button
                  class="tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors"
                  @click="deleteWidget(item)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="tw-relative tw-h-[calc(100%-3rem)]">
              <component
                :is="getChartComponent(item.chartType)"
                :data="item.chartData"
                :options="getChartOptions(item)"
                class="tw-h-full tw-w-full"
              />
            </div>
          </div>

          <!-- Static Cards -->
          <div
            v-else
            class="tw-h-full tw-p-4 tw-bg-white tw-rounded-xl tw-shadow-lg tw-transition-transform hover:tw-translate-y-1"
          >
            <div class="tw-flex tw-justify-between tw-items-center tw-h-full">
              <div class="tw-flex tw-flex-col tw-justify-between tw-py-2">
                <div>
                  <h3 class="tw-text-gray-500 tw-text-lg tw-font-medium">{{ getCardTitle(item.i) }}</h3>
                  <p class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mt-2">{{ getCardValue(item.i) }}</p>
                </div>
                <div class="tw-flex tw-items-center tw-mt-4">
                  <span class="tw-text-green-500 tw-text-sm">
                    <i class="fas fa-arrow-up tw-mr-1"></i>4.75%
                  </span>
                  <span class="tw-text-gray-400 tw-text-sm tw-ml-1">vs last week</span>
                </div>
              </div>
              <div class="tw-flex tw-items-center">
                <div class="tw-w-12 tw-h-12 tw-rounded-full tw-bg-indigo-100 tw-flex tw-items-center tw-justify-center">
                  <i :class="getCardIcon(item.i)" class="tw-text-indigo-600 tw-text-xl"></i>
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

.hover\:tw-translate-y-1:hover {
  transition: transform 0.2s ease-in-out;
}

button {
  transition: all 0.2s ease-in-out;
}
</style>
