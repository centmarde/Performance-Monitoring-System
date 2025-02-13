<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-card class="profile-card">
          <!-- Profile Photo Upload -->
          <v-row align="center">
            <v-col cols="12" md="3" class="text-center">
              <v-avatar size="100">
                <v-img
                  :src="userStore.userInfo?.image_path || avatar"
                  alt="User Avatar"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="9">
              <v-btn color="primary" @click="uploadImage"
                >Upload New Photo</v-btn
              >
              <v-btn class="ml-2" color="grey" @click="resetProfile"
                >Reset</v-btn
              >
              <p class="mt-2 text-caption">
                Allowed JPG, GIF, or PNG. Max size of 800K
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3>Personal Information</h3>
            </v-col>
          </v-row>
          <!-- Profile Form -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="firstName"
                label="First Name"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="phoneNumber"
                label="Phone Number"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="completeAddress"
                label="Complete Address"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="E-mail"
                variant="outlined"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Save Button -->
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn color="primary" class="save-btn" @click="updateProfile"
                >Save Information</v-btn
              >
            </v-col>
          </v-row>

          <!-- Change Password Section -->
          <v-divider class="my-4"></v-divider>
          <v-row>
            <v-col cols="12">
              <h3>Change Password</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="oldPassword"
                label="Old Password"
                :type="showOldPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:prepend-inner>
                  <v-icon>mdi-lock</v-icon>
                </template>
                <template v-slot:append-inner>
                  <v-icon
                    @click="showOldPassword = !showOldPassword"
                    class="cursor-pointer"
                  >
                    {{ showOldPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:prepend-inner>
                  <v-icon>mdi-lock</v-icon>
                </template>
                <template v-slot:append-inner>
                  <v-icon
                    @click="showNewPassword = !showNewPassword"
                    class="cursor-pointer"
                  >
                    {{ showNewPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="confirmNewPassword"
                label="Confirm New Password"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:prepend-inner>
                  <v-icon>mdi-lock</v-icon>
                </template>
                <template v-slot:append-inner>
                  <v-icon
                    @click="showConfirmNewPassword = !showConfirmNewPassword"
                    class="cursor-pointer"
                  >
                    {{ showConfirmNewPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="auto">
              <v-btn color="primary" @click="updatePassword"
                >Update Password</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HomeLayout from "@/layouts/HomeLayout.vue";
import { supabase } from "@/lib/supabase";
import { useUserInfoStore } from "@/stores/userInfo";
import Avatar from "@/assets/avatar.png";

const avatar = Avatar;
const userStore = useUserInfoStore();
const firstName = ref("");
const lastName = ref("");
const phoneNumber = ref("");
const email = ref("");
const completeAddress = ref("");
const profileImage = ref(Avatar);

const oldPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const fetchProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) return;

  const { data, error: profileError } = await supabase
    .from("users")
    .select("firstname, lastname, phone, email, complete_address, image_path")
    .eq("user_id", user.user.id)
    .single();

  if (!profileError && data) {
    firstName.value = data.firstname || "";
    lastName.value = data.lastname || "";
    phoneNumber.value = data.phone || "";
    email.value = data.email || "";
    completeAddress.value = data.complete_address || "";
    profileImage.value = data.image_path || Avatar;
  }
};

const updateProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) return;

  await supabase
    .from("users")
    .update({
      firstname: firstName.value,
      lastname: lastName.value,
      phone: phoneNumber.value,
      email: email.value,
      complete_address: completeAddress.value,
      image_path: profileImage.value,
    })
    .eq("user_id", user.user.id);
};

const updatePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value)
    return;
  if (newPassword.value !== confirmNewPassword.value) return;

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: oldPassword.value,
  });
  if (signInError) return;

  await supabase.auth.updateUser({ password: newPassword.value });
  oldPassword.value = "";
  newPassword.value = "";
  confirmNewPassword.value = "";
};

const uploadImage = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const filePath = `profile_images/${Date.now()}-${file.name}`;
    await supabase.storage.from("profiles").upload(filePath, file);
    const publicUrl = supabase.storage.from("profiles").getPublicUrl(filePath)
      .data.publicUrl;
    if (publicUrl) profileImage.value = publicUrl;
  };
  input.click();
};

const resetProfile = async () => {
  await fetchProfile();
};

onMounted(fetchProfile);
</script>

<style scoped>
.profile-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}
.save-btn {
  font-weight: bold;
  padding: 10px 20px;
}
</style>
