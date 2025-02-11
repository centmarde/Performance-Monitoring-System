import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase';

export const useClassRecordStore = defineStore('classRecord', {
  state: () => ({
    classRecords: [] as any[],
    students: [] as any[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchClassRecords() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('class_record')
        .select('*');
      if (error) {
        this.error = error.message;
      } else {
        this.classRecords = data;
      }
      this.loading = false;
    },
    async fetchStudentsByClassRecord(classRecordId: number) {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('records')
        .select('*, students(*)')
        .eq('class_record_id', classRecordId);
      if (error) {
        this.error = error.message;
      } else {
        this.students = data.map(record => ({
          ...record.students,
          section_id: record.section_id,
        }));
      }
      this.loading = false;
    },
  },
});
