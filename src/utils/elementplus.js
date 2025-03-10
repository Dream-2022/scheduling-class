// 引入element样式文件
import 'element-plus/dist/index.css'

// 按需引入element组件
import {
  ElButton,
  ElForm,
  ElBadge,
  ElDivider,
  ElProgress,
  ElRow,
  ElEmpty,
  ElCascader,
  ElMessage,
  ElSteps,
  ElScrollbar,
  ElInput,
  ElDropdown,
  ElSelect,
  ElTable,
  ElTooltip,
  ElTabs,
  ElMenu,
  ElCarousel,
  ElBreadcrumb,
  ElIcon,
  ElAvatar,
} from 'element-plus'

export default function (app) {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElBadge)
  app.use(ElDivider)
  app.use(ElProgress)
  app.use(ElRow)
  app.use(ElEmpty)
  app.use(ElCascader)
  app.use(ElMessage)
  app.use(ElSteps)
  app.use(ElScrollbar)
  app.use(ElInput)
  app.use(ElDropdown)
  app.use(ElSelect)
  app.use(ElTable)
  app.use(ElTooltip)
  app.use(ElTabs)
  app.use(ElMenu)
  app.use(ElCarousel)
  app.use(ElBreadcrumb)
  app.use(ElIcon)
  app.use(ElAvatar)
}
