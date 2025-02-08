<template>
  <v-card elevation="8" class="mb-6">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="font-weight-bold">Students' Standing</h2>
          <v-divider class="mb-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(students, subject) in studentStanding"
          :key="subject"
          cols="12"
          md="4"
        >
          <v-card class="pa-3" outlined>
            <h3 class="text-center font-weight-bold">{{ subject }}</h3>
            <v-divider class="mb-2"></v-divider>
            <v-row
              v-for="student in students"
              :key="student.name"
              align="center"
              justify="space-between"
            >
              <span class="font-weight-bold">{{ student.name }}</span>
              <v-chip :color="getColor(student.score)" dark
                >{{ student.score }}%</v-chip
              >
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Bar Chart -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <h3 class="text-center font-weight-bold">Grade Distribution</h3>
            <v-chart :option="chartOptions" style="height: 400px"></v-chart>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";
import VChart from "vue-echarts";

use([BarChart, CanvasRenderer, GridComponent]);

// Define TypeScript interfaces
interface Student {
  name: string;
  score: number;
}

export default defineComponent({
  components: { VChart },
  setup() {
    const studentStanding = reactive<Record<string, Student[]>>({
      TEST: [
        { name: "OMLANG", score: 87 },
        { name: "BASLOT", score: 79 },
        { name: "MIRAL", score: 78 },
      ],
      "ENGLISH - ED2": [
        { name: "NATOY", score: 76 },
        { name: "AUDREY", score: 74 },
        { name: "YANG", score: 73 },
      ],
      "ENGLISH - DE1": [
        { name: "YANG", score: 85 },
        { name: "YANG", score: 88 },
        { name: "YANG", score: 90 },
      ],
    });

    const chartOptions = reactive({
      xAxis: {
        type: "category",
        data: Object.keys(studentStanding),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: Object.values(studentStanding).map(
            (students) =>
              students.reduce((acc, student) => acc + student.score, 0) /
              students.length
          ),
          type: "bar",
          color: "#3f51b5",
        },
      ],
    });

    function getColor(score: number): string {
      if (score >= 85) return "green";
      if (score >= 75) return "orange";
      return "red";
    }

    return { studentStanding, chartOptions, getColor };
  },
});
</script>

<style scoped>
h2 {
  color: #3f51b5;
}
h3 {
  color: #000;
}
</style>
