<template>
  <v-app-bar :class="navbarClass">
    <v-toolbar-title :class="titleClass">
      Performance Monitoring System
    </v-toolbar-title>
    <v-icon class="me-5" @click="toggleTheme">{{ themeIcon }}</v-icon>
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn rounded="xl" size="large" variant="tonal" v-bind="props">
          <v-avatar size="25" class="mr-2">
            <v-img src="#"></v-img>
          </v-avatar>
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>

      <v-sheet class="pa-0 mt-2 me-1 menu-card rounded-border">
        <div>
          <v-btn
            class="justify-start"
            rounded="0"
            variant="text"
            size="large"
            block
            to="/profiles"
            style="text-transform: none"
          >
            <v-row align="center" no-gutters>
              <v-col cols="auto">
                <v-icon class="me-3">mdi-account</v-icon>
              </v-col>
              <v-col> {{ userEmail }} </v-col>
            </v-row>
          </v-btn>

          <v-btn
            class="justify-start"
            rounded="0"
            variant="text"
            size="large"
            block
            @click="handleLogoutClick"
            style="text-transform: none"
          >
            <v-row align="center" no-gutters>
              <v-col cols="auto">
                <v-icon class="me-3">mdi-logout</v-icon>
              </v-col>
              <v-col> Logout </v-col>
            </v-row>
          </v-btn>
        </div>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { doLogout } from "@/lib/supabase";
import router from "@/router";
import { useUserInfoStore } from "@/stores/userInfo";

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const themeIcon = computed(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night"
);

// Toggle light/dark mode
function toggleTheme() {
  const newTheme = isDarkTheme.value ? "light" : "dark";
  theme.global.name.value = newTheme;
  localStorage.setItem("theme", newTheme);
}

// Sync navbar color with sidebar
const navbarClass = computed(() =>
  isDarkTheme.value ? "bg-dark-mode" : "bg-light-mode"
);

// Adjust title color for readability
const titleClass = computed(() =>
  isDarkTheme.value ? "text-light-title" : "text-dark-title"
);

const userInfoStore = useUserInfoStore();
userInfoStore.fetchUserInfo();

const userEmail = computed(() => userInfoStore.userInfo?.email || "");

function handleLogoutClick() {
  doLogout();
  router.push("/");
}
</script>

<style scoped>
/* Light Mode Navbar (Matches Sidebar) */
.bg-light-mode {
  background-color: #004d40 !important; /* Dark Teal */
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Dark Mode Navbar (Matches Sidebar) */
.bg-dark-mode {
  background-color: #004d40 !important; /* Dark Teal */
  color: white;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

/* Improve Readability of Title */
.text-dark-title {
  color: white !important; /* Strong contrast */
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text-light-title {
  color: #e0f7fa !important; /* Light teal for better visibility */
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Menu Card Styling */
.rounded-border {
  border-radius: 10px;
  border: 1px solid #ccc;
}
</style>
