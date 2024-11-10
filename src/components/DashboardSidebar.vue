<template>
  <v-navigation-drawer app color="rgb(26, 39, 67)" dark clipped>
    <v-container fluid>
      <v-row class="d-flex align-center">
        <v-col>
          <v-avatar size="50">
            <v-img src="/Users/pws/vue-js/vuejs-vuetify-grid-poc/src/assets/images/download.png" alt="Avatar" />
          </v-avatar>
        </v-col>
        <v-col>
          <span class="text-h5 font-weight-bold text-white">Test Organisation</span>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-list dense nav>
        <!-- Dashboard Item -->
        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToDashboard"
          :class="{'active': isActive('/')}">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Projects Item -->
        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToProjects"
          :class="{'active': isActive('/projects')}">
          <v-list-item-icon>
            <v-icon>mdi-clipboard-text</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">Projects</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Settings Item -->
        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToSettings"
          :class="{'active': isActive('/settings')}">
          <v-list-item-icon>
            <v-icon>mdi-account-settings</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Widgets Item -->
        <v-list-item
          link
          class="sidebar-item"
          @click="navigateToWidgets"
          :class="{'active': isActive('/add-widget')}">
          <v-list-item-icon>
            <v-icon>mdi-grid</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-white">Widgets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DashboardSidebar',
  methods: {
    // Method to navigate to the Widgets page
    navigateToWidgets() {
      this.$router.push('/add-widget');
    },
    // Methods for other navigation items
    navigateToDashboard() {
      this.$router.push('/');
    },
    navigateToProjects() {
      this.$router.push('/projects');
    },
    navigateToSettings() {
      this.$router.push('/settings');
    },
    // Check if the current route matches the given path
    isActive(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style scoped>
.v-navigation-drawer {
  background-color: rgb(26, 39, 67); /* RGB color for sidebar */
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.v-list-item {
  transition: background-color 0.2s ease-in-out;
}

.text-white {
  color: white;
}

/* Custom CSS for row layout */
.sidebar-item {
  display: flex;
  align-items: center;  /* Aligns icon and text vertically */
  padding: 10px 0;
}

.sidebar-item v-list-item-icon {
  margin-right: 16px; /* Adds space between icon and text */
}

.sidebar-item v-list-item-content {
  display: flex;
  align-items: center;
}

/* Highlight active tab */
.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.1); /* Highlighted background */
}
</style>
