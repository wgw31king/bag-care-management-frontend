import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])

  function save(row) {
    const idx = services.value.findIndex((s) => s.id === row.id)
    if (idx >= 0) services.value[idx] = { ...row }
    else services.value.push({ ...row, id: `s_${Date.now()}` })
    services.value.sort((a, b) => a.sort - b.sort)
  }

  function remove(id) {
    services.value = services.value.filter((s) => s.id !== id)
  }

  function setServices(list) {
    services.value = Array.isArray(list) ? list : []
  }

  return { services, save, remove, setServices }
})
