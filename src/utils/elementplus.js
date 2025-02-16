// 引入element样式文件
import 'element-plus/dist/index.css'

// 按需引入element组件
import {
  ElButton,
  ElForm,
  ElBadge,
  ElDivider,
  ElEmpty,
  ElMessage,
  ElScrollbar,
  ElInput,
  ElDropdown,
  ElSelect,
  ElTable,
  ElMenu,
  ElBreadcrumb,
  ElIcon,
  ElAvatar,
} from 'element-plus'

export default function (app) {
  app.use(ElButton)
  app.use(ElForm)
  app.use(ElBadge)
  app.use(ElDivider)
  app.use(ElEmpty)
  app.use(ElScrollbar)
  app.use(ElInput)
  app.use(ElDropdown)
  app.use(ElSelect)
  app.use(ElTable)
  app.use(ElMenu)
  app.use(ElBreadcrumb)
  app.use(ElIcon)
  app.use(ElAvatar)
  app.use(ElMessage)
}
