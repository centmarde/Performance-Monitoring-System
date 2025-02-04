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

const theme = useTheme();
const menu = ref([
  {
    header: 'Main Navigation',
    hiddenOnCollapse: true,
  },
  {
    href: '/',
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
]);

const currentTheme = computed(() => theme.global.current.value.dark ? 'dark-theme' : 'white-theme');

watch(theme.global.current, (newTheme) => {
  // React to theme changes if necessary
});
</script>

<style scoped>
</style>
