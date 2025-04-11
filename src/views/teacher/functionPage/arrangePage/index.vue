<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">近日行程</div>
        <div style="margin-left: 20px; margin-right: 20px">>></div>
        <div>
          <span
            class="list"
            :class="navigationValue ? 'list-active' : ''"
            @click="navigationClick(true)"
            >本周行程</span
          >
          <span
            class="list"
            :class="!navigationValue ? 'list-active' : ''"
            @click="navigationClick(false)"
            >近期行程</span
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
          navigationValue ? '本周行程' : '近期行程'
        }}</strong></el-divider
      >

      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          clearable
          style="height: 32px; max-width: 350px"
          placeholder="请输入课程名称或班级"
          :prefix-icon="Search"
        />
        <el-select v-model="searchDay" clearable placeholder="选择星期" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="周一" value="1" />
          <el-option label="周二" value="2" />
          <el-option label="周三" value="3" />
          <el-option label="周四" value="4" />
          <el-option label="周五" value="5" />
          <el-option label="周六" value="6" />
          <el-option label="周日" value="7" />
        </el-select>
        <el-select v-model="searchStatus" clearable placeholder="选择状态" style="width: 120px">
          <el-option label="全部" value="" />
          <el-option label="已上课" value="completed" />
          <el-option label="待上课" value="pending" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="searchSchedule"
        >
          搜索
        </el-button>
      </div>

      <!-- 时间线展示 -->
      <div class="timeline-container">
        <el-timeline>
          <el-timeline-item
            v-for="(day, index) in groupedSchedule"
            :key="index"
            :type="getTimelineItemType(day.day)"
            :color="getTimelineItemColor(day.day)"
            :timestamp="getWeekDay(day.day)"
            placement="top"
            :hollow="day.day === getCurrentDay()"
          >
            <el-card class="timeline-card">
              <template #header>
                <div class="timeline-header">
                  <span>{{ getWeekDay(day.day) }}课程安排</span>
                  <el-tag :type="day.day === getCurrentDay() ? 'success' : 'info'">
                    {{ day.courses.length }}节课
                  </el-tag>
                </div>
              </template>
              <div class="timeline-content">
                <div v-if="day.courses.length > 0">
                  <div
                    v-for="(course, courseIndex) in day.courses"
                    :key="courseIndex"
                    class="course-item"
                  >
                    <div class="course-time">
                      <el-tag
                        size="small"
                        :type="course.status === 'completed' ? 'success' : 'warning'"
                      >
                        {{ course.timeStart }}-{{ course.timeEnd }}节
                      </el-tag>
                    </div>
                    <div class="course-info">
                      <div class="course-name">{{ course.courseName }}</div>
                      <div class="course-detail">
                        {{ course.teachingClassName }} | {{ course.classroomName }}
                      </div>
                      <div class="course-week">{{ course.weekRange }}</div>
                    </div>
                    <div class="course-action">
                      <el-button type="primary" size="small" @click="viewCourseDetail(course)" text>
                        详情
                      </el-button>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="当日无课程安排" />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>

  <!-- 课程详情抽屉 -->
  <el-drawer v-model="detailVisible" :show-close="false" size="500px">
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">课程详情</h4>
      <el-button color="#f56c6c" plain :icon="CloseBold" circle @click="close" />
    </template>
    <div class="course-detail" v-if="currentCourse">
      <div class="detail-section">
        <div class="detail-title">基本信息</div>
        <div class="detail-content">
          <div class="detail-item">
            <span class="detail-label">课程名称：</span>
            <span class="detail-value">{{ currentCourse.courseName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">教学班级：</span>
            <span class="detail-value">{{ currentCourse.teachingClassName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">上课时间：</span>
            <span class="detail-value">
              {{ getWeekDay(currentCourse.day) }} {{ currentCourse.timeStart }}-{{
                currentCourse.timeEnd
              }}节
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">上课地点：</span>
            <span class="detail-value">{{ currentCourse.classroomName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">周次：</span>
            <span class="detail-value">{{ currentCourse.weekRange }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">学生名单</div>
        <div class="detail-content">
          <el-table :data="studentList" style="width: 100%" size="small">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="studentId" label="学号" />
          </el-table>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">课程资料</div>
        <div class="detail-content">
          <div class="resource-list">
            <div v-for="(resource, index) in courseResources" :key="index" class="resource-item">
              <el-icon><Document /></el-icon>
              <span class="resource-name">{{ resource.name }}</span>
              <el-button type="primary" link @click="downloadResource(resource)">下载</el-button>
            </div>
          </div>
          <el-empty v-if="courseResources.length === 0" description="暂无课程资料" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { Search, Refresh, CloseBold, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const navigationValue = ref(true) // true为本周，false为下周
const searchKeyword = ref('')
const searchDay = ref('')
const searchStatus = ref('')
const detailVisible = ref(false)
const currentCourse = ref(null)

// 模拟数据 - 实际项目中应该从API获取
const scheduleData = ref([
  {
    day: 1,
    timeStart: 1,
    timeEnd: 2,
    courseName: '高等数学',
    teachingClassName: '计算机科学2101',
    classroomName: 'JXL3#308',
    weekRange: '1-16周',
    status: 'completed',
  },
  {
    day: 1,
    timeStart: 3,
    timeEnd: 4,
    courseName: '大学英语',
    teachingClassName: '计算机科学2102',
    classroomName: 'JXL2#205',
    weekRange: '1-16周',
    status: 'pending',
  },
  {
    day: 2,
    timeStart: 1,
    timeEnd: 2,
    courseName: '计算机导论',
    teachingClassName: '计算机科学2101',
    classroomName: 'JXL3#308',
    weekRange: '1-16周',
    status: 'completed',
  },
  {
    day: 2,
    timeStart: 3,
    timeEnd: 4,
    courseName: '程序设计基础',
    teachingClassName: '计算机科学2102',
    classroomName: 'JXL2#205',
    weekRange: '1-16周',
    status: 'pending',
  },
  {
    day: 3,
    timeStart: 1,
    timeEnd: 2,
    courseName: '高等数学',
    teachingClassName: '计算机科学2101',
    classroomName: 'JXL3#308',
    weekRange: '1-16周',
    status: 'completed',
  },
  {
    day: 3,
    timeStart: 3,
    timeEnd: 4,
    courseName: '大学英语',
    teachingClassName: '计算机科学2102',
    classroomName: 'JXL2#205',
    weekRange: '1-16周',
    status: 'pending',
  },
  {
    day: 4,
    timeStart: 1,
    timeEnd: 2,
    courseName: '计算机导论',
    teachingClassName: '计算机科学2101',
    classroomName: 'JXL3#308',
    weekRange: '1-16周',
    status: 'completed',
  },
  {
    day: 4,
    timeStart: 3,
    timeEnd: 4,
    courseName: '程序设计基础',
    teachingClassName: '计算机科学2102',
    classroomName: 'JXL2#205',
    weekRange: '1-16周',
    status: 'pending',
  },
  {
    day: 5,
    timeStart: 1,
    timeEnd: 2,
    courseName: '高等数学',
    teachingClassName: '计算机科学2101',
    classroomName: 'JXL3#308',
    weekRange: '1-16周',
    status: 'completed',
  },
  {
    day: 5,
    timeStart: 3,
    timeEnd: 4,
    courseName: '大学英语',
    teachingClassName: '计算机科学2102',
    classroomName: 'JXL2#205',
    weekRange: '1-16周',
    status: 'pending',
  },
])

const studentList = ref([
  { name: '张三', studentId: '2021001' },
  { name: '李四', studentId: '2021002' },
  { name: '王五', studentId: '2021003' },
  { name: '赵六', studentId: '2021004' },
  { name: '钱七', studentId: '2021005' },
])

const courseResources = ref([
  { name: '高等数学教学大纲.pdf', url: '#' },
  { name: '第一章课件.pptx', url: '#' },
  { name: '习题集.pdf', url: '#' },
])

// 获取当前是星期几（1-7）
const getCurrentDay = () => {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
}

// 根据筛选条件过滤课程表
const filteredSchedule = computed(() => {
  let result = [...scheduleData.value]

  // 按关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      item =>
        item.courseName.toLowerCase().includes(keyword) ||
        item.teachingClassName.toLowerCase().includes(keyword),
    )
  }

  // 按星期筛选
  if (searchDay.value) {
    result = result.filter(item => item.day === parseInt(searchDay.value))
  }

  // 按状态筛选
  if (searchStatus.value) {
    result = result.filter(item => item.status === searchStatus.value)
  }

  return result
})

// 按天分组课程表
const groupedSchedule = computed(() => {
  const filtered = filteredSchedule.value
  const days = [1, 2, 3, 4, 5, 6, 7]

  return days.map(day => {
    const courses = filtered.filter(item => item.day === day)
    return {
      day,
      courses,
    }
  })
})

// 获取时间线项目类型
const getTimelineItemType = day => {
  if (day === getCurrentDay()) return 'primary'
  if (day < getCurrentDay()) return 'success'
  return 'info'
}

// 获取时间线项目颜色
const getTimelineItemColor = day => {
  if (day === getCurrentDay()) return '#409EFF'
  if (day < getCurrentDay()) return '#67C23A'
  return '#909399'
}

// 获取星期几
const getWeekDay = day => {
  if (day === 1) return '周一'
  if (day === 2) return '周二'
  if (day === 3) return '周三'
  if (day === 4) return '周四'
  if (day === 5) return '周五'
  if (day === 6) return '周六'
  if (day === 7) return '周日'
}

// 切换本周/下周视图
const navigationClick = value => {
  navigationValue.value = value
  // 实际项目中应该根据选择重新获取数据
  refreshData()
}

// 搜索课程表
const searchSchedule = () => {
  // 实际项目中可能需要调用API重新获取数据
  ElMessage.success('搜索成功')
}

// 查看课程详情
const viewCourseDetail = course => {
  currentCourse.value = course
  detailVisible.value = true
  // 实际项目中应该根据课程ID获取学生名单和课程资料
}

// 下载课程资料
const downloadResource = resource => {
  ElMessage.success(`开始下载: ${resource.name}`)
  // 实际项目中应该调用下载API
}

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')
  // 实际项目中应该调用API重新获取数据
}

onMounted(() => {
  // 实际项目中应该调用API获取初始数据
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

// 搜索区域样式
.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

// 时间线样式
.timeline-container {
  margin-top: 20px;

  .timeline-card {
    border-radius: 8px;

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .timeline-content {
      .course-item {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .course-time {
          width: 80px;
        }

        .course-info {
          flex: 1;

          .course-name {
            font-weight: 500;
            margin-bottom: 5px;
          }

          .course-detail {
            font-size: 12px;
            color: #909399;
            margin-bottom: 5px;
          }

          .course-week {
            font-size: 12px;
            color: #409eff;
          }
        }

        .course-action {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

// 课程详情样式
.course-detail {
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
