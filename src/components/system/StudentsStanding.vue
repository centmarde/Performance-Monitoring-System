<template>
  <v-lazy
    :min-height="200"
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-container>
      <v-row justify="end">
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
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </v-col>
          <v-col
            v-else
            v-for="(students, subject) in paginatedSubjects"
            :key="subject"
            cols="12"
            md="4"
          >
            <v-card class="pa-8 student-box fixed-card">
              <h3 class="text-center font-weight-bold">{{ subject }}</h3>
              <SearchBar class="my-2" v-model="searchQuery[subject]" />
              <span class="text-body-2 my-2 text-center">
                {{ sectionDescriptions[subject] }}<br>
                <small>Teacher: {{ teacherEmails[subject] }}</small>
              </span>
              <v-divider class="mb-2"></v-divider>
              <PerfectScrollbar :options="{ suppressScrollX: true }">
                <div>
                  <v-row
                    v-for="(student, index) in filteredStudents(
                      String(subject)
                    )"
                    :key="student.name"
                    align="center"
                  >
                    <v-col cols="9">{{
                      student.name
                    }}</v-col>
                    <v-col
                      cols="3"
                      class="text-right"
                      :class="getColorClass(student.score)"
                    >
                      {{ student.score }}%
                    </v-col>
                    <v-divider
                      v-if="index < students.length - 1"
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
        v-model="currentPage"
        :length="totalPages"
        :total-visible="5"
        class="mt-4"
      ></v-pagination>
    </v-container>
  </v-lazy>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from "vue";
import { useSectionsStore } from "@/stores/sectionsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import { useTeacherList } from "@/stores/teachersList";
//@ts-ignore
import SearchBar from "@/components/common/SearchBar.vue";

interface Student {
  name: string;
  score: number;
}

export default defineComponent({
  components: {
    SearchBar,
  },
  setup() {
    const sectionsStore = useSectionsStore();
    const studentsStore = useStudentsStore();
    const teacherList = useTeacherList();
    const studentStanding = reactive<Record<string, Student[]>>({});
    const sectionDescriptions = reactive<Record<string, string>>({});
    const teacherEmails = reactive<Record<string, string>>({});
    const searchQuery = reactive<Record<string, string>>({});
    const currentPage = ref<number>(1);
    const subjectsPerPage = 3;
    const loading = ref<boolean>(true);

    onMounted(async () => {
      await sectionsStore.fetchSections();
      await teacherList.fetchTeachersInfo();
      const sections = sectionsStore.sections;
      const teachers = teacherList.userInfo;

      for (const sec of sections) {
        sectionDescriptions[sec.code] = sec.description;
        searchQuery[sec.code] = "";
        const teacher = teachers.find((teacher) => teacher.id === sec.teacher_id);
        teacherEmails[sec.code] = teacher ? teacher.email : "N/A";
        const students = await studentsStore.fetchStudentsBySection(sec.id);
        if (students) {
          studentStanding[sec.code] = await Promise.all(
            students.map(async (student) => {
              try {
                const score = await studentsStore.fetchInitialScore(student.id);
                return {
                  name: `${student.firstname} ${student.lastname}`,
                  score: score || 0,
                };
              } catch (error) {
                console.error(
                  `Error fetching score for student ${student.id}:`,
                  error
                );
                return {
                  name: `${student.firstname} ${student.lastname}`,
                  score: 0,
                };
              }
            })
          );
        }
      }
      loading.value = false;
    });

    const totalPages = computed(() =>
      Math.ceil(Object.keys(studentStanding).length / subjectsPerPage)
    );

    const paginatedSubjects = computed(() => {
      const subjects = Object.keys(studentStanding);
      const start = (currentPage.value - 1) * subjectsPerPage;
      const end = start + subjectsPerPage;
      return Object.fromEntries(
        subjects
          .slice(start, end)
          .map((subject) => [subject, studentStanding[subject]])
      );
    });

    function filteredStudents(subject: string) {
      return studentStanding[subject].filter((student) =>
        student.name
          .toLowerCase()
          .includes(String(searchQuery[subject]).toLowerCase())
      );
    }

    function getColorClass(score: number): string {
      if (score >= 80) return "text-green";
      if (score >= 75) return "text-orange";
      return "text-red";
    }

    return {
      studentStanding,
      getColorClass,
      sectionDescriptions,
      teacherEmails,
      currentPage,
      totalPages,
      paginatedSubjects,
      searchQuery,
      filteredStudents,
      loading,
    };
  },
});
</script>

<style scoped>
.student-box {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5); /* Border to enhance glass effect */
  backdrop-filter: blur(10px); /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  box-shadow: 0 0 10px #004d40; /* Glowing effect */
}

.fixed-card {
  height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.rounded-card {
  border-radius: 12px;
}

.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
