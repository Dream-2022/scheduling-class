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
        <el-table-column label="请假总时长（/天）" min-width="140">
          <template #default="{ row }">
            <div class="colorLabel">{{ row.leaveDays }}</div>
          </template>
        </el-table-column>
        <el-table-column label="涉及课程节次" min-width="100">
          <template #default="{ row }">
            <div>{{ row.leaveCourseCount }}</div>
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
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
      </el-button>
    </template>
    <el-form
      ref="application.arr"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      size="default"
      status-icon
    >
      <el-form-item label="请假事由" prop="title">
        <el-input v-model="application.arr.title" />
      </el-form-item>
      <el-form-item label="请假类型" prop="status">
        <el-select v-model="application.arr.status" placeholder="Activity zone">
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
          <el-form-item prop="date1">
            <el-date-picker
              v-model="application.arr.date1"
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
          <el-form-item prop="date2">
            <el-time-picker
              v-model="application.arr.date2"
              aria-label="选择时间"
              placeholder="选择时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="请假天数" prop="count">
        <el-select-v2
          v-model="application.arr.leaveDays"
          placeholder="选择天数"
          :options="options"
        />
      </el-form-item>
      <el-form-item label="涉及课程节次" prop="count">
        <el-select-v2
          v-model="application.arr.leaveDays"
          placeholder="选择天数"
          :options="options"
        />
      </el-form-item>
      <el-form-item label="Instant delivery" prop="delivery">
        <el-switch v-model="application.arr.delivery" />
      </el-form-item>
      <el-form-item label="Activity location" prop="location">
        <el-segmented v-model="application.arr.location" :options="locationOptions" />
      </el-form-item>
      <el-form-item label="Resources" prop="resource">
        <el-radio-group v-model="application.arr.resource">
          <el-radio value="Sponsorship">Sponsorship</el-radio>
          <el-radio value="Venue">Venue</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form" prop="desc">
        <el-input v-model="application.arr.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(application.arr)"> Create </el-button>
        <el-button @click="resetForm(application.arr)">Reset</el-button>
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
import { CirclePlusFilled, CircleCloseFilled } from '@element-plus/icons-vue'
const route = useRoute()
let applicationList = ref([]) //申请列表
let feedbackList = ref([]) //反馈列表
let applicationVisible = ref(false) //申请抽屉
let feedbackVisible = ref(false) //反馈抽屉
let navigationValue = ref(true)
const options = Array.from({ length: 20 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}))
const initApplication = {
  id: 0,
  title: '',
  time: '',
  status: '',
  imgs: [],
  leaveStartTime: '',
  leaveDays: '',
  leaveCourseCount: '',
  leaveType: '',
  leaveReason: '',
  applicant: '',
}
let application = reactive({
  arr: {},
})
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
      '@/assets/img/cat.jpeg',
      '@/assets/img/cat.jpeg',
    ],
    // 请假开始时间
    leaveStartTime: '2025-2-10',
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
    leaveStartTime: '2025-2-10',
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
    leaveStartTime: '2025-2-10',
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
  if (route.query.value == 'true') {
    navigationValue.value = true
  } else if (route.query.value == 'false') {
    navigationValue.value = false
  }
  application.arr = initApplication
})
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

    width: 95%;
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
</style>
