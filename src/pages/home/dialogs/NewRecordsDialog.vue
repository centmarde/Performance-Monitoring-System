<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  show: Boolean,
  title: {
    type: String,
    default: "Class Record Ready"
  },
  message: {
    type: String,
    default: "Your class record is now ready to edit."
  }
});

const emit = defineEmits(['close', 'update:show']);
const router = useRouter();

const navigateToRecentRecords = () => {
  // Get all relevant data from localStorage
  const classRecordId = localStorage.getItem("addedClassrecord");
  const section = localStorage.getItem("selectedSection");
  const quarter = localStorage.getItem("selectedQuarter");
  const subjectId = localStorage.getItem("selectedSubject");
  const subjectName = localStorage.getItem("selectedSubjectName");

  // Navigate to recent records with query params
  router.push({
    path: "/data_entry",
    
  });

  // Close the dialog
  emit('close');
};

// Handle dialog visibility changes
const handleVisibilityChange = (value) => {
  emit('update:show', value);
};

// Update closeDialog to emit the update:show event
const closeDialog = () => {
  emit('update:show', false);
  emit('close');
};
</script>

<template>
  <v-dialog 
    :model-value="show" 
    @update:model-value="handleVisibilityChange"
    max-width="500px" 
    persistent>
    <v-card class="success-dialog">
      <v-card-title class="text-h5">
        <v-icon color="success" class="mr-2" size="x-large">mdi-check-circle</v-icon>
        {{ title }}
      </v-card-title>
      
      <v-card-text class="py-4">
        <p>{{ message }}</p>
        <p class="text-caption mt-2">
          You can make changes to grades and the system will automatically save them.
        </p>
      </v-card-text>
      
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
      
        <v-btn color="success" variant="elevated" @click="navigateToRecentRecords">
          <v-icon start>mdi-history</v-icon>
          Go to data entry
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.success-dialog {
  border-radius: 12px;
  overflow: hidden;
}
</style>
