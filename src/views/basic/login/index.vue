<template>
  <div class="container" :class="{ 'sign-up-mode': signUpMode }">
    <div class="form-warp">
      <form class="sign-in-form wow fadeInRight">
        <h2 class="form-title">登录</h2>
        <el-form
          :model="loginData"
          :rules="loginRules"
          size="large"
          v-if="loginOptions"
          class="wow slideInUp"
        >
          <el-form-item prop="account">
            <el-input
              v-model="loginData.account"
              style="width: 300px; height: 50px"
              placeholder="请输入学号"
              :prefix-icon="User"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginData.password"
              style="width: 300px; height: 50px"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="type">
            <el-select
              v-model="typeValue"
              clearable
              placeholder="请选择身份"
              style="width: 300px; height: 50px"
            >
              <el-option label="&nbsp;&nbsp;&nbsp;学生" value="学生" />
              <el-option label="&nbsp;&nbsp;&nbsp;教师" value="教师" />
              <el-option label="&nbsp;&nbsp;&nbsp;校园管理者" value="校园管理者" />
            </el-select>
          </el-form-item>
          <div class="submit-btn" @click="login">立即登录</div>
          <span @click="toEmailLogin" style="color: #6266f5; text-decoration: underline"
            >忘记密码？邮箱登录</span
          >
        </el-form>
        <el-form :model="modifyData" :rules="modifyRules" size="large" v-else class="wow fadeInUp">
          <el-form-item prop="email">
            <el-input
              v-model="modifyData.email"
              style="width: 300px; height: 50px"
              :prefix-icon="User"
              placeholder="请输入email"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="modifyData.password"
              style="width: 300px; height: 50px"
              type="password"
              placeholder="请输入新密码"
              :prefix-icon="Lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" style="display: flex; height: 50px">
            <el-input
              v-model="modifyData.code"
              style="width: 170px; height: 50px"
              placeholder="验证码"
              :prefix-icon="Clock"
            ></el-input>
            <el-button
              @click="getModifyCode"
              class="codeButton"
              style="padding: 12px 19px; height: 50px; margin-left: 20px"
              >获取验证码</el-button
            >
          </el-form-item>
          <div class="submit-btn" @click="emailLogin">邮箱登录</div>
          <span @click="toIdLogin" style="color: #6266f5; text-decoration: underline"
            >学号登录</span
          >
        </el-form>
      </form>
      <form class="sign-up-form">
        <h2 class="form-title">管理员注册</h2>
        <el-form :model="registerData" :rules="registerRules" size="large">
          <el-form-item prop="email">
            <el-input
              v-model="registerData.email"
              style="width: 300px; height: 50px"
              :prefix-icon="User"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerData.password"
              style="width: 300px; height: 50px"
              type="password"
              :prefix-icon="Lock"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code" style="display: flex; height: 50px">
            <el-input
              v-model="registerData.code"
              style="width: 170px; height: 50px"
              :prefix-icon="Clock"
              placeholder="验证码"
            ></el-input>
            <el-button
              @click="getRegisterCode"
              class="codeButton"
              style="padding: 12px 19px; height: 50px; margin-left: 20px"
              >获取验证码</el-button
            >
          </el-form-item>
          <div @click="register" class="submit-btn">确认</div>
        </el-form>
      </form>
    </div>
    <div class="desc-warp">
      <div class="desc-warp-item sign-up-desc">
        <div class="content">
          <!-- <p>快来加入我们吧</p> -->
          <button class="button" @click="toRegister" id="sign-up-btn">管理员注册</button>
        </div>
        <img src="@/assets/img/log.svg" alt="" />
      </div>
      <div class="desc-warp-item sign-in-desc">
        <div class="content">
          <button class="button" @click="toLogin" id="sign-in-btn">登录</button>
        </div>
        <img src="@/assets/img/register.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import WOW from 'wow.js'
import { useUserStore } from '@/stores/userStore.js'
// import { useWebSocketStore } from '@/stores/webSocketStore.js'
import { loginAPI, getCodeAPI, registerAPI, login2API } from '@/apis/login'
import { getUserInfoAPI } from '@/apis/user'
import { useRouter } from 'vue-router'
import { Lock, Clock, User } from '@element-plus/icons-vue'

// id 还是邮箱登录 true 是id,false 是邮箱
const loginOptions = ref(true)
const signUpMode = ref(false)
const router = useRouter()
const userStore = useUserStore()
let typeValue = ref('') //身份
// const webSocketStore = useWebSocketStore()
const loginData = ref({
  account: '0304',
  password: '666666',
}) //校园管理者
//  account: '0305',  //  教师
//  password: '666666',
//  account: '2024301714',  //  学生
//  password: '666666',

const registerData = ref({
  email: '',
  code: '',
  password: '',
  invitationCode: '',
})
const modifyData = ref({
  email: '',
  password: '',
  code: '',
})
const loginRules = {
  account: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: '密码必须是8到16位包含大小写字母数字',
      trigger: 'blur',
    },
  ],
}
const registerRules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: '密码必须是8到16位包含大小写字母数字',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { pattern: /^[0-9A-Za-z]{6}$/, message: '验证码错误', trigger: 'blur' },
  ],
}
const modifyRules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入正确邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/,
      message: '密码必须是8到16位包含大小写字母数字',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '验证码不能为空', trigger: 'blur' },
    { pattern: /^[0-9A-Za-z]{6}$/, message: '验证码错误', trigger: 'blur' },
  ],
}
const toIdLogin = () => {
  loginOptions.value = true
}
const toEmailLogin = () => {
  loginOptions.value = false
}
const toRegister = () => {
  signUpMode.value = true
}
const toLogin = () => {
  signUpMode.value = false
}
const login = async () => {
  console.log(loginData.value.account, loginData.value.password)
  const res = await loginAPI(loginData.value.account, loginData.value.password, 'password')
  console.log(res)
  if (res.data.code == 0) {
    userStore.setIsLogin(false)
    userStore.setUserInfo(
      loginData.value.account,
      res.data.data.authorities[0],
      res.data.data.access_token,
      res.data.data.refresh_token,
    )
    ElMessage.success(res.data.message)
    localStorage.setItem('user', JSON.stringify(userStore.user))
    let identify = userStore.user.identity.toLowerCase()

    //获取用户详细信息
    const res1 = await getUserInfoAPI()
    const user = { ...userStore.user, ...res1.data.data }
    userStore.setUserInfoPreference(user)
    // webSocketStore.initialize(userStore.user.userMail)
    setTimeout(() => {
      router.push(`/${identify}/mainPage`)
    }, 100)
  } else {
    ElMessage.error(res.data.message)
  }
}
const register = async () => {
  const res = await registerAPI(
    registerData.value.email,
    registerData.value.code,
    registerData.value.password,
    registerData.value.invitationCode,
    'v',
  )
  if (res.data.code == 200) {
    userStore.setUserInfo(
      res.data.data,
      res.headers.authorization,
      res.headers['authorization-refresh'],
    )
    ElMessage.success(res.data.message)
    const res1 = await login2API(registerData.value.email, registerData.value.password, 'v')
    console.log(res1.data)
    userStore.setUserInfo(
      res1.data.data,
      res1.headers.get('Accesstoken'),
      res1.headers.get('Refreshtoken'),
    )
    ElMessage.success(res1.data.message)
    localStorage.setItem('user', JSON.stringify(userStore.user))
    // webSocketStore.initialize(userStore.user.userMail)
    setTimeout(() => {
      router.push('/')
    }, 2000)
  } else {
    ElMessage.error(res.data.message)
  }
}
const getModifyCode = async () => {
  let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  console.log(regex.test(modifyData.value.email))
  if (!regex.test(modifyData.value.email)) {
    alert('请输入正确的邮箱')
    return
  }
  const res = await getCodeAPI(modifyData.value.email, 'v')
  console.log(res)
}
const getRegisterCode = async () => {
  let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  if (!regex.test(registerData.value.email)) {
    alert('请输入正确的邮箱')
    return
  }
  const res = await getCodeAPI(registerData.value.email, 'v')
  console.log(res)
}
onMounted(() => {
  new WOW().init()
})
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

.container::before {
  content: ' ';
  position: absolute;
  width: 2000px;
  height: 2000px;
  border-radius: 50%;
  background-image: linear-gradient(-45deg, #3a63f3 0%, #ebeffe 100%);
  transition: 1.8s ease-in-out;
  z-index: 6;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
}

.container.sign-up-mode::before {
  transform: translate(100%, -50%);
}

.form-warp {
  width: 50%;
  position: absolute;
  z-index: 5;
  left: 75%;
  top: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 1fr;
  transition: 1s 0.7s ease-in-out;
}

.form-warp form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  gap: 30px;
  /* 将两个 form 布局在 grid 同一位置 */
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  transition: all 0.2s 0.7s;
  opacity: 1;
  z-index: 4;
}

.form-title {
  color: #065fed;
  font-size: 30px;
}

.form-warp .sign-up-form {
  opacity: 0;
  z-index: 3;
}

:deep(.el-select__wrapper) {
  min-height: 50px;
}

.container.sign-up-mode .form-warp {
  left: 25%;
}

.container.sign-up-mode .sign-in-form {
  opacity: 0;
  z-index: 3;
}

.container.sign-up-mode .sign-up-form {
  opacity: 1;
  z-index: 4;
}

input,
.submit-btn {
  width: 100%;
  padding: 12px 30px;
  border-radius: 20px;
  background: #3a63f3;
}

input::placeholder {
  color: #cccc;
}

.submit-btn {
  background-color: #547bf1;
  color: #fff;
  text-align: center;
  min-width: 150px;
  font-size: initial;
  font-weight: bold;
  letter-spacing: 1.5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: rgb(123, 151, 252);
}

.desc-warp {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.desc-warp-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  text-align: center;
  padding: 3rem 17% 2rem 12%;
  z-index: 6;
}

/* 事件穿透 BEGIN */
.sign-in-desc {
  pointer-events: none;
}

.sign-up-mode .sign-in-desc {
  pointer-events: all;
}

.sign-up-mode .sign-up-desc {
  pointer-events: none;
}

/* 事件穿透 END */
.content {
  width: 100%;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.sign-in-desc img,
.sign-in-desc .content {
  transform: translateX(800px);
}

.sign-up-mode .sign-in-desc img,
.sign-up-mode .sign-in-desc .content {
  transform: translateX(0);
}

.sign-up-mode .sign-up-desc img,
.sign-up-mode .sign-up-desc .content {
  transform: translateX(-800px);
}

.button {
  outline: none;
  padding: 6px 8px;
  min-width: 100px;
  text-align: center;
  border-radius: 30px;
  border: 2px solid #fff;
  background: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button:active {
  background: rgba(255, 255, 255, 0.1);
}

img {
  width: 100%;
  display: block;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.5s;
}

/* 响应式 */
@media screen and (max-width: 870px) {
  .container::before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode::before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .form-warp {
    width: 100%;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .container.sign-up-mode .form-warp {
    top: 25%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  img {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.7s;
  }

  .desc-warp {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .desc-warp-item {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .sign-in-desc {
    grid-row: 3 / 4;
  }

  .sign-in-desc img,
  .sign-in-desc .content {
    transform: translateY(800px);
  }

  .sign-up-mode .sign-in-desc img,
  .sign-up-mode .sign-in-desc .content {
    transform: translateY(0);
  }

  .sign-up-mode .sign-up-desc img,
  .sign-up-mode .sign-up-desc .content {
    transform: translateY(-800px);
  }
}

@media screen and (max-width: 570px) {
  .container::before {
    bottom: 72%;
    left: 50%;
  }

  img {
    display: none;
  }
}

.codeButton {
  background-color: #547bf1;
  color: #fff;
}

.codeButton:hover {
  background-color: rgb(123, 151, 252);
  color: #fff;
}
</style>
