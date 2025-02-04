<template>
  <v-card class="pa-13" :class="themeClass" elevation="8">
    <!-- Image at the Top -->
    <v-img
      class="mx-auto"
      src="/images/school-logo.png"
      :width="mobile ? '60vw' : '150px'"
      :height="mobile ? '60vw' : '150px'"
      cover
      style="border-radius: 50%; object-fit: cover; margin-bottom: 20px"
    />

    <h2
      class="text-h4 font-weight-bold text-light-green-darken-4 d-flex align-center justify-center"
    >
      Welcome
    </h2>
    <p
      class="text-body-2 text-grey-darken-1 d-flex align-center justify-center"
    >
      Login to your account to continue
    </p>

    <v-form ref="refVForm" @submit.prevent="onFormSubmit">
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="loginEmail"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredValidator, emailValidator]"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="loginPassword"
            prepend-inner-icon="mdi-lock-outline"
            label="Password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            :rules="[requiredValidator]"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        class="mt-2 px-10"
        type="submit"
        color="light-green-darken-4"
        prepend-icon="mdi-login"
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
        block
        dark
      >
        Login
      </v-btn>

      <!-- "Don't have an account? Register" on the same line -->
      <p
        class="text-body-2 text-grey-darken-1 mt-3 d-flex align-center justify-center"
      >
        Don't have an account?
        <a
          class="text-light-green-darken-4 font-weight-medium ml-1"
          href="#"
          :class="{ 'v-btn--disabled': formAction.formProcess }"
          @click.prevent="$emit('open-register-dialog')"
        >
          Register
        </a>
      </p>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from "vue";
import { requiredValidator, emailValidator } from "../../lib/validator";
import { useAuthUserStore } from "../../stores/authUser";
import { useToast } from "vue-toastification";
import router from "@/router";

const loginEmail = ref("");
const loginPassword = ref("");
const isPasswordVisible = ref(false);
const formAction = ref({ formProcess: false });
const toast = useToast();
const isDarkTheme = inject("isDarkTheme", ref(false));

const themeClass = computed(() =>
  isDarkTheme.value ? "light-theme" : "dark-theme"
);

const authUserStore = useAuthUserStore();

const onFormSubmit = async () => {
  formAction.value.formProcess = true;

  /* try {
    const { error } = await authUserStore.signIn(loginEmail.value, loginPassword.value);
    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
      //@ts-ignore
    toast.error(Login error: ${err.message || 'An unknown error occurred'});
  } finally {
    formAction.value.formProcess = false;
  } */

  router.push("/home");
};

// Listen for the registration success event
const onRegistrationSuccess = () => {
  // Close the dialog
  //@ts-ignore
  $emit("close-dialog");
};
</script>

<style scoped>
.v-btn {
  margin-top: 20px;
}
</style>
