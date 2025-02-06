<template>
  <!-- Navigation Drawer with Toggle Button Inside -->
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#425C5A"
    class="rounded-e-xl fixed-sidebar"
  >
    <!-- Toggle Button Inside Sidebar -->
    <v-btn icon @click="drawer = !drawer" class="toggle-btn">
      <v-icon>{{ drawer ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
    </v-btn>

    <!-- User Info Section -->
    <v-sheet color="#3D5654" class="pa-4 rounded-te-xl text-center">
      <v-progress-circular
        model-value="80"
        color="#B49239"
        :size="100"
        :width="2"
      >
        <v-avatar size="85">
          <v-img src="/images/christ.png" alt="User Avatar"></v-img>
        </v-avatar>
      </v-progress-circular>
      <div class="mt-4">Admin</div>
      <span class="mb-6 text-caption">admin@superuser.com</span>
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
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Active Users Section -->
    <h5 class="ml-5 text-yellow-darken-2">ACTIVE USERS</h5>
    <v-row align="center" class="spacer ml-16 mt-4" no-gutters>
      <v-col
        v-for="(user, index) in activeUsers"
        :key="index"
        cols="4"
        sm="2"
        md="1"
      >
        <v-avatar size="36px">
          <v-img :src="user.src" alt="Avatar"></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="4" sm="2" md="1">
        <v-avatar size="36px" color="#B49239">+70</v-avatar>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";

// Sidebar State
const drawer = ref(true);

// Menu Items
const menu = ref([
  { title: "Users", icon: "mdi-account", href: "/admin" },
  { title: "Teachers", icon: "mdi-account-tie", href: "/teachers" },
  { title: "Settings", icon: "mdi-cog-outline", href: "/settings" },
]);

// Active Users List
const activeUsers = ref([
  { src: "/images/christ.png" },
  { src: "/images/marde.png" },
  { src: "/images/christ.png" },
  { src: "/images/marde.png" },
]);
</script>

<style scoped>
/* ✅ Fixed Sidebar Position */
.fixed-sidebar {
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh !important;
  overflow: visible !important; /* Ensure button is not cut off */
  z-index: 1000; /* Keep on top */
}

/* ✅ Toggle Button Inside Sidebar */
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -24px; /* Button placed at the edge */
  transform: translateY(-50%);
  background-color: #3d5654;
  border-radius: 50%;
  z-index: 1100; /* Ensure it stays above other content */
  transition: right 0.3s ease-in-out;
}

/* ✅ Adjust Position When Drawer Is Closed */
.v-navigation-drawer.v-navigation-drawer--mini-variant .toggle-btn {
  right: 0; /* Move the button when the drawer is closed */
}

/* ✅ Ensure the Sidebar Content is Positioned Correctly */
.v-navigation-drawer__content {
  padding-right: 48px; /* Prevent content overlap with button */
}
</style>
