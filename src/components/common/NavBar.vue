<template>
  <v-app-bar>
    <v-toolbar-title class="text-h6 text-light-green-darken-4 font-weight-bold">
      Performance Monitoring System
    </v-toolbar-title>
    <!-- <v-icon class="me-5" @click="toggleTheme">{{ themeIcon }}</v-icon> -->
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
.title {
  color: #00a4e5;
}
</style>
