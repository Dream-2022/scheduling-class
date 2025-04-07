<template>
  <div class="show-container">
    <div class="show-box">
      <h2 class="title">总课表展示</h2>
      <div>
        <el-button color="#547bf1" @click="finishClick" plain :icon="Finished">完成设置</el-button>
      </div>
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { Finished } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
function finishClick() {
  router.push(`/manager/functionPage/course/1902649449470054400/class?name=第二次排课`)
}
</script>

<style lang="scss" scoped>
.show-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  .show-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }

  .content {
    min-height: 500px;
  }
}
</style>
