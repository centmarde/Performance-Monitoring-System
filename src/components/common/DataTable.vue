<template>
  <v-container>
    <v-card class="data-card">
      <v-row class="align-center mb-1">
        <v-col cols="6">
          <v-card-title class="text-h6">User List</v-card-title>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <SearchBar v-model="searchQuery" :disabled="!props.items.length" />
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-card-text>
        <v-table class="styled-table">
          <thead>
            <tr>
              <th
                v-for="header in [
                  'ID',
                  'Email',
                  'First Name',
                  'Last Name',
                  'Phone',
                  'Address',
                  'Role',
                  'Actions',
                ]"
                :key="header"
                :class="[
                  'text-left',
                  header === 'Actions' ? 'actions-header' : '',
                ]"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.firstname }}</td>
              <td>{{ item.lastname }}</td>
              <td>{{ item.phone }}</td>
              <td>{{ item.complete_address }}</td>
              <td>{{ item.role }}</td>
              <td class="actions-cell">
                <v-btn
                  :color="primaryColor"
                  @click="editUser(item)"
                  size="small"
                >
                  Edit
                </v-btn>
                <v-btn color="error" @click="deleteUser(item.id)" size="small">
                  Delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          class="mt-3"
        ></v-pagination>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps<{ items: any[] }>();
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

const primaryColor = computed(() => "#004D40");

// Filtered items computed property
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return props.items;

  const query = searchQuery.value.toLowerCase();
  return props.items.filter((user) => {
    return [
      user.id?.toString(),
      user.email,
      user.firstname,
      user.lastname,
      user.phone,
      user.complete_address,
      user.user_type,
    ].some((field) => field?.toLowerCase().includes(query));
  });
});

// Calculate total pages
const totalPages = computed(
  () => Math.ceil(filteredItems.value.length / itemsPerPage.value) || 1
);

// Watch for changes that should reset pagination
watch(
  [searchQuery, () => props.items],
  () => {
    // Defer the page reset to avoid recursive updates
    nextTick(() => {
      currentPage.value = 1;
    });
  },
  { deep: true }
);

// Watch to ensure currentPage stays within bounds
watch([currentPage, totalPages], ([newPage, totalPages]) => {
  if (newPage > totalPages) {
    currentPage.value = totalPages;
  }
});

// Paginated items computed property
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredItems.value.slice(start, end);
});

const emit = defineEmits<{
  (e: "edit-user", user: any): void;
  (e: "delete-user", id: number): void;
}>();

const editUser = (user: any) => {
  emit("edit-user", user);
};

const deleteUser = (id: number) => {
  emit("delete-user", id);
};

// Initialize component
onMounted(() => {
  currentPage.value = 1;
});
</script>
