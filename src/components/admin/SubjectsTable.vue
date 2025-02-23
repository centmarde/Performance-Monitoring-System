<template>
  <v-container>
    <v-card class="data-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">Subjects List</span>
        <v-btn @click="showAddSubjectForm = true" color="teal darken-3">
          Add Subject
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>
      <v-card-text>
        <v-table class="styled-table">
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Title</th>
              <th class="text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="subject in subjects" :key="subject.id">
              <td>{{ subject.id }}</td>
              <td>{{ subject.title }}</td>
              <td>{{ subject.created_at }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <!-- Add Subject Dialog -->
    <v-dialog v-model="showAddSubjectForm" max-width="500px">
      <v-card>
        <v-card-title>Add Subject</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addSubject">
            <v-text-field
              v-model="newSubject.title"
              label="Title"
              :rules="[requiredValidator]"
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showAddSubjectForm = false" color="grey darken-1">
            Cancel
          </v-btn>
          <v-btn @click="addSubject" color="teal darken-3" :disabled="!isAddSubjectValid">
            Add Subject
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { requiredValidator } from "@/lib/validator";
import {supabase} from "@/lib/supabase";

const subjectsStore = useSubjectsStore();
const { subjects, fetchSubjects } = subjectsStore;

const showAddSubjectForm = ref(false);
const newSubject = ref({ title: "" });

const isAddSubjectValid = computed(() => {
  return newSubject.value.title.trim() !== "";
});

const addSubject = async () => {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .insert([newSubject.value])
      .select();
    if (error) {
      throw error;
    }
    subjects.push({ ...newSubject.value, id: data[0].id, created_at: data[0].created_at });
    newSubject.value = { title: "" };
    showAddSubjectForm.value = false;
  } catch (error) {
    console.error("Error adding subject:", error);
  }
};

onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped>
.data-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  vertical-align: middle;
}

.styled-table th {
  background: #004d40;
  color: white;
}
</style>
