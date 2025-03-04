<template>
  <div class="course-section">
    <div class="course-section-left">
      <el-cascader
        style="width: 280px"
        filterable
        :options="options"
        placeholder="选择"
        clearable
      />
    </div>
    <div class="course-section-right">123</div>
  </div>
</template>
<script setup>
const options = [
  {
    value: 'teacher',
    label: '教师视角',
    children: [
      {
        value: '123',
        label: '计算机学院',
        children: [
          {
            value: '123',
            label: '计算机科学与技术',
            children: [
              {
                value: '797',
                label: '吴来源',
              },
              {
                value: '456',
                label: '李好',
              },
            ],
          },
          {
            value: '456',
            label: '软件工程',
            children: [
              {
                value: '4658',
                label: '张三',
              },
              {
                value: '222',
                label: '李四',
              },
            ],
          },
        ],
      },
      {
        value: '456',
        label: '经济管理学院',
        children: [
          {
            value: '123',
            label: '计算机科学与技术',
            children: [
              {
                value: '797',
                label: '1',
              },
              {
                value: '456',
                label: '2',
              },
            ],
          },
          {
            value: '456',
            label: '软件工程',
            children: [
              {
                value: '4658',
                label: '张三',
              },
              {
                value: '222',
                label: '李四',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'class',
    label: '班级视角',
    children: [
      {
        value: '21432',
        label: '旅游学院',
        children: [
          {
            value: '123',
            label: '22级1班',
          },
          {
            value: '456',
            label: '22级2班',
          },
        ],
      },
      {
        value: '464654',
        label: '外国语学院',
        children: [
          {
            value: '123',
            label: '23级1班',
          },
          {
            value: '456',
            label: '23级2班',
          },
        ],
      },
    ],
  },
  {
    value: 'class',
    label: '年级视角',
    children: [
      {
        value: '21432',
        label: '旅游学院',
        children: [
          {
            value: '123',
            label: '22级',
          },
          {
            value: '456',
            label: '23级',
          },
        ],
      },
      {
        value: '464654',
        label: '外国语学院',
        children: [
          {
            value: '123',
            label: '23级',
          },
          {
            value: '456',
            label: '24级',
          },
        ],
      },
    ],
  },
]
</script>
<style lang="scss" scoped>
.course-section {
  margin-top: 20px;
  display: flex;
  gap: 15px;

  > div {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.1);
  }

  .course-section-left {
    flex: 7;
  }
  .course-section-right {
    flex: 3;
  }
}
</style>
