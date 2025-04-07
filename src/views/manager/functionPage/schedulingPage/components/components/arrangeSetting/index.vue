<template>
  <div class="arrange-setting">
    <div class="setting-container">
      <div class="setting-left">
        <div class="wow animate__fadeInLeft warn-box">
          <span class="iconfont icon-icon-gantanhao"></span>
          方案一：选择需要生成课表的学院，点击生成部分课表<br />
          方案二：直接点击生成总课表<br />
        </div>

        <div class="department-select">
          <el-select
            v-model="selectedDepartments"
            multiple
            clearable
            filterable
            placeholder="请选择学院"
            style="width: 100%"
          >
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>

        <div class="action-buttons">
          <el-button @click="generateSchedule" color="#547bf1" :loading="loading">
            生成部分课表
          </el-button>
          <el-button
            @click="generateTotalSchedule"
            :icon="Promotion"
            color="#547bf1"
            :loading="totalLoading"
          >
            生成总课表
          </el-button>
          <el-button @click="toggleDraggable" color="#547bf1">
            {{ isDraggable ? '取消编辑' : '编辑课表' }}
          </el-button>
        </div>

        <div class="schedule-records" v-if="scheduleRecords.length > 0">
          <div class="records-header">
            <h3>课表记录</h3>
            <el-button
              color="#547bf1"
              link
              @click="generateTotalSchedule"
              :disabled="selectedRecords.length === 0"
            >
              生成总课表
            </el-button>
          </div>
          <div class="records-content">
            <el-table
              :data="scheduleRecords"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="departmentNames" label="学院" />
              <el-table-column prop="createTime" label="生成时间" width="100" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="primary" link @click="viewSchedule(scope.row)"> 查看 </el-button>
                  <el-button type="danger" link @click="deleteRecord(scope.row)"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div class="schedule-display">
        <div class="display-header">
          <h2>课表详情</h2>
          <div class="class-right-title" @click="helpClick('1902649449470054400')">
            未排原因
            <span class="iconfont icon-bangzhu"></span>
          </div>
        </div>
        <div class="display-content">
          <router-view
            v-if="currentScheduleData"
            :schedule-data="currentScheduleData"
            :is-draggable="isDraggable"
            @update:schedule-data="handleScheduleDataUpdate"
          />
          <div v-else class="empty-schedule">
            <el-empty description="请选择或生成课表" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 未排课程原因弹窗 -->
  <el-dialog v-model="helpDialogVisible" title="未排课程原因" width="70%">
    <div class="filter-box">
      <el-select
        v-model="selectedDepartment"
        placeholder="选择学院"
        clearable
        @change="filterHelpData"
      >
        <el-option
          v-for="dept in departments"
          :key="dept.id"
          :label="dept.name"
          :value="dept.name"
        />
      </el-select>
    </div>
    <el-table :data="filteredHelpData" style="width: 100%" stripe>
      <el-table-column prop="courseName" label="课程名称" width="180" />
      <el-table-column prop="teacherName" label="教师" width="120" />
      <el-table-column prop="department" label="院系" width="180" />
      <el-table-column prop="classComposition" label="班级" width="200" />
      <el-table-column prop="conflictReason" label="冲突原因" width="150" />
      <el-table-column prop="designatedRoomType" label="指定教室类型" width="150" />
      <el-table-column prop="weeklyHours" label="周学时" width="120" />
      <el-table-column prop="scheduledHours" label="已排课时" width="120" />
      <el-table-column prop="schedulingPriority" label="优先级" width="100" />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { getDepartmentsAPI, getMajorsAPI, getGradesAPI } from '@/apis/classMajor'
import { setTimetableAPI } from '@/apis/timetable'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Promotion } from '@element-plus/icons-vue'
import { getTimetableHelpAPI } from '@/apis/course.js'

const emit = defineEmits(['update:activePage'])

// 学院数据
const departments = ref([])
const selectedDepartments = ref([])
const loading = ref(false)
const totalLoading = ref(false)
const scheduleRecords = ref([])
const selectedRecords = ref([])
const currentScheduleData = ref(null)
const router = useRouter()
const isDraggable = ref(false) // 是否可拖拽

const helpDialogVisible = ref(false)
const helpData = ref([])
const selectedDepartment = ref('')
const filteredHelpData = ref([])

// 获取学院数据
onMounted(async () => {
  try {
    const res = await getDepartmentsAPI()
    departments.value = res.data.data
  } catch (error) {
    ElMessage.error('获取学院数据失败')
    console.error(error)
  }
})

// 生成课表
const generateSchedule = async () => {
  if (selectedDepartments.value.length === 0) {
    ElMessage.warning('请至少选择一个学院')
    return
  }

  loading.value = true
  try {
    // 获取选中学院的第一个专业和年级
    let majors = ''
    let yearOfEntry = ''

    // 获取第一个选中学院的专业
    const firstDeptId = selectedDepartments.value[0]
    const firstDept = departments.value.find(d => d.id === firstDeptId)
    console.log('选中的第一个学院:', firstDept)

    if (firstDept) {
      // 获取该学院的专业列表
      const majorsRes = await getMajorsAPI(firstDept.name)
      console.log('获取到的专业列表:', majorsRes.data.data)

      if (majorsRes.data.data && majorsRes.data.data.length > 0) {
        majors = majorsRes.data.data[0].name
        console.log('选中的专业:', majors)

        // 获取该专业的年级列表
        const gradesRes = await getGradesAPI(majors)
        console.log('获取到的年级列表:', gradesRes.data.data)

        if (gradesRes.data.data && gradesRes.data.data.length > 0) {
          yearOfEntry = gradesRes.data.data[0]
          console.log('选中的年级:', yearOfEntry)
        }
      }
    }

    if (!majors || !yearOfEntry) {
      ElMessage.warning('无法获取专业或年级信息，请确保学院下有专业和年级数据')
      return
    }

    console.log('调用API参数:', {
      weekValue: null,
      date: '',
      yearOfEntry,
      majors,
      className: '',
      teacherId: '',
    })

    const res = await setTimetableAPI(
      null, // weekValue
      '', // date
      yearOfEntry, // yearOfEntry
      majors, // majors
      '', // className
      '', // teacherId
    )

    if (res.data.code === 'B000001') {
      ElMessage.warning('系统繁忙，请稍后再试！')
      return
    }

    console.log('API返回的课程数据:', res.data.data)

    // 处理数据
    const scheduleData = {
      departments: selectedDepartments.value.map(id => {
        const dept = departments.value.find(d => d.id === id)
        return dept ? dept.name : id
      }),
      schedule: selectedDepartments.value.map(deptId => {
        const dept = departments.value.find(d => d.id === deptId)
        const deptName = dept ? dept.name : `学院${deptId}`

        return {
          departmentId: deptId,
          departmentName: deptName,
          courses: res.data.data.map(course => ({
            id: course.courseId,
            name: course.courseName,
            teacher: course.teacherName,
            teacherId: course.teacherId,
            classroom: course.classroomName,
            classroomId: course.classroomId,
            teachingClass: course.teachingClassName,
            teachingClassId: course.teachingClassId,
            week: course.week,
            day: getDayName(course.dayOfWeek),
            timeSlot: course.timeStart + 1,
            duration: course.duration || 1,
            color: getRandomColor(),
          })),
        }
      }),
    }

    console.log('处理后的课表数据:', scheduleData)

    // 创建新的课表记录
    const newRecord = {
      id: `schedule-${Date.now()}`,
      createTime: new Date().toLocaleString(),
      departmentNames: scheduleData.departments.join(', '),
      data: scheduleData,
    }

    // 添加到记录列表
    scheduleRecords.value.unshift(newRecord)

    // 自动选中新生成的课表
    currentScheduleData.value = scheduleData

    // 跳转到课表详情页
    router.push('/manager/functionPage/scheduling/scheduleCourse/arrangeSetting/fullSchedule')

    ElMessage.success('课表生成成功')
  } catch (error) {
    ElMessage.error('生成课表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 查看课表
const viewSchedule = record => {
  currentScheduleData.value = record.data
  router.push('/manager/functionPage/scheduling/scheduleCourse/arrangeSetting/fullSchedule')
}

// 删除记录
const deleteRecord = record => {
  ElMessageBox.confirm('确定要删除这条课表记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = scheduleRecords.value.findIndex(item => item.id === record.id)
      if (index !== -1) {
        scheduleRecords.value.splice(index, 1)

        // 如果删除的是当前选中的课表，清空当前课表
        if (currentScheduleData.value === record.data) {
          currentScheduleData.value = null
          router.push('/manager/functionPage/scheduling/scheduleCourse/arrangeSetting')
        }

        ElMessage.success('删除成功')
      }
    })
    .catch(() => {})
}

// 生成总课表
const generateTotalSchedule = () => {
  emit('update:activePage', 6)
  router.push(`/manager/functionPage/scheduling/scheduleCourse/show`)
  ElMessage.success('总课表生成成功，正在跳转页面...')
}

// 处理表格选择变化
const handleSelectionChange = selection => {
  selectedRecords.value = selection
}

// 处理当前行变化
const handleCurrentChange = row => {
  if (row) {
    currentScheduleData.value = row.data
    router.push('/manager/functionPage/scheduling/scheduleCourse/arrangeSetting/fullSchedule')
  }
}

// 切换拖拽功能
const toggleDraggable = () => {
  if (isDraggable.value) {
    ElMessageBox.confirm('是否保存暂定更改?', '提醒', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        ElMessage.success('保存成功！')
        isDraggable.value = !isDraggable.value
      })
      .catch(() => {
        ElMessage.success('未保存')
        isDraggable.value = !isDraggable.value
      })
  } else {
    isDraggable.value = !isDraggable.value
  }
}

// 根据数字获取星期几
const getDayName = dayNumber => {
  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return days[dayNumber - 1] || '星期一'
}

// 获取随机颜色
const getRandomColor = () => {
  const colors = [
    '#7dc15b', // 绿色
    '#e6a23c', // 橙色
    '#f56c6c', // 红色
    '#409eff', // 蓝色
    '#909399', // 灰色
    '#67c23a', // 浅绿
    '#ff9900', // 深橙
    '#9c27b0', // 紫色
    '#03a9f4', // 浅蓝
    '#ff5722', // 深红
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 处理课表数据更新
const handleScheduleDataUpdate = newData => {
  currentScheduleData.value = newData
}

// 筛选未排课程数据
const filterHelpData = () => {
  if (!selectedDepartment.value) {
    filteredHelpData.value = helpData.value
    return
  }
  filteredHelpData.value = helpData.value.filter(
    item => item.department === selectedDepartment.value,
  )
}

// 获取未排课程原因
const helpClick = async id => {
  try {
    const res = await getTimetableHelpAPI(id)
    if (res.data.data) {
      helpData.value = res.data.data.slice(0, 20)
      filteredHelpData.value = helpData.value
      helpDialogVisible.value = true
    } else {
      ElMessage.info('暂无未排课程数据')
    }
  } catch (error) {
    console.error('获取未排课程原因失败:', error)
    ElMessage.error('获取未排课程原因失败')
  }
}
</script>

<style lang="scss" scoped>
.arrange-setting {
  .setting-container {
    display: flex;
    gap: 20px;
    width: 100%;

    .setting-left {
      flex: 1;
      max-width: 500px;

      .department-select {
        margin: 20px 0;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
      }

      .schedule-records {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;

        .records-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;

          h3 {
            margin: 0;
          }
        }

        .records-content {
          max-height: 500px;
          overflow: auto;
        }
      }
    }

    .schedule-display {
      flex: 2;
      max-width: 810px;
      border-left: 1px solid #e0e0e0;
      padding-left: 20px;

      .display-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .class-right-title {
          font-size: 16px;
          cursor: pointer;
          font-weight: normal;
        }
        h2 {
          margin: 0;
        }
      }

      .display-content {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px;
        overflow: auto;
      }

      .empty-schedule {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 500px;
      }
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

.filter-box {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
