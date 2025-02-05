<template>
  <LayoutWrapper>
    <template #content>
      <v-container fluid>
        <div class="p-8 bg-gray-100 min-h-screen">
          <!-- Search Bar -->
          <v-text-field
            v-model="searchQuery"
            prepend-icon="mdi-magnify"
            label="Search Users"
            outlined
            dense
          />

          <!-- Add User Form -->
          <div>
            <v-btn @click="showAddUserForm = !showAddUserForm" color="#2E7D32">
              {{ showAddUserForm ? "Cancel" : "Add User" }}
            </v-btn>

            <v-form
              v-if="showAddUserForm"
              @submit.prevent="addUser"
              :lazy-validation="true"
            >
              <!-- Name Field -->
              <v-text-field
                class="mt-2"
                v-model="newUser.name"
                label="Name"
                :error-messages="nameError"
                required
              />
              <!-- Email Field -->
              <v-text-field
                v-model="newUser.email"
                label="Email"
                :error-messages="emailError"
                required
              />
              <!-- Password Field -->
              <v-text-field
                v-model="newUser.password"
                label="Password"
                :error-messages="passwordError"
                required
                type="password"
              />
              <!-- Role Field -->
              <v-text-field
                v-model="newUser.role"
                label="Role"
                :error-messages="roleError"
                required
              />

              <v-btn type="submit" color="#2E7D32">Add User</v-btn>
            </v-form>
          </div>

          <!-- Data Table -->
          <DataTable :items="filteredItems"></DataTable>
        </div>
      </v-container>
    </template>
  </LayoutWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import LayoutWrapper from "../layouts/LayoutWrapper.vue";
import DataTable from "../components/DataTable.vue";

// Define the type of the items prop
interface Item {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

const items = ref<Item[]>([]); // Initialize items as an empty array
const showAddUserForm = ref(false); // To toggle the add user form
const newUser = ref({
  id: 0,
  name: "",
  email: "",
  password: "",
  role: "",
}); // For holding new user data
const searchQuery = ref(""); // For the search input field

// Error messages for validation
const nameError = ref<string | null>(null);
const emailError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const roleError = ref<string | null>(null);

// Computed property to filter items based on the search query
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value; // If no search query, return all items

  return items.value.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    items.value = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      password: "password", // Placeholder
      role: "User", // Placeholder
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Add user method with validation
const addUser = () => {
  // Clear previous error messages
  nameError.value = null;
  emailError.value = null;
  passwordError.value = null;
  roleError.value = null;

  let valid = true;

  // Validation for required fields
  if (!newUser.value.name) {
    nameError.value = "Name is required.";
    valid = false;
  }

  if (!newUser.value.email) {
    emailError.value = "Email is required.";
    valid = false;
  }

  if (!newUser.value.password) {
    passwordError.value = "Password is required.";
    valid = false;
  }

  if (!newUser.value.role) {
    roleError.value = "Role is required.";
    valid = false;
  }

  // If valid, add the user to the list
  if (valid) {
    const newId = items.value.length + 1;
    const user = { ...newUser.value, id: newId };

    items.value.push(user); // Add new user to the items array
    newUser.value = { id: 0, name: "", email: "", password: "", role: "" }; // Clear form
    showAddUserForm.value = false; // Hide the form
  }
};
</script>

<style scoped>
.bg-card {
  background: rgba(161, 205, 247, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(79, 204, 254, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid #64b5f6;
}
</style>
