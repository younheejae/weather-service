import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCurrentWeatherByCoords, fetchForecastByCoords } from '@/api/WeatherApi'
import { cityDefinitions } from '@/mock/WeatherData'
import { statusIcon } from '@/utils/Weatherhelpers'

// OpenWeatherMap의 날씨 코드(weather[0].main)를 이 앱이 쓰는 4종 상태로 정리
function mapConditionToStatus(mainCondition) {
  if (mainCondition === 'Clear') return '맑음'
  if (mainCondition === 'Snow') return '눈'
  if (['Rain', 'Drizzle', 'Thunderstorm'].includes(mainCondition)) return '비'
  return '흐림'
}

// forecast API는 3시간 간격으로 5일치(최대 40개) 항목을 한 번에 줌
// 화면에는 하루에 한 칸만 보여줄 거라 날짜별로 정오(12:00) 데이터를 대표값으로 뽑아
// 최대 5일치 배열로 정리 (정오 항목이 없는 날은 그날의 첫 항목으로 대체)
function extractDailyForecast(list) {
  const byDate = new Map()

  for (const item of list) {
    const [dateStr, timeStr] = item.dt_txt.split(' ')
    const isNoon = timeStr === '12:00:00'
    if (!byDate.has(dateStr) || isNoon) {
      byDate.set(dateStr, item)
    }
  }

  return Array.from(byDate.entries())
    .slice(0, 5)
    .map(([dateStr, item]) => {
      const status = mapConditionToStatus(item.weather[0].main)
      return {
        date: dateStr, // 'YYYY-MM-DD'
        temp: Math.round(item.main.temp),
        status,
        icon: statusIcon(status),
      }
    })
}

// 앱 전역에서 공유하는 실시간 날씨 스토어
// API 호출 결과를 여기 한 번만 저장해두고(fetchAll)
// Home/Detail/최근 본 도시 등 어디서든 이 스토어의 weatherList를 그대로 가져다 씀 ( 전역 캐시 역할 )
export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref([]) // 실시간으로 채워지는 도시별 날씨 배열
  const isLoading = ref(false)
  const error = ref(null)
  const loaded = ref(false) // 한 번이라도 성공적으로 불러왔는지

  let inFlightRequest = null // 여러 컴포넌트가 동시에 fetchAll을 불러도 실제 요청은 한 번만 나가게

  async function fetchAll() {
    if (loaded.value) return // 이미 불러온 적 있으면 재요청하지 않음
    if (inFlightRequest) return inFlightRequest // 요청이 이미 나가있으면 그 요청을 같이 기다림

    isLoading.value = true
    error.value = null

    inFlightRequest = (async () => {
      try {
        const results = await Promise.all(
          cityDefinitions.map(async (city) => {
            const data = await fetchCurrentWeatherByCoords(city.lat, city.lon)
            const status = mapConditionToStatus(data.weather[0].main)
            return {
              id: city.id,
              name: city.name,
              temp: Math.round(data.main.temp),
              status,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              icon: statusIcon(status),
            }
          }),
        )
        weatherList.value = results
        loaded.value = true
      } catch (e) {
        error.value =
          '실시간 날씨 데이터를 가져오지 못했습니다. API Key와 네트워크 상태를 확인해주세요.'
        console.error(e)
      } finally {
        isLoading.value = false
        inFlightRequest = null
      }
    })()

    return inFlightRequest
  }

  // id로 도시의 현재 저장된 실시간 날씨를 조회 (mock의 findCityById를 대체)
  function getCityById(cityId) {
    return weatherList.value.find((city) => city.id === cityId) ?? null
  }

  // 5 Day / 3 Hour Forecast — Detail 페이지 앞으로 5일 예보 섹션용
  // 10개 도시 전체를 미리 부르지 않고 Detail 페이지에 실제로 들어간 도시만 그때그때 호출함
  // 한 번 불러온 도시는 forecastByCityId에 캐싱해서 같은 도시 Detail을 다시 방문해도 재요청하지 않음
  const forecastByCityId = ref({}) // { [cityId]: Array<{date, temp, status, icon}> }
  const forecastLoadingId = ref(null) // 현재 예보를 불러오는 중인 cityId (없으면 null)
  const forecastError = ref(null)

  async function fetchForecast(cityId) {
    if (forecastByCityId.value[cityId]) return // 이미 캐시돼 있으면 재요청하지 않음

    const city = cityDefinitions.find((c) => c.id === cityId)
    if (!city) return

    forecastLoadingId.value = cityId
    forecastError.value = null

    try {
      const data = await fetchForecastByCoords(city.lat, city.lon)
      forecastByCityId.value = {
        ...forecastByCityId.value,
        [cityId]: extractDailyForecast(data.list),
      }
    } catch (e) {
      forecastError.value = '예보 데이터를 가져오지 못했습니다.'
      console.error(e)
    } finally {
      forecastLoadingId.value = null
    }
  }

  function getForecastByCityId(cityId) {
    return forecastByCityId.value[cityId] ?? []
  }

  return {
    weatherList,
    isLoading,
    error,
    loaded,
    fetchAll,
    getCityById,
    forecastLoadingId,
    forecastError,
    fetchForecast,
    getForecastByCityId,
  }
})
