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
  const recordCount = ref(0);

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
    recordCount.value = data.length;
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
      initial_grade: 0,
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

  async function fetchInitialGradeByStudentId(studentId: number, classRecordId: number) {
    const { data, error } = await supabase
      .from('records')
      .select('initial_grade')
      .eq('student_id', studentId)
      .eq('class_record_id', classRecordId);
    

    if (error) {
      console.error('Error fetching initial grade:', error);
      return null;
    }
    console.log(data);
    return data?.[0]?.initial_grade || 0; // Return the initial grade from the first index
  }

  async function countMissedActivities() {
    const { data, error } = await supabase
      .from('records')
      .select('*')
     

    if (error) {
      console.error('Error fetching records:', error);
      return null;
    }

    const columnsToCheck = [
      'ww1', 'ww2', 'ww3', 'ww4', 'ww5', 'ww6', 'ww7', 'ww8', 'ww9', 'ww10',
      'pt1', 'pt2', 'pt3', 'pt4', 'pt5', 'pt6', 'pt7', 'pt8', 'pt9', 'pt10',
      'qa1'
    ];

    const missedActivities = data.reduce((acc, record) => {
      const missedCount = columnsToCheck.reduce((count, column) => {
        if (record[column] === null) {
          count++;
        }
        return count;
      }, 0);
      acc.push({ student_id: record.student_id, missedCount });
      return acc;
    }, []);

    console.log(missedActivities);
    return missedActivities;
  }

  return {
    records,
    fetchRecordsBySection,
    fetchAllRecords,
    fetchRecordsByClassRecordId,
    addRecordsForSection,
    fetchInitialGradeByStudentId,
    countMissedActivities,
    recordCount,
  };
});
