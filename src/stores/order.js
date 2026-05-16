import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ORDER_STATUS, WASH_SERVICE_OPTIONS } from '../constants/order'

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function mockOrders() {
  const statuses = Object.values(ORDER_STATUS)
  const brands = ['Louis Vuitton', 'Gucci', 'Chanel', 'Hermès', 'Dior', 'Prada']
  const list = []
  for (let i = 1; i <= 28; i++) {
    const st = statuses[i % statuses.length]
    const washCount = (i % 3) + 2
    const washVals = WASH_SERVICE_OPTIONS.slice(0, washCount).map((x) => x.value)
    list.push({
      id: `ord_${1000 + i}`,
      orderNo: `BW${20250514000 + i}`,
      customerName: `客户${i}`,
      phone: `138${String(10000000 + i).slice(0, 8)}`,
      wechatNote: i % 2 ? `wx_${i}` : '',
      brand: brands[i % brands.length],
      style: i % 2 ? '单肩包' : '手提包',
      color: ['黑色', '棕色', '米白', '红色'][i % 4],
      material: ['牛皮', '帆布', '羊皮', '涂层帆布'][i % 4],
      defectDesc: '边角轻微磨损，五金轻微氧化',
      defectImages: [],
      washServices: washVals,
      orderTime:
        i <= 12
          ? `2026-05-14 ${String(9 + (i % 8)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`
          : `2026-05-${String((i % 28) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}:00`,
      expectPickupTime: `2026-05-${String(((i + 3) % 28) + 1).padStart(2, '0')} 18:00:00`,
      amount: 380 + (i % 5) * 120,
      prepay: 100 + (i % 3) * 50,
      remark: i % 3 ? '加急处理' : '',
      status: st,
      createdAt: Date.now() - i * 3600000,
    })
  }
  return list
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref(mockOrders())

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

  return { orders, getById, add, update, remove }
})
