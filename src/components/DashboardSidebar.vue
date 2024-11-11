<template>
  <v-navigation-drawer app color="rgb(26, 39, 67)" dark>
    <v-container fluid>
      <v-row class="d-flex align-center">
        <v-col>
          <v-avatar size="50">
            <v-img src="@/assets/images/download.png" alt="Avatar" />
          </v-avatar>
        </v-col>
        <v-col>
          <span class="text-h5 font-weight-bold text-white">Test Organisation</span>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToDashboard"
          :active="isActive('/')"
        >
          <template v-slot:prepend>
            <v-icon>mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToProjects"
          :active="isActive('/projects')"
        >
          <template v-slot:prepend>
            <v-icon>mdi-clipboard-text</v-icon>
          </template>
          <v-list-item-title>Projects</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToSettings"
          :active="isActive('/settings')"
        >
          <template v-slot:prepend>
            <v-icon>mdi-account-settings</v-icon>
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>

        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToWidgets"
          :active="isActive('/add-widget')"
        >
          <template v-slot:prepend>
            <v-icon>mdi-grid</v-icon>
          </template>
          <v-list-item-title>Widgets</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DashboardSidebar',
  methods: {
    navigateToWidgets() {
      this.$router.push('/add-widget');
    },
    navigateToDashboard() {
      this.$router.push('/');
    },
    navigateToProjects() {
      // this.$router.push('/projects');
    },
    navigateToSettings() {
      // this.$router.push('/settings');
    },
    isActive(path) {
      return this.$route.path === path;
    },
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: rgb(26, 39, 67);
}

.sidebar-item {
  transition: background-color 0.2s ease-in-out;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.text-white {
  color: white;
}
</style>
