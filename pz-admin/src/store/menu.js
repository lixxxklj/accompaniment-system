import { defineStore } from 'pinia'
export const useMenuStore = defineStore('menu', {
  state: () => {
    return {
      isCollapse: false,
      menuList: []
    }
  },
  actions: {
    collapsed() {
      this.isCollapse = !this.isCollapse
    },
    addMenu(item) {
      // 去重
      const idx = this.menuList.findIndex(menuItem => item.path === menuItem.path)
      if(idx === -1) {
        this.menuList.push(item)
      }
    },
    removeMenu(item) {
      const index = this.menuList.findIndex(m => m.path === item.path)
      this.menuList.splice(index, 1)
    }
  }
})