<script setup>
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore'
import { statusAccentClass } from '@/utils/Weatherhelpers'

// 기록이 하나도 없으면 컴포넌트 전체를 렌더링하지 않는다(Home 상단이 비어보이지 않도록
// v-if는 이 컴포넌트를 불러다 쓰는 WeatherHomeView 쪽에서 recentCities.length로 감싼다)
const router = useRouter()
const configStore = useConfigStore()
const recentlyViewedStore = useRecentlyViewedStore()

function goToCity(cityId) {
  router.push('/weather/' + cityId)
}

// 카드에 표시할 정도, 단위 토글러(configStore)와 일관되게 화씨 변환
function displayTemp(city) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((city.temp * 9) / 5 + 32)
  }
  return city.temp
}
</script>

<template>
  <div class="recent-viewed-bleed">
    <div class="recent-viewed-inner">
      <div class="recent-header">
        <span class="recent-title">최근 본 도시</span>
        <button type="button" class="recent-clear" @click="recentlyViewedStore.clearAll">
          전체 지우기
        </button>
      </div>

      <div class="recent-chip-row">
        <button
          v-for="city in recentlyViewedStore.recentCities"
          :key="city.id"
          type="button"
          class="recent-chip"
          :class="statusAccentClass(city.status)"
          @click="goToCity(city.id)"
        >
          <span class="recent-chip-icon">{{ city.icon }}</span>
          <span class="recent-chip-name">{{ city.name }}</span>
          <span class="recent-chip-temp">{{ displayTemp(city) }}{{ configStore.unitSymbol }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recent-viewed-bleed {
  width: 100%;
  background: #e3e6ef;
}

.recent-viewed-inner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 16px 16px 14px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .recent-viewed-inner {
    max-width: 880px;
    padding: 20px 32px 18px;
  }
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 2px;
}
.recent-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}
.recent-clear {
  border: none;
  background: none;
  color: var(--sub);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}
.recent-clear:hover {
  color: var(--accent);
}

.recent-chip-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: thin;
}
.recent-chip-row::-webkit-scrollbar {
  height: 6px;
}
.recent-chip-row::-webkit-scrollbar-thumb {
  background: var(--panel-line);
  border-radius: 999px;
}

.recent-chip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card-bg);
  border: 1px solid var(--panel-line);
  border-left: 4px solid var(--panel-line);
  border-radius: 14px;
  padding: 10px 14px;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    transform 0.1s,
    border-color 0.15s;
}
.recent-chip:hover {
  box-shadow: 0 8px 18px rgba(16, 24, 48, 0.08);
  transform: translateY(-1px);
}
.recent-chip.accent-sunny {
  border-left-color: var(--accent-sunny);
}
.recent-chip.accent-cloudy {
  border-left-color: var(--accent-cloudy);
}
.recent-chip.accent-rainy {
  border-left-color: var(--accent-rainy);
}
.recent-chip.accent-snowy {
  border-left-color: var(--accent-snowy);
}

.recent-chip-icon {
  font-size: 16px;
}
.recent-chip-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--ink);
}
.recent-chip-temp {
  font-size: 12.5px;
  color: var(--sub);
  font-weight: 600;
}

@media (max-width: 900px) {
  .recent-chip-row {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* 구형 Edge/IE */
  }
  .recent-chip-row::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
}
</style>
