<template>
  <div class="activity-container">
    <div class="activity-left">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        教研活动：教师在指定课程节次不上课
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
        >
        </el-cascader>
        <el-button color="#547bf1" plain style="margin-right: auto" :icon="Search">搜索</el-button>
        <el-button color="#547bf1" :icon="Plus" @click="teacherVisible = true">新增分组</el-button>
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
            <div class="title">{{ item.name }}</div>
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
          </div>
          <div class="activity-box-right">
            <el-button color="#f56c6c" plain>删除</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="activity-right">
      <div class="wow animate__fadeInLeft warn-box">
        <span class="iconfont icon-icon-gantanhao"></span>
        鼠标 [ 左击 ]：指定课程节次不上课；鼠标 [ 右击 ]：取消己指定的课程节次
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
  <el-dialog v-model="teacherVisible" title="新增教师分组" width="500">
    <div class="dialog-body">
      <el-form
        ref="ruleFormRef"
        :model="addTeacherForm"
        :rules="rules"
        label-width="auto"
        status-icon
      >
        <el-form-item label="分组名称" prop="name">
          <el-input
            style="width: 300px"
            placeholder="请输入分组名称"
            v-model="addTeacherForm.name"
          />
        </el-form-item>
        <el-form-item label="选择教师" prop="teachers">
          <el-cascader
            style="width: 300px"
            placeholder="请选择教师"
            v-model="addTeacherForm.teachers"
            filterable
            :options="TeacherOptions"
            :props="option"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addClick" color="#547bf1" plain>新增</el-button>
        <el-button @click="teacherVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { getTeacherAndStudentAPI } from '@/apis/person'
import { getDepartmentsAPI } from '@/apis/classMajor'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
let option = ref() //筛选框选项
const selectedArr = ref('') //选中的内容
const TeacherOptions = ref([])
const teacherVisible = ref(false) //弹出是否可见
const ruleFormRef = ref() //表单验证
const teacherList = ref([]) //教师分组列表
const addTeacherForm = ref({
  name: '',
  teachers: [],
})
const isDragging = ref(false) //记录左键是否拖拽
const isRightDrag = ref(false) //记录右键是否拖拽
const startRow = ref(null)
const startCol = ref(null)
const activeValue = ref(null) //当前选择的分组
const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

onMounted(async () => {
  getOptions() //设置选择框option
  initContentList()
})
// 初始化 contentList
const initContentList = () => {
  let contentList = []
  for (let i = 1; i <= 8; i++) {
    contentList[i] = []
    for (let j = 0; j < days.length; j++) {
      contentList[i][j] = false
    }
  }
  return contentList
}

//获取信息,设置选择框option
async function getOptions() {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  TeacherOptions.value = nodes
  option.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      //获取教师
      console.log(selectedPath[0], selectedPath)
      const res = await getTeacherAndStudentAPI('', '', selectedPath[0], '', 1, 100)
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
const isCellRed = (row, col) => {
  return (
    teacherList.value[activeValue.value].contentList[row] &&
    teacherList.value[activeValue.value].contentList[row][col]
  )
}

// 处理鼠标按下事件
const handleMouseDown = (flag, row, col, event) => {
  if (!flag) {
    ElMessage.warning('请先选择分组')
    return
  }
  try {
    if (event.button === 2) {
      isRightDrag.value = true
      startRow.value = row
      startCol.value = col
      toggleCellColor(row, col)
    } else {
      isDragging.value = true
      startRow.value = row
      startCol.value = col
      toggleCellColor(row, col)
    }
  } catch (error) {
    console.error('handleMouseDown 函数出错:', error)
  }
}
// 处理鼠标抬起事件
const handleMouseUp = flag => {
  if (!flag) {
    return
  }
  isDragging.value = false
  isRightDrag.value = false
}
// 处理鼠标移动事件
const handleMouseMove = (flag, row, col) => {
  if (!flag) {
    return
  }
  if (isDragging.value) {
    const minRow = Math.min(startRow.value, row)
    const maxRow = Math.max(startRow.value, row)
    const minCol = Math.min(startCol.value, col)
    const maxCol = Math.max(startCol.value, col)

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        teacherList.value[activeValue.value].contentList[i][j] = true
      }
    }
  } else if (isRightDrag.value) {
    const minRow = Math.min(startRow.value, row)
    const maxRow = Math.max(startRow.value, row)
    const minCol = Math.min(startCol.value, col)
    const maxCol = Math.max(startCol.value, col)

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        teacherList.value[activeValue.value].contentList[i][j] = false
      }
    }
  }
}

// 处理右键点击事件
const handleRightClick = (flag, row, col) => {
  if (!flag) {
    return
  }
  teacherList.value[activeValue.value].contentList[row][col] = false
}

// 切换单元格颜色
const toggleCellColor = (row, col) => {
  teacherList.value[activeValue.value].contentList[row][col] =
    !teacherList.value[activeValue.value].contentList[row][col]
}

//点击分组
function activeBoxClick(index) {
  activeValue.value = index
}

//新增教师分组
function addClick() {
  teacherList.value.push(JSON.parse(JSON.stringify(addTeacherForm.value)))
  addTeacherForm.value = {
    name: '',
    teachers: [],
  }
  ElMessage.success('添加成功！')
  teacherVisible.value = false

  //将acitve指定为当前新增的分组
  activeValue.value = teacherList.value.length - 1
  teacherList.value[activeValue.value].contentList = initContentList()
  console.log(teacherList.value)
  console.log(teacherList.value[activeValue.value])
}
//删除分组中的某个老师
function deleteTeacherClick(item, tag) {
  item.teachers = item.teachers.filter(d => d[1] != tag[1])
  if (item.teachers.length == 0) {
    teacherList.value = teacherList.value.filter(d => d.name != item.name)
  }
  ElMessage.success('删除成功！')
}

// 表单验证规则
const rules = ref({
  name: [{ required: true, message: '分组名称不能为空', trigger: 'blur' }],
})
</script>
<style lang="scss" scoped>
.activity-container {
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
          }
          .teacher-list {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;

            .el-tag {
              padding: 1px 4px;
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
  margin: 0 0 10px 0;
  border-radius: 5px;
  border: 1px solid #ffdb9e;

  .iconfont::before {
    font-size: 16px;
  }
}
</style>
