<template>
  <v-container>
    <v-row>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="3">
        <v-card
          :class="card.color"
          class="pa-4 rounded-lg"
          :style="{ cursor: 'pointer' }"
          @click="handleCardClick(card)"
        >
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-subtitle-1 font-weight-bold">{{
              card.title
            }}</span>
            <v-icon>{{ card.icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            <v-progress-circular
              v-if="card.loading"
              :color="primaryColor"
              indeterminate
            ></v-progress-circular>
            <h2 v-else class="text-h4 font-weight-bold">{{ card.value }}</h2>
            <div class="text-caption">{{ card.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog for Subjects Handled -->
    <v-dialog v-model="subjectsDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left color="primary" class="mr-2">mdi-book-open</v-icon>
          Subjects Information
        </v-card-title>
        <v-card-text>
          <v-list v-if="assignedSubjects.length > 0" class="mt-2">
            <v-list-subheader class="font-weight-bold"
              >Your Assigned Subjects:</v-list-subheader
            >
            <v-list-item
              v-for="subject in assignedSubjects"
              :key="subject.id"
              class="mb-2"
            >
              <template v-slot:prepend>
                <v-icon color="teal-darken-2">mdi-book-education</v-icon>
              </template>
              <v-list-item-title>{{ subject.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <div v-else-if="subjectLoading" class="d-flex justify-center my-4">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
          <div v-else class="text-center my-4">
            <v-icon size="48" color="grey">mdi-book-off-outline</v-icon>
            <p class="mt-2">No subjects are currently assigned to you.</p>
          </div>
          <v-divider class="my-3"></v-divider>
          <p class="mt-4">
            Contact your administrator to add or modify subjects assigned to
            you.
          </p>
          <p class="mt-2">
            Your administrator can assign you to teach different subjects based
            on your qualifications and the school's needs.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="subjectsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import { useRecordsStore } from "@/stores/recordsStore";
import { useClassRecordStore } from "@/stores/classRecord";
import { supabase } from "@/lib/supabase";

export default {
  setup() {
    const router = useRouter();
    const subjectsDialog = ref(false);
    const assignedSubjects = ref([]);
    const subjectLoading = ref(false);

    const cards = ref([
      {
        title: "Subjects Handled",
        value: 0,
        icon: "mdi-book-open",
        color: "bg-green-lighten-5",
        description: "Total subjects assigned to you",
        loading: true,
        action: "dialog",
      },
      {
        title: "Failing Students",
        value: 0,
        icon: "mdi-account-alert",
        color: "bg-red-lighten-5",
        description: "Students with grades below 75%",
        loading: true,
        action: "/data_entry",
      },
      {
        title: "Passing Students",
        value: 0,
        icon: "mdi-account-check",
        color: "bg-green-lighten-5",
        description: "passed students",
        loading: true,
        action: "/section_tracking",
      },
      {
        title: "Class Records",
        value: 0,
        icon: "mdi-clipboard-text",
        color: "bg-blue-lighten-5",
        description: "Total class records created",
        loading: true,
        action: "/data_entry",
      },
    ]);

    const primaryColor = computed(() => "#004D40");
    const userId = ref(localStorage.getItem("user_id"));

    const subjectsStore = useSubjectsStore();
    const studentsStore = useStudentsStore();
    const recordsStore = useRecordsStore();
    const classRecordStore = useClassRecordStore();

    async function fetchSubjectsHandled() {
      const { data, error } = await supabase
        .from("asign_subjects")
        .select("subject_id")
        .eq("user_id", userId.value);

      if (error) {
        console.error("Error fetching subjects:", error);
        return 0;
      }

      return data.length;
    }

    async function fetchFailingStudents() {
      // Get class records created by this teacher
      const { data: classRecords, error: recordError } = await supabase
        .from("class_record")
        .select("id")
        .eq("teacher_id", userId.value);

      if (recordError || !classRecords.length) {
        console.error("Error fetching class records:", recordError);
        return 0;
      }

      const classRecordIds = classRecords.map((record) => record.id);

      // Get records with grades below 75% from these class records
      const { data: failingRecords, error: failingError } = await supabase
        .from("records")
        .select("student_id")
        .in("class_record_id", classRecordIds)
        .lt("initial_grade", 75);

      if (failingError) {
        console.error("Error fetching failing students:", failingError);
        return 0;
      }

      // Count unique students
      const uniqueStudents = new Set(failingRecords.map((r) => r.student_id));
      return uniqueStudents.size;
    }





      const classRecordIds = classRecords.map((record) => record.id);

      // Get records with grades 75% or higher from these class records
      const { data: passingRecords, error: passingError } = await supabase
        .from("records")
        .select("student_id")
        .in("class_record_id", classRecordIds)
        .gte("initial_grade", 75);

      if (passingError) {
        console.error("Error fetching passing students:", passingError);
        return 0;
      }

      // Count unique students
      const uniqueStudents = new Set(passingRecords.map((r) => r.student_id));
      return uniqueStudents.size;
    }

    async function fetchClassRecordsCount() {
      const { count, error } = await supabase
        .from("class_record")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", userId.value);

      if (error) {
        console.error("Error fetching class records count:", error);
        return 0;
      }

      return count || 0;
    }

    // Fetch detailed subject information for display in the dialog
    async function fetchAssignedSubjectsDetails() {
      subjectLoading.value = true;
      try {
        const { data, error } = await supabase
          .from("asign_subjects")
          .select("subject_id, subjects(id, title)")
          .eq("user_id", userId.value);

        if (error) {
          console.error("Error fetching assigned subjects details:", error);
          assignedSubjects.value = [];
          return;
        }

        // Extract subject details from the joined data
        assignedSubjects.value = data.map((item) => ({
          id: item.subjects.id,
          title: item.subjects.title,
        }));
      } catch (err) {
        console.error("Exception when fetching subject details:", err);
        assignedSubjects.value = [];
      } finally {
        subjectLoading.value = false;
      }
    }

    function handleCardClick(card) {
      if (card.action === "dialog") {
        fetchAssignedSubjectsDetails(); // Fetch subjects when dialog opens
        subjectsDialog.value = true;
      } else {
        router.push(card.action);
      }
    }

    onMounted(async () => {
      try {
        // Fetch all data in parallel for better performance
        const [
          subjectsCount,
          failingStudents,
          passingStudents,
          classRecordsCount,
        ] = await Promise.all([
          fetchSubjectsHandled(),
          fetchFailingStudents(),
          fetchPassingStudents(),
          fetchClassRecordsCount(),
        ]);

        // Update card values
        cards.value[0].value = subjectsCount;
        cards.value[1].value = failingStudents;
        cards.value[2].value = passingStudents;
        cards.value[3].value = classRecordsCount;

        // Mark all cards as loaded
        cards.value.forEach((card) => {
          card.loading = false;
        });
      } catch (error) {
        console.error("Error loading overview data:", error);
        cards.value.forEach((card) => {
          card.loading = false;
          card.value = "Error";
        });
      }
    });

    return {
      cards,
      primaryColor,
      handleCardClick,
      subjectsDialog,
      assignedSubjects,
      subjectLoading,
    };
  },
};
</script>

<style>
.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
}
.smallFont {
  font-size: 10px;
}
</style>
