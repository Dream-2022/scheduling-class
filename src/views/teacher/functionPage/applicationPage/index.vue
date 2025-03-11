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
            <div class="table-imgs" v-for="(img, index) in row?.imgs" :key="img">
              <img
                :src="img"
                class="table-img"
                :style="{ transform: `translateX(${index * -10}px)` }"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="事由详情" min-width="160">
          <template #default="{ row }">
            <div>
              <strong>{{ row.apkName }}</strong>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="请假类型" min-width="150">
          <template #default="{ row }">
            <div v-html="row.leaveType"></div>
          </template>
        </el-table-column>
        <el-table-column label="调整举措" min-width="290">
          <template #default="{ row }">
            <div v-html="row.leaveReason"></div>
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
            <div class="colorLabel" :class="getClass(row.secureScore)">{{ row.leaveDays }}</div>
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
              <div class="first-label">{{ row.time }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="140">
          <template #default="{ row }">
            <div>
              <el-button
                color="#368eec"
                size="small"
                @click="staticClick(row.fileMd5)"
                style="margin-bottom: 10px; color: #fff"
                >通过</el-button
              >
            </div>
            <div>
              <el-button
                color="#f56c6c"
                plain
                size="small"
                style="margin-bottom: 10px"
                @click="safeClick(row.fileMd5)"
                >拒绝</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
let applicationList = ref([])
let feedbackList = ref([])
let navigationValue = ref(true)
onMounted(async () => {
  applicationList.value.push({
    id: 124,
    title: '需要实习两天',
    // 申请时间
    time: '2025-2-8 15:30',
    imgs: [
      '@/assets/img/logo.png',
      '@/assets/img/cat.jpeg',
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
})
function navigationClick(value) {
  navigationValue.value = value
}
//获取标签颜色
function getClass(name) {
  if (name == '未知') {
    return 'greyLabel'
  } else if (name == '色情') {
    return 'yellowLabel'
  } else if (name == '诈骗') {
    return 'redLabel'
  } else if (name == '赌博') {
    return 'purpleLabel'
  } else if (name == '正常') {
    return 'greenLabel'
  } else if (name == '黑灰') {
    return 'blackLabel'
  } else if (!Number.isNaN(Number(name))) {
    if (name < 30) {
      return 'red'
    } else if (name < 60) {
      return 'yellow'
    } else if (name < 80) {
      return 'blue'
    } else if (name <= 100) {
      return 'green'
    } else {
      return 'grey'
    }
  } else {
    return 'greyLabel'
  }
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

    width: 95%;
    margin: 20px auto;
    .table-imgs {
      display: flex;

      .table-img {
        width: 80px;
        border-radius: 40px;
        border: 2px solid #fff;
      }
    }
  }

  .el-table {
    .first-label {
      color: #fff;
      border-radius: 5px;
      padding: 0 5px;
      margin-left: 8px;
    }

    .colorLabel {
      font-weight: 600;
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
