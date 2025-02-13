<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-btn-toggle v-model="activeTab" mandatory>
              <v-btn value="account" color="primary">
                <v-icon>mdi-account</v-icon> Account
              </v-btn>
              <v-btn value="security" color="primary">
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
              <v-btn color="primary" @click="uploadImage"
                >Upload New Photo</v-btn
              >
              <v-btn class="ml-2" color="grey" @click="resetProfile"
                >Reset</v-btn
              >
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
          <v-row justify="center">
            <v-col cols="auto">
              <v-btn color="primary" class="save-btn" @click="updateProfile"
                >Save Changes</v-btn
              >
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
                v-model="oldPassword"
                label="Current Password"
                :type="showOldPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon @click="showOldPassword = !showOldPassword">{{
                    showOldPassword ? "mdi-eye" : "mdi-eye-off"
                  }}</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon @click="showNewPassword = !showNewPassword">{{
                    showNewPassword ? "mdi-eye" : "mdi-eye-off"
                  }}</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="confirmNewPassword"
                label="Confirm New Password"
                :type="showConfirmNewPassword ? 'text' : 'password'"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-icon
                    @click="showConfirmNewPassword = !showConfirmNewPassword"
                    >{{
                      showConfirmNewPassword ? "mdi-eye" : "mdi-eye-off"
                    }}</v-icon
                  >
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
              <v-btn color="primary" @click="updatePassword"
                >Save Changes</v-btn
              >
            </v-col>
            <v-col cols="auto">
              <v-btn color="grey" outlined>Reset</v-btn>
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
import { useToast } from "vue-toastification";
import { useUserInfoStore } from "@/stores/userInfo";
import Avatar from "@/assets/avatar.png";

const toast = useToast();
const activeTab = ref("account");
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

// Image Upload Function
const tempImage = ref<string | null>(null); // Temporary image preview

const uploadImage = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const filePath = `profile_images/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return;
    }

    const publicUrl = supabase.storage.from("profiles").getPublicUrl(filePath)
      .data.publicUrl;

    if (publicUrl) {
      profileImage.value = publicUrl; // Update profile page
      userStore.setProfileImage(publicUrl); // ✅ Update sidebar in real time
      console.log("Profile image updated:", publicUrl);
    }
  };
  input.click();
};

// Reset Profile Fields
const resetProfile = async () => {
  await fetchProfile();
  tempImage.value = null; // Clear preview
  selectedFile.value = null; // Remove selected file
};

// Fetch user profile from Supabase
const fetchProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) {
    console.error("Error fetching user:", error?.message);
    return;
  }

  const { data, error: profileError } = await supabase
    .from("users") // Corrected to match your table
    .select("firstname, lastname, phone, email, complete_address, image_path")
    .eq("user_id", user.user.id) // Ensure correct filtering
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError.message);
  } else {
    firstName.value = data.firstname || "";
    lastName.value = data.lastname || "";
    phoneNumber.value = data.phone || "";
    email.value = data.email || "";
    completeAddress.value = data.complete_address || "";
    profileImage.value = data.image_path || Avatar;
  }
};

// Update Profile with toast notification
const selectedFile = ref<File | null>(null); // Store selected image file

const updateProfile = async () => {
  const { data: user, error } = await supabase.auth.getUser();
  if (error || !user?.user?.id) {
    console.error("Error fetching user:", error?.message);
    toast.error("Failed to fetch user data.");
    return;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      firstname: firstName.value,
      lastname: lastName.value,
      phone: phoneNumber.value,
      email: email.value,
      complete_address: completeAddress.value,
      image_path: profileImage.value, // Ensure image updates if changed
    })
    .eq("user_id", user.user.id);

  if (updateError) {
    console.error("Error updating profile:", updateError.message);
    toast.error("Failed to update profile. Please try again.");
  } else {
    toast.success("Profile updated successfully!");
    console.log("Profile updated successfully!");
  }
};

// Update Password with validation and toast
const updatePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) {
    toast.error("All fields are required!");
    return;
  }

  if (newPassword.value !== confirmNewPassword.value) {
    toast.error("New password and confirmation do not match.");
    return;
  }

  if (newPassword.value.length < 8) {
    toast.error("Password must be at least 8 characters long.");
    return;
  }

  try {
    // Get current user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: oldPassword.value,
    });

    if (signInError) {
      toast.error("Current password is incorrect.");
      return;
    }

    // Proceed with password update
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (updateError) {
      throw updateError;
    }

    toast.success("Password updated successfully!");
    oldPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
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
}
.password-requirements {
  font-weight: bold;
  margin-bottom: 8px;
}

.password-list {
  padding-left: 20px; /* Ensures proper indentation */
  margin: 0;
  list-style-type: disc; /* Fix bullet style */
}

.password-list li {
  margin-bottom: 4px; /* Adds spacing between list items */
}
</style>
