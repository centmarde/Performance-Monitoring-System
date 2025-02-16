<template>
  <v-app :class="themeClass">
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <SidebarMenuHome />
          </v-col>
          <InnerNavBar />
          <v-col cols="12">
            <slot name="content"></slot>
            <TeacherBot/>
          </v-col>
        </v-row>
        <AppFooter style="z-index: 1;" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDarkTheme = computed(() => theme.global.current.value.dark);
const themeClass = computed(() =>
  isDarkTheme.value ? "dark-theme" : "light-theme"
);

// Apply theme class to body
watchEffect(() => {
  document.body.className = themeClass.value;
});
</script>

<style>
/* Light Mode */
.light-theme {
  background: linear-gradient(135deg, #e0f2f1 30%, #b2dfdb 100%);
  color: #333;
  min-height: 100vh;
}

/* Dark Mode */
.dark-theme {
  background: linear-gradient(135deg, #263238 30%, #1e272e 100%);
  color: white;
  min-height: 100vh;
}
</style>
