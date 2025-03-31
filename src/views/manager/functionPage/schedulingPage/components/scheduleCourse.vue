<template>
  <div class="step-box">
    <div class="step-top">
      <el-button
        color="#547bf1"
        plain
        :disabled="activePage === 0"
        :icon="ArrowLeftBold"
        circle
        @click="handleStepClick(--activePage)"
      ></el-button>
      <el-steps :active="activePage" align-center finish-status="success">
        <el-step
          v-for="(step, index) in stepsList"
          :key="index"
          :title="step"
          @click="handleStepClick(index)"
        />
      </el-steps>
      <el-button
        color="#547bf1"
        plain
        :disabled="activePage === 5"
        :icon="ArrowRightBold"
        circle
        style="transform: translateX(-20px)"
        @click="handleStepClick(++activePage)"
      ></el-button>
    </div>
    <div class="step-bottom">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const stepsList = [
  '学校基础信息',
  '教学计划',
  '特殊设置',
  '禁排设置',
  '排课优先级',
  '排课设置',
  '排课展示',
]
const activePage = ref(0)

onMounted(() => {
  const path = router.currentRoute.value.fullPath
  if (path.includes('/setInformation')) {
    activePage.value = 0
  } else if (path.includes('/planLesson')) {
    activePage.value = 1
  } else if (path.includes('/special')) {
    activePage.value = 2
  } else if (path.includes('/prohibition')) {
    activePage.value = 3
  } else if (path.includes('/priority')) {
    activePage.value = 4
  } else if (path.includes('/show')) {
    activePage.value = 5
  }
})
const handleStepClick = index => {
  if (activePage.value < index - 1) {
    ElMessage.warning('请先完成上一步骤！')
    return
  }
  activePage.value = index
  if (activePage.value == 0) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/setInformation`)
  } else if (activePage.value == 1) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/planLesson`)
  } else if (activePage.value == 2) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/special`)
  } else if (activePage.value == 3) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/prohibition`)
  } else if (activePage.value == 4) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/priority`)
  } else if (activePage.value == 5) {
    router.push(`/manager/functionPage/scheduling/scheduleCourse/show`)
  }
}
</script>
<style lang="scss" scoped>
.step-box {
  .step-top {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 20px 0 20px 0;
    background-color: #fff;
    border-radius: 26px 26px 8px 8px;

    .el-button {
      line-height: 50px;
    }
  }
  .step-bottom {
    margin-top: 20px;
  }
}
:deep(.el-steps) {
  margin-right: auto;
  width: 100%;
  font-size: 10px;
}
:deep(.el-steps--simple) {
  background-color: #fff !important;
  border-radius: 26px 26px 8px 8px;
  padding: 8px 16px;
  margin-right: 20px;
}
</style>
