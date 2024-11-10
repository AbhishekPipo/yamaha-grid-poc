<template>
  <v-navigation-drawer app color="primary" dark>
    <v-container fluid>
      <v-row class="d-flex align-center">
        <v-col>
          <v-avatar size="40">
            <v-img src="/Users/pws/vue-js/vuejs-vuetify-grid-poc/src/assets/images/download.png" alt="Avatar" />
          </v-avatar>
        </v-col>
        <v-col>
          <span class="text-h6">Test Organisation</span>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-list dense>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>mdi-clipboard-text</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DashboardSidebar',
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
