<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
        <div class="p-8 bg-gray-100 min-h-screen">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <v-btn @click="showAddUserForm = true" color="teal-darken-3">
                Add User
              </v-btn>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="searchQuery"
                prepend-icon="mdi-magnify"
                label="Search Users"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <!-- Add User Dialog -->
          <v-dialog v-model="showAddUserForm" max-width="500px">
            <v-card>
              <v-card-title>Add User</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="addUser">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newUser.firstname"
                        label="First Name"
                        :rules="[requiredValidator]"
                        outlined
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="newUser.lastname"
                        label="Last Name"
                        :rules="[requiredValidator]"
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <v-text-field
                    v-model="newUser.email"
                    label="Email"
                    :rules="[requiredValidator, emailValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="newUser.password"
                    label="Password"
                    type="password"
                    :rules="[requiredValidator, passwordValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="newUser.phone"
                    label="Phone"
                    :rules="[requiredValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="newUser.complete_address"
                    label="Address"
                    :rules="[requiredValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="newUser.user_type"
                    label="Role"
                    :rules="[requiredValidator]"
                    outlined
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showAddUserForm = false" color="grey darken-1">
                  Cancel
                </v-btn>
                <v-btn
                  @click="addUser"
                  color="teal darken-3"
                  :disabled="!isAddUserValid"
                >
                  Add User
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Edit User Dialog -->
          <v-dialog v-model="showEditUserForm" max-width="500px">
            <v-card>
              <v-card-title>Edit User</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="updateUser">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedUser.firstname"
                        label="First Name"
                        :rules="[requiredValidator]"
                        outlined
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="editedUser.lastname"
                        label="Last Name"
                        :rules="[requiredValidator]"
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <v-text-field
                    v-model="editedUser.email"
                    label="Email"
                    :rules="[requiredValidator, emailValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="editedUser.password"
                    label="Password"
                    :type="passwordVisible ? 'text' : 'password'"
                    :rules="[passwordValidator]"
                    append-inner-icon="mdi-eye"
                    @click:append-inner="togglePasswordVisibility"
                    outlined
                  />
                  <v-text-field
                    v-model="editedUser.phone"
                    label="Phone"
                    :rules="[requiredValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="editedUser.complete_address"
                    label="Address"
                    :rules="[requiredValidator]"
                    outlined
                  />
                  <v-text-field
                    v-model="editedUser.user_type"
                    label="Role"
                    :rules="[requiredValidator]"
                    outlined
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showEditUserForm = false" color="grey darken-1">
                  Cancel
                </v-btn>
                <v-btn
                  @click="updateUser"
                  color="teal darken-3"
                  :disabled="!isEditUserValid"
                >
                  Update User
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Delete Confirmation Dialog -->
          <v-dialog v-model="showDeleteConfirmation" max-width="400px">
            <v-card>
              <v-card-title>Confirm Deletion</v-card-title>
              <v-card-text>
                Are you sure you want to delete this user?
              </v-card-text>
              <v-card-actions class="mx-auto">
                <v-btn
                  @click="showDeleteConfirmation = false"
                  color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn @click="confirmDeleteUser" color="red">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Data Table -->
          <DataTable
            :items="paginatedItems"
            @edit-user="openEditDialog"
            @delete-user="promptDeleteUser"
          />

          <!-- Pagination Controls -->
          <v-row justify="center" class="mt-4">
            <v-btn @click="prevPage" :disabled="currentPage === 1">Prev</v-btn>
            <v-btn
              @click="nextPage"
              :disabled="currentPage * itemsPerPage >= filteredItems.length"
              >Next</v-btn
            >

            <!-- Items per page dropdown aligned to the right -->
            <v-spacer></v-spacer>
            <v-col cols="auto" class="d-flex">
              <v-select
                v-model="itemsPerPage"
                :items="[10, 20, 30, 50, 100]"
                label="Items per page"
                dense
                outlined
                min-width="150"
                class="mt-0"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "@/layouts/LayoutWrapper.vue";
import DataTable from "@/components/common/DataTable.vue";
import {
  emailValidator,
  passwordValidator,
  requiredValidator,
} from "@/lib/validator";
import { supabase } from "@/lib/supabase";

interface User {
  id: number;
  name: string;
  email: string;
  firstname: string;
  password: string;
  lastname: string;
  phone: string;
  complete_address: string;
  user_type: string; // Updated field name
}

const items = ref<User[]>([]);
const showAddUserForm = ref(false);
const showEditUserForm = ref(false);
const showDeleteConfirmation = ref(false);
const userToDelete = ref<number | null>(null);
const searchQuery = ref("");
const newUser = ref<User>({
  id: 0,
  name: "",
  email: "",
  firstname: "",
  lastname: "",
  password: "",
  phone: "",
  complete_address: "",
  user_type: "", // Updated field name
});
const editedUser = ref<User>({
  id: 0,
  name: "",
  email: "",
  firstname: "",
  lastname: "",
  password: "",
  phone: "",
  complete_address: "",
  user_type: "", // Updated field name
});

// Password visibility toggle
const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// Pagination related state
const currentPage = ref(1);
const itemsPerPage = ref(10); // Default to 10, but can be changed

const isAddUserValid = computed(() => {
  return (
    newUser.value.firstname.trim() !== "" &&
    newUser.value.lastname.trim() !== "" &&
    emailValidator(newUser.value.email) === true &&
    passwordValidator(newUser.value.password) === true &&
    newUser.value.phone.trim() !== "" && // Ensure phone is not empty
    newUser.value.complete_address.trim() !== "" && // Ensure address is not empty
    newUser.value.user_type.trim() !== "" // Role field must not be empty
  );
});

const isEditUserValid = computed(() => {
  const isValidPassword =
    !editedUser.value.password || passwordValidator(editedUser.value.password);

  return (
    (editedUser.value.firstname?.trim() || "").length > 0 &&
    (editedUser.value.lastname?.trim() || "").length > 0 &&
    emailValidator(editedUser.value.email || "") === true &&
    isValidPassword && // Check password only if it's not empty
    (editedUser.value.user_type?.trim() || "").length > 0 && // Updated field name
    (editedUser.value.phone?.trim() || "").length > 0 &&
    (editedUser.value.complete_address?.trim() || "").length > 0
  );
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((user) =>
    [
      user.id.toString(),
      user.email,
      user.firstname,
      user.lastname,
      user.phone,
      user.complete_address,
      user.user_type, // Updated field name
    ].some((field) =>
      field?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Paginated Items (dynamic based on selected itemsPerPage)
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value * itemsPerPage.value < filteredItems.value.length) {
    currentPage.value += 1;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

onMounted(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profiles, error } = await supabase.from("users").select("*");
    if (error) throw error;
    items.value = profiles.map((profile: any) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      firstname: profile.firstname,
      lastname: profile.lastname,
      phone: profile.phone,
      password: profile.password,
      complete_address: profile.complete_address,
      user_type: profile.user_type,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

// Methods for managing users
const openEditDialog = (user: User) => {
  editedUser.value = { ...user };
  showEditUserForm.value = true;
};

const addUser = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([newUser.value])
      .select();
    if (error) throw error;
    items.value.push({ ...newUser.value, id: data[0].id });
    newUser.value = {
      id: 0,
      name: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      complete_address: "",
      user_type: "",
    };
    showAddUserForm.value = false;
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

const updateUser = async () => {
  try {
    const { error } = await supabase
      .from("users")
      .update(editedUser.value)
      .eq("id", editedUser.value.id);
    if (error) throw error;
    const index = items.value.findIndex(
      (user) => user.id === editedUser.value.id
    );
    if (index !== -1) {
      items.value[index] = { ...editedUser.value };
    }
    showEditUserForm.value = false;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const promptDeleteUser = (id: number) => {
  userToDelete.value = id;
  showDeleteConfirmation.value = true;
};

const confirmDeleteUser = async () => {
  try {
    if (userToDelete.value !== null) {
      console.log(
        "Checking related class records for user ID:",
        userToDelete.value
      );

      // Check if related records exist
      const { data: classRecords, error: checkError } = await supabase
        .from("class_record")
        .select("id")
        .eq("teacher_id", userToDelete.value);

      if (checkError) {
        console.error("Error checking related class records:", checkError);
        return;
      }

      if (classRecords.length > 0) {
        alert("Cannot delete user. They have related class records.");
        return;
      }

      // Proceed with deletion
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userToDelete.value);

      if (error) {
        console.error("Error deleting user:", error);
        return;
      }

      items.value = items.value.filter(
        (user) => user.id !== userToDelete.value
      );
      console.log("User deleted successfully!");

      userToDelete.value = null;
      showDeleteConfirmation.value = false;
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
</script>
