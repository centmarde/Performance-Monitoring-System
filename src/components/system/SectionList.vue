<template>
    <div>
        <div class="mx-auto" id="main"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { supabase } from '@/lib/supabase';
import * as echarts from 'echarts';

export default defineComponent({
    name: 'SectionList',
    setup() {
        onMounted(async () => {
            const { data: sections, error: sectionsError } = await supabase
                .from('sections')
                .select('id, code');

            if (sectionsError) {
                console.error(sectionsError);
                return;
            }

            const { data: students, error: studentsError } = await supabase
                .from('students')
                .select('firstname, lastname, section_id');

            if (studentsError) {
                console.error(studentsError);
                return;
            }

            const sectionData = sections.map(section => ({
                code: section.code,
                students: students
                    .filter(student => student.section_id === section.id)
                    .map(student => `${student.firstname} ${student.lastname}`)
            }));

            const chartDom = document.getElementById('main')!;
            const myChart = echarts.init(chartDom);
            const option: echarts.EChartsOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [...sectionData.map(section => section.code)],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval: 0, // Adjust the interval of the x-axis labels
                            rotate: 30  // Rotate the labels for better readability
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Students',
                        type: 'bar',
                        barWidth: '60%',
                        barGap: '10%', // Adjust the gap between bars
                        data: [...sectionData.map(section => section.students.length)],
                        itemStyle: {
                            color: '#004D40' // Set the bar color
                        }
                    }
                ]
            };

            option && myChart.setOption(option);
        });
    }
});
</script>

<style lang="scss" scoped>
#main {
    width: 60vw;
    height: 80vh;
}
</style>