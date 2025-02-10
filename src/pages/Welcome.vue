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
    <v-container class="hero">
      <v-row align="center" justify="space-between">
        <v-col cols="12" md="6" class="hero-content">
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
            <v-btn variant="outlined" class="outline-btn mt-4 ml-2">
              Skip & Continue
            </v-btn>
          </router-link>
        </v-col>
        <v-col cols="12" md="5">
          <v-img
            src="@/assets/Hero.png"
            class="floating-img"
            width="100%"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>

    <!-- Extra Information Dialog -->
    <v-dialog v-model="showDialog" max-width="500">
      <v-card class="dialog-box">
        <v-card-title class="text-h5">Complete Your Profile</v-card-title>
        <v-card-text>
          <p>We need some extra details to personalize your experience.</p>

          <v-text-field
            label="First Name"
            v-model="extraInfo.firstName"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Last Name"
            v-model="extraInfo.lastName"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Phone Number"
            v-model="extraInfo.phone"
            outlined
            type="tel"
            required
          ></v-text-field>
          <v-textarea
            label="Complete Address"
            v-model="extraInfo.address"
            outlined
            required
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="outline-btn" @click="showDialog = false">Skip</v-btn>
          <v-btn class="primary-btn" @click="saveExtraInfo">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const showDialog = ref(false);

const extraInfo = ref({
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
});

const saveExtraInfo = () => {
  console.log("Saving Extra Info:", extraInfo.value);
  showDialog.value = false;
};

// Open dialog automatically when the page loads
onMounted(() => {
  showDialog.value = true;
});
</script>

<style lang="scss" scoped>
/* Background - Full Page */
.welcome-container {
  background: linear-gradient(to bottom, #004d40, #00695c);
  color: #e0f2f1;
  min-height: 100vh;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
}

/* Navigation */
.nav-bar {
  background: transparent;
  padding: 15px 0;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #e0f2f1;
}

/* Buttons */
.primary-btn {
  background-color: #009688;
  color: white;
  font-weight: bold;
  &:hover {
    background-color: #00897b;
  }
}
.outline-btn {
  border-color: #00bfa5;
  color: #00bfa5;
  &:hover {
    border-color: #26a69a;
    color: #26a69a;
  }
}
.contact-btn {
  border-color: #b2dfdb;
  color: #b2dfdb;
  &:hover {
    border-color: #80cbc4;
    color: #80cbc4;
  }
}

/* Hero Section */
.hero {
  flex-grow: 1;
}

.highlight {
  color: #00bfa5;
}

/* Dialog Box */
.dialog-box {
  background-color: #004d40;
  color: #e0f2f1;
}
</style>
