<template>
  <!-- Include the Sidebar and Header components -->
  <DashboardSidebar />
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
                <button
                  class="text-gray-500 hover:text-blue-500 transition-colors"
                  @click="editWidget(item)"
                >
                  <i class="fas fa-edit"></i>
                </button>
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
            class="h-full p-4 bg-white rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div class="flex justify-between items-start">
              <h3 class="text-gray-500 text-lg font-medium">{{ getCardTitle(item.i) }}</h3>
              <span class="text-sm text-gray-400">Last 24h</span>
            </div>
            <div class="my-4">
              <p class="text-3xl font-bold text-gray-800">{{ getCardValue(item.i) }}</p>
              <p class="text-sm text-green-500 mt-2">
                <i class="fas fa-arrow-up mr-1"></i>
                <span>4.75%</span>
                <span class="text-gray-400 ml-1">vs last week</span>
              </p>
            </div>
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

// Register ChartJS components
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

// Get appropriate chart component
const getChartComponent = (type) => chartComponents[type] || Doughnut;

// Get chart options based on chart type
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
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`
        }
      }
    }
  };

  // Add specific options based on chart type
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

// Static card data (you can replace this with real data)
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

// Navigation
const navigateToAddWidget = () => {
  router.push('/add-widget');
};

const editWidget = (item) => {
  // Store the item to edit in localStorage or state management
  localStorage.setItem('editing-widget', JSON.stringify(item));
  router.push('/edit-widget');
};

// Widget Management
const deleteWidget = (item) => {
  layout.value = layout.value.filter(widget => widget.i !== item.i);
  saveLayout(layout.value);
};

// Layout Management
const saveLayout = (newLayout) => {
  localStorage.setItem('dashboard-grid-layout', JSON.stringify(newLayout));
};

const loadSavedLayout = () => {
  try {
    const savedLayout = localStorage.getItem('dashboard-grid-layout');
    if (savedLayout) {
      layout.value = JSON.parse(savedLayout);
    }
  } catch (error) {
    console.error('Error loading layout:', error);
    layout.value = [];
  }
};

// Event Handlers
const onLayoutUpdated = (newLayout) => {
  layout.value = newLayout;
};

const onResizeEnd = (layout) => {
  saveLayout(layout);
};

const onDragEnd = (layout) => {
  saveLayout(layout);
};

// Lifecycle
onMounted(() => {
  loadSavedLayout();
});
</script>

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

.vue-grid-item.static {
  background: #cce;
}

.vue-grid-item .text {
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

/* Add smooth transitions for hover effects */
.hover\:-translate-y-1:hover {
  transition: transform 0.2s ease-in-out;
}

/* Improve button hover states */
button {
  transition: all 0.2s ease-in-out;
}

/* Ensure charts maintain aspect ratio while resizing */
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
