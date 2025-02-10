<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="end">
          <v-col cols="auto">
            <v-card class="pa-3 rounded-card glass-card">
              <h4 class="font-weight-bold text-end">
                <span class="mdi mdi-account-school"></span> Subject Management
              </h4>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <!-- "Add New" Card -->
          <v-col v-if="currentPage === 1" cols="12" sm="6" md="4">
            <v-card class="subject-card add-new-card" @click="openNewClass">
              <v-container
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <v-icon size="80" color="#004D40">mdi-plus</v-icon>
                <h3 class="font-weight-bold">Add New</h3>
              </v-container>
            </v-card>
          </v-col>

          <!-- Subject Cards with Pagination -->
          <v-col
            v-for="(subject, index) in paginatedSubjects"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="subject-card" @click="openClassRecord(subject)">
              <v-img :src="subject.image" class="subject-image"></v-img>
              <v-card-title class="text-center font-weight-bold">
                {{ subject.name }}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagination Control -->
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          class="mt-4 d-flex justify-center"
        ></v-pagination>

        <!-- Class Record Dialog -->
        <v-dialog v-model="classRecordDialog" max-width="900px">
          <v-card>
            <v-card-title class="text-center font-weight-bold">
              Class Record - {{ activeSubject || "New Subject" }}
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      label="Student Count"
                      v-model="classRecord.schoolName"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Subject"
                      v-model="classRecord.subject"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn
                v-if="!activeSubject"
                color="success"
                @click="addNewSubject"
                >Add</v-btn
              >
              <v-btn
                v-if="activeSubject"
                color="primary"
                @click="saveClassRecord"
                >Save</v-btn
              >
              <v-btn color="error" @click="classRecordDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import HomeLayout from "@/layouts/HomeLayout.vue";

const classRecordDialog = ref(false);
const activeSubject = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;

const subjects = ref([
  { name: "English 8 - FG2", image: "/src/assets/class_record.png" },
  { name: "Science 7 - DE1", image: "/src/assets/class_record.png" },
  { name: "Math 9 - FG1", image: "/src/assets/class_record.png" },
  { name: "History 10 - FG2", image: "/src/assets/class_record.png" },
  { name: "Physics 11 - FG3", image: "/src/assets/class_record.png" },
  { name: "Chemistry 12 - FG1", image: "/src/assets/class_record.png" },
  { name: "Biology 10 - FG2", image: "/src/assets/class_record.png" },
]);

const totalPages = computed(() => {
  const remainingSubjects = subjects.value.length - 5; // First page has 5 subjects
  return 1 + Math.ceil(remainingSubjects / itemsPerPage);
});
const paginatedSubjects = computed(() => {
  if (currentPage.value === 1) {
    return subjects.value.slice(0, 5); // First page only has 5 subjects
  }
  const start = 5 + (currentPage.value - 2) * itemsPerPage;
  return subjects.value.slice(start, start + itemsPerPage);
});

// Default template for new class records
const defaultClassRecord = () => ({
  schoolName: "Los Angeles National High School",
  subject: "",
  students: [
    {
      name: "Centmarde",
      written: [0, 0, 0, 0, 0],
      performance: [0, 0, 0, 0, 0],
      assessment: 0,
    },
    {
      name: "Christ",
      written: [0, 0, 0, 0, 0],
      performance: [0, 0, 0, 0, 0],
      assessment: 0,
    },
  ],
});

const subjectRecords = ref<{ [key: string]: any }>({});
const classRecord = ref(defaultClassRecord());

const openClassRecord = (subject: { name: string }) => {
  activeSubject.value = subject.name;
  if (!subjectRecords.value[subject.name]) {
    subjectRecords.value[subject.name] = defaultClassRecord();
    subjectRecords.value[subject.name].subject = subject.name;
  }
  classRecord.value = JSON.parse(
    JSON.stringify(subjectRecords.value[subject.name])
  );
  classRecordDialog.value = true;
};

const openNewClass = () => {
  activeSubject.value = "";
  classRecord.value = defaultClassRecord();
  classRecordDialog.value = true;
};

const addNewSubject = () => {
  if (!classRecord.value.subject.trim()) {
    alert("Please enter a subject name.");
    return;
  }
  subjects.value.push({
    name: classRecord.value.subject,
    image: "/src/assets/class_record.png",
  });
  subjectRecords.value[classRecord.value.subject] = { ...classRecord.value };
  classRecordDialog.value = false;
};

const getTotal = (scores: number[]) => scores.reduce((a, b) => a + b, 0);
const getFinalGrade = (student: any) =>
  Math.round(
    getTotal(student.written) * 0.2 +
      getTotal(student.performance) * 0.6 +
      student.assessment * 0.2
  );

const saveClassRecord = () => {
  const previousName = activeSubject.value;
  const newName = classRecord.value.subject.trim();
  if (!newName) {
    alert("Subject name cannot be empty.");
    return;
  }
  if (previousName && previousName !== newName) {
    const subjectIndex = subjects.value.findIndex(
      (subject) => subject.name === previousName
    );
    if (subjectIndex !== -1) {
      subjects.value[subjectIndex].name = newName;
    }
    subjectRecords.value[newName] = { ...subjectRecords.value[previousName] };
    delete subjectRecords.value[previousName];
    activeSubject.value = newName;
  }
  subjectRecords.value[newName] = { ...classRecord.value };
  classRecordDialog.value = false;
};
</script>

<style scoped>
.score-input {
  max-width: 90px; /* Increased width */
  min-width: 80px;
  height: 40px; /* Increased height */
  font-size: 20px; /* Larger font size */
  text-align: center;
  padding: 8px; /* More padding for better spacing */
}

.score-input input {
  color: #000 !important;
  font-weight: bold;
  text-align: center;
}
.add-new-card {
  border: 2px dashed var(--v-primary-base);
  background-color: var(--v-background-base);
  color: var(--v-text-base);
  cursor: pointer;
  text-align: center;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subject-card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5); /* Border to enhance glass effect */
  backdrop-filter: blur(10px); /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  box-shadow: 0 0 10px #004d40; /* Glowing effect */
  cursor: pointer;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.3s;
}
.subject-card:hover {
  transform: scale(1.05);
}
.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.rounded-card {
  border-radius: 12px;
}
</style>
