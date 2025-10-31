<template>
  <van-row class="header">
    <van-col span="6" offset="1" class="header-left">
      <van-icon name="location-o" size="16" />
      <span>南昌</span>
    </van-col>
    <van-col span="15" offset="2">
      <van-search shape="round" v-model="searchVal" placeholder="找医院" />
    </van-col>
  </van-row>
  <!-- lazy-render：开启懒加载模式，只会渲染当前页和下一页 -->
  <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" lazy-render height="180">
    <van-swipe-item v-for="swipe in indexData.slides" :key="swipe.id">
      <van-image :src="swipe.pic_image_url" fit radius="10" style="padding: 5px;" />
    </van-swipe-item>
  </van-swipe>
  <div class="container">
    <van-row justify="space-around">
      <van-col 
        span="11" 
        v-for="(item, index) in indexData.nav2s" 
        :key="item.id" 
        @click="handleClick(index)"
      >
        <van-image fit :src="item.pic_image_url" />
      </van-col>
    </van-row>
    <van-row justify="space-around" v-for="item in indexData.hospitals" class="row" @click="handleClick(item.id)">
      <van-col span="6">
        <van-image :src="item.avatar_url" radius="5" />
      </van-col>
      <van-col span="16">
        <h3>{{ item.name }}</h3>
        <span class="rank">{{ item.rank }} {{ item.label }}</span>
        <p class="dec">{{ item.intro }}</p>
      </van-col>
    </van-row>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// 获取当前vue的实例
const { proxy } = getCurrentInstance()
const searchVal = ref('')
const indexData = reactive({
  hospitals: [],
  nav2s: [],
  navs: [],
  slides: []
})

onMounted(async () => {
  const { code, data } = await proxy.$api.index()
  if (code === 10000) {
    Object.assign(indexData, data)
  }
})

// 快捷入口
function handleClick(index) {
  router.push(`/createOrder?id=${index}`)
}
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  font-size: 14px;

  .header-left {
    display: flex;
    align-items: center;
  }
}

.container {
  background-color: #f5f5f5;

  .row {
    margin: 5px;
    padding: 5px;
    background-color: #fff;

    .rank {
      color: #069faa;
      font-weight: bold;
    }

    .dec {
      font-size: 10px;
      color: #9e9d9d;
    }
  }
}
</style>