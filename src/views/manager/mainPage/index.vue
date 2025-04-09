<template>
  <div class="component-box">
    <div class="search-word"><img src="@/assets/img/word-special.png" /></div>
    <div class="search-box">
      <el-input
        v-model="searchValue"
        @keyup.enter="searchClick"
        class="search-content"
        placeholder="教师，排课计划，节假日调休"
      />
      <el-button color="#065fed" @click="searchClick">搜索</el-button>
    </div>
  </div>
  <div class="module-boxes">
    <div class="module-box">
      <img src="@/assets/3D/3-t.png" @click="staticAnalysis('course/main')" />
      <div @click="staticAnalysis('course/main')">计划表</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/book-search.png" @click="staticAnalysis('scheduling')" />
      <div @click="staticAnalysis('scheduling')">排课</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/2-t.png" @click="staticAnalysis('schedule')" />
      <div @click="staticAnalysis('schedule')">排考试</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/0-t.png" @click="staticAnalysis('information')" />
      <div @click="staticAnalysis('information')">学校信息</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/1-t.png" @click="staticAnalysis('analysis')" />
      <div @click="staticAnalysis('analysis')">统计分析</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/private.png" @click="staticAnalysis('application')" />
      <div @click="staticAnalysis('application')">申请和反馈</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/2-t.png" @click="staticAnalysis('manage')" />
      <div @click="staticAnalysis('manage')">系统管理</div>
    </div>
  </div>
  <div class="middle-box">
    <div class="left-boxes">
      <div class="wow fadeInLeft pulse chart1">
        <div class="chart-content">
          <Chart :option="chartOption1" />
        </div>
      </div>
      <div class="wow fadeInLeft chart2">
        <div class="chart-content">
          <Chart :option="chartOption2" />
        </div>
        <el-dropdown @command="handleCommand2">
          <span class="el-dropdown-link"
            >{{ selectedOption2 }}<span class="iconfont icon-down"></span
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="近一周趋势图">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="近两周趋势图">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="近一月趋势图">近一月趋势图</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="wow fadeInLeft chart3">
        <div class="chart-content">
          <Chart :option="chartOption3" />
        </div>
        <el-dropdown @command="handleCommand3">
          <span class="el-dropdown-link"
            >{{ selectedOption3 }}<span class="iconfont icon-down"></span
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="近一周趋势图">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="近两周趋势图">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="近一月趋势图">近一月趋势图</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="wow fadeInLeft chart4">
        <div class="chart-content">
          <Chart :option="chartOption4" />
        </div>
        <el-dropdown @command="handleCommand4">
          <span class="el-dropdown-link"
            >{{ selectedOption4 }}<span class="iconfont icon-down"></span
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="近一周趋势图">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="近两周趋势图">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="近一月趋势图">近一月趋势图</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="wow fadeInUp footer1">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">请假申请</div>
          <div class="more-view" @click="staticAnalysis('application', true)">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="application-boxes">
          <div
            class="application-box"
            v-for="(item, index) in applicationList.arr"
            :key="item"
            @mouseenter="isDisable.arr[index] = false"
            @mouseleave="isDisable.arr[index] = true"
          >
            <span style="display: flex">
              <span class="application-title" @click="applicationClick(item.essayId)">{{
                item?.leaveReason
              }}</span>
              <span
                @click="temLoadClick(item.id)"
                style="z-index: 10px; color: #4d4d4d; cursor: pointer"
                :class="isDisable.arr[index] == true ? 'disabled' : ''"
              >
                查看
                <i class="iconfont icon-Rightyou" style="font-size: 12px"></i>
              </span>
              <span
                class="application-detail"
                :class="isDisable?.arr[index] == true ? '' : 'disabled'"
              >
                <span>{{ item?.leaveStart }} </span>
                <span>{{ item?.leaveDays }} 天</span>
              </span>
            </span>
            <span class="application-bottom" @click="applicationClick(item.essayId)">
              <span class="first-label" :class="item.leaveType + '-label'">
                {{ getLabelByValue(item.leaveType) }}
              </span>
              <span class="second-label" :class="item.title + '-label'">
                {{ getLabelByValue(item?.title) }}
              </span>
              <span class="name-label">{{ item?.applicant }}</span>
              <span class="time-label">{{ item?.updatedAt }}</span>
            </span>
          </div>
        </div>
        <div><img src="@/assets/img/book.png" class="application-img" /></div>
      </div>
      <div class="wow fadeInUp footer2">
        <div class="footer2-child1">
          <div class="footer-title">
            <el-divider direction="vertical" />
            <div class="title-box">工作量 / 周</div>
            <div class="more-view" @click="() => $router.push('/manager/functionPage/analysis')">
              查看更多<span class="iconfont icon-Rightyou"></span>
            </div>
          </div>
          <div class="teacher-boxes">
            <div
              class="teacher-box"
              v-for="item in teacherList.arr"
              :key="item"
              @click="analysisClick(item.id)"
            >
              <div>
                <el-progress
                  type="circle"
                  :color="customColors"
                  :percentage="item.workload > 100 ? 100 : item.workload"
                >
                  <span>{{ item.workload }}%</span>
                </el-progress>
                <div class="teacher-name">{{ item?.username }}</div>
                <div class="teacher-bottom">
                  <div class="teacher-subject">{{ item.courseList[0] }}</div>
                  <div class="teacher-status">{{ item.title }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer2-child2">
          <div class="footer-title">
            <el-divider direction="vertical" />
            <div class="title-box">排课</div>
            <div class="more-view" @click="() => $router.push('/manager/functionPage/course/main')">
              查看更多<span class="iconfont icon-Rightyou"></span>
            </div>
          </div>
          <div class="class-boxes">
            <div class="class-box" v-for="item in classList.arr" :key="item">
              <div class="class-left">
                <div class="class-left-top">
                  <div class="class-left-title">{{ item.taskName }}</div>
                  <span
                    class="status"
                    :class="
                      item.taskStatus == '0'
                        ? 'status0'
                        : item.taskStatus == '1'
                          ? 'status1'
                          : item.taskStatus == '2'
                            ? 'status2'
                            : item.taskStatus == '3'
                              ? 'status3'
                              : 'status4'
                    "
                  >
                    {{
                      item.taskStatus == '0'
                        ? '待执行'
                        : item.taskStatus == '1'
                          ? '进行中'
                          : item.taskStatus == '2'
                            ? '已完成'
                            : item.taskStatus == '3'
                              ? '失败'
                              : '进行中'
                    }}
                  </span>
                </div>
                <div class="class-left-bottom">
                  {{ item.updatedAt }}
                </div>
              </div>
              <div class="class-right">
                <div class="class-right-box">
                  <div class="class-right-title">课时任务</div>
                  <div class="class-right-content">{{ item.totalClassHours }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">课程数量</div>
                  <div class="class-right-content">{{ item.totalCourseSize }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">班级数量</div>
                  <div class="class-right-content">{{ item.totalClassSize }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">
                    未排课程
                    <span class="iconfont icon-bangzhu"></span>
                  </div>
                  <div class="class-right-content">
                    {{ item.totalCourseSize - item.successCourseSize }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wow fadeInRight right-boxes">
      <div class="right-box1">
        <div class="panel-box" v-for="item in panelContents.arr" :key="item">
          <div class="iconfont" :class="item.class" :style="'color: ' + item.color"></div>
          <div class="panel-word">{{ item.content }}</div>
          <div class="panel-number">{{ item.value }}</div>
          <div class="panel-button" @click="router.push('/manager/functionPage/application')">
            查看
          </div>
        </div>
      </div>
      <div class="right-box2">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">反馈</div>
          <div class="more-view" @click="staticAnalysis('application', false)">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="feedback-boxes">
          <div class="feedback-box" v-for="item in feedbackList.arr" :key="item">
            <div class="feedback-top">
              <div class="feedback-content">{{ item.title }}</div>
              <div class="feedback-class">{{ item.department }}</div>
            </div>
            <div class="feedback-bottom">
              <div class="feedback-bottom-top">
                <div
                  class="feedback-identity"
                  :class="item?.role === '教师' ? 'teacher-identity' : 'student-identity'"
                >
                  {{ item?.role }}
                </div>
                <div class="feedback-name">{{ item?.teacherName }}</div>
                <div
                  class="feedback-status"
                  :class="item.status == '0' ? 'green-status' : 'red-status'"
                >
                  {{ item.status == '0' ? '已读' : '未读' }}
                </div>
              </div>
              <div class="feedback-time">{{ item.createdAt }}</div>
            </div>
          </div>
        </div>
        <div><img src="@/assets/img/book.png" class="application-img" /></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import '@/assets/iconfont/iconfont.css'
import Chart from '@/components/Chart.vue'
import { getRoomRateAPI, getFeedbackSizeAPI, getTeacherWorkloadAPI } from '@/apis/mainPage'
import { getLeaveAllAPI, getLeaveChartAPI } from '@/apis/application'
import { getCourseSchedulingAPI } from '@/apis/course'
import { getFeedbackAllAPI } from '@/apis/feedback'

let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
const router = useRouter()

let searchValue = ref('') // 搜索内容
let userInfo = reactive([]) // 用户信息

const customColors = [
  { color: '#7ab25f', percentage: 25 },
  { color: '#547bf1', percentage: 50 },
  { color: '#ef943f', percentage: 75 },
  { color: '#f56c6c', percentage: 100 },
]

// 面板内容数据
const panelContents = reactive({
  arr: [
    {
      content: '待处理',
      value: 12,
      color: '#FFAB91',
      class: 'icon-daichuli',
    },
    {
      content: '待解决',
      value: 5,
      color: '#6C54F1',
      class: 'icon-daichuli1',
    },
    {
      content: '待考试',
      value: '--',
      color: '#ed8b31',
      class: 'icon-zaixiankaoshi',
    },
    {
      content: '已完成',
      value: 23,
      color: '#7ab25f',
      class: 'icon-yiwanchengdingdan',
    },
  ],
})

// 列表数据
let isDisable = reactive({ arr: [] })
let applicationList = reactive({ arr: [] })
let teacherList = reactive({ arr: [] })
let classList = reactive({ arr: [] })
let feedbackList = reactive({ arr: [] })

// 图表选项
let selectedOption2 = ref('近一周趋势图')
let selectedOption3 = ref('近一周趋势图')
let selectedOption4 = ref('近一周趋势图')

// 申请类型和标题选项
const typeApplication = [
  { label: '全部', value: '' },
  { label: '公假', value: 'public' },
  { label: '事假', value: 'matter' },
  { label: '病假', value: 'illness' },
  { label: '婚假', value: 'wed' },
  { label: '产假', value: 'maternity' },
  { label: '丧假', value: 'funeral' },
  { label: '其他', value: 'other' },
]

const titleApplication = [
  { label: '全部', value: '' },
  { label: '换课申请', value: 'change' },
  { label: '代课申请', value: 'place' },
  { label: '调课申请', value: 'adjust' },
]

// 从数据中提取指定属性组成数组
function extractDataData(data, str) {
  return data
    .map(obj => obj[str])
    .filter(dataValue => dataValue !== undefined && dataValue !== null)
}

//根据值获取对应的标签
function getLabelByValue(value) {
  for (let i = 0; i < typeApplication.length; i++) {
    if (typeApplication[i].value === value) {
      return typeApplication[i].label
    }
  }
  for (let i = 0; i < titleApplication.length; i++) {
    if (titleApplication[i].value === value) {
      return titleApplication[i].label
    }
  }
  return null
}

//格式化日期时间
function formatDateTime(dateTimeStr) {
  return dateTimeStr.replace('T', ' ')
}

//格式化日期
function formatDate(dateStr) {
  return dateStr.split('T')[0]
}
//获取反馈图表数据
async function fetchFeedbackChartData(days = 7) {
  const res = await getFeedbackSizeAPI(days)
  let sum = 0
  for (let i = 0; i < res.data.data.length; i++) {
    sum += res.data.data[i].data
  }
  chartOption2.value.xAxis[0].data = extractDataData(res.data.data, 'time')
  chartOption2.value.series[0].data = extractDataData(res.data.data, 'data')
  chartOption2.value.title.subtext = `{value|平均}{titleSize| ${sum} }{value|次}`
}

//获取教室占用率数据
async function fetchRoomRateData(days) {
  const res = await getRoomRateAPI(days)
  const v1 = res.data.data[0].value,
    v2 = res.data.data[1].value
  const x = ((v2 / (v1 + v2)) * 100).toFixed(2)
  chartOption4.value.title.subtext = `{titleSize| ${x} }{value|%}`
  chartOption4.value.series[0].data[0].value = v2
  chartOption4.value.series[0].data[1].value = v1
}

//获取教师工作量数据
async function fetchTeacherWorkloadData() {
  const res = await getTeacherWorkloadAPI()
  teacherList.arr = res.data.data.slice(0, 4)
}

//获取请假申请数据
async function fetchLeaveApplicationData() {
  const res = await getLeaveAllAPI()
  applicationList.arr = res.data.data.slice(0, 6)

  // 处理日期格式
  for (let i = 0; i < applicationList.arr.length; i++) {
    isDisable.arr[i] = true
    applicationList.arr[i].updatedAt = formatDateTime(applicationList.arr[i].updatedAt)
    applicationList.arr[i].leaveStart = formatDate(applicationList.arr[i].leaveStart)
  }
}

//获取排课列表数据
async function fetchCourseSchedulingData() {
  const res = await getCourseSchedulingAPI()
  classList.arr = res.data.data.slice(0, 3)
  classList.arr = [...classList.arr].reverse()
  // 处理日期格式
  for (let i = 0; i < classList.arr.length; i++) {
    classList.arr[i].updatedAt = formatDateTime(classList.arr[i].updatedAt)
  }
}

//获取反馈列表数据
async function fetchFeedbackListData() {
  const res = await getFeedbackAllAPI()
  console.log(res.data)
  feedbackList.arr = res.data.data.slice(0, 7)
  feedbackList.arr.forEach((item, index) => {
    feedbackList.arr[index].createdAt = item.createdAt.replace('T', ' ')
  })
}

//获取近期申请图表数据
async function fetchLeaveChartData(days = 7) {
  const res = await getLeaveChartAPI(days)
  let sum = 0
  for (let i = 0; i < res.data.data.length; i++) {
    sum += res.data.data[i].data
  }
  chartOption3.value.xAxis.data = extractDataData(res.data.data, 'time')
  chartOption3.value.series.data = extractDataData(res.data.data, 'data')
  chartOption3.value.title.subtext = `{titleSize| ${sum} }{value|个}`
}

// 事件处理函数
async function searchClick() {
  if (searchValue.value == '' || searchValue.value == null) {
    ElMessage.warning('输入内容不能为空！')
    return
  }
  router.push(`/function/manager/${searchValue.value}`)
}

//下拉菜单命令处理函数
async function handleCommand2(command) {
  selectedOption2.value = command
  let days = 7
  if (command == '近两周趋势图') {
    days = 14
  } else if (command == '近一月趋势图') {
    days = 30
  }
  await fetchFeedbackChartData(days)
}

async function handleCommand3(command) {
  selectedOption3.value = command
  let days = 7
  if (command == '近两周趋势图') {
    days = 14
  } else if (command == '近一月趋势图') {
    days = 30
  }
  await fetchLeaveChartData(days)
}

async function handleCommand4(command) {
  console.log('图表4命令:', command)
}

//快捷入口点击事件
function staticAnalysis(string, value) {
  if (value != null) {
    router.push(`/manager/functionPage/${string}/?value=${value}`)
    return
  }
  router.push(`/manager/functionPage/${string}`)
}

//申请点击事件
function applicationClick(essayId) {
  // 处理申请点击逻辑
  console.log('申请点击:', essayId)
}

//临时加载点击事件
function temLoadClick(id) {
  // 处理临时加载点击逻辑
  console.log('临时加载点击:', id)
}

function analysisClick(id) {
  // 处理分析点击逻辑
  console.log('分析点击:', id)
}

// 初始化函数
async function initializeData() {
  userStore.initialize()
  userInfo.push(...[userStore.user])

  // 获取所有数据
  await Promise.all([
    fetchFeedbackChartData(),
    fetchRoomRateData(7),
    fetchTeacherWorkloadData(),
    fetchLeaveApplicationData(),
    fetchCourseSchedulingData(),
    fetchFeedbackListData(),
    fetchLeaveChartData(),
  ])
}

// 生命周期钩子
onMounted(async () => {
  await initializeData()
})

// 图表配置
const chartOption1 = ref({
  title: {
    show: true,
    text: `{value|学期进度}`,
    subtext: `{titleSize| 34 }{value|%}`,
    textStyle: {
      rich: {},
    },
  },
  series: [
    {
      type: 'gauge',
      center: ['50%', '80%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      itemStyle: {
        color: '#FFAB91',
      },
      progress: {
        show: true,
        width: 5,
      },
      pointer: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 5,
        },
      },
      axisTick: {
        distance: -15,
        length: 5,
        splitNumber: 2,
        lineStyle: {
          width: 2,
          color: '#999',
        },
      },
      splitLine: {
        distance: -20,
        length: 5,
        lineStyle: {
          width: 3,
          color: '#999',
        },
      },
      axisLabel: {
        show: false,
      },
      anchor: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '-15%'],
        fontSize: 18,
        fontWeight: 'bolder',
        formatter: '{value} %',
        color: '#065fed',
      },
      data: [
        {
          value: 34,
        },
      ],
    },
    {
      type: 'gauge',
      center: ['50%', '80%'],
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      itemStyle: {
        color: '#065fed',
      },
      progress: {
        show: true,
        width: 8,
      },
      pointer: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      detail: {
        show: false,
      },
      data: [
        {
          value: 34,
        },
      ],
    },
  ],
})

const chartOption2 = ref({
  title: {
    text: '{value|近期反馈}',
    subtext: '{value|平均}{titleSize| 1 }{value|次}',
    textStyle: {
      color: '#6C54F1',
      rich: {},
    },
  },
  tooltip: {
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  xAxis: [
    {
      data: [1, 2, 3, 2, 1, 4, 5],
    },
  ],
  series: [
    {
      type: 'line',
      smooth: true,
      itemStyle: { color: '#6C54F1' },
      emphasis: { focus: 'series' },
      symbol: 'none',
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#6C54F1',
          },
          {
            offset: 1,
            color: '#F9F8FE',
          },
        ]),
      },
      symbolSize: 5,
      data: [1, 2, 3, 2, 1, 4, 4],
    },
  ],
})

const chartOption3 = ref({
  title: {
    text: `{value|近期申请}`,
    subtext: `{titleSize|2 }{value|个}`,
    textStyle: {
      color: '#ed8b31',
      rich: {},
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {
        title: '下载该图表',
      },
    },
  },
  grid: {
    left: '5%',
    right: '5%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [7, 7, 8, 9, 6, 2],
  },
  yAxis: {
    type: 'value',
  },
  series: {
    type: 'bar',
    data: [8, 5, 2, 3, 6, 8],
    itemStyle: {
      color: '#ed8b31',
      borderRadius: [50, 50, 0, 0],
    },
    barGap: '90%',
    barCategoryGap: '65%' /*多个并排柱子设置柱子之间的间距*/,
    barMinHeight: 3, // 设置柱状图的最小高度，单位可以是像素或者百分比
  },
})

const chartOption4 = ref({
  title: {
    text: `{value|教室占用率}`,
    subtext: `{titleSize| 10 }{value|%}`,
    textStyle: {
      color: '#7ab25f',
      rich: {},
    },
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      radius: [20, 60],
      center: ['50%', '58%'],
      itemStyle: {
        borderRadius: 8,
        borderWidth: 3,
        borderColor: 'white',
      },
      labelLine: {
        show: false,
      },
      label: {
        show: false,
      },
      data: [
        {
          value: 40,
          name: '已占用',
          itemStyle: {
            color: '#DBDEE5',
          },
        },
        {
          value: 45,
          name: '未占用',
          itemStyle: {
            color: '#7ab25f',
          },
        },
      ],
    },
  ],
})
</script>
<style lang="scss" scoped>
@import url('./scss/index.scss');
</style>
