<template>
  <RouterView />
  <van-tabbar v-model="active" @change="onTabChange">
    <van-tabbar-item 
      v-for="tab in tabs" 
      :key="tab.path" 
      :icon="tab.meta.icon"
    >{{ tab.meta.name }}</van-tabbar-item>
  </van-tabbar>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const active = ref(0)
const router = useRouter()
const route = useRoute()
const tabs = router.options.routes[0].children

// 标签切换时的处理
function onTabChange(index) {
  const curRoute = `/${tabs[index].path}`
  if(curRoute !== route.path) {
    router.push(curRoute)
  }
}

watch(
  () => route.path,
  (newVal) => {
    // 根据当前路由自动激活对应 tab
    active.value = tabs.findIndex(item => '/' + item.path === newVal)
  },
  { immediate: true }
)
</script>