<template>
  <div class="full-schedule">
    <el-empty v-if="!scheduleData" description="暂无课表数据" />
    <div v-else class="schedule-container">
      <el-tabs v-model="activeDepartment" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="dept in scheduleData.departments"
          :key="dept"
          :label="dept"
          :name="dept"
        />
      </el-tabs>

      <div class="schedule-table">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th v-for="day in days" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="timeSlot in timeSlots" :key="timeSlot">
              <td>{{ getTime(timeSlot) }}</td>
              <td
                v-for="(day, dayIndex) in days"
                :key="day"
                :class="{ 'has-course': getCourse(timeSlot, day) }"
              >
                <div class="course-cell">
                  <CourseCard
                    v-if="getCourse(timeSlot, day)"
                    :courseId="getCourse(timeSlot, day).id"
                    :courseName="getCourse(timeSlot, day).name"
                    :teacherId="getCourse(timeSlot, day).teacherId"
                    :teacherName="getCourse(timeSlot, day).teacher"
                    :classroomId="getCourse(timeSlot, day).classroomId"
                    :classroomName="getCourse(timeSlot, day).classroom"
                    :teachingClassId="getCourse(timeSlot, day).teachingClassId"
                    :teachingClassName="getCourse(timeSlot, day).teachingClass"
                    :week="getCourse(timeSlot, day).week"
                    :dayOfWeek="dayIndex + 1"
                    :timeStart="timeSlot - 1"
                    :identity="'student'"
                    :isDraggable="false"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, provide, onMounted } from 'vue'
import CourseCard from './components/courseCard.vue'
import { setTimetableAPI } from '@/apis/timetable'
import { ElMessage } from 'element-plus'
import { getMajorsAPI, getClassesAPI, getDepartmentsAPI, getGradesAPI } from '@/apis/classMajor'
import { getTeacherAndStudentAPI } from '@/apis/person'

const props = defineProps({
  scheduleData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['update:scheduleData'])

const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const timeSlots = Array.from({ length: 8 }, (_, i) => i + 1)
const activeDepartment = ref('')
const courseColors = ref({}) // 颜色映射

const colors = [
  '#e78891',
  '#f3a885',
  '#a2d13c',
  '#F8BBD0',
  '#E1BEE7',
  '#C5CAE9',
  '#9ad5dd',
  '#b1e2b3',
  '#f5d471',
  '#FFAB91',
  '#b6bbff',
]

const getColor = id => {
  if (!id) return colors[0] // 如果id为空，返回默认颜色

  let num = 0
  for (let i = 0; i < id.length; i++) {
    num += id.charCodeAt(i)
  }
  num = num % colors.length
  courseColors.value[id] = colors[num]

  return courseColors.value[id]
}

// 提供颜色函数
provide('getColor', getColor)

// 当数据变化时，设置默认选中的学院
watch(
  () => props.scheduleData,
  newVal => {
    if (newVal && newVal.departments && newVal.departments.length > 0) {
      activeDepartment.value = newVal.departments[0]
    }
  },
  { immediate: true },
)

// 处理标签页切换
const handleTabClick = tab => {
  activeDepartment.value = tab.props.name
}

// 获取当前选中学院的课程数据
const currentDepartmentSchedule = computed(() => {
  if (!props.scheduleData || !activeDepartment.value) return null

  return props.scheduleData.schedule.find(item => item.departmentName === activeDepartment.value)
})

// 获取指定时间段的课程
const getCourse = (timeSlot, day) => {
  if (!currentDepartmentSchedule.value) return null

  return currentDepartmentSchedule.value.courses.find(course => {
    return (
      course.day === day &&
      course.timeSlot <= timeSlot &&
      timeSlot < course.timeSlot + course.duration
    )
  })
}

// 获取上课时间
const getTime = time => {
  if (time == 1) {
    return '08:00'
  } else if (time == 2) {
    return '08:55'
  } else if (time == 3) {
    return '10:10'
  } else if (time == 4) {
    return '11:05'
  } else if (time == 5) {
    return '14:30'
  } else if (time == 6) {
    return '15:25'
  } else if (time == 7) {
    return '16:20'
  } else {
    return '17:15'
  }
}

const selectedArr = ref(['0', '现代农业学院', '0033']) // 默认选中的数据
const weekValue = ref(null) // 选择的周次
const angleOptions = ref([
  {
    value: '0',
    label: '教师视角',
  },
  {
    value: '1',
    label: '班级视角',
  },
  {
    value: '2',
    label: '年级视角',
  },
])
const weekOptions = ref([])
const option = ref()

// 根据数字获取星期几
const getDayName = dayNumber => {
  const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  return days[dayNumber - 1] || '星期一'
}

// 获取随机颜色
const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)]
}

// 获取课表数据
const fetchScheduleData = async () => {
  try {
    // 如果已经有课表数据，不需要重新获取
    if (props.scheduleData) {
      return
    }

    let yearOfEntry = ''
    let majors = ''
    let className = ''
    let teacherId = ''

    // 根据选择的视角获取对应参数
    if (selectedArr.value[0] == '0') {
      teacherId = selectedArr.value[2]
    } else if (selectedArr.value[0] == '1') {
      className = selectedArr.value[3]
    } else if (selectedArr.value[0] == '2') {
      majors = selectedArr.value[2]
      yearOfEntry = selectedArr.value[3]
    }

    // 检查是否选择了必要的参数
    if (!majors || !yearOfEntry) {
      ElMessage.warning('请选择专业和年级')
      return
    }

    const res = await setTimetableAPI(
      weekValue.value == null ? null : weekValue.value[0],
      '',
      yearOfEntry,
      majors,
      className,
      teacherId,
    )

    if (res.data.code === 'B000001') {
      ElMessage.warning('系统繁忙，请稍后再试！')
      return
    }

    console.log('获取到的课程数据:', res.data.data)

    // 处理数据
    const scheduleData = {
      departments: [selectedArr.value[1]], // 使用选中的学院名称
      schedule: [
        {
          departmentId: selectedArr.value[1],
          departmentName: selectedArr.value[1],
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
        },
      ],
    }

    console.log('处理后的课表数据:', scheduleData)
    emit('update:scheduleData', scheduleData)
  } catch (error) {
    console.error('获取课表数据失败:', error)
    ElMessage.error('获取课表数据失败')
  }
}

// 获取选择框选项
const getOptions = async () => {
  try {
    // 获取学院数据
    const res = await getDepartmentsAPI()
    const nodes = res.data.data.map(item => ({
      value: item.name,
      label: item.name,
    }))

    // 设置学院选项
    for (let i = 0; i < angleOptions.value.length; i++) {
      angleOptions.value[i].children = JSON.parse(JSON.stringify(nodes))
    }

    // 获取默认教师信息
    const res1 = await getTeacherAndStudentAPI(
      '',
      '',
      angleOptions.value[0].children[1].label,
      '',
      1,
      100,
    )

    const nodes2 = res1.data.data.records.map(item => ({
      value: item.userId,
      label: item.name,
      leaf: true,
    }))
    angleOptions.value[0].children[1].children = JSON.parse(JSON.stringify(nodes2))

    // 设置级联选择器的配置
    option.value = {
      lazy: true,
      async lazyLoad(node, resolve) {
        const selectedPath = node.pathValues
        // 教师视角，获取教师
        if (selectedPath[0] == '0') {
          if (selectedPath.length == 3) return
          const res = await getTeacherAndStudentAPI('', '', selectedPath[1], '', 1, 100)
          const nodes = res.data.data.records.map(item => ({
            value: item.userId,
            label: item.name,
            leaf: true,
          }))
          resolve(nodes)
        } else {
          // 获取专业
          if (selectedPath.length == 2) {
            const res = await getMajorsAPI(selectedPath[1])
            const nodes = res.data.data.map(item => ({
              value: item.name,
              label: item.name,
              leaf: false,
            }))
            resolve(nodes)
          }
          // 班级视角
          else if (selectedPath[0] == '1') {
            const res = await getClassesAPI(selectedPath[1], selectedPath[2])
            const nodes = res.data.data.map(item => ({
              value: item.name,
              label: item.name,
              leaf: true,
            }))
            resolve(nodes)
          }
          // 年级视角
          else if (selectedPath[0] == '2') {
            const res = await getGradesAPI(selectedPath[2])
            const nodes = res.data.data.map(item => ({
              value: item,
              label: item.toString() + '级',
              leaf: true,
            }))
            resolve(nodes)
          }
        }
      },
    }

    // 设置周次选项
    weekOptions.value = [{ value: null, label: '全部' }]
    for (let i = 1; i <= 18; i++) {
      weekOptions.value.push({ value: i, label: `第 ${i} 周` })
    }
  } catch (error) {
    console.error('获取选项数据失败:', error)
    ElMessage.error('获取选项数据失败')
  }
}

// 点击搜索
const searchClick = () => {
  fetchScheduleData()
}

onMounted(async () => {
  await getOptions()
  // 只有在没有传入课表数据时才获取
  if (!props.scheduleData) {
    searchClick()
  }
})
</script>

<style lang="scss" scoped>
.full-schedule {
  .filter-section {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
  }

  .empty-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;
  }

  .schedule-container {
    .department-tabs {
      margin-bottom: 0.25rem;
    }

    .schedule-table {
      overflow-x: auto;
      margin-bottom: 0.375rem;
      width: 100%;

      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 0.1rem;
        overflow: hidden;

        th,
        td {
          text-align: center;
          padding: 0.15rem;
          border: 0.0125rem solid #e0e0e0;
          position: relative;
          min-width: 1.5rem;
        }

        th:first-child,
        td:first-child {
          min-width: 0.75rem;
          width: 0.75rem;
          background-color: #f2f5ff;
          font-weight: 500;
        }

        th {
          background-color: #f2f5ff;
          font-weight: 500;
        }

        .time-slot {
          background-color: #f2f5ff;
          font-weight: 500;
          width: 0.75rem;

          .slot-time {
            font-size: 0.15rem;
            color: #606266;
            margin-top: 0.0625rem;
          }
        }

        .cell {
          height: 1.25rem;
          vertical-align: top;
        }

        .course-cell {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }
    }

    .course-legend {
      background-color: #f9f9f9;
      border-radius: 0.1rem;
      padding: 0.25rem;

      h3 {
        margin-top: 0;
        margin-bottom: 0.1875rem;
        font-size: 0.2rem;
      }

      .course-list {
        max-height: 3.75rem;
        overflow-y: auto;

        .department-courses {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;

          .course-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.125rem 0.1875rem;
            background-color: #fff;
            border-radius: 0.05rem;
            border-left: 0.05rem solid;
            box-shadow: 0 0.025rem 0.05rem rgba(0, 0, 0, 0.05);

            .course-info {
              .course-name {
                font-weight: 500;
                margin-bottom: 0.05rem;
              }

              .course-teacher {
                font-size: 0.15rem;
                color: #606266;
              }
            }

            .course-time {
              font-size: 0.15rem;
              color: #606266;
              background-color: #f5f7fa;
              padding: 0.05rem 0.1rem;
              border-radius: 0.05rem;
            }
          }
        }

        .no-courses {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2.5rem;
        }
      }
    }
  }
}
</style>
