<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherStatusFilter from '@/components/exercise/WeatherStatusFilter.vue'
import WeatherStatusHints from '@/components/exercise/WeatherStatusHints.vue'
import RecommendedAttraction from '@/components/exercise/RecommendedAttraction.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import { weatherList, attractionMap } from '@/mock/Weatherdata'
import HeroBand from '@/components/exercise/HeroBand.vue'

const router = useRouter()

// 반응형 상태 (ref)
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const statusOrder = ['맑음', '흐림', '비', '눈']
const statusFilter = ref(null)

// computed
const searchFilteredList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList
  return weatherList.filter((city) => city.name.includes(keyword))
})

const filteredWeatherList = computed(() =>
  searchFilteredList.value.filter(
    (city) => !statusFilter.value || city.status === statusFilter.value,
  ),
)

const recommendedAttraction = computed(() => {
  if (!selectedCityInfo.value) return null
  const cityAttractions = attractionMap[selectedCityInfo.value.id]
  return cityAttractions ? cityAttractions[selectedCityInfo.value.status] : null
})

const weatherStatusCounts = computed(() => {
  const counts = { 맑음: 0, 흐림: 0, 비: 0, 눈: 0 }
  for (const city of searchFilteredList.value) counts[city.status] += 1
  return counts
})

const indoorRecommendedCount = computed(
  () => weatherStatusCounts.value['비'] + weatherStatusCounts.value['눈'],
)

// watch / watchEffect
watch(selectedCityInfo, (newCity, oldCity) => {
  const toLabel = (city) =>
    city ? `"${city.name}"이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
  console.log(`[watch] 선택 상태 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(indoorRecommendedCount, (newCount, oldCount) => {
  console.log(`[watch] 실내 관광 추천이 필요한 도시 수 변경: ${oldCount} -> ${newCount}`)
})

// 이벤트 핸들러 (자식 컴포넌트가 emit 하는 이벤트를 받아 상태를 갱신)
function updateSearchQuery(value) {
  searchQuery.value = value
}

function toggleStatusFilter(status) {
  statusFilter.value = statusFilter.value === status ? null : status
}

function clearStatusFilter() {
  statusFilter.value = null
}

function clearSearch() {
  searchQuery.value = ''
  statusFilter.value = null
}

function selectCity(city) {
  selectedCityInfo.value = city
}

function showDetail(city) {
  router.push('/weather/' + city.id)
}

function attractionOf(city) {
  return attractionMap[city.id]?.[city.status] ?? null
}
</script>

<template>
  <div class="page-bg">
    <HeroBand eyebrow="Weather Travel" title="오늘, 어디로 떠나볼까요?">
      도시를 검색하거나 카드를 눌러 날씨와 추천 관광지를 확인해보세요.
    </HeroBand>

    <div class="content-area">
      <BaseDashboardCard>
        <template #header>도시 검색</template>
        <SearchBar
          :search-query="searchQuery"
          @update-query="updateSearchQuery"
          @reset="clearSearch"
        />
      </BaseDashboardCard>

      <RecommendedAttraction
        :selected-city-info="selectedCityInfo"
        :recommended-attraction="recommendedAttraction"
      />

      <BaseDashboardCard>
        <template #header>
          지역별 날씨 현황
          <WeatherStatusFilter
            :status-order="statusOrder"
            :weather-status-counts="weatherStatusCounts"
            :status-filter="statusFilter"
            @toggle-filter="toggleStatusFilter"
          />
        </template>

        <WeatherStatusHints
          :indoor-recommended-count="indoorRecommendedCount"
          :status-filter="statusFilter"
          @clear-filter="clearStatusFilter"
        />

        <div class="card-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            :selected="!!selectedCityInfo && selectedCityInfo.id === city.id"
            :attraction="attractionOf(city)"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>

        <p class="empty" v-if="filteredWeatherList.length === 0">조건에 맞는 도시가 없습니다.</p>
      </BaseDashboardCard>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

.page-bg {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eef1f6;

  --card-bg: #ffffff;
  --ink: #101830;
  --sub: #64708a;
  --line: #dbe3fb;
  --accent: #1d427d;
  --accent-soft: #e7edfe;
  --hot: #e06a4e;
  --cool: #1d427d;
  --btn-accent: #b8c0cb;

  --panel-bg: #ffffff;
  --panel-line: #e2e6f0;

  --accent-sunny: #ffe0c2;
  --accent-cloudy: #fff0b8;
  --accent-rainy: #d8efc5;
  --accent-snowy: #c9e8f5;

  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.hero-band {
  width: 100%;
  background: radial-gradient(circle at 15% 0%, #1c2e66 0%, #101a3d 45%, #0b1330 100%);
}
.hero-inner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 108px 16px 40px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .hero-inner {
    max-width: 880px;
    padding: 124px 32px 44px;
  }
}

.content-area {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .content-area {
    max-width: 880px;
    padding: 32px 32px 90px;
  }
}

.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #cfe0ff;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  margin: 0 0 10px;
}
.hero-inner h1 {
  font-size: 27px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.hero-inner .sub {
  font-size: 14px;
  color: #b7c3e8;
  margin: 0;
}

.card-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 900px) {
  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}
.empty {
  text-align: center;
  color: var(--sub);
  font-size: 13px;
  padding: 24px 0 6px;
}
</style>
