<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        特殊教师禁排：设置特殊部门教师（如教务处、学生处等）不安排上课
      </div>
      <div class="activity-search">
        <el-select
          v-model="selectedDepartment"
          placeholder="选择部门"
          style="margin-right: 10px; width: 240px"
          clearable
        >
          <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
        </el-select>
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
              <span class="title-word">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第 {{ item.weekStart }} 周 - 第
                {{ item.weekEnd }} 周
              </span>
            </div>
            <div class="teacher-info">
              <div class="department-list">
                <el-tag
                  v-for="dept in item.departments"
                  :key="dept"
                  closable
                  :disable-transitions="false"
                  @close="deleteDepartmentClick(item, dept)"
                >
                  {{ dept }}
                </el-tag>
              </div>
              <div class="teacher-list">
                <el-tag
                  v-for="teacher in item.teachers"
                  :key="teacher"
                  type="success"
                  closable
                  :disable-transitions="false"
                  @close="deleteTeacherClick(item, teacher)"
                >
                  {{ teacher[0] }}
                </el-tag>
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

  <el-dialog v-model="dialogVisible" title="新增特殊教师禁排" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addProhibitionForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="设置名称" prop="name">
        <el-input
          style="width: 300px"
          placeholder="请输入设置名称"
          v-model="addProhibitionForm.name"
        />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="限制周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addProhibitionForm.weekStart"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addProhibitionForm.weekEnd"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="选择部门" prop="departments">
        <el-select
          v-model="addProhibitionForm.departments"
          multiple
          style="width: 300px"
          placeholder="请选择部门"
        >
          <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
        </el-select>
      </el-form-item>

      <el-form-item label="选择教师" prop="teachers">
        <el-cascader
          style="width: 300px"
          placeholder="请选择教师（多选）"
          v-model="addProhibitionForm.teachers"
          filterable
          :options="TeacherOptions"
          :props="option"
          clearable
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
import { getTeacherAndStudentAPI } from '@/apis/person'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const departments = [
  '学院领导',
  '教务处',
  '超星技术人员',
  '信息管理中心',
  '组织人事处',
  '党群办公室',
  '教科研处',
  '心理教学部',
  '学生工作处',
  '继续教育与培训部',
  '后勤管理服务中心',
]

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
    required: true,
  },
})

let option = ref({ multiple: true })
const selectedDepartment = ref('')
const TeacherOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const prohibitionList = ref(props.allContent.roleProhibition || [])
const activeValue = ref(null)

const addProhibitionForm = ref({
  name: '',
  weekStart: '',
  weekEnd: '',
  departments: [],
  teachers: [],
})

onMounted(async () => {})

// 搜索
const handleSearch = () => {
  if (!selectedDepartment.value) {
    prohibitionList.value = props.allContent.roleProhibition || []
    return
  }

  prohibitionList.value = (props.allContent.roleProhibition || []).filter(item => {
    return item.departments.includes(selectedDepartment.value)
  })
}

// 新增禁排
const handleAdd = () => {
  if (
    !addProhibitionForm.value.name ||
    !addProhibitionForm.value.weekStart ||
    !addProhibitionForm.value.weekEnd ||
    (!addProhibitionForm.value.departments.length && !addProhibitionForm.value.teachers.length)
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  prohibitionList.value.push({
    ...addProhibitionForm.value,
  })

  addProhibitionForm.value = {
    name: '',
    weekStart: '',
    weekEnd: '',
    departments: [],
    teachers: [],
  }
  dialogVisible.value = false
  ElMessage.success('添加成功！')
}

function deleteDepartmentClick(item, dept) {
  item.departments = item.departments.filter(d => d !== dept)
  checkAndRemoveEmptyItem(item)
}

function deleteTeacherClick(item, teacher) {
  item.teachers = item.teachers.filter(t => t[1] !== teacher[1])
  checkAndRemoveEmptyItem(item)
}

function checkAndRemoveEmptyItem(item) {
  if (!item.departments.length && !item.teachers.length) {
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
  name: [{ required: true, message: '设置名称不能为空', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
})

watch(
  addProhibitionForm,
  async newValue => {
    for (let i = 0; i < newValue.departments.length; i++) {
      const res = await getTeacherAndStudentAPI('', '', newValue.departments[i], '', 1, 20)
      console.log(res.data)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      nodes.forEach(element => {
        TeacherOptions.value.push(element)
      })
    }
  },
  { deep: true },
)
watch(
  prohibitionList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      roleProhibition: newValue,
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

.teacher-info {
  .department-list,
  .teacher-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0;
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
