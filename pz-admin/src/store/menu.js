import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  persist: true,            // 一键持久化到 localstorage
  state: () => {
    return {
      isCollapse: false,
      menuList: [],         // 面包屑
      dynamicMenu: [],       // 用户有权限的菜单
      menuActive: '1-1'
    }
  },
  actions: {
    collapsed() {
      this.isCollapse = !this.isCollapse
    },
    addMenu(item) {
      // 去重
      const idx = this.menuList.findIndex(menuItem => item.path === menuItem.path)
      if (idx === -1) {
        this.menuList.push(item)
      }
    },
    removeMenu(item) {
      const index = this.menuList.findIndex(m => m.path === item.path)
      this.menuList.splice(index, 1)
    },
    async setDynamicMenu(menu) {
      return new Promise((resolve) => {
        // 一次性批量导入指定路由下的所有vue文件【路由懒加载的方式】
        const module = import.meta.glob('../views/**/*.vue')
        // console.log('module:', module)
        function routerSet(router) {
          router.forEach(route => {
            // 如果没有子菜单，直接拼接路由
            if (!route.children || route.children.length === 0) {
              const url = `../views${route.meta.path}/index.vue`
              // console.log('url：' ,url)
              route.component = module[url]
            } else {
              routerSet(route.children)
            }
          });
        }
        routerSet(menu)
        this.dynamicMenu = menu
        resolve()
      })
    },
    updateMenuActive(active) {
      this.menuActive = active
    }
  }
})