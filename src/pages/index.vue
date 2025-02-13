<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10">
        <v-card class="elevation-6 mt-10 rounded-lg">
          <v-window v-model="step">
            <!-- Login Section -->
            <v-window-item :value="1">
              <v-row>
                <LoginForm></LoginForm>
                <v-col cols="12" md="6" class="side-panel rounded-bl-xl">
                  <div class="panel-content">
                    <v-card-text class="white--text">
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
                      <v-btn class="action-btn" outlined dark @click="step++">
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
                <v-col cols="12" md="6" class="side-panel rounded-br-xl">
                  <div class="panel-content">
                    <v-card-text class="white--text">
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
                      <v-btn class="action-btn" outlined dark @click="step--">
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
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useDisplay } from "vuetify";

const step = ref(1);
const { mobile } = useDisplay();
</script>

<style scoped>
/* Apply Sidebar color to side panel */
.side-panel {
  background: linear-gradient(135deg, #2c7865 30%, #205d56 100%);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
}

/* Make buttons look modern */
.action-btn {
  border-radius: 25px;
  border: 2px solid white;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 10px 20px;
}

/* Panel Content Styling */
.panel-content {
  text-align: center;
  padding: 20px 0;
}

/* Smooth rounded design */
.rounded-bl-xl {
  border-bottom-left-radius: 200px !important;
}
.rounded-br-xl {
  border-bottom-right-radius: 200px !important;
}
</style>
