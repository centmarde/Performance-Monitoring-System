<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card class="glass-card pa-3 rounded-card" elevation="2">
          <v-select
            :items="sections"
            item-title="code"
            item-value="code"
            label="Select Section"
            v-model="selectedSection"
            prepend-inner-icon="mdi-account-group"
          >
          </v-select>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="glass-card pa-3 rounded-card" elevation="2">
          <v-select
            :items="subjects"
            item-title="title"
            item-value="id"
            label="Select Subject"
            v-model="selectedSubject"
            :disabled="!selectedSection"
            prepend-inner-icon="mdi-book-open-variant"
          >
          </v-select>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Section Performance Analysis</v-card-title
          >
          <v-card-text>
            <div id="sectionChart" style="width: 100%; height: 400px"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Performance Statistics</v-card-title
          >
          <v-card-text>
            <div class="d-flex justify-space-around">
              <div class="text-center">
                <div class="text-h6">{{ statsData.passingCount }}</div>
                <div class="text-subtitle-1">Passing</div>
              </div>
              <div class="text-center">
                <div class="text-h6">{{ statsData.failingCount }}</div>
                <div class="text-subtitle-1">Failing</div>
              </div>
              <div class="text-center">
                <div class="text-h6">
                  {{ statsData.averageGrade.toFixed(2) }}
                </div>
                <div class="text-subtitle-1">Class Average</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Subject Failing Rate</v-card-title
          >
          <v-card-text>
            <div
              id="subjectFailRateChart"
              style="width: 100%; height: 300px"
            ></div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Section Performance Distribution</v-card-title
          >
          <v-card-text>
            <div
              id="sectionFailRateChart"
              style="width: 100%; height: 300px"
            ></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Subject Analysis</v-card-title
          >
          <v-card-text>
            <div
              v-if="subjectAnalysis"
              class="analysis-text"
              v-html="subjectAnalysis"
            ></div>
            <v-progress-circular
              v-else-if="isLoadingSubjectAnalysis"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="glass-card pa-4 rounded-card" elevation="3">
          <v-card-title class="font-semibold text-lg"
            >Section Analysis</v-card-title
          >
          <v-card-text>
            <div
              v-if="sectionAnalysis"
              class="analysis-text"
              v-html="sectionAnalysis"
            ></div>
            <v-progress-circular
              v-else-if="isLoadingSectionAnalysis"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import * as echarts from "echarts";
import { usePerformanceAnalytics } from "@/composables/performanceAnalytics";

const sections = ref([]);
const subjects = ref([]);
const selectedSection = ref(null);
const selectedSubject = ref(null);
const sectionData = ref([]);
const statsData = ref({
  passingCount: 0,
  failingCount: 0,
  averageGrade: 0,
});

const {
  subjectAnalysis,
  sectionAnalysis,
  analyzeSubjectPerformance,
  analyzeSectionDistribution,
} = usePerformanceAnalytics();
const isLoadingSubjectAnalysis = ref(false);
const isLoadingSectionAnalysis = ref(false);

const fetchSections = async () => {
  const { data, error } = await supabase.from("sections").select("code, id");
  if (!error) sections.value = data;
};

const fetchSubjects = async (sectionCode) => {
  const section = sections.value.find((sec) => sec.code === sectionCode);
  if (!section) return;

  const { data, error } = await supabase
    .from("class_record")
    .select(
      `
      subjects (
        id,
        title
      )
    `
    )
    .eq("section_id", section.id);

  if (!error && data) {
    const uniqueSubjects = [
      ...new Set(data.map((record) => record.subjects).filter(Boolean)),
    ];
    subjects.value = uniqueSubjects;
  }
};

const fetchSectionData = async () => {
  const section = sections.value.find(
    (sec) => sec.code === selectedSection.value
  );
  if (!section || !selectedSubject.value) return;

  const { data: classRecord } = await supabase
    .from("class_record")
    .select("id")
    .eq("section_id", section.id)
    .eq("subject_id", selectedSubject.value)
    .single();

  if (classRecord) {
    const { data: records } = await supabase
      .from("records")
      .select(
        `
        student_id,
        initial_grade,
        students (
          firstname,
          lastname
        )
      `
      )
      .eq("class_record_id", classRecord.id);

    if (records) {
      sectionData.value = records.map((record) => ({
        name: `${record.students.firstname} ${record.students.lastname}`,
        grade: record.initial_grade || 0,
      }));
      updateChart();
      calculateStats();
      updateSubjectFailRateChart();
      updateSectionFailRateChart();
    }
  }
};

const calculateStats = () => {
  const grades = sectionData.value.map((student) => student.grade);
  statsData.value = {
    passingCount: grades.filter((grade) => grade >= 75).length,
    failingCount: grades.filter((grade) => grade < 75).length,
    averageGrade:
      grades.reduce((sum, grade) => sum + grade, 0) / grades.length || 0,
  };
};

const updateChart = () => {
  const chartDom = document.getElementById("sectionChart");
  const myChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: sectionData.value.map((student) => student.name),
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
    },
    series: [
      {
        name: "Grade",
        type: "bar",
        data: sectionData.value.map((student) => ({
          value: student.grade,
          itemStyle: {
            color: student.grade >= 75 ? "#4CAF50" : "#FF5252",
          },
        })),
        label: {
          show: true,
          position: "top",
        },
      },
    ],
  };

  myChart.setOption(option);
};

const updateSubjectFailRateChart = async () => {
  const chartDom = document.getElementById("subjectFailRateChart");
  const myChart = echarts.init(chartDom);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Subject Performance",
        type: "pie",
        radius: "70%",
        data: [
          {
            value: statsData.value.failingCount,
            name: "Failing",
            itemStyle: { color: "#FF5252" },
          },
          {
            value: statsData.value.passingCount,
            name: "Passing",
            itemStyle: { color: "#4CAF50" },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  myChart.setOption(option);

  // Add analytics
  isLoadingSubjectAnalysis.value = true;
  await analyzeSubjectPerformance(
    {
      passingCount: statsData.value.passingCount,
      failingCount: statsData.value.failingCount,
      averageGrade: statsData.value.averageGrade,
    },
    subjects.value.find((s) => s.id === selectedSubject.value)?.title || ""
  );
  isLoadingSubjectAnalysis.value = false;
};

const updateSectionFailRateChart = async () => {
  const chartDom = document.getElementById("sectionFailRateChart");

  // Check if a chart instance already exists and dispose of it
  if (chartDom) {
    echarts.dispose(chartDom);
  }

  const myChart = echarts.init(chartDom);

  const total = sectionData.value.length;
  const excellentCount = sectionData.value.filter((s) => s.grade >= 90).length;
  const goodCount = sectionData.value.filter(
    (s) => s.grade >= 80 && s.grade < 90
  ).length;
  const averageCount = sectionData.value.filter(
    (s) => s.grade >= 75 && s.grade < 80
  ).length;
  const failingCount = sectionData.value.filter((s) => s.grade < 75).length;

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Section Performance",
        type: "pie",
        radius: "70%",
        data: [
          {
            value: excellentCount,
            name: "Excellent (90-100)",
            itemStyle: { color: "#4CAF50" },
          },
          {
            value: goodCount,
            name: "Good (80-89)",
            itemStyle: { color: "#2196F3" },
          },
          {
            value: averageCount,
            name: "Average (75-79)",
            itemStyle: { color: "#FFC107" },
          },
          {
            value: failingCount,
            name: "Failing (<75)",
            itemStyle: { color: "#FF5252" },
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  myChart.setOption(option);

  // Add analytics
  isLoadingSectionAnalysis.value = true;
  await analyzeSectionDistribution(
    { excellentCount, goodCount, averageCount, failingCount },
    selectedSection.value
  );
  isLoadingSectionAnalysis.value = false;
};

watch(selectedSection, (newValue) => {
  if (newValue) {
    fetchSubjects(newValue);
    selectedSubject.value = null;
  }
});

watch([selectedSection, selectedSubject], ([newSection, newSubject]) => {
  if (newSection && newSubject) {
    fetchSectionData();
  }
});

onMounted(() => {
  fetchSections();
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
.analysis-text {
  white-space: pre-line;
  line-height: 1.5;
  font-size: 0.9rem;
  :deep(br) {
    margin-bottom: 0.5em;
  }
}
</style>
