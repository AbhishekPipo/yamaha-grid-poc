<template>
  <v-app-bar color="white" elevate-on-scroll>
    <v-container fluid>
      <v-row class="d-flex justify-space-between align-center">
        <v-col>
          <!-- Conditionally render title based on route -->
          <v-toolbar-title class="text-h5 font-weight-bold text-primary">
            {{ headerTitle }}
          </v-toolbar-title>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <!-- Conditionally render the Select Organisation dropdown based on the current route -->
          <v-select
            v-if="!isAddWidgetRoute"
            v-model="selectedOrganization"
            :items="organizations"
            label="Select Organisation"
            variant="outlined"
            density="compact"
            class="mx-4 mt-4 rounded-select"
            :menu-props="{ maxHeight: '400' }"
          />
          <v-btn icon @click="openProfileMenu">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-menu v-model:show="profileMenu" location="bottom">
            <v-list>
              <v-list-item>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
      organizations: ['Organisation 1', 'Organisation 2', 'Organisation 3'],
      profileMenu: false,
    };
  },
  computed: {
    headerTitle() {
      switch (this.$route.path) {
        case '/add-widget':
          return 'Add Widget';
        case '/settings':
          return 'Settings';
        case '/projects':
          return 'Projects';
        default:
          return 'Dashboard';
      }
    },
    isAddWidgetRoute() {
      return this.$route.path === '/add-widget';
    },
  },
  methods: {
    openProfileMenu() {
      this.profileMenu = !this.profileMenu;
    },
  },
};
</script>

<style scoped>
.v-app-bar {
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-primary {
  color: #1976d2;
}
</style>
