<template>
  <div class="priority-top">
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
          <span v-if="item.label == '时间片优先级'" style="color: #f56c6c; padding-right: 6px">
            *
          </span>
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div class="setting-box">
      <el-button color="#f56c6c" plain @click="clearConditionClick">清空禁排设置</el-button>
    </div>
  </div>
  <div class="prohibition-bottom">
    <RouterView :allContent="allContent" @update:allContent="updateAllContent"></RouterView>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const activeValueList = ref([])
const buttonList = ref([
  { label: '学生院系优先', value: 0, name: 'studentDepartment' },
  { label: '开课院系优先', value: 1, name: 'lessonDepartment' },
  { label: '课程性质优先', value: 2, name: 'lessonNature' },
  { label: '学时类型优先', value: 3, name: 'creditHourType' },
  { label: '课程类型优先', value: 4, name: 'lessonType' },
  { label: '时间片优先级', value: 5, name: 'priorityTime' },
])

const allContent = ref({})
const router = useRouter()

onMounted(async () => {
  const path = router.currentRoute.value.path
  activeValueList.value = buttonList.value.map(item => ({
    value: path.includes(item.name) ? 1 : 0,
    name: item.name,
  }))

  buttonList.value.forEach(item => {
    if (!allContent.value[item.name]) {
      allContent.value[item.name] = []
    }
  })
})

const updateAllContent = newAllContent => {
  allContent.value = newAllContent
  console.log(allContent.value)
  statusButton()
}

function handleButtonClick(name) {
  for (let i = 0; i < activeValueList.value.length; i++) {
    if (activeValueList.value[i].value == 1) {
      activeValueList.value[i].value = 0
    }
    if (activeValueList.value[i].name == name) {
      activeValueList.value[i].value = 1
    }
  }
  statusButton()
  router.push(`/manager/functionPage/scheduling/scheduleCourse/priority/${name}`)
}

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

function clearConditionClick() {
  ElMessageBox.confirm('确定要清空所有禁排设置吗？', '提示', {
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
      buttonList.value.forEach(item => {
        if (!allContent.value[item.name]) {
          allContent.value[item.name] = []
        }
      })
      ElMessage.success('已清空所有禁排设置')
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}
</script>

<style lang="scss" scoped>
.priority-top {
  display: flex;
  .button-boxes {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
  .setting-box {
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
}
.prohibition-bottom {
  margin-top: 20px;
}
</style>
