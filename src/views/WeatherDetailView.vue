<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findAttraction } from '@/mock/WeatherData'
import RecommendedAttraction from '@/components/exercise/RecommendedAttraction.vue'
import { statusIcon } from '@/utils/Weatherhelpers'
import IconArrowLeft from '@/components/icons/IconArrowLeft.vue'
import { useConfigStore } from '@/stores/configStore'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'
import { useWeatherStore } from '@/stores/weatherStore'
import ForecastPanel from '@/components/exercise/ForecastPanel.vue'
import Skeleton from 'primevue/skeleton'

// Router 동적 경로 매칭(:cityId)을 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
const route = useRoute()
const router = useRouter()
const recentlyViewedStore = useRecentlyViewedStore()
const weatherStore = useWeatherStore()

const cityInfo = ref(null)

async function loadCity(cityId) {
  // weatherStore.fetchAll()은 이미 로드된 경우 즉시 반환되므로
  // Home을 거치지 않고 Detail로 바로 들어와도 여기서 최초 1회 호출이 이뤄짐
  await weatherStore.fetchAll()
  cityInfo.value = weatherStore.getCityById(cityId)
  // 유효한 도시로 확인된 경우에만 최근 본 도시 기록에 추가
  // (존재하지 않는 cityId로 접근한 경우엔 기록하지 않음)
  if (cityInfo.value) {
    recentlyViewedStore.addCity(cityInfo.value.id)
  }
}

onMounted(() => {
  loadCity(route.params.cityId)
})

// 상세 페이지에 머무른 채 :cityId만 바뀌는 경우(같은 컴포넌트 재사용)도 대응
watch(
  () => route.params.cityId,
  (newCityId) => {
    loadCity(newCityId)
  },
)

const attraction = computed(() => {
  if (!cityInfo.value) return null
  return findAttraction(cityInfo.value.id, cityInfo.value.status)
})

const configStore = useConfigStore()

const displayTemp = computed(() => {
  if (!cityInfo.value) return null
  if (configStore.unit === 'fahrenheit') {
    return Math.round((cityInfo.value.temp * 9) / 5 + 32)
  }
  return cityInfo.value.temp
})

// 지정 지역 / 실시간 기온 / 기상 현황 / 대기 습도 / 현재 풍속
// 하나의 배열로 관리해서 <dl class="detail-grid"> 안에 v-for로 한 번에 렌더링
const detailRows = computed(() => {
  if (!cityInfo.value) return []
  return [
    { label: '지정 지역', value: `대한민국 ${cityInfo.value.name}` },
    { label: '실시간 기온', value: `${displayTemp.value}${configStore.unitSymbol}` },
    { label: '기상 현황', value: `${statusIcon(cityInfo.value.status)} ${cityInfo.value.status}` },
    { label: '대기 습도', value: `${cityInfo.value.humidity}%` },
    { label: '현재 풍속', value: `${cityInfo.value.windSpeed}m/s` },
  ]
})

function goBackToDashboard() {
  router.push('/')
}
</script>

<template>
  <div class="page-bg">
    <div class="content-area">
      <!-- 실시간 데이터를 아직 불러오는 중일 때 PrimeVue Skeleton 실제 상세 정보
           패널과 같은 모양(.panel > 제목 + 5줄)으로 뼈대만 먼저 보여줌 -->
      <div class="panel" v-if="weatherStore.isLoading && !cityInfo">
        <Skeleton width="65%" height="20px" style="margin-bottom: 24px" />
        <dl class="detail-grid">
          <div class="detail-row" v-for="n in 5" :key="n">
            <Skeleton width="30%" height="14px" />
            <Skeleton width="22%" height="14px" />
          </div>
        </dl>
      </div>

      <!-- 존재하지 않는 cityId로 접근한 경우 -->
      <div class="not-found-box" v-else-if="!cityInfo">
        <p class="not-found-title">해당 도시 정보를 찾을 수 없어요.</p>
        <p class="not-found-sub">주소에 포함된 도시 코드를 다시 확인해주세요.</p>
        <button class="back-btn" @click="goBackToDashboard">
          <IconArrowLeft :size="15" />
          메인 대시보드로 돌아가기
        </button>
      </div>

      <template v-else>
        <button class="back-link" @click="goBackToDashboard">
          <IconArrowLeft :size="24" />
        </button>

        <div class="panel">
          <h2>지역별 상세 기상관측 정보</h2>

          <dl class="detail-grid">
            <div class="detail-row" v-for="row in detailRows" :key="row.label">
              <dt>{{ row.label }}</dt>
              <dd>{{ row.value }}</dd>
            </div>
          </dl>
        </div>

        <!-- 이 도시의 현재 날씨에 맞는 추천 관광지 (Home과 동일한 컴포넌트 재사용) -->
        <RecommendedAttraction
          :selected-city-info="cityInfo"
          :recommended-attraction="attraction"
          :show-empty-state="false"
        />

        <ForecastPanel :city-id="cityInfo.id" />

        <button class="back-btn" @click="goBackToDashboard">
          <IconArrowLeft :size="15" />
          메인 대시보드로 돌아가기
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

.page-bg {
  width: 100%;
  min-height: 100vh;
  background: #eef1f6;

  --card-bg: #ffffff;
  --ink: #101830;
  --sub: #64708a;
  --accent: #1d427d;
  --panel-bg: #ffffff;
  --panel-line: #e2e6f0;

  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.content-area {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 118px 16px 60px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .content-area {
    max-width: 880px;
    padding: 126px 32px 90px;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: none;
  color: var(--sub);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 0;
}
.back-link:hover {
  color: var(--accent);
}

.panel {
  border-radius: 22px;
  padding: 22px;
  margin-bottom: 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-line);
  box-shadow: 0 10px 24px rgba(16, 24, 48, 0.06);
}
.panel h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 24px;
}

.detail-grid {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f5f7fb;
  border-radius: 12px;
  padding: 20px;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f7fb;
  border-radius: 12px;
}
.detail-row dt {
  font-size: 14px;
  color: var(--sub);
}
.detail-row dd {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border: none;
  background: var(--accent);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  margin-top: 40px;
}
.back-btn:hover {
  opacity: 0.92;
}

.not-found-box {
  text-align: center;
  padding: 60px 20px;
}
.not-found-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 6px;
}
.not-found-sub {
  font-size: 13px;
  color: var(--sub);
  margin: 0 0 20px;
}
</style>
