<template>
  <div class="wow animate__fadeInUp information-box">
    <div class="middle-box">
      <div class="title-box">
        <div class="middle-title">学校基础信息</div>
        <!-- <div v-if="information.arr?.title == ''" class="plan-title">
          <div class="plan-title-word">/</div>
          {{ information.arr?.title }}
        </div> -->
      </div>

      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
.information-box {
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
      padding-bottom: 6px;
      line-height: 30px;
      margin-bottom: 5px;

      .middle-title {
        font-weight: 600;
        font-size: 18px;
      }
      .plan-title-word {
        margin-right: 30px;
        font-size: 16px;
      }
      .plan-title {
        margin-left: 20px;
        font-size: 16px;
        font-weight: 600;
      }

      .list {
        cursor: pointer;
        font-size: 16px;
        display: inline-block;
        color: $grey;
        width: 60px;
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

      .button-box {
        margin-right: auto;
      }
    }

    .table-imgs {
      display: flex;
      justify-content: center;

      .table-img {
        cursor: zoom-in;
        width: 80px;
        height: 80px;
        border-radius: 16px;
        border: 2px solid #d1d1d1;
      }
    }
  }
}
</style>
