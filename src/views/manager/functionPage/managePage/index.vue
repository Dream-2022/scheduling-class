<template>
  <div class="wow animate__fadeInUp white-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">系统管理</div>
        <div style="margin-left: 20px; margin-right: 20px">>></div>
        <div>
          <span
            class="list"
            :class="activeTab === 'teacher' ? 'list-active' : ''"
            @click="activeTab = 'teacher'"
            >教师管理</span
          >
          <span
            class="list"
            :class="activeTab === 'student' ? 'list-active' : ''"
            @click="activeTab = 'student'"
            >学生管理</span
          >
        </div>
      </div>
      <el-divider content-position="center"
        ><strong style="font-size: 17px; color: #4d4d4d">{{
          activeTab === 'teacher' ? '教师管理' : '学生管理'
        }}</strong></el-divider
      >
      <div class="search-box">
        <el-input
          v-model="searchKeywordName"
          clearable
          style="height: 32px; max-width: 280px"
          placeholder="输入筛选的姓名"
          :prefix-icon="Search"
        />
        <el-input
          v-model="searchKeyword"
          clearable
          style="height: 32px; max-width: 280px"
          placeholder="请输入工号/学号"
          :prefix-icon="Search"
        />
        <el-select v-model="department" clearable placeholder="选择院系" style="max-width: 280px">
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select v-model="status" clearable placeholder="选择状态" style="max-width: 280px">
          <el-option label="全部" value="" />
          <el-option label="正常" value="正常" />
          <el-option label="禁用" value="禁用" />
        </el-select>
        <el-button
          color="#547bf1"
          plain
          :icon="Search"
          style="margin-bottom: 10px"
          @click="handleSearch"
        >
          搜索
        </el-button>
      </div>
      <div class="middle-word"></div>
      <div class="action-area">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="danger" :disabled="!selectedRows.length" @click="handleBatchDelete">
          批量删除
        </el-button>
        <el-button type="warning" :disabled="!selectedRows.length" @click="handleResetPassword">
          批量重置密码
        </el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userId" label="工号/学号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="preferredCourses" label="偏好课程" min-width="160">
          <template #default="scope">
            <div>
              <div>
                {{ scope.row.preferredCourses == null ? '暂无' : scope.row.preferredCourses }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="院系" min-width="150" />
        <el-table-column prop="major" label="专业" min-width="150" v-if="activeTab === 'student'" />
        <el-table-column prop="grade" label="年级" width="100" v-if="activeTab === 'student'" />
        <el-table-column prop="class" label="班级" width="140" v-if="activeTab === 'student'" />
        <el-table-column prop="title" label="职称" width="140" v-if="activeTab === 'teacher'" />
        <el-table-column prop="status" label="状态" width="100">
          <div class="label-box">
            <div class="third-label">正常</div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <div>
              <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            </div>
            <div>
              <el-button type="warning" link @click="handleResetSinglePassword(scope.row)">
                重置密码
              </el-button>
            </div>
            <div>
              <el-button type="danger" link @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-area">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>

  <!-- 新增/编辑对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增' + userTypeText : '编辑' + userTypeText"
    width="600px"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="工号/学号" prop="id">
        <el-input v-model="formData.id" :disabled="dialogType === 'edit'" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="院系" prop="department">
        <el-select v-model="formData.department" placeholder="请选择院系" style="width: 100%">
          <el-option
            v-for="item in departmentOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeTab === 'student'" label="专业" prop="major">
        <el-select
          v-model="formData.major"
          placeholder="请选择专业"
          style="width: 100%"
          :disabled="!formData.department"
        >
          <el-option
            v-for="item in majorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeTab === 'student'" label="年级" prop="grade">
        <el-select v-model="formData.grade" placeholder="请选择年级" style="width: 100%">
          <el-option
            v-for="item in gradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeTab === 'student'" label="班级" prop="class">
        <el-select
          v-model="formData.class"
          placeholder="请选择班级"
          style="width: 100%"
          :disabled="!formData.major || !formData.grade"
        >
          <el-option
            v-for="item in classOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeTab === 'teacher'" label="职称" prop="title">
        <el-select v-model="formData.title" placeholder="请选择职称" style="width: 100%">
          <el-option
            v-for="item in titleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="正常">正常</el-radio>
          <el-radio label="禁用">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 批量导入对话框 -->
  <el-dialog v-model="importDialogVisible" title="批量导入" width="500px">
    <el-upload
      class="upload-demo"
      drag
      action="#"
      :auto-upload="false"
      :on-change="handleFileChange"
      :limit="1"
      accept=".xlsx, .xls"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">请上传Excel文件，仅支持.xlsx或.xls格式</div>
      </template>
    </el-upload>
    <div class="download-template">
      <el-button type="primary" link @click="downloadTemplate">
        <el-icon><Download /></el-icon>
        下载导入模板
      </el-button>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImport">导入</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, UploadFilled, Download } from '@element-plus/icons-vue'
import { getDepartmentsAPI, getMajorsAPI, getGradesAPI, getClassesAPI } from '@/apis/classMajor'
import { getTeacherAndStudentAPI } from '@/apis/person'
// 状态变量
const activeTab = ref('teacher')
const searchKeyword = ref('')
const searchKeywordName = ref('')
const department = ref('')
const status = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const tableData = ref([])
const selectedRows = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const importDialogVisible = ref(false)
const importFile = ref(null)
const total = ref(0)

// 表单相关
const formRef = ref(null)
const formData = ref({
  id: '',
  name: '',
  email: '',
  department: '',
  major: '',
  grade: '',
  class: '',
  title: '',
  status: '正常',
})

// 选项数据
const departmentOptions = ref([])
const majorOptions = ref([])
const gradeOptions = ref([])
const classOptions = ref([])
const titleOptions = ref([
  { value: '教授', label: '教授' },
  { value: '副教授', label: '副教授' },
  { value: '讲师', label: '讲师' },
  { value: '助教', label: '助教' },
])

// 计算属性
const userTypeText = computed(() => {
  return activeTab.value === 'teacher' ? '教师' : '学生'
})

// 表单验证规则
const formRules = {
  id: [
    { required: true, message: '请输入工号/学号', trigger: 'blur' },
    { pattern: /^\d{5,10}$/, message: '工号/学号应为5-10位数字', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应为2-20个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  department: [{ required: true, message: '请选择院系', trigger: 'blur' }],
  major: [{ required: activeTab.value === 'student', message: '请选择专业', trigger: 'blur' }],
  grade: [{ required: activeTab.value === 'student', message: '请选择年级', trigger: 'blur' }],
  class: [{ required: activeTab.value === 'student', message: '请选择班级', trigger: 'blur' }],
  title: [{ required: activeTab.value === 'teacher', message: '请选择职称', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
}

// 生命周期钩子
onMounted(() => {
  fetchDepartments()
  fetchData()
})

// 监听标签页变化
watch(activeTab, () => {
  currentPage.value = 1
  fetchData()
})

// 方法
const fetchDepartments = async () => {
  try {
    const res = await getDepartmentsAPI()
    departmentOptions.value = res.data.data.map(item => ({
      value: item.name,
      label: item.name,
    }))
  } catch (error) {
    console.error('获取院系数据失败:', error)
    ElMessage.error('获取院系数据失败')
  }
}

const fetchMajors = async department => {
  if (!department) return
  try {
    const res = await getMajorsAPI(department)
    if (res.data.code === 0) {
      majorOptions.value = res.data.data.map(item => ({
        value: item.name,
        label: item.name,
      }))
    }
  } catch (error) {
    console.error('获取专业数据失败:', error)
    ElMessage.error('获取专业数据失败')
  }
}

const fetchGrades = async major => {
  if (!major) return
  try {
    const res = await getGradesAPI(major)
    if (res.data.code === 0) {
      gradeOptions.value = res.data.data.map(item => ({
        value: item,
        label: item.toString() + '级',
      }))
    }
  } catch (error) {
    console.error('获取年级数据失败:', error)
    ElMessage.error('获取年级数据失败')
  }
}

const fetchClasses = async (major, grade) => {
  if (!major || !grade) return
  try {
    const res = await getClassesAPI(major, grade)
    if (res.data.code === 0) {
      classOptions.value = res.data.data.map(item => ({
        value: item.name,
        label: item.name,
      }))
    }
  } catch (error) {
    console.error('获取班级数据失败:', error)
    ElMessage.error('获取班级数据失败')
  }
}

const fetchData = async () => {
  const res = await getTeacherAndStudentAPI(
    searchKeyword.value,
    searchKeywordName.value,
    department.value,
    activeTab.value === 'teacher' ? '' : '学生',
    currentPage.value,
    12,
  )
  total.value = res.data.data.total
  console.log(res.data.data)
  tableData.value = res.data.data.records
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleSelectionChange = selection => {
  selectedRows.value = selection
}

const handleSizeChange = val => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = val => {
  currentPage.value = val
  fetchData()
}

const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    id: '',
    name: '',
    email: '',
    department: '',
    major: '',
    grade: '',
    class: '',
    title: '',
    status: '正常',
  }
  dialogVisible.value = true
}

const handleEdit = row => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = row => {
  ElMessageBox.confirm(`确定要删除${userTypeText.value} ${row.name} 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟删除操作
      ElMessage.success('删除成功')
      fetchData()
    })
    .catch(() => {
      // 取消删除
    })
}

const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }

  ElMessageBox.confirm(`确定要批量删除选中的 ${selectedRows.value.length} 条记录吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 模拟批量删除操作
      ElMessage.success('批量删除成功')
      fetchData()
    })
    .catch(() => {
      // 取消删除
    })
}

const handleResetPassword = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请至少选择一条记录')
    return
  }

  ElMessageBox.confirm(`确定要重置选中 ${selectedRows.value.length} 条记录的密码吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('密码重置成功')
    })
    .catch(() => {
      // 取消重置
    })
}

const handleResetSinglePassword = row => {
  ElMessageBox.confirm(`确定要重置${userTypeText.value} ${row.name} 的密码吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('密码重置成功')
    })
    .catch(() => {})
}

const handleSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
      dialogVisible.value = false
      fetchData()
    } else {
      return false
    }
  })
}

const handleFileChange = file => {
  importFile.value = file
}

const handleImport = () => {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  // 模拟导入操作
  ElMessage.success('导入成功')
  importDialogVisible.value = false
  fetchData()
}

const downloadTemplate = () => {
  // 模拟下载模板
  ElMessage.success('模板下载成功')
}

// 监听表单数据变化
watch(
  () => formData.value.department,
  newVal => {
    if (newVal) {
      fetchMajors(newVal)
    }
  },
)

watch(
  () => formData.value.major,
  newVal => {
    if (newVal) {
      fetchGrades(newVal)
    }
  },
)

watch(
  () => formData.value.grade,
  newVal => {
    if (newVal) {
      fetchClasses(formData.value.major, newVal)
    }
  },
)
</script>

<style lang="scss" scoped>
.white-box {
  width: 90%;
  min-width: 600px;
  margin: 25px auto;
  padding-bottom: 50px;
  position: relative;
  background-color: #fff;
  padding-top: 5px;
  border-radius: 10px;
  box-shadow: 0px 6px 10px 3px rgba(0, 0, 0, 0.1);

  .middle-box {
    color: $word-black-color;
    width: 95%;
    margin: 20px auto;

    .title-box {
      display: flex;
      line-height: 30px;
      margin-bottom: 30px;

      .middle-title {
        font-weight: 600;
        font-size: 18px;
      }

      .list {
        cursor: pointer;
        font-size: 16px;
        display: inline-block;
        color: $grey;
        width: 80px;
      }

      .list-active {
        color: $title-color;
        text-decoration: underline;
      }
    }

    .middle-word {
      margin-top: 30px;
      margin-bottom: 10px;
      font-size: 15px;
    }

    .search-box {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .action-area {
      display: flex;
      gap: 10px;
      margin: 20px 0;
    }

    .pagination-area {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .el-table {
    .label-box {
      width: 100%;
      display: flex;
      justify-content: center;
      .first-label,
      .second-label,
      .third-label {
        text-align: center;
        border-radius: 5px;
        width: 60px;
        color: $main-yellow;
        background-color: $yellow-shallow;
      }
      .second-label {
        color: $red-word;
        background-color: $red-back;
      }
      .third-label {
        color: $green-word;
        background-color: $green-back;
      }
    }
  }
}

.download-template {
  margin-top: 15px;
  text-align: center;
}

:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
