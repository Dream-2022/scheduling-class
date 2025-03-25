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
                  :teachingClassId="course.teachingClassId"
                  :teachingClassName="course.teachingClassName"
                  :dayOfWeek="colIndex"
                  :timeStart="rowIndex"
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
import { ref, toRefs, defineProps, onMounted } from 'vue'
import CourseCard from './CourseCard.vue'
import DropZone from './DropZone.vue'
import { setTimetableAPI } from '@/apis/timetable'
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
})
// 从 props 中解构出 isDraggable
const { isDraggable } = toRefs(props)
// 课程数据
// const courses = ref([
//   {
//     courseId: '1',
//     courseName: '大学英语',
//     teacherId: '1',
//     teacherName: 'Brown',
//     classroomId: 'ZHL3-303',
//     classroomName: '1003',
//     dayOfWeek: 4,
//     week: 1,
//     timeStart: 4,
//   },
//   {
//     courseId: '1',
//     courseName: '大学英语',
//     teacherId: '1',
//     teacherName: 'Brown',
//     classroomId: 'ZHL3-303',
//     classroomName: '1003',
//     dayOfWeek: 4,
//     week: 1,
//     timeStart: 5,
//   },
//   {
//     courseId: '2',
//     courseName: '数学',
//     teacherId: '2',
//     teacherName: 'qq',
//     classroomId: '32',
//     classroomName: '1103',
//     dayOfWeek: 4,
//     week: 2,
//     timeStart: 0,
//   },
//   {
//     courseId: '2',
//     courseName: '数学',
//     teacherId: '2',
//     teacherName: 'qq',
//     classroomId: '32',
//     classroomName: '1103',
//     dayOfWeek: 4,
//     week: 2,
//     timeStart: 1,
//   },
//   {
//     courseId: '3',
//     courseName: '英语',
//     teacherId: '3',
//     teacherName: '李',
//     classroomId: '456',
//     classroomName: '1203',
//     dayOfWeek: 5,
//     week: 5,
//     timeStart: 6,
//   },
//   {
//     courseId: '3',
//     courseName: '英语',
//     teacherId: '3',
//     teacherName: '李',
//     classroomId: '456',
//     classroomName: '1203',
//     dayOfWeek: 5,
//     week: 5,
//     timeStart: 7,
//   },
// ])
const courses = ref([])
onMounted(async () => {
  //获取课程数据
  const res1 = await setTimetableAPI()
  console.log(res1.data)
  if (res1.data.code === 'B000001') {
    console.log('系统繁忙')
  }
  courses.value = res1.data.data
})

// 获取当前大节课程
const getCourses = (day, time) => {
  return courses.value
    .filter(course => course.dayOfWeek === day && course.timeStart === time)
    .map(course => ({
      ...course,
      identity: userStore.user.identify,
    }))
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
  // border: 1px solid #ccc;
  overflow: hidden;

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
    width: 12.9%;
  }
  td.time-slot {
    width: 56px;
  }
  .time-slot {
    width: 56px;
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
