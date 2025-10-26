<template>
  <div class="header">
    <h3 class="describe">{{ name }}</h3>
    <p>{{ describe }}</p>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const { name, describe }  = route.meta
</script>
<style lang="less" scoped>
.header {
  padding: 15px;
  background-color: #f1f6fc;
  line-height: 20px;
  border-radius: 5px;

  .describe {
    font-weight: bolder;
    font-size: 12px;
  }
}
</style>