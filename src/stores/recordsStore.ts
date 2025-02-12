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

  async function fetchRecordsByClassRecordId(classRecordId: number) {
    const { data, error } = await supabase
      .from('records')
      .select('*,students(firstname, lastname)')
      .eq('class_record_id', classRecordId);

    if (error) {
      console.error('Error fetching records:', error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    return records.value;
  }

  async function addRecordsForSection(sectionId: number, classRecordId: number) {
    const { data: students, error } = await supabase
      .from('students')
      .select('id')
      .eq('section_id', sectionId);
  
    if (error) {
      console.error('Error fetching students for section:', error);
      return null;
    }
  
    const records = students.map((student: any) => ({
      student_id: student.id,
      class_record_id: classRecordId,
      initial_grade: 0, // Default initial grade
    }));
  
    const { error: insertError } = await supabase
      .from('records')
      .insert(records);
  
    if (insertError) {
      console.error('Error adding records:', insertError);
      return null;
    }
  
    return records;
  }

  return {
    records,
    fetchRecordsBySection,
    fetchAllRecords,
    fetchRecordsByClassRecordId,
    addRecordsForSection,
  };
});
