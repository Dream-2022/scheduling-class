<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">教室查询</div>
        <div style="margin-left: 20px; margin-right: 20px">>></div>
        <div>
          <span
            class="list"
            :class="navigationValue ? 'list-active' : ''"
            @click="navigationClick(true)"
            >当前教室</span
          >
          <span
            class="list"
            :class="!navigationValue ? 'list-active' : ''"
            @click="navigationClick(false)"
            >历史记录</span
          >
        </div>
        <div class="middle-button">
          <el-button color="#368eec" @click="refreshData" style="margin-bottom: 10px">
            刷新数据
            <el-icon class="el-icon--right"><Refresh /></el-icon>
          </el-button>
        </div>
      </div>
      <el-divider content-position="center"
        ><strong style="font-size: 17px; color: #4d4d4d">{{
          navigationValue ? '当前教室' : '历史记录'
        }}</strong></el-divider
      >

      <!-- 教室概览卡片 -->
      <el-card class="classroom-overview" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>教室概览</span>
          </div>
        </template>
        <div class="overview-content">
          <div class="overview-item">
            <div class="item-value">{{ classroomStats.totalClassrooms }}</div>
            <div class="item-label">总教室数</div>
          </div>
          <div class="overview-item">
            <div class="item-value">{{ classroomStats.availableClassrooms }}</div>
            <div class="item-label">空闲教室</div>
          </div>
          <div class="overview-item">
            <div class="item-value">{{ classroomStats.occupiedClassrooms }}</div>
            <div class="item-label">已占用教室</div>
          </div>
          <div class="overview-item">
            <div class="item-value">{{ classroomStats.maintenanceClassrooms }}</div>
            <div class="item-label">维护中教室</div>
          </div>
        </div>
      </el-card>

      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          clearable
          style="height: 32px; max-width: 350px"
          placeholder="请输入教室名称或编号"
          :prefix-icon="Search"
        />
        <el-select v-model="filterType" clearable placeholder="教室类型" style="width: 150px">
          <el-option label="全部类型" value="" />
          <el-option label="普通教室" value="normal" />
          <el-option label="多媒体教室" value="multimedia" />
          <el-option label="实验室" value="lab" />
          <el-option label="机房" value="computer" />
        </el-select>
        <el-select v-model="filterStatus" clearable placeholder="使用状态" style="width: 150px">
          <el-option label="全部状态" value="" />
          <el-option label="空闲" value="available" />
          <el-option label="即将空闲" value="soon" />
          <el-option label="已占用" value="occupied" />
          <el-option label="维护中" value="maintenance" />
        </el-select>
        <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px">
          <el-option label="距离从近到远" value="distance" />
          <el-option label="容量从大到小" value="capacity" />
          <el-option label="空闲时间从长到短" value="freeTime" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="searchClassrooms"
        >
          搜索
        </el-button>
      </div>

      <!-- 教室列表 -->
      <el-table
        :data="filteredClassrooms"
        style="width: 100%"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column prop="name" label="教室名称" min-width="120" />
        <el-table-column prop="type" label="教室类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)" size="small">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="capacity" label="容量" width="100" align="center" />
        <el-table-column prop="location" label="位置" min-width="150" />
        <el-table-column prop="distance" label="距离" width="100" align="center">
          <template #default="scope"> {{ scope.row.distance }}米 </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="freeTime" label="空闲时间" min-width="150">
          <template #default="scope">
            <div v-if="scope.row.status === 'available'" class="free-time available">空闲</div>
            <div v-else-if="scope.row.status === 'soon'" class="free-time soon">
              {{ scope.row.freeTimeText }}
            </div>
            <div v-else class="free-time occupied">
              {{ scope.row.freeTimeText }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="viewClassroomDetails(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 教室详情抽屉 -->
  <el-drawer v-model="drawerVisible" :show-close="false" size="500px">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">教室详情</h4>
      <el-button color="#f56c6c" plain :icon="CloseBold" circle @click="close" />
    </template>
    <div v-if="selectedClassroom" class="classroom-details">
      <div class="detail-section">
        <div class="detail-title">基本信息</div>
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">教室名称：</span>
            <span class="detail-value">{{ selectedClassroom.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">教室类型：</span>
            <span class="detail-value">
              <el-tag :type="getTypeTag(selectedClassroom.type)" size="small">
                {{ getTypeText(selectedClassroom.type) }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">容量：</span>
            <span class="detail-value">{{ selectedClassroom.capacity }}人</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">位置：</span>
            <span class="detail-value">{{ selectedClassroom.location }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">距离：</span>
            <span class="detail-value">{{ selectedClassroom.distance }}米</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态：</span>
            <span class="detail-value">
              <el-tag :type="getStatusType(selectedClassroom.status)" size="small">
                {{ getStatusText(selectedClassroom.status) }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">空闲时间：</span>
            <span class="detail-value">
              <div v-if="selectedClassroom.status === 'available'" class="free-time available">
                空闲
              </div>
              <div v-else-if="selectedClassroom.status === 'soon'" class="free-time soon">
                {{ selectedClassroom.freeTimeText }}
              </div>
              <div v-else class="free-time occupied">
                {{ selectedClassroom.freeTimeText }}
              </div>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">设备信息：</span>
            <span class="detail-value">{{ selectedClassroom.equipment || '无' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">今日课程安排</div>
        <div class="detail-content">
          <el-timeline>
            <el-timeline-item
              v-for="(schedule, index) in selectedClassroom.schedules"
              :key="index"
              :type="getScheduleType(schedule.status)"
              :color="getScheduleColor(schedule.status)"
              :timestamp="schedule.time"
              placement="top"
            >
              <div class="schedule-item">
                <div class="schedule-course">{{ schedule.course }}</div>
                <div class="schedule-class">{{ schedule.class }}</div>
                <div class="schedule-teacher">{{ schedule.teacher }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="selectedClassroom.schedules.length === 0" description="今日无课程安排" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, CloseBold } from '@element-plus/icons-vue'

// 导航状态
const navigationValue = ref(true) // true为当前教室，false为历史记录

// 教室统计数据
const classroomStats = ref({
  totalClassrooms: 391,
  availableClassrooms: 78,
  occupiedClassrooms: 313,
  maintenanceClassrooms: 11,
})

// 搜索和筛选
const searchQuery = ref('')
const filterType = ref('')
const filterStatus = ref('')
const sortBy = ref('distance')
const currentPage = ref(1)
const pageSize = ref(10)
const totalClassrooms = ref(0)

// 模拟教室数据
const classrooms = ref([
  {
    id: 1,
    name: 'XDNY1#101',
    type: 'normal',
    capacity: 50,
    location: '信息学院1号楼1层',
    distance: 120,
    status: 'available',
    freeTime: 0,
    freeTimeText: '空闲',
    equipment: '投影仪、黑板、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '高等数学',
        class: '计算机科学2101',
        teacher: '张教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '大学英语',
        class: '计算机科学2102',
        teacher: '李教授',
        status: 'completed',
      },
      {
        time: '14:00-15:40',
        course: '数据结构',
        class: '软件工程2101',
        teacher: '王教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 2,
    name: 'XDNY1#102',
    type: 'multimedia',
    capacity: 80,
    location: '信息学院1号楼1层',
    distance: 150,
    status: 'occupied',
    freeTime: 30,
    freeTimeText: '30分钟后空闲',
    equipment: '多媒体设备、投影仪、音响、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '计算机导论',
        class: '人工智能2101',
        teacher: '赵教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '程序设计基础',
        class: '计算机科学2101',
        teacher: '钱教授',
        status: 'completed',
      },
      {
        time: '14:00-15:40',
        course: '操作系统',
        class: '软件工程2102',
        teacher: '孙教授',
        status: 'current',
      },
      {
        time: '16:00-17:40',
        course: '计算机网络',
        class: '计算机科学2102',
        teacher: '周教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 3,
    name: 'XDNY1#103',
    type: 'lab',
    capacity: 40,
    location: '信息学院1号楼1层',
    distance: 180,
    status: 'soon',
    freeTime: 10,
    freeTimeText: '10分钟后空闲',
    equipment: '实验台、显微镜、投影仪、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '物理实验',
        class: '计算机科学2101',
        teacher: '吴教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '化学实验',
        class: '软件工程2101',
        teacher: '郑教授',
        status: 'current',
      },
      {
        time: '14:00-15:40',
        course: '生物实验',
        class: '人工智能2101',
        teacher: '王教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 4,
    name: 'XDNY2#201',
    type: 'computer',
    capacity: 60,
    location: '信息学院2号楼2层',
    distance: 250,
    status: 'available',
    freeTime: 0,
    freeTimeText: '空闲',
    equipment: '电脑、投影仪、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '程序设计实验',
        class: '计算机科学2101',
        teacher: '李教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '数据结构实验',
        class: '软件工程2101',
        teacher: '张教授',
        status: 'completed',
      },
      {
        time: '14:00-15:40',
        course: '操作系统实验',
        class: '计算机科学2102',
        teacher: '王教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 5,
    name: 'XDNY2#202',
    type: 'multimedia',
    capacity: 100,
    location: '信息学院2号楼2层',
    distance: 280,
    status: 'maintenance',
    freeTime: 0,
    freeTimeText: '维护中',
    equipment: '多媒体设备、投影仪、音响、空调',
    schedules: [],
  },
  {
    id: 6,
    name: 'XXJS3#301',
    type: 'normal',
    capacity: 50,
    location: '信息学院3号楼3层',
    distance: 350,
    status: 'available',
    freeTime: 0,
    freeTimeText: '空闲',
    equipment: '投影仪、黑板、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '高等数学',
        class: '软件工程2101',
        teacher: '赵教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '大学英语',
        class: '人工智能2101',
        teacher: '钱教授',
        status: 'completed',
      },
      {
        time: '14:00-15:40',
        course: '数据结构',
        class: '计算机科学2101',
        teacher: '孙教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 7,
    name: 'XXJS3#302',
    type: 'lab',
    capacity: 30,
    location: '信息学院3号楼3层',
    distance: 380,
    status: 'occupied',
    freeTime: 45,
    freeTimeText: '45分钟后空闲',
    equipment: '实验台、显微镜、投影仪、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '物理实验',
        class: '软件工程2101',
        teacher: '周教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '化学实验',
        class: '人工智能2101',
        teacher: '吴教授',
        status: 'completed',
      },
      {
        time: '14:00-15:40',
        course: '生物实验',
        class: '计算机科学2101',
        teacher: '郑教授',
        status: 'current',
      },
      {
        time: '16:00-17:40',
        course: '物理实验',
        class: '软件工程2102',
        teacher: '王教授',
        status: 'upcoming',
      },
    ],
  },
  {
    id: 8,
    name: 'XXJS3#303',
    type: 'computer',
    capacity: 50,
    location: '信息学院3号楼3层',
    distance: 400,
    status: 'soon',
    freeTime: 15,
    freeTimeText: '15分钟后空闲',
    equipment: '电脑、投影仪、空调',
    schedules: [
      {
        time: '08:00-09:40',
        course: '程序设计实验',
        class: '人工智能2101',
        teacher: '李教授',
        status: 'completed',
      },
      {
        time: '10:00-11:40',
        course: '数据结构实验',
        class: '计算机科学2101',
        teacher: '张教授',
        status: 'current',
      },
      {
        time: '14:00-15:40',
        course: '操作系统实验',
        class: '软件工程2101',
        teacher: '王教授',
        status: 'upcoming',
      },
    ],
  },
])

// 抽屉相关
const drawerVisible = ref(false)
const selectedClassroom = ref(null)

// 计算筛选后的教室列表
const filteredClassrooms = computed(() => {
  let result = [...classrooms.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.name.toLowerCase().includes(query))
  }

  // 类型过滤
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  // 排序处理
  if (sortBy.value === 'distance') {
    result.sort((a, b) => a.distance - b.distance)
  } else if (sortBy.value === 'capacity') {
    result.sort((a, b) => b.capacity - a.capacity)
  } else if (sortBy.value === 'freeTime') {
    result.sort((a, b) => {
      if (a.status === 'available' && b.status !== 'available') return -1
      if (a.status !== 'available' && b.status === 'available') return 1
      if (a.status === 'available' && b.status === 'available') return 0
      return b.freeTime - a.freeTime
    })
  }

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 更新总数（避免在computed中产生副作用）
const updateTotalClassrooms = () => {
  let result = [...classrooms.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.name.toLowerCase().includes(query))
  }

  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }

  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  totalClassrooms.value = result.length
}

// 获取教室类型标签
const getTypeTag = type => {
  switch (type) {
    case 'normal':
      return ''
    case 'multimedia':
      return 'success'
    case 'lab':
      return 'warning'
    case 'computer':
      return 'info'
    default:
      return ''
  }
}

// 获取教室类型文本
const getTypeText = type => {
  switch (type) {
    case 'normal':
      return '普通教室'
    case 'multimedia':
      return '多媒体教室'
    case 'lab':
      return '实验室'
    case 'computer':
      return '机房'
    default:
      return '未知'
  }
}

// 获取状态类型
const getStatusType = status => {
  switch (status) {
    case 'available':
      return 'success'
    case 'soon':
      return 'warning'
    case 'occupied':
      return 'info'
    case 'maintenance':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = status => {
  switch (status) {
    case 'available':
      return '空闲'
    case 'soon':
      return '即将空闲'
    case 'occupied':
      return '已占用'
    case 'maintenance':
      return '维护中'
    default:
      return '未知'
  }
}

// 获取课程安排类型
const getScheduleType = status => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'current':
      return 'primary'
    case 'upcoming':
      return 'info'
    default:
      return 'info'
  }
}

// 获取课程安排颜色
const getScheduleColor = status => {
  switch (status) {
    case 'completed':
      return '#67C23A'
    case 'current':
      return '#409EFF'
    case 'upcoming':
      return '#909399'
    default:
      return '#909399'
  }
}

// 处理行点击
const handleRowClick = row => {
  selectedClassroom.value = row
  drawerVisible.value = true
}

// 查看教室详情
const viewClassroomDetails = row => {
  selectedClassroom.value = row
  drawerVisible.value = true
}

// 切换当前教室/历史记录视图
const navigationClick = value => {
  navigationValue.value = value
  // 实际项目中应该根据选择重新获取数据
  refreshData()
}

// 搜索教室
const searchClassrooms = () => {
  updateTotalClassrooms()
  currentPage.value = 1
  ElMessage.success('搜索成功')
}

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')
  // 这里可以实现刷新数据的逻辑
}

// 页面加载时初始化数据
onMounted(() => {
  updateTotalClassrooms()
})
</script>

<style lang="scss" scoped>
.white-box {
  width: 90%;
  min-width: 600px;
  margin: 25px auto;
  padding-bottom: 50px;
  position: relative;
  background-color: #fff;
  padding-top: 5px;
  border-radius: 10px;
  box-shadow: 0px 6px 10px 3px rgba(0, 0, 0, 0.1);

  .middle-box {
    color: $word-black-color;
    width: 95%;
    margin: 20px auto;

    .title-box {
      display: flex;
      line-height: 30px;
      margin-bottom: 30px;

      .middle-title {
        font-weight: 600;
        font-size: 18px;
      }

      .middle-button {
        margin-left: auto;
        margin-right: 20px;
      }

      .list {
        cursor: pointer;
        font-size: 16px;
        display: inline-block;
        color: $grey;
        width: 85px;
      }

      .list-active {
        color: $title-color;
        text-decoration: underline;
      }
    }
  }
}

// 教室概览样式
.classroom-overview {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .overview-content {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;

    .overview-item {
      text-align: center;

      .item-value {
        font-size: 24px;
        font-weight: bold;
        color: #409eff;
        margin-bottom: 5px;
      }

      .item-label {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}

// 搜索区域样式
.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

// 分页样式
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 空闲时间样式
.free-time {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  &.available {
    background-color: #f0f9eb;
    color: #67c23a;
  }

  &.soon {
    background-color: #fdf6ec;
    color: #e6a23c;
  }

  &.occupied {
    background-color: #f4f4f5;
    color: #909399;
  }
}

// 教室详情样式
.classroom-details {
  padding: 0 20px;

  .detail-section {
    margin-bottom: 25px;

    .detail-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
    }

    .detail-content {
      .detail-item {
        display: flex;
        margin-bottom: 10px;

        .detail-label {
          width: 100px;
          color: #606266;
        }

        .detail-value {
          color: #303133;
          font-weight: 500;
        }
      }

      .schedule-item {
        .schedule-course {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .schedule-class,
        .schedule-teacher {
          font-size: 12px;
          color: #909399;
          margin-bottom: 3px;
        }
      }
    }
  }
}
</style>
