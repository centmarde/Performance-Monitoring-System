<template>
  <v-app-bar :color="isDarkTheme ? '#1E2A29' : '#3D5654'" flat>
    <v-toolbar-title class="text-h6 font-weight-bold text-white">
      Performance Monitoring System
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn icon @click="toggleTheme">
      <v-icon :color="isDarkTheme ? 'white' : '#B49239'">{{
        themeIcon
      }}</v-icon>
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
  isDarkTheme.value ? "mdi-weather-night" : "mdi-weather-sunny"
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
.v-toolbar-title {
  letter-spacing: 0.5px;
}
</style>
