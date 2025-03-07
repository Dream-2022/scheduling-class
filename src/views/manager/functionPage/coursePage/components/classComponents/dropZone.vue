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
})

const [, drop] = useDrop({
  accept: 'course',
  drop: item => {
    props.moveCourse({
      id: item.id,
      dragDay: item.day,
      dragTime: item.time,
      hoverDay: props.day,
      hoverTime: props.time,
    })
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80px;
}
</style>
