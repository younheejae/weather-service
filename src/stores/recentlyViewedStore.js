import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { findCityById } from '@/mock/Weatherdata'

const MAX_COUNT = 5

// Detail 페이지를 방문할 때마다 도시를 기록하는 스토어
// 도시 객체 전체가 아니라 도시 id만 저장해두고 화면에 보여줄 때 mock 데이터에서 최신 정보를 다시 조회한다
export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  // state: 최근 본 순서대로 id를 저장 (index 0 = 가장 최근)
  const cityIds = ref([])

  // getter: id 배열을 실제 도시 객체 배열로 변환해서 제공
  const recentCities = computed(() => cityIds.value.map((id) => findCityById(id)).filter(Boolean))

  // action: 방문 기록 추가
  function addCity(cityId) {
    cityIds.value = [cityId, ...cityIds.value.filter((id) => id !== cityId)].slice(0, MAX_COUNT)
  }

  // action: 기록 전체 초기화
  function clearAll() {
    cityIds.value = []
  }

  return { cityIds, recentCities, addCity, clearAll }
})
