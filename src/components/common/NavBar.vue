<template>
  <v-app-bar color="#3D5654" flat>
    <v-toolbar-title class="text-h6 font-weight-bold text-white">
      Performance Monitoring System
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Theme Toggle Button -->
    <v-btn icon @click="toggleTheme">
      <v-icon :color="'#B49239'">{{ themeIcon }}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed, provide, onMounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);

provide("isDarkTheme", isDarkTheme);

const themeIcon = computed(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night"
);

function toggleTheme() {
  const newTheme = isDarkTheme.value ? "light" : "dark";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
}

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>

<style scoped>
/* Ensuring high contrast & readability */
.v-toolbar-title {
  letter-spacing: 0.5px;
}
</style>
