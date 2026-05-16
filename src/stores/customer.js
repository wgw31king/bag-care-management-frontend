import { defineStore } from 'pinia'
import { ref } from 'vue'

function uid() {
  return `cus_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref([])

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

  function setCustomers(list) {
    customers.value = Array.isArray(list) ? list : []
  }

  return { customers, add, update, remove, setCustomers }
})
