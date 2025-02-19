<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="start">
          <v-col cols="auto">
            <v-card class="pa-3 rounded-card glass-card">
              <h4 class="font-weight-bold text-end">
                <span class="mdi mdi-account-school"></span> Student's Missed
                Activities Tracking
              </h4>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <Review />
        </v-row>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import HomeLayout from "@/layouts/HomeLayout.vue";
</script>

<style scoped>
/* Optional Styling */
.v-card {
  border-radius: 12px;
  backdrop-filter: blur(10px); /* Blur effect for glass background */
}
.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.bold-label {
  font-weight: bold;
}
</style>
