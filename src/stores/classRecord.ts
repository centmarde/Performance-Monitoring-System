import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase';
import router from '../router';

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
    async fetchAllClassRecordsWithDetails() {
      this.loading = true;
      this.error = null;
      const { data, error } = await supabase
        .from('class_record')
        .select('*, subjects(title),sections(code),records(*),users(email)')
        .order('created_at', { ascending: false });
      if (error) {
        this.error = error.message;
      } else {
        this.classRecords = data.map(record => ({
          ...record,
          subjectName: record.subjects.title,
          students: record.students,
          handled_by: record.users.email,
          quarter: record.quarter,
          section: record.sections.code,
          student_count: record.records.length,
        }));
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
    async addClassRecord(selectedQuarter: string, selectedSubject: string, selectedSection: string) {
      this.loading = true;
      this.error = null;
      const teacherId = localStorage.getItem("user_id");

      if (!teacherId) {
        this.error = "Teacher ID not found in local storage.";
        this.loading = false;
        return;
      }

      // Fetch subject ID based on the selected subject title
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id')
        .eq('title', selectedSubject)
        .single();

      if (subjectError || !subjectData) {
        this.error = subjectError ? subjectError.message : "Subject not found.";
        this.loading = false;
        return;
      }

      // Fetch section ID based on the selected section code
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('id')
        .eq('code', selectedSection)
        .single();

      if (sectionError || !sectionData) {
        this.error = sectionError ? sectionError.message : "Section not found.";
        this.loading = false;
        return;
      }

      const { data, error } = await supabase.from('class_record').insert([{
        quarter: selectedQuarter,
        subject_id: subjectData.id,
        teacher_id: teacherId,
        section_id: sectionData.id,
      }]).single();

      if (error) {
        this.error = error.message;
      } else {
        const { data: recentData, error: recentError } = await supabase
          .from('class_record')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (recentError || !recentData) {
          this.error = recentError ? recentError.message : "Failed to fetch recent class record ID.";
        } else {
          localStorage.setItem("addedClassrecord", recentData.id);
          console.log("addedClassrecord", recentData.id);
        }
      }
      this.loading = false;
      router.push('/newrecords');
    },
  },
});
