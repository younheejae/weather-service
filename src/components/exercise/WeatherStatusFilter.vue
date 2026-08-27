<script setup>
import { statusIcon } from '@/utils/Weatherhelpers'

// 지역별 날씨 현황 제목 옆 통계 칩(☀️/🌥️/🌧️/❄️)
// props: weatherStatusCounts(상태별 도시 수), statusFilter(현재 선택된 필터)
// emits: toggle-filter(status)

defineProps({
  statusOrder: {
    type: Array,
    required: true,
  },
  weatherStatusCounts: {
    type: Object,
    required: true,
  },
  statusFilter: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['toggle-filter'])
</script>

<template>
  <span class="stats-group">
    <button
      v-for="status in statusOrder"
      :key="status"
      type="button"
      class="stat-chip"
      :class="{ active: statusFilter === status }"
      @click="emit('toggle-filter', status)"
    >
      {{ statusIcon(status) }} {{ weatherStatusCounts[status] }}
    </button>
  </span>
</template>

<style scoped>
.stats-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.stat-chip {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
  background: #ffffff;
  border: 1px solid var(--panel-line);
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.1s;
}
.stat-chip:hover {
  transform: translateY(-1px);
}
.stat-chip.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
