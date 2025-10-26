<template>
  <div class="nav-header flex-box">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="handleCollapse">
        <component :is="store.isCollapse ? 'Fold' : 'Expand'" />
      </el-icon>
      <ul class="header-navbar flex-box">
        <li v-for="(item, index) in store.menuList" :key="item.path" class="tab flex-box"
          :class="{ selected: item.meta.path === route.path }">
          <el-icon>
            <component :is="item.meta.icon" />
          </el-icon>
          <router-link :to="{ path: item.meta.path }">
            {{ item.meta.name }}
          </router-link>
          <el-icon class="close-icon" @click="removeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right flex-box">
      <el-avatar :src="avatar" :size="32" />
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useMenuStore } from '../store/menu'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router';

const store = useMenuStore()
const route = useRoute()
const router = useRouter()
const { avatar, name } = JSON.parse(localStorage.getItem('USERINFO'))

const handleCollapse = () => {
  store.collapsed()
}

const removeTab = (item, index) => {
  store.removeMenu(item)
  // console.log(item, route)
  // 判断关闭的是不是当前页
  if (item.meta.path !== route.path) {
    return
  }
  const menuList = store.menuList
  // 判断关闭的是否为最后一个tab
  if (index === menuList.length) {
    // 判断tab是否为多个
    if (!menuList.length) {
      router.push('/')
    } else {
      router.push(menuList[index - 1].meta.path)
    }
  } else {
    router.push(menuList[index].meta.path)
  }
}

const handleCommand = (command) => {
  if(command === 'exit') {
    localStorage.removeItem('TOKEN')
    localStorage.removeItem('USERINFO')
    localStorage.removeItem('menu')
    router.push('/login')
    // window.location.href = window.location.origin
  }
}

</script> 

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}

.nav-header {
  height: 100%;
  justify-content: space-between;
  padding: 0;
  padding-right: 25px;

  .header-left {
    height: 100%;

    .icon {
      width: 45px;
      height: 100%;

      &:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
    }

    .header-navbar {
      height: 100%;

      .tab {
        padding: 0 10px;
        height: 100%;
        gap: 3px;

        .close-icon {
          visibility: hidden;
        }

        &:hover {
          background-color: #f5f5f5;
          cursor: pointer;

          .close-icon {
            visibility: visible;
          }
        }
      }

      .selected {
        color: #409eff;
        background-color: #f5f5f5;

        a {
          color: #409eff;
        }

        .close-icon {
          visibility: visible;
        }
      }
    }
  }

  .header-right {
    gap: 10px;
  }
}</style>