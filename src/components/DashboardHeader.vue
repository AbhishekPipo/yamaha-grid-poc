<template>
  <v-app-bar color="white" dark app elevate-on-scroll>
    <v-container fluid>
      <v-row class="d-flex justify-space-between align-center">
        <v-col>
          <v-toolbar-title class="text-h5 font-weight-bold text-primary">Dashboard</v-toolbar-title>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-select
            v-model="selectedOrganization"
            :items="organizations"
            label="Select Organisation"
            outlined
            dense
            class="mx-4"
            :menu-props="{ maxHeight: '400' }"
          />
          <v-btn icon @click="openProfileMenu">
            <v-icon>mdi-account</v-icon>
          </v-btn>
          <v-menu v-model="profileMenu" bottom left>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item-content>
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Optional for a clean shadow effect */
}

.text-primary {
  color: #1976d2; /* Primary blue for text */
}

.v-select .v-input__control {
  border-radius: 20px;
}
</style>
