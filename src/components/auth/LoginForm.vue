<template>
  <v-card class="pa-10" :class="themeClass" elevation="8">
  
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAuthUserStore } from '@/stores/authUser';
import { useToast } from 'vue-toastification';
import { requiredValidator, emailValidator } from '@/lib/validator';
import router from '@/router';
import type { SubmitEventPromise } from '@/types/SubmitEventPromise';

const loginEmail = ref('');
const loginPassword = ref('');
const isPasswordVisible = ref(false);
const formAction = ref({ formProcess: false });
const toast = useToast();
const isDarkTheme = inject('isDarkTheme', ref(false));

const themeClass = computed(() => (isDarkTheme.value ? 'light-theme' : 'dark-theme'));

const authUserStore = useAuthUserStore();

const onFormSubmit = async (event: SubmitEvent): SubmitEventPromise => {
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

  return Promise.resolve(event);
};
</script>

<style scoped>
.v-btn {
  margin-top: 20px;
}
</style>