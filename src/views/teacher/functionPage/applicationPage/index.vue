<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">申请和反馈</div>
        <div style="margin-left: 20px; margin-right: 20px">>></div>
        <div>
          <span
            class="list"
            :class="navigationValue ? 'list-active' : ''"
            @click="navigationClick(true)"
            >我的申请</span
          >
          <span
            class="list"
            :class="!navigationValue ? 'list-active' : ''"
            @click="navigationClick(false)"
            >我的反馈</span
          >
        </div>
        <div class="middle-button">
          <el-button color="#368eec" @click="addApplicationClick()" style="margin-bottom: 10px">
            新增{{ navigationValue ? '申请' : '反馈' }}
            <el-icon class="el-icon--right"><CirclePlusFilled /></el-icon>
          </el-button>
        </div>
      </div>
      <el-divider content-position="center"
        ><strong style="font-size: 17px; color: #4d4d4d">{{
          navigationValue ? '我的申请' : '我的反馈'
        }}</strong></el-divider
      >
      <div class="middle-word"></div>
      <el-table
        :data="navigationValue ? applicationList : feedbackList"
        style="width: 100%"
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="序号" :min-width="60" fixed>
          <template v-slot="{ $index }">
            <span>{{ $index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="证明材料" min-width="160">
          <template #default="{ row }">
            <div class="table-imgs" v-if="row?.imgs.length != 0">
              <div v-for="(img, index) in row?.imgs" :key="img">
                <img
                  :src="img"
                  class="table-img"
                  :style="{ transform: `translateX(${index * -10}px)` }"
                />
              </div>
            </div>
            <div v-else>暂无</div>
          </template>
        </el-table-column>
        <el-table-column label="事由详情" min-width="160">
          <template #default="{ row }">
            <div>
              <strong>{{ row.title }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="请假类型" min-width="150">
          <template #default="{ row }">
            <div v-html="row.leaveType"></div>
          </template>
        </el-table-column>
        <el-table-column label="调整举措" min-width="100">
          <template #default="{ row }">
            <div v-html="row.leaveReason"></div>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="140">
          <template #default="{ row }">
            <div class="label-box">
              <div
                :class="
                  row.status == '未处理'
                    ? 'first-label'
                    : row.status == '已拒绝'
                      ? 'second-label'
                      : 'third-label'
                "
              >
                {{ row?.status }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申请人姓名" min-width="180">
          <template #default="{ row }">
            <div>{{ row.applicant }}</div>
          </template>
        </el-table-column>
        <el-table-column label="请假起始日期" min-width="180">
          <template #default="{ row }">
            <div>{{ row.leaveStartTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="请假结束日期" min-width="180">
          <template #default="{ row }">
            <div>{{ row.leaveEndTime }}</div>
          </template>
        </el-table-column>
        <el-table-column label="申请日期" min-width="140">
          <template #default="{ row }">
            <div style="display: flex; justify-content: center">
              <div>{{ row.time }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="{ row }">
            <div>
              <el-button
                color="#368eec"
                plain
                @click="staticClick(row.fileMd5)"
                style="margin-bottom: 10px"
                >修改</el-button
              >
            </div>
            <div>
              <el-button color="#f56c6c" plain @click="safeClick(row.fileMd5)">撤回</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-drawer v-model="applicationVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">申请</h4>
      <el-button color="#f56c6c" plain :icon="CloseBold" circle @click="close" />
    </template>
    <el-form
      ref="elFormRef"
      style="max-width: 600px"
      :model="application.arr"
      :rules="rules"
      label-width="auto"
      size="default"
      status-icon
    >
      <el-form-item label="请假事由" prop="title">
        <el-input placeholder="请输入请假事由" v-model="application.arr.title" type="textarea" />
      </el-form-item>
      <el-form-item label="请假类型" prop="leaveType">
        <el-select v-model="application.arr.leaveType" placeholder="请选择请假类型">
          <el-option label="公假" value="public" />
          <el-option label="事假" value="matter" />
          <el-option label="病假" value="illness" />
          <el-option label="婚假" value="wed" />
          <el-option label="产假" value="maternity" />
          <el-option label="丧假" value="funeral" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="请假起始时间" required>
        <el-col :span="11">
          <el-form-item prop="startDate">
            <el-date-picker
              v-model="application.arr.startDate"
              type="date"
              aria-label="选择日期"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-time-picker
              v-model="application.arr.startTime"
              aria-label="选择时间"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="请假结束时间" required>
        <el-col :span="11">
          <el-form-item prop="endDate">
            <el-date-picker
              v-model="application.arr.endDate"
              type="date"
              aria-label="选择日期"
              placeholder="选择日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col class="text-center" :span="2">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-picker
              v-model="application.arr.endTime"
              aria-label="选择时间"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="调整举措" prop="leaveReason">
        <el-segmented v-model="application.arr.leaveReason" :options="leaveReasonOptions" />
      </el-form-item>
      <el-form-item label="申请人签字" prop="signature">
        <HandwrittenSignature v-model="application.arr.signature" />
      </el-form-item>
      <el-form-item label="证明材料" prop="imgs">
        <el-upload
          :on-change="handleFileChange"
          action="#"
          v-model:file-list="application.arr.imgs"
          list-type="picture-card"
          :auto-upload="false"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <el-icon><Download /></el-icon>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <!-- 预览图 -->
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <div class="button-box">
          <el-button type="primary" @click="submitForm(application.arr)"> 申请 </el-button>
          <el-button @click="resetForm(application.arr)">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="feedbackVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">This is a custom header!</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
        Close
      </el-button>
    </template>
    This is drawer content.
  </el-drawer>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import HandwrittenSignature from '@/components/signature.vue'
import {
  Delete,
  Download,
  Plus,
  ZoomIn,
  CirclePlusFilled,
  CloseBold,
  CircleCloseFilled,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { addApplicationAPI } from '@/apis/application'
const route = useRoute()
let applicationList = ref([]) //申请列表
let feedbackList = ref([]) //反馈列表
let applicationVisible = ref(false) //申请抽屉
let feedbackVisible = ref(false) //反馈抽屉
let navigationValue = ref(true)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
let application = reactive({
  arr: {},
})
let elFormRef = ref()
//表单规则
const rules = {
  title: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
  leaveType: [{ required: true, message: '请选择请假类型', trigger: 'blur' }],
  leaveStartDate: [{ required: true, message: '请选择请假起始日期', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
  leaveReason: [{ required: true, message: '请选择调整举措', trigger: 'blur' }],
  signature: [{ required: true, message: '请进行申请人签字', trigger: 'blur' }],
}
const leaveReasonOptions = [
  {
    label: '调课',
    value: 'adjust',
  },
  {
    label: '换课',
    value: 'change',
  },
]
const initApplication = {
  title: '',
  status: '',
  imgs: [],
  leaveStartTime: '',
  startDate: '',
  startTime: '',
  leaveEndDate: '',
  endDate: '',
  endTime: '',
  leaveType: '',
  signature: '',
  leaveReason: '',
}
onMounted(async () => {
  applicationList.value.push({
    id: 124,
    title: '需要实习两天',
    // 申请时间
    time: '2025-2-8 15:30',
    status: '未处理',
    imgs: [
      'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/samantha/logo-icon-white-bg.png',
      'https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/samantha/logo-icon-white-bg.png',
    ],
    leaveStartTime: '2025-2-11 21:42:7',
    // 请假开始时间
    leaveEndTime: '2025-2-13 21:41:7',
    signature: '',
    // 请假天数
    leaveDays: '2',
    // 请假课程数量
    leaveCourseCount: '5',
    // 请假类型
    leaveType: '公假',
    // 申请事项
    leaveReason: '调课申请',
    // 申请人信息
    applicant: '赵六(N21452153)',
  })
  applicationList.value.push({
    id: 122,
    title: '外出学习（老吉大）',
    imgs: ['@/assets/img/book.png', '@/assets/img/cat.jpeg'],
    // 申请时间
    time: '2025-2-8 12:30',
    status: '已拒绝',
    // 请假开始时间
    leaveStartTime: '2025-2-10 21:41:7',
    signature: '',
    leaveEndTime: '2025-2-10 21:41:7',
    // 请假天数
    leaveDays: '1',
    // 请假课程数量
    leaveCourseCount: '2',
    // 请假类型
    leaveType: '事假',
    // 申请事项
    leaveReason: '代课申请',
    // 申请人信息
    applicant: '王五(N219856153)',
  })
  applicationList.value.push({
    id: 122,
    title: '外出学习（老吉大）',
    imgs: ['@/assets/img/book.png', '@/assets/img/cat.jpeg'],
    // 申请时间
    time: '2025-2-8 12:30',
    status: '已通过',
    // 请假开始时间
    leaveStartTime: '2025-2-10 8:10:7',
    leaveEndTime: '2025-2-10 21:41:7',
    // 请假天数
    leaveDays: '1',
    signature: '',
    // 请假课程数量
    leaveCourseCount: '2',
    // 请假类型
    leaveType: '事假',
    // 申请事项
    leaveReason: '代课申请',
    // 申请人信息
    applicant: '王五(N219856153)',
  })
  if (route.query.value == 'true') {
    navigationValue.value = true
  } else if (route.query.value == 'false') {
    navigationValue.value = false
  }
  application.arr = { ...initApplication }
})
// 提交表单方法
const submitForm = async () => {
  elFormRef.value.validate(async valid => {
    if (valid) {
      console.log('表单验证通过，提交数据:', application.arr)
      console.log(application.arr.startDate, application, application.arr.startTime)
      application.arr.leaveStartTime = mergeDateAndTime(
        application.arr.startDate,
        application.arr.startTime,
      )
      application.arr.leaveEndTime = mergeDateAndTime(
        application.arr.endDate,
        application.arr.endTime,
      )
      console.log(application.arr.leaveStartTime)
      // application.arr.leaveStartTime=
      await addApplicationAPI(application.arr)
    } else {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
  })
}
function mergeDateAndTime(dateObj, timeObj) {
  if (!dateObj || !timeObj) return null

  const mergedDate = new Date(dateObj) // 复制日期对象
  mergedDate.setHours(timeObj.getHours(), timeObj.getMinutes(), timeObj.getSeconds()) // 设置小时、分钟、秒

  return mergedDate
}
// 重置表单方法
const resetForm = () => {
  application.arr = { ...initApplication }
  elFormRef.value.resetFields()
  applicationVisible.value = false
}
//删除图片
const handleRemove = file => {
  console.log(file.url, JSON.stringify(application.arr.imgs[0]))
  application.arr.imgs = application.arr.imgs.filter(item => item.url != file.url)
  ElMessage.success(`删除成功！`)
  console.log(application.arr.imgs)
}
//预览图片
const handlePictureCardPreview = file => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
//下载图片
const handleDownload = file => {
  if (file.url) {
    console.log(1)
    const a = document.createElement('a')
    a.href = file.url
    a.download = file.name || 'download'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else if (file.content) {
    const blob = new Blob([file.content], { type: file.raw.type || 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name || 'download.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url) // 释放内存
  }
}
//图片列表变化
const handleFileChange = file => {
  application.arr.imgs.push(file)
  console.log(application.arr.imgs)
}
//点击新增申请
function addApplicationClick() {
  if (navigationValue.value) applicationVisible.value = true
  else feedbackVisible.value = true
}
function navigationClick(value) {
  navigationValue.value = value
}
</script>
<style lang="scss" scoped>
.white-box {
  width: 90%;
  min-width: 600px;
  margin: 25px auto;
  padding-bottom: 50px;
  position: relative;
  background-color: #fff;
  padding-top: 5px;
  border-radius: 10px;
  box-shadow: 0px 6px 10px 3px rgba(0, 0, 0, 0.1);

  .middle-box {
    color: $word-black-color;

    .title-box {
      display: flex;
      line-height: 30px;
      margin-bottom: 30px;

      .middle-title {
        font-weight: 600;
        font-size: 18px;
      }

      .middle-button {
        margin-left: auto;
        margin-right: 20px;
      }

      .list {
        cursor: pointer;
        font-size: 16px;
        display: inline-block;
        color: $grey;
        width: 85px;
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

    width: 98%;
    margin: 20px auto;
    .table-imgs {
      display: flex;

      .table-img {
        max-width: 80px;
        border-radius: 50%;
        border: 2px solid #d1d1d1;
      }
    }
  }

  .el-table {
    .label-box {
      width: 100%;
      display: flex;
      justify-content: center;
      .first-label,
      .second-label,
      .third-label {
        text-align: center;
        border-radius: 5px;
        width: 60px;
        color: $word-black-color;
        background-color: $word-back-color;
      }
      .second-label {
        color: $red-word;
        background-color: $red-back;
      }
      .third-label {
        color: $green-word;
        background-color: $green-back;
      }
    }

    .colorLabel {
      font-weight: 600;
      font-size: 16px;
    }

    .purpleLabel {
      background-color: $purple;
    }

    .yellowLabel {
      background-color: $yellow;
    }

    .greenLabel {
      background-color: $green;
    }

    .blackLabel {
      background-color: $word-black-color;
    }

    .greyLabel {
      background-color: $grey;
    }

    .redLabel {
      background-color: $red;
    }

    .purple {
      color: $purple;
    }

    .green {
      color: $green;
    }

    .black {
      color: $word-black-color;
    }

    .grey {
      color: $grey;
    }

    .yellow {
      color: $yellow;
    }

    .red {
      color: $red;
    }
  }
}

.el-form {
  width: 95%;
  padding: 0 10px;

  .text-center {
    text-align: center;
  }

  .button-box {
    margin-top: 30px;
    margin-left: 100px;
    .el-button {
      margin-right: 20px;
      padding-left: 40px;
      padding-right: 40px;
      border-radius: 10px;
    }
  }
}
:deep(.el-upload-list__item) {
  width: 130px;
  height: 130px;
}
:deep(.el-upload--picture-card) {
  width: 130px;
  height: 130px;
}
:deep(.el-dialog__body img) {
  width: 98%;
  height: 98%;
  border-radius: 10px;
}
</style>
