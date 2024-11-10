<template>
  <v-card>
    <v-card-title>Graph</v-card-title>
    <v-card-text>
      <div class="chart-container">
        <DoughnutChart
          :chartData="chartData"
          :chartOptions="chartOptions"
          class="chart"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { DoughnutChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
)

export default {
  name: 'DonutChartCard',
  components: {
    DoughnutChart
  },
  data() {
    return {
      chartData: {
        labels: ['Value A', 'Value B', 'Value C'],
        datasets: [{
          data: [20, 60, 20],
          backgroundColor: [
            '#9E9E9E',  // Value A - grey
            '#BDBDBD',  // Value B - lighter grey
            '#E0E0E0'   // Value C - lightest grey
          ],
          borderWidth: 0
        }]
      },
      chartOptions: {
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
              label: function(context) {
                return context.label + ': ' + context.raw + '%'
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin: 0 auto;
}
.chart {
  max-height: 300px;
}
</style>
