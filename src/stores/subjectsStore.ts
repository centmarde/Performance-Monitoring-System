import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

interface Subject {
  id: number;
  created_at: string;
  title: string;
}

export const useSubjectsStore = defineStore("subjectsStore", () => {
  const subjects = ref<Subject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const subjectCount = ref(0);

  async function fetchSubjects() {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await supabase
      .from("subjects")
      .select("*");

    if (fetchError) {
      error.value = fetchError.message;
      subjects.value = [];
      console.error("Error fetching subjects:", fetchError);
    } else {
      subjects.value = data as Subject[];
      subjectCount.value = data.length;
      console.log("Fetched subjects:", data); // Add this line to debug
    }
    loading.value = false;
  }

  async function fetchSubjectIdByTitle(title: string): Promise<number | null> {
    let subjectId: number | null = null;

    const { data, error } = await supabase
      .from("subjects")
      .select("id")
      .eq("title", title)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        console.error("No subject found with the given title.");
      } else {
        console.error("Error fetching subject ID:", error);
      }
    } else {
      subjectId = data.id;
    }

    return subjectId;
  }

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    fetchSubjectIdByTitle,
    subjectCount,
  };
});
