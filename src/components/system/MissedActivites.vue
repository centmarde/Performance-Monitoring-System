<template>
  <v-card elevation="8">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="font-weight-bold">Missed Activities</h2>
          <v-divider class="mb-4"></v-divider>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="activity in paginatedActivities"
          :key="activity.subject"
          cols="12"
          md="4"
          class="text-center"
        >
          <v-card class="pa-3" outlined>
            <!-- Progress Circular with Dynamic Color -->
            <v-progress-circular
              :size="100"
              :width="10"
              :value="(activity.missed / maxMissed) * 100"
              :color="getMissedColor(activity.missed)"
              class="my-2"
            >
              <span
                :style="{
                  color: getMissedColor(activity.missed),
                  fontWeight: 'bold',
                }"
              >
                {{ activity.missed }} Students
              </span>
            </v-progress-circular>
            <p class="mt-2 font-weight-bold">{{ activity.subject }}</p>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination Controls -->
      <v-row justify="center" class="mt-4">
        <v-btn @click="prevPage" :disabled="currentPage === 1"> Prev </v-btn>
        <span class="mx-3 mt-1 font-weight-bold"
          >Page {{ currentPage }} of {{ totalPages }}</span
        >
        <v-btn @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </v-btn>
      </v-row>

      <!-- Grade Distribution Graph -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <h3 class="text-center font-weight-bold">Grade Distribution</h3>
            <VChart :option="chartOptions" style="height: 400px"></VChart>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";

use([BarChart, CanvasRenderer, GridComponent, TooltipComponent]);

export default defineComponent({
  components: { VChart },
  setup() {
    const maxMissed = ref(10); // Maximum number of students missing an activity

    const missedActivities = ref([
      { subject: "English 8 - DE1", missed: 10 },
      { subject: "Mapeh 8 - FG2", missed: 6 },
      { subject: "English 7 - ED2", missed: 3 },
      { subject: "Science 8", missed: 7 },
      { subject: "Math 7", missed: 5 },
      { subject: "History 9", missed: 8 },
    ]);

    const studentStanding = ref({
      "English 8 - DE1": [
        { name: "Student A", score: 85 },
        { name: "Student B", score: 78 },
        { name: "Student C", score: 92 },
      ],
      "Mapeh 8 - FG2": [
        { name: "Student D", score: 60 },
        { name: "Student E", score: 75 },
        { name: "Student F", score: 80 },
      ],
      "English 7 - ED2": [
        { name: "Student G", score: 70 },
        { name: "Student H", score: 65 },
        { name: "Student I", score: 72 },
      ],
    });

    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = 3;

    const totalPages = computed(() =>
      Math.ceil(missedActivities.value.length / itemsPerPage)
    );

    const paginatedActivities = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return missedActivities.value.slice(start, start + itemsPerPage);
    });

    function prevPage() {
      if (currentPage.value > 1) currentPage.value--;
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) currentPage.value++;
    }

    function getMissedColor(missed: number): string {
      if (missed >= 10) return "red"; // High risk
      if (missed >= 6) return "orange"; // Moderate risk
      return "green"; // Low risk
    }

    // Compute Grade Distribution Data
    const chartOptions = computed(() => {
      const subjects = Object.keys(studentStanding.value);
      const averageScores = subjects.map((subject) => {
        const students = studentStanding.value[subject];
        if (!students || students.length === 0) return 0;
        return (
          students.reduce((acc, student) => acc + student.score, 0) /
          students.length
        );
      });

      return {
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: subjects, axisLabel: { rotate: 25 } },
        yAxis: { type: "value", min: 50, max: 100 },
        series: [
          {
            name: "Average Score",
            data: averageScores,
            type: "bar",
            color: "#3f51b5",
            label: { show: true, position: "top", fontWeight: "bold" },
          },
        ],
      };
    });

    return {
      missedActivities,
      paginatedActivities,
      maxMissed,
      getMissedColor,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      chartOptions,
    };
  },
});
</script>

<style scoped>
h2 {
  color: #e53935;
}
h3 {
  color: #000;
}
</style>
