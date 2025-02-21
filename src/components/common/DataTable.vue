<template>
  <v-container>
    <v-card class="data-card">
      <v-row class="align-center mb-1">
        <v-col cols="6">
          <v-card-title class="text-h6">User List</v-card-title>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <SearchBar v-model="searchQuery" />
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-card-text>
        <v-table class="styled-table">
          <thead>
            <tr>
              <th class="text-left">ID</th>
              <th class="text-left">Email</th>
              <th class="text-left">First Name</th>
              <th class="text-left">Last Name</th>
              <th class="text-left">Phone</th>
              <th class="text-left">Address</th>
              <th class="text-left">Role</th>
              <th class="text-center actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.firstname }}</td>
              <td>{{ item.lastname }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.complete_address }}</td>
              <td>{{ item.role }}</td>
              <td class="actions-cell">
                <v-btn :color="primaryColor" @click="editUser(item)" small
                  >Edit</v-btn
                >
                <v-btn @click="deleteUser(item.id)" small color="red"
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

const searchQuery = ref("");

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter((user) =>
    [
      user.id.toString(),
      user.email,
      user.firstname,
      user.lastname,
      user.phone,
      user.complete_address,
      user.user_type,
    ].some((field) =>
      field?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

const primaryColor = computed(() => "#004D40");

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
  text-align: left;
  vertical-align: middle;
}

.styled-table th {
  background: #004d40;
  color: white;
}

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  vertical-align: middle;
}
</style>
