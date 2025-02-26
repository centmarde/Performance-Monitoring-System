<template>
  <v-card-text>
    <h4 class="text-center">Sign Up for an Account</h4>
    <h6 class="text-center text-teal-darken-3 mt-2">
      Log in to your account so you can continue monitoring
      <br />and managing your users
    </h6>
    <v-row align="center" justify="center" class="mt-3">
      <v-col cols="12" sm="8">
        <v-form @submit.prevent="onFormSubmit">
          <v-row class="mt-">
            <v-col cols="12" sm="6"> </v-col>
          </v-row>
          <v-text-field
            v-model="formData.email"
            label="Email"
            prepend-inner-icon="mdi-email-outline"
            :rules="[requiredValidator, emailValidator]"
          ></v-text-field>
          <v-text-field
            v-model="formData.password"
            prepend-inner-icon="mdi-lock-outline"
            label="Password"
            :type="isPasswordVisible ? 'text' : 'password'"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
            :rules="[requiredValidator, passwordValidator]"
          ></v-text-field>
          <v-text-field
            v-model="formData.password_confirmation"
            prepend-inner-icon="mdi-lock-outline"
            label="Password Confirmation"
            :type="isPasswordConfirmVisible ? 'text' : 'password'"
            :append-inner-icon="
              isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'
            "
            @click:append-inner="
              isPasswordConfirmVisible = !isPasswordConfirmVisible
            "
            :rules="[
              requiredValidator,
              confirmedValidator(
                formData.password_confirmation,
                formData.password
              ),
            ]"
          ></v-text-field>
          <v-select
            v-model="formData.userType"
            :items="userTypes"
            label="User Type"
            :rules="[requiredValidator]"
            placeholder="Select User Type"
          ></v-select>

          <v-row>
            <v-col cols="12" sm="7">
              <v-checkbox
                label="I Accept AAE"
                class="mt-n1"
                color="blue"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="5">
              <span class="caption text-teal-darken-3 ml-n4"
                >Terms & Conditions</span
              >
            </v-col>
          </v-row>
          <v-btn
            :loading="formAction.formProcess"
            color="teal-darken-3"
            dark
            block
            style="border-radius: 25px"
            type="submit"
          >
            Sign up
          </v-btn>
        </v-form>

        <h5 class="text-center mt-4 mb-3 text-teal-darken-3">Sign up with</h5>
        <div class="social-buttons">
          <!-- Replaced FontAwesome icons with Vuetify icons -->
          <v-btn depressed outlined color="teal-darken-3">
            <v-icon color="red">mdi-google</v-icon>
          </v-btn>
          <v-btn depressed outlined color="teal-darken-3">
            <v-icon color="blue">mdi-facebook</v-icon>
          </v-btn>
          <v-btn depressed outlined color="teal-darken-3">
            <v-icon color="light-blue lighten-3">mdi-twitter</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from "@/lib/validator";
import { useAuthUserStore } from "@/stores/authUser";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

// Define the emit function for the component
const emit = defineEmits(["registration-success", "close-dialog"]);

const toast = useToast();

const formData = ref({
  email: "",
  password: "",
  password_confirmation: "",
  userType: "Teacher",
});
const formAction = ref({ formProcess: false });
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

const authUserStore = useAuthUserStore();

const userTypes = ["Teacher", "Admin"];

const router = useRouter();

async function onFormSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  formAction.value.formProcess = true;

  const userTypeLowerCase = formData.value.userType.toLowerCase();

  const { error } = await authUserStore.registerUser(
    formData.value.email,
    formData.value.password,
    userTypeLowerCase
  );

  formAction.value.formProcess = false;

  if (error) {
    const errorMessage = typeof error === "string" ? error : error.message;
    toast.error(`Registration error: ${errorMessage}`, {
      timeout: 3000,
      closeOnClick: true,
    });
  } else {
    toast.success("Registration successfully.", {
      timeout: 3000,
      closeOnClick: true,
    });

    router.push("/welcome");
  }
}
</script>

<style scoped>
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}
</style>
