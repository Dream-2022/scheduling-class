<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang="scss">
*,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antisliased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
