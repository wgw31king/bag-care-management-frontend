import { defineStore } from 'pinia'
import { ref } from 'vue'

const defaultServices = [
  { id: 's1', name: '精洗', price: 198, durationMin: 120, enabled: true, sort: 1 },
  { id: 's2', name: '深度去污', price: 268, durationMin: 180, enabled: true, sort: 2 },
  { id: 's3', name: '五金抛光', price: 158, durationMin: 90, enabled: true, sort: 3 },
  { id: 's4', name: '补色修复', price: 580, durationMin: 360, enabled: true, sort: 4 },
  { id: 's5', name: '保养护理', price: 328, durationMin: 150, enabled: true, sort: 5 },
]

export const useServiceStore = defineStore('service', () => {
  const services = ref([...defaultServices])

  function save(row) {
    const idx = services.value.findIndex((s) => s.id === row.id)
    if (idx >= 0) services.value[idx] = { ...row }
    else services.value.push({ ...row, id: `s_${Date.now()}` })
    services.value.sort((a, b) => a.sort - b.sort)
  }

  function remove(id) {
    services.value = services.value.filter((s) => s.id !== id)
  }

  return { services, save, remove }
})
