import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { public: true, title: '登录' },
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '数据仪表盘', icon: 'Odometer' },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/order/OrderList.vue'),
        meta: { title: '订单管理', icon: 'Tickets' },
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('../views/order/OrderDetail.vue'),
        meta: { title: '订单详情', hidden: true },
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('../views/customer/CustomerList.vue'),
        meta: { title: '客户管理', icon: 'User' },
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('../views/service/ServiceConfig.vue'),
        meta: { title: '洗护服务配置', icon: 'Setting' },
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('../views/staff/StaffManage.vue'),
        meta: { title: '员工权限', icon: 'Lock' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  if (to.path === '/login' && auth.isLoggedIn) {
    next('/dashboard')
    return
  }
  document.title = to.meta.title ? `${to.meta.title} · 包包洗护门店` : '包包洗护门店'
  next()
})

export default router
