<template>
  <v-container class="d-flex justify-center mt-10">
    <v-row>
      <!-- Form Section -->
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title>
            <span class="text-h5">Add a Widget</span>
          </v-card-title>

          <v-form @submit.prevent="submitForm">
            <!-- Widget Title -->
            <v-text-field
              v-model="formData.title"
              label="Widget Title"
              outlined
              class="mb-4"
              placeholder="Enter Widget Title"
            />

            <!-- Widget Type -->
            <v-select
              v-model="formData.widgetType"
              :items="widgetTypes"
              label="Widget Type"
              outlined
              class="mb-4"
              item-text="label"
              item-value="value"
              placeholder="Select Widget Type"
            />

            <!-- Data Pair -->
            <v-select
              v-model="formData.dataPair"
              :items="dataPairs"
              label="Data Pair"
              outlined
              class="mb-4"
              item-text="label"
              item-value="value"
              placeholder="Select Data Set"
            />

            <!-- Dimension -->
            <v-select
              v-model="formData.dimension"
              :items="dimensions"
              label="Dimension"
              outlined
              class="mb-4"
              item-text="label"
              item-value="value"
              placeholder="Select Dimension"
            />

            <!-- Filter -->
            <v-select
              v-model="formData.filter"
              :items="filters"
              label="Filter"
              outlined
              class="mb-4"
              item-text="label"
              item-value="value"
              placeholder="Select Filter"
            />

            <!-- Action Buttons -->
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="primary" type="submit">Create</v-btn>
                <v-btn color="grey" to="/" class="ml-2">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <!-- Preview Section -->
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <v-card-title>
            <span class="text-h5">Preview</span>
          </v-card-title>

          <v-divider class="mt-4"></v-divider>

          <v-card v-if="formData.widgetType === 'card'" class="pa-4" outlined>
            <h4 class="text-h6">{{ formData.title || 'Widget Title' }}</h4>
            <p class="text-body-2">This is a Card widget preview.</p>
          </v-card>

          <v-card v-if="formData.widgetType === 'doughnut'" class="pa-4" outlined>
            <v-container class="d-flex justify-center align-center" style="height: 200px; background-color: #3f51b5; color: white;">
              Doughnut Chart Preview
            </v-container>
          </v-card>

          <v-card v-if="formData.widgetType === 'pie'" class="pa-4" outlined>
            <v-container class="d-flex justify-center align-center" style="height: 200px; background-color: #4caf50; color: white;">
              Pie Chart Preview
            </v-container>
          </v-card>

          <v-card v-if="formData.widgetType === 'bar'" class="pa-4" outlined>
            <v-container class="d-flex justify-center align-center" style="height: 200px; background-color: #f44336; color: white;">
              Bar Chart Preview
            </v-container>
          </v-card>

          <!-- Show nothing if no widget type is selected -->
          <v-card v-if="!formData.widgetType" class="pa-4" outlined>
            <v-container class="d-flex justify-center align-center">
              <span class="text-body-2">Select a widget type to see the preview</span>
            </v-container>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const formData = ref({
      widgetType: '',
      title: '',
      dataPair: '',
      dimension: '',
      filter: ''
    });

    // Predefined data for select fields
    const widgetTypes = [
      { label: 'Card', value: 'card' },
      { label: 'Doughnut Chart', value: 'doughnut' },
      { label: 'Pie Chart', value: 'pie' },
      { label: 'Bar Chart', value: 'bar' }
    ];
    const dataPairs = [
      { label: 'Pair 1', value: 'pair1' },
      { label: 'Pair 2', value: 'pair2' }
    ];
    const dimensions = [
      { label: 'Dimension 1', value: 'dim1' },
      { label: 'Dimension 2', value: 'dim2' }
    ];
    const filters = [
      { label: 'Last 2 Months', value: 'filter1' },
      { label: 'Last 6 Months', value: 'filter2' }
    ];

    // Handle form submission
    const submitForm = () => {
      console.log('Form Data Submitted:', formData.value);
      // Redirect back to the dashboard (or anywhere you want)
      router.push('/');
    };

    return {
      formData,
      widgetTypes,
      dataPairs,
      dimensions,
      filters,
      submitForm
    };
  }
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>
