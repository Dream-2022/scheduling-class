<template>
  <div ref="dropRef" class="drop-zone">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDrop } from 'vue3-dnd'

const props = defineProps({
  day: Number,
  time: Number,
  moveCourse: Function,
  isDraggable: Boolean,
})

const [, drop] = useDrop({
  accept: 'course',
  drop: item => {
    if (props.isDraggable) {
      props.moveCourse({
        courseId: item.courseId,
        dragDay: item.dayOfWeek,
        dragTime: item.timeStart,
        hoverDay: props.day,
        hoverTime: props.time,
      })
    }
  },
})

const dropRef = ref(null)
drop(dropRef)
</script>

<style scoped>
.drop-zone {
  position: relative;
  display: flex;
  gap: 10px;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}
</style>
