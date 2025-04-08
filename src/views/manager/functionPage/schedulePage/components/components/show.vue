<template>
  <div class="show-box">
    <div class="show-title">
      <div class="title">排考结果展示</div>

      <div class="show-actions">
        <el-button color="#547bf1" plain @click="exportExamSchedule">导出排考结果</el-button>
        <el-button color="#a372df" style="color: #fff" @click="publishExamSchedule"
          >发布排考结果</el-button
        >
      </div>
    </div>
    <div class="show-content">
      <div class="show-table">
        <el-table
          :data="examScheduleData"
          style="width: 100%"
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="subjectId" label="考试 id" min-width="100" />
          <el-table-column prop="subjectName" label="考试名称" min-width="180" />
          <el-table-column prop="examDate" label="考试时间" min-width="180" />
          <el-table-column prop="examDayOfWeek" label="星期" min-width="180" />
          <el-table-column prop="invigilators" label="监考教师" min-width="120">
            <template #default="{ row }">
              <div v-for="item in row.invigilators" :key="item">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="examLocation" label="考试教室" min-width="120" />
          <el-table-column prop="examClasses" label="考试班级" min-width="200">
            <template #default="{ row }">
              <div v-for="item in row.examClasses" :key="item">{{ item }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="examDuration" label="考试时长" min-width="120">90</el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getExamTableDetailAPI } from '@/apis/exam'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'
const router = useRouter()
const examScheduleData = ref([])

onMounted(async () => {
  const res = await getExamTableDetailAPI('2001L')
  console.log(res.data)
  examScheduleData.value = res.data.data || []
})

const exportExamSchedule = () => {
  try {
    // 准备导出数据
    const exportData = examScheduleData.value.map(item => {
      return {
        考试ID: item.subjectId,
        考试名称: item.subjectName,
        考试时间: item.examDate,
        星期: item.examDayOfWeek,
        监考教师: Array.isArray(item.invigilators)
          ? item.invigilators.join(', ')
          : item.invigilators,
        考试教室: item.examLocation,
        考试班级: Array.isArray(item.examClasses) ? item.examClasses.join(', ') : item.examClasses,
        考试时长: item.examDuration || 90,
      }
    })

    // 创建工作簿
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '排考结果')

    // 设置列宽
    const colWidths = [
      { wch: 10 }, // 考试ID
      { wch: 20 }, // 考试名称
      { wch: 15 }, // 考试时间
      { wch: 8 }, // 星期
      { wch: 15 }, // 监考教师
      { wch: 12 }, // 考试教室
      { wch: 20 }, // 考试班级
      { wch: 10 }, // 考试时长
    ]
    worksheet['!cols'] = colWidths

    // 导出文件
    XLSX.writeFile(workbook, `排考结果_${new Date().toLocaleDateString()}.xlsx`)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

const publishExamSchedule = async () => {
  ElMessage.success('发布成功！正在为您跳转到排课页')
  router.push('/manager/functionPage/schedule/scheduleList')
}
</script>
<style lang="scss" scoped>
.show-box {
  .show-title {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .show-content {
    .show-table {
      margin-bottom: 20px;
    }

    .show-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style>
