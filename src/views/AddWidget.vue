<template>
<v-app>
    <!-- Sidebar & Header -->
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
              :items="[ 'doughnut', 'pie', 'bar']"
              label="Widget Type"
              outlined
              class="select-field"
            ></v-select>

            <v-select
              v-model="formData.dataPair"
              :items="['Sales vs Expenses', 'Revenue vs Costs']"
              label="Data Set"
              outlined
              item-text="label"
              item-value="value"
              class="select-field"
            ></v-select>

            <v-select
              v-model="formData.dimension"
              :items="['Time (Month vs Sales)','Product vs Revenue']"
              label="Dimension (X and Y Axes)"
              outlined
              class="select-field"
            ></v-select>

            <v-select
              v-model="formData.filter"
              :items="filters"
              label="Filter"
              outlined
              class="select-field"
            ></v-select>

            <v-row class="mt-4">
              <v-btn type="submit" color="primary" class="submit-btn">Create</v-btn>
              <v-btn to="/" color="grey" text class="cancel-btn">Cancel</v-btn>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <!-- Preview Section -->
      <v-col cols="12" md="6">
        <v-card class="preview-card pa-6">
          <v-card-title class="text-h5">{{ formData.title || 'Widget Preview' }}</v-card-title>

          <v-container v-if="showChart" class="text-center">
            <canvas ref="chartCanvas" class="chart-canvas"></canvas>

            <v-divider></v-divider>

            <v-row class="chart-data-row">
              <v-col v-for="(label, index) in chartLabels" :key="index" cols="12" sm="6" class="chart-data-col">
                <v-chip :color="chartColors[index]" class="chart-chip"></v-chip>
                <span class="chart-label">{{ label }}</span>
                <span class="chart-value">{{ chartData[index] }}%</span>
              </v-col>
            </v-row>
          </v-container>

          <v-card-subtitle v-else-if="formData.widgetType === 'card'" class="text-center">Card Preview</v-card-subtitle>

          <v-card-subtitle v-else class="text-center">Select a widget type to preview</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-main>

</v-app>

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
<style scoped>
/* Global Styles */
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

/* Form Card Styles */
.form-card {
  background: linear-gradient(to bottom right, #ffffff, #f2f2f2);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.text-h5 {
  font-weight: bold;
  color: #161C2D;
}

.input-field, .select-field {
  margin-bottom: 20px;
  border-radius: 10px;
}

.submit-btn {
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background-color: #1976d2;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.cancel-btn {
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #b0bec5;
}

/* Preview Card Styles */
.preview-card {
  background: linear-gradient(to bottom right, #ffffff, #f2f2f2);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.chart-canvas {
  border-radius: 10px;
  max-width: 100%;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart-data-row {
  margin-top: 20px;
}

.chart-data-col {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.chart-chip {
  padding: 8px 12px;
  font-size: 0.875rem;
  color: white;
}

.chart-label {
  font-size: 1rem;
  color: #161C2D;
  margin-left: 10px;
  flex-grow: 1;
}

.chart-value {
  font-size: 1rem;
  color: #161C2D;
  font-weight: 600;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .form-card, .preview-card {
    padding: 20px;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
