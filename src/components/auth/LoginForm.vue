<template>
  <v-col cols="12" md="6">
    <v-card-text class="mt-12">
      <h4 class="text-center">Login to Your Account</h4>
      <h6 class="text-center grey--text mt-2">
        Log in to your account so you can continue monitoring
        <br />and managing your users
      </h6>
      <v-row align="center" justify="center" class="mt-3">
        <v-col cols="12" sm="8">
          <v-form @submit.prevent="onFormSubmit">
            <v-text-field
              v-model="loginEmail"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[requiredValidator, emailValidator]"
            ></v-text-field>
            <v-text-field
              v-model="loginPassword"
              prepend-inner-icon="mdi-lock-outline"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              :rules="[requiredValidator]"
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="7">
                <v-checkbox
                  label="Remember Me"
                  class="mt-n1"
                  color="blue"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="5">
                <span class="caption blue--text">Forgot password</span>
              </v-col>
            </v-row>
            <v-btn
              class="mt-2"
              type="submit"
              color="#2E7D32"
              prepend-icon="mdi-login"
              :disabled="formAction.formProcess"
              :loading="formAction.formProcess"
              block
              style="border-radius: 25px"
            >
              Login
            </v-btn>
          </v-form>
          <h5 class="text-center grey--text mt-4 mb-3">Or Log in using</h5>
          <div class="d-flex justify-space-between align-center mx-10 mb-16">
            <!-- Replaced FontAwesome icons with Vuetify icons -->
            <v-btn depressed outlined color="grey">
              <v-icon color="red">mdi-google</v-icon>
            </v-btn>
            <v-btn depressed outlined color="grey">
              <v-icon color="blue">mdi-facebook</v-icon>
            </v-btn>
            <v-btn depressed outlined color="grey">
              <v-icon color="light-blue lighten-3">mdi-twitter</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-col>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useAuthUserStore } from "@/stores/authUser";
import { useToast } from "vue-toastification";
import { requiredValidator, emailValidator } from "@/lib/validator";
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

const onFormSubmit = async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();
  formAction.value.formProcess = true;

  try {
    const { error } = await authUserStore.signIn(
      loginEmail.value,
      loginPassword.value
    );
    if (error) {
      throw new Error(typeof error === "string" ? error : error.message);
    }

    toast.success("Login successful", {
      timeout: 3000,
      closeOnClick: true,
    });
    router.push("/home");
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    toast.error(`Login error: ${errorMessage}`);
  } finally {
    formAction.value.formProcess = false;
  }
};
</script>

<style scoped>
.v-btn {
  margin-top: 20px;
}
</style>
