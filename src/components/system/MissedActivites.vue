<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card class="pa-3 rounded-card glass-card">
          <h4 class="font-weight-bold text-end">
            <span class="mdi mdi-account-school"></span> Missed Activities
          </h4>
        </v-card>
      </v-col>
    </v-row>

    <!-- Apply Transition to the Entire v-row -->
    <v-scale-transition mode="out-in">
      <v-row :key="currentPage">
        <v-col
          v-for="(activity, index) in paginatedActivities"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card class="pa-3 activity-box">
            <p
              class="font-weight-bold"
              :style="{ color: getMissedColor(activity.missed) }"
            >
              {{ activity.missed }} Students
            </p>
            <p class="mt-2 font-weight-bold">{{ activity.subject }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-scale-transition>

    <!-- Pagination -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
      class="mt-4"
    ></v-pagination>

    <!-- Grade Distribution Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 grade-chart">
          <h3 class="text-center font-weight-bold">
            Missed Activities Overview
          </h3>
          <v-chart
            :option="chartOptions"
            style="height: 300px"
            key="currentPage"
          ></v-chart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import "echarts";
import VChart from "vue-echarts";

export default defineComponent({
  components: { VChart },
  setup() {
    const totalStudents = 100; // Example total student count

    const missedActivities = ref([
      { subject: "English 8 - DE1", missed: 45 },
      { subject: "Mapeh 8 - FG2", missed: 30 },
      { subject: "English 7 - ED2", missed: 20 },
      { subject: "English 9 - ED3", missed: 15 },
      { subject: "Math 3 - ED6", missed: 4 },
      { subject: "Programming 9 - FG1", missed: 3 },
    ]);

    const currentPage = ref(1);
    const itemsPerPage = 3;

    const totalPages = computed(() =>
      Math.ceil(missedActivities.value.length / itemsPerPage)
    );

    const paginatedActivities = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return missedActivities.value.slice(start, start + itemsPerPage);
    });

    function getMissedColor(missed) {
      if (missed >= 40) return "#F44336";
      if (missed >= 20) return "#FFC107";
      return "#4CAF50";
    }

    // Grade Distribution Chart Data
    const chartOptions = computed(() => {
      const subjects = paginatedActivities.value.map(
        (activity) => activity.subject
      );
      const missedPercentages = paginatedActivities.value.map(
        (activity) => ((activity.missed / totalStudents) * 100).toFixed(2) // Keep 2 decimal places
      );

      return {
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: subjects },
        yAxis: { type: "value", axisLabel: { formatter: "{value}%" } },
        series: [
          {
            name: "Missed Percentage",
            type: "bar",
            data: missedPercentages,
            color: "#004D40",
            label: {
              show: true,
              position: "top",
              fontWeight: "bold",
              formatter: "{c}%", // Ensures correct percentage formatting
            },
          },
        ],
      };
    });

    return {
      missedActivities,
      paginatedActivities,
      getMissedColor,
      currentPage,
      totalPages,
      chartOptions,
      totalStudents,
    };
  },
});
</script>

<style scoped>
.theme-card {
  background-color: var(--v-background-base);
  color: var(--v-text-base);
  padding: 20px;
}

.activity-box {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5); /* Border to enhance glass effect */
  backdrop-filter: blur(10px); /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  box-shadow: 0 0 10px #004d40; /* Glowing effect */
  text-align: center;
}

.grade-chart {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5); /* Border to enhance glass effect */
  backdrop-filter: blur(10px); /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  box-shadow: 0 0 10px #004d40; /* Glowing effect */
}

:root {
  --v-background-base: #ffffff;
  --v-text-base: #000000;
  --card-gradient-start: #e0e0e0;
  --card-gradient-end: #bdbdbd;
}

@media (prefers-color-scheme: dark) {
  :root {
    --v-background-base: #121212;
    --v-text-base: #ffffff;
    --card-gradient-start: #323232;
    --card-gradient-end: #1e1e1e;
  }
}

.rounded-card {
  border-radius: 12px;
}

.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
