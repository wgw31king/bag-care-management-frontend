import { defineStore } from 'pinia'
import { ref } from 'vue'

function uid() {
  return `cus_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function mockCustomers() {
  const tags = ['普通', 'VIP', '储值']
  return Array.from({ length: 22 }).map((_, i) => ({
    id: `cus_${200 + i}`,
    name: `客户${i + 1}`,
    phone: `139${String(20000000 + i).slice(0, 8)}`,
    wechat: i % 2 ? `wx_c${i}` : '',
    tag: tags[i % 3],
    orderCount: (i % 8) + 1,
    lastVisit: `2026-05-${String((i % 20) + 1).padStart(2, '0')}`,
    remark: i % 4 === 0 ? '偏好深度护理' : '',
  }))
}

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref(mockCustomers())

  function add(row) {
    customers.value.unshift({ ...row, id: uid(), orderCount: 0 })
  }

  function update(id, payload) {
    const idx = customers.value.findIndex((c) => c.id === id)
    if (idx === -1) return
    customers.value[idx] = { ...customers.value[idx], ...payload }
  }

  function remove(id) {
    customers.value = customers.value.filter((c) => c.id !== id)
  }

  return { customers, add, update, remove }
})
