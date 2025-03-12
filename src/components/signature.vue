<template>
  <div class="handwritten-name-wrap">
    <el-button plain @click="handleClick"> 手写签名 </el-button>
    <div class="img-wrap">
      <img :src="imgSrc" alt="" v-if="imgSrc" class="signature" />
    </div>
    <el-dialog v-model="panelVisible" title="个人资料">
      <div class="signWrap">
        <VueSignaturePad width="500px" height="300px" ref="signaturePad" :options="options.arr" />
        <footer>
          <div class="gtnGroup">
            <el-button type="primary" @click="undo">撤销</el-button>
            <el-button type="primary" style="margin-left: 20px" @click="clear">清屏</el-button>
            <el-button type="primary" style="margin-left: 20px" @click="save">保存</el-button>
          </div>
          <div class="otherSet">
            <div class="penTxt">笔刷大小：</div>
            <div class="circleWrap" :class="{ active: isActive1 }" @click="selSize(1)">
              <b class="b1"></b>
            </div>
            <div class="circleWrap" :class="{ active: isActive2 }" @click="selSize(2)">
              <b class="b2"></b>
            </div>
            <div class="circleWrap" :class="{ active: isActive3 }" @click="selSize(3)">
              <b class="b3"></b>
            </div>
          </div>
        </footer>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="panelVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
let panelVisible = ref(false)
let signaturePad = ref()
let isActive1 = ref(true)
let isActive2 = ref(false)
let isActive3 = ref(false)
let imgSrc = ref()
let options = reactive({
  arr: {},
})
watch(panelVisible, async newVal => {
  if (newVal) {
    await nextTick()
    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.width = 500
      canvas.height = 300
    }
  }
})
//手写签名按钮的点击
function handleClick() {
  panelVisible.value = true
  isActive1.value = true
  isActive2.value = false
  isActive3.value = false
  options.arr = {
    penColor: '#000',
    minWidth: 1,
    maxWidth: 1,
  }
}
//撤销
function undo() {
  signaturePad.value.undoSignature()
}
//清除
function clear() {
  signaturePad.value.clearSignature()
}
//保存
function save() {
  console.log(signaturePad.value.saveSignature())
  const data = signaturePad.value.saveSignature().data
  imgSrc.value = data
  panelVisible.value = false
}
//调节画笔粗细大小
function selSize(val) {
  options.arr = {
    penColor: '#000',
    minWidth: val,
    maxWidth: val,
  }
  if (val == 1) {
    isActive1.value = true
    isActive2.value = false
    isActive3.value = false
  } else if (val == 2) {
    isActive1.value = false
    isActive2.value = true
    isActive3.value = false
  } else if (val == 3) {
    isActive1.value = false
    isActive2.value = false
    isActive3.value = true
  }
}
</script>
<style lang="scss" scoped>
.handwritten-name-wrap {
  .img-wrap {
    width: 100%;
    height: 164px;
    margin-top: 2px;
    border: 1px solid #ccc;

    .signature {
      width: 500px;
      height: 300px;
    }
  }

  .signWrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    :deep(canvas) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .signName {
      flex: 1;
      border-top: 1px solid #ccc;
    }

    footer {
      height: 40px;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .gtnGroup {
        width: 50%;
        margin-left: 20px;
      }

      .otherSet {
        width: 50%;
        display: flex;
        align-items: center;

        .penTxt {
          width: 70px;
        }

        .selSize {
          width: 70px;
        }

        .el-select__caret {
          position: absolute;
          right: -3px;
        }

        .b1,
        .b2,
        .b3 {
          display: inline-block;
          background: #000;
          border-radius: 50%;
        }

        .circleWrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 18px;
          height: 18px;
          cursor: pointer;
          margin-right: 20px;
        }

        .active {
          border: 1px dashed #0074d9;
        }

        .b1 {
          width: 4px;
          height: 4px;
        }

        .b2 {
          width: 6px;
          height: 6px;
        }

        .b3 {
          width: 8px;
          height: 8px;
        }
      }
    }
  }
}

.signNameModel {
  .vxe-modal--content {
    padding: 0 !important;
  }
}
</style>
