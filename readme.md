### 环境配置
node v20.17.0

### 路由创建
创建路由和对应页面
引入 vue-router 创建路由实例（createRouter、路由匹配的两种模式）
挂载 router 到 vue 实例上（app.use(router)）
对应页面使用 <RouterView /> 配置路由

### UI 框架
安装步骤：
- 下载依赖：npm install element-plus
- 按需引入：npm install -D unplugin-vue-components unplugin-auto-import
修改 vite 配置：
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    vue(),
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

### Layout 布局
