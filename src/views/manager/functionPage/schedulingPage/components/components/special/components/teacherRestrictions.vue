<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        教师特定节次限制：限制教师在指定班级和科目的上课节次
      </div>
      <div class="activity-search">
        <el-cascader
          :options="TeacherOptions"
          placeholder="选择教师"
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
          v-for="(item, index) in teacherList"
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
              <div class="teacher-list">
                <el-tag
                  v-for="teacher in item.teachers"
                  :key="teacher"
                  closable
                  :disable-transitions="false"
                  @close="deleteTeacherClick(item, teacher)"
                >
                  {{ teacher[1] }}
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
                每天最多 <span class="limit-num">{{ item.maxPerDay }}</span> 节, 每周最多
                <span class="limit-num">{{ item.maxPerWeek }}</span> 节
              </div>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="teacherList.length === 0" description="暂无数据，请新增限制" />
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" title="新增教师特定节次限制" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addTeacherForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="限制名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入限制名称" v-model="addTeacherForm.name" />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="限制周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addTeacherForm.weekStart"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addTeacherForm.weekEnd"
          >
            <el-option label="全部" value="全部" />
            <el-option v-for="week in 18" :key="week" :label="week" :value="week" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="选择教师" prop="teachers">
        <el-cascader
          style="width: 300px"
          placeholder="请选择教师（多选）"
          v-model="addTeacherForm.teachers"
          filterable
          :options="TeacherOptions"
          :props="option"
          clearable
        />
      </el-form-item>

      <el-form-item label="选择班级" prop="classes">
        <el-cascader
          style="width: 300px"
          placeholder="请选择班级（多选）"
          v-model="addTeacherForm.classes"
          filterable
          :options="classOptions"
          :props="optionClass"
          clearable
        />
      </el-form-item>

      <div style="display: flex; gap: 10px">
        <el-form-item label="每天上限" prop="maxPerDay">
          <el-input-number
            style="width: 140px"
            v-model="addTeacherForm.maxPerDay"
            :min="1"
            :max="8"
            placeholder="每天最多课时"
          />
        </el-form-item>
        <el-form-item label="每周上限" prop="maxPerWeek">
          <el-input-number
            style="width: 140px"
            v-model="addTeacherForm.maxPerWeek"
            :min="1"
            :max="40"
            placeholder="每周最多课时"
          />
        </el-form-item>
      </div>
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
import { getTeacherAndStudentAPI } from '@/apis/person'
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
const TeacherOptions = ref([])
const classOptions = ref([])
const dialogVisible = ref(false)
const ruleFormRef = ref()
const teacherList = ref(props.allContent.teacherRestrictions || [])
const activeValue = ref(null)

const addTeacherForm = ref({
  name: '',
  teachers: [],
  classes: [],
  weekStart: '',
  weekEnd: '',
  maxPerDay: 2,
  maxPerWeek: 10,
})

onMounted(async () => {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  TeacherOptions.value = nodes
  classOptions.value = nodes
  await Promise.all([getTeacherOptions(), getClassOptions()])
})

// 获取教师选项
async function getTeacherOptions() {
  option.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      const res = await getTeacherAndStudentAPI('', '', selectedPath[0], '', 1, 100)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}
function handleSearch() {}
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

function addClick() {
  console.log(1)
  if (!addTeacherForm.value.teachers?.length || !addTeacherForm.value.classes?.length) {
    ElMessage.warning('请选择教师和班级')
    return
  }
  console.log(2)
  if (addTeacherForm.value.maxPerDay * 5 < addTeacherForm.value.maxPerWeek) {
    ElMessage.warning('每周课时不能超过每天课时的5倍')
    return
  }

  console.log(3)
  const newGroup = JSON.parse(JSON.stringify(addTeacherForm.value))
  teacherList.value.push(newGroup)

  addTeacherForm.value = {
    name: '',
    teachers: [],
    classes: [],
    weekStart: '',
    weekEnd: '',
    maxPerDay: 2,
    maxPerWeek: 10,
  }

  console.log(4)
  ElMessage.success('添加成功！')
  dialogVisible.value = false
}

function deleteClassClick(item, cls) {
  item.classes = item.classes.filter(c => c[1] !== cls[1])
  checkAndRemoveEmptyItem(item)
}

function checkAndRemoveEmptyItem(item) {
  if (!item.classes.length) {
    teacherList.value = teacherList.value.filter(t => t.name !== item.name)
    if (teacherList.value.length === 0) {
      activeValue.value = null
    }
  }
}

const rules = ref({
  name: [{ required: true, message: '限制名称不能为空', trigger: 'blur' }],
  teachers: [{ required: true, message: '请选择教师', trigger: 'blur' }],
  classes: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  maxPerDay: [{ required: true, message: '请输入每天上限', trigger: 'blur' }],
  maxPerWeek: [{ required: true, message: '请输入每周上限', trigger: 'blur' }],
})

watch(
  teacherList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      teacherRestrictions: newValue,
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
.limit-info {
  color: #666;
  font-size: 14px;
  .limit-num {
    color: #409eff;
    font-weight: bold;
    font-size: 16px;
  }
}
.teacher-info {
  .class-list,
  .subject-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 8px 0;
  }
  .teacher-list {
    display: flex;
    gap: 8px;
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
