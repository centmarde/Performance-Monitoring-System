<template>
  <v-container
    fluid
    class="welcome-container"
    :class="{ 'blur-background': showDialog || showContactDialog }"
  >
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

    <!-- Extra Information Dialog -->
    <v-dialog v-model="showDialog" max-width="500" persistent>
      <v-card class="dialog-box">
        <v-card-title class="text-h5">Complete Your Profile</v-card-title>
        <v-card-text>
          <p>We need some extra details to personalize your experience.</p>

          <v-text-field
            label="First Name"
            v-model="extraInfo.firstname"
            outlined
            required
          ></v-text-field>
          <v-text-field
            label="Last Name"
            v-model="extraInfo.lastname"
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
            clearable
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

import { supabase } from "@/lib/supabase";

const showDialog = ref(false);
const showContactDialog = ref(false);

const errorMessage = ref("");
const successMessage = ref("");

const extraInfo = ref({
  firstname: "",
  lastname: "",
  phone: "",
  complete_address: "",
});
// Fetch user information when the component is mounted

onMounted(async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    console.error("User authentication failed:", authError);
    return;
  }

  console.log("Authenticated User ID:", authData.user.id); // Debugging
});

const saveExtraInfo = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) {
    console.error("Authentication failed:", authError);
    errorMessage.value = "Authentication failed. Please log in again.";
    return;
  }

  const user_id = authData.user.id;
  console.log("Saving data for user ID:", user_id); // Debugging

  await supabase.rpc("delete_duplicate_users", { user_id_param: user_id });

  // Check if user already exists
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false }) // Get latest entry
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching user:", fetchError);
    errorMessage.value = "Error retrieving user data.";
    return;
  }

  if (existingUser) {
    // Update existing user info
    const { error: updateError } = await supabase
      .from("users")
      .update({
        firstname: extraInfo.value.firstname,
        lastname: extraInfo.value.lastname,
        phone: extraInfo.value.phone,
        complete_address: extraInfo.value.complete_address,
      })
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Error updating data:", updateError);
      errorMessage.value = "Failed to update information.";
      return;
    }
  } else {
    // Insert new record if user doesn't exist
    const { error: insertError } = await supabase.from("users").insert([
      {
        user_id,
        firstname: extraInfo.value.firstname,
        lastname: extraInfo.value.lastname,
        phone: extraInfo.value.phone,
        complete_address: extraInfo.value.complete_address,
      },
    ]);

    if (insertError) {
      console.error("Error inserting data:", insertError);
      errorMessage.value = "Failed to save information.";
      return;
    }
  }

  successMessage.value = "Your information has been saved successfully!";
  showDialog.value = false;
};

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

.blur-background {
  filter: blur(5px);
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

/* Dialog Box */
.dialog-box {
  background-color: #e3f2fd;
  color: #004d40;
}

.feature-icon {
  width: 80px; /* Adjust size */
  height: auto; /* Maintain aspect ratio */
  display: block;
  margin: 0 auto 10px; /* Center image & add spacing */
}
</style>
