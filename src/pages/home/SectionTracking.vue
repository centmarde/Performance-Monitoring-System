<template>
    <HomeLayout>
      <template #content>
        <v-container>
          <v-row>
            <v-col cols="12">
              <AllSectionsGraph />
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col cols="auto">
              <v-card class="pa-3 rounded-card glass-card">
                <h4 class="font-weight-bold text-end">
                  <span class="mdi mdi-account-school"></span> Section Students Tracking
                </h4>
              </v-card>
            </v-col>
          </v-row>
  
          <v-row>
            <SectionAi />
          </v-row>

          

        </v-container>
      </template>
    </HomeLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import HomeLayout from "@/layouts/HomeLayout.vue";
  //@ts-ignore
  import SectionAi from "@/components/system/SectionAi.vue";
  //@ts-ignore
  import AllSectionsGraph from "@/components/system/AllSectionsGraph.vue";

  const selectedSection = ref(localStorage.getItem('selectedSection') || '');
  const selectedSubject = ref(localStorage.getItem('selectedSubject') || '');
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
