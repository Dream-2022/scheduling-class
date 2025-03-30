<template>
  <div class="major-person-box">
    <div class="plan-botton">
      <el-button color="#547bf1" plain @click="addTeacherOrStudentClick('教师')">
        批量添加课程
      </el-button>
      <el-button color="#f56c6c" plain @click="batchDeleteClick">
        {{ showSelectionColumn ? '确认删除' : '批量删除' }}
      </el-button>
      <el-button
        v-if="showSelectionColumn"
        color="#547bf1"
        @click="showSelectionColumn = !showSelectionColumn"
      >
        取消
      </el-button>

      <el-button color="#547bf1" @click="saveEssentialClick" style="margin-left: auto">
        保存设置
      </el-button>
    </div>
    <div class="plan-content">
      <div class="plan-search">
        <el-input
          v-model="searchList.name"
          style="width: 240px"
          placeholder="筛选课程名称"
          clearable
        />
        <el-input
          v-model="searchList.id"
          style="width: 240px"
          placeholder="输入课程 id"
          clearable
        />
        <el-input
          v-model="searchList.id"
          style="width: 240px"
          placeholder="输入课程类别"
          clearable
        />
        <el-select
          v-model="searchList.department"
          filterable
          placeholder="筛选所属院系"
          style="width: 240px"
        >
          <el-option
            v-for="item in departmentList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button color="#547bf1" @click="searchClick(1)" plain :icon="Search"> 搜索 </el-button>
      </div>
      <el-table
        :data="personList"
        style="width: 100%"
        ref="multipleTableRef"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column
          v-if="showSelectionColumn"
          type="selection"
          :selectable="selectable"
          min-width="30"
        ></el-table-column>
        <el-table-column prop="courseId" label="课程 id" :min-width="80" />
        <el-table-column prop="name" label="课程名称" :min-width="100" />
        <el-table-column prop="isActive" label="是否启用" :min-width="120" />
        <el-table-column prop="type" label="课程类别" :min-width="140" />
        <el-table-column prop="department" label="所属院系" :min-width="150">
          <template #default="{ row }">
            {{ row.department == null ? '暂无' : row.department }}
          </template>
        </el-table-column>
        <el-table-column prop="practicalHours" label="课时" :min-width="80" />
        <el-table-column prop="createdAt" label="添加时间" :min-width="130" />
        <el-table-column label="操作" :min-width="160">
          <template #default="{ row }">
            <el-button
              @click="deletePersonClick(row.name)"
              color="#f56c6c"
              style="color: #fff"
              size="small"
              :icon="Delete"
            >
              删除
            </el-button>
            <el-button
              size="small"
              @click="editPersonClick(row.id)"
              color="#547bf1"
              plain
              :icon="Edit"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :pager-count="11"
          layout="prev, pager, next"
          :total="1000"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineExpose, onMounted, defineEmits } from 'vue'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { getCoursePageSizeAPI } from '@/apis/course'
import { getDepartmentsAPI } from '@/apis/classMajor'
import { ElMessage, ElMessageBox } from 'element-plus'
const emit = defineEmits(['titleValue', 'dialogVisible'])

const searchList = ref({
  name: '',
  id: '',
  identity: '',
  department: '',
  type: '',
})
const departmentList = ref([])
const personList = ref([])
const multipleTableRef = ref(null) //多选表格ref
const showSelectionColumn = ref(false) //是否显示多选框
const pageSize = ref(1)
onMounted(async () => {
  //获取院系
  const res1 = await getDepartmentsAPI()
  console.log(res1.data)
  departmentList.value = res1.data.data.map(item => ({
    label: item.name,
    value: item.name,
  }))
  searchClick(1)
})
const selectable = row => {
  return row
}
//点击搜索
async function searchClick(currentPage) {
  const res = await getCoursePageSizeAPI(
    searchList.value.id,
    searchList.value.name,
    searchList.value.type,
    searchList.value.department,
    '',
    currentPage,
    11,
  )
  console.log(res.data)
  personList.value = res.data.data.records
  pageSize.value = res.data.data.size
  if (res.data.code == 0) {
    personList.value.forEach((item, index) => {
      personList.value[index].createdAt = item.createdAt.replace('T', ' ')
    })
  }
  console.log(personList.value)
}
//页码跳转
const handleCurrentChange = currentPage => {
  console.log(`当前页码为: ${currentPage}`)
  searchClick(currentPage)
}
//传值给父组件，弹出上传文件的弹窗
function addTeacherOrStudentClick(title) {
  console.log('传值')
  emit('titleValue', title)
  emit('dialogVisible', true)
}
//父组件回调
function triggerEvent(value) {
  console.log(value)
}
//删除修改用户
function deletePersonClick(name) {
  console.log('删除')
  ElMessageBox.confirm(`是否删除用户${name}?`, '提醒', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
//批量删除
function batchDeleteClick() {
  if (showSelectionColumn.value) {
    console.log(multipleTableRef.value)
    console.log(multipleTableRef.value.selection)
    ElMessageBox.confirm(`是否确认删除选中的用户?`, '提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
  }
  showSelectionColumn.value = !showSelectionColumn.value
}
//保存设置
function saveEssentialClick() {
  console.log('保存设置')
  ElMessage.success('保存成功')
}
// 暴露方法给父组件调用
defineExpose({ triggerEvent })
</script>
<style lang="scss" scoped>
.major-person-box {
  .plan-botton {
    padding-top: 10px;
    display: flex;
  }
  .plan-content {
    .plan-search {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }
    .plan-academyes {
      margin: 20px 0;

      .icon {
        transition: transform 0.3s ease-in-out;
      }
      .rotated {
        transform: rotate(0deg);
      }
      .rotate {
        transform: rotate(-90deg);
      }
      .plan-academy {
        box-shadow: 0 2px 6px 1px rgba(0, 26, 255, 0.2);
        color: #fff;
        border-radius: 10px;
        background-color: $main-blue;
        display: flex;
        padding: 10px 15px;
        line-height: 24px;
        height: 24px;
        .plan-academy-name {
          font-size: 16px;
          margin-right: auto;
        }
        .plan-operate {
          .icon-delete:hover {
            color: #ffd8d8;
          }
          .icon-edit:hover {
            color: #d6d6fb;
          }
          .icon:hover {
            color: $blue-back;
          }
        }
      }
    }
    .pagination-box {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  }
}
</style>
