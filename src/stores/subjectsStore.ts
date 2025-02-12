import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

interface Subject {
  id: number;
  created_at: string;
  title: string;
}

export const useSubjectsStore = defineStore('subjectsStore', () => {
  const subjects = ref<Subject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSubjects() {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await supabase
      .from('subjects')
      .select('*');

    if (fetchError) {
      error.value = fetchError.message;
      subjects.value = [];
    } else {
      subjects.value = data as Subject[];
    }
    loading.value = false;
  }

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
  };
});
