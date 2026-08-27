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
export async function searchPhotoByQuery(query, cityName) {
  const searchTerm = cityName ? `${query} ${cityName}` : query

  const response = await client.get('/search/photos', {
    params: { query: searchTerm, per_page: 1, orientation: 'landscape' },
  })
  const result = response.data.results[0]
  if (!result) return null
  return {
    url: result.urls.small,
    photographerName: result.user.name,
    photographerLink: result.user.links.html,
  }
}
