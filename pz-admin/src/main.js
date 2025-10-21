import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index' 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

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
