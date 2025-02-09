<template>
  <v-app-bar :color="navbarColor" flat>
    <v-toolbar-title class="text-h6 font-weight-bold text-white">
      Performance Monitoring System
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Theme Toggle Button -->
    <v-btn icon @click="toggleTheme">
      <v-icon :color="themeIconColor">{{ themeIcon }}</v-icon>
    </v-btn>

    <!-- User Menu -->
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn rounded="xl" size="large" variant="tonal" v-bind="props">
          <v-avatar size="32" class="mr-2">
            <v-img src="#" alt="User Avatar"></v-img>
          </v-avatar>
          <v-icon color="white">mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-sheet class="pa-0 mt-2 me-1 menu-card rounded-border">
        <v-btn
          class="justify-start"
          rounded="0"
          variant="text"
          size="large"
          block
          to="/profiles"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3">mdi-account</v-icon>
            </v-col>
            <v-col>{{ userEmail }}</v-col>
          </v-row>
        </v-btn>

        <v-divider></v-divider>

        <v-btn
          class="justify-start logout-btn"
          rounded="0"
          variant="text"
          size="large"
          block
          @click="handleLogoutClick"
        >
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-icon class="me-3">mdi-logout</v-icon>
            </v-col>
            <v-col> Logout </v-col>
          </v-row>
        </v-btn>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { doLogout } from "@/lib/supabase";
import { useUserInfo } from "@/composables/userInfo";
import router from "@/router";

// Navbar color matching Sidebar
const navbarColor = "#2C7865"; // Adjust to match your sidebar color
const themeIconColor = "#B49239"; // Gold for theme toggle

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const themeIcon = computed(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night"
);

function toggleTheme() {
  const newTheme = isDarkTheme.value ? "light" : "dark";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
}

const { userEmail } = useUserInfo();

function handleLogoutClick() {
  doLogout();
  router.push("/");
}
</script>

<style scoped>
.menu-card {
  background: rgba(44, 120, 101, 0.9); /* Slight transparency for depth */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
  border-radius: 12px;
}

.rounded-border {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logout-btn {
  color: #ff5252;
  font-weight: bold;
}
</style>
