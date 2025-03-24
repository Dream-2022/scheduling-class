<template>
  <div>
    <button @click="toggleDraggable">{{ isDraggable ? 'Disable Drag' : 'Enable Drag' }}</button>
    <div class="schedule">
      <table>
        <thead>
          <tr>
            <th>时间/星期</th>
            <th v-for="(day, index) in days" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timeSlot, rowIndex) in timeSlots" :key="rowIndex">
            <td class="time-slot">{{ timeSlot }}</td>
            <td v-for="(day, colIndex) in days" :key="colIndex" class="cell">
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
                  :dayOfWeek="colIndex"
                  :timeStart="rowIndex"
                  :timeEnd="rowIndex + 1"
                  :move-course="moveCourse"
                />
              </DropZone>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CourseCard from './CourseCard.vue'
import DropZone from './DropZone.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = ['08:00', '10:00', '13:00', '15:00'] // 4 大节对应的时间

// 课程数据
const courses = ref([
  {
    courseId: 1,
    courseName: '数学',
    teacherId: 1,
    teacherName: 'Mr. Smith',
    classroomId: 101,
    classroomName: 'Room 101',
    dayOfWeek: 0,
    week: 1,
    timeStart: 1,
    timeEnd: 2,
  },
  {
    courseId: 2,
    courseName: '计算机科学与技术',
    teacherId: 2,
    teacherName: 'Ms. Johnson',
    classroomId: 102,
    classroomName: 'Room 102',
    dayOfWeek: 2,
    week: 1,
    timeStart: 3,
    timeEnd: 4,
  },
  {
    courseId: 3,
    courseName: '大学英语',
    teacherId: 3,
    teacherName: 'Mr. Brown',
    classroomId: 103,
    classroomName: 'Room 103',
    dayOfWeek: 4,
    week: 1,
    timeStart: 5,
    timeEnd: 6,
  },
])

const isDraggable = ref(true)

const toggleDraggable = () => {
  isDraggable.value = !isDraggable.value
}

// **小节转大节映射**
const mapToLargeSection = time => {
  if (time >= 0 && time <= 1) return 0 // 第一大节
  if (time >= 2 && time <= 3) return 1 // 第二大节
  if (time >= 4 && time <= 5) return 2 // 第三大节
  if (time >= 6 && time <= 7) return 3 // 第四大节
  return null
}

// **获取当前大节课程**
const getCourses = (day, time) => {
  return courses.value
    .filter(course => course.dayOfWeek === day && mapToLargeSection(course.timeStart) === time)
    .map(course => ({
      ...course,
      timeStart: mapToLargeSection(course.timeStart),
      timeEnd: mapToLargeSection(course.timeEnd),
    }))
}

// **拖拽移动课程**
const moveCourse = ({ courseId, dragDay, dragTime, hoverDay, hoverTime }) => {
  console.log(dragDay, dragTime)
  const course = courses.value.find(c => c.courseId === courseId)
  if (course) {
    course.dayOfWeek = hoverDay
    course.timeStart = hoverTime * 2 // 变回小节（每大节 2 小节）
    course.timeEnd = hoverTime * 2 + 1
  }
}
</script>

<style scoped>
.schedule {
  display: flex;
  justify-content: center;
  padding: 20px;
}

table {
  border-collapse: collapse;
  width: 100%;
  max-width: 800px;
}

th,
td {
  border: 1px solid #ccc;
  text-align: center;
  padding: 10px;
  min-width: 100px;
}

.time-slot {
  background-color: #f0f0f0;
  font-weight: bold;
}

.cell {
  position: relative;
  min-height: 50px;
}
</style>
