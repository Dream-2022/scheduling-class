<template>
  <div class="special-top">
    <div class="button-boxes">
      <div
        class="button-box"
        v-for="item in buttonList"
        :key="item"
        :value="item.value"
        @click="handleButtonClick(i)"
      >
        <el-button
          :color="activeValueList[item.value] == 1 ? '#547bf1' : ''"
          :plain="!activeValueList[item.value] == 1"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div class="setting-box">
      <el-button color="#f56c6c" plain @click="clearConditionClick">清空条件设置</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const activeValueList = ref([])
const buttonList = ref([
  { label: '教师互斥', value: 1 },
  { label: '教研活动', value: 2 },
  { label: '科目互斥', value: 3 },
  { label: '科目组合', value: 4 },
  { label: '教学进度均衡', value: 5 },
  { label: '科目天内排课次数限制', value: 7 },
  { label: '教师周内节次限制', value: 8 },
  { label: '教师特定节次限制', value: 9 },
  { label: '科目特定节次限制', value: 10 },
  { label: '教师上下午限制', value: 11 },
  { label: '科目上下午限制', value: 12 },
  { label: '教师天内任课限制', value: 13 },
  { label: '合班课设置', value: 15 },
  { label: '教师连排', value: 16 },
  { label: '教师禁止连堂', value: 17 },
])
onMounted(async () => {
  activeValueList.value = new Array(26).fill(0)
  activeValueList.value[1] = 1
})

//点击清空条件设置
function clearConditionClick() {
  for (let i = 0; i < activeValueList.value.length; i++) {
    if (activeValueList.value[i] == 2) {
      activeValueList.value[i] = 0
    }
  }
}
</script>
<style lang="scss" scoped>
.special-top {
  display: flex;
  .button-boxes {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  .setting-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}
</style>
