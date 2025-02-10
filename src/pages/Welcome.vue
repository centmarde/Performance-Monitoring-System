<template>
  <v-container fluid class="welcome-container">
    <!-- Navigation -->
    <v-app-bar flat class="nav-bar">
      <v-container class="d-flex align-center justify-space-between">
        <h2 class="logo">Performance Monitoring System</h2>
        <v-btn
          variant="outlined"
          class="contact-btn"
          @click="showContactDialog = true"
        >
          Contact Us
        </v-btn>
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
    <v-dialog v-model="showContactDialog" max-width="450">
      <v-card class="dialog-box">
        <v-card-title class="text-h5">Contact Us</v-card-title>
        <v-card-text>
          <p>We'd love to hear from you! Please fill out the form below.</p>
          <v-text-field
            label="Your Name"
            v-model="contactInfo.name"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Your Email"
            v-model="contactInfo.email"
            outlined
            required
          ></v-text-field>
          <v-textarea
            label="Your Message"
            v-model="contactInfo.message"
            outlined
            required
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="outline-btn" @click="showContactDialog = false"
            >Cancel</v-btn
          >
          <v-btn class="primary-btn" @click="submitContactForm">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            v-model="extraInfo.complete_address"
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
    <v-container class="feature-section">
      <v-row>
        <v-col cols="12" md="4" class="feature-card">
          <v-img src="@/assets/Hero.png" class="feature-icon"></v-img>
          <h3>Track Progress</h3>
          <p>Monitor student achievements and academic growth in real-time.</p>
        </v-col>
        <v-col cols="12" md="4" class="feature-card">
          <v-img src="@/assets/Hero.png" class="feature-icon"></v-img>
          <h3>Monitor Activities</h3>
          <p>
            Keep an eye on daily tasks, attendance, and overall participation.
          </p>
        </v-col>
        <v-col cols="12" md="4" class="feature-card">
          <v-img src="@/assets/Hero.png" class="feature-icon"></v-img>
          <h3>Evaluate Performance</h3>
          <p>
            Assess student pass/fail status based on comprehensive criteria.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

import { supabase } from "@/lib/supabase";

const showDialog = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const extraInfo = ref({
  firstName: "",
  lastName: "",
  phone: "",
  complete_address: "",
});

const saveExtraInfo = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    errorMessage.value = "Authentication failed. Please log in again.";
    return;
  }

  const { error } = await supabase.from("users").insert([
    {
      user_id: authData.user.id,
      firstname: extraInfo.value.firstName,
      lastname: extraInfo.value.lastName,
      phone: extraInfo.value.phone,
      complete_address: extraInfo.value.complete_address,
    },
  ]);

  if (error) {
    errorMessage.value = "Failed to save information. Please try again.";
    return;
  }

  successMessage.value = "Your information has been saved successfully!";
  showDialog.value = false;
};



onMounted(() => {
  showDialog.value = true;
});
const showContactDialog = ref(false);

const contactInfo = ref({
  name: "",
  email: "",
  message: "",
});

const submitContactForm = () => {
  console.log("Contact Form Submitted:", contactInfo.value);
  showContactDialog.value = false;
};
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
.feature-section {
  padding: 50px 0;
  text-align: center;
}
.feature-card {
  text-align: center;
  padding: 20px;
}
.feature-icon {
  width: 80px;
  margin: 0 auto 10px; /* Centers the icon horizontally */
  display: block;
}
</style>
