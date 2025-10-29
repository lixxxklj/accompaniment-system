import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import api from './api/index'

const app = createApp(App)
app.use(router)
// 在实例上绑定属性
app.config.globalProperties.$api = api
app.mount('#app')
