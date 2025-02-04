<template>
  <v-card-text class="mt-12">
    <h4 class="text-center">Sign Up for an Account</h4>
    <h6 class="text-center grey--text mt-2">
      Let's get you all set up so you can start creating your first onboarding
      experience
    </h6>
    <v-row align="center" justify="center mt-3">
      <v-col cols="12" sm="8">
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

        <v-row>
          <v-col cols="12" sm="7">
            <v-checkbox
              label="I Accept AAE"
              class="mt-n1"
              color="blue"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="5">
            <span class="caption blue--text ml-n4">Terms & Conditions</span>
          </v-col>
        </v-row>
        <v-btn color="#2E7D32" dark block tile>Sign up</v-btn>

        <h5 class="text-center grey--text mt-4 mb-3">Or Sign up using</h5>
        <div class="d-flex justify-space-between align-center mx-10 mb-11">
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from "../../lib/validator";
import { useAuthUserStore } from "../../stores/authUser";
import { useToast } from "vue-toastification";

// Define the emit function for the component
const emit = defineEmits(["registration-success", "close-dialog"]);

const toast = useToast();

const formData = ref({
  email: "",
  password: "",
  password_confirmation: "",
  userType: "",
});
const formAction = ref({ formProcess: false });
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

const authUserStore = useAuthUserStore();

async function onFormSubmit() {
  formAction.value.formProcess = true;

  const { error } = await authUserStore.registerUser(
    formData.value.email,
    formData.value.password,
    formData.value.userType
  );

  formAction.value.formProcess = false;

  if (error) {
    toast.error(`Registration error: ${error.message}`, {
      //@ts-ignore
      position: "top-left",
      timeout: 3000,
      closeOnClick: true,
    });
  } else {
    toast.success("Registration successful", {
      //@ts-ignore
      position: "top-left",
      timeout: 3000,
      closeOnClick: true,
    });

    emit("close-dialog");
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
</style>
