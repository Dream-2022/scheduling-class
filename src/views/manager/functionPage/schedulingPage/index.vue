<template>
  <div class="wow animate__fadeInUp scheduling-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">排课</div>
        <div
          v-if="
            information.arr?.title != '' &&
            router.currentRoute.value.fullPath.includes('/scheduleCourse')
          "
          class="middle-plan-title"
        >
          <div class="plan-title-word">/</div>
          {{ information.arr?.title }}
        </div>
      </div>

      <RouterView @downloadClick="downloadClick" @information="informationValue"> </RouterView>
    </div>
  </div>
  <!-- 课表信息编辑 -->
  <el-dialog
    v-model="informationVisible"
    title="课表基本信息编辑"
    width="500"
    class="information-dialog"
    :before-close="handleClose"
  >
    <div>
      <el-form
        ref="elFormRef"
        style="max-width: 600px"
        :model="information.arr"
        :rules="rules"
        label-width="auto"
        size="default"
        status-icon
      >
        <el-form-item label="课表名称" prop="title">
          <el-input
            v-model="information.arr.title"
            clearable
            style="height: 32px"
            placeholder="请输入课表名称"
          />
        </el-form-item>
        <el-form-item label="上课周期" prop="cycle">
          <el-select v-model="information.arr.cycle" placeholder="选择上课周期">
            <el-option v-for="item in cycles" :key="item" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设置晚课" prop="night">
          <el-switch v-model="information.arr.night" />
        </el-form-item>
        <div class="dialog-title">选择导入步骤（二选一）</div>
        <div class="wow animate__fadeInRight warn-box">
          <span class="iconfont icon-icon-gantanhao"></span>
          选择参照模板一键导入所需表格，或按步骤自由导入所需表格
        </div>
        <el-form-item class="plan-boxes" prop="planValue">
          <el-radio-group v-model="information.arr.planValue">
            <div class="plan-box">
              <el-radio :value="1" size="large" border style="height: 136px; width: 466px">
                <div>
                  <div class="plan-title">
                    <span class="iconfont icon-dian1"></span>方案一：一次性导入数据
                  </div>
                  <div class="plan-word">
                    如下载教学计划示例，表格内容有填写说明<br />
                    按要求导入数据，一次性完成教学计划信息配置，即可自动排课
                  </div>
                  <div class="plan-button-box">
                    <el-button
                      @click="downloadClick"
                      size="small"
                      color="#547bf1"
                      :icon="Download"
                      plain
                    >
                      下载教学计划示例
                    </el-button>
                    <el-button
                      size="small"
                      @click="importValue = true"
                      color="#547bf1"
                      :icon="Promotion"
                    >
                      导入教学计划
                    </el-button>
                  </div>
                </div>
              </el-radio>
            </div>
            <div class="plan-box">
              <el-radio :value="2" size="large" border style="height: 120px; width: 450px">
                <div class="plan-title">
                  <span class="iconfont icon-dian1"></span>方案二：按步骤添加数据
                </div>
                <div class="plan-word">
                  按步骤导入数据，按需进行编辑修改<br />
                  <span class="iconfont icon-shuzi-"></span>设置学校信息
                  <span class="iconfont icon-shuzi-2"></span>特殊设置
                  <span class="iconfont icon-shuzi-4"></span>禁排设置
                  <span class="iconfont icon-shuzi-1"></span>排课优先级<br />
                  <span class="iconfont icon-shuzi-5"></span>设置课程教室
                  <span class="iconfont icon-shuzi-7"></span>排课设置
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="saveScheduling" color="#547bf1" plain>确认</el-button>
        <el-button @click="informationVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="schoolVisible"
    title="课表基本信息编辑"
    width="550"
    :before-close="handleClose"
  >
    <div class="school-container">
      <div class="school-word">
        <div>选择已设置的学校信息</div>
        <div><el-button color="#547bf1" plain>去添加</el-button></div>
      </div>
      <el-radio-group v-model="informationRadioValue" class="custom-radio">
        <el-radio value="1" border>
          <div class="school-box">
            <div class="school-title">
              <div class="title-main">
                <div class="title"><strong>2025年度</strong> 学校基本信息</div>
                <div>2025-3-28 12:51</div>
              </div>

              <div class="school-button">
                <el-button color="#547bf1" plain>修改</el-button>
                <el-button color="#547bf1">查看</el-button>
              </div>
            </div>
          </div>
        </el-radio>
        <el-radio value="2" border>
          <div class="school-box">
            <div class="school-title">
              <div class="title-main">
                <div class="title"><strong>2024年度</strong> 学校基本信息</div>
                <div>2024-6-13 18:43</div>
              </div>
              <div class="school-button">
                <el-button color="#547bf1" plain>修改</el-button>
                <el-button color="#547bf1">查看</el-button>
              </div>
            </div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="saveInformationClick" color="#547bf1" plain>确认</el-button>
        <el-button @click="schoolVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 导入教学计划弹窗 -->
  <el-dialog
    v-model="importValue"
    title="导入教学计划"
    width="60%"
    :close-on-click-modal="false"
    :before-close="handleImportClose"
  >
    <div class="import-container">
      <div class="import-upload">
        <el-upload
          class="upload-dragger"
          drag
          action="#"
          :auto-upload="false"
          :on-change="handleFileChange"
          :limit="1"
          accept=".xlsx,.xls"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传 xlsx/xls 文件</div>
          </template>
        </el-upload>
      </div>

      <div class="import-preview" v-if="previewData.length > 0">
        <div class="preview-title">文件部分预览</div>
        <el-table :data="previewData" style="width: 100%" height="300" border>
          <el-table-column
            v-for="(col, index) in tableColumns"
            :key="index"
            :prop="col"
            :label="col"
          />
        </el-table>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleImportClose">取消</el-button>
        <el-button type="primary" @click="handleImportNext" :disabled="!selectedFile"
          >下一步</el-button
        >
      </div>
    </template>
  </el-dialog>

  <!-- 进度条对话框 -->
  <el-dialog
    v-model="progressDialogVisible"
    title="排课进度"
    width="30%"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <div class="progress-container">
      <el-progress
        :percentage="progressPercentage"
        striped
        striped-flow
        :duration="10"
        :stroke-width="15"
        :format="format"
      />
      <div class="progress-text">{{ progressText }}</div>
    </div>
  </el-dialog>
</template>
<script setup>
import { RouterView, useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Promotion, UploadFilled } from '@element-plus/icons-vue'
import { downloadAPI } from '@/apis/scheduling'
import * as XLSX from 'xlsx'
import { useSseStore } from '@/stores/sseStore'
import { getTimetableProgressAPI } from '@/apis/course.js'

const router = useRouter()
const sseStore = useSseStore()
const information = reactive({
  arr: [],
})
const importValue = ref(false) //导入教学计划示例文件的弹窗
const elFormRef = ref() //表单验证
const informationVisible = ref(false) //课表基本信息弹窗
const schoolVisible = ref(false) //选择学校基础信息弹窗
const informationRadioValue = ref('') //单选框选中的值
const cycles = [
  {
    label: '周一 至 周五',
    value: '5',
  },
  {
    label: '周一 至 周六',
    value: '6',
  },
  {
    label: '周一 至 周天',
    value: '7',
  },
]
const rules = {
  title: [
    { required: true, message: '请输入课表名称', trigger: 'blur' },
    { min: 2, max: 20, message: '课表名称长度应在 2 到 20 个字符之间', trigger: 'blur' },
  ],
  cycle: [{ required: true, message: '请选择上课周期', trigger: 'change' }],
  planValue: [{ required: true, message: '请选择导入方式', trigger: 'change' }],
}
const selectedFile = ref(null)
const previewData = ref([])
const tableColumns = ref([])
const progressDialogVisible = ref(false)
const progressPercentage = ref(0)
const progressText = ref('')

//点击课表基本信息确认按钮，跳转到课表编辑页面
function saveInformationClick() {
  if (informationRadioValue.value === '') {
    ElMessage.error('请选择学校信息')
    return false
  }
  router.push(`/manager/functionPage/scheduling/scheduleCourse`)
  ElMessage.success('成功导入学校基本信息！')
  schoolVisible.value = false
}
//子组件传值
const informationValue = value => {
  informationVisible.value = value
}
//误触弹窗空白区，提醒用户
const handleClose = done => {
  ElMessageBox.confirm('是否取消编辑?', '提醒', {
    confirmButtonText: '返回',
    cancelButtonText: '取消编辑',
    type: 'warning',
  })
    .then(() => {})
    .catch(() => {
      ElMessage.success('未保存编辑数据')
      done()
    })
}
//下载教学计划示例
async function downloadClick() {
  const res = await downloadAPI()
  console.log(res.data)
  window.open(res.data.data)
  ElMessage.success('下载成功')
}
//保存排课基本信息
function saveScheduling() {
  console.log(information.arr)
  elFormRef.value.validate(valid => {
    if (!valid) {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
    if (valid) {
      informationVisible.value = false
      schoolVisible.value = true
      //打开新的弹窗
      schoolVisible.value = true
      ElMessage.success('设置成功！')
    }
  })
} //  router.push(`/${userStore.user.identity.toLowerCase()}/functionPage/scheduling/scheduleCourse`)

// 处理文件变化
const handleFileChange = file => {
  selectedFile.value = file.raw
  previewExcelFile(file.raw)
}

// 预览Excel文件
const previewExcelFile = file => {
  const reader = new FileReader()
  reader.onload = e => {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    if (jsonData.length > 0) {
      // 获取表头
      tableColumns.value = jsonData[0]
      // 获取数据（最多显示10行）
      previewData.value = jsonData.slice(1, 11).map(row => {
        const rowData = {}
        tableColumns.value.forEach((col, index) => {
          rowData[col] = row[index] || ''
        })
        return rowData
      })
    }
  }
  reader.readAsArrayBuffer(file)
}

// 处理导入弹窗关闭
const handleImportClose = done => {
  if (typeof done === 'function') {
    ElMessageBox.confirm('是否取消导入?', '提醒', {
      confirmButtonText: '返回',
      cancelButtonText: '取消导入',
      type: 'warning',
    })
      .then(() => {})
      .catch(() => {
        ElMessage.success('已取消导入')
        done()
      })
  } else {
    importValue.value = false
  }
}

// 处理导入下一步
const handleImportNext = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  // 显示进度条对话框
  importValue.value = false
  informationVisible.value = false
  progressDialogVisible.value = true
  progressPercentage.value = 0
  progressText.value = '正在准备导入教学计划...'

  // 准备文件上传
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    // 调用进度API
    const res = await getTimetableProgressAPI()
    console.log(res.data)

    // 设置SSE监听
    const eventSource = sseStore.getEventSource()
    eventSource.onmessage = event => {
      const eventData = JSON.parse(event.data)
      console.log('收到新消息:', eventData)

      // 更新进度条
      const currentSize = eventData.data.currentSize
      progressPercentage.value = Math.floor((currentSize / 1306) * 100)
      progressText.value = `正在处理: ${currentSize}/1306`

      // 当进度达到1306时
      if (currentSize >= 1306) {
        progressDialogVisible.value = false
        // 执行路由跳转
        router.push('/manager/functionPage/scheduling/scheduleCourse/show/totalSchedule')
        ElMessage.success('教学计划导入成功，正在跳转页面...')
      }
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败，请重试')
    progressDialogVisible.value = false
  }
}

// 格式化进度条百分比
const format = percentage => {
  return percentage === 100 ? '完成' : `${percentage}%`
}
</script>
<style lang="scss" scoped>
.scheduling-box {
  width: 90%;
  min-width: 600px;
  margin: 25px auto;
  padding-bottom: 20px;
  position: relative;
  background-color: #fff;
  padding-top: 5px;
  border-radius: 10px;
  box-shadow: 0px 6px 10px 3px rgba(0, 0, 0, 0.1);

  .middle-box {
    color: $word-black-color;
    width: 95%;
    margin: 20px auto;

    .title-box {
      display: flex;
      border-bottom: 1px solid $word-back-color;
      padding-bottom: 6px;
      line-height: 30px;
      margin-bottom: 15px;

      .middle-title {
        font-weight: 600;
        font-size: 18px;
      }
      .plan-title-word {
        margin-right: 30px;
        font-size: 16px;
      }
      .middle-plan-title {
        margin-left: 20px;
        font-size: 16px;
        font-weight: 600;
        display: flex;
      }

      .list {
        cursor: pointer;
        font-size: 16px;
        display: inline-block;
        color: $grey;
        width: 60px;
      }

      .list-active {
        color: $title-color;
        text-decoration: underline;
      }
    }

    .middle-word {
      margin-top: 30px;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .search-box {
      display: flex;
      gap: 10px;

      .button-box {
        margin-right: auto;
      }
    }

    .table-imgs {
      display: flex;
      justify-content: center;

      .table-img {
        cursor: zoom-in;
        width: 80px;
        height: 80px;
        border-radius: 16px;
        border: 2px solid #d1d1d1;
      }
    }
  }
}
.preference-box {
  margin-top: 12px;
  line-height: 30px;
  display: flex;
  flex-direction: column;

  .preference {
    display: flex;
    margin-bottom: 10px;

    > div:first-child {
      min-width: 100px;
      text-align: left;
      color: $word-grey-color;
    }
    > div:nth-child(2) {
      text-align: left;
      flex: 1;
    }
    .preference-times {
      .preference-time {
        display: flex;
        border-radius: 5px;
        margin-right: 30px;
        gap: 10px;
        margin-bottom: 6px;

        &:hover {
          cursor: pointer;
          background-color: #fff;
          .el-button {
            display: block;
          }
        }
        > div {
          flex: 1;
        }
        > div:last-child {
          display: flex;
        }
        .preference-time-text {
          font-size: 14px;
          font-weight: 600;
        }
        .el-button {
          margin-left: 10px;
          display: none;
        }
        .el-icon--left {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .el-button-add {
        height: 30px;
      }
    }
  }
}
.el-dialog {
  .dialog-title {
    font-size: 17px;
    color: #000;
    border-top: #ccc 1px solid;
    padding-top: 20px;
  }

  .school-word {
    padding-right: 10px;
    display: flex;
    justify-content: space-between;
    color: $word-shallow-color;
  }
  .warn-box {
    background-color: #fff3e0;
    color: #cd871d;
    padding: 5px 15px;
    font-size: 14px;
    line-height: 24px;
    width: 92%;
    margin: 10px auto;
    border-radius: 5px;
    border: 1px solid #ffdb9e;

    .iconfont::before {
      font-size: 16px;
    }
  }

  .plan-boxes {
    .plan-box {
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 8px;
      .iconfont::before {
        font-size: 14px;
        color: $main-blue;
        margin-right: 5px;
      }

      .plan-word {
        color: $grey;
        font-size: 12px;
        line-height: 24px;
        margin-top: 8px;
        .iconfont::before {
          margin-left: 6px;
          margin-right: 2px;
          font-size: 12px;
        }
        .iconfont:nth-child(1),
        .iconfont:nth-child(6) {
          margin-left: 0px;
        }
      }
      .plan-button-box {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.information-dialog {
  .el-radio {
    padding-bottom: 10px;
  }
}
:deep(.el-radio__label) {
  width: 450px;
  padding-left: 20px;
}
:deep(.custom-radio) {
  .el-radio__label {
    line-height: 30px;
  }
  .el-radio {
    margin-top: 10px;
    height: 80px;

    .school-box {
      .school-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-main {
          .title {
            font-size: 16px;
          }
        }
      }
    }
  }
}
.import-container {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .import-upload {
    display: flex;
    justify-content: center;

    .upload-dragger {
      width: 100%;
    }
  }

  .import-preview {
    .preview-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}

.progress-container {
  padding: 20px;
  text-align: center;

  .progress-text {
    margin-top: 15px;
    color: #606266;
    font-size: 14px;
  }
}
</style>
