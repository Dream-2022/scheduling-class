<template>
  <div class="main-container-all">
    <div :class="isMainPage"></div>
    <div class="ground" :class="isMainPage === 'banner1' ? 'ground-no-main' : ''">
      <div class="navigation" :class="isMainPage === 'banner1' ? '' : 'navigation-main'">
        <div class="navigation-tran">
          <div>
            <img src="@/assets/img/logo.png" class="navigation-logo" alt="logo" />
          </div>
          <div
            class="navigation-title"
            @click="() => $router.push(`/${userStore.user.identity.toLowerCase()}/mainPage`)"
          ></div>
          <div
            v-if="
              router.currentRoute.value.fullPath !==
              `/${userStore.user.identity.toLowerCase()}/mainPage`
            "
            class="navigation-box"
          >
            <div
              v-for="item in navigationList.arr"
              :key="item"
              :value="item.value"
              @click="navigationClick($event)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="blank-box"></div>
        <div class="navigation-icon">
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
                      <strong>{{ item.apkName }}</strong> 已分析完毕
                    </div>
                    <div style="display: flex; justify-content: space-between; color: #757575">
                      <span>{{ item.timestamp }}</span>
                      <span>去查看 >></span>
                    </div>
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
                <span class="portrait-nickname">{{ userStore.user?.name }}</span>
                <span class="iconfont icon-down1"></span>
              </span>
            </span>
            <template #dropdown>
              <div class="avatar">
                <div class="avatar-box">
                  <img
                    v-if="userStore.user?.avatar != null"
                    class="drop-img"
                    :src="userStore.user?.avatar"
                    alt="头像"
                  />
                  <img class="drop-img" v-else src="@/assets/img/cat.jpeg" alt="头像" />
                  <div>{{ userStore.user?.name }}</div>
                  <div>（{{ userStore.user?.userId }}）</div>
                </div>
              </div>
              <el-dropdown-menu>
                <el-dropdown-item @click="personVisible = true">我的资料</el-dropdown-item>
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

  <el-dialog v-model="personVisible" title="个人资料" width="500">
    <div class="bindBox">
      <table class="table">
        <tbody>
          <tr class="tr">
            <td class="td">头像</td>
            <td class="td">
              <img
                v-if="userStore.user?.avatar != null"
                class="iconImg"
                :src="userStore.user?.avatar"
                alt="头像"
              />
              <img class="iconImg" v-else src="@/assets/img/cat.jpeg" alt="头像" />
            </td>
            <td class="td">
              <el-button size="small" color="#547BF1" @click="updateClick">更换头像</el-button>
              <input
                class="fileInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarChange"
              />
            </td>
          </tr>
          <tr class="tr">
            <td class="td">姓名</td>
            <td class="td">{{ userStore.user?.name }}</td>
            <td class="td"></td>
          </tr>
          <tr class="tr">
            <td class="td">{{ userStore.user.identity == 'STUDENT' ? '学号' : '工号' }}</td>
            <td class="td">{{ userStore.user?.userId }}</td>
            <td class="td"></td>
          </tr>
          <tr class="tr">
            <td class="td">职称</td>
            <td class="td">{{ userStore.user?.title }}</td>
            <td class="td"></td>
          </tr>
          <tr class="tr">
            <td class="td">所属院系</td>
            <td class="td">{{ userStore.user?.department }}</td>
            <td class="td"></td>
          </tr>
          <tr class="tr">
            <td class="td">邮箱</td>
            <td class="td">{{ userStore.user?.email == null ? '暂无' : userStore.user?.email }}</td>
            <td class="td"></td>
          </tr>
          <tr class="tr">
            <td class="td">{{ userStore.user.identity == 'STUDENT' ? '个人' : '教师' }}偏好</td>
            <td class="td">
              <div class="preference-box">
                <div class="preference">
                  <div>偏好课程</div>
                  <div
                    v-if="
                      userStore.user.preferredCourses &&
                      userStore.user.preferredCourses?.length != 0
                    "
                  >
                    <div v-for="item in userStore.user.preferredCourses" :key="item">
                      {{ item }}
                    </div>
                  </div>
                  <div v-else>暂未设置</div>
                </div>
                <div class="preference">
                  <div>偏好时间段</div>
                  <div
                    v-if="
                      userStore.user.preferredTimeSlots &&
                      userStore.user.preferredTimeSlots.length != 0
                    "
                  >
                    <div v-for="item in userStore.user.preferredTimeSlots" :key="item">
                      {{ getWeekDay(item.day) }} {{ item.start }} - {{ item.end }} 节
                    </div>
                  </div>
                  <div v-else>暂未设置</div>
                </div>
              </div>
            </td>
            <td class="td">
              <div>
                <el-button size="small" color="#547BF1" @click="revisePreferenceClick"
                  >修改</el-button
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="personVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="preferenceVisible" title="修改偏好" width="700">
    <div>
      <div class="preference-box" style="margin-left: 10px">
        <div class="preference">
          <div>偏好课程</div>
          <div>
            <el-select
              v-model="preferenceOption"
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
              placeholder="请输入或选择偏好课程"
              style="width: 520px"
            >
              <el-option v-for="item in filteredOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="preference">
          <div>偏好时间段</div>
          <div class="preference-times">
            <div class="preference-time" v-for="(item, index) in preferenceTimes.arr" :key="item">
              <el-select v-model="item.timeOption1" placeholder="选择偏好周几">
                <el-option
                  v-for="item in preferenceTimes1"
                  :key="item"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="item.timeOption2" placeholder="课程开始节次">
                <el-option
                  v-for="item in preferenceTimes2"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <el-select v-model="item.timeOption3" placeholder="课程结束节次">
                <el-option
                  v-for="item in preferenceTimes3"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div>
                <div
                  class="preference-time-text"
                  v-if="item.timeOption1 != '' && item.timeOption2 != '' && item.timeOption3 != ''"
                >
                  {{ getWeekDay(item.timeOption1) }} {{ item.timeOption2 }} -
                  {{ item.timeOption3 }} 节
                </div>
                <el-button type="danger" plain circle @click="deletePreferenceTimeClick(index)">
                  <el-icon class="el-icon--left"><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <el-button color="#547bf1" class="el-button-add" @click="addPreferenceTimeClick">
              添加
              <el-icon class="el-icon--left"><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="savePreference" color="#547bf1" plain>保存</el-button>
        <el-button @click="preferenceVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 智能小助手 -->
  <el-backtop :right="100" :visibility-height="0" @click="aiVisible = true" :bottom="100">
    <span class="iconfont icon-jiqiren"></span>
  </el-backtop>
  <el-drawer v-model="aiVisible" title="小来助手！" direction="ltr" size="400px">
    <div class="container">
      <div class="record-container">
        <div class="record-title">
          <div class="record-main">历史对话</div>
          <div class="record-count">14</div>
        </div>
        <div class="record-listes">
          <div class="record-list" v-for="item in reversedAndLimitedList" :key="item">
            <div class="icon-liaotian iconfont" :class="item.value == 1 ? 'blue' : ''"></div>
            <div class="list-title">{{ item.content }}</div>
          </div>
        </div>
      </div>
      <div class="chat-container">
        <div class="chat-title">新聊天</div>
        <div class="chat-history">
          <div v-for="(message, index) in chatHistory" :key="index">
            <div class="chat-message">
              <div v-if="message.sender != 'bot'">
                <img
                  class="avatar"
                  v-if="userStore.user?.avatar"
                  :src="userStore.user?.avatar"
                  alt="头像"
                />
                <img class="avatar" v-else src="@/assets/img/cat.jpeg" alt="头像" />
              </div>
              <div v-else class="message-avatar">
                <span class="iconfont icon-jiqiren"></span>
              </div>
              <div :class="['message-word', message.sender]" v-html="message.text"></div>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <el-input
            v-model="userInput"
            placeholder="请输入消息..."
            :suffix-icon="Microphone"
            @keyup.enter="sendMessage"
          />
          <el-button
            type="primary"
            color="#547bf1"
            @click="sendMessage"
            :icon="Promotion"
            circle
          ></el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { RouterView, useRouter } from 'vue-router'
import {
  ref,
  nextTick,
  reactive,
  watchEffect,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  computed,
} from 'vue'
import { Delete, Plus, Promotion, Microphone } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { useSseStore } from '@/stores/sseStore'
import { Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getCourseAllAPI } from '@/apis/course'
import { setPreferredCoursesAPI, preferenceTimesAPI } from '@/apis/preference'
import { editAvatarAPI } from '@/apis/user'
import { getAIAPI, getTitleAPI } from '@/apis/ai.js'
import '@/assets/iconfont/iconfont.css'

import WOW from 'wow.js'
let internalInstance = getCurrentInstance()
let echarts = internalInstance.appContext.config.globalProperties.$echarts

const userStore = useUserStore()
const sseStore = useSseStore()
const router = useRouter()
const aiVisible = ref(false) // 智能小助手
let myChart = ref(null) // logo 动画
let personVisible = ref(false) // 是否展示个人资料弹窗
let preferenceVisible = ref(false) // 是否展示修改偏好弹窗
const preferenceOptions = ref([])
const preferenceOption = ref([]) //偏好课程
const preferenceTimes1 = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 },
]
const recordList = ref([]) //对话的历史记录
const preferenceTimes2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
let preferenceTimes3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//修改资料时，当前选择的偏好时间
const preferenceTimes = reactive({ arr: {} })

let navigationList = reactive({
  arr: [],
})
let navigation1 = [
  {
    name: '计划表',
    value: 'course/main',
  },
  {
    name: '排课',
    value: 'scheduling',
  },
  {
    name: '排考',
    value: 'schedule',
  },
  {
    name: '学校信息',
    value: 'information',
  },
  {
    name: '统计分析',
    value: 'analysis',
  },
  {
    name: '申请和反馈',
    value: 'application',
  },
  {
    name: '系统管理',
    value: 'manage',
  },
]
let navigation2 = [
  {
    name: '计划表',
    value: 'course/main',
  },
  {
    name: '申请和反馈',
    value: 'application',
  },
  {
    name: '所教班级',
    value: 'class',
  },
  {
    name: '近日行程',
    value: 'arrange',
  },
  {
    name: '教室查询',
    value: 'classroom',
  },
]
let navigation3 = [
  {
    name: '计划表',
    value: 'course/main',
  },
  {
    name: '我的反馈',
    value: 'feedback',
  },
  {
    name: '今日安排',
    value: 'arrange',
  },
]
let isMainPage = ref('banner1')
let messageContent = ref([]) // 消息栏的通知
onMounted(async () => {
  const wow = new WOW({})
  wow.init()
  setChart()
  userStore.initialize()
  let path = router.currentRoute.value.fullPath
  const identity = userStore.user.identity.toLowerCase()
  navigationList.arr =
    identity === 'manager' ? navigation1 : identity === 'teacher' ? navigation2 : navigation3
  findActive(path, identity)
  //获取已有偏好信息
  preferenceOption.value = userStore.user.preferredCourses
  preferenceTimes.arr = userStore.user.preferredTimeSlots
    ? userStore.user.preferredTimeSlots.map(item => {
        return {
          timeOption1: item.day,
          timeOption2: item.start,
          timeOption3: item.end,
        }
      })
    : []
  //根据身份获取历史对话数据
  if (userStore.user.identity === 'STUDENT') {
    recordList.value = [
      { content: '如何处理提交的申请', value: 0 },
      { content: '排课过程有特殊要求的课程如何处理', value: 0 },
      { content: '如何查看课表', value: 0 },
    ]
  } else if (userStore.user.identity === 'TEACHER') {
    recordList.value = [
      { content: '请假流程介绍', value: 0 },
      { content: '如何对发布的课表进行反馈', value: 0 },
      { content: '怎么修改偏好教授的课程', value: 0 },
    ]
  } else {
    recordList.value = [
      { content: '如何查看课表', value: 0 },
      { content: '上课建议', value: 0 },
      { content: '如何查看学校信息', value: 0 },
    ]
  }
  //获取通知连接
  fetchNotificationConnection()
})

//获取通知连接
async function fetchNotificationConnection() {
  const eventSource = sseStore.setEventSource()
  console.log(eventSource)

  eventSource.onmessage = event => {
    const data = event.data
    console.log('收到新消息:', data)
    // 将新消息添加到消息列表的开头
    messageContent.value.unshift({
      apkName: data.apkName,
      md5: data.md5,
      timestamp: new Date().toLocaleString(),
    })
    // 限制消息列表长度，保持最新的10条消息
    if (messageContent.value.length > 10) {
      messageContent.value = messageContent.value.slice(0, 10)
    }
  }
}
let reversedAndLimitedList = computed(() => {
  return recordList.value.slice().reverse().slice(0, 3)
})
const userInput = ref('') //用户输入
const chatHistory = ref([{ sender: 'bot', text: '你好！我是小来助手，有什么可以帮您的？' }])

const sendMessage = async () => {
  if (!userInput.value.trim()) {
    ElMessage.warning('请输入消息！')
    return
  }
  chatHistory.value.push({ sender: 'user', text: userInput.value })
  let content = userInput.value
  userInput.value = ''
  const res1 = await getTitleAPI(content)
  console.log(res1.data)
  recordList.value.push({ content: res1.data, value: 1 })
  const res = await getAIAPI(content)
  // 添加 AI 消息的占位符
  chatHistory.value.push({ sender: 'bot', text: '' })
  let aiMessage = res.data
  let index = 0
  let currentText = ''
  const aiMessageIndex = chatHistory.value.length - 1
  function typeNextCharacter() {
    if (index < aiMessage.length) {
      // 处理 HTML 标签和换行符
      const nextChar = aiMessage[index++]
      currentText += nextChar
      // 替换换行符为 <br> 标签
      chatHistory.value[aiMessageIndex].text = formatText(currentText)
      setTimeout(typeNextCharacter, 15) // 逐字打印速度
    }
  }
  typeNextCharacter()
}
// 解析 HTML 内容的函数
function formatText(text) {
  // 将 \n 替换为 <br> 标签
  return text.replace(/\n/g, '<br>')
}
//点击更换头像
function updateClick() {
  let fileInput = document.querySelector('.fileInput')
  if (fileInput) {
    fileInput.click()
  }
}
//确认修改头像
const handleAvatarChange = async event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async e => {
      const dataUrl = e.target.result
      // 将 DataURL 转换为 Blob
      const byteCharacters = atob(dataUrl.split(',')[1])
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      const timestamp = Date.now()
      const newFile = new File([blob], `${timestamp}.png`, { type: 'image/jpeg' })
      let res = await editAvatarAPI(newFile)
      if (res.data.code == 0) {
        ElMessage.success('头像上传成功！')
        userStore.setAvatar(res.data.data)
      }
    }
    reader.readAsDataURL(file)
  }
}

// 监听路由变化
watchEffect(() => {
  const path = router.currentRoute.value.fullPath
  const identity = userStore.user.identity.toLowerCase()
  findActive(path, identity) //是否显示导航栏
  if (path === `/${identity}/mainPage`) {
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
  router.push(`/${userStore.user.identity.toLowerCase()}/functionPage/${value}`)
}
//修改偏好
async function revisePreferenceClick() {
  preferenceVisible.value = true
  if (userStore.user.identity != 'STUDENT') {
    const res = await getCourseAllAPI()
    preferenceOptions.value = res.data.data
  }
}
//点击添加时间偏好
function addPreferenceTimeClick() {
  preferenceTimes.arr.push({
    timeOption1: '',
    timeOption2: '',
    timeOption3: '',
  })
}
//删除时间偏好
function deletePreferenceTimeClick(index) {
  preferenceTimes.arr.splice(index, 1)
}
//保存偏好设置
async function savePreference() {
  let times = ''
  let flag = false
  preferenceTimes.arr.forEach(item => {
    if (!item.timeOption1 || !item.timeOption2 || !item.timeOption3) {
      ElMessage.error('请补全或未填写完整的字段！')
      flag = true
      return
    }
    if (item.timeOption2 > item.timeOption3) {
      ElMessage.error('时间偏好不符合规范！')
      flag = true
      return
    }
    if (times == '') {
      times = item.timeOption1 + ':' + item.timeOption2 + '-' + item.timeOption3
    } else {
      times += ',' + item.timeOption1 + ':' + item.timeOption2 + '-' + item.timeOption3
    }
  })
  if (flag) {
    return
  }
  let courses = preferenceOption.value.join(',')
  const res = await preferenceTimesAPI(times)
  const res1 = await setPreferredCoursesAPI(courses)
  if (res.data.code == 0 && res1.data.code == 0) {
    const newArr = preferenceTimes.arr.map(item => {
      return {
        day: item.timeOption1,
        start: item.timeOption2,
        end: item.timeOption3,
      }
    })
    userStore.setPreference(preferenceOption.value, newArr)
    ElMessage.success('修改偏好成功！')
  } else {
    ElMessage.error('修改偏好失败，请检查网络！')
  }
  preferenceVisible.value = false
  personVisible.value = false
}
// 是否显示导航栏
function findActive(path, identity) {
  nextTick(() => {
    let divList = document.querySelectorAll('.navigation-box div')
    for (let x of divList) {
      x.classList.remove('active')
    }
    if (path !== `/${identity}/mainPage` && divList.length > 0) {
      let activeIndex = 0
      if (identity === 'manager') {
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
      } else if (identity === 'teacher') {
        if (path.includes('/course')) {
          activeIndex = 0
        } else if (path.includes('/application')) {
          activeIndex = 1
        } else if (path.includes('/classroom')) {
          activeIndex = 4
        } else if (path.includes('/class')) {
          activeIndex = 2
        } else if (path.includes('/arrange')) {
          activeIndex = 3
        }
      } else if (identity === 'student') {
        if (path.includes('/course')) {
          activeIndex = 0
        } else if (path.includes('/feedback')) {
          activeIndex = 1
        } else if (path.includes('/arrange')) {
          activeIndex = 2
        }
      }
      divList[activeIndex].classList.add('active')
    }
  })
}
//退出登录
function signOutClick() {
  localStorage.removeItem('user')
  router.push('/login')
  ElMessage.success('退出成功，正在为你跳转到登录页面...')
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
//避免课程重复选择
const filteredOptions = computed(() => {
  return preferenceOptions.value.filter(item => !preferenceOption.value.includes(item))
})
//获取是周几
const getWeekDay = day => {
  if (day === 1) return '周一'
  if (day === 2) return '周二'
  if (day === 3) return '周三'
  if (day === 4) return '周四'
  if (day === 5) return '周五'
  if (day === 6) return '周六'
  if (day === 7) return '周七'
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
  overflow: auto;
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
  position: fixed;
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
    flex: 5;

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
    flex: 0.5;

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
    flex: 1.5;
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
.table {
  border: 1px solid #eceffe;
  border-radius: 10px;
  border-collapse: collapse;
  box-sizing: border-box;
  width: 100%;

  .tr:last-child {
    border: 0px;
  }
  .tr:nth-child(1) {
    height: 80px;
    line-height: 80px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .tr {
    display: flex;
    justify-content: space-between;
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #eceffe;
    margin-left: 20px;
    margin-right: 20px;
    .iconImg {
      border-radius: 50px;
      width: 80px;
    }
    .td {
      flex: 1;
    }

    .td:nth-child(1) {
      color: $word-grey-color;
    }
    .td:nth-child(2) {
      display: flex;
      justify-content: left;
      flex: 2;
    }

    .td:nth-child(3) {
      display: flex;
      justify-content: right;
      align-items: center;
      flex: 0.5;
    }

    .homeUserInfoAvatar {
      width: 50px;
      height: 50px;
      margin-top: 15px;
      border-radius: 50%;
    }

    .fileTd {
      line-height: 10px;
      display: flex;
      align-items: center;
      justify-content: left;
    }
  }
  .tr:last-child {
    height: auto;
  }
}
.preference-box {
  margin-top: 12px;
  line-height: 30px;
  display: flex;
  flex-direction: column;

  .preference {
    display: flex;
    margin-bottom: 10px;

    > div:first-child {
      min-width: 100px;
      text-align: left;
      color: $word-grey-color;
    }
    > div:nth-child(2) {
      text-align: left;
      flex: 1;
    }
    .preference-times {
      .preference-time {
        display: flex;
        border-radius: 5px;
        margin-right: 30px;
        gap: 10px;
        margin-bottom: 6px;

        &:hover {
          cursor: pointer;
          background-color: #fff;
          .el-button {
            display: block;
          }
        }
        > div {
          flex: 1;
        }
        > div:last-child {
          display: flex;
        }
        .preference-time-text {
          font-size: 14px;
          font-weight: 600;
        }
        .el-button {
          margin-left: 10px;
          display: none;
        }
        .el-icon--left {
          font-size: 16px;
          font-weight: 600;
        }
      }
      .el-button-add {
        height: 30px;
      }
    }
  }
}

.el-backtop {
  box-shadow: 0 2px 6px 1px rgba(184, 209, 255, 0.5);
  width: 70px;
  height: 70px;
  .icon-jiqiren::before {
    font-size: 35px;
  }
}
.el-overlay {
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .record-container {
    flex: 2;
    margin-bottom: 20px;
    .record-title {
      display: flex;
      line-height: 22px;
      margin-bottom: 10px;
      .record-main {
        font-weight: 600;
      }
      .record-count {
        font-size: 14px;
        border-radius: 8px;
        margin-left: 10px;
        padding-left: 5px;
        padding-right: 5px;
        background-color: $blue-back;
      }
    }
    .record-listes {
      .record-list {
        display: flex;
        cursor: pointer;
        padding: 15px 10px;
        border-top: 1px solid #ccc;
        .blue::before {
          color: $blue;
        }
        .list-title {
          font-size: 15px;
        }
        .list-content {
          font-size: 14px;
          color: $word-grey-color;
        }
        .iconfont::before {
          font-size: 20px;
          margin-right: 5px;
        }
        &:hover {
          .iconfont {
            color: $title-color;
          }
        }
      }
      .record-list:first-child {
        border: none;
      }
    }
  }
  .chat-container {
    display: flex;
    flex-direction: column;
    flex: 6;

    .chat-title {
      padding: 20px;
      background-color: $main-blue;
      color: white;
      border-radius: 30px 30px 0 0;
    }
    .chat-history {
      flex: 1;
      overflow-y: auto;
      padding-top: 10px;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;

      .chat-message {
        padding: 8px;
        border-radius: 5px;
        margin-bottom: 5px;
        max-width: 70%;
        display: flex;
        align-items: flex-start;
        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: $main-blue;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        .message-word {
          border-radius: 5px;
          padding: 5px 8px 5px 8px;
          margin-left: 5px;
          max-width: 184px;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .user {
          align-self: flex-end;
          background-color: $main-blue;
          color: white;
        }
      }
    }

    .bot {
      align-self: flex-start;
      background-color: #f1f1f1;
      color: black;
    }

    .chat-input {
      display: flex;
      gap: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 10px 10px;
      padding-bottom: 18px;
    }
  }
}
:deep(.el-drawer__header) {
  margin: 0 !important;
}

:deep(.el-input__suffix) {
  cursor: pointer;
}
:deep(.el-input__suffix:hover) {
  color: $main-blue;
}
:deep(.el-input__suffix .el-input__icon) {
  font-size: 18px;
}
</style>
