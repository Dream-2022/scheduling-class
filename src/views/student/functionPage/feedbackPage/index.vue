<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">反馈</div>
        <div class="middle-button">
          <el-button color="#368eec" @click="addApplicationClick()" style="margin-bottom: 10px">
            新增反馈
            <el-icon class="el-icon--right"><CirclePlusFilled /></el-icon>
          </el-button>
        </div>
      </div>
      <el-divider content-position="center"
        ><strong style="font-size: 17px; color: #4d4d4d">反馈</strong></el-divider
      >
      <div class="search-box">
        <el-input
          v-model="teacher"
          clearable
          style="height: 32px; max-width: 350px"
          placeholder="请输入关键词"
          :prefix-icon="Search"
        />

        <el-select v-model="status" clearable placeholder="选择申请状态" style="max-width: 350px">
          <el-option label="全部" value="" />
          <el-option label="未读" value="0" />
          <el-option label="已读" value="1" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="applicationSearchClick()"
        >
          搜索
        </el-button>
      </div>
      <div class="middle-word"></div>
      <el-table
        :data="feedbackList"
        style="width: 100%"
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column label="反馈人" min-width="120">
          <div>{{ userStore.user.name }}（{{ userStore.user.userId }}）</div>
        </el-table-column>
        <el-table-column label="反馈详情" min-width="160">
          <template #default="{ row }">
            <div>
              <strong>{{ row.leaveReason }}</strong>
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
                  :style="{ transform: `translateX(${index * -10}px)` }"
                />
              </div>
            </div>
            <div v-if="!row?.attachment || row?.attachment.length == 0">暂无</div>
          </template>
        </el-table-column>

        <el-table-column label="状态" min-width="100">
          <template #default="{ row }">
            <div class="label-box">
              <div :class="row.status == '1' ? 'third-label' : 'second-label'">
                {{ row?.status == '1' ? '已读' : '未读' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="反馈日期" min-width="160">
          <template #default="{ row }">
            <div style="display: flex; justify-content: center">
              <div class="first-label">{{ row.createdAt }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
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
    <img w-full :src="dialogImageUrl" class="dialog-img" alt="Image" />
  </el-dialog>
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Search, CirclePlusFilled, CloseBold, Plus, Download } from '@element-plus/icons-vue'
import { getLeaveAllAPI } from '@/apis/application'
import { useUserStore } from '@/stores/userStore'
import { getFeedbackAPI, addFeedbackAPI } from '@/apis/feedback'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
let elFormFeedRef = ref() //获取表单
let applicationList = ref([])
let feedbackList = ref([])
let feedbackVisible = ref(false) //反馈抽屉
const dialogImageUrl = ref('') //预览图
const dialogVisible = ref(false) //预览图是否存在
const feedbackDownloadImgs = ref([])
let teacher = ref(''),
  type = ref(''),
  title = ref(''),
  status = ref('')
const initFeedback = {
  status: '',
  imgs: [],
  leaveReason: '',
}
let feedback = reactive({
  arr: {},
})
onMounted(async () => {
  //获取全部反馈列表
  feedbackSearchClick()
  feedback.arr = { ...initFeedback }
})
//搜索关键词
async function applicationSearchClick() {
  const res = await getLeaveAllAPI(teacher.value, type.value, title.value, status.value)
  console.log(res.data)
  if (res.data.code == '0') {
    applicationList.value = res.data.data
    applicationList.value.forEach((item, index) => {
      applicationList.value[index].createdAt = item.createdAt.replace('T', ' ')
      applicationList.value[index].leaveStart = item.leaveStart.replace('T', ' ')
      applicationList.value[index].leaveEnd = item.leaveEnd.replace('T', ' ')
    })
  }
}
//点击新增申请
function addApplicationClick() {
  feedbackVisible.value = true
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
//重置表单
const resetFeedbackForm = () => {
  feedback.arr = { ...initFeedback }
  elFormFeedRef.value.resetFields()
  feedbackVisible.value = false
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
    feedbackDownloadImgs.value.push(file.url)
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
    feedbackDownloadImgs.value.push(file.content)
  }
}
async function feedbackSearchClick() {
  const res = await getFeedbackAPI(teacher.value, status.value)
  console.log(res.data)
  feedbackList.value = res.data.data
  feedbackList.value.forEach((item, index) => {
    feedbackList.value[index].createdAt = item.createdAt.replace('T', ' ')
  })
}
//预览图片
const handlePictureCardPreview = url => {
  dialogImageUrl.value = url
  dialogVisible.value = true
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
        margin-right: auto;
        font-size: 18px;
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
.dialog-img {
  width: 98%;
  border-radius: 10px;
}
</style>
