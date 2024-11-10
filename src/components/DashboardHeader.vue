<template>
  <v-app-bar color="primary" dark>
    <v-container fluid>
      <v-row class="d-flex justify-space-between align-center">
        <v-col>
          <v-toolbar-title>Dashboard</v-toolbar-title>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-select
            v-model="selectedOrganization"
            :items="organizations"
            label="Select Organisation"
            outlined
            dense
          />
          <v-btn icon>
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  name: 'DashboardHeader',
  data() {
    return {
      selectedOrganization: null,
      organizations: ['Organisation 1', 'Organisation 2', 'Organisation 3'], // Example options
    };
  },
};
</script>

<style scoped>
/* No additional Tailwind styles, use Vuetify's default styling */
</style>
