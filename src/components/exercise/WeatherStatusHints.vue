<script setup>
import { statusIcon } from '@/utils/Weatherhelpers'

// indoorRecommendedCount(파생 지표)와 현재 필터 상태를 안내
// props: indoorRecommendedCount, statusFilter
// emits: clear-filter

defineProps({
  indoorRecommendedCount: {
    type: Number,
    default: 0,
  },
  statusFilter: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['clear-filter'])
</script>

<template>
  <div>
    <p class="indoor-hint" v-if="indoorRecommendedCount > 0">
      지금 <strong>{{ indoorRecommendedCount }}곳</strong>은 비·눈이 와서 실내 관광지를 추천드려요.
    </p>

    <p class="filter-hint" v-if="statusFilter">
      {{ statusIcon(statusFilter) }} <strong>{{ statusFilter }}</strong
      >인 도시만 보고 있어요.
      <button type="button" class="filter-clear" @click="emit('clear-filter')">전체 보기</button>
    </p>
  </div>
</template>

<style scoped>
.indoor-hint {
  font-size: 14px;
  color: #315b91;
  background: #eaf5fc;
  border-radius: 12px;
  padding: 12px 14px;
  margin: 0 0 10px;
}
.filter-hint {
  font-size: 14px;
  color: var(--sub);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-hint strong {
  color: var(--ink);
}
.filter-clear {
  border: 1px solid var(--btn-accent);
  background: #ffffff;
  color: var(--sub);
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  padding: 5px 10px;
  cursor: pointer;
}
.filter-clear:hover {
  background: var(--btn-accent);
  color: #fff;
}
</style>
