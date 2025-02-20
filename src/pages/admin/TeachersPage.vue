<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
        <div class="p-8 bg-gray-100 min-h-screen">
          <!-- Search Bar -->
          <v-row align="center" justify="space-between" class="mb-4">
            <v-col cols="4">
              <v-text-field
                v-model="searchQuery"
                prepend-icon="mdi-magnify"
                label="Search Teachers"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- Teacher Cards Grid -->
          <v-row>
            <v-col
              v-for="teacher in paginatedTeachers"
              :key="teacher.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card class="teacher-card">
                <v-card-title class="text-center" elevation="8">
                  <v-avatar size="80">
                    <v-img
                      :src="teacher.image_path || '/default-avatar.png'"
                      alt="Teacher Avatar"
                    />
                  </v-avatar>
                  <div class="mt-2 font-weight-bold">
                    {{ teacher.firstname || "N/A" }}
                  </div>
                  <div class="text-caption text-muted">
                    {{ teacher.email || "broken email" }}
                  </div>
                </v-card-title>
                <v-card-text>
                  <div class="font-weight-bold">Subjects Handled:</div>
                  <div class="subjects-list">
                    <span
                      v-for="(subject, i) in teacher.subjects.length
                        ? teacher.subjects
                        : ['N/A']"
                      :key="i"
                      class="subject-item"
                    >
                      {{ subject }}
                    </span>
                  </div>

                  <div class="mt-3 font-weight-bold">Phone:</div>
                  <div class="text-muted">{{ teacher.phone || "N/A" }}</div>

                  <div class="mt-2 font-weight-bold">Address:</div>
                  <div class="text-muted">
                    {{ teacher.complete_address || "N/A" }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination Controls -->
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            circle
            class="mt-4"
          ></v-pagination>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
import { useTeachers } from "@/composables/useTeachers";

const {
  teachers,
  searchQuery,
  currentPage,
  itemsPerPage,
  filteredTeachers,
  totalPages,
  paginatedTeachers,
  initializeTeachers,
} = useTeachers();

initializeTeachers();
</script>

<style scoped>
.teacher-card {
  min-height: 280px; /* Ensures all cards are the same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Spreads content evenly */
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.teacher-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute content evenly */
  align-items: center;
  height: 100%; /* Make all cards the same height */
  min-height: 350px; /* Ensures uniformity */
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.teacher-card .v-card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: 100%;
}

.teacher-card .v-card-text {
  flex-grow: 1;
  width: 100%;
  text-align: center;
}

.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  color: black;
}

.subject-item {
  background-color: #e0f7fa;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
}
</style>
