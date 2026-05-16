import { defineStore } from 'pinia'
import { ref } from 'vue'

export const PERMISSION_OPTIONS = [
  { value: 'dashboard', label: '仪表盘' },
  { value: 'order', label: '订单管理' },
  { value: 'customer', label: '客户管理' },
  { value: 'service', label: '服务配置' },
  { value: 'staff', label: '员工权限' },
  { value: 'finance', label: '财务查看' },
]

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref([])

  function add(row) {
    staffList.value.unshift({
      ...row,
      id: `st_${Date.now()}`,
    })
  }

  function update(id, payload) {
    const idx = staffList.value.findIndex((s) => s.id === id)
    if (idx === -1) return
    staffList.value[idx] = { ...staffList.value[idx], ...payload }
  }

  function remove(id) {
    staffList.value = staffList.value.filter((s) => s.id !== id)
  }

  function setStaffList(list) {
    staffList.value = Array.isArray(list) ? list : []
  }

  return { staffList, add, update, remove, setStaffList }
})
