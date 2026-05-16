import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('bagwash_token') || '')
  const displayName = ref(localStorage.getItem('bagwash_user') || '')

  const isLoggedIn = computed(() => Boolean(token.value))

  /** 登录成功后由 API 层调用，写入 token 与展示名 */
  function setSession(accessToken, username) {
    token.value = accessToken
    displayName.value = username || '门店管理员'
    localStorage.setItem('bagwash_token', token.value)
    localStorage.setItem('bagwash_user', displayName.value)
  }

  function logout() {
    token.value = ''
    displayName.value = ''
    localStorage.removeItem('bagwash_token')
    localStorage.removeItem('bagwash_user')
  }

  return { token, displayName, isLoggedIn, setSession, logout }
})
