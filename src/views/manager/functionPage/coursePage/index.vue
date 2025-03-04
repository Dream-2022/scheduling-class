<template>
  <div class="course-page">
    <div class="course-content-title">
      <div class="left-title">
        <div :class="active[0] ? 'active' : 'gray-active'" @click="setActive(0)">排课表</div>
        <div>/</div>
        <div :class="active[1] ? 'active' : 'gray-active'" @click="setActive(1)">排考试表</div>
      </div>
      <!-- 新增搜索图标和输入框 -->
      <div class="search-container" @click.stop="toggleSearch">
        <el-icon class="el-icon--right"><Search /></el-icon>
        <Search v-if="!isSearching && !searchQuery" />
        <input v-else type="text" v-model="searchQuery" @blur="handleBlur" />
      </div>
    </div>
    <div class="course-right">
      <div class="class-part" v-if="active[0]">
        <div class="course-boxes">
          <div class="course-box" v-for="item in classList.arr" :key="item">
            <div class="course-box-left">
              <div>
                <div class="title">
                  <div class="left-title">{{ item.title }}</div>
                  <div
                    class="publish"
                    :class="item.status === '已发布' ? 'class-status1' : 'class-status2'"
                  >
                    {{ item.status }}
                  </div>
                </div>
                <div class="time">{{ item.time }}</div>
              </div>
            </div>
            <div class="course-box-middle">
              <div class="class-right">
                <div class="class-right-box">
                  <div class="class-right-title">课时任务</div>
                  <div class="class-right-content">{{ item.assign }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">课程数量</div>
                  <div class="class-right-content">{{ item.class }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">未排课程</div>
                  <div class="class-right-content">{{ item.noCourse }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">参与教师</div>
                  <div class="class-teacher">
                    <div v-for="(teacher, index) in item.teachers" :key="teacher">
                      <img
                        src="@/assets/img/cat.jpeg"
                        class="class-teacher-img"
                        :style="{ transform: `translateX(${index * -10}px)` }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="course-box-right">
              <el-button color="#df5555">
                删除
                <el-icon class="el-icon--right"><Delete /></el-icon>
              </el-button>
              <el-button color="#a372df" plain>
                编辑
                <el-icon class="el-icon--right"><Edit /></el-icon>
              </el-button>
              <el-button color="#368eec" plain>
                查看
                <el-icon class="el-icon--right"><Search /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="exam-part" v-else>
        <div class="course-boxes">
          <div class="course-box" v-for="item in classList.arr" :key="item">
            <div class="course-box-left">
              <div>
                <div class="title">
                  <div class="left-title">{{ item.title }}</div>
                  <div
                    class="publish"
                    :class="item.status === '已发布' ? 'class-status1' : 'class-status2'"
                  >
                    {{ item.status }}
                  </div>
                </div>
                <div class="time">{{ item.time }}</div>
              </div>
            </div>
            <div class="course-box-middle">
              <div class="class-right">
                <div class="class-right-box">
                  <div class="class-right-title">课时任务</div>
                  <div class="class-right-content">{{ item.assign }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">课程数量</div>
                  <div class="class-right-content">{{ item.class }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">未排课程</div>
                  <div class="class-right-content">{{ item.noCourse }}</div>
                </div>
                <div class="class-right-box">
                  <div class="class-right-title">参与教师</div>
                  <div class="class-teacher">
                    <div v-for="(teacher, index) in item.teachers" :key="teacher">
                      <img
                        src="@/assets/img/cat.jpeg"
                        class="class-teacher-img"
                        :style="{ transform: `translateX(${index * -10}px)` }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="course-box-right">
              <el-button color="#df5555">
                删除
                <el-icon class="el-icon--right"><Delete /></el-icon>
              </el-button>
              <el-button color="#a372df" plain>
                编辑
                <el-icon class="el-icon--right"><Edit /></el-icon>
              </el-button>
              <el-button color="#368eec" plain>
                查看
                <el-icon class="el-icon--right"><Check /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { Delete, Edit, Check, Search } from '@element-plus/icons-vue'
let classList = reactive({
  arr: [
    {
      id: 0,
      title: '第一次排课',
      status: '未发布',
      time: '2025-2-8 15:30',
      assign: 122,
      class: 23,
      noCourse: 1,
      teachers: [
        {
          id: 0,
          name: '李华',
          subject: '物理',
          picture: '@/assets/img/book.png',
        },
        {
          id: 1,
          name: '华',
          subject: '物理',
          picture: '@/assets/img/cat.png',
        },
      ],
    },
    {
      id: 0,
      title: '第一次排课',
      status: '已发布',
      time: '2025-2-8 15:30',
      assign: 122,
      class: 23,
      noCourse: 1,
      teachers: [
        {
          id: 0,
          name: '李华',
          subject: '物理',
          picture: '@/assets/img/book.png',
        },
        {
          id: 1,
          name: '华',
          subject: '物理',
          picture: '@/assets/img/cat.png',
        },
      ],
    },
  ],
})
let active = ref([true, false])
let isSearching = ref(false)
let searchQuery = ref('')

function setActive(index) {
  active.value = [false, false]
  active.value[index] = true
}

function toggleSearch() {
  isSearching.value = true
}

function handleBlur() {
  if (!searchQuery.value) {
    isSearching.value = false
  }
}
</script>
<style lang="scss" scoped>
.course-page {
  width: 90%;
  margin: 60px auto;
  margin-top: 10px;

  .course-content-title {
    background-color: $blue-back;
    border-radius: 8px;
    padding: 0 20px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div > div {
      display: inline-block;
      padding: 0 8px;
      font-size: 12px;
      cursor: pointer;
    }
    .left-title {
      // margin-right: auto;
    }
    .active {
      color: $deep-color;
      font-weight: 600;
      font-size: 16px;
    }
    .search-container {
      display: flex;
      align-items: center;
      input {
        border: none;
        outline: none;
        padding: 5px;
        border-radius: 4px;
        transition: width 0.3s;
        width: 150px;
      }
    }
  }
  .course-right {
    flex: 1;
    border-radius: 8px 26px 26px 8px;

    .course-box {
      background-color: #fff;
      border-radius: 8px;
      margin-top: 15px;
      display: flex;
      padding: 15px 30px 10px 30px;

      .course-box-left {
        margin-right: auto;
        .title {
          display: flex;
          gap: 20px;
          .left-title {
            font-weight: 600;
          }
          .publish {
            color: $green;
          }

          .class-status1 {
            color: $main-green;
          }
          .class-status2 {
            color: $main-yellow;
          }
        }
        .time {
          color: $word-shallow-color;
          font-size: 14px;
          margin-top: 11px;
        }
      }

      .course-box-middle {
        .class-right {
          display: flex;

          .class-right-box {
            margin-left: 20px;
            .class-right-title {
              color: $word-grey-color;
              font-size: 14px;
              margin-bottom: 6px;
            }

            .class-right-content {
              line-height: 30px;
              font-size: 18px;
              font-weight: 600;
            }
            .class-teacher {
              display: flex;

              .class-teacher-img {
                width: 25px;
                border-radius: 15px;
                border: 2px solid #fff;
              }
            }
          }
        }
      }

      .course-box-right {
        margin-left: 70px;
        line-height: 54px;

        .el-button {
          margin-right: 10px;
          padding: 3px 10px;
          font-size: 13px;
        }
      }
    }
  }
}
:deep(.el-tabs__header.el-tabs__header-vertical.is-left) {
  margin: 0;
}
:deep(.el-tabs__active-bar.is-left) {
  width: 4px;
  border-radius: 2px;
}
:deep(.el-steps) {
  width: 100%;
}
:deep(.el-steps--simple) {
  background-color: #fff !important;
  border-radius: 24px 24px 8px 8px;
}
</style>
