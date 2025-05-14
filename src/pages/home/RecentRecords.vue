<script setup>
import HomeLayout from "@/layouts/HomeLayout.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRecordsStore } from "@/stores/recordsStore";
import { useStudentsStore } from "@/stores/studentsStore";
import SearchBar from "@/components/common/SearchBar.vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";
import { getTopicsForSubject } from "./axios/fetchTopics";
import { updateTopicTitle, getTopicsWithIds, createTopic, deleteTopic } from "./axios/updateTopics";

const router = useRouter();

const navigateToTracking = async (item) => {
  // Get values from localStorage
  const section = localStorage.getItem("selectedSection");
  const quarter = localStorage.getItem("selectedQuarter");
  const subjectId = localStorage.getItem("selectedSubject");
  const classRecordId = localStorage.getItem("classRecordId");
  
  // Fetch both topics and their IDs
  let topicNames = [];
  let topicIdsMap = {}; // Will store topic name -> id mapping
  
  try {
    if (subjectId) {
      const parsedSubjectId = parseInt(subjectId);
      const parsedClassRecordId = classRecordId ? parseInt(classRecordId) : null;
      
      // Get topics with their IDs first
      const topicsWithIds = await getTopicsWithIds(parsedSubjectId);
      
      // Then get the topic details including titles
      const topics = await getTopicsForSubject(
        localStorage.getItem("selectedSubjectName"),
        parsedSubjectId,
        parsedClassRecordId
      );
      
      // Create a map of topic titles to their IDs
      if (topicsWithIds && topicsWithIds.length > 0) {
        topicsWithIds.forEach(topic => {
          if (topic && topic.title) {
            topicIdsMap[topic.title] = topic.id;
          }
        });
      }
      
      // Filter and extract topic names as before
      topicNames = topics
        .filter(topic => typeof topic === 'object' ? topic.title : topic)
        .map(topic => typeof topic === 'object' ? topic.title : topic)
        .filter(title => title && title.trim() !== "");
    }
  } catch (error) {
    console.error("Error fetching topic data:", error);
  }

  // Serialize both the topic names and their IDs map
  const serializedTopicNames = JSON.stringify(topicNames);
  const serializedTopicIds = JSON.stringify(topicIdsMap);

  // Navigate with both sets of data
  router.push({
    path: "/tracking",
    query: {
      topicNames: serializedTopicNames,
      topicIds: serializedTopicIds,
      studentId: item.id,
      name: item.name,
      wwTotal: item.wwTotal,
      ptTotal: item.ptTotal,
      qaTotal: item.qa1,
      quarterly_grade: item.quarterly_grade,
      section: section,
      quarter: quarter,
      subject: subjectId,
    },
  });
};

const jsondata = ref([]);
const recordsStore = useRecordsStore();
const studentsStore = useStudentsStore();
const searchQuery = ref("");
const page = ref(1);
const itemsPerPage = 5;

const wwHeaders = ref([
  { text: "Topic1", value: "topic1", points: "100%", expanded: false, id: null, editing: false },
  { text: "Topic2", value: "topic2", points: "100%", expanded: false, id: null, editing: false },
  { text: "Topic3", value: "topic3", points: "100%", expanded: false, id: null, editing: false },
  { text: "Topic4", value: "topic4", points: "100%", expanded: false, id: null, editing: false },
  { text: "Topic5", value: "topic5", points: "100%", expanded: false, id: null, editing: false },
]);

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
        topic1: item.topic1,
        topic2: item.topic2,
        topic3: item.topic3,
        topic4: item.topic4,
        topic5: item.topic5,

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
        initial_grade: item.initial_grade,
      })
      .eq("student_id", item.id);

    if (error) {
      console.error("Error updating record:", error);
    } else {
      console.log("Record updated successfully.");
    }
  } catch (error) {
    console.error("Error saving changes:", error);
  }
};
const getGradeClass = (grade) => {
  if (grade < 75) return "fail";
  /* if (grade >= 90) return "excellent";
  if (grade >= 80) return "good"; */
  if (grade >= 75 && grade < 80) return "almost-fail";
  return "";
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
      jsondata.value = records
        .map((record) => {
          const gradeCalculation =
            gradeCalculations.find((gc) => gc.student_id === record.id) || {};
          const item = {
            id: record.student_id,
            name: record.students
              ? `${record.students.firstname} ${record.students.lastname}`
              : "Unknown",
            topic1: record.topic1,
            topic2: record.topic2,
            topic3: record.topic3,
            topic4: record.topic4,
            topic5: record.topic5,

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
              record.topic1 +
              record.topic2 +
              record.topic3 +
              record.topic4 +
              record.topic5,

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
            wwws: "40%",
            wwps: gradeCalculation.ww_weighted_score || 0,
            ptps: gradeCalculation.pt_weighted_score || 0,
            ptws: "40%",
            qaps: gradeCalculation.qa_weighted_score || 0,
            qaws: "20%",
            initial_grade: gradeCalculation.initial_grade || 0,
            quarterly_grade: gradeCalculation.initial_grade || 0,
          };
          return item;
        })
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
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
  }, 8000);

  setInterval(() => {
    clickSaveButtons();
  }, 2000);
};

const updateTopicHeaders = async () => {
  const subjectId = localStorage.getItem("selectedSubject");
  const subjectName = localStorage.getItem("selectedSubjectName");
  const classRecordId = localStorage.getItem("classRecordId");

  if (subjectName) {
    try {
      // First get topics with IDs if subject ID is available
      let topics = [];
      let topicsWithIds = [];
      
      if (subjectId) {
        // Pass both subject ID and class record ID
        const parsedSubjectId = parseInt(subjectId);
        const parsedClassRecordId = classRecordId ? parseInt(classRecordId) : null;
        
        topicsWithIds = await getTopicsWithIds(parsedSubjectId);
        topics = await getTopicsForSubject(
          subjectName,
          parsedSubjectId,
          parsedClassRecordId
        );
      }

      // If no topics with IDs, fall back to simple topic list
      if (topics.length === 0) {
        topics = await getTopicsForSubject(
          subjectName,
          subjectId ? parseInt(subjectId) : null
        );
      }

      // If topics are found, update the wwHeaders
      if (topics.length > 0) {
        // Use up to the number of available topics
        const topicsToUse = topics.slice(0, Math.min(topics.length, wwHeaders.value.length));

        // Update headers with topics and their IDs
        wwHeaders.value = wwHeaders.value.map((header, index) => {
          if (index < topicsToUse.length) {
            const topicText = typeof topics[index] === 'string' ? topics[index] : topics[index]?.title || "";
            const topicId = topicsWithIds[index]?.id || null;
            
            return {
              text: topicText,
              value: `topic${index + 1}`,
              points: "100%",
              expanded: header.expanded,
              disabled: false,
              id: topicId,
              editing: false
            };
          } else {
            // Keep empty slots for additional topics
            return {
              text: "",
              value: `topic${index + 1}`,
              points: "100%",
              expanded: header.expanded,
              disabled: true,
              id: null,
              editing: false
            };
          }
        });

        console.log("Updated topic headers:", wwHeaders.value);
      }
    } catch (error) {
      console.error("Error updating topic headers:", error);
    }
  }
};

const wwExpanded = ref(false);

const toggleAllWwColumns = () => {
  wwExpanded.value = !wwExpanded.value;
  wwHeaders.value = wwHeaders.value.map(header => ({
    ...header,
    expanded: wwExpanded.value
  }));
};

// Dynamically calculate column width based on header text length if expanded
const getColumnWidth = (header) => {
  if (header.expanded) {
    // 12px per character, min 120px, max 400px
    const base = 12;
    const min = 120;
    const max = 400;
    const textLen = (header.text || "").length;
    return Math.max(min, Math.min(max, textLen * base)) + "px";
  }
  return "120px";
};

const getColumnMinWidth = (header) => {
  if (header.expanded) {
    // Match getColumnWidth for consistency
    const base = 12;
    const min = 120;
    const max = 400;
    const textLen = (header.text || "").length;
    return Math.max(min, Math.min(max, textLen * base)) + "px";
  }
  return "120px";
};

const toggleColumnExpanded = (index) => {
  wwHeaders.value[index].expanded = !wwHeaders.value[index].expanded;
};

// Add loading state
const isLoading = ref(true);

// State to track if we're in edit mode for topic headers
const editingTopics = ref(false);
const topicsChanged = ref(false);

// Toggle editing mode for headers
const toggleEditTopics = () => {
  editingTopics.value = !editingTopics.value;
  // If we're exiting edit mode and changes were made, save changes
  if (!editingTopics.value && topicsChanged.value) {
    saveTopicChanges();
    topicsChanged.value = false;
  }
};

// Start editing a specific topic
const startEditingTopic = (index) => {
  if (!editingTopics.value) return;
  wwHeaders.value[index].editing = true;
};

// Handle when a topic title changes
const onTopicChange = () => {
  topicsChanged.value = true;
};

// Save changes to topic headers
const saveTopicChanges = async () => {
  const subjectId = localStorage.getItem("selectedSubject");
  const classRecordId = localStorage.getItem("classRecordId");
  
  if (!subjectId) {
    console.error("No subject ID found, cannot save topic changes");
    return;
  }

  try {
    for (const header of wwHeaders.value) {
      if (!header.text.trim()) continue; // Skip empty topics
      
      if (header.id) {
        // Update existing topic
        await updateTopicTitle(header.id, header.text);
      } else {
        // Create new topic with class_record_id
        const newTopic = await createTopic(
          parseInt(subjectId), 
          header.text, 
          classRecordId ? parseInt(classRecordId) : null
        );
        if (newTopic) {
          header.id = newTopic.id;
        }
      }
    }
    
    console.log("Topic changes saved successfully");
    // Refresh topic headers to get any updates
    await updateTopicHeaders();
  } catch (error) {
    console.error("Error saving topic changes:", error);
  }
};

onMounted(async () => {
  isLoading.value = true;

  // Start loading timer
  const loadingTimer = new Promise((resolve) => setTimeout(resolve, 5000));

  // Fetch data
  const fetchData = async () => {
    try {
      await fetchRecords();
      await studentsStore.fetchAllStudents();
      await updateTopicHeaders();
      startAutoSave();
    } catch (error) {
      console.error("Error in mounting:", error);
    }
  };

  // Wait for both timer and data fetching to complete
  await Promise.all([loadingTimer, fetchData()]);

  isLoading.value = false;
});
</script>

<template>
  <HomeLayout>
    <template #content>
      <v-container>
        <!-- Add loading overlay -->
        <v-overlay
          :model-value="isLoading"
          class="align-center justify-center"
          persistent
        >
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          ></v-progress-circular>
        </v-overlay>

        <v-row justify="end">
          <v-col>
            <router-link to="/data_entry">
              <v-btn color="#004D40"><v-icon>mdi-arrow-left</v-icon>Back</v-btn>
            </router-link>
          </v-col>
          <v-col cols="4" class="mb-3">
            <SearchBar v-model="searchQuery" />
          </v-col>
          <v-col cols="2">
            <v-btn 
              :color="editingTopics ? 'success' : 'primary'" 
              @click="toggleEditTopics"
              class="ml-2"
            >
              <v-icon left>{{ editingTopics ? 'mdi-content-save' : 'mdi-pencil' }}</v-icon>
              {{ editingTopics ? 'Save Topics' : 'Edit Topics' }}
            </v-btn>
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
                    colspan="5"
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
                    Topics
                    <v-btn
                      v-if="editingTopics"
                      icon="mdi-plus"
                      size="x-small"
                      color="white"
                      class="ml-2"
                      variant="text"
                      title="Add new topic"
                      @click="toggleAllWwColumns"
                    ></v-btn>
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
                    Actions
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="(header, index) in wwHeaders"
                    :key="header.value"
                    :style="{
                      background: '#004d40',
                      color: 'white',
                      padding: '14px',
                      border: '1px solid #00796b',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      position: 'sticky',
                      top: '0',
                      zIndex: '2',
                      width: getColumnWidth(header),
                      minWidth: getColumnMinWidth(header),
                      position: 'relative',
                    }"
                  >
                    <div v-if="editingTopics" class="topic-edit-container">
                      <input
                        v-model="header.text"
                        type="text"
                        @input="onTopicChange"
                        :placeholder="'Topic ' + (index + 1)"
                        class="topic-edit-input"
                        :style="{
                          width: '90%',
                          background: 'white',
                          color: 'black',
                          border: '1px solid #00796b',
                          borderRadius: '4px',
                          padding: '4px',
                          textAlign: 'center',
                        }"
                      />
                    </div>
                    <span
                      v-else
                      :title="header.text || 'Topic name'"
                      style="
                        display: inline-block;
                        width: 90%;
                        background: transparent;
                        color: white;
                        border: 1px solid #00796b;
                        border-radius: 4px;
                        padding: 4px;
                        text-align: center;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                      @dblclick="startEditingTopic(index)"
                    >
                      {{ header.text || "" }}
                    </span>
                    <template v-if="!header.disabled">
                      <v-icon
                        class="expand-icon"
                        size="small"
                        style="position: absolute; right: 4px; top: 50%; transform: translateY(-50%); cursor: pointer;"
                        @click="toggleColumnExpanded(index)"
                      >
                        {{ header.expanded ? "mdi-chevron-down" : "mdi-chevron-right" }}
                      </v-icon>
                    </template>
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
                      class="student-id"
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
                      :class="getGradeClass(item.quarterly_grade)"
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

                  <td v-for="(header, index) in wwHeaders" :key="header.value">
                    <input
                      v-if="!header.disabled"
                      v-model="item[header.value]"
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
                      :class="getGradeClass(item.initial_grade)"
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
                      :class="getGradeClass(item.quarterly_grade)"
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
                    <v-btn
                      v-if="
                        parseFloat(item.quarterly_grade) <= 80 &&
                        parseFloat(item.quarterly_grade) >= 75
                      "
                      color="warning"
                      size="small"
                      @click="navigateToTracking(item)"
                    >
                      <v-icon left>mdi-brain</v-icon>
                      AI Analysis
                    </v-btn>
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
}

/* Input Fields */
.styled-table input {
  width: 50px;
  height: 36px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  font-size: 16px;
}

.class-record-card {
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 77, 64, 0.5);
  /* Border to enhance glass effect */
  backdrop-filter: blur(10px);
  /* Blur effect for glass background */
  -webkit-backdrop-filter: blur(10px);
  /* Safari support */
  box-shadow: 0 0 10px #004d40;
  /* Glowing effect */
}

.student-id {
  text-align: center;
  min-width: 50px;
  font-weight: bold;
  background: #f0f0f0;
  border-radius: 4px;
}

.fail {
  background-color: #ffcccc;
  color: #000;
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;
}

.almost-fail {
  background-color: #fff3cd;
  color: #000;
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;
}


tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}


.student-id {
  width: 40px;
  height: 24px;
  text-align: center;
  background-color: #f0f0f0;
  /* Light gray to indicate read-only */
  border: none;
  border-radius: 4px;
  padding: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.total-score {
  width: 60px;
  height: 24px;
  text-align: center;
  background-color: #d1e7dd;
  /* Light green for visibility */
  border: none;
  border-radius: 4px;
  padding: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #155724;
  /* Darker green for contrast */
}

.v-overlay {
  backdrop-filter: blur(4px);
}

.expand-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  padding: 2px;
  font-size: 12px;
}

.expand-icon:hover {
  background-color: rgba(0, 0, 0, 0.4);
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .styled-table input {
    width: 100px;
    height: 32px;
    font-size: 14px;
  }
}

.topic-edit-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.topic-edit-input {
  background-color: white;
  color: black;
  border: 1px solid #00796b;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  width: 90%;
  transition: all 0.3s;
}

.topic-edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 77, 64, 0.5);
  border-color: #004d40;
}
</style>
