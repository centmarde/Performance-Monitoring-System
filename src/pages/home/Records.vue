<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="end">
          <v-col cols="4">
            <SearchBar v-model="searchQuery" />
          </v-col>
        </v-row>
        <table class="styled-table">
          <thead>
            <tr>
              <th rowspan="2">Student ID</th>
              <th rowspan="2">Name</th>
              <th colspan="10">Written Works</th>
              <th rowspan="2">Total</th>
              <th rowspan="2">PS</th>
              <th rowspan="2">WS</th>
              <th colspan="10">Performance Task</th>
              <th rowspan="2">Total</th>
              <th rowspan="2">PS</th>
              <th rowspan="2">WS</th>
              <th colspan="3">Quarterly Assessment</th> <!-- Parent Column -->
              <th rowspan="2">Initial Grade</th>
              <th rowspan="2">Quarterly Grade</th>
              <th rowspan="2">Actions</th>
            </tr>
            <tr>
              <th v-for="header in wwHeaders" :key="header.value">{{ header.text }}</th>
              <th v-for="header in ptHeaders" :key="header.value">{{ header.text }}</th>
              <th>1</th> <!-- Quarterly Assessment Score -->
              <th>PS</th> 
              <th>WS</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
              <td><input v-model="item.id" disabled /></td>
              <td><input v-model="item.name" style="width: 100px;" /></td>
              <td v-for="n in 10" :key="'ww' + n">
                <input v-model="item['ww' + n]" />
              </td>
              <td><input v-model="item.wwTotal" disabled /></td>
              <td><input v-model="item.wwps" disabled /></td>
              <td><input v-model="item.wwws" disabled /></td>
              <td v-for="n in 10" :key="'pt' + n">
                <input v-model="item['pt' + n]" />
              </td>
              <td><input v-model="item.ptTotal" disabled /></td>
              <td><input v-model="item.ptps" disabled /></td>
              <td><input v-model="item.ptws" disabled /></td>
              <td><input v-model="item.qa1" /></td> <!-- Quarterly Assessment Score -->
              <td><input v-model="item.qaps" disabled /></td>
              <td><input v-model="item.qaws" disabled /></td>
              <td><input v-model="item.initial_grade" /></td>
              <td><input v-model="item.quarterly_grade" /></td>
              <td><v-btn @click="saveChanges(item)">Save</v-btn></td>
            </tr>
          </tbody>
        </table>
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="5"
          class="mt-4"
        ></v-pagination>
      </v-container>
    </template>
  </HomeLayout>
</template>



<script setup>
import HomeLayout from "@/layouts/HomeLayout.vue";
import { ref, computed, onMounted } from 'vue';
import { useRecordsStore } from '@/stores/recordsStore';
import { useStudentsStore } from '@/stores/studentsStore';
import SearchBar from '@/components/common/SearchBar.vue';
import { useGradeCalculations } from '@/composables/useGradeCalculations.js';

const { calculateWWPS, calculatePTPS, calculatePTWS, calculateQATS, calculateQAWS, calculateInitialGrade, calculateQuarterlyGrade } = useGradeCalculations();

const jsondata = ref([]);
const recordsStore = useRecordsStore();
const studentsStore = useStudentsStore();
const searchQuery = ref('');
const page = ref(1);
const itemsPerPage = 5;

const wwHeaders = [
  { text: '1', value: 'ww1' },
  { text: '2', value: 'ww2' },
  { text: '3', value: 'ww3' },
  { text: '4', value: 'ww4' },
  { text: '5', value: 'ww5' },
  { text: '6', value: 'ww6' },
  { text: '7', value: 'ww7' },
  { text: '8', value: 'ww8' },
  { text: '9', value: 'ww9' },
  { text: '10', value: 'ww10' },
];

const ptHeaders = [
  { text: '1', value: 'pt1' },
  { text: '2', value: 'pt2' },
  { text: '3', value: 'pt3' },
  { text: '4', value: 'pt4' },
  { text: '5', value: 'pt5' },
  { text: '6', value: 'pt6' },
  { text: '7', value: 'pt7' },
  { text: '8', value: 'pt8' },
  { text: '9', value: 'pt9' },
  { text: '10', value: 'pt10' },
];

const filteredData = computed(() => {
  return jsondata.value.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredData.value.slice(start, end);
});

const pageCount = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage);
});

const saveChanges = async (item) => {
  item.wwps = calculateWWPS(item);
  item.ptps = calculatePTPS(item);
  item.ptws = calculatePTWS(item);
  item.qaps = calculateQATS(item);
  item.qaws = calculateQAWS(item);
  item.initial_grade = calculateInitialGrade(item);
  item.quarterly_grade = calculateQuarterlyGrade(item);
  await recordsStore.updateRecord(item);
};

onMounted(async () => {
  const records = await recordsStore.fetchAllRecords();
  const students = await studentsStore.fetchAllStudents();

  if (records && students) {
    jsondata.value = records.map(record => {
      const student = students.find(s => s.id === record.student_id);
      const item = {
        id: record.student_id,
        name: student ? `${student.firstname} ${student.lastname}` : '',
        ww1: record.ww1,
        ww2: record.ww2,
        ww3: record.ww3,
        ww4: record.ww4,
        ww5: record.ww5,
        ww6: record.ww6,
        ww7: record.ww7,
        ww8: record.ww8,
        ww9: record.ww9,
        ww10: record.ww10,
        pt1: record.pt1,
        pt2: record.pt2,
        pt3: record.pt3,
        pt4: record.pt4,
        pt5: record.pt5,
        pt6: record.pt6,
        pt7: record.pt7,
        pt8: record.pt8,
        pt9: record.pt9,
        pt10: record.pt10,
        qa1: record.qa1,
        wwTotal: record.ww1 + record.ww2 + record.ww3 + record.ww4 + record.ww5 + record.ww6 + record.ww7 + record.ww8 + record.ww9 + record.ww10,
        ptTotal: record.pt1 + record.pt2 + record.pt3 + record.pt4 + record.pt5 + record.pt6 + record.pt7 + record.pt8 + record.pt9 + record.pt10,
        qaTotal: record.qa1,
        wwps: calculateWWPS(record),
        ptps: calculatePTPS(record),
        ptws: calculatePTWS(record),
        qaps: calculateQATS(record),
        qaws: calculateQAWS(record),
        initial_grade: calculateInitialGrade(record),
        quarterly_grade: calculateQuarterlyGrade(record)
      };
      return item;
    });
  }
});
</script>


<style scoped>
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #FFFFFF; /* White background */
  color: black;
  display: block;
  overflow-x: auto; /* Enable horizontal scrolling */
  white-space: nowrap; /* Prevent table cells from wrapping */
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border: 1px solid #00796b; /* Darker teal border */
}

.styled-table th {
  background: #00695c; /* Darker teal for contrast */
  color: white;
}

.styled-table input {
  width: 50px; /* Smaller input size */
  padding:1px; /* Adjust padding for smaller input */
}
</style>
