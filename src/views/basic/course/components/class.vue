<template>
  <div class="course-section">
    <div class="course-section-left">
      <div class="section-top">
        <el-cascader
          v-if="userStore.user.identity == 'MANAGER'"
          :options="angleOptions"
          placeholder="选择查看视角"
          filterable
          :props="option"
          style="width: 400px; margin-right: 10px"
          clearable
          v-model="selectedArr"
        />
        <el-cascader
          placeholder="选择查看周次"
          :options="weekOptions"
          style="margin-right: 10px"
          clearable
          filterable
          v-model="weekValue"
        ></el-cascader>
        <el-button color="#547bf1" @click="searchClick" plain :icon="Search"> 查看 </el-button>

        <el-button
          v-if="userStore.user.identity == 'MANAGER'"
          style="margin-left: auto"
          color="#547bf1"
          @click="toggleDraggable"
        >
          {{ isDraggable ? '取消编辑' : '编辑课表' }}
        </el-button>
        <el-button color="#547bf1" v-if="isDraggable" @click="saveEditClick"> 保存编辑 </el-button>
        <el-button color="#547bf1" @click="exportTimetableAsImage" plain :icon="Download">
          导出课表
        </el-button>
      </div>
      <DndProvider :backend="HTML5Backend">
        <Container :isDraggable="isDraggable" :courses="courses" ref="containerRef" />
      </DndProvider>
    </div>
    <div class="course-section-right">
      <el-calendar ref="calendar">
        <template #header="{}">
          <el-button style="margin-bottom: 10px" size="small" @click="selectDate('today')"
            >今天</el-button
          >
          <span class="date-content" style="margin-bottom: 10px">{{ calendarString }}</span>
          <div style="margin-bottom: 10px">
            <el-button size="small" @click="selectDate('prev-month')">上月</el-button>
          </div>
          <div style="margin-bottom: 10px">
            <el-button size="small" @click="selectDate('next-month')">下月</el-button>
          </div>
        </template>
        <template #date-cell="{ data }">
          <div @click="dateClick(data.day)">
            <el-row :class="data.isSelected ? 'is-selected' : 'sds'">
              {{ data.day.split('-').slice(2).join('-') }}
            </el-row>
            <div v-for="item in signData" :key="item">
              <el-tooltip :content="`今日 ${item.data} 节课`" placement="bottom" effect="light">
                <div v-if="data.day == item.time && item.data != 0">
                  <div
                    class="iconfont icon-dian1"
                    :class="item.data >= 7 ? 'red-icon' : item.data >= 3 ? 'yellow-icon' : ''"
                  ></div>
                </div>
                <div v-else></div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-calendar>
      <div class="day-table">
        <div class="day-title">
          日课表
          <span style="font-weight: normal; margin-left: 8px"
            >{{ calendarString }}{{ dateString }}日</span
          >
        </div>
        <div class="time-table">
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(activity, index) in dayActivities"
              :key="index"
              placement="top"
              center
            >
              <div class="time-content">
                <span class="content">{{ parseInt(activity.timeStart) + 1 }}</span>
                <div class="extra-box">{{ getTime(activity.timeStart) }}</div>
              </div>
              <div class="course-boxes" v-for="item in activity.arr" :key="item">
                <div
                  class="course-box"
                  :style="{
                    backgroundColor: getColor(
                      userStore.user.identity === 'TEACHER' || selectedArr[0] != '1'
                        ? item.teachingClassId
                        : item.courseId,
                    ),
                  }"
                >
                  <div class="course-box-top">
                    <div class="course-box-title">{{ item.courseName }}</div>
                    <div class="course-box-class">{{ item.teachingClassName }}</div>
                  </div>
                  <div class="course-box-bottom">
                    <div class="course-box-teacher">{{ item.teacherName }}</div>
                    <div class="course-box-classroom">{{ item.classroomName }}</div>
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty
            v-if="!dayActivities || !dayActivities.length"
            :image-size="180"
            description="暂无课程"
          />
        </div>
      </div>
    </div>
  </div>
  <!-- 课表改动提示弹窗 -->
  <el-dialog v-model="editDialogVisible" title="课表改动提示" width="35%">
    <div class="edit-dialog-content">
      <div class="edit-info">
        <div class="edit-title">课表调整信息</div>
        <div class="edit-detail">
          <p>根据<strong>汽车与智能交通学院</strong>的<strong>金龙老师</strong>的反馈：</p>
          <div class="edit-change">
            <div class="change-item">
              <span class="change-label">原定时间：</span>
              <span class="change-value">周五 3-4节</span>
            </div>
            <div class="change-item">
              <span class="change-label">调整时间：</span>
              <span class="change-value">周天 3-4节</span>
            </div>
            <div class="change-item">
              <span class="change-label">上课教室：</span>
              <span class="change-value">JXL3#308</span>
            </div>
            <div class="change-item">
              <span class="change-label">周次：</span>
              <span class="change-value">0-17周</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelEdit">取消暂定更改，稍后自行修改</el-button>
        <el-button type="primary" @click="submitEditForm">确认发布</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Container from './classComponents/container.vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useUserStore } from '@/stores/userStore'
import { getMajorsAPI, getClassesAPI, getDepartmentsAPI, getGradesAPI } from '@/apis/classMajor'
import { getTeacherAndStudentAPI } from '@/apis/person'
import { setTimetableAPI, getEverydayCourseAPI } from '@/apis/timetable'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { getCodeAPI } from '@/apis/inform'
const userStore = useUserStore()
const selectedArr = ref(['0', '汽车与智能交通学院', '0327']) //默认选中的数据
const weekValue = ref(null) //选择的周次
// 每日课程数量数据
let signData = ref([])
//日时间线
const dayActivities = ref([])
const editDialogVisible = ref(false) //课表改动提示弹窗
//选择框选项
const angleOptions = ref([
  {
    value: '0',
    label: '教师视角',
  },
  {
    value: '1',
    label: '班级视角',
  },
  {
    value: '2',
    label: '年级视角',
  },
])

const colors = [
  '#e78891',
  '#f3a885',
  '#a2d13c',
  '#F8BBD0',
  '#E1BEE7',
  '#C5CAE9',
  '#9ad5dd',
  '#b1e2b3',
  '#f5d471',
  '#FFAB91',
  '#b6bbff',
]
//选择周选项
let weekOptions = ref([])
let calendarDate = ref(new Date()) //当前日期
const isDraggable = ref(false) //是否可以编辑
const calendarString = ref('') //当前日期字符串
const dateString = ref('') //选中的日期天数
const courses = ref([])
let option = ref()
const calendar = ref()
const courseColors = ref({}) // 颜色映射
const containerRef = ref(null)

onMounted(async () => {
  initializeCalendar() // 初始化日历
  //获取选择框的信息
  await getOptions()
  searchClick()
  weekOptions.value.push({ value: null, label: '全部' })
  for (let i = 1; i <= 18; i++) {
    weekOptions.value.push({ value: i, label: `第 ${i} 周` })
  }
})
//点击日历，获取日课表
async function dateClick(date) {
  dateString.value = date.split('-')[2]
  let yearOfEntry = ''
  let majors = ''
  let className = ''
  let teacherId = ''
  //获取课程数据
  //如果是管理员（需要提供年级、专业）
  if (userStore.user.identity === 'MANAGER') {
    if (selectedArr.value[0] == '0') {
      teacherId = selectedArr.value[2]
    } else if (selectedArr.value[0] == '1') {
      className = selectedArr.value[3]
    } else if (selectedArr.value[0] == '2') {
      majors = selectedArr.value[2]
      yearOfEntry = selectedArr.value[3]
    }
  } else {
    //如果是教师和学生
    selectedArr.value = ['', '', '']
  }
  const res = await setTimetableAPI(
    weekValue.value == null ? null : weekValue.value[0],
    date,
    yearOfEntry,
    majors,
    className,
    teacherId,
  )
  console.log(res.data)
  if (res.data.code == 'A000001') {
    ElMessage.warning('无课程数据')
    dayActivities.value = []
    return
  }
  //根据timeStart排序,并且合并上课时间相同的课程
  res.data.data.sort((a, b) => a.timeStart - b.timeStart)
  // 用于存储分组结果的对象
  const groupedByTimeStart = {}

  // 遍历排序后的数组，将相同 timeStart 的课程放到同一个数组中
  res.data.data.forEach(course => {
    const { timeStart } = course
    if (!groupedByTimeStart[timeStart]) {
      groupedByTimeStart[timeStart] = []
    }
    groupedByTimeStart[timeStart].push(course)
  })

  // 将分组结果转换为所需的数组格式
  dayActivities.value = Object.entries(groupedByTimeStart).map(([timeStart, arr]) => ({
    timeStart: String(timeStart),
    arr,
  }))
  console.log(dayActivities.value)
}
//点击搜索
async function searchClick() {
  //还需要获取日课表
  //日设置为当前天
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth() + 1
  dateString.value = calendarDate.value.getDate()
  dateClick(`${year}-${month}-${dateString.value}`)
  //更新日历上的课程数量
  getEverydayCourse(year, month)
  let yearOfEntry = ''
  let majors = ''
  let className = ''
  let teacherId = ''
  //获取课程数据
  //如果是管理员（需要提供年级、专业）
  if (userStore.user.identity === 'MANAGER') {
    if (selectedArr.value[0] == '0') {
      teacherId = selectedArr.value[2]
    } else if (selectedArr.value[0] == '1') {
      className = selectedArr.value[3]
    } else if (selectedArr.value[0] == '2') {
      majors = selectedArr.value[2]
      yearOfEntry = selectedArr.value[3]
    }
  } else {
    //如果是教师和学生
    selectedArr.value = ['', '', '']
  }
  const res1 = await setTimetableAPI(
    weekValue.value == null ? null : weekValue.value[0],
    '',
    yearOfEntry,
    majors,
    className,
    teacherId,
  )
  console.log(res1.data)
  if (res1.data.code === 'B000001') {
    ElMessage.warning('系统繁忙，请稍后再试！')
  } else {
    courses.value = res1.data.data
  }
}
//获取信息,设置选择框option
async function getOptions() {
  //选择框的初始值
  const res = await getDepartmentsAPI()
  console.log(res.data)
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
  }))
  for (let i = 0; i < angleOptions.value.length; i++) {
    angleOptions.value[i].children = JSON.parse(JSON.stringify(nodes))
  }
  //获取默认教师信息
  const res1 = await getTeacherAndStudentAPI(
    '',
    '',
    angleOptions.value[0].children[5].label,
    '',
    1,
    100,
  )
  console.log(res1.data)

  const nodes2 = res1.data.data.records.map(item => ({
    value: item.userId,
    label: item.name,
    leaf: true,
  }))
  angleOptions.value[0].children[5].children = JSON.parse(JSON.stringify(nodes2))
  option.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      //教师视角，获取教师
      if (selectedPath[0] == '0') {
        if (selectedPath.length == 3) {
          return
        }
        console.log(selectedPath[1], selectedPath)
        const res = await getTeacherAndStudentAPI('', '', selectedPath[1], '', 1, 100)
        console.log(res.data)
        const nodes = res.data.data.records.map(item => ({
          value: item.userId,
          label: item.name,
          leaf: true,
        }))
        resolve(nodes)
      } else {
        //获取专业
        if (selectedPath.length == 2) {
          const res = await getMajorsAPI(selectedPath[1])
          console.log(res.data)
          const nodes = res.data.data.map(item => ({
            value: item.name,
            label: item.name,
            leaf: false,
          }))
          resolve(nodes)
        }
        //说明是班级视角
        else if (selectedPath[0] == '1') {
          const res = await getClassesAPI(selectedPath[1], selectedPath[2])
          console.log(res.data)
          const nodes = res.data.data.map(item => ({
            value: item.name,
            label: item.name,
            leaf: true,
          }))
          resolve(nodes)
          //说明是年级视角
        } else if (selectedPath[0] == '2') {
          const res = await getGradesAPI(selectedPath[2])
          console.log(res.data)
          const nodes = res.data.data.map(item => ({
            value: item,
            label: item.toString() + '级',
            leaf: true,
          }))

          resolve(nodes)
        }
      }
    },
  }
}
// 初始化日历
async function initializeCalendar() {
  //初始化日课表
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth() + 1
  dateString.value = calendarDate.value.getDate()
  calendarString.value = `${year}年${month}月`
  getEverydayCourse(year, month)
}
async function getEverydayCourse(year, month) {
  //获取每天的课程数量
  let yearOfEntry = ''
  let majors = ''
  let className = ''
  let teacherId = ''
  if (userStore.user.identity == 'MANAGER') {
    if (selectedArr.value[0] == '0') {
      teacherId = selectedArr.value[2]
    } else if (selectedArr.value[0] == '1') {
      className = selectedArr.value[3]
    } else if (selectedArr.value[0] == '2') {
      majors = selectedArr.value[2]
      yearOfEntry = selectedArr.value[3]
    }
  }
  const res = await getEverydayCourseAPI(
    '',
    '',
    yearOfEntry,
    majors,
    className,
    teacherId,
    year,
    month,
  )
  console.log(res.data)
  signData.value = res.data.data
}
//获取上课时间
function getTime(time) {
  if (time == 0) {
    return '08:00'
  } else if (time == 1) {
    return '08:55'
  } else if (time == 2) {
    return '10:10'
  } else if (time == 3) {
    return '11:05'
  } else if (time == 4) {
    return '14:30'
  } else if (time == 5) {
    return '15:25'
  } else if (time == 6) {
    return '16:20'
  } else {
    return '17:15'
  }
}
const getColor = id => {
  console.log(id)
  let num = 0
  for (let i = 0; i < id.length; i++) {
    num += id.charCodeAt(i)
  }
  num = num % colors.length
  courseColors.value[id] = colors[num]

  return courseColors.value[id]
}
const selectDate = val => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
  let year = null
  let month = null
  if (val == 'next-month') {
    calendarDate.value.setMonth(calendarDate.value.getMonth() + 1)
    year = calendarDate.value.getFullYear()
    month = calendarDate.value.getMonth() + 1
  } else if (val == 'prev-month') {
    calendarDate.value.setMonth(calendarDate.value.getMonth() - 1)
    year = calendarDate.value.getFullYear()
    month = calendarDate.value.getMonth() + 1
  } else if (val == 'today') {
    calendarDate.value = new Date()
    year = calendarDate.value.getFullYear()
    month = calendarDate.value.getMonth() + 1
  }
  //获取每月每天的课程数量
  getEverydayCourse(year, month)
  calendarString.value = year + '年' + month + '月'
}
// 保存编辑
function saveEditClick() {
  console.log('保存编辑')
  isDraggable.value = false
  ElMessage.success('保存成功！')

  //保存不成功的情况
  // ElMessage.warning('当前调课存在教室冲突，请重新调整！')
}
const toggleDraggable = () => {
  if (isDraggable.value) {
    ElMessageBox.confirm('是否保存暂定更改?', '提醒', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        ElMessage.success('保存成功！')
        isDraggable.value = !isDraggable.value
      })
      .catch(() => {
        searchClick()
        ElMessage.success('未保存')
        isDraggable.value = !isDraggable.value
      })
  } else {
    isDraggable.value = !isDraggable.value
  }
}
// 取消暂定更改
const cancelEdit = () => {
  editDialogVisible.value = false
  // 这里可以添加取消暂定更改的逻辑
  ElMessage.info('已取消暂定更改，您可以继续手动修改课表')
}

// 提交编辑表单
const submitEditForm = async () => {
  editDialogVisible.value = false
  ElMessage.success('课表调整正在发布...')
  //告诉后端需要发布通知
  const res = await getCodeAPI(1)
  console.log(res.data)
}

// 导出课表为图片
const exportTimetableAsImage = async () => {
  if (!courses.value || courses.value.length === 0) {
    ElMessage.warning('当前没有课表数据可导出')
    return
  }

  try {
    // 显示加载提示
    const loadingInstance = ElLoading.service({
      text: '正在生成课表图片，请稍候...',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    // 动态导入html2canvas库
    const html2canvas = (await import('html2canvas')).default

    // 获取课表容器元素
    const timetableElement = document.querySelector('.schedule')
    if (!timetableElement) {
      loadingInstance.close()
      ElMessage.error('未找到课表元素，导出失败')
      return
    }

    // 获取当前视角信息
    let perspective = '全部'
    if (userStore.user.identity === 'MANAGER') {
      if (selectedArr.value[0] === '0') {
        perspective = `教师视角-${selectedArr.value[1]}-${selectedArr.value[2]}`
      } else if (selectedArr.value[0] === '1') {
        perspective = `班级视角-${selectedArr.value[1]}-${selectedArr.value[2]}-${selectedArr.value[3]}`
      } else if (selectedArr.value[0] === '2') {
        perspective = `年级视角-${selectedArr.value[1]}-${selectedArr.value[2]}-${selectedArr.value[3]}`
      }
    } else {
      perspective = '个人视角'
    }

    // 获取周次信息
    const weekInfo = weekValue.value ? `第${weekValue.value[0]}周` : '全部周次'

    // 创建标题元素
    const titleElement = document.createElement('div')
    titleElement.style.textAlign = 'center'
    titleElement.style.fontSize = '18px'
    titleElement.style.fontWeight = 'bold'
    titleElement.style.marginBottom = '10px'
    titleElement.style.padding = '10px'
    titleElement.style.backgroundColor = '#f2f5ff'
    titleElement.style.borderRadius = '5px'
    titleElement.textContent = `课表导出-${perspective}-${weekInfo}`

    // 创建临时容器
    const tempContainer = document.createElement('div')
    tempContainer.style.padding = '20px'
    tempContainer.style.backgroundColor = 'white'
    tempContainer.appendChild(titleElement)

    // 克隆课表元素
    const timetableClone = timetableElement.cloneNode(true)
    tempContainer.appendChild(timetableClone)

    // 将临时容器添加到文档中（但不可见）
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    document.body.appendChild(tempContainer)

    // 使用html2canvas将元素转换为canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许跨域图片
      backgroundColor: '#ffffff', // 设置背景色
    })

    // 将canvas转换为图片URL
    const imageUrl = canvas.toDataURL('image/png')

    // 创建下载链接
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `课表_${perspective}_${weekInfo}_${new Date().toLocaleDateString()}.png`
    link.click()

    // 清理临时元素
    document.body.removeChild(tempContainer)

    // 关闭加载提示
    loadingInstance.close()
    ElMessage.success('课表导出成功')
  } catch (error) {
    console.error('导出课表失败:', error)
    ElMessage.error('导出课表失败，请稍后重试')
  }
}
</script>
<style lang="scss" scoped>
.course-section {
  margin-top: 20px;
  display: flex;
  gap: 15px;

  > div {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  }

  .course-section-left {
    flex: 7;

    .section-top {
      display: flex;
    }
  }
  .course-section-right {
    padding-top: 10px;
    flex: 3;

    .el-calendar {
      .is-selected {
        color: #1989fa;
      }

      .tag {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .tag2 {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .aaa {
        .is-selected {
          .yuyue {
            color: #e6f3ff;
          }

          .datastyle {
            color: #e6f3ff;
          }
        }

        .datastyle {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3rem;
          color: #353636;
          font-weight: 600;
        }

        .prev .datastyle {
          color: #c4c5c8;
        }

        .next .datastyle {
          color: #c4c5c8;
        }
      }

      :deep {
        --el-calendar-selected-bg-color: #e6f3ff;
        --el-calendar-cell-width: 60px;

        .date-content {
          margin-left: auto;
          margin-right: auto;
          font-size: 14px;

          @media (max-width: 765px) {
            font-size: 12px;
          }

          @media (min-width: 765px) {
          }
        }

        .el-row {
          align-items: center;
          justify-content: center;
        }

        .el-calendar__header {
          justify-content: center;
          align-items: center;
          padding-top: 20px;

          @media (max-width: 765px) {
            padding-left: 10px;
            padding-right: 10px;
          }

          @media (min-width: 765px) {
          }

          .el-button--small {
            @media (max-width: 765px) {
              padding-left: 3px;
              padding-right: 3px;
            }

            @media (min-width: 765px) {
            }
          }
        }

        .el-calendar__body {
          padding-bottom: 30px;

          @media (max-width: 765px) {
            padding-left: 10px;
            padding-right: 10px;
          }

          @media (min-width: 765px) {
          }
        }

        .el-calendar-table {
          .el-calendar-day {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 46px;
            padding: 6px;
            .iconfont {
              padding: 3px 5px;
              color: $main-blue;
            }
            .yellow-icon {
              color: $main-yellow;
            }
            .red-icon {
              color: $red-word;
            }
          }
          .el-calendar-day:hover {
            background-color: #e6f3ff;
          }

          thead th {
            color: $title-color;
            font-weight: bold;
            font-size: 14px;
          }
        }
      }

      .center {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .center2 {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #e6f3ff;
        margin-left: 5px;
        font-size: 20px;
      }
    }
    .day-table {
      padding: 0 22px;
      .day-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 15px;
      }
    }
  }
}
:deep(.el-timeline-item__wrapper) {
  font-size: 16px;
  padding-left: 20px;
  .el-timeline-item__timestamp {
    margin: 0;
    padding: 0;
  }
  .el-timeline-item__content {
    display: flex;
    align-items: center;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    width: 100%;
    .time-content {
      width: 46px;
      .extra-box {
        font-weight: 400;
        margin-top: 10px;
        color: #999;
        font-size: 14px;
      }
      .content {
        font-size: 18px;
      }
    }
    .course-boxes {
      width: calc(90% - 46px);
      .course-box {
        color: #fff;
        font-weight: 400;
        width: 100%;
        margin-left: 16px;
        border-radius: 5px;
        padding: 5px 14px;
        .course-box-top {
          display: flex;
          justify-content: space-between;
          gap: 5px;
          text-align: left;
          margin-bottom: 5px;
          .course-box-title,
          .course-box-class {
            word-wrap: break-word;
            word-break: break-all;
            flex: 1;
          }
          .course-box-title {
            font-size: 16px;
          }
          .course-box-class {
            font-size: 14px;
          }
        }
        .course-box-bottom {
          display: flex;
          justify-content: space-between;
          .course-box-teacher {
            font-size: 14px;
            color: #efefef;
          }
          .course-box-classroom {
            font-size: 14px;
            color: #efefef;
          }
        }
      }
    }
  }
}
.edit-dialog-content {
  padding: 10px;

  .edit-info {
    .edit-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #303133;
    }

    .edit-detail {
      p {
        margin-bottom: 15px;
        line-height: 1.5;
      }

      .edit-change {
        background-color: #f5f7fa;
        border-radius: 4px;
        padding: 15px;

        .change-item {
          display: flex;
          margin-bottom: 10px;

          &:last-child {
            margin-bottom: 0;
          }

          .change-label {
            width: 80px;
            color: #606266;
          }

          .change-value {
            color: #303133;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
