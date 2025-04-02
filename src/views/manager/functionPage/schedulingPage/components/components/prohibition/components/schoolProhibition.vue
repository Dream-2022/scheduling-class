<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        学校时间段禁排：设置全校统一不排课的时间段，如节假日、运动会、考试等
      </div>
      <div class="activity-search">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
          style="margin-right: 10px; width: 240px"
          :disabled-date="disabledDate"
        />
        <el-button
          color="#547bf1"
          plain
          style="margin-right: auto"
          :icon="Search"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button color="#547bf1" :icon="Calendar" @click="fetchHolidays"
          >智能提取节假日</el-button
        >
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true">新增禁排</el-button>
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in prohibitionList"
          :key="index"
          :class="{ 'active-box': index === activeValue }"
          @click="activeBoxClick(index)"
        >
          <div class="activity-box-left">
            <div class="title">
              {{ item.name }}
            </div>
            <div class="date-info">
              <div class="date-range">{{ item.startDate }} 至 {{ item.endDate }}</div>
              <div class="time-slots" v-if="item.timeSlots && item.timeSlots.length">
                <el-tag v-for="slot in item.timeSlots" :key="slot" size="small" effect="plain">
                  {{ slot }}
                </el-tag>
              </div>
              <div class="reason" v-if="item.reason">原因：{{ item.reason }}</div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#547bf1" plain @click.stop="EditGroup(index)">修改</el-button>
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="prohibitionList.length === 0" description="暂无数据，请新增禁排" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增时间段禁排" width="600">
    <el-form
      ref="ruleFormRef"
      :model="addProhibitionForm"
      :rules="rules"
      label-width="120px"
      status-icon
    >
      <el-form-item label="禁排名称" prop="name">
        <el-input
          style="width: 400px"
          placeholder="请输入禁排名称，如：国庆节、期中考试等"
          v-model="addProhibitionForm.name"
        />
      </el-form-item>

      <el-form-item label="日期范围" prop="dateRange">
        <el-date-picker
          v-model="addProhibitionForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 380px"
          :disabled-date="disabledDate"
        />
      </el-form-item>

      <el-form-item label="禁排原因" prop="reason">
        <el-input
          type="textarea"
          style="width: 400px"
          placeholder="请输入禁排原因"
          v-model="addProhibitionForm.reason"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleAdd" color="#547bf1" plain>新增</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search, Plus, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getHolidaysAPI } from '@/apis/holiday'

const props = defineProps({
  allContent: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:allContent'])

const selectedDate = ref('')
const dialogVisible = ref(false)
const activeValue = ref(null)
const prohibitionList = ref([])

const addProhibitionForm = ref({
  name: '',
  weekStart: '',
  weekEnd: '',
  dateRange: [],
  timeSlots: [],
  reason: '',
})

const rules = ref({
  name: [{ required: true, message: '禁排名称不能为空', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'blur' }],
  timeSlots: [{ required: true, message: '请选择时间段', trigger: 'blur' }],
})

// 禁用日期
const disabledDate = time => {
  return time.getTime() < Date.now() - 8.64e7
}

// 搜索
const handleSearch = () => {
  if (!selectedDate.value) {
    prohibitionList.value = props.allContent.schoolProhibition || []
    return
  }

  const searchDate = new Date(selectedDate.value).toISOString().split('T')[0]
  prohibitionList.value = (props.allContent.schoolProhibition || []).filter(item => {
    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)
    const searchDateTime = new Date(searchDate)
    return searchDateTime >= startDate && searchDateTime <= endDate
  })
}

// 提取节假日
const fetchHolidays = async () => {
  const res = await getHolidaysAPI()
  console.log(res.data)
  console.log(res.data.data)
  for (let i = 0; i < res.data.data.length; i++) {
    prohibitionList.value.push(res.data.data[i])
  }
  // 这里可以调用接口获取节假日数据
  ElMessage.success('节假日数据获取成功！')
}

// 新增禁排
const handleAdd = () => {
  if (!addProhibitionForm.value.name || !addProhibitionForm.value.dateRange) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const [startDate, endDate] = addProhibitionForm.value.dateRange
  prohibitionList.value.push({
    ...addProhibitionForm.value,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  })

  addProhibitionForm.value = {
    name: '',
    weekStart: '',
    weekEnd: '',
    dateRange: [],
    timeSlots: [],
    reason: '',
  }
  dialogVisible.value = false
  ElMessage.success('添加成功！')
}

// 删除禁排
const deleteGroup = index => {
  prohibitionList.value.splice(index, 1)
  ElMessage.success('删除成功！')
}
const EditGroup = () => {}

// 选中禁排
const activeBoxClick = index => {
  activeValue.value = index
}

// 监听数据变化
watch(
  prohibitionList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      schoolProhibition: newValue,
    })
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.activity-container {
  min-height: 400px;
  display: flex;
  gap: 20px;

  .activity-left {
    flex: 1;
    .activity-search {
      width: 100%;
      display: flex;
      .el-button {
        padding: 8px;
      }
    }

    .activity-boxes {
      margin: 16px 0;

      .activity-box {
        margin-bottom: 10px;
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 8px;
        padding: 10px 12px;
        background-color: transparent;
        transition: background-color 0.3s ease;

        .activity-box-left {
          .title {
            margin-bottom: 5px;
          }

          .date-info {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .date-range {
              color: #409eff;
              font-weight: 500;
            }

            .time-slots {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .reason {
              color: #666;
              font-size: 14px;
            }
          }
        }

        .activity-box-right {
          .el-button {
            padding: 2px 10px;
          }
        }

        &:hover {
          background-color: #fafeff;
        }
      }

      .active-box {
        background-color: #f6f6f6;
      }
    }
  }
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.warn-box {
  background-color: #fff3e0;
  color: #cd871d;
  padding: 5px 15px;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ffdb9e;

  .iconfont::before {
    font-size: 16px;
  }
}
</style>
