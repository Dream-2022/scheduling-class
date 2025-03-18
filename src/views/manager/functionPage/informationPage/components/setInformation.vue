<template>
  <div class="plan-box">
    <div class="plan-steps">
      <div class="plan-btn">
        <el-button
          @click="previousClick"
          :disabled="stepValue === 0"
          color="#547bf1"
          :icon="ArrowLeftBold"
          circle
        ></el-button>
      </div>
      <el-steps :active="stepValue" finish-status="success" simple>
        <el-step title="专业年级班级" />
        <el-step title="科目信息" />
        <el-step title="教师信息" />
      </el-steps>
      <div class="plan-btn">
        <el-button
          :disabled="stepValue >= 2"
          @click="nextClick"
          color="#547bf1"
          :icon="ArrowRightBold"
          circle
        ></el-button>
      </div>
    </div>
    <div class="plan-botton">
      <el-button color="#547bf1" plain @click="addClassClick"> 批量添加班级 </el-button>
      <el-button color="#547bf1" plain @click="addMajorClick"> 批量添加专业 </el-button>
      <el-button style="margin-right: auto" color="#547bf1" plain @click="addAcademyClick">
        批量添加学院
      </el-button>
      <el-button color="#547bf1" @click="saveEssentialClick"> 保存设置 </el-button>
      <el-button color="#547bf1" @click="nextClick"> 下一步 </el-button>
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
              @click="toggleActive(item)"
            >
              <CaretLeft />
            </el-icon>
          </div>
        </div>
        <transition name="slide-fade">
          <div v-if="item.active" class="plan-majors">
            <div class="plan-major">
              <div class="plan-major-top">
                <div class="plan-major-main">软件工程</div>
                <div class="plan-major-id">2022401746</div>

                <div class="plan-major-operate">
                  <el-icon class="icon-delete" @click="academyDeleteClick"><Delete /></el-icon>
                  <el-icon class="icon-delete" @click="academyActiveClick">
                    <DeleteLocation />
                  </el-icon>
                  <el-icon class="icon-edit"><Edit /></el-icon>
                  <el-icon class="icon"><CaretLeft /></el-icon>
                  <el-icon class="icon"><CaretBottom /></el-icon>
                </div>
              </div>
              <div class="plan-major-bottom">
                <div class="plan-major-sub">4年制</div>
                <div class="plan-major-status status-red">启用</div>
                <div class="plan-major-time">2022-4-15</div>
              </div>
            </div>

            <div class="plan-classes">
              <div class="plan-class">
                <div class="plan-class-top">
                  <div>22级4班</div>
                </div>
                <div class="plan-class-bottom"></div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getDepartmentsAPI, getMajorsAPI } from '@/apis/classMajor'
import {
  ArrowLeftBold,
  ArrowRightBold,
  Search,
  Delete,
  Edit,
  CaretLeft,
  CaretBottom,
  DeleteLocation,
  // LocationInformation,
} from '@element-plus/icons-vue'
const academyList = reactive({
  arr: [],
})
const academyOptions = ref([])
let stepValue = ref(0)
onMounted(async () => {
  const res = await getDepartmentsAPI()
  console.log(res.data)
  academyList.arr = res.data.data
  for (let i = 0; i < academyList.arr.length; i++) {
    academyList.arr[i].active = false
  }
})
//切换学院的展开状态
async function toggleActive(item) {
  if (item.active) {
    item.active = !item.active
    return
  }
  item.active = !item.active
  //已经获取过major了
  if (item.majorList !== undefined) {
    return
  }
  //没获取过，所以获取专业
  const res = await getMajorsAPI(item.name)
  item.majorList = res.data.data
}
//批量添加
function addAcademyClick() {
  console.log('批量添加学院')
}
function addMajorClick() {
  console.log('批量添加学院')
}
function addClassClick() {
  console.log('批量添加学院')
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
let id = 0
const option = {
  lazy: true,
  checkStrictly: true,
  lazyLoad(node, resolve) {
    const { level } = node
    setTimeout(() => {
      const nodes = Array.from({ length: level + 1 }).map(() => ({
        value: ++id,
        label: `Option - ${id}`,
        leaf: level >= 2,
      }))
      // Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
      resolve(nodes)
    }, 1000)
  },
}
//点击下一步
function nextClick() {
  stepValue.value++
}
function previousClick() {
  stepValue.value--
}
</script>
<style lang="scss" scoped>
.plan-box {
  .plan-steps {
    width: 98%;
    margin: 5px 10px;
    display: flex;
    .plan-btn {
      margin-top: 6px;
    }
  }
  .plan-botton {
    padding: 10px;
    border-bottom: 1px solid #ccc;
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
        .plan-major {
          box-shadow: 0 2px 6px 1px rgba(59, 78, 255, 0.1);
          border-radius: 10px;
          padding: 10px 15px;
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
            .plan-class-top {
              padding: 10px 15px;
              border: 1px dashed $main-blue;
              border-radius: 10px;
              box-shadow: 0 2px 6px 1px rgba(59, 78, 255, 0.1);
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
// 折叠面板
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
<template>
  <div>inform</div>
</template>
<script setup></script>
<style scoped></style>
