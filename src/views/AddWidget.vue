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
                ></v-text-field>

                <v-select
                  v-model="formData.widgetType"
                  :items="chartTypes"
                  label="Widget Type"
                  outlined
                  class="select-field"
                ></v-select>

                <v-select
                  v-model="formData.dataPair"
                  :items="dataSets"
                  label="Data Set"
                  outlined
                  class="select-field"
                ></v-select>

                <v-select
                  v-model="formData.dimension"
                  :items="dimensions"
                  label="Dimension (X and Y Axes)"
                  outlined
                  class="select-field"
                ></v-select>

                <v-row class="mt-4">
                  <v-btn type="submit" color="primary" class="submit-btn mr-2">Create</v-btn>
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

    // Chart type mapping
    const chartComponents = {
      doughnut: 'Doughnut',
      pie: 'Pie',
      bar: 'Bar'
    };

    const chartTypes = [
      { text: 'Doughnut Chart', value: 'doughnut' },
      { text: 'Pie Chart', value: 'pie' },
      { text: 'Bar Chart', value: 'bar' }
    ];

    const dataSets = ['sales_expenses', 'revenue_costs'];
    const dimensions = ['time_sales', 'product_revenue'];

    const formData = ref({
      title: '',
      widgetType: 'doughnut',
      dataPair: '',
      dimension: ''
    });

    const generateChartData = (dataType, chartType) => {
      const baseData = {
        sales_expenses: {
          labels: ['Sales', 'Expenses'],
          datasets: [{
            data: [65, 35],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderWidth: 0
          }]
        },
        revenue_costs: {
          labels: ['Revenue', 'Costs'],
          datasets: [{
            data: [70, 30],
            backgroundColor: ['#4CAF50', '#FFC107'],
            borderWidth: 0
          }]
        }
      };

      const data = baseData[dataType] || {
        labels: ['Value A', 'Value B'],
        datasets: [{
          data: [50, 50],
          backgroundColor: ['#9C27B0', '#E91E63'],
          borderWidth: 0
        }]
      };

      // Add additional properties for bar charts
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

    const selectedChartComponent = computed(() =>
      chartComponents[formData.value.widgetType] || 'Doughnut'
    );

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
      }
    }));

    const showPreviewChart = computed(() =>
      formData.value.widgetType && formData.value.dataPair
    );

    const submitForm = () => {
      const widgetId = `Card ${Date.now()}`;

      const newWidget = {
        i: widgetId,
        x: 0,
        y: 0,
        w: 4,
        h: 4,
        chartType: formData.value.widgetType,
        chartData: chartData.value,
        chartOptions: chartOptions.value,
        title: formData.value.title
      };

      const existingLayout = JSON.parse(localStorage.getItem('dashboard-grid-layout') || '[]');
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
      selectedChartComponent
    };
  }
};
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>
