<template>
  <div class="custom-shape-divider-bottom-1734636264">
    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
    </svg>
</div>

  <div id="background">
    <v-container>
      <NavBar />
      <div id="spacer"></div>
      <v-row class="mb-10">
        <v-col cols="12" lg="8">
          <h1 class="header mx-auto">Welcome Back!</h1>
          <p class="text-light mx-5">
           The ultimate platform for tenants and landlords to connect, manage, and share boarding house experiences seamlessly.
          </p>
        </v-col>
      
        <v-col cols="12" lg="4"> <LoginForm @open-register-dialog="handleOpenRegisterDialog" /> </v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog v-model="showRegisterDialog" max-width="600">
    <RegisterForm @close-dialog="showRegisterDialog = false" />
  </v-dialog>

</template>

<script lang="ts" setup>
  //
</script>
