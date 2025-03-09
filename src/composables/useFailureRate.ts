import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import * as echarts from 'echarts'

export function useFailureRate() {
  const chartData = ref({ passing: 0, failing: 0 })
  let chart: any = null

  const fetchSectionData = async (sectionCode: string, subjectId: string) => {
    if (!sectionCode || !subjectId) return

    const { data: section } = await supabase
      .from('sections')
      .select('id')
      .eq('code', sectionCode)
      .single()

    if (section) {
      const { data } = await supabase
        .from('records')
        .select(`
          initial_grade,
          class_record!inner(id)
        `)
        .eq('class_record.section_id', section.id)
        .eq('class_record.subject_id', subjectId)

      if (data) {
        chartData.value = {
          passing: data.filter(record => record.initial_grade >= 75).length,
          failing: data.filter(record => record.initial_grade < 75).length
        }
      }
    }
  }

  const createChart = (elementId: string, title: string) => {
    const chartDom = document.getElementById(elementId)
    if (!chartDom) return
    
    chart = echarts.init(chartDom)
    return chart
  }

  const updateChart = (chart: any, title: string) => {
    if (!chart) return

    const option = {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom'
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: [
            { 
              value: chartData.value.passing, 
              name: 'Passing',
              itemStyle: { color: '#4CAF50' }
            },
            { 
              value: chartData.value.failing, 
              name: 'Failing',
              itemStyle: { color: '#FF5252' }
            }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    chart.setOption(option)
  }

  const handleResize = (chart: any) => {
    if (chart) {
      chart.resize()
    }
  }

  const disposeChart = (chart: any) => {
    if (chart) {
      chart.dispose()
    }
  }

  return {
    chartData,
    fetchSectionData,
    createChart,
    updateChart,
    handleResize,
    disposeChart
  }
}
