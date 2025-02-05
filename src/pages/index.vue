<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10">
        <v-card class="elevation-6 mt-10">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <LoginForm></LoginForm>
                <v-col
                  cols="12"
                  md="6"
                  style="background-color: #2e7d32"
                  class="rounded-bl-xl"
                >
                  <div style="text-align: center; padding: 10px 0">
                    <v-card-text class="white--text">
                      <v-img
                        class="mx-auto rounded-circle"
                        src="/images/school-logo.png"
                        width="50%"
                      ></v-img>
                      <h2 class="text-center mt-3">
                        Los Angeles National High School
                      </h2>
                      <h3 class="text-center mt-15">
                        Don't Have an Account Yet?
                      </h3>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn
                        outlined
                        dark
                        @click="step++"
                        style="border-radius: 25px"
                      >
                        SIGN UP
                      </v-btn>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  style="background-color: #2e7d32"
                  class="rounded-br-xl"
                >
                  <div style="text-align: center; padding: 10px 0">
                    <v-card-text class="white--text">
                      <v-img
                        class="mx-auto rounded-circle"
                        src="/images/school-logo.png"
                        width="50%"
                      ></v-img>
                      <h2 class="text-center mt-3">
                        Los Angeles National High School
                      </h2>
                      <h3 class="text-center mt-15">Already Signed up?</h3>
                    </v-card-text>
                    <div class="text-center">
                      <v-btn
                        outlined
                        dark
                        @click="step--"
                        style="border-radius: 25px"
                      >
                        Log in
                      </v-btn>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <RegisterForm></RegisterForm>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

import { ref } from "vue";
import { useDisplay } from "vuetify";

const step = ref(1);
const { mobile } = useDisplay();
const showRegisterDialog = ref(false);

function handleOpenRegisterDialog() {
  console.log("Opening register dialog");
  showRegisterDialog.value = true;
}
</script>

<style scoped>
.v-application .rounded-bl-xl {
  border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
  border-bottom-right-radius: 300px !important;
}
</style>
