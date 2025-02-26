<template>
  <v-col cols="12" md="6">
    <v-card-text class="mt-12">
      <h4 class="text-center">Login to Your Account</h4>
      <h6 class="text-center text-teal-darken-3 mt-2">
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
              variant="outlined"
              :rules="[requiredValidator, emailValidator]"
            ></v-text-field>
            <v-text-field
              v-model="loginPassword"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              variant="outlined"
              :rules="[requiredValidator]"
            ></v-text-field>

            <v-row>
              <v-col cols="12" sm="7">
                <v-checkbox
                  label="Remember Me"
                  color="teal-darken-4"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="5">
                <span class="caption text-teal-darken-3">Forgot password?</span>
              </v-col>
            </v-row>
            <v-btn
              class="mt-3 login-btn"
              type="submit"
              color="teal-darken-3"
              prepend-icon="mdi-login"
              :disabled="formAction.formProcess"
              :loading="formAction.formProcess"
              block
            >
              Login
            </v-btn>
          </v-form>

          <h5 class="text-center text-teal-darken-3 mt-4 mb-3">Login with</h5>
          <div class="social-buttons">
            <v-btn depressed outlined color="teal-darken-3">
              <v-icon color="red">mdi-google</v-icon>
            </v-btn>
            <v-btn
              depressed
              outlined
              color="teal-darken-3
            "
            >
              <v-icon color="blue">mdi-facebook</v-icon>
            </v-btn>
            <v-btn depressed outlined color="teal-darken-3">
              <v-icon color="light-blue lighten-3">mdi-twitter</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-col>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthUserStore } from "@/stores/authUser";
import { useToast } from "vue-toastification";
import { requiredValidator, emailValidator } from "@/lib/validator";
import router from "@/router";

const loginEmail = ref("");
const loginPassword = ref("");
const isPasswordVisible = ref(false);
const formAction = ref({ formProcess: false });
const toast = useToast();

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

    toast.success("Login successful");
    router.push("/home");
  } catch (err) {
    toast.error(
      `Login error: ${err instanceof Error ? err.message : "An error occurred"}`
    );
  } finally {
    formAction.value.formProcess = false;
  }
};
</script>

<style scoped>
.text-secondary {
  color: #8c8c8c;
}

.login-btn {
  border-radius: 25px;
  font-weight: bold;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
</style>
