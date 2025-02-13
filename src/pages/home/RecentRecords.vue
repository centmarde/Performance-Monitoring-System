<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <v-row justify="end">
          <v-col>
            <router-link to="/data_entry">
              <v-btn color="#004D40"><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
            </router-link>
          </v-col>
          <v-col cols="4" class="mb-3">
            <SearchBar v-model="searchQuery" />
          </v-col>
        </v-row>

        <v-card class="class-record-card pa-4">
          <v-card-title class="text-h6">Class Record</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th
                    rowspan="3"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Student ID
                  </th>
                  <th
                    rowspan="3"
                    style="
                      width: 100px;
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Name
                  </th>
                  <th
                    colspan="10"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Written Works
                  </th>
                  <th
                    colspan="3"
                    rowspan="2"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Summary
                  </th>
                  <th
                    colspan="10"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Performance Task
                  </th>
                  <th
                    colspan="3"
                    rowspan="2"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Summary
                  </th>
                  <th
                    colspan="3"
                    rowspan="2"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Quarterly Assessment
                  </th>
                  <th
                    rowspan="3"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Initial Grade
                  </th>
                  <th
                    rowspan="3"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Quarterly Grade
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="header in wwHeaders"
                    :key="header.value"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    {{ header.text }}
                  </th>
                  <th
                    v-for="header in ptHeaders"
                    :key="header.value"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    {{ header.text }}
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="header in wwHeaders"
                    :key="header.value"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    {{ header.points }}
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Total
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    PS
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    WS
                  </th>
                  <th
                    v-for="header in ptHeaders"
                    :key="header.value"
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    {{ header.points }}
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    Total
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    PS
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    WS
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    1
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    PS
                  </th>
                  <th
                    style="
                      background: #004d40;
                      color: white;
                      padding: 14px;
                      border: 1px solid #00796b;
                      text-align: center;
                      font-weight: bold;
                      position: sticky;
                      top: 0;
                      z-index: 2;
                    "
                  >
                    WS
                  </th>
                </tr>
              </thead>
              <tbody>
                <div v-if="!jsondata || jsondata.length === 0">
                  <div style="position: absolute" :colspan="tableColumnCount">
                    <br />
                    This class record has no records yet.
                  </div>
                </div>
                <tr v-for="item in paginatedData" :key="item.id">
                  <td>
                    <input
                      v-model="item.id"
                      disabled
                      style="
                        width: 30px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.name"
                      style="
                        width: 100px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td v-for="n in 10" :key="'ww' + n">
                    <input
                      v-model="item['ww' + n]"
                      type="number"
                      min="0"
                      max="100"
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.wwTotal"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.wwps"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.wwws"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td v-for="n in 10" :key="'pt' + n">
                    <input
                      v-model="item['pt' + n]"
                      type="number"
                      min="0"
                      max="100"
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.ptTotal"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.ptps"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.ptws"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.qa1"
                      type="number"
                      min="0"
                      max="100"
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.qaps"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.qaws"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.initial_grade"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <td>
                    <input
                      v-model="item.quarterly_grade"
                      disabled
                      style="
                        width: 50px;
                        height: 24px;
                        text-align: center;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 4px;
                        font-size: 14px;
                      "
                    />
                  </td>
                  <button
                    class="save-btn"
                    @click="saveChanges(item)"
                    style="display: none"
                  >
                    Save
                  </button>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

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
import { ref, computed, onMounted } from "vue";
import { useRecordsStore } from "@/stores/recordsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import SearchBar from "@/components/common/SearchBar.vue";
import { supabase } from "@/lib/supabase";

const jsondata = ref([]);
const recordsStore = useRecordsStore();
const studentsStore = useStudentsStore();
const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = 5;

const wwHeaders = [
  { text: "1", value: "ww1", points: "100%" },
  { text: "2", value: "ww2", points: "100%" },
  { text: "3", value: "ww3", points: "100%" },
  { text: "4", value: "ww4", points: "100%" },
  { text: "5", value: "ww5", points: "100%" },
  { text: "6", value: "ww6", points: "100%" },
  { text: "7", value: "ww7", points: "100%" },
  { text: "8", value: "ww8", points: "100%" },
  { text: "9", value: "ww9", points: "100%" },
  { text: "10", value: "ww10", points: "100%" },
];

const ptHeaders = [
  { text: "1", value: "pt1", points: "100%" },
  { text: "2", value: "pt2", points: "100%" },
  { text: "3", value: "pt3", points: "100%" },
  { text: "4", value: "pt4", points: "100%" },
  { text: "5", value: "pt5", points: "100%" },
  { text: "6", value: "pt6", points: "100%" },
  { text: "7", value: "pt7", points: "100%" },
  { text: "8", value: "pt8", points: "100%" },
  { text: "9", value: "pt9", points: "100%" },
  { text: "10", value: "pt10", points: "100%" },
];

const filteredData = computed(() => {
  return jsondata.value.filter((item) =>
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
watch(searchQuery, () => {
  page.value = 1;
});

const saveChanges = async (item) => {
  try {
    const { error } = await supabase
      .from("records")
      .update({
        ww1: item.ww1,
        ww2: item.ww2,
        ww3: item.ww3,
        ww4: item.ww4,
        ww5: item.ww5,
        ww6: item.ww6,
        ww7: item.ww7,
        ww8: item.ww8,
        ww9: item.ww9,
        ww10: item.ww10,
        pt1: item.pt1,
        pt2: item.pt2,
        pt3: item.pt3,
        pt4: item.pt4,
        pt5: item.pt5,
        pt6: item.pt6,
        pt7: item.pt7,
        pt8: item.pt8,
        pt9: item.pt9,
        pt10: item.pt10,
        qa1: item.qa1,
      })
      .eq("student_id", item.id);

    if (error) {
      console.error("Error updating record:", error);
    } else {
      console.log("Record updated successfully");
    }
  } catch (error) {
    console.error("Error saving changes:", error);
  }
};

const fetchGradeCalculations = async (classRecordId) => {
  const { data: records, error } = await supabase
    .from("calculate_initial_grade")
    .select("*")
    .eq("class_record_id", Number(classRecordId));

  if (error) {
    console.error("Error fetching grade calculations:", error);
    return [];
  }

  return records.map((record) => ({
    student_id: record.id,
    ww_weighted_score: record.ww_weighted_score,
    pt_weighted_score: record.pt_weighted_score,
    qa_weighted_score: record.qa_weighted_score,
    initial_grade: record.initial_grade,
    quarterly_grade: record.initial_grade,
  }));
};

const fetchRecords = async () => {
  const classRecordId = localStorage.getItem("classRecordId");
  if (classRecordId) {
    console.log("Class Record ID:", classRecordId);
    const records = await recordsStore.fetchRecordsByClassRecordId(
      Number(classRecordId)
    );
    if (!records || records.length === 0) {
      console.log("This class record has no records yet.");
    } else {
      const gradeCalculations = await fetchGradeCalculations(classRecordId);
      jsondata.value = records.map((record) => {
        const gradeCalculation =
          gradeCalculations.find((gc) => gc.student_id === record.id) || {};
        const item = {
          id: record.student_id,
          name: `${record.students.firstname} ${record.students.lastname}`,
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
          wwTotal:
            record.ww1 +
            record.ww2 +
            record.ww3 +
            record.ww4 +
            record.ww5 +
            record.ww6 +
            record.ww7 +
            record.ww8 +
            record.ww9 +
            record.ww10,
          ptTotal:
            record.pt1 +
            record.pt2 +
            record.pt3 +
            record.pt4 +
            record.pt5 +
            record.pt6 +
            record.pt7 +
            record.pt8 +
            record.pt9 +
            record.pt10,
          qaTotal: record.qa1,
          wwps: gradeCalculation.ww_weighted_score || 0,
          ptps: gradeCalculation.pt_weighted_score || 0,
          ptws: gradeCalculation.pt_weighted_score || 0,
          qaps: gradeCalculation.qa_weighted_score || 0,
          qaws: gradeCalculation.qa_weighted_score || 0,
          initial_grade: gradeCalculation.initial_grade || 0,
          quarterly_grade: gradeCalculation.initial_grade || 0,
        };
        return item;
      });
    }
  } else {
    console.log("No class record ID found in local storage.");
  }
};

const clickSaveButtons = () => {
  document.querySelectorAll(".save-btn").forEach((button) => button.click());
};

const startAutoSave = () => {
  setInterval(async () => {
    await fetchRecords();
  }, 10000);

  setInterval(() => {
    clickSaveButtons();
  }, 5000);
};

onMounted(async () => {
  await fetchRecords();
  await studentsStore.fetchAllStudents();
  startAutoSave();
});
</script>

<style scoped>
.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #ffffff;
  /* White background */
  color: black;
  display: block;
  overflow-x: auto;
  /* Enable horizontal scrolling */
  white-space: nowrap;
  /* Prevent table cells from wrapping */
}

/* Table Headers */
.styled-table th {
  background: #004d40;
  /* Deep teal for contrast */
  color: white;
  padding: 14px;
  border: 1px solid #00796b;
  text-align: center;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Table Body */
.styled-table td {
  padding: 12px;
  border: 1px solid #00796b;
  text-align: center;
}

/* Alternate row colors for better readability */
.styled-table tbody tr:nth-child(even) {
  background-color: #f1f8e9;
  /* Light green */
}

/* Input Fields */
.styled-table input {
  width: 50px;
  /* Increased width for better usability */
  height: 36px;
  /* Increased height for better readability */
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  font-size: 16px;
  /* Bigger font for readability */
}
.class-record-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5); /* Border to enhance glass effect */
  backdrop-filter: blur(10px); /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  box-shadow: 0 0 10px #004d40; /* Glowing effect */
}

/* Responsive Design */
@media (max-width: 768px) {
  .styled-table input {
    width: 100px;
    /* Slightly smaller for mobile */
    height: 32px;
    font-size: 14px;
  }
}
</style>
