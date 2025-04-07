<template>
  <div class="schedule-preview">
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

      <DndProvider :backend="HTML5Backend">
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
                  <DropZone
                    :day-index="dayIndex"
                    :time-slot="timeSlot - 1"
                    :is-draggable="isDraggable"
                    @move-course="moveCourse"
                  >
                    <CourseCard
                      v-if="getCourse(timeSlot, day)"
                      :course="getCourse(timeSlot, day)"
                      :is-draggable="isDraggable"
                    />
                  </DropZone>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DndProvider>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, provide } from 'vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CourseCard from '@/views/basic/course/components/classComponents/CourseCard.vue'
import DropZone from '@/views/basic/course/components/classComponents/DropZone.vue'

const props = defineProps({
  scheduleData: {
    type: Object,
    default: () => null,
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
})

const days = ['星期一', '星期二', '星期三', '星期四', '星期五']
const timeSlots = Array.from({ length: 8 }, (_, i) => i + 1)
const activeDepartment = ref('')

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

// 获取日期索引
const getDayIndex = day => {
  return days.indexOf(day)
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

// 拖拽移动课程
const moveCourse = ({ courseId, dragDay, dragTime, hoverDay, hoverTime }) => {
  console.log('拖拽课程', { courseId, dragDay, dragTime, hoverDay, hoverTime })

  if (!currentDepartmentSchedule.value) return

  // 找到所有匹配的课程
  const courseList = currentDepartmentSchedule.value.courses.filter(
    c => c.id === courseId && getDayIndex(c.day) === dragDay && c.timeSlot === dragTime + 1,
  )

  if (courseList.length > 0) {
    courseList.forEach(course => {
      course.day = days[hoverDay]
      course.timeSlot = hoverTime + 1
    })
  } else {
    console.warn(`未找到可拖拽的课程: courseId=${courseId}, day=${dragDay}, time=${dragTime}`)
  }
}
</script>

<style lang="scss" scoped>
.schedule-preview {
  .empty-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .schedule-table {
    .department-tabs {
      margin-bottom: 15px;
    }

    .table-container {
      overflow-x: auto;
      max-width: 100%;

      .schedule {
        table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          border-radius: 8px;
          overflow: hidden;

          th,
          td {
            text-align: center;
            padding: 8px;
            border: 1px solid #e0e0e0;
            position: relative;
            min-width: 100px;
          }

          th {
            background-color: #f2f5ff;
            font-weight: 500;
          }

          .time-slot {
            background-color: #f2f5ff;
            font-weight: 500;
            width: 80px;

            .slot-time {
              font-size: 12px;
              color: #606266;
              margin-top: 5px;
            }
          }

          .cell {
            height: 100px;
            vertical-align: top;
          }
          .td:nth-child(1) {
            width: 50px;
          }
        }
      }
    }
  }
}
</style>
