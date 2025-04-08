<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        教室时间段禁排：设置教室在特定时间段不能用于考试，如教室维修、设备检修等
      </div>
      <div class="activity-search">
        <el-cascader
          :options="classroomOptions"
          placeholder="选择教室"
          filterable
          :props="optionClassroom"
          style="margin-right: 10px; width: 240px"
          clearable
          v-model="selectedArr"
        />
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          @click="handleSearch"
          style="margin-right: auto"
          >搜索</el-button
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

              <span class="date-range"
                >{{ item.startDate }} <span class="date-word">&nbsp;至&nbsp;</span>
                {{ item.endDate }}</span
              >
            </div>
            <div class="classroom-info">
              <div class="classroom-list">
                <el-tag
                  v-for="classroom in item.classrooms"
                  :key="classroom"
                  closable
                  :disable-transitions="false"
                  @close="deleteClassroomClick(item, classroom)"
                >
                  {{ classroom[1] }}
                </el-tag>
              </div>
              <div class="date-info">
                <div class="time-slots" v-if="item.timeSlots && item.timeSlots.length">
                  <el-tag v-for="slot in item.timeSlots" :key="slot" size="small" effect="plain">
                    {{ slot }}
                  </el-tag>
                </div>
                <div class="reason" v-if="item.reason">原因：{{ item.reason }}</div>
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="prohibitionList.length === 0" description="暂无数据，请新增禁排" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增教室时间段禁排" width="600">
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
          placeholder="请输入禁排名称，如：教室维修、设备检修等"
          v-model="addProhibitionForm.name"
        />
      </el-form-item>

      <el-form-item label="选择教室" prop="classrooms">
        <el-cascader
          style="width: 400px"
          placeholder="请选择教室（多选）"
          v-model="addProhibitionForm.classrooms"
          filterable
          :options="classroomOptions"
          :props="optionClassroom"
          clearable
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
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { getDepartmentsAPI, getClassroomAPI } from '@/apis/classMajor'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
    default: () => ({}),
  },
})

let optionClassroom = ref()
const selectedArr = ref('')
const classroomOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const prohibitionList = ref(props.allContent.classroomDisabled || [])
const activeValue = ref(null)

const addProhibitionForm = ref({
  name: '',
  classrooms: [],
  dateRange: [],
  timeSlots: [],
  reason: '',
})

onMounted(async () => {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  classroomOptions.value = nodes
  getClassroomOptions()
})

// 获取教室选项
async function getClassroomOptions() {
  optionClassroom.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues

      const res = await getClassroomAPI('', selectedPath[0], '', 1, 50)
      console.log(res.data)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}

// 禁用日期
const disabledDate = time => {
  return time.getTime() < Date.now() - 8.64e7
}

// 搜索
const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    prohibitionList.value = props.allContent.classroomDisabled || []
    return
  }

  prohibitionList.value = (props.allContent.classroomDisabled || []).filter(item => {
    return item.classrooms.some(classroom => {
      return selectedArr.value.some(selected => {
        return selected[0] === classroom[0] && selected[1] === classroom[1]
      })
    })
  })
}

// 新增禁排
const handleAdd = () => {
  if (
    !addProhibitionForm.value.name ||
    !addProhibitionForm.value.dateRange ||
    !addProhibitionForm.value.classrooms?.length
  ) {
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
    classrooms: [],
    dateRange: [],
    timeSlots: [],
    reason: '',
  }
  dialogVisible.value = false
  ElMessage.success('添加成功！')
}

function deleteClassroomClick(item, classroom) {
  item.classrooms = item.classrooms.filter(c => c[1] !== classroom[1])
  if (!item.classrooms.length) {
    prohibitionList.value = prohibitionList.value.filter(t => t.name !== item.name)
    if (prohibitionList.value.length === 0) {
      activeValue.value = null
    }
  }
}

function deleteGroup(index) {
  prohibitionList.value.splice(index, 1)
  if (prohibitionList.value.length === 0) {
    activeValue.value = null
  }
  ElMessage.success('删除成功！')
}

function activeBoxClick(index) {
  activeValue.value = index
}

const rules = ref({
  name: [{ required: true, message: '禁排名称不能为空', trigger: 'blur' }],
  classrooms: [{ required: true, message: '请选择教室', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择日期范围', trigger: 'blur' }],
})

watch(
  prohibitionList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      classroomDisabled: newValue,
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
            font-weight: 600;

            .date-range {
              color: #409eff;
              font-weight: normal;
              margin-left: 20px;

              .date-word {
                color: #5a5a5a;
                font-size: 14px;
              }
            }
          }

          .classroom-info {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .classroom-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .date-info {
              .time-slots {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 8px 0;
              }

              .reason {
                color: #666;
                font-size: 14px;
              }
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
