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
          class="glass-card fixed-width-card pa-4 rounded-card"
          elevation="2"
        >
          <div
            v-if="selectedSubject"
            class="font-semibold text-center text-xl mb-2"
          >
            {{ selectedSubject.title }}
          </div>
          <div
            v-if="studentRecord"
            class="d-flex justify-space-between align-center"
          >
            <div>Initial Grade: {{ studentRecord.initial_grade }}</div>
            <v-chip
              :color="isFailing ? 'red lighten-3' : 'green lighten-3'"
              :text-color="isFailing ? 'red darken-3' : 'green darken-3'"
              class="font-bold"
              small
            >
              <span v-if="isFailing">Failing</span>
              <span v-else>Passing</span>
            </v-chip>
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
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Student Performance Chart</v-card-title
          >
          <v-card-text>
            <div id="chart" style="width: 100%; height: 400px"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showSubjectDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Select Subject and Quarter</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="subject in availableSubjects"
              :key="subject.id"
              class="mb-4"
            >
              <template v-slot:default>
                <v-list-item-title>{{ subject.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip-group>
                    <v-chip
                      v-for="quarter in subject.availableQuarters"
                      :key="quarter"
                      @click="selectSubjectAndQuarter(subject, quarter)"
                      class="ma-1"
                    >
                      Quarter {{ quarter }}
                    </v-chip>
                  </v-chip-group>
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { supabase } from "@/lib/supabase";
import { defineComponent, ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { useGroqChat } from "@/composables/bootstrap";

export default defineComponent({
  setup() {
    const sections = ref([]);
    const students = ref([]);
    const selectedSection = ref(null);
    const selectedStudent = ref(null);
    const selectedSubject = ref(null);
    const studentRecord = ref(null);
    const isFailing = ref(false);
    const showSubjectDialog = ref(false);
    const availableSubjects = ref([]);
    const selectedQuarter = ref(null);
    const availableQuarters = ref([]);

    const { chatContent, startChat } = useGroqChat();

    // Add watch effect for studentRecord
    watch(studentRecord, (newValue) => {
      if (newValue) {
        chatContent.value = ""; // Reset chat content
      }
    });

    const fetchSections = async () => {
      const { data, error } = await supabase
        .from("sections")
        .select("code, id");
      if (!error) sections.value = data;
    };

    const fetchStudents = async (sectionCode) => {
      students.value = [];
      selectedStudent.value = null;

      const section = sections.value.find((sec) => sec.code === sectionCode);
      if (!section) return;

      const { data, error } = await supabase
        .from("students")
        .select("id, firstname, lastname, section_id")
        .eq("section_id", section.id);

      if (!error) {
        students.value = data.map((student) => ({
          id: student.id,
          fullName: `${student.firstname} ${student.lastname}`,
          sectionId: student.section_id,
        }));
      }
    };

    const fetchSubjects = async (studentFullName) => {
      const student = students.value.find(
        (stu) => stu.fullName === studentFullName
      );
      if (!student) return;

      const { data: classRecords, error } = await supabase
        .from("class_record")
        .select(
          `
          quarter,
          subjects (
            id,
            title
          )
        `
        )
        .eq("section_id", student.sectionId);

      if (!error && classRecords) {
        const subjectQuartersMap = classRecords.reduce((acc, record) => {
          if (!record.subjects) return acc;

          if (!acc[record.subjects.id]) {
            acc[record.subjects.id] = {
              subject: record.subjects,
              quarters: [],
            };
          }
          acc[record.subjects.id].quarters.push(record.quarter);
          return acc;
        }, {});

        availableSubjects.value = Object.values(subjectQuartersMap).map(
          ({ subject, quarters }) => ({
            ...subject,
            availableQuarters: [...new Set(quarters)].sort((a, b) => a - b),
          })
        );

        if (
          availableSubjects.value.length === 1 &&
          availableSubjects.value[0].availableQuarters.length === 1
        ) {
          selectSubjectAndQuarter(
            availableSubjects.value[0],
            availableSubjects.value[0].availableQuarters[0]
          );
        } else {
          showSubjectDialog.value = true;
        }
      }
    };

    const selectSubjectAndQuarter = (subject, quarter) => {
      selectedSubject.value = subject;
      selectedQuarter.value = quarter;
      showSubjectDialog.value = false;
      fetchStudentRecord(selectedStudent.value);
    };

    const fetchStudentRecord = async (studentFullName) => {
      const student = students.value.find(
        (stu) => stu.fullName === studentFullName
      );
      if (!student || !selectedSubject.value || !selectedQuarter.value) return;

      const { data: classRecord, error: classError } = await supabase
        .from("class_record")
        .select("id")
        .eq("subject_id", selectedSubject.value.id)
        .eq("section_id", student.sectionId)
        .eq("quarter", selectedQuarter.value)
        .single();

      if (!classError) {
        const { data, error } = await supabase
          .from("records")
          .select(
            "initial_grade, ww1, ww2, ww3, ww4, ww5, ww6, ww7, ww8, ww9, ww10, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, qa1"
          )
          .eq("student_id", student.id)
          .eq("class_record_id", classRecord.id)
          .single();

        if (!error) {
          studentRecord.value = data;
          isFailing.value = studentRecord.value.initial_grade < 75;
          updateChart();
          startChat(studentRecord.value, studentFullName);
        }
      }
    };

    const updateChart = () => {
      if (!studentRecord.value) return;

      const chartDom = document.getElementById("chart");
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        xAxis: {
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
        },
        yAxis: { type: "value" },
        series: [
          {
            type: "bar",
            data: Object.values(studentRecord.value),
            itemStyle: { color: "#2E7D6F" },
          },
        ],
      };

      myChart.setOption(option);
    };

    watch(selectedSection, fetchStudents);
    watch(selectedStudent, fetchSubjects);
    onMounted(fetchSections);

    return {
      sections,
      students,
      selectedSection,
      selectedStudent,
      selectedSubject,
      studentRecord,
      isFailing,
      chatContent,
      showSubjectDialog,
      availableSubjects,
      selectSubjectAndQuarter,
      selectedQuarter,
      availableQuarters,
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
.fixed-width-card {
  height: 102px;
}
.rounded-card {
  border-radius: 16px;
}
</style>
