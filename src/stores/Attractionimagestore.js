import { defineStore } from 'pinia'
import { ref } from 'vue'
import { searchPhotoByQuery } from '@/api/UnsplashApi'

// 관광지 이름(query) → Unsplash 검색 결과를 캐싱하는 전역 스토어
// weatherStore/recentlyViewedStore와 같은 패턴: 한 번 검색한 관광지는 다시 요청하지 않음
// (Unsplash Demo 등급은 시간당 50회 제한이라 캐싱이 특히 중요)
export const useAttractionImageStore = defineStore('attractionImage', () => {
  const imagesByQuery = ref({})
  const loadingQueries = ref(new Set())

  async function fetchImage(query, cityName) {
    if (query in imagesByQuery.value) return
    if (loadingQueries.value.has(query)) return

    loadingQueries.value.add(query)
    try {
      const photo = await searchPhotoByQuery(query, cityName)
      imagesByQuery.value = { ...imagesByQuery.value, [query]: photo }
    } catch (e) {
      console.error(e)
      imagesByQuery.value = { ...imagesByQuery.value, [query]: null }
    } finally {
      loadingQueries.value.delete(query)
    }
  }

  function getImageByQuery(query) {
    return imagesByQuery.value[query] ?? null
  }

  return { imagesByQuery, fetchImage, getImageByQuery }
})
