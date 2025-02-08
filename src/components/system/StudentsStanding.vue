<template>
  <v-card elevation="8" class="mb-6">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="font-weight-bold">Student Standing</h2>
          <v-divider class="mb-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="student in studentStanding"
          :key="student.name"
          cols="12"
          md="4"
        >
          <v-card class="pa-3" outlined>
            <v-row align="center" justify="space-between">
              <span class="font-weight-bold">{{ student.name }}</span>
              <v-chip :color="getColor(student.score)" dark
                >{{ student.score }}%</v-chip
              >
            </v-row>
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
      studentStanding: [
        { name: "OMLANG", score: 87 },
        { name: "BASLOT", score: 79 },
        { name: "MIRAL", score: 78 },
        { name: "NATOY", score: 76 },
        { name: "AUDREY", score: 74 },
        { name: "YANG", score: 73 },
      ],
    };
  },
  methods: {
    getColor(score) {
      if (score >= 85) return "green";
      if (score >= 75) return "orange";
      return "red";
    },
  },
};
</script>

<style scoped>
h2 {
  color: #3f51b5;
}
</style>
