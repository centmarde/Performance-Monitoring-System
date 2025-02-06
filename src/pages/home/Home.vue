<template>
  <HomeLayout>
    <template #content>
      <div>
      <StudentsStanding/>
       <MissedActivites/>
      </div>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
// import { supabase } from '../lib/supabase';
import HomeLayout from '@/layouts/HomeLayout.vue';

</script>
