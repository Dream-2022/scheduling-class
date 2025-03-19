<template>
  <div class="major-information-box">
    <div class="plan-botton">
      <el-button color="#547bf1" plain @click="addMajorOrClassClick('班级')">
        批量添加班级
      </el-button>
      <el-button color="#547bf1" plain @click="addMajorOrClassClick('专业')">
        批量添加专业
      </el-button>
      <el-button style="margin-right: auto" color="#547bf1" plain @click="academyAddVisible = true">
        添加学院
      </el-button>
      <el-button color="#547bf1" @click="saveEssentialClick"> 保存设置 </el-button>
    </div>
    <div class="plan-content">
      <div class="plan-search">
        <el-cascader
          :options="academyOptions"
          placeholder="筛选学院、专业或班级"
          filterable
          :props="option"
          style="width: 500px"
          clearable
          @change="cascaderChange"
        />
        <el-button color="#547bf1" @click="searchClick" plain :icon="Search"> 搜索 </el-button>
      </div>
      <div class="plan-academyes" v-for="item in academyList.arr" :key="item">
        <div class="plan-academy">
          <div class="plan-academy-name">{{ item.name }} （{{ item.departmentId }}）</div>
          <div class="plan-operate">
            <el-icon class="icon-delete" @click="academyDeleteClick"><Delete /></el-icon>
            <el-icon class="icon-edit"><Edit /></el-icon>
            <el-icon
              class="icon"
              :class="item.active ? 'rotate' : 'rotated'"
              @click="toggleActive(item, true)"
            >
              <CaretLeft />
            </el-icon>
          </div>
        </div>
        <transition name="slide-fade">
          <div v-if="item.active" class="plan-majors">
            <div v-for="major in item.majorList" :key="major" class="plan-major-container">
              <div>
                <div class="plan-major">
                  <div class="plan-major-top">
                    <div class="plan-major-main">{{ major.name }}</div>
                    <div class="plan-major-id">{{ major.majorId }}</div>
                    <div class="plan-major-operate">
                      <el-icon class="icon-delete" @click="academyDeleteClick">
                        <Delete />
                      </el-icon>
                      <el-icon class="icon-delete" @click="academyActiveClick">
                        <LocationInformation />
                      </el-icon>
                      <el-icon class="icon-edit"><Edit /></el-icon>
                      <el-icon
                        class="icon"
                        :class="major.active ? 'rotate' : 'rotated'"
                        @click="toggleActive(major, false)"
                      >
                        <CaretLeft />
                      </el-icon>
                    </div>
                  </div>
                  <div class="plan-major-bottom">
                    <div class="plan-major-sub">{{ major.studyYears }} 年制</div>
                    <div
                      class="plan-major-status"
                      :class="major.isActive ? 'status-green' : 'status-red'"
                    >
                      {{ major.isActive ? '启用' : '不启用' }}
                    </div>
                    <div class="plan-major-time">2022-4-15</div>
                  </div>
                </div>
              </div>
              <transition name="slide-fade">
                <div class="plan-classes" v-if="major.active">
                  <div v-for="cla in major.classList" :key="cla">
                    <div class="plan-class">
                      <div class="plan-class-top">
                        <div>{{ cla.name }}</div>
                        <div class="plan-class-id">{{ cla.classId }}</div>
                      </div>
                      <div class="plan-class-bottom"></div>
                    </div>
                  </div>
                  <div v-if="major?.classList?.length == 0">
                    <el-empty :image-size="100" />
                  </div>
                </div>
              </transition>
            </div>
            <div v-if="item?.majorList?.length == 0">
              <el-empty :image-size="100" />
            </div>
          </div>
        </transition>
      </div>
      <div v-if="academyList.arr.length == 0">
        <el-empty :image-size="100" />
      </div>
    </div>
  </div>
  <el-dialog v-model="academyAddVisible" title="添加学院" width="30%">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      status-icon
    >
      <el-form-item label="学院名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addAcademyClick" color="#547bf1" plain>确认</el-button>
        <el-button @click="academyAddVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits, defineExpose } from 'vue'
import { Search, LocationInformation, CaretLeft, Edit, Delete } from '@element-plus/icons-vue'
import { getMajorsAPI, getClassesAPI, getDepartmentsAPI, getsearchAPI } from '@/apis/classMajor'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['titleValue', 'dialogVisible'])
const academyList = reactive({
  arr: [],
})
const academyAllList = reactive({
  arr: [],
})
const rules = {
  name: [{ required: true, message: '请输入请假事由', trigger: 'blur' }],
}
let option = ref()
let ruleFormRef = ref() //添加学院的弹窗表单
let ruleForm = ref({})
const academyOptions = ref([]) //判断是否展开
let selectedArr = null
let departmentX = ref([]),
  majorX = ref([])
const academyAddVisible = ref(false) //新增学院的弹窗
onMounted(async () => {
  getDepartments()
  for (let i = 0; i < academyList.arr.length; i++) {
    academyList.arr[i].active = false
  }
  academyOptions.value = academyList.arr
})
//子组件执行的事件
const triggerEvent = async () => {
  setTimeout(async () => {
    await getDepartments()
  }, 500)
}
//获取学院信息,设置option
async function getDepartments() {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  academyList.arr = res.data.data
  academyAllList.arr = [...res.data.data]
  option.value = {
    lazy: true,
    checkStrictly: true,
    lazyLoad: async (node, resolve) => {
      const { level, data } = node
      if (level === 0) {
        const nodes = academyList.arr.map(item => ({
          value: item.name,
          label: item.name,
          leaf: false,
        }))
        console.log(nodes)
        resolve(nodes)
      } else if (level === 1) {
        const result = academyAllList.arr.find(
          item => item.name == data.value && item.name == data.label,
        )
        if (typeof result.majorList === 'undefined') {
          const res = await getMajorsAPI(data.label)
          result.majorList = res.data.data
        }
        departmentX.value = JSON.parse(JSON.stringify(result))
        const nodes = result.majorList.map(item => ({
          value: item.name,
          label: item.name,
          leaf: false,
        }))
        resolve(nodes)
      } else if (level === 2) {
        const result1 = academyList.arr.find(item => item.name == departmentX.value.name)
        const result2 = result1.majorList.find(
          item => item.name == data.value && item.name == data.label,
        )
        if (typeof result2.classList === 'undefined') {
          const res = await getClassesAPI(result1.name, result2.name)
          result2.classList = res.data.data
        }
        majorX.value = JSON.parse(JSON.stringify(result2))
        const nodes = result2.classList.map(item => ({
          value: item.name,
          label: item.name,
          leaf: true,
        }))
        resolve(nodes)
      }
    },
  }
}
//切换学院的展开状态
async function toggleActive(item, flag) {
  if (item.active) {
    item.active = !item.active
    return
  }
  item.active = !item.active
  if (flag) {
    //已经获取过major了
    if (item.majorList !== undefined) {
      return
    }
    //没获取过，所以获取专业
    console.log(item.name)
    const res = await getMajorsAPI(item.name)
    item.majorList = res.data.data
    for (let i = 0; i < item.majorList.length; i++) {
      item.majorList[i].active = false
    }
    console.log(res.data)
    console.log(item.majorList)
    console.log(academyList.arr)
  } else {
    if (item.classList !== undefined) {
      return
    }
    //没获取过，所以获取班级
    console.log(item.departmentName, item.name)
    const res = await getClassesAPI(item.departmentName, item.name)
    item.classList = res.data.data
    console.log(res.data)
    for (let i = 0; i < item.classList.length; i++) {
      item.classList[i].active = false
    }
    console.log(item.classList)
  }
}
//处理搜索框的选中变化
function cascaderChange(value) {
  console.log('处理变化')
  selectedArr = [...value]
  console.log(value)
}
//点击搜索
async function searchClick() {
  console.log(selectedArr)
  if (selectedArr == null) {
    ElMessage.warning('请选择学院专业班级')
    return
  }
  const res = await getsearchAPI(
    selectedArr[0],
    selectedArr[1] == undefined ? '' : selectedArr[1],
    selectedArr[2] == undefined ? '' : selectedArr[2],
  )
  console.log(res.data)
  academyList.arr = res.data.data
  console.log(academyList.arr)
  if (selectedArr[1] != undefined) {
    academyList.arr[0].active = true
    if (selectedArr[2] != undefined && 'classList' in academyList.arr[0].majorList[0]) {
      academyList.arr[0].majorList[0].active = true
    }
  }
}
//确认添加学院
function addAcademyClick() {
  console.log(ruleFormRef.value)
  ruleFormRef.value.validate(async valid => {
    if (!valid) {
      if (ruleForm.value.name == '') {
        ElMessage.warning('请输入学院名称')
        return
      }
    } else {
      console.log('这里需要写添加学院逻辑')
      ElMessage.warning('console')
      academyAddVisible.value = false
    }
  })
  academyAddVisible.value = true
}
//删除学院
function academyDeleteClick() {
  console.log('删除学院')
}
function academyActiveClick() {
  console.log('启用学院')
}
//批量添加
function saveEssentialClick() {
  console.log('添加学院')
}
function addMajorOrClassClick(title) {
  emit('titleValue', title)
  emit('dialogVisible', true)
}

// 暴露方法给父组件调用
defineExpose({ triggerEvent })
</script>
<style lang="scss" scoped>
.major-information-box {
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

      .plan-majors {
        margin: 8px 0;

        .plan-major-container {
          margin-bottom: 10px;
        }
        .plan-major {
          box-shadow: 0 2px 6px 1px rgba(59, 78, 255, 0.1);
          border-radius: 10px;
          padding: 10px 15px;
          margin-bottom: 8px;
          border: 1px $main-blue solid;
          line-height: 24px;
          background-color: $blue-back;

          .plan-major-top {
            line-height: 25px;
            display: flex;
            .plan-major-id {
              margin-left: 20px;
              font-size: 14px;
              color: $word-black-color;
            }
          }

          .plan-major-bottom {
            display: flex;

            .plan-major-sub {
              font-size: 14px;
              color: $word-grey-color;
            }
            .plan-major-status {
              margin-left: 10px;
              margin-top: 1px;
              line-height: 22px;
              height: 22px;
              border-radius: 8px;
              padding: 0px 8px;
              font-size: 14px;
              margin-right: 15px;
              margin-right: auto;
              color: #fff;
            }

            .status-green {
              background-color: $green;
            }
            .status-red {
              background-color: $red;
            }

            .plan-major-time {
              font-size: 14px;
              color: $word-grey-color;
              margin-right: 20px;
            }
          }
        }
        .plan-major-operate {
          margin-left: auto;
          .icon-delete:hover {
            color: $red;
          }
          .icon-edit:hover {
            color: $purple;
          }
          .icon:hover {
            color: $main-blue;
          }
        }

        .plan-classes {
          margin: 6px 0;
          .plan-class {
            margin-bottom: 6px;
            .plan-class-top {
              display: flex;
              line-height: 22px;
              padding: 10px 15px;
              border: 1px dashed $main-blue;
              border-radius: 10px;
              box-shadow: 0 2px 6px 1px rgba(59, 78, 255, 0.1);

              .plan-class-id {
                margin-left: 10px;
                font-size: 14px;
                color: $word-grey-color;
              }
            }
          }
        }
      }
      .plan-major-operate,
      .plan-operate {
        .el-icon {
          margin-right: 20px;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
