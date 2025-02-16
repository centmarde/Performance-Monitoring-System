<template>
  <v-container>
    <v-row justify="start">
        <v-col cols="auto">
          <v-card class="pa-3 rounded-card glass-card">
            <h4 class="font-weight-bold text-end">
              <span class="mdi mdi-account-school"></span> Welcome to Dashboard <v-icon><i class="mdi mdi-hand-wave:"></i></v-icon>
            </h4>
          </v-card>
        </v-col>
      </v-row>
    <v-row>
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="3">
        <v-card :class="card.color" class="pa-4 rounded-lg">
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="text-subtitle-1 font-weight-bold">{{ card.title }}</span>
            <v-icon>{{ card.icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            <v-progress-circular
              v-if="card.loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <h2 v-else class="text-h4 font-weight-bold">{{ card.value }}</h2>
            <div v-if="card.change" class="text-caption" :class="card.change > 0 ? 'text-success' : 'text-error'">
              {{ card.change > 0 ? '+' : '' }}{{ card.change }}% than last week
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useTeacherList } from '@/stores/teachersList';
import { useSubjectsStore } from '@/stores/subjectsStore';
import { useStudentsStore } from '@/stores/studentsStore';
import { useSectionsStore } from '@/stores/sectionsStore';
import { useRecordsStore } from '@/stores/recordsStore';
import { useClassRecordStore } from '@/stores/classRecord';

export default {
  data() {
    return {
      cards: [
        { title: 'Teachers', value: 0, icon: 'mdi-account-school', color: 'bg-orange-lighten-5', change: 0, loading: true },
        { title: 'Subjects', value: 0, icon: 'mdi-book-open', color: 'bg-green-lighten-5', change: 0, loading: true },
        { title: 'Students', value: 0, icon: 'mdi-account', color: 'bg-grey-lighten-4', change: 0, loading: true },
        { title: 'Sections', value: 0, icon: 'mdi-view-grid', color: 'bg-teal-lighten-5', change: 0, loading: true },
        { title: 'Records', value: 0, icon: 'mdi-file-document', color: 'bg-blue-lighten-5', change: 0, loading: true },
        { title: 'Class Records', value: 0, icon: 'mdi-clipboard-text', color: 'bg-yellow-lighten-5', change: 0, loading: true },
        { title: 'Missed Activities', value: 0, icon: 'mdi-alert', color: 'bg-red-lighten-5', change: 0, loading: true },
        { title: 'Passed Students', value: 1, icon: 'mdi-check', color: 'bg-grey-lighten-5', change: 0, loading: true },
      ]
    };
  },
  async created() {
    const teacherStore = useTeacherList();
    const subjectsStore = useSubjectsStore();
    const studentsStore = useStudentsStore();
    const sectionsStore = useSectionsStore();
    const recordsStore = useRecordsStore();
    const classRecordStore = useClassRecordStore();

    await teacherStore.fetchTeachersInfo();
    await subjectsStore.fetchSubjects();
    await studentsStore.fetchAllStudents();
    await sectionsStore.fetchSections();
    await recordsStore.fetchAllRecords();
    await classRecordStore.fetchClassRecords();

    this.cards[0].value = teacherStore.teacherCount;
    this.cards[1].value = subjectsStore.subjectCount;
    this.cards[2].value = studentsStore.studentCount;
    this.cards[3].value = sectionsStore.sectionCount;
    this.cards[4].value = recordsStore.recordCount;
    this.cards[5].value = classRecordStore.classRecordCount;

    const missedActivities = await recordsStore.countMissedActivities();
    this.cards[6].value = missedActivities.length;
    
    const passedStudents = await recordsStore.countPassedStudents();
    this.cards[7].value = passedStudents;

    this.cards.forEach(card => {
      card.change = (Math.random() * 40 - 20).toFixed(1);
      card.loading = false;
    });
  }
};
</script>

<style>

.glass-card {
  background: rgba(0, 105, 92, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
}
.smallFont{
  font-size: 10px;
}
</style>
