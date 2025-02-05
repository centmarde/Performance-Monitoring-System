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
              <v-card-title>
                <span class="headline">Add User</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  @submit.prevent="addUser"
                  ref="addUserForm"
                  v-model="formValidAdd"
                >
                  <v-text-field v-model="newUser.name" label="Name" required />
                  <v-text-field
                    v-model="newUser.email"
                    label="Email"
                    :rules="[emailValidator]"
                    required
                  />
                  <v-text-field
                    v-model="newUser.password"
                    label="Password"
                    type="password"
                    :rules="[passwordValidator]"
                    required
                  />
                  <v-text-field v-model="newUser.role" label="Role" required />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showAddUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn
                  @click="addUser"
                  color="#2E7D32"
                  :disabled="!formValidAdd"
                  >Add User</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Edit User Dialog -->
          <v-dialog v-model="showEditUserForm" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">Edit User</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  @submit.prevent="updateUser"
                  ref="editUserForm"
                  v-model="formValidEdit"
                >
                  <v-text-field
                    v-model="editedUser.name"
                    label="Name"
                    required
                  />
                  <v-text-field
                    v-model="editedUser.email"
                    label="Email"
                    :rules="[emailValidator]"
                    required
                  />
                  <v-text-field
                    v-model="editedUser.password"
                    label="Password"
                    type="password"
                    :rules="[passwordValidator]"
                    required
                  />
                  <v-text-field
                    v-model="editedUser.role"
                    label="Role"
                    required
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
                  :disabled="!formValidEdit"
                  >Save Changes</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- ✅ FIXED: Data Table with Proper Headers -->
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Users Table</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="openEditDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" @click="deleteUser(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "../layouts/LayoutWrapper.vue";
import { emailValidator, passwordValidator } from "@/lib/validator";

// User Interface
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

// Form validation models
const formValidAdd = ref(false);
const formValidEdit = ref(false);

// Table headers
const headers = ref([
  { text: "ID", value: "id" },
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "Role", value: "role" },
  { text: "Actions", value: "actions", sortable: false },
]);

// Search filter
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Fetch users data
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

// Open edit dialog
const openEditDialog = (user: User) => {
  editedUser.value = { ...user };
  showEditUserForm.value = true;
};

// Add new user
const addUser = () => {
  newUser.value.id = items.value.length + 1;
  items.value.push({ ...newUser.value });
  newUser.value = { id: 0, name: "", email: "", password: "", role: "" };
  showAddUserForm.value = false;
};

// Update existing user
const updateUser = () => {
  const index = items.value.findIndex(
    (user) => user.id === editedUser.value.id
  );
  if (index !== -1) {
    items.value[index] = { ...editedUser.value };
  }
  showEditUserForm.value = false;
};

// Delete user
const deleteUser = (id: number) => {
  items.value = items.value.filter((user) => user.id !== id);
};
</script>

<style scoped>
.bg-card {
  background: rgba(161, 205, 247, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(79, 204, 254, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid #64b5f6;
}
</style>
