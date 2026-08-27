import { defineStore } from 'pinia'
import { ref } from 'vue'
import { searchPhotoByQuery } from '@/api/UnsplashApi'

// 관광지 이름(query) → Unsplash 검색 결과를 캐싱하는 전역 스토어
// weatherStore/recentlyViewedStore와 같은 패턴: 한 번 검색한 관광지는 다시 요청하지 않음
// (Unsplash Demo 등급은 시간당 50회 제한이라 캐싱이 특히 중요)
export const useAttractionImageStore = defineStore('attractionImage', () => {
  // { [query]: { url, photographerName, photographerLink } | null }
  // 값이 null이면 "검색은 했지만 결과가 없었다"는 뜻으로, 이것도 캐시해서 재검색을 막음
  const imagesByQuery = ref({})
  const loadingQueries = ref(new Set())

  async function fetchImage(query) {
    if (query in imagesByQuery.value) return // 이미 캐시됨(성공이든 실패든) — 재요청 안 함
    if (loadingQueries.value.has(query)) return // 같은 검색어가 이미 요청 중

    loadingQueries.value.add(query)
    try {
      const photo = await searchPhotoByQuery(query)
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
