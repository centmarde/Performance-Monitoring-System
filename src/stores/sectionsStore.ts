import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

interface Section {
  id: number;
  created_at: string;
  subject_id: number;
  teacher_id: number;
  code: string;
  description: string;
}

export const useSectionsStore = defineStore('sectionsStore', () => {
  const sections = ref<Section[]>([]);

  async function fetchSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('*');

    if (error) {
      console.error('Error fetching sections:', error);
      sections.value = [];
      return null;
    }

    sections.value = data as Section[];
    return sections.value;
  }

  return {
    sections,
    fetchSections,
  };
});
