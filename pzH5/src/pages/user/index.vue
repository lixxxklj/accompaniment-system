<template>
  <div class="container">
    <div class="header">
      <van-image width="100" height="100" round :src="userInfo.avatar" />
      <h2>{{ userInfo.name }}</h2>
    </div>
    <van-cell-group inset>
      <van-cell title="我的订单" value="全部" size="large" />
      <ul class="items">
        <li v-for="item in btns" :key="item.active" @click="goOrderList(item.active)">
          <img :src="item.src" />
          <div>{{ item.title }}</div>
        </li>
      </ul>
    </van-cell-group>
    <van-cell-group inset style="margin-top: 10px;">
      <van-cell icon="notes-o" title="服务对象管理" is-link />
      <van-cell icon="share-o" title="分享转发" is-link />
    </van-cell-group>
    <van-button type="danger" class="btn" @click="logout">退出登录</van-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const userInfo = JSON.parse(localStorage.getItem('H5_USERINFO'))
const btns = [
  { title: '待支付', active: '1', src: '/images/od_10.png' },
  { title: '待服务', active: '2', src: '/images/od_20.png' },
  { title: '已完成', active: '3', src: '/images/od_30.png' },
  { title: '已取消', active: '4', src: '/images/od_40.png' },
]

// 前往订单列表
const goOrderList = (active) => {
  router.push(`/order?active=${active}`)
}

// 登出
const logout = () => {
  showConfirmDialog({
    title: '提示',
    message: '是否确认退出登陆'
  }).then(() => {
    localStorage.removeItem('H5_TOKEN')
    localStorage.removeItem('H5_USERINFO')
    router.push('/login')
  }).catch(() => {
    console.log('取消退出');
  })
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    padding: 20px 10px;
  }

  .items {
    display: flex;
    justify-content: space-between;
    padding: 20px;

    li {
      text-align: center;
    }

    img {
      height: 34px;
      width: 34px;
    }
  }

  .btn {
    width: 80%;
    margin: auto;
  }
}</style>