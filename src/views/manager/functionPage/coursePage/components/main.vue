<template>
  <div class="class-part" v-if="activeMessage[0]">
    <div class="course-boxes">
      <div
        class="course-box"
        v-for="item in classList.arr"
        :key="item"
        @click="courseClick(item.id, 'class')"
      >
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
          <el-button color="#df5555" @click.stop="deleteCourse('class', item.id)">
            删除
            <el-icon class="el-icon--right"><Delete /></el-icon>
          </el-button>
          <el-button color="#a372df" plain @click.stop="editCourse('class', item.id)">
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
      <div
        class="course-box"
        v-for="item in examList.arr"
        :key="item"
        @click="courseClick(item.id, 'exam')"
      >
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
          <el-button color="#df5555" @click.stop="deleteCourse('exam', item.id)">
            删除
            <el-icon class="el-icon--right"><Delete /></el-icon>
          </el-button>
          <el-button color="#a372df" plain @click.stop="editCourse('exam', item.id)">
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
</template>
<script setup>
import { reactive, defineProps } from 'vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import router from '@/router'
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
      id: 1,
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
let examList = reactive({
  arr: [
    {
      id: 0,
      title: '第一次考试',
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
      id: 1,
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

defineProps({
  activeMessage: Array,
})

function deleteCourse(type, id) {
  console.log('删除', type, id)
}
function editCourse(type, id) {
  console.log('编辑', type, id)
}
const courseClick = (id, string) => {
  router.push(`/manager/functionPage/course/${id}/${string}`)
}
</script>
<style lang="scss" scoped>
.course-box {
  background-color: #fff;
  box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.05);
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
</style>
