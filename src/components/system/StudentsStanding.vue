<template>
  <v-card elevation="8" class="mb-6">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="font-weight-bold">Students' Standing</h2>
          <v-divider class="mb-4"></v-divider>
        </v-col>
      </v-row>

      <!-- Table Pagination -->
      <v-row>
        <v-col cols="12">
          <v-container>
            <v-row>
              <v-col
                v-for="(students, subject) in paginatedSubjects"
                :key="subject"
                cols="12"
                md="4"
              >
                <v-card class="pa-3" outlined>
                  <h3 class="text-center font-weight-bold">{{ subject }}</h3>
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
                        :value="student.score"
                        :color="getColor(student.score)"
                        height="15"
                        rounded
                      >
                        <strong>{{ student.score }}%</strong>
                      </v-progress-linear>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>

      <!-- Pagination Controls -->
      <v-row justify="center" class="mt-1 mb-2">
        <v-btn @click="prevPage" :disabled="currentPage === 1"> Prev </v-btn>
        <span class="mx-3 mt-1 font-weight-bold"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <v-btn @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from "vue";

interface Student {
  name: string;
  score: number;
}

export default defineComponent({
  setup() {
    const studentStanding = reactive<Record<string, Student[]>>({
      TEST: [
        { name: "OMLANG", score: 87 },
        { name: "BASLOT", score: 79 },
        { name: "MIRAL", score: 78 },
      ],
      "ENGLISH - ED2": [
        { name: "MARDE", score: 76 },
        { name: "GABALES", score: 74 },
        { name: "YANG", score: 73 },
      ],
      "ENGLISH - DE1": [
        { name: "BASLOT", score: 85 },
        { name: "MIRAL", score: 88 },
        { name: "GABALES", score: 90 },
      ],
      "SCIENCE 8": [
        { name: "MARK", score: 82 },
        { name: "JANE", score: 77 },
        { name: "KYLE", score: 80 },
      ],
      "MATH 7": [
        { name: "JAMES", score: 90 },
        { name: "LINA", score: 89 },
        { name: "MIRA", score: 76 },
      ],
    });

    const subjects = computed(() => Object.keys(studentStanding));
    const currentPage = ref(1);
    const itemsPerPage = 3;

    const totalPages = computed(() =>
      Math.ceil(subjects.value.length / itemsPerPage)
    );

    const paginatedSubjects = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return subjects.value.slice(start, end).reduce((obj, key) => {
        obj[key] = studentStanding[key];
        return obj;
      }, {} as Record<string, Student[]>);
    });

    function getColor(score: number): string {
      if (score >= 80) return "green";
      if (score >= 75) return "yellow";
      return "red";
    }

    function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
    }

    return {
      studentStanding,
      getColor,
      currentPage,
      totalPages,
      paginatedSubjects,
      prevPage,
      nextPage,
    };
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
