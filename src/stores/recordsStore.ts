import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "@/lib/supabase";
import topicsData from "@/../public/data/topics.json"; // Import topics.json

interface Record {
  student_id: number;
  topic1: number | null;
  topic2: number | null;
  topic3: number | null;
  topic4: number | null;
  topic5: number | null;
  pt1: number;
  pt2: number;
  pt3: number;
  pt4: number;
  pt5: number;
  pt6: number;
  pt7: number;
  pt8: number;
  pt9: number;
  pt10: number;
  qa1: number;
  class_record_id: number;
}

export const useRecordsStore = defineStore("recordsStore", () => {
  const records = ref<Record[]>([]);
  const recordCount = ref(0);

  async function fetchRecordsBySection(sectionId: number) {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("section_id", sectionId);

    if (error) {
      console.error("Error fetching records:", error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    return records.value;
  }

  async function fetchAllRecords() {
    const { data, error } = await supabase.from("records").select("*");

    if (error) {
      console.error("Error fetching records:", error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    recordCount.value = data.length;
    return records.value;
  }

  async function fetchRecordsByClassRecordId(classRecordId: number) {
    const { data, error } = await supabase
      .from("records")
      .select("*,students(firstname, lastname)")
      .eq("class_record_id", classRecordId);

    if (error) {
      console.error("Error fetching records:", error);
      records.value = [];
      return null;
    }

    records.value = data as Record[];
    return records.value;
  }

  async function addRecordsForSection(
    sectionId: number,
    classRecordId: number,
    subjectTitle?: string // Add optional parameter for subject title
  ) {
    const { data: students, error } = await supabase
      .from("students")
      .select("*")
      .eq("section_id", sectionId);

    if (error) {
      console.error("Error fetching students for section:", error);
      return null;
    }

    // Use the provided subjectTitle or fall back to localStorage
    const subjectName = subjectTitle || localStorage.getItem("selectedSubjectName");
    const subjectTopics = topicsData.find(
      (subject) => subject.subject === subjectName
    )?.topics || [];
    
    console.log(`Found ${subjectTopics.length} topics for subject ${subjectName}`);

    const getRandomScore = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const records: Record[] = students.map((student: any) => {
      // Create a base record with all topic fields set to null initially
      const record: Record = {
        student_id: student.id,
        topic1: null,
        topic2: null,
        topic3: null,
        topic4: null,
        topic5: null,
        pt1: getRandomScore(50, 100),
        pt2: getRandomScore(50, 100),
        pt3: getRandomScore(70, 100),
        pt4: getRandomScore(50, 100),
        pt5: getRandomScore(70, 100),
        pt6: getRandomScore(20, 100),
        pt7: getRandomScore(70, 100),
        pt8: getRandomScore(70, 100),
        pt9: getRandomScore(50, 100),
        pt10: getRandomScore(50, 100),
        qa1: getRandomScore(50, 100),
        class_record_id: classRecordId,
      };

      // Only populate topic fields based on the available topics
      for (let i = 0; i < Math.min(5, subjectTopics.length); i++) {
        const topicKey = `topic${i + 1}` as keyof Record;
        if (subjectTopics[i]) {
          record[topicKey] = getRandomScore(50, 100);
        }
      }

      return record;
    });

    const { error: insertError } = await supabase
      .from("records")
      .insert(records);

    if (insertError) {
      console.error("Error adding records:", insertError);
      return null;
    }

    return records;
  }

  async function fetchInitialGradeByStudentId(
    studentId: number,
    classRecordId: number
  ) {
    const { data, error } = await supabase
      .from("records")
      .select("initial_grade")
      .eq("student_id", studentId)
      .eq("class_record_id", classRecordId);

    if (error) {
      console.error("Error fetching initial grade:", error);
      return null;
    }

    return data?.[0]?.initial_grade || 0; // Return the initial grade from the first index
  }

  async function countMissedActivities() {
    const { data, error } = await supabase.from("records").select("*");

    if (error) {
      console.error("Error fetching records:", error);
      return null;
    }

    const columnsToCheck = [
      "topic1",
      "topic2",
      "topic3",
      "topic4",
      "topic5",
     
      "pt1",
      "pt2",
      "pt3",
      "pt4",
      "pt5",
      "pt6",
      "pt7",
      "pt8",
      "pt9",
      "pt10",
      "qa1",
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

    // console.log(missedActivities);
    return missedActivities;
  }

  async function countPassedStudents() {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .gte("initial_grade", 75);

    if (error) {
      console.error("Error fetching passed students:", error);
      return 0;
    }

    return data.length;
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
    countPassedStudents,
  };
});
