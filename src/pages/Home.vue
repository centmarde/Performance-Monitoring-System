<template>
  <LayoutWrapper>
    <template #content>
      <div>
        <CircleRooms />
        
      <RoomSuggest />
        <v-divider></v-divider>
        <CardRooms />
      </div>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
// import { supabase } from '../lib/supabase';
import LayoutWrapper from '../layouts/LayoutWrapper.vue';

</script>
