import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";

export interface Section {
  id: number;
  created_at: string;
  teacher_id: number;
  code: string;
  description: string;
  subject_ids: number[];
  subject_titles: string[];
}

export const useSectionsStore = defineStore("sectionsStore", () => {
  const sections = ref<Section[]>([]);
  const sectionCount = ref(0);

  async function fetchSections() {
    // Fetch all sections directly without joining with section_subjects
    const { data: sectionsData, error: sectionsError } = await supabase
      .from("sections")
      .select("*");

    if (sectionsError) {
      console.error("Error fetching sections:", sectionsError);
      sections.value = [];
      return null;
    }

    console.log("Fetched sections:", sectionsData); // Debug log

    sections.value = sectionsData.map((section: any) => ({
      ...section,
      subject_ids: [],
      subject_titles: [],
    })) as Section[];

    sectionCount.value = sectionsData.length;
    return sections.value;
  }

  async function fetchSectionsWithStudents() {
    const { data, error } = await supabase
      .from("sections")
      .select("*, students(id)");

    if (error) {
      console.error("Error fetching sections with students:", error);
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
      .from("sections")
      .select("id")
      .eq("code", code)
      .single();

    if (error) {
      console.error("Error fetching section ID:", error);
      return null;
    }

    return data?.id ?? null;
  }

  return {
    sections,
    fetchSections,
    fetchSectionsWithStudents,
    fetchSectionIdByCode,
    sectionCount,
  };
});
