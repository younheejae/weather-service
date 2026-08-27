<script setup>
import { useConfigStore } from '@/stores/configStore'

// Navigation Bar 옆에 배치되어 단위 설정을 변경하는 UI 버튼 영역
const configStore = useConfigStore()

// toggleUnit은 celsius <-> fahrenheit을 그냥 뒤집기만 하므로
// 이미 선택된 쪽을 다시 눌렀을 때는 아무 일도 안 일어나도록 여기서 한 번 걸러줌
function selectUnit(target) {
  if (configStore.unit !== target) {
    configStore.toggleUnit()
  }
}
</script>

<template>
  <div class="unit-toggler">
    <button
      type="button"
      class="unit-option"
      :class="{ active: configStore.unit === 'celsius' }"
      @click="selectUnit('celsius')"
    >
      °C
    </button>
    <button
      type="button"
      class="unit-option"
      :class="{ active: configStore.unit === 'fahrenheit' }"
      @click="selectUnit('fahrenheit')"
    >
      °F
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  background: rgba(16, 24, 48, 0.06);
  border-radius: 999px;
  padding: 2px;
}
.unit-option {
  border: none;
  background: transparent;
  font-size: 12.5px;
  font-weight: 600;
  color: #9aa3b8;
  padding: 6px 11px;
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.15s,
    background 0.15s;
}
.unit-option:hover {
  color: #101830;
}
.unit-option.active {
  color: #101830;
  font-weight: 800;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(16, 24, 48, 0.15);
}
.unit-divider {
  color: #c7cde0;
  font-size: 12px;
  user-select: none;
}
</style>
