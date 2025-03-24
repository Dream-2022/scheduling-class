<template>
  <div ref="cardRef" class="course-card" :style="{ opacity }">
    <div class="course-name">{{ courseName }}</div>
    <div class="course-classroom">@{{ classroomName }}</div>
    <div>{{ teacherName }}</div>
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useDrag } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'

const props = defineProps({
  courseId: Number,
  courseName: String,
  teacherId: Number,
  teacherName: String,
  classroomId: Number,
  classroomName: String,
  dayOfWeek: Number,
  week: Number,
  timeStart: Number,
  timeEnd: Number,
  moveCourse: Function,
})

const mapTimeToSession = time => Math.floor(time / 2) // 8节课转4大节

const [collect, drag] = useDrag({
  type: 'course',
  item: () => ({
    courseId: props.courseId,
    dayOfWeek: props.dayOfWeek,
    timeStart: mapTimeToSession(props.timeStart), // 确保拖拽时用的是大节
  }),
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
})

const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0.5 : 1))

const cardRef = ref(null)
drag(cardRef)
</script>
<style lang="scss" scoped>
.course-card {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  cursor: move;
  > div {
    line-height: 25px;
  }
  .course-name,
  .course-classroom {
    font-weight: bold;
  }
}
</style>
