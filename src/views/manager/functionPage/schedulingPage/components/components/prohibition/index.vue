<template>
  <div class="prohibition-top">
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
  { label: '学校时间段禁排', value: 0, name: 'schoolProhibition' },
  { label: '教师禁排', value: 1, name: 'teacherProhibition' },
  { label: '学生禁排', value: 2, name: 'studentProhibition' },
  { label: '科目禁排', value: 3, name: 'subjectProhibition' },
  { label: '教室禁排', value: 4, name: 'classroomProhibition' },
  { label: '角色禁排', value: 5, name: 'roleProhibition' },
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
  router.push(`/manager/functionPage/scheduling/scheduleCourse/prohibition/${name}`)
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
.prohibition-top {
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
