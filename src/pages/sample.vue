<template>
  <div id="background">
    <v-container
      fluid
      class="d-flex align-center justify-center"
      style="height: 100vh; background-color: #f5f5f5"
    >
      <v-row class="d-flex align-center justify-center" style="width: 80%">
        <!-- Left Side (Welcome Back Section) -->
        <v-col
          cols="12"
          md="8"
          class="bg-light-green-darken-4 text-white rounded-l-xl d-flex flex-column justify-center align-center px-10 py-10"
          style="min-height: 400px"
        >
          <!-- <v-img
              src="/src/assets/logo.png"
              contain
              height="60"
              class="mb-3"
            ></v-img> -->
          <h2 class="text-h4 font-weight-bold">Welcome Back!</h2>
          <p class="text-center text-body-2">
            To stay connected with us, please login with your personal info
          </p>
          <v-btn color="white" text class="mt-4 px-10" outlined>Sign In</v-btn>
        </v-col>

        <v-col cols="12" lg="4">
          <h2
            class="text-h4 font-weight-bold text-light-green-darken-4 d-flex align-center justify-center"
          >
            Welcome
          </h2>
          <p
            class="text-body-2 text-grey-darken-1 d-flex align-center justify-center"
          >
            Login in to your account to continue
          </p>
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
          Don't have an account?
          <a
            class="mt-2 text-body-2 text-light-green-darken-4 font-weight-medium"
            href="#"
            :class="{ 'v-btn--disabled': formAction.formProcess }"
            @click.prevent="$emit('open-register-dialog')"
          >
            Register
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog v-model="showRegisterDialog" max-width="600">
    <RegisterForm @close-dialog="showRegisterDialog = false" />
  </v-dialog>
</template>
