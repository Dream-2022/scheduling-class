<template>
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
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { getMajorsAPI, getClassesAPI } from '@/apis/classMajor'

let option = ref()
// let departmentX = ref([]),
//   majorX = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
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
</script>
<style lang="scss" scoped></style>
