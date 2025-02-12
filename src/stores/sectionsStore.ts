import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

export interface Section { // Export the Section interface
  id: number;
  created_at: string;
  subject_id: number;
  teacher_id: number;
  code: string;
  description: string;
  subject_title: string;
}

export const useSectionsStore = defineStore('sectionsStore', () => {
  const sections = ref<Section[]>([]);

  async function fetchSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('*, subjects(title), users(email)');

    if (error) {
      console.error('Error fetching sections:', error);
      sections.value = [];
      return null;
    }

    sections.value = data.map((section: any) => ({
      ...section,
      subject_title: section.subjects.title,
    })) as Section[];
    return sections.value;
  }

  return {
    sections,
    fetchSections,
  };
});
