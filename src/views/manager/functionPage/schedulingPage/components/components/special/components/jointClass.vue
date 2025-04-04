<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        合班设置：设置多个班级在同一科目合班上课
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
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true">新增合班</el-button>
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in jointList"
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
            <div class="joint-info">
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
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="jointList.length === 0" description="暂无数据，请新增合班" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增合班设置" width="500">
    <el-form ref="ruleFormRef" :model="addJointForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="设置名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入设置名称" v-model="addJointForm.name" />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="限制周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addJointForm.weekStart"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addJointForm.weekEnd"
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
          v-model="addJointForm.subjects"
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
          v-model="addJointForm.classes"
          filterable
          :options="classOptions"
          :props="optionClass"
          clearable
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
const jointList = ref(props.allContent.jointClass || [])
const activeValue = ref(null)

const addJointForm = ref({
  name: '',
  subjects: [],
  classes: [],
  weekStart: '',
  weekEnd: '',
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
    jointList.value = props.allContent.jointClass || []
    return
  }

  jointList.value = (props.allContent.jointClass || []).filter(item => {
    return item.subjects.some(subject => {
      return selectedArr.value.some(selected => {
        return selected[0] === subject[0] && selected[1] === subject[1]
      })
    })
  })
}

function addClick() {
  if (!addJointForm.value.subjects?.length || !addJointForm.value.classes?.length) {
    ElMessage.warning('请选择科目和班级')
    return
  }

  if (addJointForm.value.classes.length < 2) {
    ElMessage.warning('合班至少需要选择两个班级')
    return
  }

  const newGroup = JSON.parse(JSON.stringify(addJointForm.value))
  jointList.value.push(newGroup)

  addJointForm.value = {
    name: '',
    subjects: [],
    classes: [],
    weekStart: '',
    weekEnd: '',
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
  if (item.classes.length < 2) {
    ElMessage.warning('合班至少需要两个班级，此合班设置将被删除')
    jointList.value = jointList.value.filter(t => t.name !== item.name)
    if (jointList.value.length === 0) {
      activeValue.value = null
    }
  }
}

function checkAndRemoveEmptyItem(item) {
  if (!item.subjects.length || item.classes.length < 2) {
    jointList.value = jointList.value.filter(t => t.name !== item.name)
    if (jointList.value.length === 0) {
      activeValue.value = null
    }
  }
}

function deleteGroup(index) {
  jointList.value.splice(index, 1)
  if (jointList.value.length === 0) {
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
})

watch(
  jointList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      jointClass: newValue,
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

.joint-info {
  .subject-list,
  .class-list {
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
