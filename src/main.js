import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入 echarts
import echarts from '@/utils/echarts.js'
// 引入 element-plus
import installElementPlus from '@/utils/elementplus.js'
// 引入动画效果
import 'animate.css/animate.min.css'
import 'wow.js/css/libs/animate.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// echarts 使用
app.config.globalProperties.$echarts = echarts
// element-plus 使用
installElementPlus(app)
app.mount('#app')
