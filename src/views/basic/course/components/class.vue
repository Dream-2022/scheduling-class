<template>
  <div class="course-section">
    <div class="course-section-left">
      <div class="section-top">
        <el-cascader
          style="width: 280px; margin-right: auto"
          filterable
          :options="options"
          placeholder="选择视角"
          clearable
        />
        <el-button color="#368eec" @click="toggleDraggable">
          {{ isDraggable ? '取消编辑' : '编辑课表' }}
        </el-button>
        <el-button color="#368eec" v-if="isDraggable" @click="saveEditClick"> 保存编辑 </el-button>
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
const options = [
  {
    value: 'teacher',
    label: '教师视角',
    children: [
      {
        value: '123',
        label: '计算机学院',
        children: [
          {
            value: '123',
            label: '计算机科学与技术',
            children: [
              {
                value: '797',
                label: '吴来源',
              },
              {
                value: '456',
                label: '李好',
              },
            ],
          },
          {
            value: '456',
            label: '软件工程',
            children: [
              {
                value: '4658',
                label: '张三',
              },
              {
                value: '222',
                label: '李四',
              },
            ],
          },
        ],
      },
      {
        value: '456',
        label: '经济管理学院',
        children: [
          {
            value: '123',
            label: '计算机科学与技术',
            children: [
              {
                value: '797',
                label: '1',
              },
              {
                value: '456',
                label: '2',
              },
            ],
          },
          {
            value: '456',
            label: '软件工程',
            children: [
              {
                value: '4658',
                label: '张三',
              },
              {
                value: '222',
                label: '李四',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'class',
    label: '班级视角',
    children: [
      {
        value: '21432',
        label: '旅游学院',
        children: [
          {
            value: '123',
            label: '22级1班',
          },
          {
            value: '456',
            label: '22级2班',
          },
        ],
      },
      {
        value: '464654',
        label: '外国语学院',
        children: [
          {
            value: '123',
            label: '23级1班',
          },
          {
            value: '456',
            label: '23级2班',
          },
        ],
      },
    ],
  },
  {
    value: 'class',
    label: '年级视角',
    children: [
      {
        value: '21432',
        label: '旅游学院',
        children: [
          {
            value: '123',
            label: '22级',
          },
          {
            value: '456',
            label: '23级',
          },
        ],
      },
      {
        value: '464654',
        label: '外国语学院',
        children: [
          {
            value: '123',
            label: '23级',
          },
          {
            value: '456',
            label: '24级',
          },
        ],
      },
    ],
  },
]
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
let calendarDate = ref(new Date()) //当前日期
const isDraggable = ref(true) //是否可以编辑
const calendarString = ref('') //当前日期字符串

const calendar = ref()
onMounted(() => {
  initializeCalendar()
})
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
