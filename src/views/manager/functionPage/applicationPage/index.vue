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
            >申请</span
          >
          <span
            class="list"
            :class="!navigationValue ? 'list-active' : ''"
            @click="navigationClick(false)"
            >反馈</span
          >
        </div>
      </div>
      <el-divider content-position="center"
        ><strong style="font-size: 17px; color: #4d4d4d">{{
          navigationValue ? '申请' : '反馈'
        }}</strong></el-divider
      >
      <div class="search-box">
        <el-input
          v-model="teacher"
          clearable
          style="height: 32px; max-width: 350px"
          :placeholder="'请输入' + (navigationValue ? '教师' : '') + '关键词'"
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
          @click="applicationSearchClick()"
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
        <el-table-column :label="(navigationValue ? '申请' : '反馈') + '人'" min-width="120">
          <template #default="{ row }">
            <div>{{ row.teacherName }}（{{ row.teacherId }}）</div>
          </template>
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
                  :style="{ transform: `translateX(${index * -10}px)` }"
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
                v-if="!navigationValue && row?.status == '0'"
                style="margin-bottom: 10px; color: #fff"
              >
                已查看
              </el-button>
            </div>
            <div v-if="!navigationValue && row?.status == '1'">--</div>
            <div>
              <el-button
                color="#368eec"
                size="small"
                @click="byApplicationClick(row.id, 1)"
                v-if="navigationValue && row?.status != '1'"
                style="margin-bottom: 10px; color: #fff"
              >
                批准
              </el-button>
            </div>
            <div>
              <el-button
                color="#f56c6c"
                plain
                size="small"
                style="margin-bottom: 10px"
                @click="byApplicationClick(row.id, 2)"
                v-if="navigationValue && row?.status != '2'"
              >
                拒绝
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- 预览图 -->
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Image" />
  </el-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { getLeaveAllAPI, reviewLeaveAPI } from '@/apis/application'
import { getFeedbackAllAPI } from '@/apis/feedback'
const route = useRoute()
let applicationList = ref([])
let feedbackList = ref([])
let navigationValue = ref(false)
const dialogImageUrl = ref('') //预览图
const dialogVisible = ref(false) //预览图是否存在
let teacher = ref(''),
  type = ref(''),
  title = ref(''),
  status = ref('')
const typeApplication = [
  { label: '全部', value: '' },
  { label: '公假', value: 'public' },
  { label: '事假', value: 'matter' },
  { label: '病假', value: 'illness' },
  { label: '婚假', value: 'wed' },
  { label: '产假', value: 'maternity' },
  { label: '丧假', value: 'funeral' },
  { label: '其他', value: 'other' },
]
const titleApplication = [
  { label: '全部', value: '' },
  { label: '换课申请', value: 'change' },
  { label: '代课申请', value: 'place' },
  { label: '调课申请', value: 'adjust' },
]
onMounted(async () => {
  //获取全部申请/反馈列表
  applicationSearchClick()
  feedbackSearchClick()
  if (route.query.value == 'true') {
    navigationValue.value = true
  } else if (route.query.value == 'false') {
    navigationValue.value = false
  }
  feedbackList.value.push({
    id: 122,
    teacherId: 1,
    teacherName: '你好',
    leaveReason: '外出学习（老吉大）',
    attachment: ['@/assets/img/book.png', '@/assets/img/cat.jpeg'],
    status: '1',
    createdAt: '2025-2-10 8:10:7',
  })
})
//搜索关键词
async function applicationSearchClick() {
  console.log(teacher.value, type.value, title.value, status.value)
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
  console.log(teacher.value, status.value)
  const res = await getFeedbackAllAPI(teacher.value)
  console.log(res.data)
}
//审批申请
async function byApplicationClick(id, status) {
  const res = await reviewLeaveAPI(id, status)
  if (res.data.code == '0') {
    if (status == '1') {
      ElMessage.success('已成功批准申请！')
    } else if (status == '2') {
      ElMessage.warning('已成功拒绝申请！')
    }
    applicationList.value.forEach((item, index) => {
      if (item.id === id) {
        applicationList.value[index].status = status
      }
    })
  }
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
} //预览图片
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
:deep(.el-dialog .el-dialog__body img) {
  width: 100px;
  height: 90%;
  border-radius: 10px;
}
</style>
