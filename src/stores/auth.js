import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('bagwash_token') || '')
  const displayName = ref(localStorage.getItem('bagwash_user') || '门店管理员')

  const isLoggedIn = computed(() => Boolean(token.value))

  function login(username, _password) {
    token.value = `mock_${Date.now()}`
    displayName.value = username || '门店管理员'
    localStorage.setItem('bagwash_token', token.value)
    localStorage.setItem('bagwash_user', displayName.value)
  }

  function logout() {
    token.value = ''
    localStorage.removeItem('bagwash_token')
    localStorage.removeItem('bagwash_user')
  }

  return { token, displayName, isLoggedIn, login, logout }
})
