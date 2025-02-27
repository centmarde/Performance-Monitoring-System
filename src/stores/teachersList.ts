import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

interface Subject {
  id: number;
  title: string;
}

interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  complete_address: string;
  user_type: string;
  image_path: string;
  subjects?: Subject[];
}

export const useTeacherList = defineStore("teacherList", () => {
  const userInfo = ref<Teacher[]>([]);
  const teacherCount = ref(0);

  async function fetchTeachersInfo() {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, firstname, lastname, email, phone, complete_address, user_type, image_path"
      )
      .eq("user_type", "teacher");

    if (error) {
      console.error("Error fetching user info:", error);
      userInfo.value = [];
      return null;
    }

    teacherCount.value = data.length;

    const teacherIds = data.map((teacher: any) => teacher.id);
    const { data: subjectsData, error: subjectsError } = await supabase
      .from("asign_subjects")
      .select("user_id, subject_id, subjects(title)")
      .in("user_id", teacherIds);

    if (subjectsError) {
      console.error("Error fetching teacher subjects:", subjectsError);
      userInfo.value = data as Teacher[];
      return userInfo.value;
    }

    const subjectsMap: { [key: number]: Subject[] } = {};
    subjectsData.forEach((item: any) => {
      if (!subjectsMap[item.user_id]) {
        subjectsMap[item.user_id] = [];
      }
      subjectsMap[item.user_id].push({
        id: item.subject_id,
        title: item.subjects.title,
      });
    });

    userInfo.value = data.map((teacher: any) => ({
      ...teacher,
      subjects: subjectsMap[teacher.id] || [],
    }));

    return userInfo.value;
  }

  return {
    userInfo,
    fetchTeachersInfo,
    teacherCount,
  };
});
