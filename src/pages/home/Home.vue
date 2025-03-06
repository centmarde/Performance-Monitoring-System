<template>
  <HomeLayout>
    <template #content>
      <div>
        <KeepAlive>
          <StudentsStanding :is="activeComponent" />
        </KeepAlive>
      </div>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HomeLayout from "@/layouts/HomeLayout.vue";

const activeComponent = ref("StudentsStanding");
</script>
