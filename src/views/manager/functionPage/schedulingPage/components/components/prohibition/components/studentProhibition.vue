<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        学生禁排：班级在指定课程节次不上课
      </div>
      <div class="activity-search">
        <el-cascader
          placeholder="请筛选班级"
          v-model="selectedArr"
          filterable
          style="margin-right: 10px; width: 240px"
          :options="classOptions"
          :props="optionClass"
          clearable
        />
        <el-button
          color="#547bf1"
          plain
          style="margin-right: auto"
          :icon="Search"
          @click="handleSearch"
          >搜索</el-button
        >
        <el-button color="#547bf1" :icon="Plus" @click="studentVisible = true"
          >班级组禁排</el-button
        >
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in studentList"
          :key="item"
          @click="activeBoxClick(index)"
          :class="{ 'active-box': index === activeValue }"
        >
          <div class="activity-box-left">
            <div class="title">
              {{ item.name }}
              <span class="title-word">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;第 {{ item.weekStart }} 周 - 第
                {{ item.weekEnd }} 周
              </span>
            </div>
            <div class="class-list">
              <el-tag
                v-for="tag in item.classes"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="deleteClassClick(item, tag)"
              >
                {{ tag[1] }}
              </el-tag>
            </div>
            <div class="priority-info">
              优先级: <span class="priority-num">{{ item.priority }}</span>
            </div>
          </div>
          <div class="activity-box-right">
            <el-button color="#547bf1" plain @click.stop="editGroup(index)">修改</el-button>
            <el-button color="#f56c6c" plain @click.stop="deleteGroup(index)">删除</el-button>
          </div>
        </div>
        <el-empty v-if="studentList.length === 0" description="暂无数据，请新增分组" />
      </div>
    </div>
    <div class="activity-right">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        鼠标 [ 左击 ]：指定课程节次不上课：鼠标 [ 右击 ]：取消己指定的课程节次
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(day, index) in days" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in 8" :key="timeSlot">
            <td class="time-slot">
              <div>
                第 <strong>{{ timeSlot }}</strong> 节
              </div>
            </td>
            <td
              v-for="(day, index) in days"
              :key="`${timeSlot}-${index}`"
              :class="{ 'red-bg': activeValue != null && isCellRed(timeSlot, index) }"
              @mousedown="handleMouseDown(activeValue != null, timeSlot, index, $event)"
              @mouseup="handleMouseUp(activeValue != null)"
              @mousemove="handleMouseMove(activeValue != null, timeSlot, index)"
              @contextmenu.prevent="handleRightClick(activeValue != null, timeSlot, index)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <el-dialog v-model="studentVisible" title="新增班级禁排" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addStudentForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="组合名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入组合名称" v-model="addStudentForm.name" />
      </el-form-item>
      <div style="display: flex; gap: 10px">
        <el-form-item label="禁排周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addStudentForm.weekStart"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option v-for="week in 18" :key="week" :label="week" :value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addStudentForm.weekEnd"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option v-for="week in 18" :key="week" :label="week" :value="week"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="选择班级" prop="classes">
        <el-cascader
          style="width: 300px"
          placeholder="请选择班级（多选）"
          v-model="addStudentForm.classes"
          filterable
          :options="classOptions"
          :props="optionClass"
          clearable
        />
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input-number
          v-model="addStudentForm.priority"
          :min="1"
          :max="10"
          style="width: 140px"
        />
        <span class="priority-tip">（1-10，数字越大优先级越高）</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleAdd" color="#547bf1" plain>新增</el-button>
        <el-button @click="studentVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getDepartmentsAPI, getClassesAPI } from '@/apis/classMajor'
const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
  },
})

// 数据定义
const studentVisible = ref(false)
const selectedArr = ref([])
const activeValue = ref(null)
const studentList = ref(props.allContent.studentProhibition || [])
const classOptions = ref([])
let optionClass = ref()
const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

// 表单数据
const addStudentForm = ref({
  name: '',
  weekStart: '',
  weekEnd: '',
  classes: [],
  priority: 1,
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入组合名称', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  classes: [{ required: true, message: '请选择班级', trigger: 'blur' }],
  priority: [{ required: true, message: '请设置优先级', trigger: 'blur' }],
}

// 初始化数据
onMounted(async () => {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  classOptions.value = JSON.parse(JSON.stringify(nodes))
  // 获取班级选项数据
  await getClassOptions()
})

// 获取班级选项
const getClassOptions = async () => {
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

// 搜索处理
const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    studentList.value = props.allContent.studentProhibition || []
    return
  }

  studentList.value = (props.allContent.studentProhibition || []).filter(item => {
    return (
      (item.subject1[0] === selectedArr.value[0] && item.subject1[1] === selectedArr.value[1]) ||
      (item.subject2[0] === selectedArr.value[0] && item.subject2[1] === selectedArr.value[1])
    )
  })
}

// 选中班级组
const activeBoxClick = index => {
  activeValue.value = index
}

// 删除班级
const deleteClassClick = (item, tag) => {
  item.classes = item.classes.filter(cls => cls[1] !== tag[1])
}

// 删除班级组
const deleteGroup = index => {
  studentList.value.splice(index, 1)
  activeValue.value = null
  ElMessage.success('删除成功！')
}

// 编辑班级组
const editGroup = index => {
  const item = studentList.value[index]
  addStudentForm.value = {
    name: item.name,
    weekStart: item.weekStart,
    weekEnd: item.weekEnd,
    classes: [...item.classes],
    priority: item.priority,
  }
  studentVisible.value = true
}

// 新增班级组
const handleAdd = () => {
  if (
    !addStudentForm.value.name ||
    !addStudentForm.value.weekStart ||
    !addStudentForm.value.weekEnd ||
    addStudentForm.value.classes.length === 0
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  studentList.value.push({
    name: addStudentForm.value.name,
    weekStart: addStudentForm.value.weekStart,
    weekEnd: addStudentForm.value.weekEnd,
    classes: addStudentForm.value.classes,
    priority: addStudentForm.value.priority,
    prohibitedSlots: [],
  })

  studentVisible.value = false
  activeValue.value = studentList.value.length - 1
  ElMessage.success('新增成功！')

  // 重置表单
  addStudentForm.value = {
    name: '',
    weekStart: '',
    weekEnd: '',
    classes: [],
    priority: 1,
  }
}

// 课表格子相关方法
const isMouseDown = ref(false)
const startCell = ref(null)

const isCellRed = (timeSlot, day) => {
  if (!studentList.value[activeValue.value]) return false
  return studentList.value[activeValue.value].prohibitedSlots.some(
    slot => slot.timeSlot === timeSlot && slot.day === day,
  )
}

const handleMouseDown = (flag, timeSlot, day, event) => {
  if (!flag) {
    ElMessage.warning('请先选择分组')
    return
  }
  isMouseDown.value = true
  startCell.value = { timeSlot, day }
  handleCellClick(timeSlot, day, event.button === 2)
}

const handleMouseUp = canEdit => {
  if (!canEdit) return
  isMouseDown.value = false
  startCell.value = null
}

const handleMouseMove = (canEdit, timeSlot, day) => {
  if (!canEdit || !isMouseDown.value) return
  handleCellClick(timeSlot, day, false)
}

const handleRightClick = (canEdit, timeSlot, day) => {
  if (!canEdit) return
  handleCellClick(timeSlot, day, true)
}

const handleCellClick = (timeSlot, day, isRemove) => {
  if (activeValue.value === null) return

  const currentClass = studentList.value[activeValue.value]
  if (isRemove) {
    currentClass.prohibitedSlots = currentClass.prohibitedSlots.filter(
      slot => !(slot.timeSlot === timeSlot && slot.day === day),
    )
  } else {
    if (
      !currentClass.prohibitedSlots.some(slot => slot.timeSlot === timeSlot && slot.day === day)
    ) {
      currentClass.prohibitedSlots.push({ timeSlot, day })
    }
  }
}

watch(
  studentList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      studentProhibition: newValue,
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

          .class-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 8px 0;
          }

          .priority-info {
            margin-top: 5px;
            color: #666;
            font-size: 14px;

            .priority-num {
              color: #409eff;
              font-weight: bold;
              font-size: 16px;
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
    flex: 2;
    table {
      border-collapse: collapse;
      border-spacing: 0;
      border-radius: 10px;
      width: 100%;
      overflow: hidden;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      tr:first-child th:first-child {
        border-top-left-radius: 10px;
      }

      tr:first-child th:last-child {
        border-top-right-radius: 10px;
      }

      tr:last-child td:first-child {
        border-bottom-left-radius: 10px;
      }

      tr:last-child td:last-child {
        border-bottom-right-radius: 10px;
      }

      th,
      td {
        text-align: center;
        padding: 6px;
        border-top: none;
        border-left: none;
      }
      th {
        padding: 16px;
        background-color: #f2f5ff;
      }
      td {
        width: 12.8%;
        border: 1px solid #e0e0e0;
      }
      .cell {
        margin: 10px;
      }
      .time-slot {
        border: none;
        width: 10%;
        background-color: #f2f5ff;
        padding: 16px 10px;
        font-size: 16px;
      }
      .red-bg {
        background-color: $red;
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

.priority-tip {
  margin-left: 10px;
  color: #999;
  font-size: 13px;
}
</style>
