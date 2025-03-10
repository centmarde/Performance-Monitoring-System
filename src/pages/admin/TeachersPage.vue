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
              <v-card class="teacher-card" @click="openSubjectDialog(teacher)">
                <v-card-title class="text-center" elevation="8">
                  <v-avatar size="80">
                    <v-img
                      :src="teacher.image_path || '/default-avatar.png'"
                      alt="Teacher Avatar"
                    />
                  </v-avatar>
                  <div class="mt-2 font-weight-bold">
                    {{ teacher.firstname || "N/A" }}
                  </div>
                  <div class="text-caption text-muted">
                    {{ teacher.email || "broken email" }}
                  </div>
                </v-card-title>
                <v-card-text>
                  <div class="font-weight-bold">Subjects Handled:</div>
                  <div class="subjects-list">
                    <span
                      v-for="(subject, i) in teacher.subjects.length
                        ? teacher.subjects
                        : ['N/A']"
                      :key="i"
                      class="subject-item"
                    >
                      {{ subject }}
                    </span>
                  </div>

                  <div class="mt-3 font-weight-bold">Phone:</div>
                  <div class="text-muted">{{ teacher.phone || "N/A" }}</div>

                  <div class="mt-2 font-weight-bold">Address:</div>
                  <div class="text-muted">
                    {{ teacher.complete_address || "N/A" }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination Controls -->
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="3"
            rounded
            active-color="black"
            density="comfortable"
          ></v-pagination>
          
          <!-- Subject Assignment Dialog -->
          <v-dialog v-model="subjectDialog" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">
                Assign Subject to {{ selectedTeacher?.firstname || 'Teacher' }}
              </v-card-title>
              
              <v-card-text>
                <v-select
                  v-model="selectedSubject"
                  :items="availableSubjects"
                  item-title="title"
                  item-value="id"
                  label="Select a subject"
                  return-object
                  outlined
                ></v-select>
                
                <div v-if="assignmentMessage" :class="{'text-success': !assignmentError, 'text-error': assignmentError}">
                  {{ assignmentMessage }}
                </div>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="subjectDialog = false">
                  Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="assignSubject" :disabled="!selectedSubject">
                  Assign
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
import { useTeachers } from "@/composables/useTeachers";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { supabase } from "@/lib/supabase";

const {
  teachers,
  searchQuery,
  currentPage,
  itemsPerPage,
  filteredTeachers,
  totalPages,
  paginatedTeachers,
  initializeTeachers,
} = useTeachers();

const subjectsStore = useSubjectsStore();
const subjectDialog = ref(false);
const selectedTeacher = ref<any>(null);
const selectedSubject = ref<any>(null);
const assignmentMessage = ref('');
const assignmentError = ref(false);
const alreadyAssignedSubjectIds = ref<number[]>([]);

// Fetch subjects on component mount
onMounted(async () => {
  await subjectsStore.fetchSubjects();
  initializeTeachers();
});

// Watch for changes to selectedTeacher and update assigned subjects
watch(selectedTeacher, async (teacher) => {
  if (teacher) {
    await fetchAssignedSubjects(teacher.id);
  } else {
    alreadyAssignedSubjectIds.value = [];
  }
});

// Get subjects that aren't already assigned to the selected teacher
const availableSubjects = computed(() => {
  if (!selectedTeacher.value) return [];

  // Filter out already assigned subjects using the fetched IDs
  return subjectsStore.subjects.filter(
    subject => !alreadyAssignedSubjectIds.value.includes(subject.id)
  );
});

// Fetch subjects already assigned to this teacher directly from the database
async function fetchAssignedSubjects(teacherId: number) {
  try {
    const { data, error } = await supabase
      .from('asign_subjects')
      .select('subject_id')
      .eq('user_id', teacherId);
    
    if (error) {
      console.error('Error fetching assigned subjects:', error);
      alreadyAssignedSubjectIds.value = [];
      return;
    }
    
    // Extract subject IDs from the result
    alreadyAssignedSubjectIds.value = data.map(item => item.subject_id);
    console.log('Already assigned subject IDs:', alreadyAssignedSubjectIds.value);
  } catch (err) {
    console.error('Exception when fetching assigned subjects:', err);
    alreadyAssignedSubjectIds.value = [];
  }
}

// Open dialog when a teacher card is clicked
const openSubjectDialog = async (teacher: any) => {
  selectedTeacher.value = teacher;
  selectedSubject.value = null;
  assignmentMessage.value = '';
  assignmentError.value = false;
  
  // Get the latest assigned subjects from the database
  await fetchAssignedSubjects(teacher.id);
  
  subjectDialog.value = true;
};

// Assign the selected subject to the teacher
const assignSubject = async () => {
  if (!selectedTeacher.value || !selectedSubject.value) return;
  
  try {
    const { data, error } = await supabase
      .from('asign_subjects')
      .insert([
        { 
          user_id: selectedTeacher.value.id,
          subject_id: selectedSubject.value.id
        },
      ])
      .select();
      
    if (error) {
      console.error('Error assigning subject:', error);
      assignmentMessage.value = `Error: ${error.message}`;
      assignmentError.value = true;
      return;
    }
    
    assignmentMessage.value = `Subject "${selectedSubject.value.title}" successfully assigned!`;
    assignmentError.value = false;
    
    // Update the assigned subjects list right away
    alreadyAssignedSubjectIds.value = [...alreadyAssignedSubjectIds.value, selectedSubject.value.id];
    selectedSubject.value = null;
    
    // Refresh teacher data to show the newly assigned subject
    await initializeTeachers();
    
  } catch (err: any) {
    console.error('Exception when assigning subject:', err);
    assignmentMessage.value = `Error: ${err.message}`;
    assignmentError.value = true;
  }
};
</script>

<style scoped>
.teacher-card {
  min-height: 280px; /* Ensures all cards are the same height */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Spreads content evenly */
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.teacher-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribute content evenly */
  align-items: center;
  height: 100%; /* Make all cards the same height */
  min-height: 350px; /* Ensures uniformity */
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.teacher-card .v-card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  width: 100%;
}

.teacher-card .v-card-text {
  flex-grow: 1;
  width: 100%;
  text-align: center;
}

.subjects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  color: black;
}

.subject-item {
  background-color: #e0f7fa;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
}

.text-success {
  color: green;
}

.text-error {
  color: red;
}
</style>
