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
            <v-card class="subject-card add-new-card" @click="showAddNewDialog">
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
            <v-card class="subject-card" @click="handleCardClick(subject.id)">
              <v-card-title>{{ subject.subjectName }}</v-card-title>
              <v-card-subtitle>Quarter: {{ subject.quarter }}</v-card-subtitle>
              <v-card-subtitle>Section: {{ subject.section }}</v-card-subtitle>
              <v-card-subtitle>Student Count: {{ subject.student_count }}</v-card-subtitle>
              <v-card-subtitle>Handled by: {{ subject.handled_by }}</v-card-subtitle>
              <v-card-text>
                <ul>
                  <li v-for="student in subject.students" :key="student.id">
                    {{ student.name }}
                  </li>
                </ul>
              </v-card-text>
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
                  <v-col cols="12">
                    <v-select
                      label="Subject"
                      :items="subjectOptions"
                      v-model="selectedSubject"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="Section"
                      :items="sectionOptions"
                      v-model="selectedSection"
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      label="Quarter"
                      :items="quarterOptions"
                      v-model="selectedQuarter"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn
                v-if="!activeSubject"
                color="success"
               @click="saveClassRecord"
                >Add</v-btn
              >
              <v-btn
                v-if="activeSubject"
                color="primary"
             
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import HomeLayout from "@/layouts/HomeLayout.vue";
import { useClassRecordStore } from "@/stores/classRecord";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { useSectionsStore } from "@/stores/sectionsStore";

const classRecordDialog = ref(false);
const activeSubject = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;

const classRecordStore = useClassRecordStore();
const subjects = ref<any[]>([]);

const subjectsStore = useSubjectsStore();
const sectionsStore = useSectionsStore();

const subjectOptions = computed(() => subjectsStore.subjects.map(subject => subject.title));
const sectionOptions = computed(() => sectionsStore.sections.map(section => section.code));

onMounted(async () => {
  await classRecordStore.fetchAllClassRecordsWithDetails();
  subjects.value = classRecordStore.classRecords;
  await subjectsStore.fetchSubjects();
  await sectionsStore.fetchSections();
});

const totalPages = computed(() => {
  const remainingSubjects = subjects.value.length - 5; 
  return 1 + Math.ceil(remainingSubjects / itemsPerPage);
});
const paginatedSubjects = computed(() => {
  if (currentPage.value === 1) {
    return subjects.value.slice(0, 5); 
  }
  const start = 5 + (currentPage.value - 2) * itemsPerPage;
  return subjects.value.slice(start, start + itemsPerPage);
});

const subjectRecords = ref<{ [key: string]: any }>({});

const saveClassRecord = async () => {
  await classRecordStore.addClassRecord(
    selectedQuarter.value,
    selectedSubject.value,
    selectedSection.value
  );
  classRecordDialog.value = false;
};

const showAddNewDialog = () => {
  activeSubject.value = "";
  classRecordDialog.value = true;
};

const quarterOptions = ref(['1', '2', '3', '4']); 

const selectedSubject = ref('');
const selectedSection = ref('');
const selectedQuarter = ref('');

const router = useRouter();

const handleCardClick = (classRecordId: number) => {
  localStorage.setItem("classRecordId", classRecordId.toString());
  router.push('/recentrecords');
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
