<template>
  <v-card class="mx-auto pa-10" max-width="600" elevation="8">
      <v-icon
        class="close-icon"
        @click="emit('close-dialog')"
        right
      >
        mdi-close
      </v-icon>
      <v-form  @submit.prevent="onFormSubmit">
  <v-row dense>
    <v-col cols="12">
      <v-text-field
        v-model="formData.email"
        label="Email"
        prepend-inner-icon="mdi-email-outline"
        :rules="[requiredValidator, emailValidator]"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="formData.password"
        prepend-inner-icon="mdi-lock-outline"
        label="Password"
        :type="isPasswordVisible ? 'text' : 'password'"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        :rules="[requiredValidator, passwordValidator]"
      ></v-text-field>
    </v-col>

    <v-col cols="12">
      <v-text-field
        v-model="formData.password_confirmation"
        label="Password Confirmation"
        :type="isPasswordConfirmVisible ? 'text' : 'password'"
        :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
        :rules="[
          requiredValidator,
          confirmedValidator(formData.password_confirmation, formData.password)
        ]"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-radio-group v-model="formData.userType" :rules="[requiredValidator]" row>
        <v-radio label="Teacher" value="teacher"></v-radio>
        <v-radio label="Admin" value="admin"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>

  <v-btn
    class="mt-2"
    type="submit"
     color="#00A4E5"
    prepend-icon="mdi-account-plus"
    :disabled="formAction.formProcess"
    :loading="formAction.formProcess"
    block
  >
    Register
  </v-btn>
</v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/lib/validator';
import { useAuthUserStore } from '@/stores/authUser';
import { useToast } from "vue-toastification";

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

async function onFormSubmit(event: SubmitEvent): Promise<void> {
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
  } */
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