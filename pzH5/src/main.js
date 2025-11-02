import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import api from './api/index'

const app = createApp(App)

// 路由前置守卫
router.beforeEach((to, from) => {
  const token = localStorage.getItem('H5_TOKEN')
  if(to.path !== '/login' && !token) {
    return '/login'
  } 
})

app.use(router)
// 在实例上绑定属性
app.config.globalProperties.$api = api
app.mount('#app')
