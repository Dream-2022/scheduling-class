<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        教师禁排：教师在指定时间段不参与监考
      </div>
      <div class="activity-search">
        <el-cascader
          placeholder="请筛选教师"
          v-model="selectedArr"
          filterable
          style="margin-right: 10px; width: 240px"
          :options="teacherOptions"
          :props="optionTeacher"
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
        <el-button color="#547bf1" :icon="Plus" @click="teacherVisible = true"
          >教师组禁排</el-button
        >
      </div>
      <div class="activity-boxes">
        <div
          class="activity-box"
          v-for="(item, index) in teacherList"
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
            <div class="teacher-list">
              <el-tag
                v-for="tag in item.teachers"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="deleteTeacherClick(item, tag)"
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
        <el-empty v-if="teacherList.length === 0" description="暂无数据，请新增分组" />
      </div>
    </div>
    <div class="activity-right">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        鼠标 [ 左击 ]：指定时间段不监考：鼠标 [ 右击 ]：取消已指定的时间段
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

  <el-dialog v-model="teacherVisible" title="新增教师禁排" width="500">
    <el-form
      ref="ruleFormRef"
      :model="addTeacherForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="组合名称" prop="name">
        <el-input style="width: 300px" placeholder="请输入组合名称" v-model="addTeacherForm.name" />
      </el-form-item>
      <div style="display: flex; gap: 10px">
        <el-form-item label="禁排周次" prop="weekStart">
          <el-select
            style="width: 145px"
            placeholder="请选择开始周次"
            v-model="addTeacherForm.weekStart"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option v-for="week in 18" :key="week" :label="week" :value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="weekEnd">
          <el-select
            style="width: 145px"
            placeholder="请选择结束周次"
            v-model="addTeacherForm.weekEnd"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option v-for="week in 18" :key="week" :label="week" :value="week"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="选择教师" prop="teachers">
        <el-cascader
          style="width: 300px"
          placeholder="请选择教师（多选）"
          v-model="addTeacherForm.teachers"
          filterable
          :options="teacherOptions"
          :props="optionTeacher"
          clearable
        />
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input-number
          v-model="addTeacherForm.priority"
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
        <el-button @click="teacherVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getTeacherAndStudentAPI } from '@/apis/person'
import { getDepartmentsAPI } from '@/apis/classMajor'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
    default: () => ({}),
  },
})

// 数据定义
const teacherVisible = ref(false)
const selectedArr = ref([])
const activeValue = ref(null)
const teacherList = ref(props.allContent.teacherDisabled || [])
const teacherOptions = ref([])
let optionTeacher = ref()
const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

// 表单数据
const addTeacherForm = ref({
  name: '',
  weekStart: '',
  weekEnd: '',
  teachers: [],
  priority: 1,
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入组合名称', trigger: 'blur' }],
  weekStart: [{ required: true, message: '请选择开始周次', trigger: 'blur' }],
  weekEnd: [{ required: true, message: '请选择结束周次', trigger: 'blur' }],
  teachers: [{ required: true, message: '请选择教师', trigger: 'blur' }],
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
  teacherOptions.value = JSON.parse(JSON.stringify(nodes))
  await getTeacherOptions()
})

// 获取教师选项
const getTeacherOptions = async () => {
  optionTeacher.value = {
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

// 搜索处理
const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    teacherList.value = props.allContent.teacherDisabled || []
    return
  }

  teacherList.value = (props.allContent.teacherDisabled || []).filter(item => {
    return item.teachers.some(teacher => {
      return teacher[0] === selectedArr.value[0] && teacher[1] === selectedArr.value[1]
    })
  })
}

// 选中教师组
const activeBoxClick = index => {
  activeValue.value = index
}

// 删除教师
const deleteTeacherClick = (item, tag) => {
  item.teachers = item.teachers.filter(teacher => teacher[1] !== tag[1])
}

// 删除教师组
const deleteGroup = index => {
  teacherList.value.splice(index, 1)
  activeValue.value = null
  ElMessage.success('删除成功！')
}

// 编辑教师组
const editGroup = index => {
  const item = teacherList.value[index]
  addTeacherForm.value = {
    name: item.name,
    weekStart: item.weekStart,
    weekEnd: item.weekEnd,
    teachers: [...item.teachers],
    priority: item.priority,
  }
  teacherVisible.value = true
}

// 新增教师组
const handleAdd = () => {
  if (
    !addTeacherForm.value.name ||
    !addTeacherForm.value.weekStart ||
    !addTeacherForm.value.weekEnd ||
    addTeacherForm.value.teachers.length === 0
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  teacherList.value.push({
    name: addTeacherForm.value.name,
    weekStart: addTeacherForm.value.weekStart,
    weekEnd: addTeacherForm.value.weekEnd,
    teachers: addTeacherForm.value.teachers,
    priority: addTeacherForm.value.priority,
    prohibitedSlots: [],
  })

  teacherVisible.value = false
  activeValue.value = teacherList.value.length - 1
  ElMessage.success('新增成功！')

  // 重置表单
  addTeacherForm.value = {
    name: '',
    weekStart: '',
    weekEnd: '',
    teachers: [],
    priority: 1,
  }
}

// 课表格子相关方法
const isMouseDown = ref(false)
const startCell = ref(null)

const isCellRed = (timeSlot, day) => {
  if (!teacherList.value[activeValue.value]) return false
  return teacherList.value[activeValue.value].prohibitedSlots.some(
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

  const currentTeacher = teacherList.value[activeValue.value]
  if (isRemove) {
    currentTeacher.prohibitedSlots = currentTeacher.prohibitedSlots.filter(
      slot => !(slot.timeSlot === timeSlot && slot.day === day),
    )
  } else {
    if (
      !currentTeacher.prohibitedSlots.some(slot => slot.timeSlot === timeSlot && slot.day === day)
    ) {
      currentTeacher.prohibitedSlots.push({ timeSlot, day })
    }
  }
}

watch(
  teacherList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      teacherDisabled: newValue,
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

          .teacher-list {
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
        background-color: #f56c6c;
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
