<template>
  <div ref="cardRef" class="course-card" :style="{ opacity }">
    {{ text }}
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useDrag } from 'vue3-dnd'
import { toRefs } from '@vueuse/core'

const props = defineProps({
  id: Number,
  text: String,
  index: Number,
  day: Number,
  time: Number,
  moveCourse: Function,
})

const [collect, drag] = useDrag({
  type: 'course',
  item: () => ({
    id: props.id,
    day: props.day,
    time: props.time,
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

<style scoped>
.course-card {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  cursor: move;
}
</style>
