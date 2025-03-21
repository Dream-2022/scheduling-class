// 引入element样式文件
import 'element-plus/dist/index.css'

// 按需引入element组件
import {
  ElButton,
  ElUpload,
  ElForm,
  ElBadge,
  ElDivider,
  ElPagination,
  ElProgress,
  ElDrawer,
  ElRow,
  ElCol,
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
  ElRadioGroup,
  ElRadio,
  ElDialog,
  ElSegmented,
  ElSwitch,
  ElSelectV2,
  ElBacktop,
  ElTimePicker,
  ElDatePicker,
} from 'element-plus'

export default function (app) {
  app.use(ElButton)
  app.use(ElUpload)
  app.use(ElForm)
  app.use(ElBadge)
  app.use(ElDivider)
  app.use(ElPagination)
  app.use(ElProgress)
  app.use(ElDrawer)
  app.use(ElRow)
  app.use(ElCol)
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
  app.use(ElRadioGroup)
  app.use(ElRadio)
  app.use(ElDialog)
  app.use(ElSegmented)
  app.use(ElSwitch)
  app.use(ElSelectV2)
  app.use(ElBacktop)
  app.use(ElTimePicker)
  app.use(ElDatePicker)
}
