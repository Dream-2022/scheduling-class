<template>
  <div class="lesson-department">
    <div class="wow animate__fadeInLeft warn-box">
      <span class="iconfont icon-icon-gantanhao"></span>
      开课院系优先：优先级更高的开课院系将会优先排课，可以搭配优先级时间片（不同优先级院系可以设置不同时间片优先排课）
    </div>

    <!-- 操作按钮组 -->
    <div class="operation-buttons">
      <el-button-group>
        <el-button
          color="#7dc15b"
          @click="moveToLow"
          plain
          :disabled="!selectedMiddleItems.length && !selectedHighItems.length"
        >
          <el-icon><BottomLeft /></el-icon>
          移至低优先级
        </el-button>
        <el-button
          @click="moveToMiddle"
          color="#e6a23c"
          plain
          :disabled="!selectedLowItems.length && !selectedHighItems.length"
        >
          <el-icon><Position /></el-icon>
          移至中优先级
        </el-button>
        <el-button
          @click="moveToHigh"
          color="#f56c6c"
          plain
          :disabled="!selectedLowItems.length && !selectedMiddleItems.length"
        >
          <el-icon><TopRight /></el-icon>
          移至高优先级
        </el-button>
      </el-button-group>
    </div>

    <div class="priority-panels">
      <!-- 低优先级面板 -->
      <div class="priority-panel">
        <div class="panel-header">
          <span class="header-title">低优先级</span>
          <el-tag type="success" class="count-tag">{{ filteredLowPriorityData.length }}</el-tag>
        </div>
        <el-input
          v-model="searchLow"
          placeholder="搜索开课院系"
          class="search-input"
          :prefix-icon="Search"
          style="width: 410px"
          clearable
        />
        <el-scrollbar height="300px">
          <el-checkbox-group v-model="selectedLowItems" @change="handleLowPriorityChange">
            <el-checkbox
              v-for="item in filteredLowPriorityData"
              :key="item.key"
              :value="item.key"
              class="checkbox-item"
            >
              {{ item.label }}
              <span class="item-initial">({{ item.initial }})</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </div>

      <!-- 中优先级面板 -->
      <div class="priority-panel">
        <div class="panel-header">
          <span class="header-title">中优先级</span>
          <el-tag type="warning" class="count-tag">{{ filteredMiddlePriorityData.length }}</el-tag>
        </div>
        <el-input
          v-model="searchMiddle"
          placeholder="搜索开课院系"
          class="search-input"
          style="width: 410px"
          :prefix-icon="Search"
          clearable
        />
        <el-scrollbar height="300px">
          <el-checkbox-group v-model="selectedMiddleItems" @change="handleMiddlePriorityChange">
            <el-checkbox
              v-for="item in filteredMiddlePriorityData"
              :key="item.key"
              :value="item.key"
              class="checkbox-item"
            >
              {{ item.label }}
              <span class="item-initial">({{ item.initial }})</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </div>

      <!-- 高优先级面板 -->
      <div class="priority-panel">
        <div class="panel-header">
          <span class="header-title">高优先级</span>
          <el-tag type="danger" class="count-tag">{{ filteredHighPriorityData.length }}</el-tag>
        </div>
        <el-input
          v-model="searchHigh"
          style="width: 410px"
          placeholder="搜索开课院系"
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
        <el-scrollbar height="300px">
          <el-checkbox-group v-model="selectedHighItems" @change="handleHighPriorityChange">
            <el-checkbox
              v-for="item in filteredHighPriorityData"
              :key="item.key"
              :value="item.key"
              class="checkbox-item"
            >
              {{ item.label }}
              <span class="item-initial">({{ item.initial }})</span>
            </el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits } from 'vue'
import { getDepartmentsAPI } from '@/apis/classMajor'
import { Search, Position, TopRight, BottomLeft } from '@element-plus/icons-vue'

const props = defineProps({
  allContent: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:allContent'])

// 搜索关键词
const searchLow = ref('')
const searchMiddle = ref('')
const searchHigh = ref('')

// 修改为使用priorityList
const priorityList = ref(
  props.allContent.lessonDepartment || {
    lowPriority: [],
    middlePriority: [],
    highPriority: [],
  },
)

const departmentList = ref([])
onMounted(async () => {
  const res = await getDepartmentsAPI()
  departmentList.value = res.data.data.map(item => ({
    label: item.name,
    key: item.departmentId,
    initial: item.departmentId,
  }))

  if (
    !props.allContent.lessonDepartment ||
    !props.allContent.lessonDepartment.lowPriority ||
    !props.allContent.lessonDepartment.lowPriority.length
  ) {
    priorityList.value.lowPriority = departmentList.value.map(item => item.key)
    priorityList.value.middlePriority = []
    priorityList.value.highPriority = []
  }
})

// 过滤后的数据
const filteredLowPriorityData = computed(() => {
  if (priorityList.value.lowPriority == undefined) {
    return []
  }
  return departmentList.value
    .filter(item => priorityList.value.lowPriority.includes(item.key))
    .filter(
      item =>
        item.label.toLowerCase().includes(searchLow.value.toLowerCase()) ||
        item.initial.toLowerCase().includes(searchLow.value.toLowerCase()),
    )
})

const filteredMiddlePriorityData = computed(() => {
  if (priorityList.value.middlePriority == undefined) {
    return []
  }
  return departmentList.value
    .filter(item => priorityList.value.middlePriority.includes(item.key))
    .filter(
      item =>
        item.label.toLowerCase().includes(searchMiddle.value.toLowerCase()) ||
        item.initial.toLowerCase().includes(searchMiddle.value.toLowerCase()),
    )
})

const filteredHighPriorityData = computed(() => {
  if (priorityList.value.highPriority == undefined) {
    return []
  }
  return departmentList.value
    .filter(item => priorityList.value.highPriority.includes(item.key))
    .filter(
      item =>
        item.label.toLowerCase().includes(searchHigh.value.toLowerCase()) ||
        item.initial.toLowerCase().includes(searchHigh.value.toLowerCase()),
    )
})

// 被选中的项
const selectedLowItems = ref([])
const selectedMiddleItems = ref([])
const selectedHighItems = ref([])

// 处理选中变化
const handleLowPriorityChange = value => {
  selectedLowItems.value = value
}

const handleMiddlePriorityChange = value => {
  selectedMiddleItems.value = value
}

const handleHighPriorityChange = value => {
  selectedHighItems.value = value
}

// 移动数据的方法
const moveToMiddle = () => {
  const itemsToMove = [...selectedLowItems.value, ...selectedHighItems.value]
  priorityList.value.lowPriority = priorityList.value.lowPriority.filter(
    key => !selectedLowItems.value.includes(key),
  )
  priorityList.value.highPriority = priorityList.value.highPriority.filter(
    key => !selectedHighItems.value.includes(key),
  )
  priorityList.value.middlePriority = [...priorityList.value.middlePriority, ...itemsToMove]
  selectedLowItems.value = []
  selectedHighItems.value = []
}

const moveToHigh = () => {
  console.log(priorityList.value)
  const itemsToMove = [...selectedLowItems.value, ...selectedMiddleItems.value]
  priorityList.value.lowPriority = priorityList.value.lowPriority.filter(
    key => !selectedLowItems.value.includes(key),
  )
  priorityList.value.middlePriority = priorityList.value.middlePriority.filter(
    key => !selectedMiddleItems.value.includes(key),
  )
  priorityList.value.highPriority = [...priorityList.value.highPriority, ...itemsToMove]
  selectedLowItems.value = []
  selectedMiddleItems.value = []
}

const moveToLow = () => {
  const itemsToMove = [...selectedMiddleItems.value, ...selectedHighItems.value]
  priorityList.value.middlePriority = priorityList.value.middlePriority.filter(
    key => !selectedMiddleItems.value.includes(key),
  )
  priorityList.value.highPriority = priorityList.value.highPriority.filter(
    key => !selectedHighItems.value.includes(key),
  )
  priorityList.value.lowPriority = [...priorityList.value.lowPriority, ...itemsToMove]
  selectedMiddleItems.value = []
  selectedHighItems.value = []
}

// 添加数据监听
watch(
  priorityList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      lessonDepartment: newValue,
    })
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.lesson-department {
  .priority-panels {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    .priority-panel {
      flex: 1;
      border: 1px solid #dcdfe6;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      .panel-header {
        padding: 12px 15px;
        border-bottom: 1px solid #dcdfe6;
        background-color: #f5f7fa;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-title {
          font-weight: 600;
          color: #303133;
        }

        .count-tag {
          font-size: 12px;
        }
      }

      .search-input {
        margin: 12px;

        :deep(.el-input__wrapper) {
          box-shadow: 0 0 0 1px #dcdfe6 inset;
        }
      }

      .checkbox-item {
        margin: 8px 15px;
        padding: 12px 10px;
        padding-bottom: 0;
        display: block;

        .item-initial {
          color: #909399;
          font-size: 12px;
          margin-left: 4px;
        }

        &:hover {
          background-color: #f5f7fa;
          border-radius: 4px;
        }
      }
    }
  }

  .operation-buttons {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 12px;

    .el-button-group {
      .el-button {
        padding: 12px 20px;

        .el-icon {
          margin-right: 6px;
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

:deep(.el-scrollbar__wrap) {
  padding-bottom: 16px;
}
</style>
