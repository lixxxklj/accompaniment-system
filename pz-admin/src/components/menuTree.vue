<template>
  <template v-for="(item, index) in props.menuData">
    <el-sub-menu 
      v-if="item.children && item.children.length > 0" 
      :key="item.meta.id"
      :index="item.meta.id"
    >
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 直接写递归 -->
      <MenuTree :menuData="item.children" />
    </el-sub-menu>
    <el-menu-item 
      v-else
      :index="item.meta.id"
      @click="handleClick(item)"
    >
      <el-icon size="20">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta.name }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useMenuStore } from '../store/menu'

const props = defineProps(['menuData'])
const router = useRouter()
const store = useMenuStore()

const handleClick = (item) => {
  router.push(item.meta.path)
  store.addMenu(item)
  // console.log(store.menuList)
}

</script>