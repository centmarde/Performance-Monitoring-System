import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

interface Subjects {
  id: number;
  created_at: string;
  title: string;
}

export const useSubjectListStore = defineStore('subjectListStore', () => {
  const subjects = ref<Subjects[]>([]);

  async function fetchSubjects() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');

    if (error) {
      console.error('Error fetching subjects:', error);
      subjects.value = [];
      return null;
    }

    subjects.value = data as Subjects[];
    return subjects.value;
  }

  return {
    subjects,
    fetchSubjects,
  };
});
