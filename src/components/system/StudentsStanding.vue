<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-container>
      <v-row justify="start">
        <v-col cols="auto">
          <v-card class="pa-3 rounded-card glass-card">
            <h4 class="font-weight-bold text-end">
              <span class="mdi mdi-account-school"></span> Student's Standing
            </h4>
          </v-card>
        </v-col>
      </v-row>

      <v-scale-transition mode="out-in">
        <v-row :key="currentPage">
          <v-col v-if="loading" cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
          <v-col v-else-if="paginatedRecords.length === 0" cols="12">
            <v-card class="pa-8 text-center">
              <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
              <h3 class="mt-4 text-grey-darken-1">
                Oh no! You have no sections and subjects assigned.
              </h3>
              <p class="text-grey">
                Please contact your administrator to assign sections and
                subjects to you.
              </p>
            </v-card>
          </v-col>
          <v-col
            v-else
            v-for="record in paginatedRecords"
            :key="record.id"
            cols="12"
            md="4"
          >
            <v-card class="pa-8 student-box fixed-card" color="#E8F5E9">
              <h3 class="text-center font-weight-bold">
                Section: {{ record.section }}
              </h3>
              <div class="search-bar-container">
                <SearchBar class="my-5" v-model="searchQuery[record.id]" />
              </div>
              <span class="text-body-2 my-2 text-center">
                <!--  <small>Teacher: {{ record.handled_by }}</small><br> -->
                <small>Quarter: {{ record.quarter }}</small
                ><br />
                <small>Total Students: {{ record.student_count }}</small>
              </span>
              <v-divider class="mb-2"></v-divider>
              <PerfectScrollbar :options="{ suppressScrollX: true }">
                <div>
                  <v-row
                    v-for="(student, index) in filteredStudents(record.id)"
                    :key="student.name"
                    align="center"
                  >
                    <v-col cols="9">{{ student.name }}</v-col>
                    <v-col
                      cols="3"
                      class="text-right"
                      :class="getColorClass(student.initialGrade)"
                    >
                      <span class="smallFont">{{ student.initialGrade }}%</span>
                    </v-col>
                    <v-divider
                      v-if="index < (record.students?.length || 0) - 1"
                      class="my-1"
                    ></v-divider>
                  </v-row>
                </div>
              </PerfectScrollbar>
            </v-card>
          </v-col>
        </v-row>
      </v-scale-transition>

      <v-pagination
        v-if="paginatedRecords.length > 0"
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        class="mt-4"
      >
      </v-pagination>
    </v-container>
  </v-lazy>
</template>

<script>
import { defineComponent, reactive, ref, computed, onMounted } from "vue";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import { useTeacherList } from "@/stores/teachersList";
import { useRecordsStore } from "@/stores/recordsStore";
import SearchBar from "@/components/common/SearchBar.vue";
import { supabase } from "@/lib/supabase";
import { useAuthUserStore } from "@/stores/authUser";

export default defineComponent({
  components: {
    SearchBar,
  },
  setup() {
    const sectionsStore = useSectionsStore();
    const studentsStore = useStudentsStore();
    const teacherList = useTeacherList();
    const recordsStore = useRecordsStore();
    const studentStanding = reactive({});
    const searchQuery = reactive({});
    const currentPage = ref(1);
    const recordsPerPage = 3;
    const loading = ref(true);
    const classRecords = ref([]);

    onMounted(async () => {
      await sectionsStore.fetchSections();
      await teacherList.fetchTeachersInfo();
      await fetchAllClassRecordsWithDetails();

      for (const record of classRecords.value) {
        searchQuery[record.id] = "";
        await fetchStudentsByClassRecord(record.id, record.section_id);
        studentStanding[record.id] = recordsStore.students;
      }
      loading.value = false;
    });

    const totalPages = computed(() =>
      Math.ceil(classRecords.value.length / recordsPerPage)
    );

    const paginatedRecords = computed(() => {
      const start = (currentPage.value - 1) * recordsPerPage;
      const end = start + recordsPerPage;
      return classRecords.value.slice(start, end);
    });

    function filteredStudents(recordId) {
      return (
        studentStanding[recordId]?.filter((student) =>
          student.name
            .toLowerCase()
            .includes(String(searchQuery[recordId]).toLowerCase())
        ) || []
      );
    }

    async function fetchAllClassRecordsWithDetails() {
      loading.value = true;
      const userId = localStorage.getItem("user_id");
      const { data, error } = await supabase
        .from("class_record")
        .select(
          `
          id, quarter, created_at, section_id,
          subjects (title),
          sections (code, id),
          users (email),
          records (student_id, initial_grade)
        `
        )
        .order("created_at", { ascending: false })
        .eq("teacher_id", userId);

      if (error) {
        console.error(error.message);
      } else {
        classRecords.value = data.map((record) => ({
          ...record,
          subjectName: record.subjects.title,
          section: record.sections.code,
          handled_by: record.users.email,
          quarter: record.quarter,
          student_count: record.records.length,
        }));
      }
      loading.value = false;
    }

    async function fetchStudentsByClassRecord(classRecordId, sectionId) {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("section_id", sectionId);

      if (error) {
        console.error(error.message);
      } else {
        recordsStore.students = await Promise.all(
          data.map(async (student) => {
            const { data: record, error: recordError } = await supabase
              .from("records")
              .select("initial_grade")
              .eq("student_id", student.id)
              .eq("class_record_id", classRecordId)
              .single();

            return {
              name: `${student.firstname} ${student.lastname}`,
              initialGrade: record?.initial_grade || 0,
            };
          })
        );
      }
    }

    function getColorClass(score) {
      if (score >= 80) return "text-green";
      if (score >= 75) return "text-orange";
      return "text-red";
    }

    return {
      studentStanding,
      getColorClass,
      currentPage,
      totalPages,
      paginatedRecords,
      searchQuery,
      filteredStudents,
      loading,
      classRecords,
    };
  },
});
</script>

<style scoped>
.student-box {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 0 10px #004d40;
}

.fixed-card {
  height: 35rem;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar-container {
  margin-bottom: -23px;
}

.rounded-card {
  border-radius: 12px;
  color: #004d40;
}

.glass-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.smallFont {
  font-size: 10px;
}
</style>
