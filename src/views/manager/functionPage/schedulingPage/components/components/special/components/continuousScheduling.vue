<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        多学时课程连排：设置理论课、实验课、上机课等多学时课程的连续排课要求
      </div>
      <div class="activity-search">
        <el-cascader
          :options="SubjectOptions"
          placeholder="选择科目"
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
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true">新增连排</el-button>
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
              <div class="class-list">
                <el-tag
                  v-for="cls in item.classes"
                  :key="cls"
                  type="success"
                  closable
                  :disable-transitions="false"
                  @close="deleteClassClick(item, cls)"
                >
                  {{ cls[1] }}
                </el-tag>
              </div>
              <div class="limit-info">
                连排类型：<span class="limit-num">{{ item.type }}</span>
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="subjectList.length === 0" description="暂无数据，请新增连排" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增多学时课程连排" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addSubjectForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="设置名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入设置名称" v-model="addSubjectForm.name" />
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
          :options="SubjectOptions"
          :props="option"
          clearable
        />
      </el-form-item>

      <el-form-item label="选择班级" prop="classes">
        <el-cascader
          style="width: 300px"
          placeholder="请选择班级（多选）"
          v-model="addSubjectForm.classes"
          filterable
          :options="classOptions"
          :props="optionClass"
          clearable
        />
      </el-form-item>

      <el-form-item label="连排类型" prop="type">
        <el-radio-group v-model="addSubjectForm.type">
          <el-radio label="理论+实验">理论+实验</el-radio>
          <el-radio label="理论+上机">理论+上机</el-radio>
          <el-radio label="实验+上机">实验+上机</el-radio>
        </el-radio-group>
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
import { getDepartmentsAPI, getClassesAPI } from '@/apis/classMajor'
import { getCoursePageSizeAPI } from '@/apis/course'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
  },
})

let option = ref()
let optionClass = ref()
const selectedArr = ref('')
const SubjectOptions = ref([])
const classOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const subjectList = ref(props.allContent.continuousScheduling || [])
const activeValue = ref(null)

const addSubjectForm = ref({
  name: '',
  subjects: [],
  classes: [],
  weekStart: '',
  weekEnd: '',
  type: '理论+实验',
})

onMounted(async () => {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  SubjectOptions.value = nodes
  classOptions.value = nodes
  await Promise.all([getSubjectOptions(), getClassOptions()])
})

// 获取科目选项
async function getSubjectOptions() {
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

// 获取班级选项
async function getClassOptions() {
  optionClass.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      const res = await getClassesAPI(selectedPath[0], '')
      const nodes = res.data.data.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}

function handleSearch() {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    subjectList.value = props.allContent.continuousScheduling || []
    return
  }

  subjectList.value = (props.allContent.continuousScheduling || []).filter(item => {
    return item.subjects.some(subject => {
      return selectedArr.value.some(selected => {
        return selected[0] === subject[0] && selected[1] === subject[1]
      })
    })
  })
}

function addClick() {
  if (!addSubjectForm.value.subjects?.length || !addSubjectForm.value.classes?.length) {
    ElMessage.warning('请选择科目和班级')
    return
  }

  const newGroup = JSON.parse(JSON.stringify(addSubjectForm.value))
  subjectList.value.push(newGroup)

  addSubjectForm.value = {
    name: '',
    subjects: [],
    classes: [],
    weekStart: '',
    weekEnd: '',
    type: '理论+实验',
  }

  ElMessage.success('添加成功！')
  dialogVisible.value = false
}

function deleteSubjectClick(item, subject) {
  item.subjects = item.subjects.filter(s => s[1] !== subject[1])
  checkAndRemoveEmptyItem(item)
}

function deleteClassClick(item, cls) {
  item.classes = item.classes.filter(c => c[1] !== cls[1])
  checkAndRemoveEmptyItem(item)
}

function checkAndRemoveEmptyItem(item) {
  if (!item.subjects.length || !item.classes.length) {
    subjectList.value = subjectList.value.filter(t => t.name !== item.name)
    if (subjectList.value.length === 0) {
      activeValue.value = null
    }
  }
}

function deleteGroup(index) {
  subjectList.value.splice(index, 1)
  if (subjectList.value.length === 0) {
    activeValue.value = null
  }
  ElMessage.success('删除成功！')
}

function activeBoxClick(index) {
  activeValue.value = index
}

const rules = ref({
  name: [{ required: true, message: '设置名称不能为空', trigger: 'blur' }],
  subjects: [{ required: true, message: '请选择科目', trigger: 'blur' }],
  classes: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  type: [{ required: true, message: '请选择连排类型', trigger: 'blur' }],
})

watch(
  subjectList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      continuousScheduling: newValue,
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

.subject-info {
  .subject-list,
  .class-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0;
  }
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
