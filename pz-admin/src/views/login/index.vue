<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-col style="max-width: 480px">
      <el-card>
        <template #header>
          <img :src="src" style="width: 100%;" />
        </template>
        <div class="button-link">
          <el-link type="primary" @click="handleLink">{{ formType ? '返回登录' : '注册账号' }}</el-link>
        </div>
        <el-form ref="ruleForm" :model="loginForm" :rules="rules">
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled" />
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" placeholder="密码" prefix-icon="Lock" type="password" />
          </el-form-item>
          <!-- 注册页面才存在 -->
          <el-form-item v-if="formType" prop="validCode">
            <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
              <template #append>
                <el-button @click="getValidCode" :disabled="validCodeData.sending" style="width: 100px;">{{
                  validCodeData.title }}</el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="submitForm" :loading="isLoading">{{ formType ? '注册账号' :
              '登录' }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { getCode, register, login, menuPermissions } from '../../api/index'
import { ref, reactive, onUnmounted, nextTick, computed, toRaw } from 'vue'
import { useRouter } from 'vue-router';
import { useMenuStore } from '../../store/menu';

const router = useRouter()
const store = useMenuStore()
const src = new URL('../../../public/login.png', import.meta.url).href
let isLoading = ref(false)
const formType = ref(0)   // 切换表单（0登录 1注册）

// 表单数据
const loginForm = reactive({
  userName: '17779017287',
  passWord: '17779017287',
  validCode: ''
})

// 点击切换登录 / 注册
const handleLink = () => {
  formType.value = formType.value ? 0 : 1
  // 重置验证码锁
  Object.assign(validCodeData, { sending: false, title: '发送验证码', time: 60 })
  nextTick(() => {
    ruleForm.value?.resetFields()
  })
}

// 账号校验
const validatorUser = (rule, value, callback) => {
  if (!value) {
    callback(new Error('账号不可为空'))
  } else {
    // 手机号正则
    const phoneReg = /^1[3-9]\d{9}$/
    phoneReg.test(value) ? callback() : callback(new Error('手机格式错误，请重新输入'))
  }
}
// 密码校验
const validatorPsw = (rule, value, callback) => {
  if (!value) {
    callback(new Error('密码不可为空'))
  } else {
    // 密码正则
    const pswReg = /^[a-zA-Z0-9_-]{8,16}$/
    pswReg.test(value) ? callback() : callback(new Error('密码需要8~16位字符，请重新设置'))
  }
}
// 表单校验(用计算属性让校验规则随formType实时变化)
const rules = computed(() => ({
  userName: [{ validator: validatorUser, trigger: 'blur' }],
  passWord: [{ validator: validatorPsw, trigger: 'blur' }],
  ...(formType.value === 1 ? { validCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }] } : {})
}))

// 验证码
const validCodeData = reactive({
  title: '获取验证码',
  time: 60,
  sending: false    // 加锁，控制发送期间禁止重复点击
})
let timer = null
// 获取验证码
const getValidCode = async () => {
  if (timer || validCodeData.sending) return
  // 验证手机号码
  const phoneReg = /^1[3-9]\d{9}$/
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  // 发请求前加上锁
  validCodeData.sending = true
  // 发请求
  try {
    const res = await getCode({ tel: loginForm.userName })
    console.log(res)
    if (res.code === 10000) {
      ElMessage.success('发送成功')
      // 倒计时
      timer = setInterval(() => {
        if (validCodeData.time <= 0) {
          clearInterval(timer)
          timer = null
          validCodeData.title = '获取验证码'
          validCodeData.time = 60
          validCodeData.sending = false
        } else {
          validCodeData.time -= 1
          validCodeData.title = `${validCodeData.time}s`
        }
      }, 1000)
    }
  } catch (error) {
    ElMessage.error(error)
    validCodeData.sending = false
  }
}

const ruleForm = ref(null)
// 表单提交
const submitForm = async () => {
  const formEl = ruleForm.value
  if (!formEl) return
  await formEl.validate(async (valid, field) => {
    if (!valid) {
      ElMessage.warning('手机号或者密码错误')
      return
    }
    isLoading.value = true
    try {
      if (formType.value) {
        const res = await register(loginForm)
        if (res.code === 10000) {
          ElMessage.success('注册成功，请登录')
          handleLink()
        }
      } else {
        const res = await login(loginForm)
        if (res.code === 10000) {
          // 将用户信息和token缓存在浏览器
          localStorage.setItem('TOKEN', res.data.token)
          localStorage.setItem('USERINFO', JSON.stringify(res.data.userInfo))
          // 登录成功后获取用户有权限的菜单
          menuPermissions().then(async (res) => {
            if(res.code === 10000) {
              // 在 pinia 中存储（Aside 和 menuTree 中需要用到）
              await store.setDynamicMenu(res.data)
              // 取出pinia中的响应数据
              const dynamicMenu = store.dynamicMenu
              // 将响应式数据转换为原始对象再注册路由
              toRaw(dynamicMenu).forEach(element => {
                router.addRoute('main', element)
              })
              // 跳转首页
              router.push('/')
            }
          })
          ElMessage.success('登录成功')
        }
      }
    } catch (error) {
      ElMessage.error(error)
    } finally {
      isLoading.value = false
    }
  })
}

// 组件卸载前清理定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
  border-bottom: 0;
}

.login-container {
  height: 100vh;

  .button-link {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
  }
}
</style>