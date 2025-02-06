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
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.password }}</td>
        <td>{{ item.role }}</td>
        <td>
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
