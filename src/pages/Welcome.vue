<template>
  <v-container fluid class="welcome-container">
    <!-- Navigation -->
    <v-app-bar flat class="nav-bar">
      <v-container class="d-flex align-center justify-space-between">
        <h2 class="logo">Performance Monitoring System</h2>
        <v-btn variant="outlined" class="contact-btn">Contact Us</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Hero Section -->
    <v-container class="hero d-flex align-center justify-space-between">
      <div class="hero-content">
        <h1 class="text-h3 font-weight-bold">
          Welcome to the
          <span class="highlight">Performance Monitoring System</span>
        </h1>
        <p class="text-subtitle-1 mt-2">
          This system helps track student progress, monitor daily activities,
          and determine pass/fail status efficiently.
        </p>
        <v-btn class="primary-btn mt-4" @click="showDialog = true">
          Provide Extra Information
        </v-btn>
        <router-link to="/home">
          <v-btn variant="outlined" class="outline-btn mt-4 ml-2"
            >Skip & Continue</v-btn
          >
        </router-link>
      </div>
      <div class="hero-image">
        <v-img
          src="https://source.unsplash.com/500x350/?technology,students"
          class="rounded-lg"
        ></v-img>
      </div>
    </v-container>

    <!-- Extra Information Dialog -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card class="dialog-box">
        <v-card-title class="text-h5">Complete Your Profile</v-card-title>
        <v-card-text>
          <p>We need some extra details to personalize your experience.</p>
          <v-text-field
            label="Full Name"
            v-model="extraInfo.name"
            outlined
          ></v-text-field>
          <v-text-field
            label="Contact Number"
            v-model="extraInfo.contact"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="outline-btn" @click="showDialog = false">Skip</v-btn>
          <v-btn class="primary-btn" @click="saveExtraInfo">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const showDialog = ref(false);
const extraInfo = ref({ name: "", contact: "" });

const saveExtraInfo = () => {
  console.log("Saving Extra Info:", extraInfo.value);
  showDialog.value = false;
};
</script>

<style lang="scss" scoped>
/* Background - Full Page */
.welcome-container {
  background: linear-gradient(
    to bottom,
    #004d40,
    #00695c
  ); /* teal-darken-4 to teal-darken-3 */
  color: #e0f2f1; /* teal-lighten-5 */
  min-height: 100vh;
  padding-top: 80px;
}

/* Navigation */
.nav-bar {
  background: transparent;
  padding: 15px 0;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #e0f2f1; /* teal-lighten-5 */
}

/* Buttons */
.primary-btn {
  background-color: #009688; /* teal */
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #00897b; /* teal-darken-1 */
  }
}
.outline-btn {
  border-color: #00bfa5; /* teal-accent-4 */
  color: #00bfa5;
  &:hover {
    border-color: #26a69a; /* teal-lighten-1 */
    color: #26a69a;
  }
}
.contact-btn {
  border-color: #b2dfdb; /* teal-lighten-4 */
  color: #b2dfdb;
  &:hover {
    border-color: #80cbc4; /* teal-lighten-3 */
    color: #80cbc4;
  }
}

/* Hero Section */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
}
.hero-content {
  max-width: 50%;
}
.hero-image {
  max-width: 50%;
}
.highlight {
  color: #00bfa5; /* teal-accent-4 */
}

/* Dialog Box */
.dialog-box {
  background-color: #004d40; /* teal-darken-4 */
  color: #e0f2f1; /* teal-lighten-5 */
}
</style>
