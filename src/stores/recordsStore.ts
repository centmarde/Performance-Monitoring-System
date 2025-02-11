import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

interface Record {
  id: number;
  student_id: number;
  initial_grade: number;
  class_record_id: number;
}

export const useRecordsStore = defineStore('recordsStore', () => {
  const records = ref<Record[]>([]);

  async function fetchRecordsBySection(sectionId: number) {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('section_id', sectionId);
    

    if (error) {
      console.error('Error fetching records:', error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    return records.value;
  }

  async function fetchAllRecords() {
    const { data, error } = await supabase
      .from('records')
      .select('*');

    if (error) {
      console.error('Error fetching records:', error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    return records.value;
  }

  return {
    records,
    fetchRecordsBySection,
    fetchAllRecords,
  };
});
