<template>
  <div
    class="course-card"
    :style="{
      backgroundColor: getColor(courseId),
      opacity: isDragging ? 0.5 : 1,
      height: duration ? `${duration * 100}px` : '100px',
    }"
  >
    <div class="course-content">
      <div class="course-name">{{ courseName }}</div>
      <div class="course-info">
        <div v-if="classroomName" class="info-item">
          <span class="iconfont icon-icon-ke"></span>
          {{ classroomName }}
        </div>
        <div v-if="week" class="info-item">
          <span class="iconfont icon-icon-zhou"></span>
          {{ week }}
        </div>
        <div v-if="teacherName" class="info-item">
          <span class="iconfont icon-icon-jiaoshi"></span>
          {{ teacherName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  courseId: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    default: '',
  },
  teacherName: {
    type: String,
    default: '',
  },
  classroomId: {
    type: String,
    default: '',
  },
  classroomName: {
    type: String,
    default: '',
  },
  teachingClassId: {
    type: String,
    default: '',
  },
  teachingClassName: {
    type: String,
    default: '',
  },
  week: {
    type: String,
    default: '',
  },
  dayOfWeek: {
    type: Number,
    default: 1,
  },
  timeStart: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 1,
  },
  identity: {
    type: String,
    default: 'student',
  },
  isDraggable: {
    type: Boolean,
    default: false,
  },
  isDragging: {
    type: Boolean,
    default: false,
  },
})

// 从父组件注入颜色函数
const getColor = inject('getColor', () => '#e78891')
</script>

<style lang="scss" scoped>
.course-card {
  width: 100%;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .course-content {
    .course-name {
      font-weight: bold;
      margin-bottom: 5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .course-info {
      .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 3px;
        font-size: 10px;

        .iconfont {
          margin-right: 3px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
