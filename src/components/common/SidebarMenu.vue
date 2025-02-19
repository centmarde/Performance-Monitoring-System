<template>
  <!-- Navigation Drawer with Toggle Button Inside -->
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#004D40"
    class="fixed-sidebar"
  >
    <!-- Toggle Button Inside Sidebar -->
    <v-btn icon @click="drawer = !drawer" class="toggle-btn">
      <v-icon>{{ drawer ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
    </v-btn>

    <!-- User Info Section -->
    <v-sheet color="#00695C" class="pa-4 text-center">
      <v-progress-circular
        model-value="80"
        color="#B49239"
        :size="100"
        :width="2"
      >
        <v-avatar size="85">
          <v-img
            :src="userInfo?.image_path || avatar"
            alt="User Avatar"
          ></v-img>
        </v-avatar>
      </v-progress-circular>
      <div class="mt-4 font-weight-bold text-white">
        {{ userInfo?.firstname || "User" }}
      </div>
      <div class="mt-1 text-caption text-teal-lighten-4">
        {{ userInfo?.user_type || "Guest" }}
      </div>
      <span class="mb-6 text-caption text-teal-lighten-3">
        {{ userInfo?.email || "user@example.com" }}
      </span>
    </v-sheet>

    <!-- Sidebar Menu -->
    <v-list>
      <v-list-item
        v-for="(item, i) in menu"
        :key="i"
        active-class="border"
        :ripple="false"
        :to="item.href"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" color="#B49239"></v-icon>
        </template>
        <v-list-item-title
          class="text-white"
          v-text="item.title"
        ></v-list-item-title>
      </v-list-item>
      <v-list-group value="Settings">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <template v-slot:prepend>
              <v-icon color="#B49239">mdi-account</v-icon>
            </template>
            <v-list-item-title class="text-white">Settings</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item to="/admin_profiles" class="submenu-item">
          <template v-slot:prepend>
            <v-icon color="#B49239">mdi-account-circle</v-icon>
          </template>
          <v-list-item-title class="text-white">Profile</v-list-item-title>
        </v-list-item>

        <v-list-item @click="handleLogoutClick" class="submenu-item">
          <template v-slot:prepend>
            <v-icon color="#B49239">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-white">Logout</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserInfoStore } from "@/stores/userInfo";
import { doLogout } from "@/lib/supabase";

import Avatar from "@/assets/avatar.png";

// Sidebar State
const avatar = Avatar;
const drawer = ref(true);
const userInfoStore = useUserInfoStore();
const userInfo = computed(() => userInfoStore.userInfo);

onMounted(() => {
  userInfoStore.fetchUserInfo();
});

function handleLogoutClick() {
  doLogout();
  /* router.push("/"); */
}

// Define the menu with conditional links for Admin and Teachers
const menu = ref([
  { title: "Users", icon: "mdi-account", href: "/admin" },
  { title: "Teachers", icon: "mdi-account-tie", href: "/teachers" },
  /*  { title: "Settings", icon: "mdi-cog-outline", href: "/settings" }, */
]);
</script>

<style scoped>
/* ✅ Fixed Sidebar Position */
.fixed-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh !important;
  overflow: visible !important;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: #004d40;
}

/* ✅ Toggle Button Inside Sidebar */
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  background-color: #00796b;
  border-radius: 50%;
  z-index: 1100;
  transition: right 0.3s ease-in-out;
  color: white;
}

/* ✅ Adjust Position When Drawer Is Closed */
.v-navigation-drawer.v-navigation-drawer--mini-variant .toggle-btn {
  right: 0;
}

/* ✅ Sidebar Content Positioning */
.v-navigation-drawer__content {
  padding-right: 48px;
  flex-grow: 1;
}

/* ✅ Active Users Section Styling */
.active-users {
  position: absolute;
  bottom: 16px;
  left: 0;
  width: 100%;
  padding: 16px;
  background-color: #004d40;
  color: white;
}
</style>
