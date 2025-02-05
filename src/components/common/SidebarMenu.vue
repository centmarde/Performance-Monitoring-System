<template>
  <v-navigation-drawer app>
    <sidebar-menu 
      :menu="menu" 
      :theme="currentTheme"
    />
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useTheme } from 'vuetify';
import { useRoute } from 'vue-router';

const theme = useTheme();
const route = useRoute();

const adminMenu = [
  {
    href: '/user_list',
    title: 'Users',
    icon: 'fa fa-user',
  },
  {
    href: '/teacher_list',
    title: 'Teachers',
    icon: 'fa fa-chart-area',
    child: [
      {
        href: '/charts/sublink',
        title: 'Sub Link',
      },
    ],
  },
];

const userMenu = [
  {
    href: '/home',
    title: 'Dashboard',
    icon: 'fa fa-user',
  },
  {
    href: '/charts',
    title: 'Charts',
    icon: 'fa fa-chart-area',
    child: [
      {
        href: '/charts/sublink',
        title: 'Sub Link',
      },
    ],
  },
];

const menu = computed(() => route.path === '/admin' ? adminMenu : userMenu);

const currentTheme = computed(() => theme.global.current.value.dark ? 'dark-theme' : 'white-theme');

watch(theme.global.current, (newTheme) => {
  // React to theme changes if necessary
});
</script>

<style scoped>
</style>
