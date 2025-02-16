<template>
  <div class="navigation">
    <div class="navigation-tran">
      <div>
        <img src="@/assets/img/logo.png" class="navigation-logo" alt="logo" />
      </div>
      <div class="navigation-title" @click="() => $router.push('../../userMainPage')"></div>
    </div>
    <div class="blank-box"></div>
    <div class="navigation-icon" v-if="userInfo != null">
      <div style="display: flex">
        <el-dropdown class="dropdown-class" style="margin-top: 10px">
          <el-badge class="icon-badge">
            <span class="iconfont icon-lingdang-xianxing" style="color: #000"></span>
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
        <el-divider direction=" vertical" class="divider" />
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <span class="portrait-box">
            <span class="portrait-nickname">{{ userInfo.userName }}</span>
            <span class="iconfont icon-down1"></span>
          </span>
        </span>
        <template #dropdown>
          <div class="avatar">
            <div class="avatar-box">
              <img
                :src="userInfo?.userIconPath == '' ? require('@/assets/img/title.png') : avatar"
                class="drop-img"
              />
              <div>{{ userInfo.userName }}</div>
            </div>
          </div>
          <el-dropdown-menu>
            <el-dropdown-item @click="personVisible = true">我的资料</el-dropdown-item>
            <el-dropdown-item @click="staticAnalysis('userMemberPage')">开通会员</el-dropdown-item>
            <el-dropdown-item @click="staticAnalysis('adminManagePage')">管理员端</el-dropdown-item>
            <el-dropdown-item @click="signOutClick"
              ><span class="iconfont icon-exit"></span>&nbsp;退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <RouterView></RouterView>
</template>
<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useUserStore } from '@/stores/userStore'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
// logo 动画
let myChart = ref()
// 用户信息
let userInfo = ref(null)
let messageContent = ref([]) //消息栏的通知
onMounted(async () => {
  setChart()
  userStore.initialize()
  userInfo.value = userStore.user
  console.log(userInfo.value)
})
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
.navigation-logo {
  width: 40px;
  border-radius: 5px;
}

.navigation {
  padding: 10px 0 10px 60px;
  background-color: yellow;
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
    flex: 0.9;

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
  }

  .blank-box {
    flex: 3;

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
    flex: 0.7;
    line-height: 40px;

    @media (max-width: 600px) {
      flex: 1;
    }

    @media (min-width: 600px) and (max-width: 765px) {
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      flex: 1;
    }

    @media (min-width: 1024px) {
    }

    .el-dropdown-link {
      color: #000;
      line-height: 40px;
      padding-left: 5px;
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

      .icon-lingdang-xianxing {
        margin: 0;
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
</style>
