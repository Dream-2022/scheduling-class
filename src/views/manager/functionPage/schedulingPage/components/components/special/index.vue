<template>
  <div class="special-top">
    <div class="button-boxes">
      <div
        class="button-box"
        v-for="item in buttonList"
        :key="item"
        :value="item.value"
        @click="handleButtonClick(item.name)"
      >
        <el-button
          :color="activeValueList[item.value]?.value == 0 ? '' : '#547bf1'"
          :plain="activeValueList[item.value]?.value == 2"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div class="setting-box">
      <el-button color="#f56c6c" plain @click="clearConditionClick">清空条件设置</el-button>
    </div>
  </div>
  <div class="special-bottom">
    <RouterView :allContent="allContent" @update:allContent="updateAllContent"></RouterView>
  </div>
</template>
<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const activeValueList = ref([])
const buttonList = ref([
  { label: '教师互斥', value: 0, name: 'teacherExclusion' },
  { label: '教研活动', value: 1, name: 'teacherActivities' },
  { label: '科目互斥', value: 2, name: 'subjectExclusion' },
  { label: '科目组合', value: 3, name: 'subjectCombination' },
  { label: '科目禁排', value: 4, name: 'subjectProhibition' },
  { label: '科目天内排课次数限制', value: 5, name: 'subjectDayLimit' },
  { label: '教师周内节次限制', value: 6, name: 'teacherWeekLimit' },
  { label: '教师特定节次限制', value: 7, name: 'teacherRestrictions' },
  { label: '科目特定节次限制', value: 8, name: 'subjectRestrictions' },
  { label: '教师上下午限制', value: 9, name: 'teacherMorningAfternoon' },
  { label: '科目上下午限制', value: 10, name: 'subjectMorningAfternoon' },
  { label: '教师天内任课限制', value: 11, name: 'teacherDayLimit' },
  { label: '合班课设置', value: 12, name: 'jointClass' },
  { label: '教师连排', value: 13, name: 'teacherRow' },
  { label: '教师禁止连堂', value: 14, name: 'teacherProhibitedRow' },
  { label: '班级固定教室', value: 15, name: 'classClassroom' },
  { label: '多学时课程连续排', value: 16, name: 'continuousScheduling' },
])
//所有限制内容
const allContent = ref({})
const router = useRouter()
onMounted(async () => {
  const path = router.currentRoute.value.path
  activeValueList.value = buttonList.value.map(item => ({
    value: path.includes(item.name) ? 1 : 0,
    name: item.name,
  }))
  console.log(activeValueList.value)
  //设置allContent中的属性名
  buttonList.value.forEach(item => {
    if (!allContent.value[item.name]) {
      allContent.value[item.name] = []
    }
  })
})
// 处理子组件传递过来的 allContent 更新事件
const updateAllContent = newAllContent => {
  allContent.value = newAllContent
  statusButton() //更新按钮选择状态
}
//处理点击跳转事件
function handleButtonClick(name) {
  for (let i = 0; i < activeValueList.value.length; i++) {
    if (activeValueList.value[i].value == 1) {
      activeValueList.value[i].value = 0
    }
    if (activeValueList.value[i].name == name) {
      activeValueList.value[i].value = 1
    }
  }
  statusButton() //更新按钮选择状态
  router.push(`/manager/functionPage/scheduling/scheduleCourse/special/${name}`)
}

//更新按钮选择状态
function statusButton() {
  for (const [name, arr] of Object.entries(allContent.value)) {
    if (arr.length > 0) {
      const item = buttonList.value.find(item => item.name === name)
      if (item && activeValueList.value[item.value].value != 1) {
        const value = item.value
        activeValueList.value[value].value = 2
      }
    }
  }
}
//点击清空条件设置
function clearConditionClick() {
  ElMessageBox.confirm('确定要清空所有条件设置吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      for (let i = 0; i < activeValueList.value.length; i++) {
        if (activeValueList.value[i].value == 2) {
          activeValueList.value[i].value = 0
        }
      }
      //设置allContent中的属性名
      buttonList.value.forEach(item => {
        if (!allContent.value[item.name]) {
          allContent.value[item.name] = []
        }
      })
      console.log(allContent.value)
      ElMessage.success('已清空所有条件设置')
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
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
.special-bottom {
  margin-top: 20px;
}
</style>
