<template>
  <div class="class-part" v-if="activeMessage[0]">
    <div class="course-boxes">
      <div
        class="course-box"
        v-for="item in courseList.arr"
        :key="item"
        @click="courseClick(item.scheduleTaskId, 'class', item.taskName)"
      >
        <div class="course-box-left">
          <div>
            <div class="title">
              <div class="left-title">{{ item.taskName }}</div>
              <div
                class="publish"
                :class="
                  item.taskStatus == '0'
                    ? 'status0'
                    : item.taskStatus == '1'
                      ? 'status1'
                      : item.taskStatus == '2'
                        ? 'status2'
                        : item.taskStatus == '3'
                          ? 'status3'
                          : 'status4'
                "
              >
                {{
                  item.taskStatus == '0'
                    ? '待执行'
                    : item.taskStatus == '1'
                      ? '进行中'
                      : item.taskStatus == '2'
                        ? '已完成'
                        : item.taskStatus == '3'
                          ? '失败'
                          : '使用中'
                }}
              </div>
            </div>
            <div class="time">{{ item.startTime }}</div>
          </div>
        </div>
        <div class="course-box-middle">
          <div class="class-right">
            <div class="class-right-box">
              <div class="class-right-title">课时任务</div>
              <div class="class-right-content">{{ item.totalClassHours }}</div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">课程数量</div>
              <div class="class-right-content">{{ item.totalCourseSize }}</div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">参与班级</div>
              <div class="class-right-content">{{ item.totalClassSize }}</div>
            </div>
            <div class="class-right-box">
              <div
                style="display: flex; cursor: pointer"
                @click.stop="helpClick(item.scheduleTaskId)"
              >
                <div class="class-right-title">未排课程</div>
                <span class="iconfont icon-bangzhu"></span>
              </div>
              <div class="class-right-content">
                {{ item.totalCourseSize - item.successCourseSize }}
              </div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">排课负责人</div>
              <div class="class-teacher">
                <div>{{ item.createdByName }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="course-box-right">
          <el-button color="#df5555" @click.stop="deleteCourse('class', item.id)">
            删除
            <el-icon class="el-icon--right"><Delete /></el-icon>
          </el-button>
          <el-button
            color="#a372df"
            plain
            @click.stop="editCourse('class', item.scheduleTaskId, item)"
          >
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
        @click="courseClick(item.id, 'exam', item.taskName)"
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
              <div class="class-right-title">课程数量</div>
              <div class="class-right-content">{{ item.course }}</div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">参与班级</div>
              <div class="class-right-content">{{ item.class }}</div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">未排课程</div>
              <div class="class-right-content">{{ item.noCourse }}</div>
            </div>
            <div class="class-right-box">
              <div class="class-right-title">排考负责人</div>
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
          <el-button color="#a372df" plain @click.stop="editCourse('exam', item.id, item)">
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

  <!-- 未排课程原因弹窗 -->
  <el-dialog v-model="helpDialogVisible" title="未排课程原因" width="70%">
    <el-table :data="helpData" style="width: 100%" stripe>
      <el-table-column prop="courseName" label="课程名称" width="180" />
      <el-table-column prop="teacherName" label="教师" width="120" />
      <el-table-column prop="department" label="院系" width="180" />
      <el-table-column prop="classComposition" label="班级" width="200" />
      <el-table-column prop="conflictReason" label="冲突原因" width="150" />
      <el-table-column prop="designatedRoomType" label="指定教室类型" width="150" />
      <el-table-column prop="weeklyHours" label="周学时" width="120" />
      <el-table-column prop="scheduledHours" label="已排课时" width="120" />
      <el-table-column prop="schedulingPriority" label="优先级" width="100" />
    </el-table>
  </el-dialog>

  <!-- 编辑状态弹窗 -->
  <el-dialog v-model="editDialogVisible" title="编辑排课状态" width="50%">
    <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="100px" status-icon>
      <el-form-item label="当前状态">
        <el-tag
          :type="
            editForm.currentStatus == '0'
              ? 'info'
              : editForm.currentStatus == '1'
                ? 'warning'
                : editForm.currentStatus == '2'
                  ? 'success'
                  : editForm.currentStatus == '3'
                    ? 'danger'
                    : 'warning'
          "
        >
          {{
            editForm.currentStatus == '0'
              ? '待执行'
              : editForm.currentStatus == '1'
                ? '进行中'
                : editForm.currentStatus == '2'
                  ? '已完成'
                  : editForm.currentStatus == '3'
                    ? '失败'
                    : '进行中'
          }}
        </el-tag>
      </el-form-item>
      <el-form-item label="新状态" prop="newStatus">
        <el-select v-model="editForm.newStatus" placeholder="请选择新状态">
          <el-option label="待执行" value="0" />
          <el-option label="进行中" value="1" />
          <el-option label="已完成" value="2" />
          <el-option label="失败" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="修改原因" prop="reason">
        <el-input
          v-model="editForm.reason"
          type="textarea"
          :rows="3"
          placeholder="请输入修改原因"
        />
      </el-form-item>
      <el-form-item label="负责人签名" prop="signature">
        <HandwrittenSignature v-model="editForm.signature" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, defineProps, onMounted, ref } from 'vue'
import { Delete, Edit, Search } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { getCourseSchedulingAPI, getTimetableHelpAPI } from '@/apis/course.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HandwrittenSignature from '@/components/signature.vue'

const router = useRouter()
const userStore = useUserStore()
let courseList = reactive({
  arr: [],
})
let examList = reactive({
  arr: [
    {
      id: 0,
      title: '第一次考试',
      status: '未发布',
      time: '2025-2-8 15:30',
      course: 54,
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
      course: 54,
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
onMounted(async () => {
  const res = await getCourseSchedulingAPI()
  courseList.arr = [...res.data.data].reverse()
  for (let i = 0; i < courseList.arr.length; i++) {
    courseList.arr[i].startTime = courseList.arr[i].startTime.replace('T', ' ')
  }
})
defineProps({
  activeMessage: Array,
})

function deleteCourse(type, id) {
  console.log('删除', type, id)
}

// 编辑表单相关
const editDialogVisible = ref(false)
const editFormRef = ref(null)
const editForm = reactive({
  id: '',
  type: '',
  currentStatus: '',
  newStatus: '',
  reason: '',
  signature: '',
  taskName: '',
})

const editRules = {
  newStatus: [{ required: true, message: '请选择新状态', trigger: 'change' }],
  reason: [{ required: true, message: '请输入修改原因', trigger: 'blur' }],
  signature: [{ required: true, message: '请进行签名', trigger: 'blur' }],
}

function editCourse(type, id, item) {
  console.log('编辑', type, id, item)
  editForm.id = id
  editForm.type = type
  editForm.taskName = item.taskName || item.title
  editForm.currentStatus = item.taskStatus || (item.status === '已发布' ? '1' : '0')
  editForm.newStatus = ''
  editForm.reason = ''
  editForm.signature = ''
  editDialogVisible.value = true
}

// 提交编辑表单
const submitEditForm = () => {
  editFormRef.value.validate(async valid => {
    if (valid) {
      // 这里应该调用API更新状态
      console.log('提交编辑表单', editForm)

      // 模拟API调用成功
      ElMessage.success(
        `已将"${editForm.taskName}"状态从${
          editForm.currentStatus == '0'
            ? '待执行'
            : editForm.currentStatus == '1'
              ? '进行中'
              : editForm.currentStatus == '2'
                ? '已完成'
                : editForm.currentStatus == '3'
                  ? '失败'
                  : '进行中'
        }修改为${
          editForm.newStatus == '0'
            ? '待执行'
            : editForm.newStatus == '1'
              ? '进行中'
              : editForm.newStatus == '2'
                ? '已完成'
                : editForm.newStatus == '3'
                  ? '失败'
                  : '进行中'
        }`,
      )

      // 更新本地数据
      if (editForm.type === 'class') {
        const index = courseList.arr.findIndex(item => item.scheduleTaskId === editForm.id)
        if (index !== -1) {
          courseList.arr[index].taskStatus = editForm.newStatus
        }
      } else {
        const index = examList.arr.findIndex(item => item.id === editForm.id)
        if (index !== -1) {
          examList.arr[index].status = editForm.newStatus === '1' ? '已发布' : '未发布'
        }
      }

      editDialogVisible.value = false
    } else {
      ElMessage.error('表单验证失败，请检查输入')
      return false
    }
  })
}

const courseClick = (id, string, name) => {
  const identity = userStore.user.identity.toLowerCase()
  router.push(`/${identity}/functionPage/course/${id}/${string}?name=${name}`)
}

const helpDialogVisible = ref(false)
const helpData = ref([])

//获取课表未排原因
const helpClick = async id => {
  console.log('helpClick triggered with id:', id)
  try {
    const res = await getTimetableHelpAPI(id)
    console.log('API response:', res.data)
    if (res.data.data) {
      // 只取前20条数据
      helpData.value = res.data.data.slice(0, 20)
      helpDialogVisible.value = true
    } else {
      ElMessage.info('暂无未排课程数据')
    }
  } catch (error) {
    console.error('获取未排课程原因失败:', error)
    ElMessage.error('获取未排课程原因失败')
  }
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
      .status0 {
        color: $word-grey-color;
      }
      .status1 {
        color: $main-yellow;
      }
      .status2 {
        color: $purple;
      }
      .status3 {
        color: $red;
      }
      .status4 {
        color: $main-green;
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
        .iconfont::before {
          font-size: 13px;
          margin-left: 5px;
        }
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
          line-height: 30px;
          font-size: 14px;

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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
