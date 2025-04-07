<template>
  <div class="show-container">
    <div class="show-box">
      <h2 class="title">总课表展示</h2>
      <div>
        <span class="class-right-title" @click="helpClick('1902649449470054400')">
          未排原因
          <span class="iconfont icon-bangzhu"></span>
        </span>
        <el-button color="#547bf1" @click="finishClick" plain :icon="Finished">完成设置</el-button>
      </div>
    </div>
    <div class="content">
      <RouterView />
    </div>
  </div>

  <!-- 未排课程原因弹窗 -->
  <el-dialog v-model="helpDialogVisible" title="未排课程原因" width="70%">
    <el-table :data="helpData" style="width: 100%" stripe>
      <el-table-column prop="courseName" label="课程名称" width="180" />
      <el-table-column prop="teacherName" label="教师" width="120" />
      <el-table-column prop="department" label="院系" width="180" />
      <el-table-column prop="classComposition" label="班级" width="200" />
      <el-table-column prop="conflictReason" label="冲突原因" width="150" />
      <el-table-column prop="designatedRoomType" label="指定教室类型" width="150" />
      <el-table-column prop="weeklyHours" label="周学时" width="120" />
      <el-table-column prop="scheduledHours" label="已排课时" width="120" />
      <el-table-column prop="schedulingPriority" label="优先级" width="100" />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { Finished } from '@element-plus/icons-vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { getTimetableHelpAPI } from '@/apis/course.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const helpDialogVisible = ref(false)
const helpData = ref([])

function finishClick() {
  router.push(`/manager/functionPage/course/1902649449470054400/class?name=第二次排课`)
}

// 获取未排课程原因
const helpClick = async id => {
  try {
    const res = await getTimetableHelpAPI(id)
    if (res.data.data) {
      helpData.value = res.data.data.slice(20, 40)
      helpDialogVisible.value = true
    } else {
      ElMessage.info('暂无未排课程数据')
    }
  } catch (error) {
    console.error('获取未排课程原因失败:', error)
    ElMessage.error('获取未排课程原因失败')
  }
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

    .class-right-title {
      margin-right: 20px;
      cursor: pointer;
      color: #6c6c6c;
    }
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
