<template>
  <div id="background">
    <v-container
      fluid
      class="pa-0 d-flex align-center justify-center"
      style="height: 100vh; background-color: #f5f5f5"
    >
      <NavBar />

      <v-row class="d-flex align-center justify-center" style="width: 80%">
        <!-- Left Side (Welcome Back Section) -->
        <v-col
          cols="12"
          lg="8"
          class="bg-light-green-darken-4 h-screen pa-0 d-flex justify-center align-center"
          v-if="!mobile"
        >
          <!-- Replace the image with a background color -->
          <div
            style="
              background-color: #388e3c;
              height: 100px;
              width: 100px;
              border-radius: 50%;
            "
            class="mx-auto"
          ></div>
        </v-col>

        <!-- Login Form Section -->
        <v-col cols="12" lg="4" :class="mobile ? '' : ''">
          <v-card class="mx-auto" elevation="0" max-width="600">
            <LoginForm></LoginForm>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog v-model="showRegisterDialog" max-width="600">
    <RegisterForm @close-dialog="showRegisterDialog = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import LoginForm from "@/components/auth/LoginForm.vue";
import NavBar from "@/components/common/NavBar.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const showRegisterDialog = ref(false);

function handleOpenRegisterDialog() {
  console.log("Opening register dialog");
  showRegisterDialog.value = true;
}
</script>
