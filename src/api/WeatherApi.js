import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// appid/units/lang을 매 호출마다 반복해서 쓰지 않도록 기본값을 인스턴스에 박아둠
const client = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', // 응답의 temp가 바로 섭씨로 오도록
    lang: 'kr', // weather[0].description이 한국어로 오도록
  },
})

// 위경도 좌표로 현재 날씨 조회
// 수원/강릉처럼 도시명 검색(q=)이 정확히 매칭 안 될 수 있는 도시가 섞여있어 실제 앱 데이터(10개 도시)는 좌표 기반으로 조회함
export async function fetchCurrentWeatherByCoords(lat, lon) {
  const response = await client.get('/weather', {
    params: { lat, lon },
  })
  return response.data
}

// 5 Day / 3 Hour Forecast — 위경도 좌표로 향후 5일치(3시간 간격, 총 40개 항목) 예보 조회
export async function fetchForecastByCoords(lat, lon) {
  const response = await client.get('/forecast', {
    params: { lat, lon },
  })
  return response.data
}
