<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <h2 class="text-center font-weight-bold">
          Student Performance Evaluation
        </h2>

        <v-row>
          <!-- Left Panel: Subject & Students List -->
          <v-col cols="12" md="5">
            <v-card class="pa-4">
              <v-select
                v-model="selectedSubject"
                :items="subjects"
                label="Subject and Section"
                variant="outlined"
              ></v-select>

              <v-list>
                <v-list-item
                  v-for="(student, index) in filteredStudents"
                  :key="index"
                >
                  {{ student.name }}
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Right Panel: Missed Works & Tasks -->
          <v-col cols="12" md="7">
            <v-card class="pa-4">
              <h3 class="font-weight-bold text-center mb-4">
                Missed Works and Tasks
              </h3>

              <v-table>
                <thead>
                  <tr>
                    <th>Names</th>
                    <th>Works</th>
                    <th>Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(student, index) in filteredStudents" :key="index">
                    <td>{{ student.name }}</td>
                    <td>{{ student.works.join(", ") }}</td>
                    <td>{{ student.tasks.join(", ") }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import HomeLayout from "@/layouts/HomeLayout.vue";

// Dummy data for subjects
const subjects = ref(["English 8 - DE1", "Math 9 - FG1", "Science 7 - FG2"]);

const selectedSubject = ref(subjects.value[0]); // Default selected subject

// Dummy student data
const students = ref([
  {
    name: "John Voltaire Baslot",
    subject: "English 8 - DE1",
    works: [1, 3, 5],
    tasks: [1, 2],
  },
  {
    name: "MJ Miral",
    subject: "English 8 - DE1",
    works: [2, 4],
    tasks: [3, 5],
  },
  {
    name: "Jacqueline Omlang",
    subject: "English 8 - DE1",
    works: [1, 5],
    tasks: [2, 4],
  },
  {
    name: "Centmarde Campado",
    subject: "Math 9 - FG1",
    works: [1, 2],
    tasks: [1, 3],
  },
  {
    name: "Christ Charl Gabales",
    subject: "Science 7 - FG2",
    works: [3, 4],
    tasks: [4, 5],
  },
]);

// Computed property to filter students based on selected subject
const filteredStudents = computed(() =>
  students.value.filter((student) => student.subject === selectedSubject.value)
);
</script>

<style scoped>
/* Optional Styling */
.v-card {
  border-radius: 12px;
}
</style>
