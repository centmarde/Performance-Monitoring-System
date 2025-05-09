<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="start">
          <v-col cols="auto" class="w-100">
            <v-card class="pa-3 rounded-card glass-card">
              <div class="d-flex justify-space-between align-center">
                <h4 class="font-weight-bold mb-0">
                  <span class="mdi mdi-account-school"></span> Student's Missed
                  Activities Tracking
                </h4>
                <v-btn
                  icon
                  color="white"
                  class="ml-2"
                  @click="goBack"
                  title="Go Back"
                >
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
              </div>
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
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
  backdrop-filter: blur(10px);
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
