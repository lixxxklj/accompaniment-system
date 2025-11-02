<template>
  <div class="container">
    <van-nav-bar title="我的订单" />
    <van-tabs v-model:active="active" @click-tab="changeTab">
      <van-tab title="全部" name="" />
      <van-tab title="待支付" name="1" />
      <van-tab title="待服务" name="2" />
      <van-tab title="已完成" name="3" />
      <van-tab title="已取消" name="4" />
    </van-tabs>
    <van-row v-for="item in listData" :key="item.out_trade_no" class="row" @click="goDetail(item)">
      <van-col span="6" class="col-img">
        <van-image :src="item.serviceImg" radius="10px" width="56px" height="56px" />
      </van-col>
      <van-col span="13" class="col-content">
        <h3>{{ item.service_name }}</h3>
        <span class="gray">{{ item.hospital_name }}</span>
        <span class="gray">预约时间：{{ item.starttime }}</span>
      </van-col>
      <van-col span="5" :style="{color: colorMap[item.trade_state]}">
        <span>{{ item.trade_state }}</span>
        <TimeDown v-if="item.trade_state === '待支付'" :second="item.timer" @finish="finish" />
      </van-col>
    </van-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import TimeDown from '../../components/TimeDown.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const listData = ref([])
const colorMap = {
  '已完成': 'green',
  '待支付': 'orange',
  '已取消': 'gray',
  '待服务': 'blue'
}

onMounted(async () => {
  changeTab('')
})
const active = ref(route.query.active || '')
const changeTab = async () => {
  const { data } = await proxy.$api.orderList({ state: active.value })
  listData.value = data.map(item => {
    item.timer = Math.floor((item.order_start_time + 7200000 - Date.now()) / 1000)
    // item.trade_state = item.trade_state ? item.trade_state : '已完成'
    item.trade_state = item.trade_state
    return item
  })
}

// 倒计时结束的回调
const finish = () => {
  changeTab()
}

// 点击列表进入详情页
const goDetail = ({ out_trade_no }) => {
  router.push(`/detail?oid=${out_trade_no}`)
}
</script>

<style lang="less" scoped>
.gray {
  color: rgb(147, 147, 147);
}
.orange {
  color: orange;
}
.container {
  background-color: #f5f5f5;
  height: calc(100vh - 50px);
  overflow-y: auto;
  .row {
    background-color: #fff;
    margin: 3px 5px;
    border-radius: 5px;
    padding: 10px 0;
    .col-img {
      text-align: center;
    }
    .col-content {
      display: flex;
      flex-direction: column;
      justify-items: center;
    }
  }
}
</style>