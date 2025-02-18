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
        <div id="chart1-content"></div>
        <el-dropdown @command="handleCommand1">
          <span class="el-dropdown-link"
            >{{ selectedOption1 }}<span class="iconfont icon-down"></span
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
      <div class="wow fadeInLeft chart2">
        <div id="chart2-content"></div>
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
        <div id="chart3-content"></div>
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
        <div id="chart4-content"></div>
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
          <div class="title-box">范本库</div>
          <div class="more-view" @click="() => $router.push('/userTemplatePage')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="template-boxes">
          <!-- <div
            class="template-box"
            v-for="(item, index) in templateList.slice(0, 6)"
            :key="item"
            @mouseenter="isDisable[index] = false"
            @mouseleave="isDisable[index] = true"
          >
            <span style="display: flex">
              <span class="template-title" @click="templateClick(item.essayId)">{{
                item?.essayTitle
              }}</span>
              <span
                @click="temLoadClick(item.essayId)"
                style="z-index: 10px; color: #4d4d4d; cursor: pointer"
                :class="isDisable[index] == true ? 'disabled' : ''"
              >
                下载
                <i class="iconfont icon-download1" style="margin-left: 5px"></i>
              </span>
            </span>
            <span class="template-bottom" @click="templateClick(item.essayId)">
              <span class="first-label" v-if="item.labelList && item.labelList.length > 0">{{
                item?.labelList[0]
              }}</span>
              <span class="second-label" v-if="item.labelList && item.labelList.length > 0">{{
                item?.labelList[1]
              }}</span>
              <span class="name-label">{{ item?.essayWriter }}</span>
              <span class="time-label">{{ item?.publicationTime }}</span>
            </span>
          </div> -->
        </div>
        <div><img src="@/assets/img/book.png" class="template-img" /></div>
      </div>
      <div class="wow fadeInUp footer2">
        <div class="footer-title">
          <el-divider direction="vertical" />
          <div class="title-box">最近分析记录</div>
          <div class="more-view" @click="() => $router.push('/userRecentPage')">
            查看更多<span class="iconfont icon-Rightyou"></span>
          </div>
        </div>
        <div class="analysis-boxes">
          <!-- <div
            class="analysis-box"
            v-for="item in recentAnalysisList.slice(0, 6)"
            :key="item"
            @click="analysisClick(item.fileMd5)"
          >
            <span class="analysis-top">
              <span class="analysis-md5">{{ item.fileMd5 }}</span>
              <span class="analysis-title">{{ item.fileName }}</span>
            </span>
            <span class="analysis-bottom">
              <el-progress :percentage="item.secureScore" :color="customColors"
                >{{ item.secureScore }} / 100</el-progress
              >
              <span class="first-label" :class="getLabelColor(item.apkDesc)">{{
                item.apkDesc
              }}</span>
              <span class="time-label">{{ item.detectedTime }}</span>
            </span>
          </div> -->
        </div>
        <div><img src="@/assets/img/book.png" class="template-img" /></div>
      </div>
    </div>
    <div class="wow fadeInRight right-boxes">
      <div class="footer-title">
        <el-divider direction="vertical" />
        <div class="title-box">签到</div>
        <div class="wow fadeInRight Gold">123</div>
      </div>
      <div class="button-box"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'
import WOW from 'wow.js'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
const router = useRouter()

let searchValue = ref('') //搜索内容
let userInfo = ref(null)
// charts图标选中
let selectedOption1 = ref('近一周趋势图')
let selectedOption2 = ref('近一周趋势图')
let selectedOption3 = ref('近一周趋势图')
let selectedOption4 = ref('近一周趋势图')
let myChart1 = ref()
let option1 = ref({})

onMounted(async () => {
  const wow = new WOW({})
  wow.init()
  userStore.initialize()
  userInfo.value = userStore.user
  console.log(userInfo.value)
  let chartDom1 = document.getElementById('chart1-content')
  console.log(userInfo.value, chartDom1)
  setChart1()
})
//点击搜索
async function searchClick() {
  if (searchValue.value == '' || searchValue.value == null) {
    ElMessage.warning('输入内容不能为空！')
    return
  }
  router.push(`/function/manager/${searchValue.value}`)
}

//下拉框的改变
async function handleCommand1(command) {
  console.log(command)
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

const setChart1 = () => {
  let chartDom1 = document.getElementById('chart1-content')
  myChart1.value = echarts.init(chartDom1)
  // 指定图表的配置项和数据
  option1.value = {
    title: {
      show: true,
      text: `{value|检测数量}`,
      subtext: `{value|平均}{titleSize| 1 }{value|次}`,
      textStyle: {
        color: '#065fed', //文字颜色
        fontSize: '18', //文字大小
        rich: {
          titleIcon: {
            backgroundColor: {
              image: '@/asset/echarts/bar-chart.png',
            },
            height: 15, // 可以只指定图片的高度，从而图片的宽度根据图片的长宽比自动得到。
            width: 16,
          },
        },
      },
      subtextStyle: {
        fontSize: '14',
        rich: {
          titleSize: {
            fontSize: '18',
            fontWeight: '600',
          },
        },
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
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
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false, // 坐标轴刻度线
        },
        axisLine: {
          // 轴线
          show: false,
        },
        splitLine: {
          // 网格线
          show: false,
        },
        axisLabel: {
          // 坐标轴标签
          show: false,
        },
        data: [1, 2, 3, 2, 1, 4, 5],
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: {
          show: false, // 坐标轴刻度线
        },
        axisLine: {
          // 轴线
          show: false,
        },
        splitLine: {
          // 网格线
          show: false,
        },
        axisLabel: {
          // 坐标轴标签
          show: false,
        },
        boundaryGap: false,
      },
    ],
    series: [
      {
        type: 'line',
        stack: 'Total',
        smooth: true,
        symbol: 'none',
        itemStyle: {
          color: '#547BF1',
        },
        emphasis: {
          focus: 'series',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#547BF1',
            },
            {
              offset: 1,
              color: '#EDF1FE',
            },
          ]),
        },
        symbolSize: 5,
        data: [1, 2, 3, 2, 1, 4, 4],
      },
    ],
  }
  console.log(option1)
  // 使用刚指定的配置项和数据显示图表。
  myChart1.value.setOption(option1)
}

//点击快捷入口
function staticAnalysis(string) {
  //跳转页面
  console.log('点击')
  router.push(`../${string}`)
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/default.scss';
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
    background-color: #fff;
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
      padding-bottom: 3%;
      border-radius: 10px;

      @media (max-width: 765px) {
      }

      @media (min-width: 765px) and (max-width: 1300px) {
        padding-bottom: 0%;
      }

      @media (min-width: 1300px) {
      }

      #chart1-content,
      #chart2-content,
      #chart3-content,
      #chart4-content {
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

        // display: flex;
        // justify-content: center;
        // align-content: center;
        #el-id-5859-0 {
          display: flex;
          justify-content: center;
          align-content: center;
        }

        .icon-down::before {
          font-size: 12px;
        }
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
      border-radius: 10px;
      position: relative;

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
          color: #7a7a7a;
          margin-right: 8px;
          cursor: pointer;
        }

        .iconfont::before {
          font-size: 12px;
        }
      }

      .template-img {
        height: 60px;
        position: absolute;
        bottom: 0;
        right: 10%;
      }
    }

    .footer1 {
      grid-area: footer1;

      .template-boxes {
        cursor: pointer;
        word-wrap: break-word;
        font-size: 14px;
        padding: 10px 5px 0 10px;

        .template-box {
          margin-bottom: 6px;
          padding: 5px 5px 5px 5px;
          border-radius: 5px;
          // border-bottom: 1px solid #ccc;

          .template-title {
            margin-right: auto;
            margin-bottom: 5px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
          }

          .template-bottom {
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            line-height: 20px;
            align-items: center;

            .first-label {
              background-color: $button-color;
              color: #fff;
              border-radius: 5px;
              padding: 0 5px;
            }

            .second-label {
              margin-left: 5px;
              margin-right: 8px;
              background-color: #e6eaf2;
              color: $button-color;
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

        .template-box:hover {
          background-color: #f3f5f8;
        }
      }
    }

    .footer2 {
      grid-area: footer2;

      @media (max-width: 765px) {
        display: none;
      }

      @media (min-width: 765px) and (max-width: 1024px) {
      }

      @media (min-width: 1024px) {
      }

      .analysis-boxes {
        word-wrap: break-word;
        font-size: 14px;
        padding: 10px 5px 0 10px;

        .analysis-box {
          border-radius: 10px;
          margin-bottom: 10px;
          padding: 5px 5px 5px 5px;
          // border-bottom: 1px solid #ccc;

          .template-title {
            margin-bottom: 5px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
          }

          .analysis-top {
            display: flex;
            word-wrap: break-word;
            flex-wrap: wrap;

            .analysis-md5 {
              word-wrap: break-word;
              white-space: pre-wrap;
              margin-right: auto;
            }

            .analysis-title {
              margin-right: 5px;
            }
          }

          .analysis-bottom {
            margin-top: 5px;
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            line-height: 20px;
            align-items: center;

            .el-progress {
              width: 250px;
              border-radius: 10px;
            }

            .first-label {
              color: #fff;
              border-radius: 5px;
              padding: 0 5px;
              margin-left: 8px;
            }

            .purpleLabel {
              background-color: $purple;
            }

            .yellowLabel {
              background-color: $yellow;
            }

            .greenLabel {
              background-color: $green;
            }
            .blackLabel {
              background-color: $word-black-color;
            }

            .greyLabel {
              background-color: $grey;
            }

            .redLabel {
              background-color: $red;
            }

            .time-label {
              margin-left: auto;
            }
          }
        }

        .analysis-box:hover {
          background-color: #f3f5f8;
        }
      }
    }
  }

  .right-boxes {
    flex: 3;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);

    .footer-title {
      display: flex;
      align-items: center;
      border-radius: 10px 10px 0 0;
      height: 55px;
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
        color: #7a7a7a;
        margin-right: 8px;
        cursor: pointer;
      }

      .iconfont::before {
        font-size: 16px;
      }

      .icon-jinbi1 {
        color: #f6a71b;
      }

      .Gold {
        margin-left: 5px;
        margin-right: 20px;
        color: #ea8930;
      }
    }

    .icon-weibiaoti1 {
      text-align: center;
    }

    .icon-weibiaoti1::before {
      color: #86c368;
      font-size: 6px;
    }

    .button-box {
      text-align: center;

      .el-button {
        width: 200px;
        display: inline-block;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
