<template>
  <v-card class="glass-card pa-4 rounded-card" elevation="3">
    <v-card-title class="font-semibold text-lg">Overall Sections Performance</v-card-title>
    <v-card-text>
      <div id="allSectionsChart" style="width: 100%; height: 500px"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import * as echarts from 'echarts';

const sectionsData = ref([]);
const teacherId = localStorage.getItem("user_id");

const fetchData = async () => {
  // First fetch teacher's assigned subjects
  const { data: assignedSubjects } = await supabase
    .from('asign_subjects')
    .select('subject_id')
    .eq('user_id', teacherId);

  if (!assignedSubjects) return;

  const subjectIds = assignedSubjects.map(item => item.subject_id);

  // Fetch sections data with their subjects and records
  const { data: sections } = await supabase
    .from('sections')
    .select(`
      code,
      id,
      section_subjects!inner (
        subject_id,
        subjects (
          id,
          title
        )
      ),
      class_record (
        subject_id,
        records (
          initial_grade
        )
      )
    `)
    .in('section_subjects.subject_id', subjectIds);

  if (sections) {
    sectionsData.value = sections.map(section => {
      const subjectsData = section.section_subjects.reduce((acc, subjectRel) => {
        const subject = subjectRel.subjects;
        const records = section.class_record
          .filter(record => record.subject_id === subject.id)
          .flatMap(record => record.records || []);
        
        const passingCount = records.filter(r => r.initial_grade >= 75).length;
        const totalCount = records.length;
        const passRate = totalCount > 0 ? (passingCount / totalCount) * 100 : 0;

        acc[subject.title] = passRate;
        return acc;
      }, {});

      return {
        section: section.code,
        ...subjectsData
      };
    });

    updateChart();
  }
};

const updateChart = () => {
  const chartDom = document.getElementById('allSectionsChart');
  const myChart = echarts.init(chartDom);

  // Get all unique subjects
  const subjects = [...new Set(
    sectionsData.value.flatMap(section => 
      Object.keys(section).filter(key => key !== 'section')
    ))
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        return `${params[0].name}<br/>` +
          params.map(param => 
            `${param.seriesName}: ${param.value.toFixed(1)}%`
          ).join('<br/>');
      }
    },
    legend: {
      data: subjects,
      orient: 'horizontal',
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sectionsData.value.map(item => item.section),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
        
      }
    },
    series: subjects.map(subject => ({
      name: subject,
      type: 'bar',
      data: sectionsData.value.map(section => section[subject] || 0),
      label: {
        show: false,
        position: 'top',
        formatter: '{c}%',
        rotate: 45
      }
    }))
  };

  myChart.setOption(option);
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
