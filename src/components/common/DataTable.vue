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
  background-color: #004d40; /* Teal background */
  color: white;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border: 1px solid #00796b; /* Darker teal border */
}

.styled-table th {
  background: #00695c; /* Darker teal for contrast */
  color: white;
}

.actions-header {
  text-align: center;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.edit-btn {
  background-color: #26a69a; /* Lighter teal for edit button */
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
  cursor: pointer;
  border-radius: 5px;
}
</style>
