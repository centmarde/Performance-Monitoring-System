<template>
  <v-card class="mx-auto pa-10" max-width="600" elevation="8">
     
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/lib/validator';
import { useAuthUserStore } from '@/stores/authUser';
import { useToast } from "vue-toastification";
import type { SubmitEventPromise } from '@/types/SubmitEventPromise';

// Define the emit function for the component
const emit = defineEmits(['registration-success', 'close-dialog']);

const toast = useToast();

const formData = ref({
email: '',
password: '',
password_confirmation: '',
userType: ''
});
const formAction = ref({ formProcess: false });
const isPasswordVisible = ref(false);
const isPasswordConfirmVisible = ref(false);

const authUserStore = useAuthUserStore();

async function onFormSubmit(event: SubmitEvent): SubmitEventPromise {
  event.preventDefault();
  formAction.value.formProcess = true;

  const { error } = await authUserStore.registerUser(
    formData.value.email,
    formData.value.password,
    formData.value.userType
  );

  formAction.value.formProcess = false;

  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    toast.error(`Registration error: ${errorMessage}`, {
      timeout: 3000,
      closeOnClick: true,
    });
  } else {
    toast.success('Registration successful', {
      timeout: 3000,
      closeOnClick: true,
    });
    emit('registration-success');
    emit('close-dialog');
  }

  return Promise.resolve(event);
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