<template>
  <HomeLayout>
    <template #content>
      <v-container fluid class="profile-container">
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="profile-card">
              <v-card-title>
                <v-icon color="blue">mdi-information</v-icon> PROFILE
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="First name"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="Last name"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="Username (not your e-mail)"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="Your e-mail"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="Organization"
                  variant="outlined"
                ></v-text-field>
                <v-select
                  label="Country, City"
                  variant="outlined"
                  :items="['Ukraine, Kiev', 'USA, New York']"
                ></v-select>
                <v-row>
                  <v-col cols="4">
                    <v-select
                      variant="outlined"
                      label="Code"
                      :items="['+380', '+1', '+44']"
                    ></v-select>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      label="Personal phone number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-select
                      variant="outlined"
                      label="Code"
                      :items="['+380', '+1', '+44']"
                    ></v-select>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field
                      label="Work phone number"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="profile-card">
              <v-card-title>
                <v-icon color="blue">mdi-lock</v-icon> PASSWORD
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Old password"
                  type="password"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="New password"
                  type="password"
                  variant="outlined"
                ></v-text-field>
                <v-text-field
                  label="Confirm new password"
                  type="password"
                  variant="outlined"
                ></v-text-field>
                <v-btn color="primary" block class="save-btn"
                  >Correct. Save info</v-btn
                >
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import HomeLayout from "@/layouts/HomeLayout.vue";
</script>

<style scoped>
.profile-container {
  background: linear-gradient(to bottom, #004d40, #00695c);
  color: #e0f2f1;
  min-height: 100vh;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
}

.profile-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.save-btn {
  margin-top: 20px;
}
</style>
