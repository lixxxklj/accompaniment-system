import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index' 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// 用户鉴权(全局守卫)
router.beforeEach((to, from) => {
  const token = localStorage.getItem('TOKEN')
  if(!token && to.path !== '/login') {
    // 非登录页面且token不存在 ===> 前往登录页
    return '/login'
  } else if(token && to.path === '/login') {
    // token存在且访问的是登录页面 ===> 前往首页
    return '/'
  } else {
    return true
  }
})

const pinia = createPinia()
const app = createApp(App)

// 路由挂载
app.use(router)
// 注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.mount('#app')
