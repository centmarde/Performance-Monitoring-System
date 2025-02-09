<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="#004D40"
    class="rounded-e-xl"
  >
    <!-- Toggle Button -->
    <v-btn icon @click="drawer = !drawer" class="toggle-btn">
      <v-icon>{{ drawer ? "mdi-chevron-left" : "mdi-chevron-right" }}</v-icon>
    </v-btn>

    <!-- User Profile Section -->
    <v-sheet color="#00695C" class="pa-4 rounded-te-xl text-center">
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
      <span class="mb-6 text-caption text-teal-lighten-3">{{
        userInfo?.email || "user@example.com"
      }}</span>
    </v-sheet>

    <!-- Menu Items -->
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
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserInfoStore } from "@/stores/userInfo";
import Avatar from "@/assets/avatar.png";

const avatar = Avatar;
const drawer = ref(true);
const userInfoStore = useUserInfoStore();
const userInfo = computed(() => userInfoStore.userInfo);

onMounted(() => {
  userInfoStore.fetchUserInfo();
});

// Define the menu with conditional links for Admin and Teachers
const menu = ref([
  { title: "Dashboard", icon: "mdi-view-dashboard", href: "/home" },
  { title: "Data Entry", icon: "mdi-file-document-edit", href: "/data_entry" },
  { title: "Tracking", icon: "mdi-history", href: "/tracking" },
]);
</script>

<style scoped>
/* Sidebar Toggle Button */
.toggle-btn {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  background-color: #00796b;
  color: white;
  border-radius: 50%;
}

/* Sidebar Menu Styling */
.v-list-item {
  transition: background 0.3s ease-in-out;
}
.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
