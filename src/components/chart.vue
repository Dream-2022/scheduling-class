<template>
  <div ref="chartContainer" :style="style"></div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance, watch } from 'vue'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts
import { merge } from 'lodash' // 使用 lodash.merge 来深度合并配置

// Props
const props = defineProps({
  title: {
    show: true,
    type: String,
    default: '默认标题',
  },
  subTitle: {
    type: String,
    default: '',
  },
  option: {
    type: Object,
    default: () => ({}), // 允许父组件传入部分配置
  },
  style: {
    type: Object,
    default: () => ({ width: '100%', height: '100%' }),
  },
})

// Refs
const chartContainer = ref(null)
let chartInstance = null

// 默认配置
const defaultOption = {
  title: {
    text: '默认标题',
    subtext: '默认副标题',
    textStyle: {
      color: '#065fed',
      fontSize: 18,
    },
    subtextStyle: {
      fontSize: '14',
      rich: {
        titleSize: {
          fontSize: '18',
          fontWeight: '600',
        },
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {
        title: '下载该图表',
      },
    },
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      data: [1, 2, 3, 2, 1, 4, 5],
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      boundaryGap: false,
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      boundaryGap: false,
    },
  ],
  series: [
    {
      smooth: true,
      itemStyle: {
        color: '#547BF1',
      },
      stack: 'Total',
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#547BF1' },
          { offset: 1, color: '#EDF1FE' },
        ]),
      },
      data: [1, 2, 3, 2, 1, 4, 5],
    },
  ],
}

// 合并默认配置和父组件传入的配置
const mergedOption = merge({}, defaultOption, props.option)

watch(
  () => props.option,
  () => {
    renderChart()
  },
  { deep: true },
)

onMounted(() => {
  renderChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

function renderChart() {
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartContainer.value)
  chartInstance.setOption(mergedOption) // 使用合并后的配置
}
</script>

<style scoped></style>
