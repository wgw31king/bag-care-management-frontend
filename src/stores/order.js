import { defineStore } from 'pinia'
import { ref } from 'vue'

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])

  function getById(id) {
    return orders.value.find((o) => o.id === id)
  }

  function add(payload) {
    const row = {
      id: uid(),
      orderNo: `BW${Date.now().toString().slice(-10)}`,
      ...payload,
      createdAt: Date.now(),
    }
    orders.value.unshift(row)
    return row
  }

  function update(id, payload) {
    const idx = orders.value.findIndex((o) => o.id === id)
    if (idx === -1) return
    orders.value[idx] = { ...orders.value[idx], ...payload }
  }

  function remove(id) {
    orders.value = orders.value.filter((o) => o.id !== id)
  }

  function setOrders(list) {
    orders.value = Array.isArray(list) ? list : []
  }

  return { orders, getById, add, update, remove, setOrders }
})
