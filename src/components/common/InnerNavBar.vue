<template>
  <v-app-bar :class="navbarClass">
    <v-toolbar-title :class="titleClass">
      Performance Monitoring System
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Move Dark Mode Icon & Clock to the End -->
    <v-container class="d-flex align-center justify-end" style="width: auto">
      <v-icon class="theme-toggle-btn me-3" @click="toggleTheme">{{
        themeIcon
      }}</v-icon>
      <v-toolbar-title class="clock">{{ currentTime }}</v-toolbar-title>
    </v-container>

    <v-menu transition="slide-y-transition">
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
        </div>
      </v-sheet>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";
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

// Realtime Clock
const currentTime = ref(new Date().toLocaleTimeString());

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString();
};

let clockInterval: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  clockInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval);
  }
});
</script>

<style scoped>
.theme-toggle-btn {
  background-color: rgba(255, 255, 255, 0.2); /* Subtle contrast */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.bg-dark-mode .theme-toggle-btn {
  background-color: rgba(255, 255, 255, 0.1);
}

.bg-light-mode .theme-toggle-btn {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Light Mode Navbar (Matches Sidebar) */
.bg-light-mode {
  background-color: #004d40 !important; /* Dark Teal */
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Dark Mode Navbar (Matches Sidebar) */
.bg-dark-mode {
  background-color: #004d40 !important;
  color: white;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
}

.text-dark-title {
  color: white !important;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.text-light-title {
  color: #e0f7fa !important;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rounded-border {
  border-radius: 10px;
  border: 1px solid #ccc;
}

.clock {
  font-size: 1rem;
  font-weight: bold;
  color: white;
  margin-right: 16px;
}
</style>
