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
      <div class="search-box">
        <el-input
          v-model="teacher"
          clearable
          style="height: 32px; max-width: 350px"
          :placeholder="'请输入' + (navigationValue ? '' : '标题') + '关键词'"
          :prefix-icon="Search"
        />
        <el-select v-model="type" v-if="navigationValue" clearable placeholder="选择请假类型">
          <el-option
            v-for="item in typeApplication"
            :key="item"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="title" v-if="navigationValue" clearable placeholder="选择调整举措">
          <el-option
            v-for="item in titleApplication"
            :key="item"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="status" clearable placeholder="选择申请状态" style="max-width: 350px">
          <el-option label="全部" value="" />
          <el-option :label="navigationValue ? '未审核' : '未读'" value="0" />
          <el-option :label="navigationValue ? '已批准' : '已读'" value="1" />
          <el-option v-if="navigationValue" label="已拒绝" value="2" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="searchClick()"
        >
          搜索
        </el-button>
      </div>
      <div class="middle-word"></div>
      <el-table
        :data="navigationValue ? applicationList : feedbackList"
        style="width: 100%"
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column v-if="!navigationValue" label="反馈标题" min-width="120">
          <template #default="{ row }">
            <div>{{ row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="(navigationValue ? '申请' : '反馈') + '人'" min-width="120">
          <div>{{ userStore.user.name }}（{{ userStore.user.userId }}）</div>
        </el-table-column>
        <el-table-column :label="navigationValue ? '事由详情' : '反馈详情'" min-width="160">
          <template #default="{ row }">
            <div>
              <strong>{{ row.leaveReason }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="navigationValue" label="请假类型" min-width="90">
          <template #default="{ row }">
            <div :class="row.leaveType + '-label'">
              {{ getLabelByValue(row.leaveType) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="证明材料" min-width="180">
          <template #default="{ row }">
            <div class="table-imgs">
              <div v-for="(img, index) in row?.attachment" :key="img">
                <img
                  :src="img"
                  @click="handlePictureCardPreview(img)"
                  class="table-img"
                  :style="{ transform: `translateX(${index * -40}px)` }"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="navigationValue" label="调整举措" min-width="120">
          <template #default="{ row }">
            <div :class="row.title + '-label'">
              {{ getLabelByValue(row.title) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="navigationValue" label="签名" min-width="180">
          <template #default="{ row }">
            <img class="signature-img" :src="row.signature" alt="签名" />
          </template>
        </el-table-column>

        <el-table-column v-if="navigationValue" label="请假时间" min-width="160">
          <template #default="{ row }">
            <div>{{ row.leaveStart }}</div>
            <div>—</div>
            <div>{{ row.leaveEnd }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="navigationValue" label="状态" min-width="100">
          <template #default="{ row }">
            <div class="label-box">
              <div
                :class="
                  row.status == '0'
                    ? 'first-label'
                    : row.status == '1'
                      ? 'third-label'
                      : 'second-label'
                "
              >
                {{ row?.status == '0' ? '未处理' : row?.status == '1' ? '已批准' : '已拒绝' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="!navigationValue" label="状态" min-width="100">
          <template #default="{ row }">
            <div class="label-box">
              <div :class="row.status == '1' ? 'third-label' : 'second-label'">
                {{ row?.status == '1' ? '已读' : '未读' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="(navigationValue ? '申请' : '反馈') + '日期'" min-width="160">
          <template #default="{ row }">
            <div style="display: flex; justify-content: center">
              <div class="first-label">{{ row.createdAt }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="{ row }">
            <div>
              <el-button
                color="#368eec"
                size="small"
                @click="byApplicationClick(row.id, 1)"
                style="margin-bottom: 10px; color: #fff"
              >
                修改
              </el-button>
            </div>
            <div>
              <el-button
                color="#f56c6c"
                plain
                size="small"
                style="margin-bottom: 10px"
                @click="byApplicationClick(row.id, 2)"
              >
                撤回
              </el-button>
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
      ref="elFormAppRef"
      style="max-width: 600px"
      :model="application.arr"
      :rules="rulesApp"
      label-width="auto"
      size="default"
      status-icon
    >
      <el-form-item label="请假事由" prop="leaveReason">
        <el-input
          placeholder="请输入请假事由"
          v-model="application.arr.leaveReason"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="请假类型" prop="leaveType">
        <el-select v-model="application.arr.leaveType" placeholder="请选择请假类型">
          <el-option
            v-for="item in typeApplication"
            :key="item"
            :label="item.label"
            :value="item.value"
          />
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
      <el-form-item label="调整举措" prop="title">
        <el-segmented
          v-model="application.arr.title"
          :options="titleApplication.filter(item => item.label != '全部')"
        />
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
      </el-form-item>
      <el-form-item>
        <div class="button-box">
          <el-button type="primary" @click="submitApplicationForm()"> 申请 </el-button>
          <el-button @click="resetApplicationForm()">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="feedbackVisible" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">反馈</h4>
      <el-button color="#f56c6c" plain :icon="CloseBold" circle @click="close" />
    </template>
    <el-form
      ref="elFormFeedRef"
      style="max-width: 600px"
      :model="feedback.arr"
      :rules="rulesFeed"
      label-width="auto"
      size="default"
      status-icon
    >
      <el-form-item label="反馈标题" prop="title">
        <el-input placeholder="请输入反馈标题" v-model="feedback.arr.title" />
      </el-form-item>
      <el-form-item label="反馈详情" prop="leaveReason">
        <el-input
          placeholder="请输入反馈详情"
          :autosize="{ minRows: 2, maxRows: 6 }"
          v-model="feedback.arr.leaveReason"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="相关材料" prop="imgs">
        <el-upload
          :on-change="handleFileChange"
          action="#"
          v-model:file-list="feedback.arr.imgs"
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
      </el-form-item>
      <el-form-item>
        <div class="button-box">
          <el-button type="primary" @click="submitFeedbackForm()"> 反馈 </el-button>
          <el-button @click="resetFeedbackForm()">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!-- 预览图 -->
  <el-dialog v-model="dialogVisible">
    <img w-full class="dialog-img" :src="dialogImageUrl" alt="Image" />
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import HandwrittenSignature from '@/components/signature.vue'
import { useUserStore } from '@/stores/userStore'
import {
  Delete,
  Download,
  Plus,
  ZoomIn,
  CirclePlusFilled,
  CloseBold,
  Search,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { addApplicationAPI, getLeaveAPI } from '@/apis/application'
import { addFeedbackAPI, getFeedbackAPI } from '@/apis/feedback'
const route = useRoute()
const userStore = useUserStore()
let applicationList = ref([]) //申请列表
let feedbackList = ref([]) //反馈列表
let applicationVisible = ref(false) //申请抽屉
let feedbackVisible = ref(false) //反馈抽屉
let navigationValue = ref(true)
const dialogImageUrl = ref('') //预览图
const dialogVisible = ref(false)
const disabled = ref(false)
const applicationDownloadImgs = ref([]),
  feedbackDownloadImgs = ref([])
let application = reactive({
  arr: {},
})
let feedback = reactive({
  arr: {},
})
let elFormAppRef = ref() //获取表单
let elFormFeedRef = ref() //获取表单
let teacher = ref(''),
  type = ref(''),
  title = ref(''),
  status = ref('')
//表单规则
const rulesApp = {
  title: [{ required: true, message: '请选择调整措施', trigger: 'blur' }],
  leaveType: [{ required: true, message: '请选择请假类型', trigger: 'blur' }],
  leaveStartDate: [{ required: true, message: '请选择请假起始日期', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'blur' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
  leaveReason: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
  signature: [{ required: true, message: '请进行申请人签字', trigger: 'blur' }],
}
const rulesFeed = {
  title: [{ required: true, message: '请输入反馈标题', trigger: 'blur' }],
  leaveReason: [{ required: true, message: '请输入反馈详细', trigger: 'blur' }],
}
const titleApplication = [
  { label: '全部', value: '' },
  { label: '换课申请', value: 'change' },
  { label: '代课申请', value: 'place' },
  { label: '调课申请', value: 'adjust' },
]
const typeApplication = [
  { label: '公假', value: 'public' },
  { label: '事假', value: 'matter' },
  { label: '病假', value: 'illness' },
  { label: '婚假', value: 'wed' },
  { label: '产假', value: 'maternity' },
  { label: '丧假', value: 'funeral' },
  { label: '其他', value: 'other' },
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
const initFeedback = {
  status: '',
  imgs: [],
  leaveReason: '',
}
onMounted(async () => {
  //获取我的申请/反馈列表
  applicationSearchClick()
  feedbackSearchClick()

  if (route.query.value == 'true') {
    navigationValue.value = true
  } else if (route.query.value == 'false') {
    navigationValue.value = false
  }
  application.arr = { ...initApplication }
  feedback.arr = { ...initFeedback }
})
// 提交申请表单
const submitApplicationForm = async () => {
  elFormAppRef.value.validate(async valid => {
    if (valid) {
      applicationVisible.value = false
      application.arr.leaveStartTime = mergeDateTime(
        application.arr.startDate,
        application.arr.startTime,
      )
      application.arr.leaveEndTime = mergeDateTime(application.arr.endDate, application.arr.endTime)
      application.arr.imgs = application.arr.imgs.map(item => ({
        name: item.name,
        blob: item.raw.slice(0, item.raw.size, item.raw.type),
      }))
      console.log(application.arr)
      console.log([...application.arr.imgs])
      console.log(applicationDownloadImgs.value)

      application.arr.blob = new File([base64ToBlob(application.arr.signature)], `signature.png`, {
        type: 'image/jpeg',
      })
      application.arr.attachment = []
      application.arr.imgs.forEach(image => {
        const newFile = new File([image.blob], image.name, { type: 'image/jpeg' })
        application.arr.attachment.push(newFile)
      })
      console.log(application.arr)
      await addApplicationAPI(application.arr)
      applicationSearchClick()
      ElMessage.success('提交成功！')
    } else {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
  })
}
const submitFeedbackForm = async () => {
  elFormFeedRef.value.validate(async valid => {
    if (valid) {
      feedbackVisible.value = false
      feedback.arr.imgs = feedback.arr.imgs.map(item => ({
        name: item.name,
        blob: item.raw.slice(0, item.raw.size, item.raw.type),
      }))
      console.log(feedback.arr)
      console.log([...feedback.arr.imgs])
      console.log(feedbackDownloadImgs.value)

      feedback.arr.attachment = []
      feedback.arr.imgs.forEach(image => {
        const newFile = new File([image.blob], image.name, { type: 'image/jpeg' })
        feedback.arr.attachment.push(newFile)
      })
      console.log(feedback.arr)
      await addFeedbackAPI(feedback.arr)
      ElMessage.success('提交成功！')
      feedbackSearchClick()
    } else {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
  })
}
async function applicationSearchClick() {
  const res = await getLeaveAPI(status.value, type.value, title.value, status.value)
  if (res.data.code == '0') {
    applicationList.value = res.data.data
    applicationList.value.forEach((item, index) => {
      applicationList.value[index].createdAt = item.createdAt.replace('T', ' ')
      applicationList.value[index].leaveStart = item.leaveStart.replace('T', ' ')
      applicationList.value[index].leaveEnd = item.leaveEnd.replace('T', ' ')
    })
  }
}
async function feedbackSearchClick() {
  const res = await getFeedbackAPI(teacher.value, status.value)
  console.log(res.data)
  if (res.data.code == '0') {
    feedbackList.value = res.data.data
    feedbackList.value.forEach((item, index) => {
      feedbackList.value[index].createdAt = item.createdAt.replace('T', ' ')
    })
  }
}
function searchClick() {
  if (navigationValue.value) {
    applicationSearchClick()
  } else {
    console.log('feedback')
    feedbackSearchClick()
  }
}
function base64ToBlob(base64) {
  const parts = base64.split(';base64,')
  const mimeType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const array = new Uint8Array(new ArrayBuffer(rawLength))
  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i)
  }
  return new Blob([array], { type: mimeType })
}
//转换日期和时间
function mergeDateTime(dateStr, timeStr) {
  const date = new Date(dateStr)
  const time = new Date(timeStr)
  // 提取日期部分
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  // 提取时间部分
  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
// 重置表单方法
const resetApplicationForm = () => {
  application.arr = { ...initApplication }
  elFormAppRef.value.resetFields()
  applicationVisible.value = false
}
const resetFeedbackForm = () => {
  feedback.arr = { ...initFeedback }
  elFormFeedRef.value.resetFields()
  applicationVisible.value = false
}
//删除图片
const handleRemove = file => {
  if (navigationValue.value) {
    console.log(file.url, JSON.stringify(application.arr.imgs[0]))
    application.arr.imgs = application.arr.imgs.filter(item => item.url != file.url)
    console.log(application.arr.imgs)
  } else {
    console.log(file.url, JSON.stringify(feedback.arr.imgs[0]))
    feedback.arr.imgs = feedback.arr.imgs.filter(item => item.url != file.url)
    console.log(feedback.arr.imgs)
  }
  ElMessage.success(`删除成功！`)
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
    console.log(file.url)
    if (navigationValue.value) {
      applicationDownloadImgs.value.push(file.url)
    } else {
      feedbackDownloadImgs.value.push(file.url)
    }
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
    console.log(file.content)
    if (navigationValue.value) {
      applicationDownloadImgs.value.push(file.content)
    } else {
      feedbackDownloadImgs.value.push(file.content)
    }
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
//获取申请类型
function getLabelByValue(value) {
  for (let i = 0; i < typeApplication.length; i++) {
    if (typeApplication[i].value === value) {
      return typeApplication[i].label
    }
  }
  for (let i = 0; i < titleApplication.length; i++) {
    if (titleApplication[i].value === value) {
      return titleApplication[i].label
    }
  }
  return null
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
    width: 95%;
    margin: 20px auto;

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
    .search-box {
      display: flex;
      gap: 10px;
    }
    .table-imgs {
      display: flex;
      justify-content: center;

      .table-img {
        cursor: zoom-in;
        max-width: 80px;
        border-radius: 16px;
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
        color: $main-yellow;
        background-color: $yellow-shallow;
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

    .matter-label {
      color: $main-blue;
    }
    .public-label {
      color: $main-purple;
    }
    .illness-label {
      color: $main-yellow;
    }
    .wed-label {
      color: $pink;
    }
    .maternity-label {
      color: $green;
    }
    .funeral-label {
      color: $deep-color;
    }
    .other-label {
      color: $word-grey-color;
    }
    .signature-img {
      width: 100%;
    }

    .change-label,
    .adjust-label,
    .place-label {
      font-size: 13px;
      border-radius: 5px;
      margin-left: 6%;
      margin-right: 6px;
      background-color: $green-back;
      color: $main-green;
      border: 1px solid $main-green;
    }
    .change-label {
      background-color: $purple-back;
      color: $purple;
      border: 1px solid $purple;
    }
    .place-label {
      background-color: $blue-back;
      color: $main-blue;
      border: 1px solid $main-blue;
    }
  }
}

.el-form {
  width: 100%;
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
.dialog-img {
  width: 98%;
  border-radius: 10px;
}
</style>
