import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

interface Student {
  id: number;
  created_at: string;
  firstname: string;
  lastname: string;
  section_id: number;
  standing: string;
  phone: string;
  address: string;
  remarks: string;
}

export const useStudentsStore = defineStore('studentsStore', () => {
  const students = ref<Student[]>([]);
  const studentCount = ref(0);

  async function fetchAllStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*');

    if (error) {
      console.error('Error fetching all students:', error);
      students.value = [];
      return null;
    }

    students.value = data as Student[];
    studentCount.value = data.length;
    return students.value;
  }

  async function fetchInitialScore(studentId: number) {
    // ...existing code...
    console.log("pending", studentId);
  }

  return {
    students,
    fetchInitialScore,
    fetchAllStudents,
    studentCount,
  };
});
