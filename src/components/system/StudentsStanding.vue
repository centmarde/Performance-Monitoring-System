<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-card elevation="8" class="mb-6">
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
            <v-card class="pa-3" outlined>
              <h3
                class="text-center font-weight-bold theme--light:text-h3 theme--dark:text-white"
              >
                {{ subject }}
              </h3>
              <span
                class="text-body-2 theme--light:text-body-1 theme--dark:text-body-2"
                >{{ sectionDescriptions[subject] }}</span
              >
              <v-divider class="mb-2"></v-divider>
              <v-row
                v-for="student in students"
                :key="student.name"
                align="center"
                justify="space-between"
              >
                <v-col cols="6">
                  <span
                    class="font-weight-bold theme--light:text-body-1 theme--dark:text-body-2"
                    >{{ student.name }}</span
                  >
                </v-col>
                <v-col cols="6">
                  <v-progress-linear
                    v-if="student.score > 0"
                    :value="student.score"
                    :color="getColor(student.score)"
                    height="15"
                    rounded
                  >
                    <strong>{{ student.score }}%</strong>
                  </v-progress-linear>
                  <span v-else>No record</span>
                </v-col>
              </v-row>
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
    const currentPage = ref<number>(1);
    const subjectsPerPage = 3;

    onMounted(async () => {
      await sectionsStore.fetchSections();
      const sections = sectionsStore.sections;

      for (const sec of sections) {
        sectionDescriptions[sec.code] = sec.description;
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

    function getColor(score: number): string {
      if (score >= 80) return "green";
      if (score >= 75) return "yellow";
      return "red";
    }

    return {
      studentStanding,
      getColor,
      sectionDescriptions,
      currentPage,
      totalPages,
      paginatedSubjects,
    };
  },
});
</script>

<style scoped>
h2 {
  color: var(--v-theme-primary); /* Primary color for headings */
}
h3 {
  color: var(--v-theme-on-background); /* Light theme on background color */
}
.theme--dark h3 {
  color: var(--v-theme-on-surface); /* Dark theme on surface color */
}
</style>
