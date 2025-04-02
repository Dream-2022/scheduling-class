<template>
  <div class="exclusion-container">
    <div class="wow animate__fadeInLeft warn-box">
      <span class="iconfont icon-icon-gantanhao"></span>
      教师互斥：设置互斥的教师不能在同一时间段排课
    </div>
    <div class="exclusion-search">
      <el-cascader
        :options="TeacherOptions"
        placeholder="选择教师"
        filterable
        :props="option"
        style="margin-right: 10px; width: 240px"
        clearable
        v-model="selectedArr"
      >
      </el-cascader>
      <el-button color="#547bf1" plain style="margin-right: auto" :icon="Search">搜索</el-button>
      <el-button color="#547bf1" :icon="Plus" @click="teacherVisible = true">新增互斥</el-button>
    </div>
    <div class="exclusion-table">
      <el-table :data="exclusionList" style="width: 100%" stripe>
        <el-table-column label="选中教师" min-width="200">
          <template #default="scope">
            <div class="teacher-tags">
              <el-tag
                v-for="teacher in scope.row.teachers1"
                :key="teacher"
                closable
                @close="handleRemoveTeacher(scope.row, teacher, 1)"
              >
                {{ teacher[1] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="互斥教师" min-width="200">
          <template #default="scope">
            <div class="teacher-tags">
              <el-tag
                v-for="teacher in scope.row.teachers2"
                :key="teacher"
                closable
                @close="handleRemoveTeacher(scope.row, teacher, 2)"
              >
                {{ teacher[1] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="生效范围" min-width="200">
          <template #default="scope">
            <div class="scope-tags">
              <el-tag
                v-for="s in scope.row.effectiveScope"
                :key="s"
                closable
                @close="handleRemoveScope(s.row, s)"
              >
                {{ s[1] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="danger" plain size="small" @click="handleDelete(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="teacherVisible" title="新增教师互斥" width="600">
    <div class="dialog-body">
      <el-form ref="ruleFormRef" :model="addForm" :rules="rules" label-width="120px" status-icon>
        <el-form-item label="选中教师" prop="teachers1">
          <el-cascader
            style="width: 400px"
            placeholder="请选择教师"
            v-model="addForm.teachers1"
            filterable
            :options="TeacherOptions"
            :props="option"
            clearable
          />
        </el-form-item>
        <el-form-item label="互斥教师" prop="teachers2">
          <el-cascader
            style="width: 400px"
            placeholder="请选择互斥教师"
            v-model="addForm.teachers2"
            filterable
            :options="TeacherOptions"
            :props="option"
            clearable
          />
        </el-form-item>
        <el-form-item label="生效范围" prop="effectiveScope">
          <el-cascader
            style="width: 400px"
            placeholder="请选择生效范围"
            v-model="addForm.effectiveScope"
            filterable
            :options="ScopeOptions"
            :props="scopeOption"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleAdd" color="#547bf1" plain>新增</el-button>
        <el-button @click="teacherVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { getDepartmentsAPI, getClassesAPI } from '@/apis/classMajor'
import { getTeacherAndStudentAPI } from '@/apis/person'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
  },
})

const TeacherOptions = ref([])
const ScopeOptions = ref([])
const option = ref()
const scopeOption = ref()
const selectedArr = ref('')
const teacherVisible = ref(false)
const exclusionList = ref(props.allContent.teacherExclusion || [])

const addForm = ref({
  teachers1: [],
  teachers2: [],
  effectiveScope: [],
})

// 表单验证规则
const rules = ref({
  teachers1: [{ required: true, message: '请选择教师组', trigger: 'blur' }],
  teachers2: [{ required: true, message: '请选择互斥教师组', trigger: 'blur' }],
  effectiveScope: [{ required: true, message: '请选择生效范围', trigger: 'blur' }],
})

onMounted(async () => {
  await getOptions()
})

// 获取选项数据
async function getOptions() {
  const res = await getDepartmentsAPI()
  const nodes = res.data.data.map(item => ({
    value: item.name,
    label: item.name,
    leaf: false,
  }))
  TeacherOptions.value = nodes
  ScopeOptions.value = [
    {
      value: 'global',
      label: '全局',
      leaf: true,
    },
    ...nodes,
  ]

  option.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      const selectedPath = node.pathValues
      const res = await getTeacherAndStudentAPI('', '', selectedPath[0], '', 1, 100)
      const nodes = res.data.data.records.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }

  scopeOption.value = {
    lazy: true,
    multiple: true,
    async lazyLoad(node, resolve) {
      if (node.level === 0) return
      const selectedPath = node.pathValues
      const res = await getClassesAPI(selectedPath[0], '')
      console.log(res.data)
      const nodes = res.data.data.map(item => ({
        value: item.name,
        label: item.name,
        leaf: true,
      }))
      resolve(nodes)
    },
  }
}

// 添加互斥关系
function handleAdd() {
  if (
    !addForm.value.teachers1.length ||
    !addForm.value.teachers2.length ||
    !addForm.value.effectiveScope.length
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  exclusionList.value.push(JSON.parse(JSON.stringify(addForm.value)))
  addForm.value = {
    teachers1: [],
    teachers2: [],
    effectiveScope: [],
  }
  teacherVisible.value = false
  ElMessage.success('添加成功！')
}

// 删除互斥关系
function handleDelete(index) {
  exclusionList.value.splice(index, 1)
  ElMessage.success('删除成功！')
}

// 移除教师
function handleRemoveTeacher(row, teacher, group) {
  const key = `teachers${group}`
  row[key] = row[key].filter(item => item[1] !== teacher[1])
}

// 移除生效范围
function handleRemoveScope(row, scope) {
  row.effectiveScope = row.effectiveScope.filter(item => item[1] !== scope[1])
}

// 监听数据变化并更新父组件
watch(
  exclusionList,
  newValue => {
    emit('update:allContent', {
      ...props.allContent,
      teacherExclusion: newValue,
    })
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.exclusion-container {
  min-height: 400px;
  .exclusion-search {
    display: flex;
    margin-bottom: 20px;
  }

  .teacher-tags,
  .scope-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .warn-box {
    background-color: #fff3e0;
    color: #cd871d;
    padding: 5px 15px;
    font-size: 14px;
    line-height: 24px;
    width: 100%;
    box-sizing: border-box;
    margin: 0 0 10px 0;
    border-radius: 5px;
    border: 1px solid #ffdb9e;

    .iconfont::before {
      font-size: 16px;
    }
  }
}
</style>
