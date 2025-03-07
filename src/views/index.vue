<template>
  <div class="main-container-all">
    <div :class="isMainPage"></div>
    <div class="ground" :class="isMainPage === 'banner1' ? 'ground-no-main' : ''">
      <div class="navigation" :class="isMainPage === 'banner1' ? '' : 'navigation-main'">
        <div class="navigation-tran">
          <div>
            <img src="@/assets/img/logo.png" class="navigation-logo" alt="logo" />
          </div>
          <div class="navigation-title" @click="() => $router.push('/manager/mainPage')"></div>
          <div
            class="navigation-box"
            v-if="router.currentRoute.value.fullPath !== '/manager/mainPage'"
            @click="navigationClick($event)"
          >
            <div value="course/main">计划表</div>
            <div value="scheduling">排课</div>
            <div value="schedule">排考</div>
            <div value="information">学校信息</div>
            <div value="analysis">统计分析</div>
            <div value="application">申请和反馈</div>
            <div value="manage">系统管理</div>
          </div>
        </div>
        <div class="blank-box"></div>
        <div class="navigation-icon" v-if="userInfo != null">
          <div style="display: flex">
            <el-dropdown class="dropdown-class" style="margin-top: 10px">
              <el-badge :value="1" class="icon-badge">
                <el-icon class="icon-bell">
                  <Bell />
                </el-icon>
              </el-badge>
              <template #dropdown>
                <div class="my-title" style="margin: 10px 0 0 15px; font-weight: 600">我的消息</div>
                <el-dropdown-menu style="padding-bottom: 10px">
                  <el-dropdown-item
                    v-for="item in messageContent"
                    :key="item"
                    style="width: 350px"
                    @click="messageClick(item.md5)"
                  >
                    <div>
                      <strong>{{ messageContent.apkName }}</strong> 已分析完毕
                    </div>
                    <div style="margin-left: auto; color: #757575">去查看 >></div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="messageContent.length == 0">
                    <div style="margin: 0 80px">
                      <el-empty description="暂无消息" />
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span
              class="iconfont icon-wenhao-xianxingyuankuang"
              @click="() => $router.push('/userIntroducePage')"
            ></span>
            <el-divider direction="vertical" class="divider" />
          </div>
          <el-dropdown>
            <span class="el-dropdown-link">
              <span class="portrait-box">
                <span class="portrait-nickname">{{ userInfo.name }}</span>
                <span class="iconfont icon-down1"></span>
              </span>
            </span>
            <template #dropdown>
              <div class="avatar">
                <div class="avatar-box">
                  <img :src="avatar" alt="头像" class="drop-img" />
                  <div>{{ userInfo.name }}</div>
                </div>
              </div>
              <el-dropdown-menu>
                <el-dropdown-item @click="personVisible = true">我的资料</el-dropdown-item>
                <el-dropdown-item @click="staticAnalysis('userMemberPage')"
                  >开通会员</el-dropdown-item
                >
                <el-dropdown-item @click="staticAnalysis('adminManagePage')"
                  >管理员端</el-dropdown-item
                >
                <el-dropdown-item @click="signOutClick"
                  ><span class="iconfont icon-exit"></span>退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, watchEffect, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/userStore'
import defaultAvatar from '@/assets/img/cat.jpeg' // 导入默认头像
import { Bell } from '@element-plus/icons-vue'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
const router = useRouter()
let myChart = ref(null) // logo 动画
let userInfo = ref(null) // 用户信息
let avatar = ref('') // 用户头像
let isMainPage = ref('banner1')
let messageContent = ref([]) // 消息栏的通知
onMounted(async () => {
  console.log('首页')
  setChart()
  userStore.initialize()
  userInfo.value = userStore.user
  avatar.value = userInfo.value.avatar ? userInfo.value.avatar : defaultAvatar
  let path = router.currentRoute.value.fullPath
  findActive(path)
})
// 监听路由变化
watchEffect(() => {
  const path = router.currentRoute.value.fullPath
  findActive(path) //是否显示导航栏
  if (path === '/manager/mainPage') {
    isMainPage.value = 'banner1'
  } else {
    isMainPage.value = 'banner2'
  }
})
function navigationClick(event) {
  const navigation = document.querySelectorAll('.navigation-box div')
  for (let x of navigation) {
    x.classList.remove('active')
  }
  event.target.classList.add('active')
  const value = event.target.getAttribute('value')
  console.log(`/manager/functionPage/${value}`)
  router.push(`/manager/functionPage/${value}`)
}
// 是否显示导航栏
function findActive(path) {
  let divList = document.querySelectorAll('.navigation-box div')
  if (path !== '/manager/mainPage' && divList.length > 0) {
    let activeIndex = 0
    if (path.includes('/course') || path.includes('/exam')) {
      activeIndex = 0
    } else if (path.includes('/scheduling')) {
      activeIndex = 1
    } else if (path.includes('/schedule')) {
      activeIndex = 2
    } else if (path.includes('/information')) {
      activeIndex = 3
    } else if (path.includes('/analysis')) {
      activeIndex = 4
    } else if (path.includes('/application')) {
      activeIndex = 5
    } else if (path.includes('/manage')) {
      activeIndex = 6
    }
    divList[activeIndex].classList.add('active')
  }
}
//退出登录
function signOutClick() {
  localStorage.removeItem('user')
  router.push('/login')
}

const setChart = () => {
  let chartDom = document.querySelector('.navigation-title')
  myChart.value = echarts.init(chartDom)
  // 指定图表的配置项和数据
  let option = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: 'Aurora',
            fontSize: 24,
            fontWeight: 'bold',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#116DFF',
            lineWidth: 1,
          },
          keyframeAnimation: {
            duration: 8000,
            loop: true,
            keyframes: [
              {
                percent: 0.5,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0],
                },
              },
              {
                // Stop for a while.
                percent: 0.1,
                style: {
                  fill: '#116DFF',
                },
              },
              {
                percent: 1,
                style: {
                  fill: '#116DFF',
                },
              },
            ],
          },
        },
      ],
    },
  }
  myChart.value.setOption(option)
}

onUnmounted(() => {
  // 销毁图表实例
  myChart.value.dispose()
  window.removeEventListener('resize', setChart)
})
</script>
<style scoped lang="scss">
.main-container-all {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background-color: #f2f6fd;
}
.banner1 {
  padding-top: 30px;
  background-image: url('@/assets/img/home-bg.png');
  background-size: cover;
  background-position: top;
  height: 500px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
}

.banner2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 500px;
  background-image: url('@/assets/img/svg.png');
  background-size: cover;
  z-index: 0;
}

.ground {
  flex-wrap: wrap;
  position: absolute;
  width: 100%;
  top: 0%;
  min-height: 100vh;
}

.ground-no-main {
  background-size: cover;
  background: linear-gradient(
    rgba(0, 103, 221, 0.3) 0%,
    rgb(205, 226, 252) 45%,
    rgb(174, 208, 244) 100%
  );
}

.navigation-main {
  background-color: #fff;
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.05);
}

.navigation {
  order: 1;
  padding: 10px 0 10px 60px;
  display: flex;
  flex-flow: row;

  @media (max-width: 765px) {
    padding-left: 20px;
  }

  @media (min-width: 765px) and (max-width: 1024px) {
    padding-left: 20px;
  }

  @media (min-width: 1024px) {
  }

  .navigation-tran {
    height: 40px;
    display: flex;
    flex: 3;

    @media (max-width: 765px) {
      flex: 1;
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      margin-left: 25px;
    }

    @media (min-width: 1024px) {
      margin-left: 50px;
    }

    .navigation-logo {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    .navigation-title {
      height: 45px;
      width: 120px;
    }
    .navigation-box {
      line-height: 45px;
      display: flex;
      margin-left: 2%;

      & > div {
        cursor: pointer;
        padding: 0 10px;
        padding-bottom: 10px;
        transition: all 0.1s;
        &:hover {
          color: $title-color;
        }
      }
      .active {
        font-weight: 600;
        color: $main-blue;
        border-bottom: 3px solid $main-blue;
      }
    }
  }

  .blank-box {
    flex: 1;

    @media (max-width: 765px) {
      display: none;
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      flex: 1;
    }

    @media (min-width: 1024px) and (max-width: 1300px) {
      flex: 1;
    }

    @media (min-width: 1300px) {
      flex: 2;
    }
  }

  .navigation-icon {
    display: flex;
    flex: 1;
    line-height: 40px;

    @media (max-width: 765px) {
      flex: 0.4;
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      flex: 0.6;
    }

    @media (min-width: 1024px) {
    }

    .el-dropdown-link {
      color: #000;
      line-height: 40px;
      padding-left: 5px;
      outline: none;
      border: none;
      box-shadow: none;
    }

    .el-divider {
      background-color: #414141;
      height: 40px;
      width: 1.5px;
      margin-right: 25px;
      border-left: 1px solid #414141;
    }

    .iconfont {
      margin-right: 15px;
      margin-left: 15px;
    }

    .icon-down1::before {
      font-size: 14px;
      margin-left: 3px;
    }

    .dropdown-class {
      .my-title {
        margin: 10px 0 0 10px;
        font-weight: 600;
      }

      .el-dropdown-menu {
        margin: 20px 5px;
      }

      .el-badge {
        color: #000;
        outline: none;
        border: none;
        box-shadow: none;
      }

      .icon-bell,
      .icon-bell svg {
        height: 22px;
        width: 22px;
        transform: translateX(2px);
      }
    }
  }

  .navigation-portrait {
    display: flex;
    line-height: 40px;
    height: 40px;

    .portrait-avatar {
      width: 40px;
      height: 40px;
      border-radius: 35px;
    }

    .portrait-nickname {
      font-size: 14px;
      margin-left: 10px;
    }

    .navigation-button {
      cursor: pointer;
    }

    .navigation-button:hover {
      color: #000;
    }
  }
}

.el-scrollbar {
  .avatar {
    display: flex;
    text-align: center;

    .avatar-box {
      margin: 5px auto;
      margin-top: 20px;

      .drop-img {
        border-radius: 50px;
        width: 50px;
        height: 50px;
        text-align: center;
        border-radius: 50px;
      }
    }

    .menu-item {
      margin-left: 20px;
    }
  }
}
</style>
