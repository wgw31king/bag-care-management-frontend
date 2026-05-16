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

function mockStaff() {
  return [
    {
      id: 'st_1',
      name: '王店长',
      phone: '13800001111',
      role: '店长',
      status: '在职',
      permissions: PERMISSION_OPTIONS.map((p) => p.value),
    },
    {
      id: 'st_2',
      name: '李洗护',
      phone: '13800002222',
      role: '洗护技师',
      status: '在职',
      permissions: ['dashboard', 'order'],
    },
    {
      id: 'st_3',
      name: '赵前台',
      phone: '13800003333',
      role: '前台',
      status: '在职',
      permissions: ['dashboard', 'order', 'customer'],
    },
  ]
}

export const useStaffStore = defineStore('staff', () => {
  const staffList = ref(mockStaff())

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

  return { staffList, add, update, remove }
})
