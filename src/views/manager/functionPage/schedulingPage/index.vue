<template>
  <div class="course">
    <div class="course-top">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="排课时间段" />
        <!-- 排课周期 -->
        <el-step title="学校基础信息" />
        <el-step title="禁排设置" />
        <el-step title="排课优先级" />
        <el-step title="设置课程教室" />
      </el-steps>
      <el-button color="#626aef" :dark="isDark">Default</el-button>
      <el-button color="#626aef" :dark="isDark">Default</el-button>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.course {
  display: flex;
  justify-content: center;
  .course-top {
    display: flex;
    align-items: center;
    width: 95%;
    background-color: #fff;
    border-radius: 24px 24px 8px 8px;
    height: 50px;

    .el-button {
      line-height: 50px;
    }
  }
}
:deep(.el-steps) {
  width: 100%;
}
:deep(.el-steps--simple) {
  background-color: #fff !important;
  border-radius: 24px 24px 8px 8px;
}
</style>
