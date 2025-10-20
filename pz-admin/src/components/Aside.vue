<template>
  <el-menu 
    active-text-color="#ffd04b" 
    background-color="#545c64" 
    class="aside-demo" 
    default-active="2"
    text-color="#fff" 
    @open="handleOpen" 
    @close="handleClose"
  >
    <h1 class="header-title">DIDI陪诊</h1>
    <MenuTree :menuData="menuData" />
  </el-menu>
</template>

<script setup>
import MenuTree from './menuTree.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue';

const router = useRouter()
// console.log(router.options.routes[0].children)
const menuData = reactive(router.options.routes[0].children)

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.aside-demo {
  height: 100%;
  .header-title {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #fff;
  }
}
</style>