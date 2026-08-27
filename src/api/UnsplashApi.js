import axios from 'axios'

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
const BASE_URL = 'https://api.unsplash.com'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Unsplash는 다른 API처럼 query param이 아니라 Authorization 헤더로 키를 전달
    Authorization: `Client-ID ${ACCESS_KEY}`,
  },
})

// 검색어(관광지 이름)로 사진을 1장 검색해서 필요한 정보만 뽑아 반환
// 결과가 없으면 null을 반환하고 호출부는 이 경우 기존 로컬 이미지로 폴백
export async function searchPhotoByQuery(query) {
  const response = await client.get('/search/photos', {
    params: {
      // 관광지 이름만 넣으면 동명이인/동명장소 등 엉뚱한 결과가 섞일 수 있어 컨텍스트를 보강
      query: `${query} korea travel`,
      per_page: 1,
      orientation: 'landscape',
    },
  })

  const result = response.data.results[0]
  if (!result) return null

  return {
    url: result.urls.small,
    // Unsplash API 가이드라인상 사진을 노출할 때는 촬영자 크레딧을 함께 표시해야 함
    photographerName: result.user.name,
    photographerLink: `${result.user.links.html}?utm_source=weather-travel-app&utm_medium=referral`,
  }
}
