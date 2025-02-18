<template>
  <div ref="chartContainer" :style="style"></div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

// Props
const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  style: {
    type: Object,
    default: () => ({ width: '100%', height: '100%' }),
  },
})

// Refs
const chartContainer = ref(null)
let chartInstance = null

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
  chartInstance.setOption(props.option)
}
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
