<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="start">
          <v-col cols="auto">
            <v-card class="pa-3 rounded-card glass-card">
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

          <!-- Subject Cards with Pagination -->
          <v-col
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
                      <div class="subject-info d-flex align-center">
                        <v-icon size="20" color="teal-darken-4"
                          >mdi-account-tie</v-icon
                        >
                        <span
                          >Handled by:
                          <strong>{{ subject.handled_by }}</strong>
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagination Control -->
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          class="mt-4 d-flex justify-center"
        ></v-pagination>

        <!-- Class Record Dialog -->
        <v-dialog v-model="classRecordDialog" max-width="900px">
          <v-card
            class="pa-5 rounded-xl elevation-10"
            style="
              background: rgba(255, 255, 255, 0.15);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            "
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
                      class="rounded-lg"
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
                      class="rounded-lg"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Quarter"
                      :items="quarterOptions"
                      v-model="selectedQuarter"
                      variant="outlined"
                      class="rounded-lg"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <!-- Divider -->
            <v-divider
              style="border-color: rgba(255, 255, 255, 0.2)"
            ></v-divider>

            <!-- Actions -->
            <v-card-actions class="d-flex justify-end">
              <v-btn
                v-if="!activeSubject"
                variant="flat"
                class="text-white rounded-lg shadow-md"
                style="
                  background: linear-gradient(135deg, #43a047, #2e7d32);
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
                class="text-white rounded-lg shadow-md"
                style="
                  border: 1px solid rgba(255, 255, 255, 0.3);
                  transition: 0.3s ease-in-out;
                  font-size: 16px;
                "
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
                background: linear-gradient(135deg, #1976d2, #1565c0);
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
                        background: linear-gradient(135deg, #43a047, #2e7d32);
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
            <v-card class="pa-3 rounded-card glass-card">
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import HomeLayout from "@/layouts/HomeLayout.vue";
import { useClassRecordStore } from "@/stores/classRecord";
import { useSubjectsStore } from "@/stores/subjectsStore";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useRecordsStore } from "@/stores/recordsStore";
import { useToast } from "vue-toastification";

const toast = useToast();
const classRecordDialog = ref(false);
const activeSubject = ref("");
const currentPage = ref(1);
const itemsPerPage = 6;

const classRecordStore = useClassRecordStore();
const recordsStore = useRecordsStore();
const subjects = ref<any[]>([]);

const subjectsStore = useSubjectsStore();
const sectionsStore = useSectionsStore();

const subjectOptions = computed(() =>
  subjectsStore.subjects.map((subject) => subject.title)
);
const sectionOptions = computed(() =>
  sectionsStore.sections.map((section) => section.code)
);

onMounted(async () => {
  await classRecordStore.fetchAllClassRecordsWithDetails();
  subjects.value = classRecordStore.classRecords;
  await subjectsStore.fetchSubjects();
  await sectionsStore.fetchSections();
});

const totalPages = computed(() => {
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

  const subjectId = await subjectsStore.fetchSubjectIdByTitle(
    selectedSubject.value
  );
  const sectionId = await sectionsStore.fetchSectionIdByCode(
    selectedSection.value
  );

  if (subjectId === null || sectionId === null) {
    console.error("Invalid subject or section value");
    return;
  }

  await classRecordStore.addClassRecord(
    parsedQuarter.toString(),
    subjectId.toString(),
    sectionId.toString()
  );

  const addedClassRecordId = localStorage.getItem("addedClassrecord");
  const classRecordId = parseInt(addedClassRecordId ?? "0", 10);

  if (!isNaN(sectionId) && !isNaN(classRecordId)) {
    await recordsStore.addRecordsForSection(sectionId, classRecordId);
  } else {
    console.error("Invalid section or class record ID");
  }

  classRecordDialog.value = false;

  toast.success("Subject added successfully!", {
    timeout: 3000,
  });
};

const deleteClassRecord = async (classRecordId: number) => {
  await classRecordStore.deleteClassRecord(classRecordId);
  toast.success("Class record deleted successfully!", {
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

const handleCardClick = (classRecordId: number) => {
  activeSubjectId.value = classRecordId;
  cardDialog.value = true;
};

const enterRecords = () => {
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

/* Light Mode Colors */
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

/* Dark Mode Colors */
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
</style>
