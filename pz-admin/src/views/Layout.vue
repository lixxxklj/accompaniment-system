<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="store.isCollapse ? '64px' : '230px'">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <NavHeader />
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue'
import NavHeader from '../components/navHeader.vue'
import { useMenuStore } from '../store/menu';

const store = useMenuStore()
</script>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
  .el-container {
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0 15px;
      background-color: #f5f5f5;
    }
  }
}
</style>