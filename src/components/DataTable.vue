<template>
  <table class="styled-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Password</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      <!-- Loop through the `items` prop and display the data -->
      <tr v-for="item in props.items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.password }}</td>
        <td>{{ item.role }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

// Define the type of the `items` prop
const props = defineProps<{
  items: {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
  }[];
}>();
</script>

<style scoped>
.styled-table {
  width: 100%;
  border-collapse: separate; /* Allow spacing between rows */
  border-spacing: 0 10px; /* Add vertical spacing between rows */
}

.styled-table th,
.styled-table td {
  padding: 12px; /* Add padding for spacing inside cells */
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
  background-color: #ddd; /* Optional: Add hover effect for rows */
}
</style>
