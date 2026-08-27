<script setup>
import { computed, watch } from 'vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { useConfigStore } from '@/stores/configStore'

// props: cityId 하나만 받음 weatherStore.fetchForecast()가 내부적으로
// 캐시(forecastByCityId)를 갖고 있어서 같은 cityId로 다시 마운트돼도 재요청하지 않음
const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
})

const weatherStore = useWeatherStore()

// cityId가 주어지는(또는 바뀌는) 즉시 예보를 요청
watch(
  () => props.cityId,
  (id) => {
    if (id) weatherStore.fetchForecast(id)
  },
  { immediate: true },
)

const forecast = computed(() => weatherStore.getForecastByCityId(props.cityId))
const isLoading = computed(() => weatherStore.forecastLoadingId === props.cityId)

function formatForecastDate(dateStr) {
  // 'T00:00:00'을 붙여서 UTC가 아닌 로컬 자정으로 해석되게 함 (날짜가 하루 밀리는 것 방지)
  const date = new Date(`${dateStr}T00:00:00`)
  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' })
  return `${date.getMonth() + 1}/${date.getDate()}(${weekday})`
}

const configStore = useConfigStore()

function displayTemp(tempCelsius) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((tempCelsius * 9) / 5 + 32)
  }
  return tempCelsius
}
</script>

<template>
  <div class="panel">
    <h2>앞으로 5일간 예보</h2>

    <p v-if="isLoading" class="forecast-status">예보를 불러오는 중...</p>
    <p v-else-if="weatherStore.forecastError" class="forecast-status forecast-status--error">
      {{ weatherStore.forecastError }}
    </p>

    <div class="forecast-row" v-else>
      <div class="forecast-item" v-for="day in forecast" :key="day.date">
        <p class="forecast-date">{{ formatForecastDate(day.date) }}</p>
        <p class="forecast-icon">{{ day.icon }}</p>
        <p class="forecast-temp">{{ displayTemp(day.temp) }}{{ configStore.unitSymbol }}</p>
        <p class="forecast-status-text">{{ day.status }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  border-radius: 22px;
  padding: 22px;
  margin-bottom: 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-line);
  box-shadow: 0 10px 24px rgba(16, 24, 48, 0.06);
}
.panel h2 {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 20px;
}

.forecast-status {
  text-align: center;
  color: var(--sub);
  font-size: 13.5px;
  padding: 16px 0;
}
.forecast-status--error {
  color: #c0392b;
}
.forecast-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.forecast-item {
  flex: 1 0 0;
  min-width: 74px;
  text-align: center;
  background: #f5f7fb;
  border-radius: 12px;
  padding: 14px 8px;
}
.forecast-date {
  font-size: 12px;
  color: var(--sub);
  margin: 0 0 6px;
  font-weight: 600;
}
.forecast-icon {
  font-size: 20px;
  margin: 0 0 6px;
}
.forecast-temp {
  font-size: 15px;
  font-weight: 800;
  color: var(--ink);
  margin: 0 0 2px;
}
.forecast-status-text {
  font-size: 11.5px;
  color: var(--sub);
  margin: 0;
}
</style>
