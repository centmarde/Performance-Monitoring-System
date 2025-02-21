<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
        <div class="p-8 bg-gray-100 min-h-screen">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <!--  <v-btn @click="showAddUserForm = true" color="teal-darken-3">
                Add User
              </v-btn> -->
            </v-col>
          </v-row>

          <!-- Add User Dialog -->
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
                <v-btn @click="showEditUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn
                  @click="updateUser"
                  color="teal darken-3"
                  :disabled="!isEditUserValid"
                >
                  Save Changes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Edit User Dialog -->
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
                    :type="passwordVisible ? 'text' : 'password'"
                    :rules="[requiredValidator, passwordValidator]"
                    append-inner-icon="mdi-eye"
                    @click:append-inner="togglePasswordVisibility"
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
                <v-btn @click="showAddUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
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
            :search-query="searchQuery"
            @update:search-query="searchQuery = $event"
            @edit-user="openEditDialog"
            @delete-user="promptDeleteUser"
          />

          <v-container class="mt-4">
            <v-row class="align-center justify-center">
              <!-- Pagination centered under the table -->
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="3"
                rounded
                active-color="black"
                density="comfortable"
              ></v-pagination>
            </v-row>

            <v-row class="align-center justify-end mt-2">
              <v-col cols="auto">
                <v-select
                  v-model="itemsPerPage"
                  :items="[3, 10, 20, 30, 50, 100]"
                  label="Items per page"
                  dense
                  outlined
                  style="max-width: 150px"
                  @change="handleItemsPerPageChange"
                />
              </v-col>
            </v-row>
          </v-container>
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
  user_type: string;
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
  user_type: "",
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
  user_type: "",
});

const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

// Pagination related state
const currentPage = ref(1);
const itemsPerPage = ref(10);

const isAddUserValid = computed(() => {
  return (
    newUser.value.firstname.trim() !== "" &&
    newUser.value.lastname.trim() !== "" &&
    emailValidator(newUser.value.email) === true &&
    passwordValidator(newUser.value.password) === true &&
    newUser.value.phone.trim() !== "" &&
    newUser.value.complete_address.trim() !== "" &&
    newUser.value.user_type.trim() !== ""
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
    (editedUser.value.user_type?.trim() || "").length > 0 &&
    (editedUser.value.phone?.trim() || "").length > 0 &&
    (editedUser.value.complete_address?.trim() || "").length > 0
  );
});

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value;

  const query = searchQuery.value.toLowerCase();
  return items.value.filter((user) => {
    const searchFields = [
      user.id?.toString(),
      user.email,
      user.firstname,
      user.lastname,
      user.phone,
      user.complete_address,
      user.user_type,
    ];
    return searchFields.some((field) => field?.toLowerCase().includes(query));
  });
});

// Paginated Items (dynamic based on selected itemsPerPage)
// Calculate total pages
const totalPages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage.value)
);

// Get paginated items from filtered results
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

// Watch search query to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Handle items per page change
const handleItemsPerPageChange = () => {
  currentPage.value = 1;
};

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profiles, error } = await supabase.from("users").select("*");
    if (error) {
      throw error;
    }

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
const openEditDialog = (user?: User) => {
  editedUser.value = user
    ? { ...user }
    : {
        id: 0,
        name: "",
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        phone: "",
        complete_address: "",
        user_type: "",
      };

  console.log("Opening Edit Dialog:", editedUser.value);
  showEditUserForm.value = true;
};

const addUser = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([newUser.value])
      .select();
    if (error) {
      throw error;
    }
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
  console.log("Edited User:", editedUser.value);
  try {
    const { error } = await supabase
      .from("users")
      .update(editedUser.value)
      .eq("id", editedUser.value.id);
    if (error) {
      throw error;
    }
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
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userToDelete.value);
      if (error) {
        throw error;
      }
      items.value = items.value.filter(
        (user) => user.id !== userToDelete.value
      );
      userToDelete.value = null;
    }
    showDeleteConfirmation.value = false;
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
</script>
