<template>
  <div class="show-container">
    <h2 class="title">总课表展示</h2>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped>
.show-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);

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
