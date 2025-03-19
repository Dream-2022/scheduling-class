<template>
  <div class="plan-box">
    <div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="专业年级班级" name="1">
          <MajorInformation
            @titleValue="getDialogTitle"
            @dialogVisible="getDialogVisible"
            ref="childRef"
          ></MajorInformation>
        </el-tab-pane>
        <el-tab-pane label="课程信息" name="2">Config</el-tab-pane>
        <el-tab-pane label="教师学生信息" name="3">
          <TeacherInformation></TeacherInformation>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="'批量上传' + dialogTitle" width="30%">
    <el-upload
      class="upload-demo"
      drag
      multiple
      :auto-upload="false"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="1"
      @change="fileChange"
      :on-exceed="handleExceed"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text"><em>点击</em> 或 <em>拖拽</em></div>
      <div class="el-upload__text">即可上传表格文件</div>
      <template #tip>
        <div class="el-upload__tip">支持上传 xlsx / xls / xlsm / csv 文件</div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="uploadDataClick" color="#547bf1" plain>确认</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import MajorInformation from './components/majorInformation.vue'
import TeacherInformation from './components/teacherInformation.vue'
import { importClassesAPI } from '@/apis/classMajor'
import {
  UploadFilled,
  // DeleteLocation,
  // LocationInformation,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

let activeName = ref('1')
const fileX = ref(null)
let dialogTitle = ref('')
let dialogVisible = ref(false)
const childRef = ref(null) //绑定子组件
function getDialogTitle(value) {
  dialogTitle.value = value
}
function getDialogVisible(value) {
  dialogVisible.value = value
}
//上传文件相关
const handleRemove = () => {
  fileX.value = null
}
const beforeRemove = uploadFile => {
  return ElMessageBox.confirm(`是否确认删除‘${uploadFile.name}’ ?`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(
    () => true,
    () => false,
  )
}
const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `上传文件个数不能超过 1 个, 你上传了 ${files.length + uploadFiles.length} 个文件`,
  )
}
//拖拽文件时触发事件
const fileChange = file => {
  const extension = file.name.split('.').pop()
  console.log(extension)
  if (extension !== 'xlsx' && extension !== 'xls' && extension !== 'xlsm' && extension !== 'csv') {
    ElMessage.error('只能上传后缀为 xlsx、xls、xlsm、csv 的文件！')
  }
  fileX.value = file
}
//点击上传文件
async function uploadDataClick() {
  console.log(fileX.value)
  if (fileX.value == null) {
    ElMessage.error('请先选择文件！')
    return
  }
  const res = await importClassesAPI(fileX.value.raw)
  console.log(res.data)
  ElMessage.success(dialogTitle.value + '数据导入成功！')
  dialogVisible.value = false
  if (dialogTitle.value == '班级' || dialogTitle.value == '专业') {
    console.log('触发子组件', childRef.value)
    childRef.value.triggerEvent()
  }
}

//
function handleClick(tab, event) {
  console.log(tab, event, '需要判断是否保存了')
  ElMessageBox.confirm('是否保存暂定更改?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消保存',
      })
    })
}
</script>
<style lang="scss" scoped>
.el-dialog {
  .el-upload {
    .el-upload__text {
      font-size: 12px;
      line-height: 20px;
    }
  }
}

// 动画样式
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  animation-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
}
</style>
