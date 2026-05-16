<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const active = computed(() => route.path)

function go(path) {
  router.push(path)
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-root">
    <el-aside width="220px" class="layout-aside">
      <div class="brand">
        <span class="brand-mark" />
        <div>
          <div class="brand-title">包包洗护</div>
          <div class="brand-sub">门店订单管理</div>
        </div>
      </div>
      <el-menu
        :default-active="active"
        class="aside-menu"
        background-color="transparent"
        text-color="rgba(255,255,255,0.85)"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/dashboard" @click="go('/dashboard')">
          <el-icon><Odometer /></el-icon>
          <span>数据仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/orders" @click="go('/orders')">
          <el-icon><Tickets /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/customers" @click="go('/customers')">
          <el-icon><User /></el-icon>
          <span>客户管理</span>
        </el-menu-item>
        <el-menu-item index="/services" @click="go('/services')">
          <el-icon><Setting /></el-icon>
          <span>洗护服务配置</span>
        </el-menu-item>
        <el-menu-item index="/staff" @click="go('/staff')">
          <el-icon><Lock /></el-icon>
          <span>员工权限</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container direction="vertical" class="layout-main-wrap">
      <el-header class="layout-header">
        <div class="header-left">
          <span class="page-title">{{ route.meta.title || '控制台' }}</span>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-trigger">
              <el-avatar :size="32" class="user-avatar">{{ auth.displayName.slice(0, 1) }}</el-avatar>
              <span class="user-name">{{ auth.displayName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>个人设置（预留）</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="layout-main">
        <div class="main-inner">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-root {
  min-height: 100vh;
  background: var(--bw-bg-page);
}

.layout-aside {
  background: linear-gradient(180deg, #0b3d7a 0%, #0a58c4 45%, #1565c0 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(11, 61, 122, 0.18);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 18px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7ecbff, #e3f2ff);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.brand-title {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
}

.aside-menu {
  border-right: none;
  flex: 1;
  padding: 12px 8px;
}

.aside-menu :deep(.el-menu-item) {
  border-radius: 8px;
  margin-bottom: 4px;
}

.aside-menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.18) !important;
}

.layout-main-wrap {
  min-width: 0;
}

.layout-header {
  height: 56px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid var(--bw-border);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--bw-text);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.env-tag {
  border-radius: 6px;
}

.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--bw-text);
}

.user-avatar {
  background: var(--bw-primary);
  color: #fff;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layout-main {
  padding: 0;
  background: var(--bw-bg-page);
}

.main-inner {
  padding: 20px 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
