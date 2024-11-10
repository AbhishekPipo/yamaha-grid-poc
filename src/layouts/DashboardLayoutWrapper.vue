<template>
  <v-app>
    <!-- Include the Sidebar component -->
    <DashboardSidebar />

    <!-- Include the Header component -->
    <DashboardHeader />

    <!-- Main content area where router-view will render content -->
    <v-main>
      <slot /> <!-- Slot to render dynamic content -->
    </v-main>
  </v-app>
</template>

<script setup>
// Import the Sidebar and Header components
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'
</script>

<style scoped>
/* Add any layout-specific styles */
</style>
