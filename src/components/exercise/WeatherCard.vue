<script setup>
import { attractionImageSrc, handleImageError, statusAccentClass } from '@/utils/Weatherhelpers'
import { useConfigStore } from '@/stores/configStore'
import { computed } from 'vue'

// props: city(도시 객체), selected(선택 여부), attraction(현재 status에 맞는 추천 관광지)
// emits:
//   - select-card: 카드 클릭 시 이 도시를 선택했음을 부모에 전달
//   - click-detail: [상세보기] 클릭 시 부모에 알림

const props = defineProps({
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

// mock 데이터의 city.temp는 항상 섭씨(celsius) 원본값이라고 가정하고
// 화면에 보여줄 때만 configStore.unit에 맞게 변환함
const configStore = useConfigStore()

const displayTemp = computed(() => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((props.city.temp * 9) / 5 + 32)
  }
  return props.city.temp
})
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
          >온도: {{ displayTemp }}{{ configStore.unitSymbol }} · 습도: {{ city.humidity }}% · 풍속:
          {{ city.windSpeed }}m/s</span
        >
      </div>

      <!-- 더움/선선함 판정 기준은 단위를 바꿔도 헷갈리지 않도록 항상 원본 섭씨 값(city.temp) 기준으로 고정 -->
      <span v-if="city.temp >= 25" class="badge hot">🔥 더움</span>
      <span v-else class="badge cool">❄️ 선선함</span>
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
