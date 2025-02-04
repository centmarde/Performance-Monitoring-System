<template>
  <br>
  <br>
  <br>
  <br>

  <div id="background">
    <v-container>
      <NavBar />
      <div id="spacer"></div>
      <v-row class="mb-10">
        <v-col cols="12" lg="8">
          <h1 class="header mx-auto">Welcome Back!</h1>
          <p class="text-light mx-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum beatae neque doloribus, nesciunt quasi libero laudantium totam ducimus labore eaque asperiores pariatur vero cumque aliquam sint obcaecati maxime voluptas soluta?
          </p>
        </v-col>
      
        <v-col cols="12" lg="4"></v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog v-model="showRegisterDialog" max-width="600">
    <RegisterForm @close-dialog="showRegisterDialog = false" />
  </v-dialog>

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import LoginForm from "@/components/auth/LoginForm.vue";
import NavBar from "@/components/common/NavBar.vue";
import RegisterForm from "@/components/auth/RegisterForm.vue";

const showRegisterDialog = ref(false);

function handleOpenRegisterDialog() {
  console.log('Opening register dialog');
  showRegisterDialog.value = true;
}
</script>

