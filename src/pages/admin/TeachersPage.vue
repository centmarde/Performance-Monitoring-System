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
                <v-card-title class="text-center">
                  <v-avatar size="80">
                    <v-img :src="teacher.avatar" alt="Teacher Avatar" />
                  </v-avatar>
                  <div class="mt-2 font-weight-bold">{{ teacher.name }}</div>
                  <div class="text-caption text-muted">{{ teacher.email }}</div>
                </v-card-title>
                <v-card-text>
                  <div class="font-weight-bold">Subjects Handled:</div>
                  <v-chip-group column>
                    <v-chip v-for="(subject, i) in teacher.subjects" :key="i">
                      {{ subject }}
                    </v-chip>
                  </v-chip-group>
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

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
}

const teachers = ref<Teacher[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 8; // 2 rows * 4 columns

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    const subjectsList = [
      ["Math", "Science"],
      ["English", "History"],
      ["Physics", "Chemistry"],
      ["Biology", "Geography"],
      ["PE", "Health"],
    ];
    teachers.value = data.map((item: any, index: number) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
      subjects: subjectsList[index % subjectsList.length],
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
  }
});

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value;
  return teachers.value.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredTeachers.value.length / itemsPerPage)
);

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTeachers.value.slice(start, start + itemsPerPage);
});
</script>

<style scoped>
.teacher-card {
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}
.teacher-card:hover {
  transform: translateY(-5px);
}
.text-muted {
  color: gray;
}
</style>
