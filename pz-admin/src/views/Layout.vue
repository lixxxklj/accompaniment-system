<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/Aside.vue'
</script>

<style lang="less" scoped>
.common-layout {
  height: 100vh;
  .el-container {
    height: 100%;
  }
}
</style>