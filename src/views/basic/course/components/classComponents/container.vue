<template>
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
            <DropZone :day="colIndex" :time="rowIndex" :move-course="moveCourse">
              <CourseCard
                v-for="(course, index) in getCourses(colIndex, rowIndex)"
                :key="course.id"
                :id="course.id"
                :text="course.text"
                :index="index"
                :day="colIndex"
                :time="rowIndex"
                :move-course="moveCourse"
              />
            </DropZone>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CourseCard from './courseCard.vue'
import DropZone from './dropZone.vue'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

const courses = ref([
  { id: 1, text: 'Math', day: 0, time: 1 },
  { id: 2, text: 'Physics', day: 2, time: 3 },
  { id: 3, text: 'English', day: 4, time: 5 },
])

const getCourses = (day, time) => {
  return courses.value.filter(course => course.day === day && course.time === time)
}

const moveCourse = ({ id, dragDay, dragTime, hoverDay, hoverTime }) => {
  const course = courses.value.find(c => c.id === id)
  console.log(dragDay, dragTime)
  if (course) {
    course.day = hoverDay
    course.time = hoverTime
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
