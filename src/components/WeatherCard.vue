<script setup>
// props:
//   - city: 표시할 도시 객체 전체 (name/temp/status/humidity/windSpeed/icon 등)
//   - selected: 현재 선택된 카드인지 여부 (부모의 selectedCityInfo와 비교한 결과)
//   - attraction: 이 도시의 현재 status에 맞는 추천 관광지 (썸네일용)

// emits:
//   - select-card: 카드 클릭 시 부모에게 이 도시를 선택했음을 전달
//   - click-detail: [상세보기] 버튼 클릭 시 부모에게 상세 알림을 요청 (버블링 방지)
defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  attraction: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

function attractionImageSrc(imageFileName) {
  return `/attractions/${imageFileName}`
}

function handleImageError(event, seedText) {
  const seed = encodeURIComponent(seedText || 'weather-mockup')
  event.target.onerror = null
  event.target.src = `https://picsum.photos/seed/${seed}/640/420`
}

function statusAccentClass(status) {
  const map = {
    맑음: 'accent-sunny',
    흐림: 'accent-cloudy',
    비: 'accent-rainy',
    눈: 'accent-snowy',
  }
  return map[status] ?? ''
}
</script>

<template>
  <div
    class="card"
    :class="[{ selected }, statusAccentClass(city.status)]"
    @click="emit('select-card', city)"
  >
    <img
      v-if="attraction"
      class="card-thumb"
      :src="attractionImageSrc(attraction.image)"
      :alt="attraction.name"
      @error="handleImageError($event, attraction.image)"
    />

    <div class="card-body">
      <div class="card-top">
        <span class="card-title">
          {{ city.icon }} {{ city.name }}
          <span class="card-status">{{ city.status }}</span>
        </span>
        <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
      </div>

      <div class="meta">
        <span
          >온도: {{ city.temp }}°C · 습도: {{ city.humidity }}% · 풍속:
          {{ city.windSpeed }}m/s</span
        >
      </div>

      <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
      <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--panel-line);
  border-top: 5px solid var(--panel-line);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    border-color 0.15s,
    transform 0.1s;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(16, 24, 48, 0.1);
  transform: translateY(-2px);
}
.card.selected {
  box-shadow: 0 10px 26px rgba(16, 24, 48, 0.1);
}
.card.selected.accent-sunny {
  box-shadow:
    0 0 0 2px var(--accent-sunny),
    0 10px 26px rgba(16, 24, 48, 0.1);
}
.card.selected.accent-cloudy {
  box-shadow:
    0 0 0 2px var(--accent-cloudy),
    0 10px 26px rgba(16, 24, 48, 0.1);
}
.card.selected.accent-rainy {
  box-shadow:
    0 0 0 2px var(--accent-rainy),
    0 10px 26px rgba(16, 24, 48, 0.1);
}
.card.selected.accent-snowy {
  box-shadow:
    0 0 0 2px var(--accent-snowy),
    0 10px 26px rgba(16, 24, 48, 0.1);
}
.accent-sunny {
  border-top-color: var(--accent-sunny);
}
.accent-cloudy {
  border-top-color: var(--accent-cloudy);
}
.accent-rainy {
  border-top-color: var(--accent-rainy);
}
.accent-snowy {
  border-top-color: var(--accent-snowy);
}

.card-thumb {
  width: 100%;
  height: 168px;
  object-fit: cover;
  background: var(--panel-bg);
}
.card-body {
  padding: 16px 18px 18px;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.card-title {
  font-weight: 700;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.card-status {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--sub);
}
.detail-btn {
  flex-shrink: 0;
  border: 1px solid var(--panel-line);
  background: #fff;
  color: var(--ink);
  border-radius: 9px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.detail-btn:hover {
  background: var(--btn-accent);
  color: #fff;
  border-color: var(--btn-accent);
}
.meta {
  font-size: 13px;
  color: var(--sub);
  margin: 0 0 10px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 999px;
  color: #fff;
}
.badge.hot {
  background: var(--hot);
}
.badge.cool {
  background: var(--cool);
}
</style>
