<template>
  <div class="plan-box">
    <div class="plan-box-top">
      <el-button color="#547bf1" plain @click="downloadClick">下载教学计划示例</el-button>
      <el-button plain :icon="Upload">导入教学计划</el-button>
      <div class="plan-word">
        <div v-if="tableData && tableData.length > 0">课表总课时：{{ courseHourValue }}</div>
      </div>
      <el-button color="#547bf1" :icon="Promotion" @click="aiGenerateClick">{{
        (flagValue ? '重新' : '') + '生成教学计划'
      }}</el-button>
      <el-button plain>新增教学计划</el-button>
      <el-button plain @click="exportToExcel">导出教学计划</el-button>
      <el-button color="#547bf1">下一步</el-button>
    </div>
    <div class="search-box" v-if="tableData && tableData.length > 0">
      <el-select clearable v-model="searchPlanValue.department" placeholder="请筛选院系">
        <el-option
          v-for="item in departmentList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-model="searchPlanValue.course" clearable placeholder="请输入课程 id 或课程名" />
      <el-input v-model="searchPlanValue.teacher" clearable placeholder="请输入教师 id 或教师名" />
      <el-input v-model="searchPlanValue.class" clearable placeholder="请输入班级 id 或班级名" />
      <el-select clearable v-model="searchPlanValue.type" placeholder="请筛选课程性质">
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button color="#547bf1" plain :icon="Search" @click="searchClick">搜索</el-button>
    </div>
    <div v-if="tableData && tableData.length > 0">
      <el-table
        :data="tableData"
        ref="tableRef"
        stripe
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="courseName" label="课程名" min-width="180" />
        <el-table-column prop="teacherName" label="教师名" min-width="100" />
        <el-table-column prop="designatedRoomType" label="教室类型" min-width="180" />
        <el-table-column prop="classComposition" label="班级名" min-width="180" />
        <el-table-column prop="scheduledHours" label="总课时" min-width="80" />
        <el-table-column prop="continuousPeriods" label="连排" min-width="80" />
        <el-table-column prop="courseNature" label="课程类型" min-width="150" />
        <el-table-column prop="department" label="学院" min-width="180" />
        <el-table-column prop="campus" label="校区" min-width="100" />
        <el-table-column fixed="right" label="操作" width="140">
          <template #default="{ row }">
            <div>
              <el-button @click="deleteClick(row)" color="#f56c6c" size="small" style="color: #fff">
                删除
              </el-button>
              <el-button @click="editClick(row)" color="#547bf1" size="small" plain>
                修改
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-empty v-else description="暂无教学计划" :image-size="200">
      <el-button color="#547bf1" :icon="Promotion" @click="aiGenerateClick">生成教学计划</el-button>
      <el-button color="#547bf1" :icon="Upload" plain>导入教学计划</el-button>
    </el-empty>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { Search, Promotion, Upload } from '@element-plus/icons-vue'
import { getDepartmentsAPI } from '@/apis/classMajor'
import { getCourseTypeAPI } from '@/apis/course'
import { getTeachingPlanAPI, getAIGenerateAPI, getCourseHoursAPI } from '@/apis/planAll'
import { downloadAPI } from '@/apis/scheduling'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const searchPlanValue = ref({
  course: '',
  teacher: '',
  class: '',
  department: '',
  type: '',
})
const tableRef = ref()
const departmentList = ref([]) //院系列表
const typeList = ref([]) //课程性质
const tableData = ref([])
const courseHourValue = ref(0) //课表课时
let flagValue = ref(false) //是否点击过
onMounted(async () => {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  departmentList.value = res.data.data.map(item => ({
    label: item.name,
    value: item.name,
  }))
  //获取课程性质
  const res1 = await getCourseTypeAPI()
  console.log(res1.data)
  typeList.value = res1.data.data.map(item => ({
    label: item,
    value: item,
  }))
  console.log(typeList.value)
})

//点击修改和删除
function deleteClick(row) {
  ElMessageBox.confirm('是否确认删除?', '提醒', {
    confirmButtonText: '确认',
    cancelButtonText: '返回',
    type: 'warning',
  })
    .then(() => {
      console.log(row)
      tableData.value = tableData.value.filter(
        item =>
          item.classId != row.classId &&
          item.courseId != row.courseId &&
          item.teacherId != row.teacherId,
      )
      ElMessage.success('删除成功！')
      courseHourValue.value = courseHourValue.value - 2
    })
    .catch(() => {
      ElMessage.success('已取消删除！')
    })
}
function editClick() {}

//点击搜索
async function searchClick() {
  const res = await getTeachingPlanAPI(searchPlanValue.value)
  console.log(res.data)
  tableData.value = res.data.data.records
}
//点击ai获取教学计划
async function aiGenerateClick() {
  flagValue.value = true
  await getAIGenerateAPI()
  searchClick()
  ElMessage.success('生成成功，可对此进行修改或重新生成！')
  const res = await getCourseHoursAPI('1902649449470054400')
  courseHourValue.value = res.data.data
}

const exportToExcel = () => {
  if (!tableRef.value) return

  // 获取表格数据
  const data = tableData.value.map(row => ({
    课程名: row.classComposition,
    教师名: row.teacherName,
    教室类型: row.designatedRoomType,
    班级名: row.classComposition,
    总课时: row.scheduledHours,
    连排: 2,
    课程类型: row.courseNature,
    学院: row.department,
    校区: row.campus,
  }))

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data)

  // 创建工作簿
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 生成 Excel 文件
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  })

  // 下载 Excel 文件
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, '教学计划示例.xlsx')
}
//下载教学示例
async function downloadClick() {
  const res = await downloadAPI()
  window.open(res.data.data)
  ElMessage.success('下载成功！')
}
</script>
<style lang="scss" scoped>
.plan-box {
  .plan-box-top {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .plan-word {
      margin-left: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-right: auto;
    }
  }
  .search-box {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
}
</style>
