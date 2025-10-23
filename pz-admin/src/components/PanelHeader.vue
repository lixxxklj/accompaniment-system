<template>
  <div class="header">
    <h3 class="describe">{{ title }}</h3>
    <p>{{ describe }}</p>
  </div>
</template>
<script setup>
const props = defineProps(['title', 'describe'])
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