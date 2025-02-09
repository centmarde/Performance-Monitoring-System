<template>
  <table class="styled-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Role</th>
        <th class="actions-header">Actions</th>
        <!-- Added class for styling -->
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.firstname }}</td>
        <td>{{ item.lastname }}</td>
        <td>{{ item.phone }}</td>
        <td>{{ item.complete_address }}</td>
        <td>{{ item.role }}</td>
        <td class="actions-cell">
          <!-- Added class for styling -->
          <button @click="editUser(item)" class="edit-btn">Edit</button>
          <button @click="deleteUser(item.id)" class="delete-btn">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ items: any[] }>();
const emit = defineEmits(["edit-user", "delete-user"]);

const editUser = (user: any) => {
  emit("edit-user", user);
};

const deleteUser = (id: number) => {
  emit("delete-user", id);
};
</script>

<style scoped>
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.styled-table th {
  background: #2e7d32;
  color: white;
}

.actions-header {
  text-align: center; /* Centers the header text */
}

.actions-cell {
  display: flex;
  justify-content: center; /* Centers the buttons horizontally */
  gap: 10px; /* Adds space between the buttons */
}

.edit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
