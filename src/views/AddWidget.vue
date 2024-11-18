<!-- addwidget.vue -->
<template>
  <v-app>
    <DashboardSidebar />
    <DashboardHeader />
    <v-main>
      <v-container class="mt-10" fluid>
        <v-row justify="center">
          <!-- Form Section -->
          <v-col cols="12" md="6">
            <v-card class="form-card pa-6">
              <v-card-title class="text-h5">Add a Widget</v-card-title>

              <v-form @submit.prevent="submitForm">
                <v-text-field
                  v-model="formData.title"
                  label="Widget Title"
                  outlined
                  placeholder="Enter Widget Title"
                  class="input-field"
                  :rules="[v => !!v || 'Title is required']"
                  required
                ></v-text-field>

                <v-select
                  v-model="formData.widgetType"
                  :items="chartTypes"
                  label="Widget Type"
                  outlined
                  class="select-field"
                  :rules="[v => !!v || 'Widget type is required']"
                  required
                ></v-select>

                <v-select
                  v-model="formData.dataPair"
                  :items="dataSets"
                  label="Data Set"
                  outlined
                  class="select-field"
                  :rules="[v => !!v || 'Data set is required']"
                  required
                ></v-select>

                <v-select
                  v-model="formData.dimension"
                  :items="dimensions"
                  label="Dimension"
                  outlined
                  class="select-field"
                  :rules="[v => !!v || 'Dimension is required']"
                  required
                ></v-select>

                <v-row class="mt-4">
                  <v-btn
                    type="submit"
                    color="primary"
                    class="submit-btn mr-2"
                    :disabled="!isFormValid"
                  >
                    Create
                  </v-btn>
                  <v-btn to="/" color="grey" text class="cancel-btn">Cancel</v-btn>
                </v-row>
              </v-form>
            </v-card>
          </v-col>

          <!-- Preview Section -->
          <v-col cols="12" md="6">
            <v-card class="preview-card pa-6">
              <v-card-title class="text-h5">{{ formData.title || 'Widget Preview' }}</v-card-title>
              <div class="chart-container">
                <component
                  v-if="showPreviewChart"
                  :is="selectedChartComponent"
                  :data="chartData"
                  :options="chartOptions"
                />
                <div v-else class="preview-placeholder">
                  Select widget type and data set to see preview
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
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

export default {
  components: {
    Doughnut,
    Pie,
    Bar
  },

  setup() {
    const router = useRouter();

    const chartTypes = ['doughnut', 'pie', 'bar'];
    const dataSets = ['sales', 'revenue', 'expenses'];
    const dimensions = ['monthly', 'quarterly', 'yearly'];

    const formData = ref({
      title: '',
      widgetType: '',
      dataPair: '',
      dimension: ''
    });

    const isFormValid = computed(() => {
      return formData.value.title &&
             formData.value.widgetType &&
             formData.value.dataPair &&
             formData.value.dimension;
    });

    const generateChartData = (dataType, chartType) => {
      const dataMap = {
        sales: {
          labels: ['Direct', 'Online', 'Retail'],
          datasets: [{
            data: [30, 40, 30],
            backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
            borderWidth: 0
          }]
        },
        revenue: {
          labels: ['Products', 'Services', 'Subscriptions'],
          datasets: [{
            data: [45, 30, 25],
            backgroundColor: ['#4CAF50', '#FFC107', '#9C27B0'],
            borderWidth: 0
          }]
        },
        expenses: {
          labels: ['Operations', 'Marketing', 'Development'],
          datasets: [{
            data: [35, 25, 40],
            backgroundColor: ['#FF9800', '#E91E63', '#2196F3'],
            borderWidth: 0
          }]
        }
      };

      const data = dataMap[dataType] || {
        labels: ['Category A', 'Category B', 'Category C'],
        datasets: [{
          data: [33, 33, 34],
          backgroundColor: ['#9C27B0', '#E91E63', '#2196F3'],
          borderWidth: 0
        }]
      };

      if (chartType === 'bar') {
        data.datasets[0] = {
          ...data.datasets[0],
          borderWidth: 1,
          borderColor: data.datasets[0].backgroundColor,
          barPercentage: 0.6
        };
      }

      return data;
    };

    const selectedChartComponent = computed(() => {
      const componentMap = {
        doughnut: 'Doughnut',
        pie: 'Pie',
        bar: 'Bar'
      };
      return componentMap[formData.value.widgetType] || 'Doughnut';
    });

    const chartData = computed(() =>
      generateChartData(formData.value.dataPair, formData.value.widgetType)
    );

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      ...(formData.value.widgetType === 'doughnut' && { cutout: '70%' }),
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
      },
      ...(formData.value.widgetType === 'bar' && {
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
      })
    }));

    const showPreviewChart = computed(() =>
      formData.value.widgetType && formData.value.dataPair
    );

    const calculateNewWidgetPosition = (existingLayout) => {
      if (!existingLayout.length) {
        return { x: 0, y: 0 };
      }

      // Find the highest y-coordinate
      let maxY = 0;
      existingLayout.forEach(item => {
        const itemBottom = item.y + item.h;
        if (itemBottom > maxY) {
          maxY = itemBottom;
        }
      });

      // Place the new widget at the start of a new row below all existing widgets
      return {
        x: 0,
        y: maxY
      };
    };

    const submitForm = () => {
      if (!isFormValid.value) {
        return;
      }

      const widgetId = `Card ${Date.now()}`;
      const existingLayout = JSON.parse(localStorage.getItem('dashboard-grid-layout') || '[]');

      // Calculate the position for the new widget
      const position = calculateNewWidgetPosition(existingLayout);

      const newWidget = {
        i: widgetId,
        x: position.x,
        y: position.y,
        w: 4,
        h: 4,
        chartType: formData.value.widgetType,
        chartData: chartData.value,
        chartOptions: chartOptions.value,
        title: formData.value.title
      };

      const updatedLayout = [...existingLayout, newWidget];
      localStorage.setItem('dashboard-grid-layout', JSON.stringify(updatedLayout));

      router.push('/');
    };

    return {
      formData,
      chartTypes,
      dataSets,
      dimensions,
      chartData,
      chartOptions,
      showPreviewChart,
      submitForm,
      selectedChartComponent,
      isFormValid
    };
  }
};
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}

.preview-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-style: italic;
}

.form-card, .preview-card {
  height: 100%;
  transition: all 0.3s ease;
}

.form-card:hover, .preview-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.input-field, .select-field {
  margin-bottom: 1rem;
}

.submit-btn {
  min-width: 120px;
}

.cancel-btn {
  min-width: 100px;
}
</style>
