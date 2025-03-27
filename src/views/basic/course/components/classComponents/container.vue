<template>
  <div>
    <div class="schedule">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(day, index) in days" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timeSlot, rowIndex) in timeSlots" :key="rowIndex">
            <td class="time-slot">
              <div>{{ timeSlot.id }}</div>
              <div class="slot-time1">{{ timeSlot.time1 }}</div>
              <div class="slot-time2">{{ timeSlot.time2 }}</div>
            </td>
            <template v-for="(day, colIndex) in days" :key="colIndex">
              <template v-if="!isDraggable">
                <!-- 不可拖拽时，检查是否需要合并行 -->
                <template v-if="hasCoursesStartingAt(colIndex, rowIndex)">
                  <td class="cell" :rowspan="getMaxRowspan(colIndex, rowIndex)">
                    <template
                      v-for="course in getCoursesStartingAt(colIndex, rowIndex)"
                      :key="course.courseId"
                    >
                      <DropZone
                        :day="colIndex"
                        :time="rowIndex"
                        :move-course="moveCourse"
                        :isDraggable="isDraggable"
                      >
                        <CourseCard
                          :courseId="course.courseId"
                          :courseName="course.courseName"
                          :teacherId="course.teacherId"
                          :teacherName="course.teacherName"
                          :classroomId="course.classroomId"
                          :classroomName="course.classroomName"
                          :teachingClassId="course.teachingClassId"
                          :teachingClassName="course.teachingClassName"
                          :week="course.week"
                          :dayOfWeek="colIndex"
                          :timeStart="rowIndex"
                          :identity="userStore.user.identity.toLowerCase()"
                          :move-course="moveCourse"
                          :timeEnd="course.timeEnd"
                          :isDraggable="isDraggable"
                        />
                      </DropZone>
                    </template>
                  </td>
                </template>
                <template v-else>
                  <td class="cell"></td>
                </template>
              </template>
              <template v-else>
                <!-- 可拖拽时，正常显示 -->
                <td class="cell">
                  <DropZone
                    :day="colIndex"
                    :time="rowIndex"
                    :move-course="moveCourse"
                    :isDraggable="isDraggable"
                  >
                    <CourseCard
                      v-for="course in getCourses(colIndex, rowIndex)"
                      :key="course.courseId"
                      :courseId="course.courseId"
                      :courseName="course.courseName"
                      :teacherId="course.teacherId"
                      :teacherName="course.teacherName"
                      :classroomId="course.classroomId"
                      :classroomName="course.classroomName"
                      :teachingClassId="course.teachingClassId"
                      :teachingClassName="course.teachingClassName"
                      :week="course.week"
                      :dayOfWeek="colIndex"
                      :timeStart="rowIndex"
                      :identity="userStore.user.identity.toLowerCase()"
                      :move-course="moveCourse"
                      :timeEnd="course.timeEnd"
                      :isDraggable="isDraggable"
                    />
                  </DropZone>
                </td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, provide, defineProps } from 'vue'
import CourseCard from './CourseCard.vue'
import DropZone from './DropZone.vue'
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()

const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
const timeSlots = [
  { id: 1, time1: '08:00', time2: '08:45' },
  { id: 2, time1: '08:55', time2: '09:40' },
  { id: 3, time1: '10:10', time2: '10:55' },
  { id: 4, time1: '11:05', time2: '11:50' },
  { id: 5, time1: '14:30', time2: '15:15' },
  { id: 6, time1: '15:25', time2: '16:10' },
  { id: 7, time1: '16:20', time2: '17:05' },
  { id: 8, time1: '17:15', time2: '18:00' },
] // 4 大节对应的时间
const props = defineProps({
  isDraggable: Boolean,
  courses: Array,
})
// 从 props 中解构出 isDraggable
const { isDraggable } = toRefs(props)
const { courses } = toRefs(props) // 课程数据
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
// 获取当前大节课程
const getCourses = (day, time) => {
  let filteredCourses = courses.value.filter(course => course.dayOfWeek === day)

  if (!isDraggable.value) {
    // 课表连续模式：合并相邻的相同课程
    let mergedCourses = []
    let seenCourses = new Set()

    for (let i = 0; i < filteredCourses.length; i++) {
      let course = filteredCourses[i]
      let key = `${course.courseId}-${course.dayOfWeek}`

      // 如果这个课程已经处理过了，则跳过
      if (seenCourses.has(key)) continue

      // 只考虑连续两节的情况
      let consecutiveCount = 1
      for (let j = i + 1; j < filteredCourses.length; j++) {
        if (
          filteredCourses[j].courseId === course.courseId &&
          filteredCourses[j].dayOfWeek === course.dayOfWeek &&
          filteredCourses[j].timeStart === filteredCourses[j - 1].timeStart + 1 &&
          consecutiveCount < 2
        ) {
          consecutiveCount++
        } else {
          break
        }
      }

      let minTimeStart = course.timeStart
      let maxTimeStart = course.timeStart + consecutiveCount - 1

      mergedCourses.push({
        ...course,
        timeStart: minTimeStart,
        timeEnd: maxTimeStart, // 记录最后的时间段，用于计算合并块
        rowspan: consecutiveCount, // 计算 rowspan
      })
      // 标记已处理的课程
      for (let k = 0; k < consecutiveCount; k++) {
        seenCourses.add(`${course.courseId}-${course.dayOfWeek}-${minTimeStart + k}`)
      }
    }

    return mergedCourses.filter(c => c.timeStart === time) // 只返回起始时间匹配的课程
  } else {
    // 课表可拖拽模式：正常返回所有课程
    return filteredCourses.filter(course => course.timeStart === time)
  }
}

// 判断是否有课程在指定时间开始
const hasCoursesStartingAt = (day, time) => {
  const courseList = courses.value.filter(
    course => course.dayOfWeek === day && course.timeStart === time,
  )
  for (let i = 0; i < courseList.length; i++) {
    if (courseList[i].timeEnd == time) {
      return false
    }
  }
  return getCourses(day, time).length > 0
}

// 获取指定时间开始的课程的最大 rowspan
const getMaxRowspan = (day, time) => {
  const coursesStartingAt = getCourses(day, time)
  return coursesStartingAt.reduce((max, course) => Math.max(max, course.rowspan), 0)
}

// 获取指定时间开始的课程
const getCoursesStartingAt = (day, time) => {
  return getCourses(day, time)
}

// 拖拽移动课程
const moveCourse = ({ courseId, dragDay, dragTime, hoverDay, hoverTime }) => {
  console.log('拖拽课程', { courseId, dragDay, dragTime, hoverDay, hoverTime })

  // 找到所有匹配的课程（同 courseId 且同 dayOfWeek 和 timeStart）
  const courseList = courses.value.filter(
    c => c.courseId === courseId && c.dayOfWeek === dragDay && c.timeStart === dragTime,
  )

  if (courseList.length > 0) {
    courseList.forEach(course => {
      course.dayOfWeek = hoverDay
      course.timeStart = hoverTime
    })
  } else {
    console.warn(`未找到可拖拽的课程: courseId=${courseId}, day=${dragDay}, time=${dragTime}`)
  }
}
</script>

<style lang="scss" scoped>
.schedule {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  border-radius: 10px;
  font-size: 14px;
}

table {
  border-spacing: 0;
  border-radius: 10px;
  width: 100%;
  overflow: hidden;
  // table-layout: fixed;

  th {
    background-color: #f2f5ff;
  }

  tr:first-child th:first-child {
    border-top-left-radius: 10px;
  }

  tr:first-child th:last-child {
    border-top-right-radius: 10px;
  }

  tr:last-child td:first-child {
    border-bottom-left-radius: 10px;
  }

  tr:last-child td:last-child {
    border-bottom-right-radius: 10px;
  }

  th,
  td {
    text-align: center;
    padding: 6px;
    border-top: none;
    border-left: none;
  }
  td {
    width: 13.2%;
  }
  .cell {
    margin: 10px;
  }
  .time-slot {
    width: 7.6%;
    background-color: #f2f5ff;
    font-weight: bold;
    font-size: 16px;

    .slot-time1 {
      margin-top: 5px;
    }
    .slot-time2 {
      margin-top: 2px;
    }
    .slot-time1,
    .slot-time2 {
      font-size: 13px;
      font-weight: normal;
    }
  }
}
</style>
