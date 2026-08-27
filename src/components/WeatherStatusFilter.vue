<script setup>
// [본인 추가 컴포넌트] 지역별 날씨 현황 제목 옆의 통계 칩(☀️/🌥️/🌧️/❄️)
// 칩을 누르면 해당 날씨인 도시만 필터링하고, 다시 누르면 해제됨

// props: weatherStatusCounts(상태별 도시 수), statusFilter(현재 선택된 필터)
// emits: toggle-filter(status) - 칩 클릭 시 부모에게 어떤 상태를 토글할지 전달
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

function statusIcon(status) {
  const map = { 맑음: '☀️', 흐림: '🌥️', 비: '🌧️', 눈: '❄️' }
  return map[status] ?? ''
}
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
