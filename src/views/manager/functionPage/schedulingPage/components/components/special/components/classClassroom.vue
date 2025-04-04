<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        班级固定教室：设置班级在特定科目上课时使用固定的教室
      </div>
      <div class="activity-search">
        <el-cascader
          :options="classOptions"
          placeholder="选择班级"
          filterable
          :props="optionClass"
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
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true"
          >新增固定教室</el-button
        >
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in classList"
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
            <div class="class-info">
              <div class="class-list">
                <el-tag
                  v-for="cls in item.classes"
                  :key="cls"
                  closable
                  :disable-transitions="false"
                  @close="deleteClassClick(item, cls)"
                >
                  {{ cls[1] }}
                </el-tag>
              </div>
              <div class="subject-list">
                <el-tag
                  v-for="subject in item.subjects"
                  :key="subject"
                  type="success"
                  closable
                  :disable-transitions="false"
                  @close="deleteSubjectClick(item, subject)"
                >
                  {{ subject[1] }}
                </el-tag>
              </div>
              <div class="limit-info">
                固定教室：<span class="limit-num" v-for="i in item.classrooms" :key="i">
                  {{ i[1] }}
                </span>
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="classList.length === 0" description="暂无数据，请新增固定教室" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增班级固定教室" width="500">
    <el-form ref="ruleFormRef" :model="addClassForm" :rules="rules" label-width="auto" status-icon>
      <el-form-item label="设置名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入设置名称" v-model="addClassForm.name" />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="限制周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addClassForm.weekStart"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addClassForm.weekEnd"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="选择班级" prop="classes">
        <el-cascader
          style="width: 300px"
          placeholder="请选择班级（多选）"
          v-model="addClassForm.classes"
          filterable
          :options="classOptions"
          :props="optionClass"
          clearable
        />
      </el-form-item>

      <el-form-item label="选择科目" prop="subjects">
        <el-cascader
          style="width: 300px"
          placeholder="请选择科目（多选）"
          v-model="addClassForm.subjects"
          filterable
          :options="SubjectOptions"
          :props="option"
          clearable
        />
      </el-form-item>

      <el-form-item label="固定教室" prop="classroom">
        <el-cascader
          style="width: 300px"
          placeholder="请选择科目（多选）"
          v-model="addClassForm.classrooms"
          filterable
          :options="classroomOptions"
          :props="optionClassroom"
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
import { getClassroomAPI } from '@/apis/classMajor'
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
let optionClassroom = ref()
const selectedArr = ref('')
const SubjectOptions = ref([])
const classOptions = ref([])
const classroomOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const classList = ref(props.allContent.classClassroom || [])
const activeValue = ref(null)

const addClassForm = ref({
  name: '',
  classes: [],
  classrooms: [],
  subjects: [],
  weekStart: '',
  weekEnd: '',
  classroom: '',
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
  classroomOptions.value = nodes
  await Promise.all([getSubjectOptions(), getClassOptions(), getClassroomOptions()])
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
      console.log(res.data)
      const nodes = res.data.data.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}
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

function handleSearch() {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    classList.value = props.allContent.classClassroom || []
    return
  }

  classList.value = (props.allContent.classClassroom || []).filter(item => {
    return item.classes.some(cls => {
      return selectedArr.value.some(selected => {
        return selected[0] === cls[0] && selected[1] === cls[1]
      })
    })
  })
}

function addClick() {
  if (!addClassForm.value.classes?.length || !addClassForm.value.subjects?.length) {
    ElMessage.warning('请选择班级和科目')
    return
  }

  if (!addClassForm.value.classrooms?.length) {
    ElMessage.warning('请输入固定教室')
    return
  }

  const newGroup = JSON.parse(JSON.stringify(addClassForm.value))
  classList.value.push(newGroup)

  addClassForm.value = {
    name: '',
    classes: [],
    subjects: [],
    classrooms: [],
    weekStart: '',
    weekEnd: '',
    classroom: '',
  }

  ElMessage.success('添加成功！')
  dialogVisible.value = false
}

function deleteClassClick(item, cls) {
  item.classes = item.classes.filter(c => c[1] !== cls[1])
  checkAndRemoveEmptyItem(item)
}

function deleteSubjectClick(item, subject) {
  item.subjects = item.subjects.filter(s => s[1] !== subject[1])
  checkAndRemoveEmptyItem(item)
}

function checkAndRemoveEmptyItem(item) {
  if (!item.classes.length || !item.subjects.length) {
    classList.value = classList.value.filter(t => t.name !== item.name)
    if (classList.value.length === 0) {
      activeValue.value = null
    }
  }
}

function deleteGroup(index) {
  classList.value.splice(index, 1)
  if (classList.value.length === 0) {
    activeValue.value = null
  }
  ElMessage.success('删除成功！')
}

function activeBoxClick(index) {
  activeValue.value = index
}

const rules = ref({
  name: [{ required: true, message: '设置名称不能为空', trigger: 'blur' }],
  classes: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  subjects: [{ required: true, message: '请选择科目', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  classroom: [{ required: true, message: '请输入固定教室', trigger: 'blur' }],
})

watch(
  classList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      classClassroom: newValue,
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

.class-info {
  .class-list,
  .subject-list {
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
    padding-right: 20px;
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
