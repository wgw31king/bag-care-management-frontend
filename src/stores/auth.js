import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import request from '../api/request'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('bagwash_token') || '')
  const displayName = ref(localStorage.getItem('bagwash_user') || '')

  const isLoggedIn = computed(() => Boolean(token.value))

  function setSession(accessToken, username) {
    token.value = accessToken
    displayName.value = username || '门店管理员'
    localStorage.setItem('bagwash_token', token.value)
    localStorage.setItem('bagwash_user', displayName.value)
  }

  function clearSession() {
    token.value = ''
    displayName.value = ''
    localStorage.removeItem('bagwash_token')
    localStorage.removeItem('bagwash_user')
  }

  async function login(username, password) {
    const res = await request.post('/auth/login', { username, password })
    const data = res.data || {}
    setSession(data.token, data.displayName || data.username || username)
    return data
  }

  async function logout() {
    try {
      await request.post('/auth/logout')
    } catch {
      // 网络失败时仍清除本地会话
    }
    clearSession()
  }

  async function fetchMe() {
    const res = await request.get('/auth/me')
    const data = res.data || {}
    if (data.displayName || data.username) {
      displayName.value = data.displayName || data.username
      localStorage.setItem('bagwash_user', displayName.value)
    }
    return data
  }

  return { token, displayName, isLoggedIn, setSession, clearSession, login, logout, fetchMe }
})
