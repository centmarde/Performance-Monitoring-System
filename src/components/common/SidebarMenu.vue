<template>
  <v-navigation-drawer v-model="drawer" app class="fixed-sidebar">
    <v-btn icon @click="drawer = !drawer" class="toggle-btn">
      <v-icon>{{ drawer ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
    </v-btn>

    <!-- Vue Sidebar Menu -->
    <div class="sidebar-content">
      <sidebar-menu :menu="menu" />
    </div>
  </v-navigation-drawer>
</template>

<script>
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

export default {
  data() {
    return {
      drawer: true,
      menu: [
        {
          title: "Users",
          icon: "mdi-account",
          href: "/admin",
        },
        {
          title: "Teachers",
          icon: "mdi-account-tie",
          href: "/teachers",
        },
        {
          title: "Settings",
          icon: "mdi-cog",
          href: "/settings",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Keep the sidebar fixed while scrolling */
.fixed-sidebar {
  position: fixed !important;
  height: 100vh !important;
  overflow: hidden !important;
}

/* Allow scrolling inside the sidebar */
.sidebar-content {
  height: calc(100vh - 50px); /* Adjust based on your layout */
  overflow-y: auto;
}

/* Ensure sidebar content scrolls properly */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
</style>
