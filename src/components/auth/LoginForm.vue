<template>
  <v-card class="pa-10" :class="themeClass" elevation="8">
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
        class="mt-2"
        type="submit"
        color="#00A4E5"
        prepend-icon="mdi-login"
        :disabled="formAction.formProcess"
        :loading="formAction.formProcess"
        block
      >
        Login
      </v-btn>
      <a
        class="mt-2 v-btn"
        href="#"
        :class="{ 'v-btn--disabled': formAction.formProcess }"
        @click.prevent="$emit('open-register-dialog')"
      >
        Register
      </a>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, inject } from 'vue';
import { useAuthUserStore } from '@/stores/authUser';
import { useToast } from 'vue-toastification';
import { requiredValidator, emailValidator } from '@/lib/validator';
import router from '@/router';

const loginEmail = ref('');
const loginPassword = ref('');
const isPasswordVisible = ref(false);
const formAction = ref({ formProcess: false });
const toast = useToast();
const isDarkTheme = inject('isDarkTheme', ref(false));

const themeClass = computed(() => (isDarkTheme.value ? 'light-theme' : 'dark-theme'));

const authUserStore = useAuthUserStore();

const onFormSubmit = async (event: SubmitEvent): Promise<void> => {
  event.preventDefault();
  formAction.value.formProcess = true;

  try {
    const { error } = await authUserStore.signIn(loginEmail.value, loginPassword.value);
    if (error) {
      throw new Error(typeof error === 'string' ? error : error.message);
    }

    toast.success('Login successful', {
      timeout: 3000,
      closeOnClick: true,
    });
    router.push("/home");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
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