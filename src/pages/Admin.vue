<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
        <div class="p-8 bg-gray-100 min-h-screen">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <v-btn @click="showAddUserForm = true" color="#2E7D32">
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
                  <v-text-field
                    v-model="newUser.name"
                    label="Name"
                    :rules="[requiredValidator]"
                  />
                  <v-text-field
                    v-model="newUser.email"
                    label="Email"
                    :rules="[requiredValidator, emailValidator]"
                  />
                  <v-text-field
                    v-model="newUser.password"
                    label="Password"
                    type="password"
                    :rules="[requiredValidator, passwordValidator]"
                  />
                  <v-text-field
                    v-model="newUser.role"
                    label="Role"
                    :rules="[requiredValidator]"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showAddUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn
                  @click="addUser"
                  color="#2E7D32"
                  :disabled="!isAddUserValid"
                  >Add User</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Edit User Dialog -->
          <v-dialog v-model="showEditUserForm" max-width="500px">
            <v-card>
              <v-card-title>Edit User</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="updateUser">
                  <v-text-field
                    v-model="editedUser.name"
                    label="Name"
                    :rules="[requiredValidator]"
                  />
                  <v-text-field
                    v-model="editedUser.email"
                    label="Email"
                    :rules="[requiredValidator, emailValidator]"
                  />
                  <v-text-field
                    v-model="editedUser.password"
                    label="Password"
                    type="password"
                    :rules="[requiredValidator, passwordValidator]"
                  />
                  <v-text-field
                    v-model="editedUser.role"
                    label="Role"
                    :rules="[requiredValidator]"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showEditUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn
                  @click="updateUser"
                  color="blue"
                  :disabled="!isEditUserValid"
                  >Save Changes</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Data Table -->
          <DataTable
            :items="filteredItems"
            @edit-user="openEditDialog"
            @delete-user="deleteUser"
          />
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "../layouts/LayoutWrapper.vue";
import DataTable from "@/components/common/DataTable.vue";
import {
  emailValidator,
  passwordValidator,
  requiredValidator,
} from "@/lib/validator";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

const items = ref<User[]>([]);
const showAddUserForm = ref(false);
const showEditUserForm = ref(false);
const searchQuery = ref("");
const newUser = ref<User>({
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
});
const editedUser = ref<User>({
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
});

const isAddUserValid = computed(() => {
  return (
    newUser.value.name.trim() !== "" &&
    emailValidator(newUser.value.email) === true &&
    passwordValidator(newUser.value.password) === true &&
    newUser.value.role.trim() !== ""
  );
});

const isEditUserValid = computed(() => {
  return (
    editedUser.value.name.trim() !== "" &&
    emailValidator(editedUser.value.email) === true &&
    passwordValidator(editedUser.value.password) === true &&
    editedUser.value.role.trim() !== ""
  );
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    items.value = data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "password",
      role: "User",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
});

const openEditDialog = (user: User) => {
  editedUser.value = { ...user };
  showEditUserForm.value = true;
};

const addUser = () => {
  if (!isAddUserValid.value) return;
  newUser.value.id = items.value.length + 1;
  items.value.push({ ...newUser.value });
  newUser.value = { id: 0, name: "", email: "", password: "", role: "" };
  showAddUserForm.value = false;
};

const updateUser = () => {
  if (!isEditUserValid.value) return;
  const index = items.value.findIndex(
    (user) => user.id === editedUser.value.id
  );
  if (index !== -1) {
    items.value[index] = { ...editedUser.value };
  }
  showEditUserForm.value = false;
};

const deleteUser = (id: number) => {
  items.value = items.value.filter((user) => user.id !== id);
};
</script>
