<template>
  <table class="styled-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Password</th>
        <th>Role</th>
        <th>Actions</th>
        <!-- New Actions Column -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in props.items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.password }}</td>
        <td>{{ item.role }}</td>
        <td>
          <v-btn @click="editUser(item)" color="#2E7D32" small>Edit</v-btn>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// Define props
const props = defineProps<{
  items: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  }[];
}>();

// Define emits to send event to parent
const emit = defineEmits(["edit-user"]);

// Emit edit-user event when Edit button is clicked
const editUser = (user: any) => {
  emit("edit-user", user);
};
</script>

<style scoped>
.styled-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.styled-table tr:nth-child(even) {
  background-color: var(--row-bg);
}

.dark-mode .styled-table tr:nth-child(even) {
  background-color: var(--row-bg-dark);
}

.styled-table tr:hover {
  background-color: #ddd;
}
</style>
