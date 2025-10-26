import Layout from '../views/Layout.vue'
import Login from '../views/login/index.vue'
import Dashboard from '../views/dashboard/index.vue'
import Admin from '../views/auth/Admin/index.vue'
import Group from '../views/auth/Group/index.vue'
import Staff from '../views/vppz/Staff/index.vue'
import Order from '../views/vppz/Order/index.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: Layout,
    name: 'main',
    children: [
      /* {
        path: 'dashboard',
        component: Dashboard,
        meta: {
          id: '1',
          name: '控制台',
          icon: 'Platform',
          path: '/dashboard',
          describe: '用于展示当前系统中国的统计数据、统计报表及重要实时数据'
        }
      },
      {
        path: 'auth',
        meta: {
          id: '2',
          name: '权限管理',
          icon: 'Grid'
        },
        children: [
          {
            path: 'admin',
            alias: ['admin'],
            component: Admin,
            meta: {
              id: '2-1',
              name: '账号管理',
              icon: 'Avatar',
              path: '/auth/admin',
              describe: '管理员可以进行编辑，权限修改后需要登出才会生效'
            }
          },
          {
            path: 'group',
            component: Group,
            meta: {
              id: '2-2',
              name: '菜单管理',
              icon: 'Menu',
              path: '/auth/group',
              describe: '菜单规则通常对应一个控制器的方法，同时菜单栏的数据也从规则中获取'
            }
          }
        ]
      },
      {
        path: 'vppz',
        meta: {
          id: '3',
          name: 'DIDI陪诊',
          icon: 'BellFilled'
        },
        children: [
          {
            path: 'staff',
            alias: ['staff'],
            component: Staff,
            meta: {
              id: '3-1',
              name: '陪护管理',
              icon: 'Checked',
              path: '/vppz/staff',
              describe: '陪护管理'
            }
          },
          {
            path: 'order',
            component: Order,
            meta: {
              id: '3-2',
              name: '订单管理',
              icon: 'List',
              path: '/vppz/order',
              describe: '订单管理'
            }
          }
        ]
      } */
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router