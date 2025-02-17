<template>
  <div class="component-box">
    <div class="search-word"><img src="@/assets/img/word-special.png" /></div>
    <div class="search-box">
      <el-input
        v-model="searchValue"
        @keyup.enter="searchClick"
        class="search-content"
        placeholder="MD5，包名，文件名，APP名称"
      />
      <el-button color="#065fed" @click="searchClick">搜索</el-button>
    </div>
  </div>
  <div class="module-boxes">
    <div class="module-box">
      <img src="@/assets/3D/3-t.png" @click="staticAnalysis('userRecentPage')" />
      <div @click="staticAnalysis('userRecentPage')">排课计划</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/private.png" @click="staticAnalysis('userMyAnalysisPage')" />
      <div @click="staticAnalysis('userMyAnalysisPage')">排考试</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/0-t.png" @click="Analysis('userUploadPage', false)" />
      <div @click="Analysis('userUploadPage', false)">学校信息</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/1-t.png" @click="Analysis('userUploadPage', true)" />
      <div @click="Analysis('userUploadPage', true)">统计分析</div>
    </div>
    <div class="module-box">
      <img src="@/assets/3D/book-search.png" @click="staticAnalysis('userBlackWhitePage')" />
      <div @click="staticAnalysis('userBlackWhitePage')">申请处理</div>
    </div>
    <div class="module-box" @click="staticAnalysis('userMemberPage')">
      <img src="@/assets/3D/2-t.png" />
      <div @click="staticAnalysis('userMemberPage')">系统管理</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
let searchValue = ref('') //搜索内容
//点击搜索
async function searchClick() {
  if (searchValue.value == '' || searchValue.value == null) {
    ElMessage.warning('输入内容不能为空！')
    return
  }
  router.push(`/function/manager/${searchValue.value}`)
}

//点击快捷入口
function staticAnalysis(string) {
  //跳转页面
  console.log('点击')
  router.push(`../${string}`)
}
</script>
<style scoped>
.component-box {
  margin: 10px auto;
  margin-top: 0px;
  width: 80%;
  height: 40px;
  line-height: 40px;
  display: flex;

  .search-word {
    margin-top: 5px;
    margin-right: 20px;

    @media (max-width: 765px) {
    }

    @media (min-width: 765px) and (max-width: 1024px) {
    }

    @media (min-width: 1024px) {
    }
  }

  .search-box {
    display: flex;
    width: 75%;

    @media (max-width: 765px) {
    }

    @media (min-width: 765px) and (max-width: 1024px) {
      width: 60%;
    }

    @media (min-width: 1024px) {
    }

    .search-content {
      --el-border-radius-base: 10px 0 0 10px;
    }

    .el-button {
      border-radius: 0 10px 10px 0;
      border: 0;
      height: 40px;
      width: 80px;
    }
  }
}

.module-boxes {
  width: 70%;
  font-size: 15px;
  margin: 0 auto;
  margin-top: 55px;
  display: grid;
  grid-template-columns: repeat(6, 10%);
  grid-gap: 10px 8%;

  @media (max-width: 765px) {
    margin-top: 45px;
    width: 70%;
    grid-template-columns: repeat(3, 23%);
    grid-gap: 15px 15%;
    grid-template-rows: repeat(2, 40%);
  }

  @media (min-width: 765px) and (max-width: 1024px) {
    grid-template-columns: repeat(6, 12%);
    grid-gap: 10px 5%;
    margin-top: 50px;
    width: 92%;
  }

  @media (min-width: 1024px) {
  }

  > div:hover {
    box-shadow: 2px 4px 10px 1px rgba(0, 0, 0, 0.1);
  }

  .module-box {
    background-color: #fff;
    border-radius: 10px;
    height: 65%;
    font-size: 14px;
    text-align: center;

    img {
      cursor: pointer;
      transform: translateY(-50%);
      width: 80%;
    }

    div {
      cursor: pointer;
      height: 100%;
      transform: translateY(-70%);

      @media (max-width: 765px) {
        transform: translateY(-90%);
      }

      @media (min-width: 765px) and (max-width: 1024px) {
      }

      @media (min-width: 1024px) {
      }
    }
  }
}
</style>
