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
            <v-progress-circular
              :rotate="360"
              :size="100"
              :width="10"
              :value="activity.missed"
              :color="getMissedColor(activity.missed)"
            >
              {{ activity.missed }} Students
            </v-progress-circular>
            <p class="mt-2 font-weight-bold">{{ activity.subject }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      missedActivities: [
        { subject: "English 8 - DE1", missed: 10 },
        { subject: "Mapeh 8 - FG2", missed: 6 },
        { subject: "English 7 - ED2", missed: 3 },
      ],
    };
  },
  methods: {
    getMissedColor(missed) {
      if (missed >= 10) return "red";
      if (missed >= 5) return "orange";
      return "green";
    },
  },
};
</script>

<style scoped>
h2 {
  color: #e53935;
}
</style>
