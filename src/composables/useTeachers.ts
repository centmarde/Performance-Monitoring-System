import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import Avatar from "@/assets/avatar.png";

interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  image_path: string;
  phone: string;
  complete_address: string;
}

interface TeacherWithSubjects extends Teacher {
  subjects: string[];
}

const avatar = Avatar;
const teachers = ref<TeacherWithSubjects[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);

const itemsPerPage = 8;

const fetchTeachersInfo = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }
  return data;
};

const initializeTeachers = async () => {
  const data = await fetchTeachersInfo();
  if (data && data.length > 0) {
    teachers.value = await Promise.all(
      data.map(async (teacher) => {
        const { data: subjectsData, error } = await supabase
          .from('asign_subjects')
          .select('subject_id')
          .eq('user_id', teacher.id);

        if (error) {
          console.error('Error fetching assigned subjects:', error);
          return {
            ...teacher,
            subjects: [],
            avatar: teacher.image_path || avatar,
          };
        }

        const subjectIds = subjectsData.map((record) => record.subject_id);
        const { data: subjects, error: subjectsError } = await supabase
          .from('subjects')
          .select('title')
          .in('id', subjectIds);

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError);
          return {
            ...teacher,
            subjects: [],
            avatar: teacher.image_path || avatar,
          };
        }

        return {
          ...teacher,
          subjects: subjects.map((subject) => subject.title),
          avatar: teacher.image_path || avatar,
        };
      })
    );
  }
};

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value;
  return teachers.value.filter(
    (teacher) =>
      `${teacher.firstname} ${teacher.lastname}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredTeachers.value.length / itemsPerPage)
);

const paginatedTeachers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTeachers.value.slice(start, start + itemsPerPage);
});

export function useTeachers() {
  return {
    teachers,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredTeachers,
    totalPages,
    paginatedTeachers,
    initializeTeachers,
  };
}
