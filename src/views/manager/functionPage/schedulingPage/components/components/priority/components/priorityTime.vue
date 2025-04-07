<template>
  <div class="priority-time">
    <div class="wow animate__fadeInLeft warn-box">
      <span class="iconfont icon-icon-gantanhao"></span>
      时间片优先：不同优先级规则可以设置在不同的时间片优先排课，高优先级的时间片将会优先被使用
    </div>

    <div class="priority-container">
      <div class="priority-left">
        <div class="priority-select">
          <el-select v-model="selectedRule" placeholder="请选择优先规则" style="width: 240px">
            <el-option
              v-for="item in priorityRules"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="priority-boxes">
          <div
            class="priority-box"
            v-for="(priority, index) in priorities"
            :key="priority.level"
            :class="{ 'active-box': index === activePriority }"
            @click="handlePriorityClick(index)"
          >
            <div class="priority-info">
              <div class="priority-title">{{ priority.name }}</div>
              <div class="priority-desc">优先级: {{ priority.level }}</div>
            </div>
            <div class="priority-color" :style="{ backgroundColor: priority.color }"></div>
          </div>
        </div>
      </div>

      <div class="priority-right">
        <div class="wow animate__fadeInLeft warn-box">
          <span class="iconfont icon-icon-gantanhao"></span>
          鼠标 [ 左击 ]：指定优先级时间片 | 鼠标 [ 右击 ]：取消已指定的时间片
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
                :style="getCellStyle(timeSlot, index)"
                @mousedown="handleMouseDown(timeSlot, index, $event)"
                @mouseup="handleMouseUp"
                @mousemove="handleMouseMove(timeSlot, index)"
                @contextmenu.prevent="handleRightClick(timeSlot, index)"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  allContent: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:allContent'])

// 优先规则选项
const priorityRules = [
  { label: '学生院系优先', value: 'studentDepartment' },
  { label: '开课院系优先', value: 'lessonDepartment' },
  { label: '课程性质优先', value: 'lessonNature' },
  { label: '学时类型优先', value: 'creditHourType' },
  { label: '课程类型优先', value: 'lessonType' },
]

const selectedRule = ref('')
const activePriority = ref(null)
const days = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']

// 优先级定义
const priorities = [
  { level: 1, name: '低优先级', color: '#7dc15b' },
  { level: 2, name: '中优先级', color: '#e6a23c' },
  { level: 3, name: '高优先级', color: '#f56c6c' },
]

// 时间片数据结构
const timeSlotData = ref(
  props.allContent?.priorityTime || {
    studentDepartment: {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    },
    lessonDepartment: {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    },
    lessonNature: {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    },
    creditHourType: {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    },
    lessonType: {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    },
  },
)

// 监听props变化，更新本地数据
watch(
  () => props.allContent,
  newValue => {
    if (newValue && newValue.priorityTime) {
      timeSlotData.value = newValue.priorityTime
    }
  },
  { deep: true, immediate: true },
)

// 鼠标拖动相关
const isMouseDown = ref(false)
const startCell = ref(null)
const endCell = ref(null)
const isRightMouseDown = ref(false)

// 处理优先级点击
const handlePriorityClick = index => {
  if (selectedRule.value == '') {
    ElMessage.warning('请先选择优先规则!')
    return
  }

  // 检查选中的规则是否有对应优先级的内容
  const rule = selectedRule.value
  const priorityLevel = ['lowPriority', 'middlePriority', 'highPriority'][index]

  // 检查对应规则下是否有该优先级的内容
  if (
    !props.allContent[rule] ||
    !props.allContent[rule][priorityLevel] ||
    props.allContent[rule][priorityLevel].length === 0
  ) {
    ElMessage.warning(`当前规则下没有${priorities[index].name}的内容，请先设置优先级内容!`)
    return
  }

  activePriority.value = index
  ElMessage.success(`已选择${priorities[index].name}，请在时间表中设置时间段`)
}

// 获取单元格样式
const getCellStyle = (timeSlot, day) => {
  if (!selectedRule.value) return {}
  const rule = selectedRule.value
  let style = {}

  // 检查是否在当前选择的矩形区域内
  if (isMouseDown.value && startCell.value && endCell.value && activePriority.value !== null) {
    const startTimeSlot = Math.min(startCell.value.timeSlot, endCell.value.timeSlot)
    const endTimeSlot = Math.max(startCell.value.timeSlot, endCell.value.timeSlot)
    const startDay = Math.min(startCell.value.day, endCell.value.day)
    const endDay = Math.max(startCell.value.day, endCell.value.day)

    if (timeSlot >= startTimeSlot && timeSlot <= endTimeSlot && day >= startDay && day <= endDay) {
      const priority = priorities[activePriority.value]
      const opacity = isRightMouseDown.value ? 0.1 : 0.5
      style.backgroundColor = `${priority.color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`
    }
  }

  // 检查每个优先级是否有该时间片
  for (let index = 0; index < priorities.length; index++) {
    const priorityLevel = ['lowPriority', 'middlePriority', 'highPriority'][index]

    // 确保该优先级的数据存在
    if (!timeSlotData.value[rule] || !timeSlotData.value[rule][priorityLevel]) {
      continue
    }

    const slots = timeSlotData.value[rule][priorityLevel]

    // 已经设置的时间片
    if (slots && slots.some(slot => slot.timeSlot === timeSlot && slot.day === day)) {
      const priority = priorities[index]
      style.backgroundColor = `${priority.color}80` // 50% opacity
      break // 只应用最高优先级的颜色
    }
  }

  return style
}

// 处理鼠标事件
const handleMouseDown = (timeSlot, day, event) => {
  if (selectedRule.value == '' || activePriority.value == null) {
    ElMessage.warning('请先选择优先规则和优先级!')
    return
  }

  // 判断是左键还是右键
  if (event.button === 2) {
    isRightMouseDown.value = true
  } else {
    isMouseDown.value = true
  }

  startCell.value = { timeSlot, day }
  endCell.value = { timeSlot, day }

  // 如果是单击，直接处理单元格
  if (event.button === 0) {
    handleCellClick(timeSlot, day, false)
  }
}

const handleMouseUp = () => {
  if (!isMouseDown.value && !isRightMouseDown.value) return

  const startTimeSlot = Math.min(startCell.value.timeSlot, endCell.value.timeSlot)
  const endTimeSlot = Math.max(startCell.value.timeSlot, endCell.value.timeSlot)
  const startDay = Math.min(startCell.value.day, endCell.value.day)
  const endDay = Math.max(startCell.value.day, endCell.value.day)

  // 处理矩形区域内的所有单元格
  for (let timeSlot = startTimeSlot; timeSlot <= endTimeSlot; timeSlot++) {
    for (let day = startDay; day <= endDay; day++) {
      handleCellClick(timeSlot, day, isRightMouseDown.value)
    }
  }

  isMouseDown.value = false
  isRightMouseDown.value = false
  startCell.value = null
  endCell.value = null
}

const handleMouseMove = (timeSlot, day) => {
  if (!isMouseDown.value && !isRightMouseDown.value) return
  endCell.value = { timeSlot, day }
}

const handleRightClick = (timeSlot, day) => {
  if (selectedRule.value == '' || activePriority.value == null) {
    ElMessage.warning('请先选择优先规则和优先级!')
    return
  }
  handleCellClick(timeSlot, day, true)
}

const handleCellClick = (timeSlot, day, isRemove) => {
  if (!selectedRule.value || activePriority.value === null) return

  const rule = selectedRule.value
  const priority = ['lowPriority', 'middlePriority', 'highPriority'][activePriority.value]

  // 确保数据结构存在
  if (!timeSlotData.value[rule]) {
    timeSlotData.value[rule] = {
      lowPriority: [],
      middlePriority: [],
      highPriority: [],
    }
  }

  if (!timeSlotData.value[rule][priority]) {
    timeSlotData.value[rule][priority] = []
  }

  // 如果是移除操作，直接移除该时间片
  if (isRemove) {
    timeSlotData.value[rule][priority] = timeSlotData.value[rule][priority].filter(
      slot => !(slot.timeSlot === timeSlot && slot.day === day),
    )
    return
  }

  // 如果是添加操作，需要先移除其他优先级的时间片
  priorities.forEach((_, index) => {
    const otherPriority = ['lowPriority', 'middlePriority', 'highPriority'][index]
    if (otherPriority !== priority) {
      if (!timeSlotData.value[rule][otherPriority]) {
        timeSlotData.value[rule][otherPriority] = []
      }

      timeSlotData.value[rule][otherPriority] = timeSlotData.value[rule][otherPriority].filter(
        slot => !(slot.timeSlot === timeSlot && slot.day === day),
      )
    }
  })

  // 添加新的时间片
  const slots = timeSlotData.value[rule][priority]
  if (!slots.some(slot => slot.timeSlot === timeSlot && slot.day === day)) {
    slots.push({ timeSlot, day })
  }

  // 强制更新视图
  timeSlotData.value = { ...timeSlotData.value }
}

// 监听数据变化
watch(
  timeSlotData,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      priorityTime: newValue,
    })
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.priority-time {
  .priority-container {
    display: flex;
    gap: 20px;

    .priority-left {
      flex: 1;

      .priority-select {
        margin-bottom: 16px;
      }

      .priority-boxes {
        .priority-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 8px;
          border: 1px solid #dcdfe6;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            background-color: #f5f7fa;
          }

          .priority-info {
            .priority-title {
              font-weight: 500;
              margin-bottom: 4px;
            }

            .priority-desc {
              font-size: 12px;
              color: #909399;
            }
          }

          .priority-color {
            width: 24px;
            height: 24px;
            border-radius: 4px;
          }
        }

        .active-box {
          background-color: #f5f7fa;
          border-color: #409eff;
        }
      }
    }

    .priority-right {
      flex: 2;

      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        border-radius: 10px;
        overflow: hidden;
        user-select: none;

        th,
        td {
          text-align: center;
          padding: 6px;
          border: 1px solid #e0e0e0;
          position: relative;
          height: 40px;
        }

        th {
          padding: 16px;
          background-color: #f2f5ff;
        }

        .time-slot {
          border: none;
          background-color: #f2f5ff;
          padding: 16px 10px;
          font-size: 16px;
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
