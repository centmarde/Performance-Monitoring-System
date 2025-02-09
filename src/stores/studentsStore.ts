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

  async function fetchStudentsBySection(sectionId: number) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('section_id', sectionId);

    if (error) {
      console.error('Error fetching students:', error);
      students.value = [];
      return null;
    }

    students.value = data as Student[];
    return students.value;
  }

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
    return students.value;
  }

  async function fetchInitialScore(studentId: number) {
    const { data, error } = await supabase
      .from('records')
      .select('initial_grade')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.warn('Error fetching initial score:', error);
      return null;
    }

    return data?.initial_grade || 0;
  }

  return {
    students,
    fetchStudentsBySection,
    fetchInitialScore,
    fetchAllStudents,
  };
});
