<template>
  <div class="contain">
    <img src="../../assets/logo.png" class="logo">
    <h3>用户登录</h3>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="formDate.userName" name="username" label="用户名" placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="formDate.passWord" type="password" name="password" label="密码" placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';

// 获取当前vue的实例
const { proxy } = getCurrentInstance()
const router = useRouter()

const formDate = reactive({
  userName: '',
  passWord: ''
})

async function onSubmit() {
  const { code, data } = await proxy.$api.login(formDate)
  if (code === 10000) {
    localStorage.setItem('H5_TOKEN', data.token)
    localStorage.setItem('H5_USERINFO', JSON.stringify(data.userInfo))
    router.push('/home')
  }
}
</script>
<style scoped>
.contain {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .logo {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }
}
</style>