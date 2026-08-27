<script setup>
// props: 부모(WeatherParent)의 searchQuery 반응형 값을 그대로 전달받아 표시
// emits:
//   - update-query: input 값이 바뀔 때마다 부모에게 검색어를 전달
//   - reset: 초기화 버튼 클릭 시 부모에게 알림 (부모가 검색어/필터를 초기화)
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'reset'])

function onInput(event) {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div>
    <div class="search-row">
      <div class="search-field">
        <span class="search-icon">⌕</span>
        <input
          type="text"
          :value="searchQuery"
          @input="onInput"
          placeholder="검색할 도시 이름 입력 (한글)"
        />
      </div>
      <button class="reset-btn" @click="emit('reset')">초기화</button>
    </div>
    <p class="search-hint" v-show="searchQuery">
      검색 중인 도시: <strong>{{ searchQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-row {
  display: flex;
  gap: 8px;
}
.search-field {
  position: relative;
  flex: 1;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--sub);
  font-size: 16px;
  pointer-events: none;
}
input[type='text'] {
  width: 100%;
  padding: 12px 14px 12px 36px;
  border: 1px solid var(--panel-line);
  border-radius: 14px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  background: #ffffff;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
input[type='text']:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.reset-btn {
  border: none;
  background: #ffffff;
  color: var(--sub);
  font-weight: 600;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.reset-btn:hover {
  background: var(--btn-accent);
  color: #fff;
}
.search-hint {
  font-size: 13px;
  color: var(--sub);
  margin: 10px 2px 0;
}
.search-hint strong {
  color: var(--ink);
}
</style>
