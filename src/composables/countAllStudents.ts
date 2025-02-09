import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

export function useStudentCount() {
  const studentCount = ref(0);
  const lowScoreStudents = ref<{ student_id: any; initial_score: any }[]>([]);
  const failingSubjects = ref<{ student_id: any; subject: any }[]>([]);

  onMounted(async () => {
    try {
      const { data, error, count } = await supabase
        .from('students')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      studentCount.value = count || 0;

      const { data: lowScoreData, error: lowScoreError } = await supabase
        .from('records')
        .select('student_id, initial_score')
        .lt('initial_score', 75);

      if (lowScoreError) {
        throw lowScoreError;
      }

      lowScoreStudents.value = lowScoreData || [];

      const { data: failingSubjectsData, error: failingSubjectsError } = await supabase
        .from('subjects')
        .select('id, title')
        .in('id', lowScoreStudents.value.map(student => student.student_id));

      if (failingSubjectsError) {
        throw failingSubjectsError;
      }

      failingSubjects.value = failingSubjectsData.map(subject => ({
        student_id: subject.id,
        subject: subject.title,
      })) || [];
    } catch (error) {
      console.error('Error fetching student count, low score students, or failing subjects:', error);
    }
  });

  return {
    studentCount,
    lowScoreStudents,
    failingSubjects,
  };
}