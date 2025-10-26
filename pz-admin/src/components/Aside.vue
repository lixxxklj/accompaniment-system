<template>
  <el-menu 
    active-text-color="#ffd04b" 
    background-color="#545c64" 
    class="aside-demo" 
    default-active="2"
    text-color="#fff" 
    :collapse="store.isCollapse"
    @open="handleOpen" 
    @close="handleClose"
  >
    <h1 class="header-title">{{ store.isCollapse ? 'DIDI' : 'DIDI陪诊'}}</h1>
    <MenuTree :menuData="menuData" :index="1"/>
  </el-menu>
</template>

<script setup>
import MenuTree from './menuTree.vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
import { useMenuStore } from '../store/menu';

const router = useRouter()
const store = useMenuStore()
// console.log(router.options.routes[0].children)
// const menuData = reactive(router.options.routes[0].children)
const menuData = store.dynamicMenu

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
    white-space: nowrap;
  }
}
</style>