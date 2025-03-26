<template>
  <div class="course-section">
    <div class="course-section-left">
      <div class="section-top">
        <el-cascader
          :options="angleOptions"
          placeholder="选择查看视角"
          filterable
          :props="option"
          style="width: 400px; margin-right: 10px"
          clearable
          @change="handleChange"
        />
        <el-button color="#547bf1" @click="searchClick" plain :icon="Search"> 查看 </el-button>

        <el-button style="margin-left: auto" color="#547bf1" @click="toggleDraggable">
          {{ isDraggable ? '取消编辑' : '编辑课表' }}
        </el-button>
        <el-button color="#547bf1" v-if="isDraggable" @click="saveEditClick"> 保存编辑 </el-button>
      </div>
      <DndProvider :backend="HTML5Backend">
        <Container :isDraggable="isDraggable" />
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
          <el-row :class="data.isSelected ? 'is-selected' : 'sds'">
            {{ data.day.split('-').slice(2).join('-') }}
          </el-row>
          <div v-for="item in signData" :key="item">
            <el-tooltip :content="`今日 ${item.data} 节课`" placement="bottom" effect="light">
              <div v-if="data.day == item.time && item.data != 0">
                <div
                  class="iconfont icon-dian1"
                  :class="item.data == 4 ? 'red-icon' : item.data == 3 ? 'yellow-icon' : ''"
                ></div>
              </div>
              <div v-else></div>
            </el-tooltip>
          </div>
        </template>
      </el-calendar>
      <div class="day-table">
        <div class="day-title">日课表</div>
        <div class="time-table">
          <el-timeline style="max-width: 600px">
            <el-timeline-item
              v-for="(activity, index) in dayActivities"
              :key="index"
              placement="top"
              center
            >
              <div class="time-content">
                <span class="content">{{ activity.content }}</span>
                <div class="extra-box">{{ activity.timestamp }}</div>
              </div>
              <div class="course-box">
                <div class="course-box-top">
                  <div class="course-box-title">语文</div>
                  <div class="course-box-class">22级四班</div>
                </div>
                <div class="course-box-bottom">
                  <div class="course-box-teacher">张伟</div>
                  <div class="course-box-classroom">301</div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import Container from './classComponents/container.vue'
import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ElMessage } from 'element-plus'
import {
  getMajorsAPI,
  getClassesAPI,
  getDepartmentsAPI,
  getsearchAPI,
  getGradesAPI,
} from '@/apis/classMajor'
import { getTeacherAndStudentAPI } from '@/apis/person'
import { Search } from '@element-plus/icons-vue'

// 每日课程数量数据
let signData = ref([
  {
    time: '2025-03-22',
    data: 1,
  },
  {
    time: '2025-03-23',
    data: 1,
  },
  {
    time: '2025-03-24',
    data: 3,
  },
  {
    time: '2025-03-25',
    data: 2,
  },
  {
    time: '2025-03-26',
    data: 4,
  },
])
//日时间线
const dayActivities = [
  {
    content: '1',
    timestamp: '8:00',
  },
  {
    content: '2',
    timestamp: '9:40',
  },
  {
    content: '3',
    timestamp: '14:30',
  },
]
//选择框选项
const angleOptions = ref([
  {
    value: '0',
    label: '教师视角', //学院，教师
  },
  {
    value: '1',
    label: '班级视角', //学院，专业，班级
  },
  {
    value: '2',
    label: '年级视角', //学院、专业，年级
  },
])
let calendarDate = ref(new Date()) //当前日期
const isDraggable = ref(true) //是否可以编辑
const calendarString = ref('') //当前日期字符串
let selectedArr = null //选中的内容
let option = ref()
const calendar = ref()
onMounted(async () => {
  initializeCalendar() // 初始化日历
  //获取选择框的学院信息
  await getOptions()
  option.value = {
    lazy: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      //教师视角，获取教师
      if (selectedPath[0] == '0') {
        console.log(selectedPath[1], selectedPath)
        const res = await getTeacherAndStudentAPI('', '', selectedPath[1], '', 1, 100)
        console.log(res.data)
        const nodes = res.data.data.records.map(item => ({
          value: item.name,
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
            leaf: selectedPath[0] == '2' ? false : true,
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
            leaf: false,
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
})
//获取学院信息,设置option
async function getOptions() {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
  }))
  for (let i = 0; i < angleOptions.value.length; i++) {
    angleOptions.value[i].children = nodes
  }
  console.log(angleOptions.value)
  //获取
}
//处理选择框的变化，并记录值
const handleChange = async value => {
  selectedArr = [...value]
  console.log(value)
}
//点击搜索
async function searchClick() {
  console.log(selectedArr)
  if (selectedArr == null) {
    ElMessage.warning('请选择查看视角')
    return
  }
  const res = await getsearchAPI(
    selectedArr[0],
    selectedArr[1] == undefined ? '' : selectedArr[1],
    selectedArr[2] == undefined ? '' : selectedArr[2],
  )
  console.log(res.data)
  // academyList.arr = res.data.data
  // console.log(academyList.arr)
  // if (selectedArr[1] != undefined) {
  //   academyList.arr[0].active = true
  //   if (selectedArr[2] != undefined && 'classList' in academyList.arr[0].majorList[0]) {
  //     academyList.arr[0].majorList[0].active = true
  //   }
  // }
}
// 初始化日历
function initializeCalendar() {
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth() + 1
  calendarString.value = `${year}年${month}月`
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
  calendarString.value = year + '年' + month + '月'
}
// 保存编辑
function saveEditClick() {
  console.log('保存编辑')
}
const toggleDraggable = () => {
  isDraggable.value = !isDraggable.value
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
    .course-box {
      font-weight: 400;
      width: 100%;
      margin-left: 16px;
      border-radius: 5px;
      padding: 5px 14px;
      border: 1.5px solid #ccc;
      .course-box-top {
        display: flex;
        justify-content: space-between;
        text-align: left;
        margin-bottom: 5px;
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
          color: #666;
        }
        .course-box-classroom {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
}
</style>
