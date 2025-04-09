<template>
  <div class="component-box">
    <div class="search-word"><img src="@/assets/img/word-special.png" /></div>
    <div class="search-box">
      <el-input
        v-model="searchValue"
        class="search-content"
        placeholder="查看课表、考试安排、申请等"
      />
      <el-button color="#065fed">搜索</el-button>
    </div>
  </div>
  <div class="main-box">
    <div class="module">
      <div class="module-boxes">
        <div class="module-box">
          <img src="@/assets/3D/3-t.png" @click="staticAnalysis('course/main', true)" />
          <div @click="staticAnalysis('course')">课程安排</div>
        </div>
        <div class="module-box">
          <img src="@/assets/3D/0-t.png" @click="staticAnalysis('course/main')" />
          <div @click="staticAnalysis('arrange')">考试安排</div>
        </div>
        <div class="module-box">
          <img src="@/assets/3D/private.png" @click="staticAnalysis('feedback')" />
          <div @click="staticAnalysis('feedback')">我的反馈</div>
        </div>
        <div class="module-box">
          <img src="@/assets/3D/book-search.png" @click="staticAnalysis('arrange', false)" />
          <div @click="staticAnalysis('exam')">近日安排</div>
        </div>
      </div>
      <div class="module-top">
        <div class="wow fadeInLeft pulse chart1">
          <div class="chart-content1">
            <chart :option="chartOption1" />
          </div>
        </div>
        <div class="wow fadeInLeft chart2">
          <div class="chart-content2">
            <chart :option="chartOption2" />
          </div>
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
            <div class="title-box">通知</div>
            <div class="more-view" @click="() => $router.push('/student/functionPage/information')">
              查看<span class="iconfont icon-Rightyou"></span>
            </div>
          </div>
          <div class="information-boxes">
            <div class="information-box" v-for="item in notificationList.arr" :key="item.id">
              <div class="information-title">{{ item.title }}</div>
              <div class="information-detail">
                <span>{{ item.content }}</span>
              </div>
              <div class="information-bottom">
                <div class="first-label" :class="'first-label' + item.type">
                  {{ item.typeText }}
                </div>
                <div class="second-label" :class="'second-label' + item.type">
                  {{ item.category }}
                </div>
                <div class="name-label">{{ item.publisher }}</div>
                <div class="time-label">{{ item.publishTime }}</div>
              </div>
            </div>
            <div v-if="notificationList.length === 0">
              <el-empty description="暂无通知" :image-size="130" />
            </div>
          </div>
          <div><img src="@/assets/img/book.png" class="information-img" /></div>
        </div>
        <div class="wow fadeInUp module-bottom footer2">
          <div class="footer2-child1">
            <div class="footer-title">
              <el-divider direction="vertical" />
              <div class="title-box">课程安排</div>
            </div>
            <div class="class-box">
              <div class="class-left">
                <div class="class-left-top">
                  <div class="class-left-title">{{ classX.arr.taskName }}</div>
                  <div class="class-left-status class-status1">参与</div>
                </div>
                <div class="class-left-bottom">
                  {{ classX.arr.startTime }}
                </div>
              </div>
              <div class="class-right">
                <div class="class-right-box">
                  <div class="class-right-title">课时任务</div>
                  <div class="class-right-content">{{ classX.arr.totalClassHours }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">课程数量</div>
                  <div class="class-right-content">{{ classX.arr.totalCourseSize }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">班级数量</div>
                  <div class="class-right-content">{{ classX.arr.totalClassSize }}</div>
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
                  <div class="class-right-content">
                    {{ classX.arr.totalCourseSize - classX.arr.successCourseSize }}
                  </div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">参与教师</div>
                  <div class="class-teacher">
                    {{ classX.arr.createdByName }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer2-child2">
            <div class="footer-title">
              <el-divider direction="vertical" />
              <div class="title-box">我的反馈</div>
              <div class="more-view" @click="staticAnalysis('feedback', false)">
                查看更多<span class="iconfont icon-Rightyou"></span>
              </div>
            </div>
            <div class="feedback-boxes">
              <div class="feedback-box" v-for="item in feedbackList.arr" :key="item">
                <div class="feedback-top">
                  <div class="feedback-content">{{ item.leaveReason }}</div>
                  <div class="feedback-class">{{ item.class }}</div>
                </div>
                <div class="feedback-bottom">
                  <div class="feedback-bottom-top">
                    <div class="feedback-identity student-identity">
                      {{ item?.title }}
                    </div>
                    <div class="feedback-name">{{ item?.name }}</div>
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
              <div v-if="feedbackList.arr.length == 0">
                <el-empty description="暂无反馈" :image-size="130" />
              </div>
            </div>
            <div v-if="feedbackList.arr.length != 0">
              <img src="@/assets/img/book.png" class="information-img" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wow fadeInRight right-boxes">
      <div class="right-box">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">安排</div>
          <div class="more-view" @click="() => $router.push('/teacher/functionPage/arrange')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="arrage-box">
          <div>今日课程:</div>
          <div class="arrage-content">
            <div class="arrage-content-title">{{ date }}</div>
            <div class="arrage-content-boxes">
              <div class="arrage-content-box">
                <div class="icon-box"><span class="iconfont icon-banji"></span></div>
                <div>
                  <span>课时&nbsp;&nbsp;</span> <span class="arrage-content-number">2</span>
                </div>
              </div>
              <div class="arrage-content-box">
                <div class="icon-box"><span class="iconfont icon-kecheng"></span></div>
                <div>
                  <span>课程&nbsp;&nbsp;</span> <span class="arrage-content-number">1</span>
                </div>
              </div>
            </div>
            <div class="arrage-course">
              <el-carousel direction="vertical" type="card" :autoplay="false">
                <el-carousel-item v-for="item in courseList.arr" :key="item">
                  <div class="course-box">
                    <div class="course-box-top">
                      <div class="course-title">{{ item.courseName }}</div>
                      <div class="course-time">
                        {{ getCourseTime('start', item.timeStart) }} --
                        {{ getCourseTime('end', item.timeStart + 1) }}
                      </div>
                    </div>
                    <div class="course-box-bottom">
                      <div class="course-room">{{ item.classroomName }}</div>
                      <div class="course-class">{{ item.teachingClassName }}</div>
                      <div class="course-teacher">{{ item.teacherName }}</div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="arrge-bottom">
            <div>今日建议:</div>
            <div class="suggestion">
              {{ suggestion }}
            </div>
            <div class="arrage-bottom-content">
              <div style="display: flex; justify-content: center">
                <el-button color="#547bf1" plain>知道了</el-button>
                <el-button color="#547bf1">提醒我</el-button>
              </div>
              <div
                class="button-word"
                @click="() => $router.push('/student/functionPage/feedback')"
              >
                有事? 去申请调课或换课
              </div>
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
import { setTimetableAPI } from '@/apis/timetable'
import { getCourseSchedulingAPI } from '@/apis/course'
import { getFeedbackAPI } from '@/apis/feedback'
import { ElMessage } from 'element-plus'
import chart from '@/components/chart.vue'
const suggestion = ref('') //建议
const router = useRouter()
const searchValue = ref('') //搜索内容
let courseList = reactive({
  arr: [
    // {
    //   courseName: '数据库设计',
    //   classroom: '三教7503',
    //   startTime: '8:00',
    //   endTime: '9:40',
    //   class: '22级4班',
    //   classNumber: '50人',
    //   major: '软件工程',
    // },
    // {
    //   courseName: '计算机网络',
    //   classroom: '三教7504',
    //   startTime: '14:30',
    //   endTime: '15:50',
    //   class: '22级3班',
    //   classNumber: '50人',
    //   major: '软件工程',
    // },
    // {
    //   courseName: '计算机网络',
    //   classroom: '三教7503',
    //   startTime: '14:30',
    //   endTime: '15:50',
    //   class: '22级2班',
    //   classNumber: '50人',
    //   major: '软件工程',
    // },
  ],
})
let classX = reactive({
  arr: {},
})
let feedbackList = reactive({
  arr: [],
})
// 通知列表数据
let notificationList = reactive({
  arr: [
    {
      id: 1,
      title: '数据库设计课程安排通知',
      content:
        '请各位同学注意，下周一上午8:00-9:40在三教7503教室上数据库设计课程，请提前10分钟到达教室。',
      type: 1,
      typeText: '课程',
      category: '必修课',
      publisher: '张老师',
      publishTime: '2024-03-20 10:30',
    },
    {
      id: 2,
      title: '计算机网络期中考试提醒',
      content: '计算机网络课程将于下周三下午14:30-16:30在三教7504进行期中考试，请同学们做好准备。',
      type: 2,
      typeText: '考试',
      category: '期中考试',
      publisher: '李老师',
      publishTime: '2024-03-19 15:20',
    },
    {
      id: 3,
      title: '软件工程课程调课通知',
      content: '因教师临时有事，原定于本周五的软件工程课程将调整至下周一同一时间段，教室不变。',
      type: 1,
      typeText: '课程',
      category: '调课通知',
      publisher: '王老师',
      publishTime: '2024-03-18 09:15',
    },
  ],
})
const panelContents = reactive({
  arr: [
    {
      content: '课时',
      title: '课时',
      value: 68,
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
      content: '待考试',
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

let isHoveredIconfont = ref(false) //是否移动到问号处
const date = ref('')
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
    text: `{value|学时统计}`,
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
          value: 20,
          name: '待完成',
          itemStyle: {
            color: '#DBDEE5',
          },
        },
        {
          value: 45,
          name: '已完成',
          itemStyle: {
            color: '#7ab25f',
          },
        },
      ],
    },
  ],
})
onMounted(async () => {
  //获取排课列表
  const res = await getCourseSchedulingAPI()
  // 过滤出状态为4的课表
  console.log(res.data)
  const filteredData = res.data.data.filter(item => item.taskStatus == 4)
  console.log(filteredData)
  if (filteredData.length > 0) {
    classX.arr = filteredData[0]
    classX.arr.startTime = classX.arr.startTime.replace('T', ' ')
  }
  //获取反馈列表
  const res3 = await getFeedbackAPI()
  console.log(res3.data)
  feedbackList.arr = res3.data.data.slice(0, 7)
  feedbackList.arr.forEach((item, index) => {
    feedbackList.arr[index].createdAt = item.createdAt.replace('T', ' ')
  })
  //获取日课表
  let calendarDate = new Date()
  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth() + 1
  const dateString = calendarDate.getDate()
  date.value = `${year}-${month}-${dateString}`
  const res1 = await setTimetableAPI('', date.value, '', '', '', '')
  console.log(res1.data)
  if (res1.data.code === 'B000001') {
    ElMessage.warning('系统繁忙，请稍后再试！')
  } else {
    courseList.arr = res1.data.data
  }
  //获取建议
  suggestion.value = localStorage.getItem('suggestion')
})
//点击快捷入口
function staticAnalysis(string, value) {
  console.log(`/student/functionPage/${string}`)
  if (value != null) {
    router.push(`/student/functionPage/${string}/?value=${value}`)
    return
  }
  router.push(`/student/functionPage/${string}`)
}
//获取上课时间
function getCourseTime(flag, time) {
  if (flag == 'start') {
    if (time == 0) return '8:00'
    else if (time == 1) return '8:55'
    else if (time == 2) return '10:10'
    else if (time == 3) return '10:25'
    else if (time == 4) return '11:05'
    else if (time == 5) return '14:30'
    else if (time == 6) return '15:25'
    else if (time == 7) return '16:20'
    else if (time == 8) return '17:15'
  } else {
    if (time == 1) return '8:45'
    else if (time == 2) return '9:40'
    else if (time == 3) return '10:55'
    else if (time == 4) return '11:50'
    else if (time == 5) return '15:15'
    else if (time == 6) return '16:10'
    else if (time == 7) return '17:05'
    else if (time == 8) return '18:00'
  }
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

.main-box {
  display: flex;
  justify-content: center;
  margin: 0 50px;
  margin-bottom: 50px;
  gap: 20px;
  .module {
    flex: 15;
    display: flex;
    flex-direction: column;
    align-items: center;

    .module-boxes {
      margin-left: 30px;
      color: $word-black-color;
      width: 68%;
      font-size: 15px;
      margin-top: 55px;
      display: grid;
      grid-template-columns: repeat(4, 18%);
      grid-gap: 10px 10%;

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
        height: 80px;
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
    .module-top {
      width: 100%;
      display: grid;
      grid-template-areas:
        'chart1 chart1 chart2 chart2 box box box box'
        'footer1 footer1 footer1 footer2 footer2 footer2 footer2 footer2';
      grid-template-rows: 160px 450px;
      grid-template-columns: repeat(8, 11%);
      grid-gap: 10px 1.7%;
      background-color: rgb(174, 208, 244, 0);
      margin-top: 18px;

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
          height: 100%;
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
      .chart-title2 {
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

        .information-img {
          height: 80px;
          position: absolute;
          bottom: 0;
          right: 10%;
        }

        .information-boxes {
          cursor: pointer;
          word-wrap: break-word;
          font-size: 14px;
          padding: 10px 5px 0 10px;

          .information-box {
            margin-bottom: 6px;
            padding: 5px 5px 5px 5px;
            border-radius: 5px;

            .information-title {
              margin-right: auto;
              margin-bottom: 5px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              text-overflow: ellipsis;
            }
            .information-detail {
              color: $grey;
              span {
                padding-left: 12px;
              }
              margin-bottom: 8px;
            }

            .information-bottom {
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

          .information-box:hover {
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

          .information-img {
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
  }
  .right-boxes {
    flex: 6;
    display: flex;
    margin: 30px 30px 0 0;
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
