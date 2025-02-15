<template>
  <v-container>
  <v-card>
      <v-row>
      <v-col cols="4">
        <v-select
          :items="sections"
          item-title="code"
          item-value="code"
          label="Select Section"
          v-model="selectedSection"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-select
          :items="students"
          item-title="fullName"
          item-value="fullName"
          label="Select Student"
          v-model="selectedStudent"
          :disabled="!selectedSection"
        ></v-select>
      </v-col>
      <v-col cols="4">
        <v-card class="fixed-width-card">s</v-card>
      </v-col>
    </v-row>
  </v-card>
  </v-container>
</template>

<script lang="ts">
import { supabase } from '@/lib/supabase';
import { defineComponent, ref, onMounted, watch } from 'vue';

interface Section {
  code: string;
  id: string;
}

interface Student {
  firstName: string;
  lastName: string;
  fullName: string;
}

export default defineComponent({
  setup() {
    const sections = ref<Section[]>([]);
    const students = ref<Student[]>([]);
    const selectedSection = ref<string | null>(null);
    const selectedStudent = ref<string | null>(null);

    const fetchSections = async () => {
      const { data, error } = await supabase.from('sections').select('code, id');
      if (error) {
        console.error(error);
      } else {
        sections.value = data as Section[];
      }
    };

    const fetchStudents = async (sectionCode: string) => {
      students.value = []; // Clear previous students
      selectedStudent.value = null; // Reset selected student

      const section = sections.value.find(sec => sec.code === sectionCode);
      if (!section) {
        console.error('Section not found');
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('firstname, lastname')
        .eq('section_id', section.id);

      if (error) {
        console.error(error);
      } else {
        students.value = data.map((student: any) => ({
          firstName: student.firstname,
          lastName: student.lastname,
          fullName: `${student.firstname} ${student.lastname}`,
        }));
      }
    };

    watch(selectedSection, (newSection) => {
      if (newSection) {
        fetchStudents(newSection);
      }
    });

    onMounted(fetchSections);

    return {
      sections,
      students,
      selectedSection,
      selectedStudent,
    };
  }
});
</script>

<style scoped>
.fixed-width-card {
  width: 300px;
}
</style>
