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
      <el-button
        :icon="Download"
        plain
        style="margin-bottom: 10px"
        @click="applicationSearchClick()"
      >
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
    :data="courseList"
    style="width: 100%"
    stripe
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
  >
    <el-table-column label="课表名称" min-width="120">
      <template #default="{ row }">
        <div>{{ row.teacherName }}（{{ row.teacherId }}）</div>
      </template>
    </el-table-column>
    <el-table-column label="发布状态" min-width="160">
      <template #default="{ row }">
        <div>
          <strong>{{ row.leaveReason }}</strong>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" min-width="90">
      <template #default="{ row }">
        <div>
          {{ row.leaveType }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="调整举措" min-width="120">
      <template #default="{ row }">
        <div>
          {{ row.title }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="签名" min-width="180">
      <template #default="{ row }">
        <img class="signature-img" :src="row.signature" alt="签名" />
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
            批准
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
import { useUserStore } from '@/stores/userStore'
const userStore = useUserStore()
const router = useRouter()

const emit = defineEmits(['information'])
const courseList = reactive([])
const keyInput = ref('') //输入的关键字
let dialogVisible = ref(false)
onMounted(() => {
  console.log('传值')
  emit('information', false)
})
function addTimetable() {
  emit('information', true)
  router.push(`/${userStore.user.identity.toLowerCase()}/functionPage/scheduling/scheduleCourse`)
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
