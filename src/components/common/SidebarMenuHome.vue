<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#425C5A"
    class="rounded-e-xl"
  >
    <v-btn icon @click="drawer = !drawer" class="toggle-btn">
      <v-icon>{{ drawer ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
    </v-btn>

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

    <v-list>
      <!-- Render menu items with router-links -->
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
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const drawer = ref(true);

// Define the menu with conditional links for Admin and Teachers
const menu = ref([
  { title: "Dashboard", icon: "mdi-dashboard", href: "/home" }, // Admin link
  { title: "Data Entry", icon: "mdi-dashboard", href: "/data_entry" }, // Teachers link
  { title: "Tracking", icon: "mdi-cog-outline", href: "/tracking" }, // Settings link
]);

const activeUsers = ref([
  { src: "/images/christ.png" },
  { src: "/images/marde.png" },
  { src: "/images/christ.png" },
  { src: "/images/marde.png" },
]);

const currentTheme = computed(() =>
  theme.global.current.value.dark ? "dark-theme" : "white-theme"
);

watch(theme.global.current, (newTheme) => {
  // React to theme changes if necessary
});
</script>

<style scoped>
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  background-color: #3d5654;
  border-radius: 50%;
}
</style>
