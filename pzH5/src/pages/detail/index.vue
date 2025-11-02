<template>
  <div class="container">
    <!-- <StepsBar :state="detailData.trade_state || '已完成'" /> -->
    <StepsBar :state="detailData.trade_state" />
    <div v-if="detailData.trade_state === '待支付'" class="bar-title">
      <h1>订单待支付</h1>
      <span>
        请在规定时间内完成支付，超时订单将自动取消
      </span>
      <van-button type="success">立即支付（<TimeDown :second="second" />）</van-button>
    </div>
    <div v-else class="bar-title">
      <h1>{{ label.title }}</h1>
      <span>{{ label.desc }}</span>
    </div>
    <van-cell-group class="info">
      <div class="info-title">
        <i>|</i>预约信息
      </div>
      <van-cell title="预约服务" :value="detailData.service_name" />
      <van-cell title="就诊医院" :value="detailData.hospital_name" />
      <van-cell title="期望就诊时间" :value="detailData.starttime" />
      <van-cell title="就诊人" :value="detailData.client.name" />
      <van-cell title="就诊人电话" :value="detailData.client.mobile" />
      <van-cell title="接送地址" :value="detailData.receiveAddress" />
      <van-cell title="其他需求" :value="detailData.demand" />
    </van-cell-group>
    <van-cell-group>
      <div class="info-title">
        <i>|</i>订单信息
      </div>
      <van-cell title="联系电话" :value="detailData.tel" />
      <van-cell title="下单时间" :value="detailData.order_start_time" />
      <van-cell title="应付金额" :value="detailData.price" />
      <van-cell title="订单编号" :value="detailData.out_trade_no" />
      <van-cell title="联系客服" :value="detailData.service_name" />
    </van-cell-group>
  </div>
</template>
<script setup>
import StepsBar from '../../components/StepsBar.vue';
import { useRoute } from 'vue-router'
import { onMounted, getCurrentInstance, reactive, computed } from 'vue'
import TimeDown from '../../components/TimeDown.vue'

const route = useRoute()
const { proxy } = getCurrentInstance()
const detailData = reactive({
  client: { id: '', name: '', mobile: '' }
})

onMounted(async () => {
  const res = await proxy.$api.orderDetail(route.query)
  Object.assign(detailData, res.data)
  getLabel(res.data.trade_state)
})

const label = reactive({})
const getLabel = (state) => {
  if (state === '待服务') {
    Object.assign(label, { title: '正在为您安排服务专员...', desc: '请保持手机畅通，稍后将有服务专员与您联系' })
  } else if (state === '已取消') {
    Object.assign(label, { title: '订单已取消', desc: '如需帮助可咨询客服' })
  } else if(state === '已完成') {
    Object.assign(label, { title: '服务已完成', desc: '感谢您的使用，如有售后问题请联系客服' })
  }
}

const second = computed(() => Math.floor((detailData.order_start_time + 7200000 - new Date())) / 1000)
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  background-color: #f5f5f5;
  .bar-title {
    padding: 20px;
    color: #727373;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .info {
    margin-bottom: 15px;
  }
  .info-title {
    font-size: 16px;
    font-weight: bolder;
    padding: 10px 10px 0;
    i {
      color: red;
      font-size: 24px;
      font-weight: bolder;
      margin-right: 5px;
    }
  }
}
</style>