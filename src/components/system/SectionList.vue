<template>
  <div>
    <div class="chart-container" id="main"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import * as echarts from "echarts";

export default defineComponent({
  name: "SectionList",
  setup() {
    onMounted(async () => {
      const { data: sections, error: sectionsError } = await supabase
        .from("sections")
        .select("id, code");

      if (sectionsError) {
        console.error(sectionsError);
        return;
      }

      const { data: students, error: studentsError } = await supabase
        .from("students")
        .select("firstname, lastname, section_id");

      if (studentsError) {
        console.error(studentsError);
        return;
      }

      const sectionData = sections.map((section) => ({
        code: section.code,
        students: students
          .filter((student) => student.section_id === section.id)
          .map((student) => `${student.firstname} ${student.lastname}`),
      }));

      const chartDom = document.getElementById("main")!;
      const myChart = echarts.init(chartDom);
      const option: echarts.EChartsOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(46, 125, 111, 0.8)",
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "5%",
          top: "11%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [...sectionData.map((section) => section.code)],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
              color: "#fffff",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#004D40",
            },
            splitLine: {
              lineStyle: {
                color: "#A5D6A7",
              },
            },
          },
        ],
        series: [
          {
            name: "Students",
            type: "bar",
            barWidth: "60%",
            data: [...sectionData.map((section) => section.students.length)],
            itemStyle: {
              color: "#2E7D6F",
              borderRadius: [5, 5, 0, 0],
            },
            emphasis: {
              itemStyle: {
                color: "#1B5E57",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    });
  },
});
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 50vh;
  background: #e0f2f1;
  padding: 50px;
  border-radius: 20px;
}
</style>
