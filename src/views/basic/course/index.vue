<template>
  <div class="course-page">
    <div class="course-content-title">
      <div class="left-title">
        <div :class="active[0] ? 'active' : 'gray-active'" @click="setActive(0)">排课表</div>
        <div>/</div>
        <div :class="active[1] ? 'active' : 'gray-active'" @click="setActive(1)">排考试表</div>
      </div>
      <div class="search-container" @click.stop="toggleSearch">
        <Search class="search-icon" />
        <input
          class="search-input"
          v-if="isSearching || searchQuery"
          type="text"
          v-model="searchQuery"
          placeholder="请输入要搜索的内容"
          @blur="handleBlur"
        />
      </div>
    </div>
    <div class="course-right">
      <RouterView :activeMessage="active"></RouterView>
    </div>
  </div>
</template>
<script setup>
import { RouterView, useRoute } from 'vue-router'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { ref, nextTick, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
const route = useRoute()
const userStore = useUserStore()
let active = ref([true, false])
let isSearching = ref(false)
let searchQuery = ref('')

onMounted(() => {
  if (route.query.value == 'true') {
    setActive(0)
  } else if (route.query.value == 'false') {
    setActive(1)
  }
})
function setActive(index) {
  active.value = [false, false]
  active.value[index] = true
  //清空搜索框
  searchQuery.value = ''
  isSearching.value = false
  let path = router.currentRoute.value.fullPath
  const identity = userStore.user.identity
  if (path !== `/${identity}/functionPage/course/main`) {
    //可以在这里做一些处理（未保存时的处理）
    router.push(`/${identity}/functionPage/course/main`)
  }
}

function toggleSearch() {
  isSearching.value = true
  nextTick(() => {
    document.querySelector('.search-input').focus()
  })
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
  margin-top: 25px;

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

      .search-icon {
        margin-right: 10px;
        width: 24px;
      }

      .search-input {
        width: 200px;
        height: 20px;

        border: 1px solid $word-border-color;
        outline: none;
        padding: 5px 10px;
        border-radius: 4px;
        transition: width 0.3s;

        &:focus {
          border: 1px solid $back-color;
        }
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
