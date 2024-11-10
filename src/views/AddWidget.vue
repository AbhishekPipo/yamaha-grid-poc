<template>
  <v-container class="mt-10" fluid>
    <v-row justify="center">
      <!-- Form Section -->
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5">Add a Widget</v-card-title>

          <v-form @submit.prevent="submitForm">
            <v-text-field
              v-model="formData.title"
              label="Widget Title"
              outlined
              placeholder="Enter Widget Title"
            ></v-text-field>

            <v-select
              v-model="formData.widgetType"
              :items="['card', 'doughnut', 'pie', 'bar']"
              label="Widget Type"
              outlined
            ></v-select>

            <v-select
              v-model="formData.dataPair"
              :items="['Sales vs Expenses', 'Revenue vs Costs']"
              label="Data Set"
              outlined
              item-text="label"
              item-value="value"
            ></v-select>

            <v-select
              v-model="formData.dimension"
              :items="['Time (Month vs Sales)','Product vs Revenue']"
              label="Dimension (X and Y Axes)"
              outlined
            ></v-select>

            <v-select
              v-model="formData.filter"
              :items="filters"
              label="Filter"
              outlined
            ></v-select>

            <v-row class="mt-4">
              <v-btn type="submit" color="blue" class="mr-4">Create</v-btn>
              <v-btn to="/" color="grey" text>Cancel</v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <!-- Preview Section -->
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5">{{ formData.title || 'Widget Preview' }}</v-card-title>

          <v-container v-if="showChart" class="text-center">
            <canvas ref="chartCanvas" class="w-100"></canvas>

            <v-divider></v-divider>

            <v-row>
              <v-col v-for="(label, index) in chartLabels" :key="index" cols="12" sm="6" class="d-flex align-center">
                <v-chip :color="chartColors[index]" class="mr-2"></v-chip>
                <span>{{ label }}</span>
                <span class="ml-auto">{{ chartData[index] }}%</span>
              </v-col>
            </v-row>
          </v-container>

          <v-card-subtitle v-else-if="formData.widgetType === 'card'" class="text-center">
            Card Preview
          </v-card-subtitle>

          <v-card-subtitle v-else class="text-center">
            Select a widget type to preview
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Chart from 'chart.js/auto';

export default {
  setup() {
    const router = useRouter();
    const chartCanvas = ref(null);
    const chartInstance = ref(null);

    const formData = ref({
      widgetType: '',
      title: '',
      dataPair: '',
      dimension: '',
      filter: ''
    });

    // Meaningful data sets
    const dataSets = [
      { label: 'Sales vs Expenses', value: 'sales_expenses' },
      { label: 'Revenue vs Costs', value: 'revenue_costs' }
    ];

    // Dimensions for X and Y axes
    const dimensions = [
      { label: 'Time (Month vs Sales)', value: 'time_sales' },
      { label: 'Product vs Revenue', value: 'product_revenue' }
    ];

    // Filters for selecting data period
    const filters = ['Last 2 Months', 'Last 6 Months', 'Last Year'];

    // Chart data and labels (this will change based on user selection)
    const chartLabels = ref(['January', 'February', 'March', 'April']);
    const chartData = ref([30, 50, 70, 90]); // This data will dynamically change based on selection
    const chartColors = ref(['#4CAF50', '#2196F3', '#FFC107', '#9C27B0']);

    const showChart = computed(() =>
      ['doughnut', 'pie', 'bar'].includes(formData.value.widgetType)
    );

    const generateChart = () => {
      if (!showChart.value || !chartCanvas.value) return;

      // Destroy existing chart if it exists
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');

      chartInstance.value = new Chart(ctx, {
        type: formData.value.widgetType,
        data: {
          labels: chartLabels.value,
          datasets: [{
            data: chartData.value,
            backgroundColor: chartColors.value,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    };

    // Watch for changes in widget type
    watch(() => formData.value.widgetType, () => {
      if (showChart.value) {
        // Use nextTick to ensure DOM is updated
        nextTick(() => {
          generateChart();
        });
      }
    });

    // Generate chart on data changes
    watch([chartData, chartLabels], () => {
      if (showChart.value) {
        generateChart();
      }
    });

    onMounted(() => {
      if (showChart.value) {
        generateChart();
      }
    });

    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
    });

    const submitForm = () => {
      console.log("Widget Created:", formData.value);
      router.push('/');
    };

    return {
      formData,
      chartCanvas,
      chartLabels,
      chartData,
      chartColors,
      showChart,
      submitForm,
      dataSets,
      dimensions,
      filters
    };
  }
};
</script>
