<template>
  <div class="component-box">
    <div class="search-word"><img src="@/assets/img/word-special.png" /></div>
    <div class="search-box">
      <el-input
        v-model="searchValue"
        @keyup.enter="searchClick"
        class="search-content"
        placeholder="调休，排课安排，请假申请"
      />
      <el-button color="#065fed" @click="searchClick">搜索</el-button>
    </div>
  </div>
  <div class="module-boxes">
    <div class="module-box">
      <img src="@/assets/3D/3-t.png" @click="staticAnalysis('course/main', true)" />
      <div @click="staticAnalysis('course')">授课安排</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/book-search.png" @click="staticAnalysis('course/main', false)" />
      <div @click="staticAnalysis('exam')">监考安排</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/private.png" @click="staticAnalysis('application', true)" />
      <div @click="staticAnalysis('application')">我的申请</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/0-t.png" @click="staticAnalysis('application', false)" />
      <div @click="staticAnalysis('application')">我的反馈</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/1-t.png" @click="staticAnalysis('class')" />
      <div @click="staticAnalysis('class')">所教班级</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/book-search.png" @click="staticAnalysis('arrange')" />
      <div @click="staticAnalysis('arrange')">近日行程</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/2-t.png" @click="staticAnalysis('classroom')" />
      <div @click="staticAnalysis('classroom')">教室查询</div>
    </div>
  </div>
  <div class="middle-box">
    <div class="left-boxes">
      <div class="wow fadeInLeft pulse chart1">
        <div class="chart-content1">
          <Chart :option="chartOption1" />
        </div>
      </div>
      <div class="wow fadeInLeft chart2">
        <div class="chart-content2">
          <Chart :option="chartOption2" />
        </div>
        <el-dropdown @command="handleCommand2">
          <span class="el-dropdown-link"
            >{{ selectedOption2 }}<span class="iconfont icon-down"></span
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">近一周趋势</el-dropdown-item>
              <el-dropdown-item command="b">近两周趋势</el-dropdown-item>
              <el-dropdown-item command="c">近一月趋势</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="wow fadeInLeft panel">
        <div v-for="item in panelContents.arr" :key="item">
          <el-tooltip class="tooltip-box" :content="item.title" placement="bottom">
            <div class="panel-box">
              <div class="iconfont" :class="item.class" :style="'color: ' + item.color"></div>
              <div class="panel-word">{{ item.content }}</div>
              <div class="panel-number">{{ item.value }}</div>
              <div class="panel-button">查看</div>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="wow fadeInUp footer1">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">请假申请</div>
          <div class="more-view" @click="() => $router.push('/teacher/functionPage/application')">
            查看<span class="iconfont icon-Rightyou"></span>
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
                :class="isDisable?.arr[index] == true ? '' : 'disabled'"
              >
                <span>{{ item?.leaveStartTime }}</span>
                <span>{{ item?.leaveDays }} 天</span>
                <span>{{ item?.leaveCourseCount }} 大节课</span>
              </span>
            </span>
            <span class="application-bottom" @click="applicationClick(item.essayId)">
              <span class="first-label" :class="getLabel(item?.leaveType, true)">{{
                item?.leaveType
              }}</span>
              <span class="second-label" :class="getLabel(item?.leaveReason, false)">{{
                item?.leaveReason
              }}</span>
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
            <div class="title-box">课程安排</div>
          </div>
          <div class="class-box">
            <div class="class-left">
              <div class="class-left-top">
                <div class="class-left-title">{{ classX.title }}</div>
                <div
                  class="class-left-status"
                  :class="classX.status === '已发布' ? 'class-status1' : 'class-status2'"
                >
                  {{ classX.status }}
                </div>
              </div>
              <div class="class-left-bottom">
                {{ classX.time }}
              </div>
            </div>
            <div class="class-right">
              <div class="class-right-box">
                <div class="class-right-title">课时任务</div>
                <div class="class-right-content">{{ classX.assign }}</div>
              </div>
              <div class="class-right-box">
                <div class="class-right-title">课程数量</div>
                <div class="class-right-content">{{ classX.class }}</div>
              </div>
              <div class="class-right-box">
                <div class="class-right-title">
                  未排课程
                  <span
                    class="iconfont"
                    :style="{
                      opacity: isHoveredIconfont ? 0.8 : 1,
                      transform: isHoveredIconfont ? 'scale(0.8)' : 'scale(1)',
                    }"
                    :class="['iconfont', isHoveredIconfont ? 'icon-bangzhu' : 'icon-wenhao']"
                    @mouseenter="isHoveredIconfont = true"
                    @mouseleave="isHoveredIconfont = false"
                  ></span>
                </div>
                <div class="class-right-content">{{ classX.noCourse }}</div>
              </div>
              <div class="class-right-box">
                <div class="class-right-title">参与教师</div>
                <div class="class-teacher">
                  <div v-for="(teacher, index) in classX.teachers" :key="teacher">
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
        <div class="footer2-child2">
          <div class="footer-title">
            <el-divider direction="vertical" />
            <div class="title-box">我的反馈</div>
            <div class="more-view" @click="staticAnalysis('application', false)">
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
                  <div
                    class="feedback-identity"
                    :class="item?.identity === 'teacher' ? 'teacher-identity' : 'student-identity'"
                  >
                    {{ item?.identity }}
                  </div>
                  <div class="feedback-name">{{ item?.name }}</div>
                  <div
                    class="feedback-status"
                    :class="item.status === '已解决' ? 'green-status' : 'red-status'"
                  >
                    {{ item.status }}
                  </div>
                </div>
                <div class="feedback-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
          <div><img src="@/assets/img/book.png" class="application-img" /></div>
        </div>
      </div>
    </div>
    <div class="wow fadeInRight right-boxes">
      <div class="right-box">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">安排</div>
          <div class="more-view" @click="() => $router.push('/teacher/functionPage/course/main')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="arrage-box">
          <div>今日暂无课程，明日课程:</div>
          <div class="arrage-content">
            <div class="arrage-content-title">2024年10月22日</div>
            <div class="arrage-content-boxes">
              <div class="arrage-content-box">
                <div class="icon-box"><span class="iconfont icon-banji"></span></div>
                <div>
                  <span>课时&nbsp;&nbsp;</span> <span class="arrage-content-number">6</span>
                </div>
              </div>
              <div class="arrage-content-box">
                <div class="icon-box"><span class="iconfont icon-kecheng"></span></div>
                <div>
                  <span>班级&nbsp;&nbsp;</span> <span class="arrage-content-number">3</span>
                </div>
              </div>
            </div>
            <div class="arrage-course">
              <el-carousel direction="vertical" type="card" :autoplay="false">
                <el-carousel-item v-for="item in courselist.arr" :key="item">
                  <div class="course-box">
                    <div class="course-box-top">
                      <div class="course-title">{{ item.courseName }}</div>
                      <div class="course-time">{{ item.startTime }}--{{ item.endTime }}</div>
                    </div>
                    <div class="course-box-bottom">
                      <div class="course-room">{{ item.classroom }}</div>
                      <div class="course-major">{{ item.major }}</div>
                      <div class="course-class">{{ item.class }}</div>
                      <div class="course-number">{{ item.classNumber }}</div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="arrge-bottom">
            <div>明日建议:</div>
            <div class="suggestion">
              你有两堂连堂课程，分别在第二、三节课，课间休息时间较短,请提前准备好下节课所需的教学资料，避免匆忙。且这两堂课的教室位于教学楼的不同楼层，课间记得合理安排时间前往教室，以免迟到
            </div>
            <div class="arrage-bottom-content">
              <div style="display: flex; justify-content: center">
                <el-button color="#547bf1" plain>知道了</el-button>
                <el-button color="#547bf1">提醒我</el-button>
              </div>
              <div class="button-word">有事? 去申请调课或换课</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
// import { getLeaveListAPI } from '@/apis/application'
import '@/assets/iconfont/iconfont.css'
import WOW from 'wow.js'
import Chart from '@/components/Chart.vue'
const userStore = useUserStore()
const router = useRouter()

let isHoveredIconfont = ref(false) //是否移动到问号处
let searchValue = ref('') // 搜索内容
let userInfo = reactive([]) // 用户信息
const panelContents = reactive({
  arr: [
    {
      content: '待审核',
      title: '申请',
      value: 12,
      color: '#FFAB91',
      class: 'icon-daichuli',
    },
    {
      content: '待解决',
      title: '反馈',
      value: 5,
      color: '#6C54F1',
      class: 'icon-daichuli1',
    },
    {
      content: '待监考',
      title: '考试',
      value: '--',
      color: '#ed8b31',
      class: 'icon-zaixiankaoshi',
    },
    {
      content: '已完成',
      title: '课时',
      value: 23,
      color: '#7ab25f',
      class: 'icon-yiwanchengdingdan',
    },
  ],
})
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
let classX = reactive({
  id: 0,
  title: '第一次排课',
  status: '参与',
  time: '2025-2-8 15:30',
  assign: 122,
  course: 120,
  class: 3,
  noCourse: 1,
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
let courselist = reactive({
  arr: [
    {
      courseName: '数据库设计',
      classroom: '三教7503',
      startTime: '8:00',
      endTime: '9:40',
      class: '22级4班',
      classNumber: '50人',
      major: '软件工程',
    },
    {
      courseName: '计算机网络',
      classroom: '三教7504',
      startTime: '14:30',
      endTime: '15:50',
      class: '22级3班',
      classNumber: '50人',
      major: '软件工程',
    },
    {
      courseName: '计算机网络',
      classroom: '三教7503',
      startTime: '14:30',
      endTime: '15:50',
      class: '22级2班',
      classNumber: '50人',
      major: '软件工程',
    },
  ],
})
// charts图标选中
let selectedOption2 = ref('近一周趋势')

onMounted(async () => {
  const wow = new WOW({})
  wow.init()
  userStore.initialize()
  userInfo.push(...[userStore.user])
  for (let i = 0; i < applicationList.length; i++) {
    isDisable.arr[i] = true
  }
  // const leaveList = await getLeaveListAPI()
  // console.log(leaveList)
})
//获取颜色
function getLabel(content, number) {
  if (number == true) {
    if (content === '事假') {
      return 'first-label1'
    } else if (content === '公假') {
      return 'first-label2'
    } else {
      return 'first-label3'
    }
  } else {
    if (content === '调课申请') {
      return 'second-label1'
    } else if (content === '代课申请') {
      return 'second-label2'
    } else {
      return 'second-label3'
    }
  }
}
//点击搜索
async function searchClick() {
  if (searchValue.value == '' || searchValue.value == null) {
    ElMessage.warning('输入内容不能为空！')
    return
  }
  router.push(`/function/teacher/${searchValue.value}`)
}

async function handleCommand2(command) {
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
      radius: [15, 55],
      center: ['58%', '52%'],
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
function staticAnalysis(string, value) {
  if (value != null) {
    router.push(`/teacher/functionPage/${string}/?value=${value}`)
    return
  }
  router.push(`/teacher/functionPage/${string}`)
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
    flex: 8;
    display: grid;
    grid-template-areas:
      'chart1 chart1 chart2 chart2 box box box box'
      'footer1 footer1 footer1 footer2 footer2 footer2 footer2 footer2';
    grid-template-rows: 160px 450px;
    grid-template-columns: repeat(8, 11%);
    grid-gap: 10px 1.7%;
    margin-right: 10px;
    background-color: rgb(174, 208, 244, 0);

    @media (max-width: 765px) {
      flex: 4;
      grid-template-rows: 175px 175px 500px;
      grid-template-areas:
        'chart1 chart1 chart1 chart1 chart2 chart2 chart2 chart2'
        'box box box box box box box box'
        'footer1 footer1 footer1 footer1 footer1 footer1 footer1 footer1';
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      flex: 4;
      grid-template-rows: 175px 175px 500px;
      grid-template-areas:
        'chart1 chart1 chart1 chart1 chart2 chart2 chart2 chart2'
        'box box box box box box box box'
        'footer1 footer1 footer1 footer1 footer2 footer2 footer2 footer2';
    }

    > div {
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
      background-color: #fff;
    }

    .el-dropdown {
      cursor: pointer;
    }

    .chart1,
    .chart2,
    .box {
      border-radius: 10px;

      @media (max-width: 765px) {
      }

      @media (min-width: 765px) and (max-width: 1300px) {
        padding-bottom: 0%;
      }

      @media (min-width: 1300px) {
      }
      .chart-content1,
      .chart-content2 {
        height: 69%;
        width: 94%;
        padding: 0 3%;
        margin-top: 3%;
        border-radius: 10%;
      }
      .chart-content1 {
        height: 80%;
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
        border: 1.5px solid #7ab25f;
        color: #7ab25f;
      }
    }

    .panel {
      grid-area: box;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-around;
      padding: 16px 0;

      .panel-box {
        display: flex;
        cursor: pointer;
        flex: 1;
        flex-direction: column;
        align-items: center;
        gap: 6px;

        .panel-button:hover {
          color: #fff;
          background-color: $main-blue;
          box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
        }

        .iconfont::before {
          font-size: 40px;
        }
        .panel-word {
          font-size: 14px;
          color: $word-shallow-color;
        }
        .panel-number {
          font-size: 24px;
          font-weight: 600;
        }
        .panel-button {
          font-size: 14px;
          color: $main-blue;
          border: 1px solid $main-blue;
          border-radius: 8px;
          padding: 0px 10px 1px 10px;
        }
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
              color: #fff;
              border-radius: 5px;
              padding: 0 5px;
            }

            .first-label1 {
              background-color: $main-blue;
            }
            .first-label2 {
              background-color: $main-purple;
            }
            .first-label3 {
              background-color: $word-grey-color;
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
              .class-status1 {
                background-color: $main-blue;
              }
              .class-status2 {
                background-color: $main-yellow;
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

                .iconfont {
                  transition:
                    opacity 0.3s ease,
                    transform 0.3s ease;
                }

                .iconfont::before {
                  font-size: 14px;
                  cursor: pointer;
                }
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

        .application-img {
          height: 80px;
          position: absolute;
          bottom: 0;
          right: 10%;
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

    .right-box {
      border-radius: 10px;
      height: 100%;
      position: relative;
      background-color: #fff;
      box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);

      .arrage-box {
        padding: 12px;
        .arrage-content {
          background-color: #ebf4ff;
          padding: 18px 10px 1px 10px;
          margin-top: 8px;
          margin-bottom: 8px;
          border-radius: 10px;

          .arrage-content-title {
            font-weight: 600;
            text-align: center;
          }

          .arrage-content-boxes {
            display: flex;
            justify-content: space-around;

            .arrage-content-box {
              background-color: #fff;
              border-radius: 12px;
              display: flex;
              padding: 10px 20px;
              justify-content: center;
              gap: 10px;
              margin-top: 10px;
              margin-bottom: 10px;
              align-items: center;

              .arrage-content-number {
                font-weight: 600;
                font-size: 16px;
              }
              .icon-box {
                background-color: #4282b0;
                color: #fff;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              .icon-banji::before {
                padding-left: 4px;
                font-size: 25px;
              }
              .icon-kecheng::before {
                font-size: 22px;
              }
            }
          }
          .arrage-course {
            margin: 10px auto;

            .course-box {
              padding: 8px 15px;

              .course-box-top {
                margin-bottom: 5px;
              }
              .course-box-top,
              .course-box-bottom {
                font-size: 12px;
                display: flex;
                .course-title {
                  margin-right: auto;
                  font-size: 15px;
                }

                .course-time {
                  font-size: 14px;
                  margin-top: 2px;
                }

                .course-number {
                  color: $word-grey-color;
                  padding: 1.5px 3px;
                }

                .course-room,
                .course-major {
                  color: #fff;
                  padding: 1.5px 5px;
                  border-radius: 5px;
                  background-color: $main-blue;
                  margin-right: 5px;
                }

                .course-major {
                  background-color: $blue-back;
                  color: $main-blue;
                }

                .course-class {
                  padding: 1.5px 3px;
                  color: $word-grey-color;
                  margin-right: auto;
                }
              }
            }
          }
        }

        .suggestion {
          padding: 5px 0;
          color: $word-grey-color;
          font-size: 14px;
        }

        .arrge-bottom {
          padding: 10px 0;
          margin: 0 auto;

          .button-word {
            font-size: 14px;
            color: $word-black-color;
            text-decoration: underline;
            cursor: pointer;
            text-align: center;
            margin-top: 10px;
          }
          .arrage-bottom-content {
            position: absolute;
            margin-bottom: 20px;
            width: calc(100% - 20px);
            bottom: 0;
          }
        }
      }
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
:deep(.el-carousel) {
  max-height: 170px;
}
:deep(.el-carousel__item) {
  height: 60px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
}
:deep(.el-carousel__item:not(.is-active)) {
  backdrop-filter: blur(50px);
  filter: blur(1px);
  -webkit-backdrop-filter: blur(50px);
  height: 60px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
}
</style>
