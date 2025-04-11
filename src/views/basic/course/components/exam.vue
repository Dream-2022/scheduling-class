<template>
  <div class="exam-section">
    <div class="exam-section-left">
      <div class="exam-title">
        <div class="title">排考结果展示</div>
        <div class="exam-actions">
          <el-button color="#547bf1" plain @click="exportExamSchedule">导出排考结果</el-button>
          <el-button color="#a372df" style="color: #fff" @click="publishExamSchedule"
            >发布排考结果</el-button
          >
        </div>
      </div>
      <div class="exam-table">
        <el-table
          :data="examScheduleData"
          style="width: 100%"
          stripe
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="subjectId" label="考试 id" min-width="80" />
          <el-table-column prop="subjectName" label="考试名称" min-width="120">
            <template #default="{ row }">
              <strong>
                <span class="subject-name">{{ row.subjectName }}</span>
              </strong>
            </template>
          </el-table-column>
          <el-table-column prop="examLocation" label="考试教室" min-width="80" />
          <el-table-column prop="examDate" label="考试日期" min-width="100" />
          <el-table-column prop="examTime" label="考试时间" min-width="100" />
          <el-table-column prop="examDayOfWeek" label="星期" min-width="40" />
          <el-table-column prop="invigilators" label="监考教师" min-width="100" />
          <el-table-column prop="examClasses" label="考试班级" min-width="220" />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getExamTableDetailAPI } from '@/apis/exam'
import * as XLSX from 'xlsx'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const examScheduleData = ref([])
let calendarDate = ref(new Date()) //当前日期
const calendarString = ref('') //当前日期字符串
const dateString = ref('') //选中的日期天数

onMounted(async () => {
  initializeCalendar() // 初始化日历
  searchClick()
})

//点击搜索
async function searchClick() {
  dateString.value = calendarDate.value.getDate()
  const examId = route.params.id
  // 获取考试数据
  const res = await getExamTableDetailAPI(examId)
  console.log(res.data)
  examScheduleData.value = res.data.data || []
}

// 初始化日历
async function initializeCalendar() {
  //初始化日考试表
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth() + 1
  dateString.value = calendarDate.value.getDate()
  calendarString.value = `${year}年${month}月`
}

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
  router.push('/manager/functionPage/course/main')
}
</script>
<style lang="scss" scoped>
.exam-section {
  margin-top: 20px;
  display: flex;
  gap: 15px;

  > div {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  }

  .exam-section-left {
    flex: 7;

    .exam-title {
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      .title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }

    .exam-table {
      margin-bottom: 20px;
    }

    .exam-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }

  .exam-section-right {
    padding-top: 10px;
    flex: 3;

    .el-calendar {
      .is-selected {
        color: #1989fa;
      }

      .tag {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tag2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .aaa {
        .is-selected {
          .yuyue {
            color: #e6f3ff;
          }

          .datastyle {
            color: #e6f3ff;
          }
        }

        .datastyle {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3rem;
          color: #353636;
          font-weight: 600;
        }

        .prev .datastyle {
          color: #c4c5c8;
        }

        .next .datastyle {
          color: #c4c5c8;
        }
      }

      :deep {
        --el-calendar-selected-bg-color: #e6f3ff;
        --el-calendar-cell-width: 60px;

        .date-content {
          margin-left: auto;
          margin-right: auto;
          font-size: 14px;

          @media (max-width: 765px) {
            font-size: 12px;
          }

          @media (min-width: 765px) {
          }
        }

        .el-row {
          align-items: center;
          justify-content: center;
        }

        .el-calendar__header {
          justify-content: center;
          align-items: center;
          padding-top: 20px;

          @media (max-width: 765px) {
            padding-left: 10px;
            padding-right: 10px;
          }

          @media (min-width: 765px) {
          }

          .el-button--small {
            @media (max-width: 765px) {
              padding-left: 3px;
              padding-right: 3px;
            }

            @media (min-width: 765px) {
            }
          }
        }

        .el-calendar__body {
          padding-bottom: 30px;

          @media (max-width: 765px) {
            padding-left: 10px;
            padding-right: 10px;
          }

          @media (min-width: 765px) {
          }
        }

        .el-calendar-table {
          .el-calendar-day {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 46px;
            padding: 6px;
            .iconfont {
              padding: 3px 5px;
              color: $main-blue;
            }
            .yellow-icon {
              color: $main-yellow;
            }
            .red-icon {
              color: $red-word;
            }
          }
          .el-calendar-day:hover {
            background-color: #e6f3ff;
          }

          thead th {
            color: $title-color;
            font-weight: bold;
            font-size: 14px;
          }
        }
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .center2 {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #e6f3ff;
        margin-left: 5px;
        font-size: 20px;
      }
    }
    .day-table {
      padding: 0 22px;
      .day-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 15px;
      }
    }
  }
}
:deep(.el-timeline-item__wrapper) {
  font-size: 16px;
  padding-left: 20px;
  .el-timeline-item__timestamp {
    margin: 0;
    padding: 0;
  }
  .el-timeline-item__content {
    display: flex;
    align-items: center;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    .time-content {
      width: 46px;
      .extra-box {
        font-weight: 400;
        margin-top: 10px;
        color: #999;
        font-size: 14px;
      }
      .content {
        font-size: 18px;
      }
    }
    .exam-boxes {
      width: calc(90% - 46px);
      .exam-box {
        color: #fff;
        font-weight: 400;
        width: 100%;
        margin-left: 16px;
        border-radius: 5px;
        padding: 5px 14px;
        .exam-box-top {
          display: flex;
          justify-content: space-between;
          gap: 5px;
          text-align: left;
          margin-bottom: 5px;
          .exam-box-title,
          .exam-box-class {
            word-wrap: break-word;
            word-break: break-all;
            flex: 1;
          }
          .exam-box-title {
            font-size: 16px;
          }
          .exam-box-class {
            font-size: 14px;
          }
        }
        .exam-box-bottom {
          display: flex;
          justify-content: space-between;
          .exam-box-teacher {
            font-size: 14px;
            color: #efefef;
          }
          .exam-box-classroom {
            font-size: 14px;
            color: #efefef;
          }
        }
      }
    }
  }
}
</style>
