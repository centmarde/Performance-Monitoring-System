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

  async function fetchSectionsWithStudents() {
    const { data, error } = await supabase
      .from('sections')
      .select('*, students(id)');

    if (error) {
      console.error('Error fetching sections with students:', error);
      sections.value = [];
      return null;
    }

    sections.value = data.map((section: any) => ({
      ...section,
      student_ids: section.students.map((student: any) => student.id),
    })) as Section[];
    return sections.value;
  }

  async function fetchSectionIdByCode(code: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('sections')
      .select('id')
      .eq('code', code)
      .single();

    if (error) {
      console.error('Error fetching section ID:', error);
      return null;
    }

    return data?.id ?? null;
  }

  return {
    sections,
    fetchSections,
    fetchSectionsWithStudents,
    fetchSectionIdByCode, // Add this line
  };
});
