<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        科目同天限制：限制科目在同一天的上课次数
      </div>
      <div class="activity-search">
        <el-cascader
          :options="subjectOptions"
          placeholder="选择课程"
          filterable
          :props="option"
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
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true">新增限制</el-button>
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in subjectList"
          :key="index"
          :class="{ 'active-box': index === activeValue }"
          @click="activeBoxClick(index)"
        >
          <div class="activity-box-left">
            <div class="title">
              {{ item.name }}
              <span class="title-word">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第 {{ item.weekStart }} 周 - 第
                {{ item.weekEnd }} 周
              </span>
            </div>
            <div class="subject-info">
              <div class="subject-list">
                <el-tag
                  v-for="subject in item.subjects"
                  :key="subject"
                  closable
                  :disable-transitions="false"
                  @close="deleteSubjectClick(item, subject)"
                >
                  {{ subject[1] }}
                </el-tag>
              </div>
              <div class="limit-info">
                每天最多上课 <span class="limit-num">{{ item.maxPerDay }}</span> 节
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="subjectList.length === 0" description="暂无数据，请新增限制" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增科目限制" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addSubjectForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="限制名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入限制名称" v-model="addSubjectForm.name" />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="限制周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addSubjectForm.weekStart"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addSubjectForm.weekEnd"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="选择科目" prop="subjects">
        <el-cascader
          style="width: 300px"
          placeholder="请选择科目（多选）"
          v-model="addSubjectForm.subjects"
          filterable
          :options="subjectOptions"
          :props="option"
          clearable
        />
      </el-form-item>

      <el-form-item label="每天上限" prop="maxPerDay">
        <el-input-number
          style="width: 140px"
          v-model="addSubjectForm.maxPerDay"
          :min="1"
          :max="8"
          placeholder="请输入每天最大上课次数"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addClick" color="#547bf1" plain>新增</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { getCoursePageSizeAPI } from '@/apis/course'
import { getDepartmentsAPI } from '@/apis/classMajor'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
  },
})

let option = ref()
const selectedArr = ref('')
const subjectOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const subjectList = ref(props.allContent.subjectDayLimit || [])
const activeValue = ref(null)

const addSubjectForm = ref({
  name: '',
  subjects: [],
  weekStart: '',
  weekEnd: '',
  maxPerDay: 2,
})

onMounted(async () => {
  getOptions()
})

async function getOptions() {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  subjectOptions.value = nodes
  option.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      const res = await getCoursePageSizeAPI('', '', '', selectedPath[0], 1, 1, 100)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}

function addClick() {
  if (!addSubjectForm.value.subjects || addSubjectForm.value.subjects.length === 0) {
    ElMessage.warning('请选择科目')
    return
  }

  const newGroup = JSON.parse(JSON.stringify(addSubjectForm.value))
  subjectList.value.push(newGroup)

  addSubjectForm.value = {
    name: '',
    subjects: [],
    weekStart: '',
    weekEnd: '',
    maxPerDay: 2,
  }

  ElMessage.success('添加成功！')
  dialogVisible.value = false
}

function deleteGroup(index) {
  subjectList.value.splice(index, 1)
  if (activeValue.value === index) {
    activeValue.value = null
  }
  ElMessage.success('删除成功！')
}

function deleteSubjectClick(item, subject) {
  item.subjects = item.subjects.filter(s => s[1] !== subject[1])
  if (item.subjects.length === 0) {
    subjectList.value = subjectList.value.filter(s => s.name !== item.name)
    if (subjectList.value.length === 0) {
      activeValue.value = null
    }
  }
  ElMessage.success('删除成功！')
}

const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    subjectList.value = props.allContent.subjectDayLimit || []
    return
  }

  subjectList.value = (props.allContent.subjectDayLimit || []).filter(item => {
    return item.subjects.some(subject => {
      return selectedArr.value.some(selected => {
        return selected[0] === subject[0] && selected[1] === subject[1]
      })
    })
  })
}

function activeBoxClick(index) {
  activeValue.value = index
}

const rules = ref({
  name: [{ required: true, message: '限制名称不能为空', trigger: 'blur' }],
  subjects: [{ required: true, message: '请选择科目', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  maxPerDay: [{ required: true, message: '请输入每天上限', trigger: 'blur' }],
})

watch(
  subjectList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      subjectDayLimit: newValue,
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
            .title-word {
              font-size: 12px;
              color: #4d4d4d;
            }
          }

          .subject-info {
            display: flex;
            align-items: center;
            gap: 20px;

            .subject-list {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .limit-info {
              color: #666;
              font-size: 14px;
              .limit-num {
                color: #409eff;
                font-weight: bold;
                font-size: 16px;
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
