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
                    @course-dropped="handleCourseDropped"
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
                    <!-- 教室占用提示 -->
                    <el-popover
                      v-model:visible="showConflictPopover"
                      title="教室冲突提示"
                      width="300"
                      trigger="manual"
                      placement="top"
                      popper-class="conflict-popover"
                      :hide-after="0"
                      :persistent="true"
                    >
                      <template #reference>
                        <div class="conflict-indicator" v-if="showRoomConflict(colIndex, rowIndex)">
                          <el-icon><Warning /></el-icon>
                        </div>
                      </template>
                      <div class="conflict-popover-content">
                        <div class="conflict-info">
                          <p class="conflict-title">当前节次的教室已被占用：</p>
                          <p class="conflict-room">
                            <strong>{{ getConflictRoom() }}</strong>
                          </p>
                        </div>
                        <div class="room-selector">
                          <p class="selector-title">请选择新教室：</p>
                          <el-select
                            v-model="selectedRoom"
                            placeholder="请选择新教室"
                            class="room-select"
                          >
                            <el-option
                              v-for="room in availableRooms"
                              :key="room.id"
                              :label="room.name"
                              :value="room.id"
                            />
                          </el-select>
                        </div>
                        <div class="popover-footer">
                          <el-button type="primary" size="small" @click="changeRoom"
                            >更改教室</el-button
                          >
                          <el-button type="danger" size="small" @click="cancelMove"
                            >取消拖拽</el-button
                          >
                        </div>
                      </div>
                    </el-popover>
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
import { ElMessage, ElPopover } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
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

// 教室冲突相关
const selectedRoom = ref('')
const availableRooms = ref([
  { id: '1', name: 'XDNY2#209' },
  { id: '2', name: 'XXJS3#301' },
  { id: '3', name: 'XDNY1#110' },
])
const conflictInfo = ref({
  day: null,
  time: null,
  room: null,
  courseId: null,
  originalDay: null,
  originalTime: null,
})
const showConflictPopover = ref(false)

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
  if (!courses.value || !courses.value.length) {
    return false
  }
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

// 检查是否显示教室冲突提示（周六第一节课）
const showRoomConflict = (day, time) => {
  // 周六是第5个索引（从0开始），第一节课是第0个索引
  return (
    day === 5 && time === 0 && conflictInfo.value.day === day && conflictInfo.value.time === time
  )
}

// 获取冲突的教室名称
const getConflictRoom = () => {
  return conflictInfo.value.room || 'XDNY1#102'
}

// 处理课程拖放事件
const handleCourseDropped = ({ courseId, dragDay, dragTime, hoverDay, hoverTime }) => {
  console.log('课程拖放事件', { courseId, dragDay, dragTime, hoverDay, hoverTime })

  // 检查是否是周六第一节课
  if (hoverDay === 5 && hoverTime === 0) {
    console.log('检测到周六第一节课冲突')
    // 设置冲突信息，同时保存原始位置
    conflictInfo.value = {
      day: hoverDay,
      time: hoverTime,
      room: 'XDNY1#102',
      courseId: courseId,
      originalDay: dragDay,
      originalTime: dragTime,
    }
    // 显示冲突弹出框
    showConflictPopover.value = true
    // 不立即移动课程，等待用户选择操作
    return
  }

  // 其他情况正常移动课程
  moveCourse({ courseId, dragDay, dragTime, hoverDay, hoverTime })
}

// 更改教室
const changeRoom = () => {
  if (!selectedRoom.value) {
    ElMessage.warning('请选择新教室')
    return
  }

  // 获取选中的教室名称
  const selectedRoomName = availableRooms.value.find(room => room.id === selectedRoom.value)?.name

  if (!selectedRoomName) {
    ElMessage.error('未找到选中的教室')
    return
  }

  // 更新课程教室
  const { day, time, courseId } = conflictInfo.value
  const courseIndex = courses.value.findIndex(course => course.courseId === courseId)

  if (courseIndex !== -1) {
    // 更新课程教室
    courses.value[courseIndex].classroomId = selectedRoom.value
    courses.value[courseIndex].classroomName = selectedRoomName
    // 移动课程到新位置
    moveCourse({
      courseId,
      dragDay: conflictInfo.value.originalDay,
      dragTime: conflictInfo.value.originalTime,
      hoverDay: day,
      hoverTime: time,
    })
    ElMessage.success(`已将课程教室更改为 ${selectedRoomName}`)
  }

  // 重置冲突信息
  conflictInfo.value = {
    day: null,
    time: null,
    room: null,
    courseId: null,
    originalDay: null,
    originalTime: null,
  }
  // 关闭弹出框
  showConflictPopover.value = false
}

// 取消移动
const cancelMove = () => {
  // 如果有原始位置信息，将课程移回原位置
  if (conflictInfo.value.originalDay !== null && conflictInfo.value.originalTime !== null) {
    moveCourse({
      courseId: conflictInfo.value.courseId,
      dragDay: conflictInfo.value.day,
      dragTime: conflictInfo.value.time,
      hoverDay: conflictInfo.value.originalDay,
      hoverTime: conflictInfo.value.originalTime,
    })
    ElMessage.info('已将课程移回原位置')
  } else {
    ElMessage.info('已取消课程移动')
  }

  // 重置冲突信息
  conflictInfo.value = {
    day: null,
    time: null,
    room: null,
    courseId: null,
    originalDay: null,
    originalTime: null,
  }
  // 关闭弹出框
  showConflictPopover.value = false
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

.conflict-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: #f56c6c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 5;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  .el-icon {
    font-size: 14px;
  }
}

.conflict-popover-content {
  .conflict-info {
    margin-bottom: 15px;

    .conflict-title {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #606266;
    }

    .conflict-room {
      margin: 0;
      font-size: 16px;

      strong {
        color: #f56c6c;
        font-weight: bold;
      }
    }
  }

  .room-selector {
    margin-bottom: 15px;

    .selector-title {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #606266;
    }

    .room-select {
      width: 100%;
    }
  }

  .popover-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

:deep(.conflict-popover) {
  .el-popover__title {
    font-weight: bold;
    color: #303133;
  }

  // 防止弹出框自动隐藏
  &.el-popper {
    pointer-events: auto;
  }
}
</style>
