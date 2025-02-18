import * as echarts from 'echarts/core'

import { BarChart, LineChart, ScatterChart, PieChart } from 'echarts/charts'

// 组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  AxisPointerComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GraphicComponent,
} from 'echarts/components'

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  AxisPointerComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  BarChart,
  PieChart,
  LineChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  GraphicComponent,
])

// 导出 echarts
export default echarts
