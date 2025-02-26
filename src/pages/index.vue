<template>
  <v-app :class="theme.global.name">
    <v-main :class="['login-background', isDark ? 'dark-mode' : 'light-mode']">
      <v-container class="my-5">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10">
            <v-card
              class="login-card elevation-6 mt-2 rounded-lg"
              :class="isDark ? 'dark-card' : 'light-card'"
            >
              <v-window v-model="step">
                <!-- Login Section -->
                <v-window-item :value="1">
                  <v-row>
                    <LoginForm></LoginForm>
                    <v-col
                      cols="12"
                      md="6"
                      class="side-panel rounded-bl-xl"
                      :class="isDark ? 'dark-panel' : 'light-panel'"
                    >
                      <div class="panel-content">
                        <v-card-text>
                          <v-img
                            class="mx-auto rounded-circle"
                            src="/images/Logo-school.png"
                            width="50%"
                          ></v-img>
                          <h2 class="text-center mt-3">
                            Los Angeles National High School
                          </h2>
                          <h3 class="text-center mt-10">
                            Don't Have an Account Yet?
                          </h3>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn
                            class="action-btn"
                            outlined
                            :color="isDark ? 'white' : 'primary'"
                            @click="step++"
                          >
                            SIGN UP
                          </v-btn>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-window-item>

                <!-- Register Section -->
                <v-window-item :value="2">
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                      class="side-panel rounded-br-xl"
                      :class="isDark ? 'dark-panel' : 'light-panel'"
                    >
                      <div class="panel-content">
                        <v-card-text>
                          <v-img
                            class="mx-auto rounded-circle"
                            src="/images/Logo-school.png"
                            width="50%"
                          ></v-img>
                          <h2 class="text-center mt-3">
                            Los Angeles National High School
                          </h2>
                          <h3 class="text-center mt-10">Already Signed up?</h3>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn
                            class="action-btn"
                            outlined
                            :color="isDark ? 'white' : 'primary'"
                            @click="step--"
                          >
                            LOG IN
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
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useDisplay, useTheme } from "vuetify";
import NavBar from "@/components/common/NavBar.vue";

const step = ref(1);
const { mobile } = useDisplay();
const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);
</script>

<style scoped>
.light-mode {
  background: linear-gradient(135deg, #e0f2f1 30%, #b2dfdb 100%);
}

.dark-mode {
  background: linear-gradient(135deg, #102924 30%, #071b18 100%);
}

.login-card {
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease-in-out;
}

.light-card {
  background: #ffffff;
  color: #333;
  border: 1px solid rgba(0, 150, 136, 0.5);
  box-shadow: 0 0 10px rgba(0, 150, 136, 0.4);
}

.dark-card {
  background: #1e2a29;
  color: white;
  border: 1px solid rgba(0, 255, 204, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 204, 0.6);
}

.side-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}
.panel-content {
  text-align: center;
  padding: 20px 0;
}

.light-panel {
  background: linear-gradient(135deg, #007a6c 30%, #00695c 100%);
  color: white;
}

.dark-panel {
  background: linear-gradient(135deg, #1e3a3a 30%, #0d2323 100%);
  color: white;
}

.action-btn {
  border-radius: 25px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 10px 20px;
  border: 2px solid white;
}

.rounded-bl-xl {
  border-bottom-left-radius: 200px !important;
}
.rounded-br-xl {
}
</style>
