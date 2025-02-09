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
                    <v-img :src="teacher.avatar || '/default-avatar.png'" alt="Teacher Avatar" />
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

                  <div class="mt-3 font-weight-bold">Phone:</div>
                  <div class="text-muted">{{ teacher.phone }}</div>

                  <div class="mt-2 font-weight-bold">Address:</div>
                  <div class="text-muted">{{ teacher.complete_address }}</div>
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
import { useTeacherList } from '@/stores/teachersList';
import Avatar from "@/assets/avatar.png";

interface Teacher {
  id: number;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
  phone: string;
  complete_address: string;
}

const avatar = Avatar;
const teachers = ref<Teacher[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);

const itemsPerPage = 8;

const { fetchTeachersInfo, userInfo } = useTeacherList();

const subjectsList = [
  ["Math", "Science"],
  ["English", "History"],
  ["Physics", "Chemistry"],
  ["Biology", "Geography"],
  ["PE", "Health"],
];

const initializeTeachers = async () => {
  const data = await fetchTeachersInfo();
  if (data && data.length > 0) {
    teachers.value = data.map((teacher, index) => ({
      id: teacher.id,
      name: `${teacher.firstname} ${teacher.lastname}`,
      email: teacher.email,
      avatar: teacher.image_path || avatar,
      subjects: subjectsList[index % subjectsList.length],
      phone: teacher.phone,
      complete_address: teacher.complete_address,

    }));
  }
};

onMounted(initializeTeachers);

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value;
  return teachers.value.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchQuery.value.toLowerCase())
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
