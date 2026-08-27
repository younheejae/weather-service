import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius') // state, 초기값 celsius

  const unitSymbol = computed(() => (unit.value === 'fahrenheit' ? '°F' : '°C'))

  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
