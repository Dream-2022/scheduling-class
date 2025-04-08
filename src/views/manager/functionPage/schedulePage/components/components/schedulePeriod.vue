<template>
  <div class="schedule-period-container">
    <div class="schedule-period-header">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        排考时间段设置：设置考试的时间范围和特殊考试安排
      </div>
    </div>

    <!-- 排考日期段展示 -->
    <div class="date-range-display" v-if="dateRange.startDate && dateRange.endDate">
      <div class="date-range-title">当前排考日期段：</div>
      <div class="date-range-content">
        <el-tag type="info" effect="plain">{{ dateRange.startDate }}</el-tag>
        <span class="date-separator">至</span>
        <el-tag type="info" effect="plain">{{ dateRange.endDate }}</el-tag>
      </div>
      <div class="header-actions">
        <el-button color="#547bf1" plain @click="openSpecialExamDialog">添加特殊考试</el-button>
        <el-button color="#547bf1" @click="openDateRangeDialog">设置排考日期段</el-button>
      </div>
    </div>

    <!-- 特殊考试设置表格 -->
    <div class="special-exam-table">
      <div class="table-title">
        特殊考试时间段设置

        <div style="margin-left: auto">
          <el-button color="#547bf1" @click="addClick">生成考试时间表</el-button>
        </div>
      </div>
      <el-table :data="specialExams" style="width: 100%" stripe>
        <el-table-column prop="college" label="学院" min-width="120" />
        <el-table-column prop="major" label="专业" min-width="120" />
        <el-table-column prop="grade" label="年级" min-width="80" />
        <el-table-column prop="course" label="课程" min-width="150" />
        <el-table-column prop="examDate" label="考试日期" min-width="120" />
        <el-table-column prop="examTime" label="考试时间" min-width="120" />
        <el-table-column prop="duration" label="考试时长(分钟)" min-width="120" />
        <el-table-column prop="roomType" label="教室类型" min-width="120" />
        <el-table-column prop="priority" label="优先级" min-width="80" />
        <el-table-column label="操作" min-width="120">
          <template #default="{ $index }">
            <el-button type="primary" size="small" @click="editSpecialExam($index)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteSpecialExam($index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="specialExams.length === 0" description="暂无特殊考试设置" />
    </div>

    <!-- 排考日期段设置弹窗 -->
    <el-dialog
      :before-close="handleClose"
      v-model="dateRangeDialogVisible"
      title="设置排考日期段"
      width="500"
    >
      <el-form :model="dateRangeForm" label-width="120px">
        <el-form-item label="开始日期" required>
          <el-date-picker
            v-model="dateRangeForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 90%"
            :disabled-date="disabledStartDate"
          />
        </el-form-item>
        <el-form-item label="结束日期" required>
          <el-date-picker
            v-model="dateRangeForm.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 90%"
            :disabled-date="disabledEndDate"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dateRangeDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDateRange">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 特殊考试设置弹窗 -->
    <el-dialog
      v-model="specialExamDialogVisible"
      :title="isEdit ? '编辑特殊考试' : '添加特殊考试'"
      width="600"
    >
      <el-form
        :v-model="specialExamForm"
        label-width="120px"
        :rules="specialExamRules"
        ref="specialExamFormRef"
      >
        <el-form-item label="年级" prop="course">
          <el-cascader
            placeholder="请选择年级"
            v-model="specialExamForm.selectedArr"
            filterable
            style="width: 360px"
            :options="options"
            :props="option"
            clearable
          />
        </el-form-item>
        <el-form-item label="课程" prop="course">
          <el-cascader
            :options="subjectOptions"
            placeholder="选择课程"
            filterable
            :props="optionCourse"
            style="margin-right: 10px; width: 360px"
            clearable
            v-model="specialExamForm.course"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="考试日期" prop="examDate">
          <el-date-picker
            v-model="specialExamForm.examDate"
            type="date"
            placeholder="选择考试日期"
            style="width: 360px"
            :disabled-date="disabledExamDate"
          />
        </el-form-item>
        <el-form-item label="考试时间" prop="examTime">
          <el-time-picker
            v-model="specialExamForm.examTime"
            placeholder="选择考试时间"
            format="HH:mm"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="考试时长" prop="duration">
          <el-input-number
            v-model="specialExamForm.duration"
            :min="30"
            :max="180"
            :step="30"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="教室类型" prop="roomType">
          <el-select
            v-model="specialExamForm.roomType"
            placeholder="请选择教室类型"
            style="width: 360px"
          >
            <el-option label="普通教室" value="普通教室" />
            <el-option label="多媒体教室" value="多媒体教室" />
            <el-option label="实验室" value="实验室" />
            <el-option label="机房" value="机房" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number
            v-model="specialExamForm.priority"
            :min="1"
            :max="10"
            style="width: 140px"
          />
          <div class="priority-tip">（1-10，数字越大优先级越高）</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="specialExamDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSpecialExam">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, watch, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDepartmentsAPI, getGradesAPI, getMajorsAPI } from '@/apis/classMajor'
import { getCoursePageSizeAPI } from '@/apis/course'
import { useRouter } from 'vue-router'

const emit = defineEmits(['update:allContent', 'update:activePage'])
const props = defineProps({
  allContent: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()

// 数据定义
const dateRange = ref(props.allContent.dateRange || { startDate: '', endDate: '' })
const specialExams = ref(props.allContent.specialExams || [])
const dateRangeDialogVisible = ref(true)
const specialExamDialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref(-1)
const specialExamFormRef = ref(null)

let option = ref() //筛选框班级选项
const options = ref([]) //所有年级
// 表单数据
const dateRangeForm = reactive({
  startDate: null,
  endDate: null,
})

const specialExamForm = reactive({
  selectedArr: [],
  course: [],
  examDate: null,
  examTime: null,
  duration: 90,
  roomType: '',
  priority: 5,
})

// 选项数据
const collegeOptions = ref([])
const majorOptions = ref([])

const subjectOptions = ref([]) //所有科目
let optionCourse = ref() //筛选框选项
// 表单校验规则
const specialExamRules = {
  college: [{ required: true, message: '请选择学院', trigger: 'blur' }],
  course: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请设置考试时长', trigger: 'blur' }],
  roomType: [{ required: true, message: '请选择教室类型', trigger: 'blur' }],
  priority: [{ required: true, message: '请设置优先级', trigger: 'blur' }],
}

// 初始化数据
onMounted(async () => {
  await loadCollegeOptions()
  const res = await getDepartmentsAPI()
  console.log(res.data)
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  options.value = JSON.parse(JSON.stringify(nodes))
  subjectOptions.value = JSON.parse(JSON.stringify(nodes))
  option.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      console.log(selectedPath)
      if (selectedPath.length == 1) {
        const res = await getMajorsAPI(selectedPath[0])
        console.log(res.data)
        const nodes = res.data.data.map(item => ({
          value: item.name,
          label: item.name,
          leaf: false,
        }))
        resolve(nodes)
      } else {
        //获取年级
        const res = await getGradesAPI(selectedPath[1])
        console.log(res.data)
        const nodes = res.data.data.map(item => ({
          value: item,
          label: item.toString() + '级',
          leaf: true,
        }))
        resolve(nodes)
      }
    },
  }
  optionCourse.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      //获取课程
      console.log(selectedPath[0], selectedPath)
      const res = await getCoursePageSizeAPI('', '', '', selectedPath[0], 1, 1, 100)
      console.log(res.data)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
})

// 加载学院选项
const loadCollegeOptions = async () => {
  try {
    const res = await getDepartmentsAPI()
    collegeOptions.value = res.data.data.map(item => ({
      value: item.name,
      label: item.name,
      children: [],
    }))

    // 模拟专业数据
    collegeOptions.value.forEach(college => {
      college.children = [
        { value: `${college.value}-专业1`, label: '专业1' },
        { value: `${college.value}-专业2`, label: '专业2' },
        { value: `${college.value}-专业3`, label: '专业3' },
      ]
    })
  } catch (error) {
    console.error('获取学院数据失败:', error)
    ElMessage.error('获取学院数据失败')
  }
}

// 学院变化时更新专业选项
const handleCollegeChange = value => {
  if (value && value.length > 0) {
    const selectedCollege = collegeOptions.value.find(item => item.value === value[0])
    if (selectedCollege) {
      majorOptions.value = selectedCollege.children || []
    } else {
      majorOptions.value = []
    }
  } else {
    majorOptions.value = []
  }
}

// 日期禁用函数
const disabledStartDate = time => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

const disabledEndDate = time => {
  if (!dateRangeForm.startDate) return time.getTime() < Date.now() - 8.64e7
  return time.getTime() < dateRangeForm.startDate.getTime()
}

const disabledExamDate = time => {
  if (!dateRange.value.startDate || !dateRange.value.endDate) {
    return time.getTime() < Date.now() - 8.64e7
  }

  const startDate = new Date(dateRange.value.startDate)
  const endDate = new Date(dateRange.value.endDate)
  return time.getTime() < startDate.getTime() || time.getTime() > endDate.getTime()
}

// 打开日期范围设置弹窗
const openDateRangeDialog = () => {
  dateRangeForm.startDate = dateRange.value.startDate ? new Date(dateRange.value.startDate) : null
  dateRangeForm.endDate = dateRange.value.endDate ? new Date(dateRange.value.endDate) : null
  dateRangeDialogVisible.value = true
}

// 保存日期范围
const saveDateRange = () => {
  if (!dateRangeForm.startDate || !dateRangeForm.endDate) {
    ElMessage.warning('请选择完整的日期范围')
    return
  }

  dateRange.value = {
    startDate: dateRangeForm.startDate.toISOString().split('T')[0],
    endDate: dateRangeForm.endDate.toISOString().split('T')[0],
  }

  dateRangeDialogVisible.value = false
  ElMessage.success('日期范围设置成功')
}

// 生成考试时间表
const addClick = () => {
  emit('update:activePage', 4) // 4是排考展示的索引

  // 跳转到排考展示页面
  router.push('/manager/functionPage/schedule/scheduleExam/show')

  ElMessage.success('考试时间表生成成功，正在跳转到排考展示页面')
}

// 打开特殊考试设置弹窗
const openSpecialExamDialog = () => {
  if (!dateRange.value.startDate || !dateRange.value.endDate) {
    ElMessage.warning('请先设置排考日期段')
    return
  }

  isEdit.value = false
  editIndex.value = -1
  Object.assign(specialExamForm, {
    college: '',
    major: '',
    grade: '',
    course: '',
    examDate: null,
    examTime: null,
    duration: 90,
    roomType: '',
    priority: 5,
  })

  specialExamDialogVisible.value = true
}

// 编辑特殊考试
const editSpecialExam = index => {
  isEdit.value = true
  editIndex.value = index
  const exam = specialExams.value[index]

  Object.assign(specialExamForm, {
    college: exam.college,
    major: exam.major,
    grade: exam.grade,
    course: exam.course,
    examDate: new Date(exam.examDate),
    examTime: new Date(`2000-01-01T${exam.examTime}`),
    duration: exam.duration,
    roomType: exam.roomType,
    priority: exam.priority,
  })

  // 触发学院选择以加载专业选项
  handleCollegeChange([exam.college])

  specialExamDialogVisible.value = true
}

// 保存特殊考试
const saveSpecialExam = () => {
  console.log(1)
  const examData = {
    college: specialExamForm.selectedArr[0],
    major: specialExamForm.selectedArr[1],
    grade: specialExamForm.selectedArr[2],
    course: specialExamForm.course,
    examDate: specialExamForm.examDate.toISOString().split('T')[0],
    examTime: specialExamForm.examTime.toTimeString().split(' ')[0].substring(0, 5),
    duration: specialExamForm.duration,
    roomType: specialExamForm.roomType,
    priority: specialExamForm.priority,
  }

  if (isEdit.value && editIndex.value >= 0) {
    specialExams.value[editIndex.value] = examData
    ElMessage.success('编辑成功')
  } else {
    specialExams.value.push(examData)
    ElMessage.success('添加成功')
  }

  specialExamDialogVisible.value = false
}
const handleClose = () => {
  ElMessageBox.confirm('请先选择排考日期段！', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {})
    .catch(() => {})
}
// 删除特殊考试
const deleteSpecialExam = index => {
  ElMessageBox.confirm('确定要删除该特殊考试设置吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      specialExams.value.splice(index, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// 监听数据变化，向父组件传递更新
watch(
  [dateRange, specialExams],
  ([newDateRange, newSpecialExams]) => {
    emit('update:allContent', {
      ...props.allContent,
      dateRange: newDateRange,
      specialExams: newSpecialExams,
    })
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.schedule-period-container {
  background-color: #fff;

  .schedule-period-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .date-range-display {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f7fa;
    border-radius: 8px;
    display: flex;
    align-items: center;

    .date-range-title {
      font-weight: bold;
      margin-right: 10px;
    }

    .date-range-content {
      margin-right: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .special-exam-table {
    .table-title {
      display: flex;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
}

.warn-box {
  background-color: #fff3e0;
  color: #cd871d;
  padding: 5px 15px;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ffdb9e;

  .iconfont::before {
    font-size: 16px;
  }
}

.priority-tip {
  margin-top: 5px;
  color: #999;
  font-size: 13px;
}
</style>
