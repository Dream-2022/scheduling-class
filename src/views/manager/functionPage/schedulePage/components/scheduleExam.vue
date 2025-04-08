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
        :disabled="activePage === 3"
        :icon="ArrowRightBold"
        circle
        style="transform: translateX(-20px)"
        @click="handleStepClick(++activePage)"
      ></el-button>
    </div>
    <div class="step-bottom">
      <RouterView v-model:activePage="activePage"></RouterView>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const stepsList = ['学校基础信息', '教师禁排', '教室禁排', '排考时间段', '排考展示']
const activePage = ref(0)

onMounted(() => {
  const path = router.currentRoute.value.fullPath
  if (path.includes('/setInformation')) {
    activePage.value = 0
  } else if (path.includes('/teacherDisabled')) {
    activePage.value = 1
  } else if (path.includes('/classroomDisabled')) {
    activePage.value = 2
  } else if (path.includes('/schedulePeriod')) {
    activePage.value = 3
  } else if (path.includes('/show')) {
    activePage.value = 4
  }
})
const handleStepClick = index => {
  if (activePage.value < index - 1) {
    ElMessage.warning('请先完成上一步骤！')
    return
  }
  activePage.value = index
  console.log(activePage.value)
  if (activePage.value == 0) {
    router.push('/manager/functionPage/schedule/scheduleExam/setInformation')
  } else if (activePage.value == 1) {
    router.push('/manager/functionPage/schedule/scheduleExam/teacherDisabled')
  } else if (activePage.value == 2) {
    router.push('/manager/functionPage/schedule/scheduleExam/classroomDisabled')
  } else if (activePage.value == 3) {
    router.push('/manager/functionPage/schedule/scheduleExam/schedulePeriod')
  } else if (activePage.value == 4) {
    router.push('/manager/functionPage/schedule/scheduleExam/show')
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
