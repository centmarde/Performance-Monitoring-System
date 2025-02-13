<template>
  <v-container>
    <v-card class="data-card">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">User List</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-table class="styled-table">
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
                <v-btn
                  @click="editUser(item)"
                  class="edit-btn"
                  small
                  color="primary"
                  >Edit</v-btn
                >
                <v-btn
                  @click="deleteUser(item.id)"
                  class="delete-btn"
                  small
                  color="red"
                  >Delete</v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
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
.data-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.styled-table th {
  background: #004d40;
  color: white;
}

.actions-cell {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
