import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index' 
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import PanelHeader from './components/PanelHeader.vue'
import ContainerTable from './components/containerTable.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useMenuStore } from './store/menu'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// 先恢复动态路由，再挂载路由
const setDynamicRoutes = async () => {
  const store = useMenuStore()
  const menuData = localStorage.getItem('menu')
  if(menuData) {
    const dynamicMenu = JSON.parse(menuData).dynamicMenu
    // 注意！！！import.meta.glob是异步操作
    await store.setDynamicMenu(dynamicMenu)
    store.dynamicMenu.forEach(r => router.addRoute('main', r))
  }
}
// 在挂载之前初始化动态路由
await setDynamicRoutes()

// 用户鉴权(全局守卫)
router.beforeEach(async (to, from) => {
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

// 挂载公共组件
app.component('panel-header', PanelHeader)
app.component('container-table', ContainerTable)
// 路由挂载
app.use(router)

// 注册element-plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')