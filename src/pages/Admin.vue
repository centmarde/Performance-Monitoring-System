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
                <v-form @submit.prevent="addUser">
                  <v-text-field v-model="newUser.name" label="Name" required />
                  <v-text-field
                    v-model="newUser.email"
                    label="Email"
                    required
                  />
                  <v-text-field
                    v-model="newUser.password"
                    label="Password"
                    required
                    type="password"
                  />
                  <v-text-field v-model="newUser.role" label="Role" required />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="showAddUserForm = false" color="grey darken-1"
                  >Cancel</v-btn
                >
                <v-btn @click="addUser" color="#2E7D32">Add User</v-btn>
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
                <v-form @submit.prevent="updateUser">
                  <v-text-field
                    v-model="editedUser.name"
                    label="Name"
                    required
                  />
                  <v-text-field
                    v-model="editedUser.email"
                    label="Email"
                    required
                  />
                  <v-text-field
                    v-model="editedUser.password"
                    label="Password"
                    required
                    type="password"
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
                <v-btn @click="updateUser" color="blue">Save Changes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Data Table with edit functionality -->
          <DataTable
            :items="filteredItems"
            @edit-user="openEditDialog"
          ></DataTable>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "../layouts/LayoutWrapper.vue";
import DataTable from "../components/DataTable.vue";

interface Item {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

const items = ref<Item[]>([]);
const showAddUserForm = ref(false);
const showEditUserForm = ref(false);
const searchQuery = ref("");
const newUser = ref<Item>({
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
});
const editedUser = ref<Item>({
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((item) =>
    [item.name, item.email, item.role].some((field) =>
      field.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    items.value = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      password: "password",
      role: "User",
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Open edit dialog with selected user data
const openEditDialog = (user: Item) => {
  editedUser.value = { ...user }; // Clone the object to avoid modifying it directly
  showEditUserForm.value = true;
};

// Update user data in the table
const updateUser = () => {
  const index = items.value.findIndex((u) => u.id === editedUser.value.id);
  if (index !== -1) {
    items.value[index] = { ...editedUser.value }; // Save changes
  }
  showEditUserForm.value = false;
};

// Add new user
const addUser = () => {
  const newId = items.value.length + 1;
  const user = { ...newUser.value, id: newId };
  items.value.push(user);
  newUser.value = { id: 0, name: "", email: "", password: "", role: "" };
  showAddUserForm.value = false;
};
</script>
