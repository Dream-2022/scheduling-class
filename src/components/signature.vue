<template>
  <div class="handwritten-name-wrap">
    <el-button color="#547bf1" plain @click="openDialog">手写签名</el-button>
    <el-button
      color="#f56c6c"
      plain
      v-show="modelValue != ''"
      @click="clearSignature()"
      class="fade-button"
      >清除</el-button
    >
    <div class="img-wrap" v-show="modelValue != ''">
      <img :src="modelValue" alt="签名" v-if="modelValue" class="signature fade-img" />
    </div>

    <el-dialog v-model="panelVisible" title="手写签名" width="600px">
      <div class="signWrap">
        <VueSignaturePad width="500px" height="300px" ref="signaturePad" :options="options" />
        <footer>
          <div class="btn-group">
            <el-button type="primary" @click="undo">撤销</el-button>
            <el-button type="primary" @click="clear">清屏</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
          <div class="brush-settings">
            <span>笔刷大小：</span>
            <div
              v-for="size in brushSizes"
              :key="size.value"
              class="circleWrap"
              :class="{ active: size.value === selectedSize }"
              @click="selectSize(size.value)"
            >
              <b :class="size.class"></b>
            </div>
          </div>
        </footer>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch, nextTick, defineProps, defineEmits } from 'vue'

// Props: 使用 v-model 绑定签名图片
defineProps({
  modelValue: String, // 绑定签名图片数据
})

const emit = defineEmits(['update:modelValue']) // v-model 绑定数据

const panelVisible = ref(false)
const signaturePad = ref()
const selectedSize = ref(1)

const options = ref({
  penColor: '#000',
  minWidth: 1,
  maxWidth: 1,
})

function clearSignature() {
  emit('update:modelValue', '')
}
// 笔刷大小选项
const brushSizes = [
  { value: 1, class: 'b1' },
  { value: 2, class: 'b2' },
  { value: 3, class: 'b3' },
]

// 打开弹窗
function openDialog() {
  panelVisible.value = true
  selectedSize.value = 1 // 默认笔刷大小
  options.value = { penColor: '#000', minWidth: 1, maxWidth: 1 }
}

// 监听弹窗打开后，确保 canvas 尺寸
watch(panelVisible, async newVal => {
  if (newVal) {
    await nextTick()
    const canvas = signaturePad.value?.$el?.querySelector('canvas')
    if (canvas) {
      canvas.width = 500
      canvas.height = 300
    }
  }
})

// 选择笔刷大小
function selectSize(val) {
  selectedSize.value = val
  options.value = { penColor: '#000', minWidth: val, maxWidth: val }
}

// 撤销签名
function undo() {
  signaturePad.value.undoSignature()
}

// 清空签名
function clear() {
  signaturePad.value.clearSignature()
}

// 保存签名
function save() {
  const data = signaturePad.value.saveSignature().data
  if (data != null) {
    emit('update:modelValue', data) // 触发 v-model 更新
    panelVisible.value = false
  } else {
    ElMessage.warning('签名不能为空！')
  }
}
</script>

<style lang="scss" scoped>
.handwritten-name-wrap {
  .img-wrap {
    width: 250px;
    border-radius: 10px;
    height: 150px;
    margin-top: 10px;
    border: 1px solid #ccc;

    .signature {
      width: 250px;
      height: 150px;
    }
  }
  /* 按钮过渡样式 */
  .fade-button {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .fade-button[style*='display: none'] {
    opacity: 0 !important;
  }

  /* 图片过渡样式 */
  .fade-img {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .fade-img[style*='display: none'] {
    opacity: 0 !important;
  }
  .signWrap {
    display: flex;
    flex-direction: column;
    justify-content: center;

    :deep(canvas) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #ccc;
      padding-top: 10px;

      .btn-group {
        display: flex;
        gap: 20px;
      }

      .brush-settings {
        display: flex;
        align-items: center;
        gap: 10px;

        .circleWrap {
          width: 18px;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 50%;
          border: 1px dashed transparent;
        }

        .active {
          border: 1px dashed #0074d9;
        }

        .b1 {
          width: 4px;
          height: 4px;
          background: #000;
          border-radius: 50%;
        }

        .b2 {
          width: 6px;
          height: 6px;
          background: #000;
          border-radius: 50%;
        }

        .b3 {
          width: 8px;
          height: 8px;
          background: #000;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
