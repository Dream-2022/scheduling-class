<template>
  <!-- <div class="course">
    <div class="course-top">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="排课时间段" />
        <el-step title="学校基础信息" />
        <el-step title="禁排设置" />
        <el-step title="排课优先级" />
        <el-step title="设置课程教室" />
      </el-steps>
      <el-button color="#626aef">Default</el-button>
      <el-button color="#626aef">Default</el-button>
    </div>
  </div> -->
  <div class="search-box">
    <div class="button-box">
      <el-button color="#547bf1" :icon="Plus" style="margin-bottom: 10px" @click="addTimetable()">
        新建课表
      </el-button>
      <el-button :icon="Download" plain style="margin-bottom: 10px" @click="downloadClick">
        下载教学计划示例
      </el-button>
      <el-button
        :icon="Discount"
        color="#547bf1"
        plain
        style="margin-bottom: 10px"
        @click="applicationSearchClick()"
      >
        特殊规则设置
      </el-button>
    </div>
    <el-input
      v-model="keyInput"
      clearable
      style="height: 32px; max-width: 350px"
      placeholder="请输入关键词"
      :prefix-icon="Search"
    />
    <el-button color="#547bf1" plain style="margin-bottom: 10px" @click="applicationSearchClick()">
      搜索
    </el-button>
  </div>
  <div class="middle-word"></div>
  <el-table
    :data="courseList.arr"
    style="width: 100%"
    stripe
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
  >
    <el-table-column label="课表名称" width="150">
      <template #default="{ row }">
        <strong
          ><div>{{ row.taskName }}</div></strong
        >
      </template>
    </el-table-column>
    <el-table-column label="学期" width="160">
      <template #default="{ row }">
        <div>
          {{ row.academicTerm }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="发布状态" width="140">
      <template #default="{ row }">
        <div
          class="publish"
          :class="
            row.taskStatus == '0'
              ? 'status0'
              : row.taskStatus == '1'
                ? 'status1'
                : row.taskStatus == '2'
                  ? 'status2'
                  : row.taskStatus == '3'
                    ? 'status3'
                    : 'status4'
          "
        >
          {{
            row.taskStatus == '0'
              ? '待执行'
              : row.taskStatus == '1'
                ? '进行中'
                : row.taskStatus == '2'
                  ? '已完成'
                  : row.taskStatus == '3'
                    ? '失败'
                    : '进行中'
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="课时数量" width="95">
      <template #default="{ row }">
        <div>
          {{ row.totalClassHours }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="课程数量" width="95">
      <template #default="{ row }">
        <div>
          {{ row.totalCourseSize }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="未排课程" width="95">
      <template #default="{ row }">
        <div>
          {{ row.totalCourseSize - row.successCourseSize }}
          <span class="iconfont icon-bangzhu"></span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="班级数量" width="95">
      <template #default="{ row }">
        <div>
          {{ row.totalClassSize }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="签名" width="180">
      <template #default="{ row }">
        <img class="signature-img" :src="row.signature" alt="签名" />
      </template>
    </el-table-column>
    <el-table-column label="创建时间" width="180">
      <template #default="{ row }">
        <div>
          {{ row.createdAt }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="执行时间" width="180">
      <template #default="{ row }">
        <div>{{ row.startTime }}</div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="140">
      <template #default="{ row }">
        <div>
          <el-button
            color="#368eec"
            size="small"
            @click="
              router.push(
                `/manager/functionPage/course/${row.scheduleTaskId}/class?name=${row.taskName}`,
              )
            "
            style="margin-bottom: 10px; color: #fff"
          >
            查看 / 修改
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 课表基础信息弹窗 -->

  <!-- :before-close="handleClose" -->
  <el-dialog v-model="dialogVisible" title="课表基础信息" width="30%" :show-close="false">
  </el-dialog>
</template>
<script setup>
import { ref, defineEmits, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Download, Discount } from '@element-plus/icons-vue'
// import { useUserStore } from '@/stores/userStore'
import { getCourseSchedulingAPI } from '@/apis/course.js'

const emits = defineEmits(['downloadClick', 'information'])
const downloadClick = () => {
  emits('downloadClick')
}
// const userStore = useUserStore()
const router = useRouter()

const courseList = reactive([])
const keyInput = ref('') //输入的关键字
let dialogVisible = ref(false)
onMounted(async () => {
  emits('information', false)
  const res = await getCourseSchedulingAPI()
  console.log(res.data)
  courseList.arr = res.data.data
  for (let i = 0; i < courseList.arr.length; i++) {
    courseList.arr[i].createdAt = courseList.arr[i].createdAt.replace('T', ' ')
    courseList.arr[i].startTime = courseList.arr[i].startTime.replace('T', ' ')
  }
})
//点击新建课表
function addTimetable() {
  emits('information', true)
}
</script>
<style lang="scss" scoped>
.course {
  display: flex;
  justify-content: center;
  .course-top {
    display: flex;
    align-items: center;
    width: 95%;
    background-color: #fff;
    border-radius: 26px 26px 8px 8px;

    height: 50px;

    .el-button {
      line-height: 50px;
    }
  }
}
:deep(.el-steps) {
  width: 100%;
}
:deep(.el-steps--simple) {
  background-color: #fff !important;
  border-radius: 26px 26px 8px 8px;
}

.scheduling-box {
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
      margin-bottom: 15px;

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
    .el-table {
      .publish {
        color: $green;
      }

      .class-status1 {
        color: $main-green;
      }
      .class-status2 {
        color: $main-yellow;
      }
      .status0 {
        color: $word-grey-color;
      }
      .status1 {
        color: $main-yellow;
      }
      .status2 {
        color: $purple;
      }
      .status3 {
        color: $red;
      }
      .status4 {
        color: $main-green;
      }
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
</style>
