<template>
  <div class="steps">
    <van-progress 
      :percentage="stateMap[props.state]" 
      stroke-width="14" 
      :show-pivot="false" 
      track-color="#fff" 
      color="#51ac98" 
      :inactive="props.state === '已取消'"
    />
      <div class="steps-title">
        <span>填写订单</span>
        <span>在线支付</span>
        <span>专人服务</span>
        <span>服务完成</span>
      </div>
  </div>
</template>

<script setup>
const props = defineProps(['state'])
const stateMap = {
  '创建订单': 15,
  '待支付': 35,
  '待服务': 60,
  '已完成': 100,
  '已取消': 100
}
</script>

<style lang="less" scoped>
::v-deep(.van-progress .van-progress__portion) {
  height: 65%;
  top: 50%;
  transform: translate(0, -50%);
}
.steps {
  background: linear-gradient(135deg, #5ab78b 0%, #55b7b7 100%);
  padding: 20px 15px;

  .steps-title {
    display: flex;
    justify-content: space-around;
    color: #fff;
    margin-top: 15px;
  }
}
</style>