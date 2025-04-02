<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        科目组合：指定两门课程连续上课
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
        <el-button color="#547bf1" :icon="Plus" @click="dialogVisible = true">新增组合</el-button>
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
              <div class="subject-pair">
                <el-tag type="success">{{ item.subject1[1] }}</el-tag>
                <span class="connector">连续上课</span>
                <el-tag type="warning">{{ item.subject2[1] }}</el-tag>
              </div>
              <div class="class-list" v-if="item.classes && item.classes.length">
                <el-tag v-for="cls in item.classes" :key="cls" size="small" effect="plain">
                  {{ cls[1] }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="subjectList.length === 0" description="暂无数据，请新增组合" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增科目组合" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addSubjectForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="组合名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入组合名称" v-model="addSubjectForm.name" />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="组合周次" prop="weekStart">
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

      <el-form-item label="第一门课程" prop="subject1">
        <el-cascader
          style="width: 300px"
          placeholder="请选择第一门课程"
          v-model="addSubjectForm.subject1"
          filterable
          :options="subjectOptions"
          :props="option"
          clearable
        />
      </el-form-item>

      <el-form-item label="第二门课程" prop="subject2">
        <el-cascader
          style="width: 300px"
          placeholder="请选择第二门课程"
          v-model="addSubjectForm.subject2"
          filterable
          :options="subjectOptions"
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
import { getDepartmentsAPI, getClassesAPI } from '@/apis/classMajor'
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
const subjectOptions = ref([])
const classOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const subjectList = ref(props.allContent.subjectCombination || [])
const activeValue = ref(null)

const addSubjectForm = ref({
  name: '',
  subject1: null,
  subject2: null,
  classes: [],
  weekStart: '',
  weekEnd: '',
  firstLessonPreference: [],
  secondLessonPreference: [],
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
  subjectOptions.value = JSON.parse(JSON.stringify(nodes))
  classOptions.value = JSON.parse(JSON.stringify(nodes))

  option.value = {
    lazy: true,
    multiple: false,
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

function addClick() {
  if (!addSubjectForm.value.subject1 || !addSubjectForm.value.subject2) {
    ElMessage.warning('请选择两门课程')
    return
  }

  const newGroup = JSON.parse(JSON.stringify(addSubjectForm.value))
  newGroup.firstLessonPreference = []
  newGroup.secondLessonPreference = []
  subjectList.value.push(newGroup)

  addSubjectForm.value = {
    name: '',
    subject1: null,
    subject2: null,
    classes: [],
    weekStart: '',
    weekEnd: '',
    firstLessonPreference: [],
    secondLessonPreference: [],
  }

  ElMessage.success('添加成功！')
  dialogVisible.value = false
}

function deleteGroup(index) {
  subjectList.value.splice(index, 1)
  ElMessage.success('删除成功！')
}

const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    subjectList.value = props.allContent.subjectCombination || []
    return
  }

  subjectList.value = (props.allContent.subjectCombination || []).filter(item => {
    return (
      (item.subject1[0] === selectedArr.value[0] && item.subject1[1] === selectedArr.value[1]) ||
      (item.subject2[0] === selectedArr.value[0] && item.subject2[1] === selectedArr.value[1])
    )
  })
}

const rules = ref({
  name: [{ required: true, message: '组合名称不能为空', trigger: 'blur' }],
  subject1: [{ required: true, message: '请选择第一门课程', trigger: 'blur' }],
  subject2: [{ required: true, message: '请选择第二门课程', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
})

watch(
  subjectList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      subjectCombination: newValue,
    })
  },
  { deep: true },
)

function activeBoxClick(index) {
  activeValue.value = index
}
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
        padding: 10px 12px 2px 12px;
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
            margin-top: 10px;
            line-height: 30px;
            gap: 20px;
            .subject-pair {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 8px;

              .connector {
                color: #666;
                font-size: 14px;
              }
            }

            .class-list {
              display: flex;
              flex-wrap: wrap;
              margin-top: 5px;
              gap: 8px;
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

  .activity-right {
    flex: 1;

    .preference-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);

      .preference-section {
        margin-bottom: 20px;

        h3 {
          margin: 0 0 15px 0;
          font-size: 15px;
          color: #333;
        }

        .el-checkbox-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
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
