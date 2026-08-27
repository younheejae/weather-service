<script setup>
// 검색 패널과 목록 패널이 공유하는 카드형 패널 디자인만 담당
// 실제 내용은 부모(각 View)가 slot으로 주입함

//   - #header 슬롯: 패널 제목 영역
//   - default 슬롯: 패널 본문
</script>

<template>
  <div class="panel">
    <h2 v-if="$slots.header">
      <slot name="header" />
    </h2>
    <slot />
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
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
}
</style>
