<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
          persistent
        >
          <v-progress-circular
            :color="primaryColor"
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>

        <v-row justify="start">
          <v-col cols="auto">
            <v-card class="pa-3 rounded-card glass-card" :color="primaryColor">
              <h4 class="font-weight-bold text-end">
                <span class="mdi mdi-account-school"></span> Subject Management
              </h4>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <!-- "Add New" Card -->
          <v-col v-if="currentPage === 1" cols="12" sm="6" md="4">
            <v-card class="subject-card add-new-card" @click="showAddNewDialog">
              <v-container
                class="d-flex flex-column align-center justify-center fill-height"
              >
                <v-icon size="80" color="#004D40">mdi-plus</v-icon>
                <h3 class="font-weight-bold">Add New</h3>
              </v-container>
            </v-card>
          </v-col>

          <!-- No Data Message -->
          <v-col v-if="!isLoading && subjects.length === 0" cols="12">
            <v-card class="pa-8 text-center">
              <v-icon size="64" color="grey">mdi-book-off-outline</v-icon>
              <h3 class="mt-4 text-grey-darken-1">No Class Record available</h3>
              <p class="text-grey">
                Click "Add New" to create your first Class Record entry.
              </p>
            </v-card>
          </v-col>

          <!-- Subject Cards with Pagination -->
          <v-col
            v-else-if="!isLoading"
            v-for="(subject, index) in paginatedSubjects"
            :key="index"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :class="['subject-card', getColorClass(index)]"
              @click="handleCardClick(subject.id)"
            >
              <!-- Subject Title -->
              <v-card-title class="subject-title">
                <v-icon class="subject-icon" size="24">mdi-book-open</v-icon>
                {{ subject.subjectName }}
              </v-card-title>

              <v-divider></v-divider>

              <!-- Details Section -->
              <v-card-text class="details-container pa-2">
                <v-container>
                  <v-row class="fill-height">
                    <v-col cols="12">
                      <div class="subject-info d-flex align-center">
                        <v-icon size="20" color="teal-darken-4"
                          >mdi-calendar-range</v-icon
                        >
                        <span
                          >Quarter: <strong>{{ subject.quarter }}</strong></span
                        >
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="subject-info d-flex align-center">
                        <v-icon size="20" color="teal-darken-4"
                          >mdi-google-classroom</v-icon
                        >
                        <span
                          >Section: <strong>{{ subject.section }}</strong></span
                        >
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="subject-info d-flex align-center">
                        <v-icon size="20" color="teal-darken-4"
                          >mdi-account-group</v-icon
                        >
                        <span
                          >Student Count:
                          <strong>{{ subject.student_count }}</strong></span
                        >
                      </div>
                    </v-col>
                    <v-col cols="12">
                      
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagination Control -->
        <v-pagination
          v-if="!isLoading"
          v-model="currentPage"
          :length="totalPages"
          class="mt-4 d-flex justify-center"
        ></v-pagination>

        <!-- Class Record Dialog -->
        <v-dialog v-model="classRecordDialog" max-width="900px">
          <v-card
            class="pa-5 rounded-xl elevation-10"
            :class="isDarkMode ? 'dark-mode' : 'light-mode'"
          >
            <!-- Elegant Header with Updated Color -->
            <v-card-title
              class="text-center font-weight-bold py-4"
              style="
                background: linear-gradient(135deg, #004d40, #00332e);
                color: white;
                border-radius: 12px 12px 0 0;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
              "
            >
              <v-icon class="mr-2">mdi-book-education</v-icon> Class Record -
              {{ activeSubject || "New Subject" }}
            </v-card-title>

            <!-- Form Fields -->
            <v-card-text class="mt-4">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      label="Subject"
                      :items="subjectOptions"
                      v-model="selectedSubject"
                      variant="outlined"
                      class="rounded-lg text-field"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Section"
                      :items="sectionOptions"
                      v-model="selectedSection"
                      variant="outlined"
                      class="rounded-lg text-field"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Quarter"
                      :items="quarterOptions"
                      v-model="selectedQuarter"
                      variant="outlined"
                      class="rounded-lg text-field"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- Divider -->
            <v-divider></v-divider>

            <!-- Actions -->
            <v-card-actions class="d-flex justify-end">
              <v-btn
                v-if="!activeSubject"
                variant="flat"
                class="text-white rounded-lg shadow-md"
                style="
                  background: linear-gradient(135deg, #004d40, #00332e);
                  transition: 0.3s ease-in-out;
                  font-size: 16px;
                "
                @click="saveClassRecord"
              >
                <v-icon class="mr-2">mdi-plus</v-icon> Add
              </v-btn>

              <v-btn
                v-if="activeSubject"
                variant="flat"
                class="text-white rounded-lg shadow-md"
                style="
                  background: linear-gradient(135deg, #004d40, #00332e);
                  transition: 0.3s ease-in-out;
                  font-size: 16px;
                "
              >
                <v-icon class="mr-2">mdi-content-save</v-icon> Save
              </v-btn>

              <v-btn
                variant="outlined"
                class="rounded-lg shadow-md"
                :class="isDarkMode ? 'dark-mode' : 'light-mode'"
                color="error"
                @click="classRecordDialog = false"
              >
                <v-icon class="mr-2">mdi-close</v-icon> Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Card Dialog -->
        <v-dialog v-model="cardDialog" max-width="480px">
          <v-card
            class="pa-5 rounded-xl elevation-10"
            style="
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            "
          >
            <!-- Elegant Header with Glassmorphism Effect -->
            <v-card-title
              class="text-center font-weight-bold py-4"
              style="
                background: linear-gradient(135deg, #004d40, #00332e);
                color: white;
                border-radius: 12px 12px 0 0;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
              "
            >
              <v-icon class="mr-2">mdi-book-open-variant</v-icon> Manage Subject
              - {{ activeSubject || "Subject" }}
            </v-card-title>

            <!-- Content -->
            <v-card-text class="mt-4">
              <v-container>
                <v-row justify="center">
                  <!-- Enter Records Button (Green) -->
                  <v-col cols="12">
                    <v-btn
                      block
                      color="success"
                      variant="flat"
                      class="text-none text-white rounded-lg shadow-md"
                      style="
                        font-size: 16px;
                        transition: 0.3s ease-in-out;
                        background: linear-gradient(135deg, #004d40, #00332e);
                      "
                      @click="enterRecords"
                    >
                      <v-icon class="mr-2">mdi-file-document-edit</v-icon> Enter
                      Records
                    </v-btn>
                  </v-col>

                  <!-- Delete Button with Dynamic Behavior -->
                  <v-col cols="12">
                    <v-btn
                      block
                      :color="
                        activeSubjectId !== null ? 'error' : 'grey-darken-1'
                      "
                      :disabled="activeSubjectId === null"
                      variant="flat"
                      class="text-none rounded-lg shadow-md"
                      :style="{
                        fontSize: '16px',
                        transition: '0.3s ease-in-out',
                        background:
                          activeSubjectId !== null
                            ? 'linear-gradient(135deg, #ff5252, #d32f2f)'
                            : 'grey',
                      }"
                      @click="
                        if (activeSubjectId !== null)
                          deleteClassRecord(activeSubjectId);
                      "
                    >
                      <v-icon class="mr-2">mdi-delete</v-icon> Delete
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- Animated Divider -->
            <v-divider
              style="border-color: rgba(255, 255, 255, 0.2)"
            ></v-divider>

            <!-- Card Actions -->
            <v-card-actions class="d-flex justify-end">
              <v-btn
                color="error"
                variant="outlined"
                class="text-none rounded-lg shadow-sm"
                style="
                  transition: 0.3s ease-in-out;
                  font-size: 16px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                "
                @click="cardDialog = false"
              >
                <v-icon class="mr-2">mdi-close</v-icon> Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
      <v-container>
        <v-row justify="start">
          <v-col cols="auto">
            <v-card class="pa-3 rounded-card glass-card" :color="primaryColor">
              <h4 class="font-weight-bold text-end">
                <span class="mdi mdi-account-school"></span> Section and
                Students
              </h4>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card><SectionList /></v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </HomeLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import HomeLayout from "@/layouts/HomeLayout.vue";
import { useClassRecordStore } from "@/stores/classRecord";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useRecordsStore } from "@/stores/recordsStore";
import { useToast } from "vue-toastification";
import { supabase } from "@/lib/supabase";
import { useTheme } from "vuetify";
import { fetchTopicsFromJson } from "@/pages/home/axios/fetchTopics";
import { createTopic } from "@/pages/home/axios/updateTopics";

const theme = useTheme();
const isDarkMode = computed(() => theme.current.value.dark);

const toast = useToast();
const classRecordDialog = ref(false);
const activeSubject = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;
const primaryColor = computed(() => "#004D40");

const classRecordStore = useClassRecordStore();
const recordsStore = useRecordsStore();
const subjects = ref<any[]>([]);

const subjectsStore = useSubjectsStore();
const sectionsStore = useSectionsStore();

const assignedSubjects = ref<any[]>([]);
const currentUserId = ref<string | null>(localStorage.getItem("user_id"));

// Modified to only show subjects assigned to the current user
const subjectOptions = computed(() => {
  return assignedSubjects.value.map((subject) => subject.title);
});

const sectionOptions = computed(() => {
  console.log("Sections in store:", sectionsStore.sections);
  return sectionsStore.sections.map((section) => section.code);
});

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    await sectionsStore.fetchSections();
    await subjectsStore.fetchSubjects();
    await fetchAssignedSubjects();
    await classRecordStore.fetchAllClassRecordsWithDetails();
    subjects.value = classRecordStore.classRecords;
  } catch (error) {
    console.error("Error in mounting:", error);
  } finally {
    isLoading.value = false;
  }
});

// Fetch only the subjects assigned to the current user
async function fetchAssignedSubjects() {
  if (!currentUserId.value) {
    console.error("No user ID found in localStorage");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("asign_subjects")
      .select("subject_id, subjects(*)")
      .eq("user_id", currentUserId.value);

    if (error) {
      console.error("Error fetching assigned subjects:", error);
      assignedSubjects.value = [];
      return;
    }

    // Extract subject details from the joined query
    assignedSubjects.value = data.map((item) => item.subjects);
    console.log("Fetched assigned subjects for user:", assignedSubjects.value);
  } catch (err) {
    console.error("Exception when fetching assigned subjects:", err);
    assignedSubjects.value = [];
  }
}

const totalPages = computed(() => {
  if (isLoading.value) return 0;
  const remainingSubjects = subjects.value.length - 5;
  return 1 + Math.ceil(remainingSubjects / itemsPerPage);
});

const paginatedSubjects = computed(() => {
  if (currentPage.value === 1) {
    return subjects.value.slice(0, 5);
  }
  const start = 5 + (currentPage.value - 2) * itemsPerPage;
  return subjects.value.slice(start, start + itemsPerPage);
});

const getColorClass = (index: number) => {
  const colorClasses = [
    "bg-blue-light",
    "bg-green-light",
    "bg-yellow-light",
    "bg-red-light",
  ];
  return colorClasses[index % colorClasses.length];
};

const subjectRecords = ref<{ [key: string]: any }>({});

const saveClassRecord = async () => {
  const parsedQuarter = parseInt(selectedQuarter.value, 10);

  if (isNaN(parsedQuarter)) {
    console.error("Invalid quarter value");
    return;
  }

  const subjectId = await findSubjectIdForCurrentUser(selectedSubject.value);
  if (!subjectId) {
    toast.error("Selected subject is not assigned to you or doesn't exist.");
    return;
  }

  const sectionId = await sectionsStore.fetchSectionIdByCode(
    selectedSection.value
  );

  if (subjectId === null || sectionId === null) {
    console.error("Invalid subject or section value");
    return;
  }

  try {
    // Add class record
    await classRecordStore.addClassRecord(
      parsedQuarter.toString(),
      subjectId.toString(),
      sectionId.toString()
    );

    // Get the ID of the newly added class record
    const addedClassRecordId = localStorage.getItem("addedClassrecord");
    const classRecordId = parseInt(addedClassRecordId ?? "0", 10);

    if (isNaN(classRecordId)) {
      console.error("Invalid class record ID");
      return;
    }

    // Add student records
    if (!isNaN(sectionId) && !isNaN(classRecordId)) {
      await recordsStore.addRecordsForSection(
        Number(sectionId),
        Number(classRecordId),
        selectedSubject.value
      );
    }

    // Fetch topics from JSON and add them to the database
    try {
      const topicsFromJson = await fetchTopicsFromJson();
      const subjectData = topicsFromJson.find(
        (item) => item.subject.toLowerCase() === selectedSubject.value.toLowerCase()
      );

      if (subjectData && Array.isArray(subjectData.topics)) {
        for (const topicTitle of subjectData.topics) {
          await createTopic(subjectId, topicTitle, classRecordId);
        }
        console.log(`Added ${subjectData.topics.length} topics for ${selectedSubject.value}`);
      } else {
        console.log(`No topics found for subject ${selectedSubject.value} in JSON`);
      }
    } catch (topicError) {
      console.error("Error adding topics:", topicError);
      // Continue without failing the entire process
    }

    // Store selected subject name for later use
    localStorage.setItem("selectedSubjectName", selectedSubject.value);

    classRecordDialog.value = false;

    toast.success("Subject and topics added successfully.", {
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error saving class record:", error);
    toast.error("Failed to add subject. Please try again.", {
      timeout: 3000,
    });
  }
};

// New function to find subject ID while ensuring it's assigned to the current user
async function findSubjectIdForCurrentUser(
  title: string
): Promise<number | null> {
  const assignedSubject = assignedSubjects.value.find(
    (subject) => subject.title === title
  );
  return assignedSubject ? assignedSubject.id : null;
}

const deleteClassRecord = async (classRecordId: number) => {
  await classRecordStore.deleteClassRecord(classRecordId);
  toast.success("Class record deleted successfully.", {
    timeout: 3000,
  });
  window.location.reload();
};

const showAddNewDialog = () => {
  activeSubject.value = "";
  classRecordDialog.value = true;
};

const quarterOptions = ref(["1", "2", "3", "4"]);

const selectedSubject = ref("");
const selectedSection = ref("");
const selectedQuarter = ref("");

const router = useRouter();

const cardDialog = ref(false);
const activeSubjectId = ref<number | null>(null);

const handleCardClick = async (classRecordId: number) => {
  activeSubjectId.value = classRecordId;
  cardDialog.value = true;

  // Fetch and store the selected card's details
  const selectedCard = subjects.value.find(
    (subject) => subject.id === classRecordId
  );
  console.log("Selected Card:", selectedCard);
  if (selectedCard) {
    localStorage.setItem("selectedSection", selectedCard.section);
    localStorage.setItem("selectedQuarter", selectedCard.quarter.toString());
    localStorage.setItem("selectedSubject", selectedCard.subject_id.toString()); // Store subject ID instead of name
    localStorage.setItem("selectedSubjectName", selectedCard.subjectName);
  }
};

const enterRecords = async () => {
  if (activeSubjectId.value !== null) {
    localStorage.setItem("classRecordId", activeSubjectId.value.toString());
    router.push("/recentrecords");
  }
};
</script>

<style scoped>
.subject-card {
  border-radius: 12px;
  transition: 0.3s;
  height: 250px;
  cursor: pointer;
}
.glass-card {
  border-radius: 12px;
}

.subject-card:hover {
  transform: scale(1.03);
}

.subject-title {
  font-weight: bold;
  font-size: 22px;
  text-align: center;
}

.subject-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.bg-blue-light {
  background: #dceeff;
  color: #000;
}

.bg-green-light {
  background: #e8f5e9;
  color: #000;
}

.bg-yellow-light {
  background: #fff3e0;
  color: #000;
}

.bg-red-light {
  background: #ffebee;
  color: #000;
}

.dark-mode .bg-blue-light {
  background: #1e3a5f;
  color: #fff;
}

.dark-mode .bg-green-light {
  background: #1b5e20;
  color: #fff;
}

.dark-mode .bg-yellow-light {
  background: #795548;
  color: #fff;
}

.dark-mode .bg-red-light {
  background: #b71c1c;
  color: #fff;
}

.v-overlay {
  backdrop-filter: blur(4px);
}
.light-mode {
  background: white;
  color: black;
}

.dark-mode {
  background: #f5f5f5;
  color: black;
}

.text-field {
  background-color: transparent !important;
}

.text-field .v-field {
  border: 1px solid rgba(0, 0, 0, 0.23) !important;
  border-radius: 8px !important;
}

.v-theme--dark .text-field .v-field {
  border-color: rgba(255, 255, 255, 0.23) !important;
}

.light-close-btn {
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: red !important;
}

.dark-close-btn {
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white !important;
}
</style>
