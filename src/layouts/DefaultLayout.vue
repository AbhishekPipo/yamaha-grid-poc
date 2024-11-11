<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item title="Dashboard" />
        <v-list-item title="Reports" />
        <v-list-item title="Settings" />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>My Vue Dashboard1</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
</script>
