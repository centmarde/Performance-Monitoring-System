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
          <div>
            {{ subjectName }}
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
  </v-container>
</template>

<script>
import { supabase } from "@/lib/supabase";
import { defineComponent, ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import { useGroqChat } from "@/composables/bootstrap";
import { useRoute } from "vue-router";
import axios from "axios";

export default defineComponent({
  setup() {
    const route = useRoute();
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
    const subjectName = ref("");
    const topicNames = ref([]);
    const topicIds = ref({});

    const { chatContent, startChat } = useGroqChat();

    // Fetch topic names for a given subject
    const fetchTopicNames = async (subjectName) => {
      try {
        // First, try to fetch topics from Supabase
        const { data: supabaseTopics, error: supabaseError } = await supabase
          .from('topics')
          .select('title')
          .order('id', { ascending: true })
          .limit(5);
        
        // If Supabase fetch was successful and returned topics
        if (!supabaseError && supabaseTopics && supabaseTopics.length > 0) {
          console.log('Topics fetched from Supabase:', supabaseTopics);
          // Extract topic titles from the fetched data
          topicNames.value = supabaseTopics.map(topic => topic.title);
          
          // Fill with empty strings if less than 5 topics
          while (topicNames.value.length < 5) {
            topicNames.value.push("");
          }
          return topicNames.value;
        } 
        
        // Fallback: If Supabase fetch failed or returned no topics, try the local JSON file
        console.warn('Falling back to local JSON file for topics');
        const response = await axios.get('/data/topics.json');
        const subjects = response.data;
        
        // Find the subject that matches
        const subject = subjects.find(s => 
          s.subject.toLowerCase() === subjectName.toLowerCase());
        
        if (subject && subject.topics) {
          topicNames.value = subject.topics.slice(0, 5); // Get up to 5 topics
          // Fill with empty strings if less than 5 topics
          while (topicNames.value.length < 5) {
            topicNames.value.push("");
          }
          return topicNames.value;
        } else {
          console.warn(`Subject "${subjectName}" not found in topics.json`);
          return ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"];
        }
      } catch (error) {
        console.error("Error fetching topic names:", error);
        return ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"];
      }
    };

    // Add watch effect for studentRecord
    watch(studentRecord, async (newValue) => {
      if (newValue) {
        chatContent.value = ""; // Reset chat content
        
        // Start chat with topic names
        if (subjectName.value) {
          // Use topicNames from route if available, otherwise fetch them
          if (topicNames.value.length === 0) {
            const topics = await fetchTopicNames(subjectName.value);
            startChat(studentRecord.value, selectedStudent.value, topics);
          } else {
            startChat(studentRecord.value, selectedStudent.value, topicNames.value);
          }
        } else {
          startChat(studentRecord.value, selectedStudent.value);
        }
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

      // Fetch subjects and their quarters from class_record
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
        // Group quarters by subject
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

        // Convert to array and sort quarters
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
          console.log(availableSubjects.value[0]);
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
      console.log(selectedStudent.value);
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
            " topic1, topic2, topic3, topic4, topic5, pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt10, qa1, initial_grade"
          )
          .eq("student_id", student.id)
          .eq("class_record_id", classRecord.id)
          .single();

        if (!error) {
          studentRecord.value = data;
          isFailing.value = studentRecord.value.initial_grade < 75;
          
          if (selectedSubject.value && selectedSubject.value.title) {
            subjectName.value = selectedSubject.value.title;
            await fetchTopicNames(selectedSubject.value.title);
          }
          
          updateChart();
        }
      }
    };

    const updateChart = async () => {
      if (!studentRecord.value) return;

      // Ensure we have topic names
      if (subjectName.value && topicNames.value.length === 0) {
        await fetchTopicNames(subjectName.value);
      }

      const chartDom = document.getElementById("chart");
      const myChart = echarts.init(chartDom);
      
      // Prepare data for chart
      const chartData = [];
      const labels = [];
      
      // Add topics with their actual names
      for (let i = 1; i <= 5; i++) {
        const topicKey = `topic${i}`;
        if (studentRecord.value[topicKey] !== undefined) {
          chartData.push(studentRecord.value[topicKey]);
          // Use the provided topic names if available
          labels.push(topicNames.value[i-1] || `Topic ${i}`);
        }
      }
      
      // Add PT items
      for (let i = 1; i <= 10; i++) {
        const ptKey = `pt${i}`;
        if (studentRecord.value[ptKey] !== undefined) {
          chartData.push(studentRecord.value[ptKey]);
          labels.push(`PT${i}`);
        }
      }
      
      // Add QA
      if (studentRecord.value.qa1 !== undefined) {
        chartData.push(studentRecord.value.qa1);
        labels.push("QA");
      }

      const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        xAxis: {
          type: "category",
          data: labels,
          axisLabel: {
            interval: 0,
            rotate: 45,
            textStyle: {
              fontSize: 10
            }
          }
        },
        yAxis: { 
          type: "value",
          min: 0,
          max: 100
        },
        series: [
          {
            type: "bar",
            data: chartData,
            itemStyle: {
              color: (params) => {
                const value = params.data;
                if (value < 75) return "#FF0000"; // Red for below 75%
                if (value <= 80) return "#FFD700"; // Yellow for 76-80%
                return "#2E7D6F"; // Original color for above 80%
              },
            },
          },
        ],
      };

      myChart.setOption(option);
    };

    watch(selectedSection, fetchStudents);
    watch(selectedStudent, fetchSubjects);
    onMounted(async () => {
      await fetchSections();

      // Parse the topic names from route
      try {
        if (route.query.topicNames) {
          topicNames.value = JSON.parse(route.query.topicNames);
          console.log('Topic names from route:', topicNames.value);
        }
      } catch (error) {
        console.error('Error parsing topic names:', error);
      }
      
      // Parse the topic IDs map from route
      try {
        if (route.query.topicIds) {
          topicIds.value = JSON.parse(route.query.topicIds);
          console.log('Topic ID mappings from route:', topicIds.value);
        }
      } catch (error) {
        console.error('Error parsing topic IDs:', error);
      }

      // Set the values from route query if they exist
      if (route.query.section) {
        selectedSection.value = route.query.section;
        await fetchStudents(selectedSection.value);
      }

      if (route.query.name) {
        selectedStudent.value = route.query.name;
      }

      // Get subject name from localStorage or route
      const storedSubjectName = localStorage.getItem("selectedSubjectName");
      if (storedSubjectName) {
        subjectName.value = storedSubjectName;
        // Only fetch topics if we don't already have them from the route
        if (topicNames.value.length === 0) {
          await fetchTopicNames(storedSubjectName);
        }
      }

      // Handle subject and quarter selection automatically
      if (route.query.subject && route.query.quarter) {
        selectedSubject.value = {
          id: parseInt(route.query.subject),
          title: storedSubjectName || route.query.subject,
        };
        selectedQuarter.value = parseInt(route.query.quarter);
        fetchStudentRecord(selectedStudent.value);
      }
    });

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
      subjectName,
      topicNames,
      topicIds,
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
