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
      <img src="@/assets/3D/3-t.png" @click="staticAnalysis('userRecentPage')" />
      <div @click="staticAnalysis('userRecentPage')">排课计划</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/private.png" @click="staticAnalysis('userMyAnalysisPage')" />
      <div @click="staticAnalysis('userMyAnalysisPage')">排考试</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/0-t.png" @click="Analysis('userUploadPage', false)" />
      <div @click="Analysis('userUploadPage', false)">学校信息</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/1-t.png" @click="Analysis('userUploadPage', true)" />
      <div @click="Analysis('userUploadPage', true)">统计分析</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/book-search.png" @click="staticAnalysis('userBlackWhitePage')" />
      <div @click="staticAnalysis('userBlackWhitePage')">申请处理</div>
    </div>
    <div class="module-box" @click="staticAnalysis('userMemberPage')">
      <img src="@/assets/3D/2-t.png" />
      <div @click="staticAnalysis('userMemberPage')">系统管理</div>
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
          <div class="title-box">申请</div>
          <div class="more-view" @click="() => $router.push('/functionPage/application')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="application-boxes">
          <div
            class="application-box"
            v-for="(item, index) in applicationList"
            :key="item"
            @mouseenter="isDisable.arr[index] = false"
            @mouseleave="isDisable.arr[index] = true"
          >
            <span style="display: flex">
              <span class="application-title" @click="applicationClick(item.essayId)">{{
                item?.title
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
                :class="isDisable.arr[index] == true ? '' : 'disabled'"
              >
                <span>{{ item.leaveStartTime }}</span>
                <span>{{ item.leaveDays }} 天</span>
                <span>{{ item.leaveCourseCount }} 大节课</span>
              </span>
            </span>
            <span class="application-bottom" @click="applicationClick(item.essayId)">
              <span class="first-label">{{ item?.leaveType }}</span>
              <span class="second-label">{{ item?.leaveReason }}</span>
              <span class="name-label">{{ item?.applicant }}</span>
              <span class="time-label">{{ item?.time }}</span>
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
            <div class="more-view" @click="() => $router.push('/userRecentPage')">
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
                <el-progress type="circle" :color="customColors" :percentage="item.job" />
                <div class="teacher-name">{{ item.name }}</div>
                <div class="teacher-bottom">
                  <div class="teacher-subject">{{ item.subject }}</div>
                  <div class="teacher-status">{{ item.status }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer2-child2">
          <div class="footer-title">
            <el-divider direction="vertical" />
            <div class="title-box">排课</div>
            <div class="more-view" @click="() => $router.push('/userRecentPage')">
              查看更多<span class="iconfont icon-Rightyou"></span>
            </div>
          </div>
          <div class="class-boxes">
            <div class="class-box" v-for="item in classList.arr" :key="item">
              <div class="class-left">
                <div class="class-left-top">
                  <div class="class-left-title">{{ item.title }}</div>
                  <div class="class-left-status">{{ item.status }}</div>
                </div>
                <div class="class-left-bottom">
                  {{ item.time }}
                </div>
              </div>
              <div class="class-right">
                <div class="class-right-box">
                  <div class="class-right-title">课时任务</div>
                  <div class="class-right-content">{{ item.assign }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">课程数量</div>
                  <div class="class-right-content">{{ item.class }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">未排课程</div>
                  <div class="class-right-content">{{ item.noCourse }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">参与教师</div>
                  <div class="class-teacher">
                    <div v-for="(teacher, index) in item.teachers" :key="teacher">
                      <img
                        src="@/assets/img/cat.jpeg"
                        class="class-teacher-img"
                        :style="{ transform: `translateX(${index * -10}px)` }"
                      />
                    </div>
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
        <div class="panel-box">
          <div class="iconfont icon-daichuli"></div>
          <div class="panel-word">待处理</div>
          <div class="panel-number">12</div>
          <div class="panel-button">查看</div>
        </div>
        <div class="panel-box">
          <div class="iconfont icon-daichuli1"></div>
          <div class="panel-word">待解决</div>
          <div class="panel-number">5</div>
          <div class="panel-button">查看</div>
        </div>
        <div class="panel-box">
          <div class="iconfont icon-zaixiankaoshi"></div>
          <div class="panel-word">待考试</div>
          <div class="panel-number">--</div>
          <div class="panel-button">查看</div>
        </div>
        <div class="panel-box">
          <div class="iconfont icon-yiwanchengdingdan"></div>
          <div class="panel-word">已完成</div>
          <div class="panel-number">23</div>
          <div class="panel-button">查看</div>
        </div>
      </div>
      <div class="right-box2">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">反馈</div>
          <div class="more-view" @click="() => $router.push('/userRecentPage')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="feedback-boxes">
          <div class="feedback-box" v-for="item in feedbackList.arr" :key="item">
            <div class="feedback-top">
              <div class="feedback-content">{{ item.content }}</div>
              <div class="feedback-class">{{ item.class }}</div>
            </div>
            <div class="feedback-bottom">
              <div class="feedback-bottom-top">
                <div class="feedback-identity">{{ item.identity }}</div>
                <div class="feedback-name">{{ item.name }}</div>
                <div class="feedback-status">{{ item.status }}</div>
              </div>
              <div class="feedback-time">{{ item.time }}</div>
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
import WOW from 'wow.js'
import Chart from '@/components/Chart.vue'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
const router = useRouter()

let searchValue = ref('') // 搜索内容
let userInfo = reactive([]) // 用户信息
const customColors = [
  { color: '#368eec', percentage: 50 },
  { color: '#f56c6c', percentage: 100 },
]
// const panelContents=[
//   {
//     content: '待处理',
//   },
//   {
//     content: '待解决',
//   },
//   {
//     content: '待处理',
//   },
//   {
//     content: '待处理',
//   },
// ]
let isDisable = reactive({
  arr: [],
})
let applicationList = reactive([
  {
    id: 124,
    title: '需要实习两天',
    // 申请时间
    time: '2025-2-8 15:30',
    // 请假开始时间
    leaveStartTime: '2025-2-10',
    // 请假天数
    leaveDays: '2',
    // 请假课程数量
    leaveCourseCount: '5',
    // 请假类型
    leaveType: '公假',
    // 申请事项
    leaveReason: '调课申请',
    // 申请人信息
    applicant: '赵六(N21452153)',
  },
  {
    id: 122,
    title: '外出学习（老吉大）',
    // 申请时间
    time: '2025-2-8 12:30',
    // 请假开始时间
    leaveStartTime: '2025-2-10',
    // 请假天数
    leaveDays: '1',
    // 请假课程数量
    leaveCourseCount: '2',
    // 请假类型
    leaveType: '事假',
    // 申请事项
    leaveReason: '代课申请',
    // 申请人信息
    applicant: '王五(N219856153)',
  },
])
let teacherList = reactive({
  arr: [
    {
      id: 0,
      name: '李华',
      subject: '物理',
      status: '教授',
      job: 70,
    },
    {
      id: 1,
      name: '王五',
      subject: '数据结构与算法',
      status: '教授',
      job: 68,
    },
    {
      id: 2,
      name: '李华',
      subject: '软件质量保证与测试',
      status: '教授',
      job: 61,
    },
    {
      id: 3,
      name: '王五',
      subject: '软件质量保证与测试',
      status: '教授',
      job: 40,
    },
  ],
})
let classList = reactive({
  arr: [
    {
      id: 0,
      title: '第一次排课',
      status: '已发布',
      time: '2025-2-8 15:30',
      assign: 122,
      class: 23,
      noCourse: 1,
      teachers: [
        {
          id: 0,
          name: '李华',
          subject: '物理',
          picture: '@/assets/img/book.png',
        },
        {
          id: 1,
          name: '华',
          subject: '物理',
          picture: '@/assets/img/cat.png',
        },
      ],
    },
    {
      id: 0,
      title: '第一次排课',
      status: '已发布',
      time: '2025-2-8 15:30',
      assign: 122,
      class: 23,
      noCourse: 1,
      teachers: [
        {
          id: 0,
          name: '李华',
          subject: '物理',
          picture: '@/assets/img/book.png',
        },
        {
          id: 1,
          name: '华',
          subject: '物理',
          picture: '@/assets/img/cat.png',
        },
      ],
    },
  ],
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
  const wow = new WOW({})
  wow.init()
  userStore.initialize()
  userInfo.push(...[userStore.user])
  console.log(userInfo)
  let chartDom1 = document.getElementById('chart1-content')
  console.log(userInfo, chartDom1)
  for (let i = 0; i < applicationList.length; i++) {
    isDisable.arr[i] = true
  }
  console.log(isDisable.arr)
})
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
    subtext: `{titleSize| 20 }{value|%}`,
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
          value: 20,
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
          value: 20,
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
    text: `{value|邀请好友}`,
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
    subtext: `{titleSize|61 }{value|%}`,
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
          name: 'rose 1',
          itemStyle: {
            color: '#DBDEE5',
          },
        },
        {
          value: 45,
          name: 'rose 2',
          itemStyle: {
            color: '#7ab25f',
          },
        },
      ],
    },
  ],
})
//点击快捷入口
function staticAnalysis(string) {
  //跳转页面
  console.log('点击')
  router.push(`../${string}`)
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
  width: 70%;
  font-size: 15px;
  margin: 0 auto;
  margin-top: 55px;
  display: grid;
  grid-template-columns: repeat(6, 10%);
  grid-gap: 10px 8%;

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
              background-color: $main-blue;
              color: #fff;
              border-radius: 5px;
              padding: 0 5px;
            }

            .second-label {
              margin-left: 5px;
              margin-right: 8px;
              background-color: #e6eaf2;
              color: $main-blue;
              border-radius: 5px;
              padding: 0 5px;
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
                  background-color: $yellow;
                  border-radius: 5px;
                  color: #fff;
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
        flex: 1;
        flex-direction: column;
        align-items: center;
        gap: 6px;

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
          cursor: pointer;
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
              background-color: $main-purple;
              color: #fff;
              padding: 0 5px;
              border-radius: 5px;
              font-size: 11px;
            }

            .feedback-time {
              color: $word-grey-color;
            }

            .feedback-status {
              color: $red-word;
              background-color: $red-back;
              padding: 0 5px;
              font-size: 11px;
              border-radius: 2px;
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
