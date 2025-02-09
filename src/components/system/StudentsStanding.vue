<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-card elevation="8" class="mb-6 theme-card">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <h2 class="font-weight-bold">Student's Standing</h2>
            <v-divider class="mb-4"></v-divider>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(students, subject) in paginatedSubjects"
            :key="subject"
            cols="12"
            md="4"
          >
            <v-card class="pa-3 student-box fixed-card">
              <h3 class="text-center font-weight-bold">{{ subject }}</h3>
              <v-text-field
                v-model="searchQuery[subject]"
                label="Search student"
                dense
                outlined
                class="search-box"
                hide-details
                style="max-width: 100%"
                prepend-inner-icon="mdi-magnify"
              ></v-text-field>

              <span class="text-body-2">{{
                sectionDescriptions[subject]
              }}</span>
              <v-divider class="mb-2"></v-divider>
              <div class="scrollable-content">
                <v-row
                  v-for="(student, index) in filteredStudents(subject)"
                  :key="student.name"
                  align="center"
                  class="student-row"
                >
                  <v-col cols="9" class="font-weight-bold">{{
                    student.name
                  }}</v-col>
                  <v-col
                    cols="3"
                    class="text-right font-weight-bold"
                    :class="getColorClass(student.score)"
                  >
                    {{ student.score }}%
                  </v-col>
                  <v-divider
                    v-if="index < students.length - 1"
                    class="my-1"
                  ></v-divider>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="5"
          class="mt-4"
        ></v-pagination>
      </v-container>
    </v-card>
  </v-lazy>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from "vue";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useStudentsStore } from "@/stores/studentsStore";

interface Student {
  name: string;
  score: number;
}

export default defineComponent({
  setup() {
    const sectionsStore = useSectionsStore();
    const studentsStore = useStudentsStore();
    const studentStanding = reactive<Record<string, Student[]>>({});
    const sectionDescriptions = reactive<Record<string, string>>({});
    const searchQuery = reactive<Record<string, string>>({});
    const currentPage = ref<number>(1);
    const subjectsPerPage = 3;

    onMounted(async () => {
      await sectionsStore.fetchSections();
      const sections = sectionsStore.sections;

      for (const sec of sections) {
        sectionDescriptions[sec.code] = sec.description;
        searchQuery[sec.code] = "";
        const students = await studentsStore.fetchStudentsBySection(sec.id);
        if (students) {
          studentStanding[sec.code] = await Promise.all(
            students.map(async (student) => {
              try {
                const score = await studentsStore.fetchInitialScore(student.id);
                return {
                  name: `${student.firstname} ${student.lastname}`,
                  score: score || 0,
                };
              } catch (error) {
                console.error(
                  `Error fetching score for student ${student.id}:`,
                  error
                );
                return {
                  name: `${student.firstname} ${student.lastname}`,
                  score: 0,
                };
              }
            })
          );
        }
      }
    });

    const totalPages = computed(() =>
      Math.ceil(Object.keys(studentStanding).length / subjectsPerPage)
    );

    const paginatedSubjects = computed(() => {
      const subjects = Object.keys(studentStanding);
      const start = (currentPage.value - 1) * subjectsPerPage;
      const end = start + subjectsPerPage;
      return Object.fromEntries(
        subjects
          .slice(start, end)
          .map((subject) => [subject, studentStanding[subject]])
      );
    });

    function filteredStudents(subject: string) {
      return studentStanding[subject].filter((student) =>
        student.name.toLowerCase().includes(searchQuery[subject].toLowerCase())
      );
    }

    function getColorClass(score: number): string {
      if (score >= 80) return "text-green";
      if (score >= 75) return "text-orange";
      return "text-red";
    }

    return {
      studentStanding,
      getColorClass,
      sectionDescriptions,
      currentPage,
      totalPages,
      paginatedSubjects,
      searchQuery,
      filteredStudents,
    };
  },
});
</script>

<style scoped>
.theme-card {
  background-color: var(--v-background-base);
  color: var(--v-text-base);
  padding: 20px;
}

.student-box {
  background: linear-gradient(
    135deg,
    var(--card-gradient-start),
    var(--card-gradient-end)
  );
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.fixed-card {
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.search-box {
  width: 100%; /* Fix width */
  max-width: 250px; /* Prevent expansion */
  min-width: 250px; /* Keep size fixed */
  flex: none; /* Prevents stretching */
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 250px;
  padding-right: 8px;
}

.student-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}
</style>
