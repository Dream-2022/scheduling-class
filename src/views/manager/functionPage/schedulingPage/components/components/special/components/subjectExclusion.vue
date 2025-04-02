<template>
  <div class="exclusion-container">
    <div class="wow animate__fadeInLeft warn-box">
      <span class="iconfont icon-icon-gantanhao"></span>
      科目互斥：设置互斥的科目不能在同一时间段排课
    </div>
    <div class="exclusion-search">
      <el-cascader
        :options="SubjectOptions"
        placeholder="选择科目"
        filterable
        :props="option"
        style="margin-right: 10px; width: 240px"
        clearable
        v-model="selectedArr"
      >
      </el-cascader>
      <el-button
        color="#547bf1"
        plain
        style="margin-right: auto"
        :icon="Search"
        @click="handleSearch"
        >搜索</el-button
      >
      <el-button color="#547bf1" :icon="Plus" @click="subjectVisible = true">新增互斥</el-button>
    </div>
    <div class="exclusion-table">
      <el-table :data="exclusionList" style="width: 100%" stripe>
        <el-table-column label="选中科目" min-width="200">
          <template #default="scope">
            <div class="subject-tags">
              <el-tag
                v-for="subject in scope.row.subjects1"
                :key="subject"
                closable
                @close="handleRemoveSubject(scope.row, subject, 1)"
              >
                {{ subject[1] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="互斥科目" min-width="200">
          <template #default="scope">
            <div class="subject-tags">
              <el-tag
                v-for="subject in scope.row.subjects2"
                :key="subject"
                closable
                @close="handleRemoveSubject(scope.row, subject, 2)"
              >
                {{ subject[1] }}
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

  <el-dialog v-model="subjectVisible" title="新增科目互斥" width="600">
    <div class="dialog-body">
      <el-form ref="ruleFormRef" :model="addForm" :rules="rules" label-width="120px" status-icon>
        <el-form-item label="选中科目" prop="subjects1">
          <el-cascader
            style="width: 400px"
            placeholder="请选择科目"
            v-model="addForm.subjects1"
            filterable
            :options="SubjectOptions"
            :props="option"
            clearable
          />
        </el-form-item>
        <el-form-item label="互斥科目" prop="subjects2">
          <el-cascader
            style="width: 400px"
            placeholder="请选择互斥科目"
            v-model="addForm.subjects2"
            filterable
            :options="SubjectOptions"
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
        <el-button @click="subjectVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { getDepartmentsAPI, getClassesAPI } from '@/apis/classMajor'
import { getCoursePageSizeAPI } from '@/apis/course'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:allContent'])
const props = defineProps({
  allContent: {
    type: Object,
  },
})

const SubjectOptions = ref([])
const ScopeOptions = ref([])
const option = ref()
const scopeOption = ref()
const selectedArr = ref('')
const subjectVisible = ref(false)
const exclusionList = ref(props.allContent.subjectExclusion || [])

const addForm = ref({
  subjects1: [],
  subjects2: [],
  effectiveScope: [],
})

// 表单验证规则
const rules = ref({
  subjects1: [{ required: true, message: '请选择科目组1', trigger: 'blur' }],
  subjects2: [{ required: true, message: '请选择科目组2', trigger: 'blur' }],
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
  SubjectOptions.value = nodes
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
      const res = await getCoursePageSizeAPI('', '', '', selectedPath[0], 1, 1, 100)
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
    !addForm.value.subjects1.length ||
    !addForm.value.subjects2.length ||
    !addForm.value.effectiveScope.length
  ) {
    ElMessage.warning('请填写完整信息')
    return
  }

  exclusionList.value.push(JSON.parse(JSON.stringify(addForm.value)))
  addForm.value = {
    subjects1: [],
    subjects2: [],
    effectiveScope: [],
  }
  subjectVisible.value = false
  ElMessage.success('添加成功！')
}

// 删除互斥关系
function handleDelete(index) {
  exclusionList.value.splice(index, 1)
  ElMessage.success('删除成功！')
}

// 移除科目
function handleRemoveSubject(row, subject, group) {
  const key = `subjects${group}`
  row[key] = row[key].filter(item => item[1] !== subject[1])
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
      subjectExclusion: newValue,
    })
  },
  { deep: true },
)

// 在 script setup 中添加搜索方法
const handleSearch = () => {
  if (!selectedArr.value || selectedArr.value.length === 0) {
    // 如果没有选择搜索条件，显示全部
    exclusionList.value = props.allContent.subjectExclusion || []
    return
  }

  // 根据选择的科目进行过滤
  exclusionList.value = (props.allContent.subjectExclusion || []).filter(item => {
    // 检查科目组1和科目组2
    return (
      item.subjects1.some(subject => {
        return selectedArr.value.some(selected => {
          return selected[0] === subject[0] && selected[1] === subject[1]
        })
      }) ||
      item.subjects2.some(subject => {
        return selectedArr.value.some(selected => {
          return selected[0] === subject[0] && selected[1] === subject[1]
        })
      })
    )
  })
}
</script>

<style lang="scss" scoped>
.exclusion-container {
  min-height: 400px;
  .exclusion-search {
    display: flex;
    margin-bottom: 20px;
  }

  .subject-tags,
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
