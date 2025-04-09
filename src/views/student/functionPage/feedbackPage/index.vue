<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">反馈</div>
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
          <template #default="{ row }">
            <div>{{ row.teacherName }}（{{ row.teacherId }}）</div>
          </template>
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
  <!-- 预览图 -->
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" class="dialog-img" alt="Image" />
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getLeaveAllAPI } from '@/apis/application'
import { getFeedbackAPI } from '@/apis/feedback'
let applicationList = ref([])
let feedbackList = ref([])
const dialogImageUrl = ref('') //预览图
const dialogVisible = ref(false) //预览图是否存在
let teacher = ref(''),
  type = ref(''),
  title = ref(''),
  status = ref('')
onMounted(async () => {
  //获取全部反馈列表
  feedbackSearchClick()
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
