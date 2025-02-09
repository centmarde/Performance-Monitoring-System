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
          v-for="activity in missedActivities"
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

<script>
import { defineComponent, ref } from "vue";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent } from "echarts/components";
import VChart from "vue-echarts";

use([BarChart, CanvasRenderer, GridComponent]);

export default defineComponent({
  components: { VChart },
  setup() {
    const maxMissed = ref(10); // Maximum number of students missing an activity

    const missedActivities = ref([
      { subject: "English 8 - DE1", missed: 10 },
      { subject: "Mapeh 8 - FG2", missed: 6 },
      { subject: "English 7 - ED2", missed: 3 },
    ]);

    const studentStanding = ref({
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

    const chartOptions = ref({
      xAxis: {
        type: "category",
        data: Object.keys(studentStanding.value),
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: Object.values(studentStanding.value).map(
            (students) =>
              students.reduce((acc, student) => acc + student.score, 0) /
              students.length
          ),
          type: "bar",
          color: "#3f51b5",
        },
      ],
    });

    function getMissedColor(missed) {
      if (missed >= 10) return "red"; // High risk
      if (missed >= 6) return "orange"; // Moderate risk
      return "green"; // Low risk
    }

    return { missedActivities, chartOptions, getMissedColor, maxMissed };
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
