<template>
  <div
    ref="cardRef"
    :class="isDraggable ? 'course-card-height' : 'course-card'"
    :style="{ backgroundColor: courseColor, opacity }"
  >
    <div class="course-name">{{ courseName }}</div>
    <div class="course-classroom">@ {{ classroomName }}</div>
    <div>
      <b>{{ week }}</b> 周
    </div>
    <div class="course-teacher" v-if="props.identity != 'teacher'">{{ teacherName }}</div>
    <div class="course-teacher" v-if="props.identity != 'student'">{{ teachingClassName }}</div>
  </div>
</template>

<script setup>
import { ref, computed, unref, inject, onMounted, toRefs } from 'vue'
import { useDrag } from 'vue3-dnd'
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
  isDraggable: Boolean,
})

const opacity = computed(() => (unref(isDragging) ? 0.5 : 1))
const cardRef = ref(null)
const getColor = inject('getColor') // 通过 provide/inject 获取颜色函数
let courseColor = ref('') // 获取当前课程颜色
const dragItem = computed(() => ({
  courseId: props.courseId,
  dayOfWeek: props.dayOfWeek,
  timeStart: props.timeStart, // 确保拖拽时用的是大节
}))
onMounted(() => {
  let idStr
  if (props.identity == 'student') {
    idStr = props.courseId
  } else {
    idStr = props.teachingClassId
  }
  courseColor.value = getColor(idStr)
})
const [collect, drag] = useDrag({
  type: 'course',
  item: () => ({ ...dragItem.value }), // 确保获取的是最新的值
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
})
const { isDragging } = toRefs(collect)
drag(cardRef)
</script>
<style lang="scss" scoped>
.course-card {
  min-height: 160px;
  width: 90%;
  margin-top: 5px;
  padding: 6px;
  color: #fff;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  text-align: left;
  cursor: move;
  > div {
    word-break: break-all;
    line-height: 22px;
  }
}
.course-card-height {
  background-color: #ccc !important;
  margin-top: 5px;
  min-height: 100px;
  width: 90%;
  padding: 6px;
  color: #fff;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  text-align: left;
  > div {
    word-break: break-all;
    line-height: 22px;
  }
}
.course-name,
.course-classroom {
  font-weight: bold;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-teacher {
  font-size: 12px;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
