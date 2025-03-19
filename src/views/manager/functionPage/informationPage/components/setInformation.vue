<template>
  <div class="plan-box">
    <div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="专业年级班级" name="1">
          <div class="plan-botton">
            <el-button color="#547bf1" plain @click="addClassClick"> 批量添加班级 </el-button>
            <el-button color="#547bf1" plain @click="addMajorClick"> 批量添加专业 </el-button>
            <el-button style="margin-right: auto" color="#547bf1" plain @click="addAcademyClick">
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
              />
              <el-button color="#547bf1" @click="searchClick" plain :icon="Search">
                搜索
              </el-button>
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
                      </div>
                    </transition>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="科目信息" name="2">Config</el-tab-pane>
        <el-tab-pane label="教师信息" name="3">Role</el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <el-upload
      class="upload-demo"
      drag
      multiple
      :auto-upload="false"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="1"
      @change="fileChange"
      :on-exceed="handleExceed"
    >
      <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
      <div class="el-upload__text"><em>点击</em> 或 <em>拖拽</em></div>
      <div class="el-upload__text">即可上传表格文件</div>
      <template #tip>
        <div class="el-upload__tip">支持上传 xlsx / xls / xlsm / csv 文件</div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="uploadDataClick" color="#547bf1" plain>确认</el-button>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getDepartmentsAPI, getMajorsAPI, getClassesAPI } from '@/apis/classMajor'
import { importClassesAPI } from '@/apis/classMajor'
import {
  Search,
  Delete,
  Edit,
  CaretLeft,
  UploadFilled,
  // DeleteLocation,
  LocationInformation,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const academyList = reactive({
  arr: [],
})
const academyOptions = ref([])
let activeName = ref('1')
let option = ref()
let departmentX = ref([]),
  majorX = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const fileX = ref(null)
onMounted(async () => {
  getDepartments()
  for (let i = 0; i < academyList.arr.length; i++) {
    academyList.arr[i].active = false
  }
  academyOptions.value = academyList.arr
})
//上传文件相关
const handleRemove = () => {
  fileX.value = null
}
const beforeRemove = uploadFile => {
  return ElMessageBox.confirm(`是否确认删除‘${uploadFile.name}’ ?`).then(
    () => true,
    () => false,
  )
}
const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `上传文件个数不能超过 1 个, 你上传了 ${files.length + uploadFiles.length} 个文件`,
  )
}
//拖拽文件时触发事件
const fileChange = file => {
  const extension = file.name.split('.').pop()
  console.log(extension)
  if (extension !== 'xlsx' && extension !== 'xls' && extension !== 'xlsm' && extension !== 'csv') {
    ElMessage.error('只能上传后缀为 xlsx、xls、xlsm、csv 的文件！')
  }
  fileX.value = file
}
//点击上传文件
async function uploadDataClick() {
  console.log(fileX.value)
  if (fileX.value == null) {
    ElMessage.error('请先选择文件！')
    return
  }
  const res = await importClassesAPI(fileX.value.raw)
  console.log(res.data)
}
//获取学院信息,设置option
async function getDepartments() {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  academyList.arr = res.data.data

  option.value = {
    lazy: true,
    checkStrictly: true,
    lazyLoad: async (node, resolve) => {
      const { level, data } = node
      if (level === 0) {
        const nodes = academyList.arr.map(item => ({
          value: item.id,
          label: item.name,
          leaf: false,
        }))
        console.log(nodes)
        resolve(nodes)
      } else if (level === 1) {
        const result = academyList.arr.find(
          item => item.id == data.value && item.name == data.label,
        )
        if (typeof result.majorList === 'undefined') {
          const res = await getMajorsAPI(data.label)
          result.majorList = res.data.data
        }
        departmentX.value = JSON.parse(JSON.stringify(result))
        const nodes = result.majorList.map(item => ({
          value: item.id,
          label: item.name,
          leaf: false,
        }))
        resolve(nodes)
      } else if (level === 2) {
        const result1 = academyList.arr.find(item => item.id == departmentX.value.id)
        const result2 = result1.majorList.find(
          item => item.id == data.value && item.name == data.label,
        )
        if (typeof result2.classList === 'undefined') {
          const res = await getClassesAPI(result1.name, result2.name)
          result2.classList = res.data.data
        }
        majorX.value = JSON.parse(JSON.stringify(result2))
        const nodes = result2.classList.map(item => ({
          value: item.value,
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
//批量添加
function addAcademyClick() {
  console.log('添加学院')
}
function addMajorClick() {
  console.log('批量添加专业')
  dialogVisible.value = true
  dialogTitle.value = '批量添加专业'
}
function addClassClick() {
  console.log('批量添加班级')
  dialogVisible.value = true
  dialogTitle.value = '批量添加班级'
}
//
function handleClick(tab, event) {
  console.log(tab, event, '需要判断是否保存了')
}
//点击搜索
async function searchClick() {}
//删除学院
function academyDeleteClick() {
  console.log('删除学院')
}
function academyActiveClick() {
  console.log('启用学院')
}
//保存设置
function saveEssentialClick() {
  console.log('保存设置')
}
</script>
<style lang="scss" scoped>
.plan-box {
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
.el-dialog {
  .el-upload {
    .el-upload__text {
      font-size: 12px;
      line-height: 20px;
    }
  }
}

// 动画样式
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  animation-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
}
</style>
