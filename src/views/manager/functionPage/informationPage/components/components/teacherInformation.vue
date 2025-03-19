<template>
  <div></div>
</template>
<script setup>
import { onMounted } from 'vue'
import { getTeacherAndStudentAPI } from '@/apis/person'
onMounted(async () => {
  const res = await getTeacherAndStudentAPI()
  console.log(res.data)
})
</script>
<style lang="scss" scoped></style>
