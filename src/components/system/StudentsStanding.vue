<template>
  <v-lazy
  :min-height="200"
  :options="{'threshold':0.5}"
  transition="fade-transition"
  >
  <v-card elevation="8" class="mb-6">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="font-weight-bold">Students' Standing</h2>
          <v-divider class="mb-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(students, subject) in studentStanding"
          :key="subject"
          cols="12"
          md="4"
        >
          <v-card class="pa-3" outlined>
            <h3 class="text-center font-weight-bold">{{ subject }}</h3>
            <span>{{ sectionDescriptions[subject] }}</span>
            <v-divider class="mb-2"></v-divider>
            <v-row
              v-for="student in students"
              :key="student.name"
              align="center"
              justify="space-between"
            >
              <v-col cols="6">
                <span class="font-weight-bold">{{ student.name }}</span>
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
    </v-container>
  </v-card>
</v-lazy>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import { useRecordsStore } from "@/stores/recordsStore";

interface Student {
  name: string;
  score: number;
}

export default defineComponent({
  setup() {
    const sectionsStore = useSectionsStore();
    const studentsStore = useStudentsStore();
    const recordsStore = useRecordsStore();
    const studentStanding = reactive<Record<string, Student[]>>({});
    const section = ref<string>("");
    const sectionDescriptions = reactive<Record<string, string>>({});

    onMounted(async () => {
      await sectionsStore.fetchSections();
      const sections = sectionsStore.sections;

      for (const sec of sections) {
        section.value = sec.code;
        sectionDescriptions[sec.code] = sec.description;
        const students = await studentsStore.fetchStudentsBySection(sec.id);
        if (students) {
          studentStanding[sec.code] = await Promise.all(students.map(async student => {
            try {
              const score = await studentsStore.fetchInitialScore(student.id);
              return {
                name: `${student.firstname} ${student.lastname}`,
                score: score || 0,
              };
            } catch (error) {
              console.error(`Error fetching score for student ${student.id}:`, error);
              return {
                name: `${student.firstname} ${student.lastname}`,
                score: 0,
              };
            }
          }));
        }
      }
    });

    function getColor(score: number): string {
      if (score >= 80) return "green";
      if (score >= 75) return "yellow";
      return "red";
    }

    return { studentStanding, getColor, section, sectionDescriptions };
  },
});
</script>

<style scoped>
h2 {
  color: #3f51b5;
}
h3 {
  color: #000;
}
</style>
