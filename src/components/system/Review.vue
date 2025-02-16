<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card class="glass-card pa-3 rounded-card" elevation="2">
          <v-select
            :items="sections"
            item-title="code"
            item-value="code"
            label="Select Section"
            v-model="selectedSection"
          ></v-select>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card class="glass-card pa-3 rounded-card" elevation="2">
          <v-select
            :items="students"
            item-title="fullName"
            item-value="fullName"
            label="Select Student"
            v-model="selectedStudent"
            :disabled="!selectedSection"
          ></v-select>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          class="glass-card fixed-width-card pa-1 rounded-card"
          elevation="2"
        >
          <div v-if="selectedSubject">Subject: {{ selectedSubject.title }}</div>
          <div v-if="studentRecord">
            <div>Initial Grade: {{ studentRecord.initial_grade }}</div>
            <div v-if="isFailing">Status: Failing</div>
            <div v-else>Status: Passing</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Advice for Teacher</v-card-title
          >
          <v-card-text v-html="chatContent"></v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Student Performance Chart</v-card-title>
          <v-card-text>
            <div id="chart" style="width: 100%; height: 400px"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { supabase } from "@/lib/supabase";
import { defineComponent, ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { useGroqChat } from "@/composables/bootstrap";

interface Section {
  code: string;
  id: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  sectionId: string;
}

interface Subject {
  title: string;
}

interface StudentRecord {
  initial_grade: number;
  quarterly_grade: number;
  ww1: number;
  ww2: number;
  ww3: number;
  ww4: number;
  ww5: number;
  ww6: number;
  ww7: number;
  ww8: number;
  ww9: number;
  ww10: number;
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
}

export default defineComponent({
  setup() {
    const sections = ref<Section[]>([]);
    const students = ref<Student[]>([]);
    const selectedSection = ref<string | null>(null);
    const selectedStudent = ref<string | null>(null);
    const selectedSubject = ref<Subject | null>(null);
    const studentRecord = ref<StudentRecord | null>(null);
    const isFailing = ref<boolean>(false);
    const chartOptions = ref<any>(null);

    const { chatContent, startChat } = useGroqChat();

    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("code, id");
      if (error) {
        console.error(error);
      } else {
        sections.value = data as Section[];
      }
    };

    const fetchStudents = async (sectionCode: string) => {
      students.value = []; // Clear previous students
      selectedStudent.value = null; // Reset selected student

      const section = sections.value.find((sec) => sec.code === sectionCode);
      if (!section) {
        console.error("Section not found");
        return;
      }

      const { data, error } = await supabase
        .from("students")
        .select("id, firstname, lastname, section_id")
        .eq("section_id", section.id);

      if (error) {
        console.error(error);
      } else {
        students.value = data.map((student: any) => ({
          id: student.id,
          firstName: student.firstname,
          lastName: student.lastname,
          fullName: `${student.firstname} ${student.lastname}`,
          sectionId: student.section_id,
        }));
      }
    };

    const fetchSubject = async (studentFullName: string) => {
      const student = students.value.find(
        (stu) => stu.fullName === studentFullName
      );
      if (!student) {
        console.error("Student not found");
        return;
      }

      const { data, error } = await supabase
        .from("sections")
        .select("subject_id")
        .eq("id", student.sectionId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      const subjectId = data.subject_id;
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("title")
        .eq("id", subjectId)
        .single();

      if (subjectError) {
        console.error(subjectError);
      } else {
        selectedSubject.value = subjectData as Subject;
      }
    };

    const fetchStudentRecord = async (studentFullName: string) => {
      const student = students.value.find(
        (stu) => stu.fullName === studentFullName
      );
      if (!student) {
        console.error("Student not found");
        return;
      }

      const { data, error } = await supabase
        .from("records")
        .select(
          "initial_grade, quarterly_grade, ww1, ww2, ww3, ww4, ww5, ww6, ww7, ww8, ww9, ww10, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, qa1"
        )
        .eq("student_id", student.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        studentRecord.value = data as StudentRecord;
        isFailing.value = studentRecord.value.initial_grade < 75;
        updateChart();
        startChat(studentRecord.value, studentFullName); // Pass studentRecord and studentFullName to startChat
      }
    };

    const updateChart = () => {
      if (!studentRecord.value) return;

      const chartDom = document.getElementById("chart")!;
      const myChart = echarts.init(chartDom);
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "WW1",
              "WW2",
              "WW3",
              "WW4",
              "WW5",
              "WW6",
              "WW7",
              "WW8",
              "WW9",
              "WW10",
              "PT1",
              "PT2",
              "PT3",
              "PT4",
              "PT5",
              "PT6",
              "PT7",
              "PT8",
              "PT9",
              "PT10",
              "QA1",
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0, // Adjust the interval of the x-axis labels
              rotate: 30, // Rotate the labels for better readability
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Written Works",
            type: "bar",
            barWidth: "60%",
            barGap: "10%", // Adjust the gap between bars
            data: [
              studentRecord.value.ww1,
              studentRecord.value.ww2,
              studentRecord.value.ww3,
              studentRecord.value.ww4,
              studentRecord.value.ww5,
              studentRecord.value.ww6,
              studentRecord.value.ww7,
              studentRecord.value.ww8,
              studentRecord.value.ww9,
              studentRecord.value.ww10,
              studentRecord.value.pt1,
              studentRecord.value.pt2,
              studentRecord.value.pt3,
              studentRecord.value.pt4,
              studentRecord.value.pt5,
              studentRecord.value.pt6,
              studentRecord.value.pt7,
              studentRecord.value.pt8,
              studentRecord.value.pt9,
              studentRecord.value.pt10,
              studentRecord.value.qa1,
            ],
            itemStyle: {
              color: "#004D40", // Set the bar color
            },
          },
        ],
      };

      option && myChart.setOption(option);
    };

    watch(selectedSection, (newSection) => {
      if (newSection) {
        fetchStudents(newSection);
      }
    });

    watch(selectedStudent, (newStudent) => {
      if (newStudent) {
        fetchSubject(newStudent);
        fetchStudentRecord(newStudent);
      }
    });

    onMounted(fetchSections);

    return {
      sections,
      students,
      selectedSection,
      selectedStudent,
      selectedSubject,
      studentRecord,
      isFailing,
      chartOptions,
      chatContent,
    };
  },
});
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.glass-card.dark {
  background: rgba(0, 0, 0, 0.2);
  color: white;
}

.fixed-width-card {
  height: 102px;
}
.rounded-card {
  border-radius: 16px;
}
</style>
