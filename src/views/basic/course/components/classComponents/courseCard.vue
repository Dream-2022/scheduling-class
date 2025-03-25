<template>
  <div ref="cardRef" class="course-card" :style="{ opacity }">
    <div class="course-name">{{ courseName }}</div>
    <div class="course-classroom">@{{ classroomName }}</div>
    <div class="course-teacher" v-if="identity == 'student'">{{ teacherName }}</div>
    <div class="course-teacher" v-if="identity == 'teacher'">
      {{ teachingClassName }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useDrag } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'
const props = defineProps({
  courseId: String,
  courseName: String,
  teacherId: String,
  teacherName: String,
  classroomId: String,
  classroomName: String,
  teachingClassId: String,
  teachingClassName: String,
  dayOfWeek: Number,
  week: String,
  timeStart: Number,
  identity: String,
  moveCourse: Function,
})

const dragItem = computed(() => ({
  courseId: props.courseId,
  dayOfWeek: props.dayOfWeek,
  timeStart: props.timeStart, // 确保拖拽时用的是大节
}))

const [collect, drag] = useDrag({
  type: 'course',
  item: () => ({ ...dragItem.value }), // 确保获取的是最新的值
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
  padding: 5px;
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
  .course-teacher {
    margin-top: 10px;
  }
}
</style>
