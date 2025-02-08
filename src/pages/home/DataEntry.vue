<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <h2 class="text-center font-weight-bold">
          Student Performance Evaluation
        </h2>

        <v-row>
          <!-- "Add New" Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="add-new-card" @click="openNewClass">
              <v-container
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <v-icon size="80" color="primary">mdi-plus</v-icon>
                <h3 class="font-weight-bold">Add New</h3>
              </v-container>
            </v-card>
          </v-col>

          <!-- Subject Cards -->
          <v-col
            v-for="(subject, index) in subjects"
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
                      label="School Name"
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

                <v-table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th v-for="i in 5" :key="'written' + i">
                        Written {{ i }}
                      </th>
                      <th>Total</th>
                      <th v-for="i in 5" :key="'performance' + i">
                        Performance {{ i }}
                      </th>
                      <th>Total</th>
                      <th>Assessment</th>
                      <th>Final Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(student, index) in classRecord.students"
                      :key="index"
                    >
                      <td>{{ student.name }}</td>
                      <td v-for="(score, i) in student.written" :key="'w' + i">
                        <v-text-field
                          v-model.number="student.written[i]"
                          type="number"
                          density="comfortable"
                          class="score-input"
                          hide-details
                        ></v-text-field>
                      </td>
                      <td>{{ getTotal(student.written) }}</td>
                      <td
                        v-for="(score, i) in student.performance"
                        :key="'p' + i"
                      >
                        <v-text-field
                          v-model.number="student.performance[i]"
                          type="number"
                          density="comfortable"
                          class="score-input"
                        ></v-text-field>
                      </td>
                      <td>{{ getTotal(student.performance) }}</td>
                      <td>
                        <v-text-field
                          v-model.number="student.assessment"
                          type="number"
                          density="comfortable"
                          class="score-input"
                        ></v-text-field>
                      </td>
                      <td>{{ getFinalGrade(student) }}</td>
                    </tr>
                  </tbody>
                </v-table>
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

// Sample subjects
const subjects = ref([
  { name: "English 8 - FG2", image: "/src/assets/class_record.png" },
  { name: "Science 7 - DE1", image: "/src/assets/class_record.png" },
]);

// Default template for new class records
const defaultClassRecord = () => ({
  schoolName: "Los Angeles National High School",
  subject: "",
  students: [
    {
      name: "Natoy",
      written: [0, 0, 0, 0, 0],
      performance: [0, 0, 0, 0, 0],
      assessment: 0,
    },
    {
      name: "MJ",
      written: [0, 0, 0, 0, 0],
      performance: [0, 0, 0, 0, 0],
      assessment: 0,
    },
  ],
});

// Store different records per subject
const subjectRecords = ref<{ [key: string]: any }>({});

// Current working class record
const classRecord = ref(defaultClassRecord());

// Open existing class record
const openClassRecord = (subject: { name: string }) => {
  activeSubject.value = subject.name;

  if (!subjectRecords.value[subject.name]) {
    subjectRecords.value[subject.name] = defaultClassRecord();
    subjectRecords.value[subject.name].subject = subject.name;
  }

  // Create a deep copy of the selected class record
  classRecord.value = JSON.parse(
    JSON.stringify(subjectRecords.value[subject.name])
  );

  classRecordDialog.value = true;
};

// Open "Add New" functionality
const openNewClass = () => {
  activeSubject.value = "";
  classRecord.value = defaultClassRecord();
  classRecordDialog.value = true;
};

// Add new subject
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
  border: 2px dashed #1976d2;
  background-color: #f5f5f5;
  cursor: pointer;
  text-align: center;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.subject-card {
  cursor: pointer;
  transition: 0.3s;
}

.subject-card:hover {
  transform: scale(1.05);
}

.subject-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
</style>
