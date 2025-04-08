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
              <el-dropdown-item command="a">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="b">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="c">近一月趋势图</el-dropdown-item>
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
              <el-dropdown-item command="a">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="b">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="c">近一月趋势图</el-dropdown-item>
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
              <el-dropdown-item command="a">近一周趋势图</el-dropdown-item>
              <el-dropdown-item command="b">近两周趋势图</el-dropdown-item>
              <el-dropdown-item command="c">近一月趋势图</el-dropdown-item>
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
          <div class="panel-button">查看</div>
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
              <div class="feedback-class">{{ item.class }}</div>
            </div>
            <div class="feedback-bottom">
              <div class="feedback-bottom-top">
                <div
                  class="feedback-identity"
                  :class="item?.identity === 'teacher' ? 'teacher-identity' : 'student-identity'"
                >
                  {{ item?.identity }}
                </div>
                <div class="feedback-name">{{ item?.teacherName }}</div>
                <div
                  class="feedback-status"
                  :class="item.status === '1' ? 'green-status' : 'red-status'"
                >
                  {{ item.status == '1' ? '已读' : '未读' }}
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
import { getLeaveAllAPI } from '@/apis/application'
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
let isDisable = reactive({
  arr: [],
})
let applicationList = reactive({
  arr: [],
})
let teacherList = reactive({
  arr: [],
})
let classList = reactive({
  arr: [],
})
let feedbackList = reactive({
  arr: [
    {
      id: 0,
      name: '张三',
      content: '排课系统的使用方法',
      time: '2023-10-10 15:30',
      status: '已解决', //已解决,未解决,已拒绝
      identity: 'teacher',
      class: '计科院 软件工程 22.4',
    },
    {
      id: 11,
      name: '张李',
      content: '排课系统的使用方法',
      time: '2023-10-10 14:30',
      status: '未解决',
      identity: 'student',
      class: '计科院 软件工程 22.7',
    },
  ],
})
// charts图标选中
let selectedOption2 = ref('近一周趋势图')
let selectedOption3 = ref('近一周趋势图')
let selectedOption4 = ref('近一周趋势图')
onMounted(async () => {
  userStore.initialize()
  userInfo.push(...[userStore.user])
  //获取当前反馈记录数
  const res2 = await getFeedbackSizeAPI(7)
  let sum = 0
  for (let i = 0; i < res2.data.data.length; i++) {
    sum += res2.data.data[i].data
  }
  chartOption2.value.xAxis[0].data = extractDataData(res2.data.data, 'time')
  chartOption2.value.series[0].data = extractDataData(res2.data.data, 'data')
  chartOption2.value.title.subtext = `{value|平均}{titleSize| ${sum} }{value|次}`
  //获取当前教室占用率
  const res4 = await getRoomRateAPI(7)
  console.log(res4.data)
  const v1 = res4.data.data[0].value,
    v2 = res4.data.data[1].value
  const x = ((v2 / (v1 + v2)) * 100).toFixed(2)
  chartOption4.value.title.subtext = `{titleSize| ${x} }{value|%}`
  chartOption4.value.series[0].data[0].value = v2
  chartOption4.value.series[0].data[1].value = v1
  //获取教师工作量
  const res5 = await getTeacherWorkloadAPI()
  teacherList.arr = res5.data.data.slice(0, 4)
  //获取请假申请
  const res6 = await getLeaveAllAPI()
  console.log(res6.data)
  applicationList.arr = res6.data.data
  console.log(applicationList.arr)
  for (let i = 0; i < applicationList.arr.length; i++) {
    isDisable.arr[i] = true
    applicationList.arr[i].updatedAt = applicationList.arr[i].updatedAt.replace('T', ' ')
    applicationList.arr[i].leaveStart = applicationList.arr[i].leaveStart.split('T')
    applicationList.arr[i].leaveStart = applicationList.arr[i].leaveStart[0]
  }
  //获取排课列表
  const res7 = await getCourseSchedulingAPI()
  console.log(res7.data)
  classList.arr = res7.data.data
  for (let i = 0; i < classList.arr.length; i++) {
    classList.arr[i].updatedAt = classList.arr[i].updatedAt.replace('T', ' ')
  }
  //反馈列表
  const res8 = await getFeedbackAllAPI()
  console.log(res8.data)
  feedbackList.arr = res8.data.data
})
//获取对应属性组成一个数组
function extractDataData(data, str) {
  return data
    .map(obj => obj[str])
    .filter(dataValue => dataValue !== undefined && dataValue !== null)
}
//点击搜索
async function searchClick() {
  if (searchValue.value == '' || searchValue.value == null) {
    ElMessage.warning('输入内容不能为空！')
    return
  }
  router.push(`/function/manager/${searchValue.value}`)
}

async function handleCommand2(command) {
  console.log(command)
}
async function handleCommand3(command) {
  console.log(command)
}
async function handleCommand4(command) {
  console.log(command)
}

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
//获取申请类型
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
//点击快捷入口
function staticAnalysis(string, value) {
  if (value != null) {
    router.push(`/manager/functionPage/${string}/?value=${value}`)
    return
  }
  router.push(`/manager/functionPage/${string}`)
}
</script>
<style lang="scss" scoped>
.component-box {
  margin: 10px auto;
  margin-top: 0px;
  width: 80%;
  height: 40px;
  line-height: 40px;
  display: flex;

  .search-word {
    margin-top: 5px;
    margin-right: 20px;
  }

  .search-box {
    display: flex;
    width: 75%;

    @media (max-width: 765px) {
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      width: 60%;
    }

    @media (min-width: 1024px) {
    }

    .search-content {
      --el-border-radius-base: 10px 0 0 10px;
    }

    .el-button {
      border-radius: 0 10px 10px 0;
      border: 0;
      height: 40px;
      width: 80px;
    }
  }
}

.module-boxes {
  color: $word-black-color;
  width: 75%;
  font-size: 15px;
  margin: 0 auto;
  margin-top: 55px;
  display: grid;
  grid-template-columns: repeat(7, 10%);
  grid-gap: 10px 5%;

  @media (max-width: 765px) {
    margin-top: 45px;
    width: 70%;
    grid-template-columns: repeat(3, 23%);
    grid-gap: 15px 15%;
    grid-template-rows: repeat(2, 40%);
  }

  @media (min-width: 765px) and (max-width: 1024px) {
    grid-template-columns: repeat(6, 12%);
    grid-gap: 10px 5%;
    margin-top: 50px;
    width: 92%;
  }

  @media (min-width: 1024px) {
  }

  > div:hover {
    box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
  }

  .module-box {
    background-color: #fff;
    border-radius: 10px;
    height: 65%;
    font-size: 14px;
    text-align: center;

    img {
      cursor: pointer;
      transform: translateY(-50%);
      width: 80%;
    }

    div {
      cursor: pointer;
      height: 100%;
      transform: translateY(-70%);

      @media (max-width: 765px) {
        transform: translateY(-90%);
      }

      @media (min-width: 765px) and (max-width: 1024px) {
      }

      @media (min-width: 1024px) {
      }
    }
  }
}

.middle-box {
  width: 97%;
  margin: 0 auto;
  transform: translateY(-15px);
  display: flex;
  background-color: rgb(174, 208, 244, 0);

  @media (max-width: 765px) {
    transform: translateY(-36px);
  }

  @media (min-width: 765px) and (max-width: 1024px) {
  }

  @media (min-width: 1024px) {
  }

  .left-boxes {
    flex: 10;
    display: grid;
    grid-template-areas:
      'chart1 chart1 chart2 chart2 chart3 chart3 chart4 chart4'
      'footer1 footer1 footer1 footer2 footer2 footer2 footer2 footer2';
    grid-template-rows: 200px 450px;
    grid-template-columns: repeat(8, 11%);
    grid-gap: 10px 1.7%;
    margin-right: 10px;
    background-color: rgb(174, 208, 244, 0);

    @media (max-width: 765px) {
      flex: 4;
      grid-template-rows: 175px 175px 500px;
      grid-template-areas:
        'chart1 chart1 chart1 chart1 chart2 chart2 chart2 chart2'
        ' chart3 chart3 chart3 chart3 chart4 chart4 chart4 chart4'
        'footer1 footer1 footer1 footer1 footer1 footer1 footer1 footer1';
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      flex: 4;
      grid-template-rows: 175px 175px 500px;
      grid-template-areas:
        'chart1 chart1 chart1 chart1 chart2 chart2 chart2 chart2'
        ' chart3 chart3 chart3 chart3 chart4 chart4 chart4 chart4'
        'footer1 footer1 footer1 footer1 footer2 footer2 footer2 footer2';
    }

    @media (min-width: 1024px) {
    }

    div {
      background-color: #fff;
    }
    > div {
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
    }
    .el-dropdown {
      cursor: pointer;
    }

    .chart1,
    .chart2,
    .chart3,
    .chart4 {
      border-radius: 10px;

      @media (max-width: 765px) {
      }

      @media (min-width: 765px) and (max-width: 1300px) {
        padding-bottom: 0%;
      }

      @media (min-width: 1300px) {
      }

      .chart-content {
        height: 75%;
        width: 94%;
        padding: 0 3%;
        margin-top: 3%;
        border-radius: 10%;
      }

      .el-dropdown {
        border-radius: 10px;
        margin: 3% 3% 0 3%;
        padding: 3px 5px 3px 5px;
        font-size: 12px;

        #el-id-5859-0 {
          display: flex;
          justify-content: center;
          align-content: center;
        }

        .icon-down::before {
          font-size: 12px;
        }
      }
      .el-dropdown-link {
        outline: none;
        border: none;
        box-shadow: none;
      }
    }

    .chart1 {
      grid-area: chart1;

      .el-dropdown {
        border: 1.5px solid #547bf1;
        color: #547bf1;
      }
    }

    .chart2 {
      grid-area: chart2;

      .el-dropdown {
        border: 1.5px solid #6c54f1;
        color: #6c54f1;
      }
    }

    .chart3 {
      grid-area: chart3;

      .el-dropdown {
        border: 1.5px solid #ed8b31;
        color: #ed8b31;
      }
    }

    .chart4 {
      grid-area: chart4;

      .el-dropdown {
        border: 1.5px solid #7ab25f;
        color: #7ab25f;
      }
    }

    .chart-title1,
    .chart-title2,
    .chart-title3,
    .chart-title4 {
      font-size: 18px;
      font-weight: 600;
      display: block;
      margin-top: 10px;
      margin-left: 5px;
    }

    .chart-title1 {
      color: #547bf1;
    }

    .chart-title2 {
      color: #6c54f1;
    }

    .chart-title3 {
      color: #ed8b31;
    }

    .chart-title4 {
      color: #7ab25f;
    }

    .none-data {
      line-height: 130px;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .footer1,
    .footer2 {
      color: $word-black-color;
      border-radius: 10px;
      position: relative;
    }

    .footer1 {
      grid-area: footer1;

      .application-img {
        height: 80px;
        position: absolute;
        bottom: 0;
        right: 10%;
      }

      .application-boxes {
        cursor: pointer;
        word-wrap: break-word;
        font-size: 14px;
        padding: 10px 5px 0 10px;

        .application-box {
          margin-bottom: 6px;
          padding: 5px 5px 5px 5px;
          border-radius: 5px;

          .application-title {
            margin-right: auto;
            margin-bottom: 5px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
          }
          .application-detail {
            span {
              padding-left: 8px;
            }
          }
          .disabled {
            display: none;
          }

          .application-bottom {
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            line-height: 20px;
            align-items: center;

            .first-label {
              border-radius: 5px;
              padding: 0 5px;
            }

            .matter-label {
              background-color: $blue-back;
              color: $main-blue;
            }
            .public-label {
              color: $main-purple;
              background-color: $purple-back;
            }
            .illness-label {
              color: $main-yellow;
              background-color: $yellow-shallow;
            }
            .wed-label {
              color: $pink;
              background-color: $red-back;
            }
            .maternity-label {
              color: $green;
              background-color: $green-back;
            }
            .funeral-label {
              color: $deep-color;
              background-color: $blue-back;
            }
            .other-label {
              color: $word-grey-color;
              background-color: $word-back-color;
            }
            .signature-img {
              width: 100%;
            }

            .change-label,
            .adjust-label,
            .place-label {
              font-size: 13px;
              border-radius: 5px;
              margin-left: 6%;
              margin-right: 6px;
              color: $main-green;
            }
            .change-label {
              color: $purple;
            }
            .place-label {
              color: $main-blue;
            }

            .second-label {
              margin-left: 5px;
              margin-right: 8px;
              background-color: #e6eaf2;
              border-radius: 5px;
              padding: 0 5px;
            }

            .second-label1 {
              color: $main-blue;
            }
            .second-label2 {
              color: $main-purple;
            }
            .second-label3 {
              color: $word-black-color;
            }

            .name-label {
              margin-right: auto;
            }

            .time-label {
              @media (max-width: 765px) {
              }

              @media (min-width: 765px) and (max-width: 1024px) {
                display: none;
              }

              @media (min-width: 1024px) {
              }
            }
          }
        }

        .application-box:hover {
          background-color: #f3f5f8;
        }
      }
    }

    .footer2 {
      grid-area: footer2;
      background-color: transparent;
      box-shadow: none;
      display: flex;
      flex-direction: column;

      @media (max-width: 765px) {
        display: none;
      }

      @media (min-width: 765px) and (max-width: 1024px) {
      }

      @media (min-width: 1024px) {
      }

      .footer2-child1,
      .footer2-child2 {
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);

        .teacher-boxes {
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;

          .teacher-box {
            border-radius: 0 0 8px 8px;
            width: 25%;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            font-size: 14px;

            .teacher-name {
              font-weight: 600;
            }

            .teacher-bottom {
              display: flex;
              font-size: 12px;
              padding-top: 5px;

              .teacher-subject {
                padding: 2.5px 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .teacher-status {
                color: $word-grey-color;
                padding: 1px 3px;
                border: 1.5px solid $word-grey-color;
                border-radius: 5px;
              }
            }
          }
        }

        .class-boxes {
          border-radius: 8px;
          .class-box {
            border-radius: 0 0 8px 8px;
            display: flex;
            padding: 10px 20px;

            .class-left {
              margin-right: auto;

              .class-left-top {
                margin-bottom: 6px;

                .class-left-title {
                  display: inline-block;
                  font-size: 16px;
                  font-weight: 600;
                  margin-right: 10px;
                }
                .class-left-status {
                  display: inline-block;
                  font-size: 12px;
                  padding: 1px 6px;
                  border-radius: 5px;
                  color: #fff;
                }
                .status {
                  line-height: 22px;
                  border-radius: 5px;
                  font-size: 14px;
                  padding: 2px 6px;
                  color: #fff;
                }
                .status0 {
                  background-color: $word-grey-color;
                }
                .status1 {
                  background-color: $main-yellow;
                }
                .status2 {
                  background-color: $purple;
                }
                .status3 {
                  background-color: $red;
                }
                .status4 {
                  background-color: $main-green;
                }
              }

              .class-left-bottom {
                color: $word-grey-color;
                font-size: 14px;
                line-height: 30px;
              }
            }

            .class-right {
              display: flex;

              .class-right-box {
                margin-left: 20px;
                .class-right-title {
                  color: $word-grey-color;
                  font-size: 14px;
                  margin-bottom: 6px;
                }

                .class-right-content {
                  line-height: 30px;
                  font-size: 18px;
                  font-weight: 600;
                }
                .class-teacher {
                  display: flex;

                  .class-teacher-img {
                    width: 25px;
                    border-radius: 15px;
                    border: 2px solid #fff;
                  }
                }
              }
            }
          }
        }
      }

      .footer2-child1 {
        margin-bottom: 1%;
      }

      .footer2-child2 {
        height: 100%;
      }
    }
  }

  .right-boxes {
    flex: 3;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    border-radius: 10px;

    .right-box1,
    .right-box2 {
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);

      .application-img {
        height: 80px;
        position: absolute;
        bottom: 0;
        right: 10%;
      }

      .panel-box {
        display: flex;
        cursor: pointer;
        flex: 1;
        flex-direction: column;
        align-items: center;
        gap: 6px;

        &:hover .panel-button {
          color: #fff;
          background-color: $main-blue;
          box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
        }

        .iconfont::before {
          font-size: 34px;
        }
        .iconfont:nth-child(1) {
          color: yellow;
        }
        .panel-word {
          font-size: 12px;
          color: $word-shallow-color;
        }
        .panel-number {
          font-size: 20px;
          font-weight: 600;
        }
        .panel-button {
          font-size: 12px;
          color: $main-blue;
          border: 1px solid $main-blue;
          border-radius: 8px;
          padding: 0.5px 8px;
        }
      }

      .feedback-boxes {
        padding: 10px 10px;
        font-size: 12px;
        border-radius: 8px;

        .feedback-box {
          border-radius: 0 0 8px 8px;
          cursor: pointer;
          padding: 5px;
          line-height: 20px;

          &:hover {
            background-color: #f3f5f8;
          }

          .feedback-top {
            display: flex;

            .feedback-content {
              font-size: 14px;
              margin-right: auto;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .feedback-bottom {
            display: flex;
            margin-top: 5px;

            .feedback-bottom-top {
              margin-right: auto;
              display: flex;
              gap: 8px;
            }
            .feedback-identity {
              color: #fff;
              padding: 0 5px;
              border-radius: 5px;
              font-size: 11px;
            }

            .teacher-identity {
              background-color: $main-purple;
            }
            .student-identity {
              background-color: $main-blue;
            }

            .feedback-time {
              color: $word-grey-color;
            }

            .feedback-status {
              padding: 0 5px;
              font-size: 11px;
              border-radius: 2px;
            }

            .red-status {
              color: $red-word;
              background-color: $red-back;
            }
            .green-status {
              color: $green-word;
              background-color: $green-back;
            }
          }
        }
      }
    }

    .right-box1 {
      display: flex;
      justify-content: center;
      padding: 15px 0;
    }

    .right-box2 {
      margin-top: 2%;
      height: 100%;
    }
  }
}

.footer-title {
  display: flex;
  align-items: center;
  border-radius: 10px 10px 0 0;
  height: 40px;
  line-height: 25px;
  border-bottom: 1px solid #ccc;

  .el-divider {
    height: 13px;
    border-left: 5px solid $title-color;
    margin-right: 4px;
  }

  .title-box {
    color: $title-color;
    font-weight: 600;
    margin-right: auto;
  }

  .more-view {
    font-size: 12px;
    color: $word-shallow-color;
    margin-right: 8px;
    cursor: pointer;

    .iconfont::before {
      font-size: 12px;
    }
  }
}

:deep(.el-progress-circle) {
  height: 50px !important;
  width: 50px !important;
}
</style>
