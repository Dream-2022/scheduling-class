<template>
  <div class="search-box">
    <div class="button-box">
      <el-button color="#547bf1" :icon="Plus" style="margin-bottom: 10px" @click="addExam()">
        新建考试
      </el-button>
      <el-button :icon="Download" plain style="margin-bottom: 10px" @click="downloadClick">
        下载考试计划示例
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
    :data="examList.arr"
    style="width: 100%"
    stripe
    :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }"
  >
    <el-table-column label="考试 id" min-width="100">
      <template #default="{ row }">
        <div>{{ row.id }}</div>
      </template>
    </el-table-column>
    <el-table-column label="考试名称" min-width="180">
      <template #default="{ row }">
        <strong>
          <div>{{ row.arrangementName }}</div>
        </strong>
      </template>
    </el-table-column>
    <el-table-column label="发布状态" min-width="140">
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
    <el-table-column label="考试数量" min-width="120">
      <template #default="{ row }">
        <div>
          {{ row.examSize }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="failSize" label="未排考试" min-width="120" />
    <el-table-column prop="operatorName" label="管理员" min-width="120" />
    <el-table-column label="班级数量" min-width="120">
      <template #default="{ row }">
        <div>
          {{ row.classCount }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" min-width="180">
      <template #default="{ row }">
        <div>
          {{ row.createTime }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" min-width="140">
      <template #default="{ row }">
        <div>
          <el-button
            color="#368eec"
            size="small"
            @click="
              router.push(
                `/manager/functionPage/schedule/${row.scheduleTaskId}/exam?name=${row.taskName}`,
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
</template>
<script setup>
import { ref, defineEmits, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, Download, Discount } from '@element-plus/icons-vue'
import { getExamTableAllAPI } from '@/apis/exam.js'

const emits = defineEmits(['downloadClick', 'information'])
const downloadClick = () => {
  emits('downloadClick')
}
const router = useRouter()

const examList = reactive([])
const keyInput = ref('') //输入的关键字

onMounted(async () => {
  emits('information', false)
  const res = await getExamTableAllAPI()
  console.log(res.data)
  examList.arr = res.data.data
  for (let i = 0; i < examList.arr.length; i++) {
    examList.arr[i].createTime = examList.arr[i].createTime.replace('T', ' ')
  }
})
//点击新建考试
function addExam() {
  emits('information', true)
}
</script>
<style lang="scss" scoped>
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
      .signature-img {
        width: 100%;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
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
