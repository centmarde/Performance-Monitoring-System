<template>
  <LayoutWrapper>
    <template #content>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-btn-toggle v-model="activeTab" mandatory>
              <v-btn value="account" :color="primaryColor">
                <v-icon>mdi-account</v-icon> Account
              </v-btn>
              <v-btn value="security" :color="primaryColor">
                <v-icon>mdi-lock</v-icon> Security
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-card class="profile-card" v-if="activeTab === 'account'">
          <v-row align="center">
            <v-col cols="12" md="3" class="text-center">
              <v-avatar size="100">
                <v-img
                  :src="tempImage || profileImage"
                  alt="User Avatar"
                ></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="12" md="9">
              <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="handleImageChange"
              />
              <v-btn :color="primaryColor" @click="triggerFileInput">
                Upload New Photo
              </v-btn>
              <v-btn class="ml-2" color="grey" @click="resetProfile">
                Reset
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3>Personal Information</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profileData.firstName"
                label="First Name"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="profileData.phoneNumber"
                label="Phone Number"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="profileData.completeAddress"
                label="Complete Address"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profileData.lastName"
                label="Last Name"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="profileData.email"
                label="E-mail"
                variant="outlined"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn
                :color="primaryColor"
                class="save-btn"
                @click="updateProfile"
              >
                Save Changes
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <v-card class="profile-card" v-if="activeTab === 'security'">
          <v-row>
            <v-col cols="12">
              <h3>Change Password</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="passwordData.oldPassword"
                label="Current Password"
                :type="showOldPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon @click="showOldPassword = !showOldPassword">
                    {{ showOldPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="passwordData.newPassword"
                label="New Password"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon @click="showNewPassword = !showNewPassword">
                    {{ showNewPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="passwordData.confirmNewPassword"
                label="Confirm New Password"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon
                    @click="showConfirmNewPassword = !showConfirmNewPassword"
                  >
                    {{ showConfirmNewPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <p class="password-requirements">Password Requirements:</p>
              <ul class="password-list">
                <li>Minimum 8 characters long - the more, the better</li>
                <li>At least one lowercase character</li>
                <li>At least one number, symbol, or whitespace character</li>
              </ul>
            </v-col>
          </v-row>
          <v-row justify="start">
            <v-col cols="auto">
              <v-btn
                :color="primaryColor"
                class="save-btn"
                @click="updatePassword"
              >
                Save Changes
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="grey" outlined @click="resetPassword">Reset</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
import { supabase } from "@/lib/supabase";
import { useToast } from "vue-toastification";
import { useUserInfoStore } from "@/stores/userInfo";
import Avatar from "@/assets/avatar.png";

const toast = useToast();
const activeTab = ref("account");
const userStore = useUserInfoStore();
const primaryColor = computed(() => "#004D40");
const fileInput = ref<HTMLInputElement | null>(null);

const profileData = ref({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  completeAddress: "",
});

const originalProfileData = ref({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  completeAddress: "",
});

const passwordData = ref({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const profileImage = ref(Avatar);
const tempImage = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmNewPassword = ref(false);

const fetchProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) {
    console.error("Error fetching user:", error?.message);
    return;
  }

  const { data, error: profileError } = await supabase
    .from("users")
    .select("firstname, lastname, phone, email, complete_address, image_path")
    .eq("user_id", user.user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError.message);
  } else {
    profileData.value = {
      firstName: data.firstname || "",
      lastName: data.lastname || "",
      phoneNumber: data.phone || "",
      email: data.email || "",
      completeAddress: data.complete_address || "",
    };

    originalProfileData.value = { ...profileData.value };
    profileImage.value = data.image_path || Avatar;
  }
};

const triggerFileInput = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = handleImageChange;
  input.click();
};

const handleImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  selectedFile.value = file;
  tempImage.value = URL.createObjectURL(file);
};

const updateProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) {
    toast.error("Failed to fetch user data.");
    return;
  }

  let newImagePath = profileImage.value;

  if (selectedFile.value) {
    const filePath = `profile_images/${Date.now()}-${selectedFile.value.name}`;
    const { error: uploadError } = await supabase.storage
      .from("profiles")
      .upload(filePath, selectedFile.value);

    if (uploadError) {
      toast.error("Failed to upload image.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("profiles").getPublicUrl(filePath);

    newImagePath = publicUrl;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      firstname: profileData.value.firstName,
      lastname: profileData.value.lastName,
      phone: profileData.value.phoneNumber,
      email: profileData.value.email,
      complete_address: profileData.value.completeAddress,
      image_path: newImagePath,
    })
    .eq("user_id", user.user.id);

  if (updateError) {
    toast.error("Failed to update profile.");
  } else {
    if (newImagePath !== profileImage.value) {
      profileImage.value = newImagePath;
      userStore.setProfileImage(newImagePath);
    }
    toast.success("Profile updated successfully.");
    tempImage.value = null;
    selectedFile.value = null;
  }
};

const resetProfile = () => {
  profileData.value = { ...originalProfileData.value };
  tempImage.value = null;
  selectedFile.value = null;
};

const resetPassword = () => {
  passwordData.value = {
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
};

const updatePassword = async () => {
  const { oldPassword, newPassword, confirmNewPassword } = passwordData.value;

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    toast.error("All fields are required!");
    return;
  }

  if (newPassword !== confirmNewPassword) {
    toast.error("New password and confirmation do not match.");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters long.");
    return;
  }

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email: session.user.email!, // Use session email
      password: oldPassword,
    });

    if (signInError || !user) {
      toast.error("Current password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    toast.success("Password updated successfully.");
    resetPassword();
  } catch (err) {
    toast.error("Failed to update password. Please try again.");
    console.error("Error updating password:", err);
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
.profile-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 10px #004d40;
  border: 1px solid rgba(0, 77, 64, 0.5);
  margin-top: 20px;
}

.password-requirements {
  font-weight: bold;
  margin-bottom: 8px;
}

.password-list {
  padding-left: 20px;
  margin: 0;
  list-style-type: disc;
}

.password-list li {
  margin-bottom: 4px;
}
</style>
