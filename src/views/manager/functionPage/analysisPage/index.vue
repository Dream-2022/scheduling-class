<template>
  <div class="analysis-container">
    <div class="analysis-header">
      <h2>排课平台数据分析</h2>
      <div class="time-filter">
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="semester">本学期</el-radio-button>
          <el-radio-button label="year">本学年</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="data-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <div class="card-title">总课程数</div>
            <div class="card-value">1,286</div>
            <div class="card-trend">
              <span class="trend-up">↑ 12.5%</span>
              <span class="trend-text">较上期</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <div class="card-title">教室利用率</div>
            <div class="card-value">78.3%</div>
            <div class="card-trend">
              <span class="trend-up">↑ 5.2%</span>
              <span class="trend-text">较上期</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <div class="card-title">教师平均课时</div>
            <div class="card-value">16.8</div>
            <div class="card-trend">
              <span class="trend-down">↓ 2.1%</span>
              <span class="trend-text">较上期</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="data-card">
            <div class="card-title">系统访问量</div>
            <div class="card-value">3,245</div>
            <div class="card-trend">
              <span class="trend-up">↑ 18.7%</span>
              <span class="trend-text">较上期</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="chart-row">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>教室利用率分析</span>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>导出数据</el-dropdown-item>
                      <el-dropdown-item>查看详情</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <div ref="classroomUtilizationChart" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>教师工作量分布</span>
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>导出数据</el-dropdown-item>
                      <el-dropdown-item>查看详情</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
            <div ref="teacherWorkloadChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="chart-row">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>课程类型分布</span>
              </div>
            </template>
            <div ref="courseTypeChart" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>系统访问趋势</span>
              </div>
            </template>
            <div ref="systemAccessChart" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>排课冲突分析</span>
              </div>
            </template>
            <div ref="conflictAnalysisChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="chart-row">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>教室类型使用情况</span>
              </div>
            </template>
            <div ref="classroomTypeChart" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="chart-header">
                <span>教师满意度评分</span>
              </div>
            </template>
            <div ref="teacherSatisfactionChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

// 时间范围选择
const timeRange = ref('semester')

// 图表引用
const classroomUtilizationChart = ref(null)
const teacherWorkloadChart = ref(null)
const courseTypeChart = ref(null)
const systemAccessChart = ref(null)
const conflictAnalysisChart = ref(null)
const classroomTypeChart = ref(null)
const teacherSatisfactionChart = ref(null)

// 图表实例
let classroomUtilizationInstance = null
let teacherWorkloadInstance = null
let courseTypeInstance = null
let systemAccessInstance = null
let conflictAnalysisInstance = null
let classroomTypeInstance = null
let teacherSatisfactionInstance = null

// 教室利用率分析 - 柱状图
const initClassroomUtilizationChart = () => {
  if (classroomUtilizationChart.value) {
    classroomUtilizationInstance = echarts.init(classroomUtilizationChart.value)
    const option = {
      title: {
        text: '教室利用率分析',
        subtext: '按教室类型统计',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['利用率', '空闲率'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['普通教室', '多媒体教室', '实验室', '机房', '报告厅', '会议室'],
        axisLabel: {
          show: true,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '利用率',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: [85, 92, 78, 65, 45, 30],
          itemStyle: {
            color: '#547BF1',
          },
        },
        {
          name: '空闲率',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series',
          },
          data: [15, 8, 22, 35, 55, 70],
          itemStyle: {
            color: '#E6E6E6',
          },
        },
      ],
    }
    classroomUtilizationInstance.setOption(option)
  }
}

// 教师工作量分布 - 雷达图
const initTeacherWorkloadChart = () => {
  if (teacherWorkloadChart.value) {
    teacherWorkloadInstance = echarts.init(teacherWorkloadChart.value)
    const option = {
      title: {
        text: '教师工作量分布',
        subtext: '按学院统计',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: ['平均课时', '理想课时'],
        orient: 'vertical',
        right: 10,
        top: 'center',
      },
      radar: {
        indicator: [
          { name: '计算机科学与工程学院', max: 25 },
          { name: '新媒体产业学院 ', max: 25 },
          { name: '现代农业学院', max: 25 },
          { name: '教育艺术学院 ', max: 25 },
          { name: '马克思主义学院 ', max: 25 },
          { name: '化学与材料工程学院', max: 25 },
          { name: '汽车与智能交通学院 ', max: 25 },
          { name: '信息智能工程学院  ', max: 25 },
          { name: '机械电气工程学院  ', max: 25 },
          { name: '公共基础学院 ', max: 25 },
        ],
      },
      series: [
        {
          name: '教师工作量',
          type: 'radar',
          data: [
            {
              value: [18, 15, 20, 12, 16, 14, 18, 15, 22, 14, 16, 14],
              name: '平均课时',
              itemStyle: {
                color: '#547BF1',
              },
              areaStyle: {
                color: 'rgba(84, 123, 241, 0.3)',
              },
            },
            {
              value: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
              name: '理想课时',
              itemStyle: {
                color: '#FF9800',
              },
              lineStyle: {
                type: 'dashed',
              },
            },
          ],
        },
      ],
    }
    teacherWorkloadInstance.setOption(option)
  }
}

// 课程类型分布 - 饼图
const initCourseTypeChart = () => {
  if (courseTypeChart.value) {
    courseTypeInstance = echarts.init(courseTypeChart.value)
    const option = {
      title: {
        text: '课程类型分布',
        subtext: '按课程类型统计',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 10,
        top: 'center',
        data: ['必修课', '选修课', '实验课', '体育课', '公共课'],
      },
      series: [
        {
          name: '课程类型',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 735, name: '必修课', itemStyle: { color: '#547BF1' } },
            { value: 580, name: '选修课', itemStyle: { color: '#e87b7b' } },
            { value: 484, name: '实验课', itemStyle: { color: '#91CC75' } },
            { value: 300, name: '体育课', itemStyle: { color: '#b48ce5' } },
            { value: 200, name: '公共课', itemStyle: { color: '#8dc8e0' } },
          ],
        },
      ],
    }
    courseTypeInstance.setOption(option)
  }
}

// 系统访问趋势 - 折线图
const initSystemAccessChart = () => {
  if (systemAccessChart.value) {
    systemAccessInstance = echarts.init(systemAccessChart.value)
    const option = {
      title: {
        text: '系统访问趋势',
        subtext: '最近30天',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1日', '5日', '10日', '15日', '20日', '25日', '30日'],
        axisLabel: {
          show: true,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
        },
      },
      series: [
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#547BF1',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(84, 123, 241, 0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(84, 123, 241, 0.1)',
                },
              ],
            },
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    }
    systemAccessInstance.setOption(option)
  }
}

// 排课冲突分析 - 漏斗图
const initConflictAnalysisChart = () => {
  if (conflictAnalysisChart.value) {
    conflictAnalysisInstance = echarts.init(conflictAnalysisChart.value)
    const option = {
      title: {
        text: '排课冲突分析',
        subtext: '按冲突类型统计',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: '冲突类型',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
              color: '#ffffff',
            },
          },
          data: [
            { value: 100, name: '教师时间冲突', itemStyle: { color: '#547BF1' } },
            { value: 93, name: '教室容量不足', itemStyle: { color: '#b48ce5' } },
            { value: 74, name: '教室资源冲突', itemStyle: { color: '#91CC75' } },
            { value: 70, name: '班级时间冲突', itemStyle: { color: '#e87b7b' } },
            { value: 65, name: '优先级冲突', itemStyle: { color: '#deb16e' } },
            { value: 60, name: '同一教师冲突', itemStyle: { color: '#7ab25f' } },
            { value: 36, name: '特殊要求冲突', itemStyle: { color: '#8dc8e0' } },
          ],
        },
      ],
    }
    conflictAnalysisInstance.setOption(option)
  }
}

// 教室类型使用情况 - 条形图
const initClassroomTypeChart = () => {
  if (classroomTypeChart.value) {
    classroomTypeInstance = echarts.init(classroomTypeChart.value)
    const option = {
      title: {
        text: '教室类型使用情况',
        subtext: '按教室类型统计',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['已使用', '空闲'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: ['普通教室', '多媒体教室', '实验室', '机房', '报告厅', '会议室'],
        axisLabel: {
          show: true,
        },
      },
      series: [
        {
          name: '已使用',
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
          },
          emphasis: {
            focus: 'series',
          },
          data: [85, 92, 78, 65, 45, 30],
          itemStyle: {
            color: '#547BF1',
          },
        },
        {
          name: '空闲',
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            color: '#ffffff',
          },
          emphasis: {
            focus: 'series',
          },
          data: [15, 8, 22, 35, 55, 70],
          itemStyle: {
            color: '#E6E6E6',
          },
        },
      ],
    }
    classroomTypeInstance.setOption(option)
  }
}

// 教师满意度评分 - 仪表盘
const initTeacherSatisfactionChart = () => {
  if (teacherSatisfactionChart.value) {
    teacherSatisfactionInstance = echarts.init(teacherSatisfactionChart.value)
    const option = {
      title: {
        text: '教师满意度评分',
        subtext: '基于问卷调查',
      },
      tooltip: {
        formatter: '{a} <br/>{b} : {c}分',
      },
      series: [
        {
          name: '满意度',
          type: 'gauge',
          min: 0,
          max: 10,
          splitNumber: 10,
          radius: '90%',
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, '#f56c6c'],
                [0.7, '#fbc97f'],
                [1, '#7dc15b'],
              ],
            },
          },
          pointer: {
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2,
            },
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4,
            },
          },
          axisLabel: {
            color: 'auto',
            distance: 40,
            fontSize: 14,
          },
          detail: {
            valueAnimation: true,
            formatter: '{value} 分',
            color: 'auto',
          },
          data: [
            {
              value: 8.7,
              name: '满意度',
            },
          ],
        },
      ],
    }
    teacherSatisfactionInstance.setOption(option)
  }
}

// 初始化所有图表
const initCharts = () => {
  initClassroomUtilizationChart()
  initTeacherWorkloadChart()
  initCourseTypeChart()
  initSystemAccessChart()
  initConflictAnalysisChart()
  initClassroomTypeChart()
  initTeacherSatisfactionChart()
}

// 窗口大小变化时，调整图表大小
const handleResize = () => {
  classroomUtilizationInstance && classroomUtilizationInstance.resize()
  teacherWorkloadInstance && teacherWorkloadInstance.resize()
  courseTypeInstance && courseTypeInstance.resize()
  systemAccessInstance && systemAccessInstance.resize()
  conflictAnalysisInstance && conflictAnalysisInstance.resize()
  classroomTypeInstance && classroomTypeInstance.resize()
  teacherSatisfactionInstance && teacherSatisfactionInstance.resize()
}

onMounted(() => {
  // 初始化图表
  initCharts()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
  // 销毁图表实例
  classroomUtilizationInstance && classroomUtilizationInstance.dispose()
  teacherWorkloadInstance && teacherWorkloadInstance.dispose()
  courseTypeInstance && courseTypeInstance.dispose()
  systemAccessInstance && systemAccessInstance.dispose()
  conflictAnalysisInstance && conflictAnalysisInstance.dispose()
  classroomTypeInstance && classroomTypeInstance.dispose()
  teacherSatisfactionInstance && teacherSatisfactionInstance.dispose()
})
</script>

<style lang="scss" scoped>
.analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;

  .analysis-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      color: #333;
      font-weight: 600;
    }
  }

  .data-cards {
    margin-bottom: 20px;

    .data-card {
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 20px;

      .card-title {
        font-size: 14px;
        color: #909399;
        margin-bottom: 10px;
      }

      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 10px;
      }

      .card-trend {
        font-size: 12px;

        .trend-up {
          color: #67c23a;
          margin-right: 5px;
        }

        .trend-down {
          color: #f56c6c;
          margin-right: 5px;
        }

        .trend-text {
          color: #909399;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-card {
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
      }

      .chart-container {
        height: 300px;
        width: 100%;
      }
    }
  }
}
</style>
