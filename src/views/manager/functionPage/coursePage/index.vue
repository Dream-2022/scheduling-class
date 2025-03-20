<template>
  <div class="course-page">
    <div class="course-content-title">
      <div class="left-title">
        <div :class="active[0] ? 'active' : 'gray-active'" @click="setActive(0)">排课表</div>
        <div>/</div>
        <div :class="active[1] ? 'active' : 'gray-active'" @click="setActive(1)">排考试表</div>
      </div>
      <!-- 新增搜索图标和输入框 -->
      <div class="search-container" @click.stop="toggleSearch">
        <el-icon class="el-icon--right"><Search /></el-icon>
        <Search v-if="!isSearching && !searchQuery" />
        <input v-else type="text" v-model="searchQuery" @blur="handleBlur" />
      </div>
    </div>
    <div class="course-right">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
let active = ref([true, false])
let isSearching = ref(false)
let searchQuery = ref('')

function setActive(index) {
  active.value = [false, false]
  active.value[index] = true
}

function toggleSearch() {
  isSearching.value = true
}

function handleBlur() {
  if (!searchQuery.value) {
    isSearching.value = false
  }
}
</script>
<style lang="scss" scoped>
.course-page {
  width: 90%;
  margin: 60px auto;
  margin-top: 10px;

  .course-content-title {
    background-color: $blue-back;
    border-radius: 8px;
    padding: 0 20px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div > div {
      display: inline-block;
      padding: 0 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .active {
      color: $deep-color;
      font-weight: 600;
      font-size: 16px;
    }
    .search-container {
      display: flex;
      align-items: center;
      input {
        border: none;
        outline: none;
        padding: 5px;
        border-radius: 4px;
        transition: width 0.3s;
        width: 150px;
      }
    }
  }
  .course-right {
    flex: 1;
    border-radius: 8px 26px 26px 8px;
  }
}
:deep(.el-tabs__header.el-tabs__header-vertical.is-left) {
  margin: 0;
}
:deep(.el-tabs__active-bar.is-left) {
  width: 4px;
  border-radius: 2px;
}
:deep(.el-steps) {
  width: 100%;
}
:deep(.el-steps--simple) {
  background-color: #fff !important;
  border-radius: 24px 24px 8px 8px;
}
</style>
