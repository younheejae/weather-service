<script setup>
// props: searchQuery(부모의 검색어 상태), placeholder(재사용 시 문구 변경용, 선택)
// emits: update-query(입력할 때마다 값 전달), reset(초기화 버튼 클릭)

defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '검색할 도시 이름 입력 (한글)',
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
        <input type="text" :value="searchQuery" @input="onInput" :placeholder="placeholder" />
      </div>
      <button class="reset-btn" @click="emit('reset')">초기화</button>
    </div>
    <p class="search-hint" v-show="searchQuery">
      검색 중: <strong>{{ searchQuery }}</strong>
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
  font-size: 24px;
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
