<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">我的教学班级</div>
        <div style="margin-left: 20px; margin-right: 20px">>></div>
        <div>
          <span
            class="list"
            :class="navigationValue ? 'list-active' : ''"
            @click="navigationClick(true)"
            >本学期班级</span
          >
          <span
            class="list"
            :class="!navigationValue ? 'list-active' : ''"
            @click="navigationClick(false)"
            >历史班级</span
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
          navigationValue ? '本学期班级' : '历史班级'
        }}</strong></el-divider
      >

      <!-- 班级概览卡片 -->
      <el-card class="class-overview" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>班级概览</span>
          </div>
        </template>
        <div class="overview-content">
          <div class="overview-item">
            <div class="item-value">{{ classStats.totalClasses }}</div>
            <div class="item-label">总班级数</div>
          </div>
          <div class="overview-item">
            <div class="item-value">{{ classStats.totalStudents }}</div>
            <div class="item-label">总学生数</div>
          </div>
          <div class="overview-item">
            <div class="item-value">{{ classStats.thisWeekClasses }}</div>
            <div class="item-label">本周课程数</div>
          </div>
        </div>
      </el-card>

      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          clearable
          style="height: 32px; max-width: 350px"
          placeholder="请输入班级名称或课程名称"
          :prefix-icon="Search"
        />
        <el-select v-model="filterSemester" clearable placeholder="选择学期" style="width: 200px">
          <el-option label="全部学期" value="" />
          <el-option label="2023-2024学年第一学期" value="2023-1" />
          <el-option label="2023-2024学年第二学期" value="2023-2" />
          <el-option label="2024-2025学年第一学期" value="2024-1" />
        </el-select>
        <el-select v-model="filterStatus" clearable placeholder="班级状态" style="width: 120px">
          <el-option label="全部状态" value="" />
          <el-option label="进行中" value="active" />
          <el-option label="已结束" value="completed" />
          <el-option label="未开始" value="upcoming" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="searchClasses"
        >
          搜索
        </el-button>
      </div>

      <!-- 班级列表 -->
      <el-table
        :data="filteredClasses"
        style="width: 100%"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column prop="className" label="班级名称" min-width="150" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" />
        <el-table-column prop="semester" label="学期" width="180" />
        <el-table-column prop="studentCount" label="学生人数" width="100" align="center" />
        <el-table-column prop="schedule" label="上课时间" min-width="150" />
        <el-table-column prop="classroom" label="教室" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click.stop="viewClassDetails(scope.row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 班级详情抽屉 -->
  <el-drawer v-model="drawerVisible" :show-close="false" size="500px">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">班级详情</h4>
      <el-button color="#f56c6c" plain :icon="CloseBold" circle @click="close" />
    </template>
    <div v-if="selectedClass" class="class-details">
      <div class="detail-section">
        <div class="detail-title">基本信息</div>
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">班级名称：</span>
            <span class="detail-value">{{ selectedClass.className }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">课程名称：</span>
            <span class="detail-value">{{ selectedClass.courseName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">学期：</span>
            <span class="detail-value">{{ selectedClass.semester }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">学生人数：</span>
            <span class="detail-value">{{ selectedClass.studentCount }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">上课时间：</span>
            <span class="detail-value">{{ selectedClass.schedule }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">教室：</span>
            <span class="detail-value">{{ selectedClass.classroom }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">课程简介：</span>
            <span class="detail-value">{{ selectedClass.description || '暂无简介' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">学生名单</div>
        <div class="detail-content">
          <el-table :data="selectedClass.students" style="width: 100%" size="small" border>
            <el-table-column prop="studentId" label="学号" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="gender" label="性别" width="80" />
            <el-table-column prop="attendance" label="出勤率" width="100">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.attendance"
                  :color="getAttendanceColor(scope.row.attendance)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="lastAttendance" label="最近出勤" />
          </el-table>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">课程资料</div>
        <div class="detail-content">
          <div class="resource-list">
            <div
              v-for="(material, index) in selectedClass.materials"
              :key="index"
              class="resource-item"
            >
              <el-icon><Document /></el-icon>
              <span class="resource-name">{{ material.name }}</span>
              <el-button type="primary" link @click="downloadMaterial(material)">下载</el-button>
            </div>
          </div>
          <el-empty v-if="selectedClass.materials.length === 0" description="暂无课程资料" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, CloseBold, Document } from '@element-plus/icons-vue'

// 导航状态
const navigationValue = ref(true) // true为本学期，false为历史

// 班级统计数据
const classStats = ref({
  totalClasses: 4,
  totalStudents: 165,
  thisWeekClasses: 8,
  averageAttendance: 92,
})

// 搜索和筛选
const searchQuery = ref('')
const filterSemester = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalClasses = ref(0)

// 模拟班级数据
const classes = ref([
  {
    id: 1,
    className: '计算机科学与技术2021-1班',
    courseName: '数字绘画',
    semester: '2023-2024学年第一学期',
    studentCount: 45,
    schedule: '周一 1-2节',
    classroom: 'XDNY2#209',
    status: 'active',
    description: '本课程介绍基本数据结构和算法，包括线性表、栈、队列、树、图等数据结构及其应用。',
    students: [
      {
        studentId: '2021001',
        name: '张三',
        gender: '男',
        attendance: 95,
        lastAttendance: '2023-10-15',
      },
      {
        studentId: '2021002',
        name: '李四',
        gender: '女',
        attendance: 88,
        lastAttendance: '2023-10-15',
      },
      {
        studentId: '2021003',
        name: '王五',
        gender: '男',
        attendance: 92,
        lastAttendance: '2023-10-15',
      },
      {
        studentId: '2021004',
        name: '赵六',
        gender: '女',
        attendance: 100,
        lastAttendance: '2023-10-15',
      },
      {
        studentId: '2021005',
        name: '钱七',
        gender: '男',
        attendance: 85,
        lastAttendance: '2023-10-15',
      },
    ],
    materials: [
      { id: 1, name: '数据结构课程大纲.pdf', uploadTime: '2023-09-01 10:30' },
      { id: 2, name: '第一章 绪论.pptx', uploadTime: '2023-09-05 14:20' },
      { id: 3, name: '第二章 线性表.pdf', uploadTime: '2023-09-12 09:15' },
      { id: 4, name: '实验指导书.docx', uploadTime: '2023-09-15 16:45' },
    ],
  },
  {
    id: 2,
    className: '人工智能2023-2班',
    courseName: '数字绘画',
    semester: '2023-2024学年第一学期',
    studentCount: 42,
    schedule: '周二 3-4节',
    classroom: 'XXJS3#301',
    status: 'active',
    description: '本课程介绍基本数据结构和算法，包括线性表、栈、队列、树、图等数据结构及其应用。',
    students: [
      {
        studentId: '2021006',
        name: '孙八',
        gender: '男',
        attendance: 90,
        lastAttendance: '2023-10-16',
      },
      {
        studentId: '2021007',
        name: '周九',
        gender: '女',
        attendance: 93,
        lastAttendance: '2023-10-16',
      },
      {
        studentId: '2021008',
        name: '吴十',
        gender: '男',
        attendance: 87,
        lastAttendance: '2023-10-16',
      },
      {
        studentId: '2021009',
        name: '郑十一',
        gender: '女',
        attendance: 96,
        lastAttendance: '2023-10-16',
      },
      {
        studentId: '2021010',
        name: '王十二',
        gender: '男',
        attendance: 89,
        lastAttendance: '2023-10-16',
      },
    ],
    materials: [
      { id: 5, name: '数据结构课程大纲.pdf', uploadTime: '2023-09-01 10:30' },
      { id: 6, name: '第一章 绪论.pptx', uploadTime: '2023-09-05 14:20' },
      { id: 7, name: '第二章 线性表.pdf', uploadTime: '2023-09-12 09:15' },
      { id: 8, name: '实验指导书.docx', uploadTime: '2023-09-15 16:45' },
    ],
  },
  {
    id: 3,
    className: '人工智能2023-1班',
    courseName: '数字绘画',
    semester: '2023-2024学年第一学期',
    studentCount: 38,
    schedule: '周三 5-6节',
    classroom: 'XDNY1#110',
    status: 'active',
    description:
      '本课程介绍人工智能的基本概念、理论和方法，包括机器学习、深度学习、自然语言处理等内容。',
    students: [
      {
        studentId: '2021011',
        name: '李十三',
        gender: '男',
        attendance: 94,
        lastAttendance: '2023-10-17',
      },
      {
        studentId: '2021012',
        name: '张十四',
        gender: '女',
        attendance: 91,
        lastAttendance: '2023-10-17',
      },
      {
        studentId: '2021013',
        name: '王十五',
        gender: '男',
        attendance: 88,
        lastAttendance: '2023-10-17',
      },
      {
        studentId: '2021014',
        name: '赵十六',
        gender: '女',
        attendance: 97,
        lastAttendance: '2023-10-17',
      },
      {
        studentId: '2021015',
        name: '钱十七',
        gender: '男',
        attendance: 92,
        lastAttendance: '2023-10-17',
      },
    ],
    materials: [
      { id: 9, name: '人工智能导论课程大纲.pdf', uploadTime: '2023-09-01 11:30' },
      { id: 10, name: '第一章 人工智能概述.pptx', uploadTime: '2023-09-06 15:20' },
      { id: 11, name: '第二章 机器学习基础.pdf', uploadTime: '2023-09-13 10:15' },
      { id: 12, name: '实验指导书.docx', uploadTime: '2023-09-16 17:45' },
    ],
  },
  {
    id: 4,
    className: '计算机科学与技术2022-2班',
    courseName: '数字绘画',
    semester: '2023-2024学年第一学期',
    studentCount: 40,
    schedule: '周四 1-2节',
    classroom: 'XDNY2#209',
    status: 'active',
    description:
      '本课程介绍操作系统的基本概念、原理和实现技术，包括进程管理、内存管理、文件系统等内容。',
    students: [
      {
        studentId: '2020016',
        name: '孙十八',
        gender: '男',
        attendance: 93,
        lastAttendance: '2023-10-18',
      },
      {
        studentId: '2020017',
        name: '周十九',
        gender: '女',
        attendance: 90,
        lastAttendance: '2023-10-18',
      },
      {
        studentId: '2020018',
        name: '吴二十',
        gender: '男',
        attendance: 95,
        lastAttendance: '2023-10-18',
      },
      {
        studentId: '2020019',
        name: '郑二一',
        gender: '女',
        attendance: 89,
        lastAttendance: '2023-10-18',
      },
      {
        studentId: '2020020',
        name: '王二二',
        gender: '男',
        attendance: 96,
        lastAttendance: '2023-10-18',
      },
    ],
    materials: [
      { id: 13, name: '操作系统课程大纲.pdf', uploadTime: '2023-09-02 09:30' },
      { id: 14, name: '第一章 操作系统概述.pptx', uploadTime: '2023-09-07 13:20' },
      { id: 15, name: '第二章 进程管理.pdf', uploadTime: '2023-09-14 11:15' },
      { id: 16, name: '实验指导书.docx', uploadTime: '2023-09-17 15:45' },
    ],
  },
])

// 抽屉相关
const drawerVisible = ref(false)
const selectedClass = ref(null)

// 计算筛选后的班级列表
const filteredClasses = computed(() => {
  let result = [...classes.value]

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      item =>
        item.className.toLowerCase().includes(query) ||
        item.courseName.toLowerCase().includes(query),
    )
  }

  // 学期过滤
  if (filterSemester.value) {
    result = result.filter(item => item.semester === filterSemester.value)
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 更新总数（避免在computed中产生副作用）
const updateTotalClasses = () => {
  let result = [...classes.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      item =>
        item.className.toLowerCase().includes(query) ||
        item.courseName.toLowerCase().includes(query),
    )
  }

  if (filterSemester.value) {
    result = result.filter(item => item.semester === filterSemester.value)
  }

  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value)
  }

  totalClasses.value = result.length
}

// 获取状态类型
const getStatusType = status => {
  switch (status) {
    case 'active':
      return 'success'
    case 'completed':
      return 'info'
    case 'upcoming':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = status => {
  switch (status) {
    case 'active':
      return '进行中'
    case 'completed':
      return '已结束'
    case 'upcoming':
      return '未开始'
    default:
      return '未知'
  }
}

// 获取出勤率颜色
const getAttendanceColor = attendance => {
  if (attendance >= 90) return '#67C23A'
  if (attendance >= 80) return '#E6A23C'
  return '#F56C6C'
}

// 处理行点击
const handleRowClick = row => {
  selectedClass.value = row
  drawerVisible.value = true
}

// 查看班级详情
const viewClassDetails = row => {
  selectedClass.value = row
  drawerVisible.value = true
}

// 下载资料
const downloadMaterial = material => {
  ElMessage.success(`下载资料: ${material.name}`)
  // 这里可以实现下载资料的逻辑
}

// 切换本学期/历史班级视图
const navigationClick = value => {
  navigationValue.value = value
  // 实际项目中应该根据选择重新获取数据
  refreshData()
}

// 搜索班级
const searchClasses = () => {
  updateTotalClasses()
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
  updateTotalClasses()
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

// 班级概览样式
.class-overview {
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

// 班级详情样式
.class-details {
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

      .resource-list {
        .resource-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .el-icon {
            margin-right: 10px;
            color: #409eff;
          }

          .resource-name {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>
