<template>
  <div class="information-list">
    <div class="search-box">
      <el-input
        v-model="teacher"
        clearable
        style="height: 32px; max-width: 350px"
        :placeholder="'请输入' + (navigationValue ? '教师' : '') + '关键词'"
        :prefix-icon="Search"
      />
      <el-button color="#547bf1" plain :icon="Search" @click="applicationSearchClick()">
        搜索
      </el-button>
    </div>
    <div class="information-boxes">
      <div class="information-box">
        <div class="information-box-title"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
</script>
<style lang="scss" scoped>
.information-list {
  .search-box {
    display: flex;
    gap: 10px;
  }
}
</style>
