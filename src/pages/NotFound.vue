<template>
    <LayoutWrapper>
      <template #content>
        <div>
          <div class="spacer"></div>
          <h1 class="text-center">404 - Page Not Found!</h1>
          <div class="spacer"></div>  
        </div>
      </template>
    </LayoutWrapper>
  </template>
  
  <script setup lang="ts">
  // import { supabase } from '../lib/supabase';
  import LayoutWrapper from '../layouts/LayoutWrapper.vue';
  
  </script>
  <style scoped>
  .spacer {
    height: 32vh;
  }
</style>