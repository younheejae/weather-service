<script setup>
import { attractionImageSrc, handleImageError } from '@/utils/Weatherhelpers'

// props: selectedCityInfo(선택된 도시 객체), recommendedAttraction(추천 관광지)
// Home에서는 선택 안 했을 때의 안내문구가 필요하지만, Detail 페이지에서는 도시가
// 항상 정해져 있으므로 showEmptyState=false로 안내문구를 끄고 히어로 카드만 씀

defineProps({
  selectedCityInfo: {
    type: Object,
    default: null,
  },
  recommendedAttraction: {
    type: Object,
    default: null,
  },
  showEmptyState: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div class="status-bar status-bar--muted" v-if="showEmptyState && !selectedCityInfo">
    카드를 클릭하거나 검색해 보세요.
  </div>

  <div class="recommend-box" v-if="recommendedAttraction">
    <img
      class="recommend-img"
      :src="attractionImageSrc(recommendedAttraction.image)"
      :alt="recommendedAttraction.name"
      @error="handleImageError($event, recommendedAttraction.image)"
    />
    <div class="recommend-overlay"></div>
    <div class="recommend-content">
      <p class="recommend-eyebrow">
        {{ selectedCityInfo.name }} · {{ selectedCityInfo.status }}일 때 추천
      </p>
      <p class="recommend-name">{{ recommendedAttraction.name }}</p>
      <p class="recommend-tip">{{ recommendedAttraction.tip }}</p>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  text-align: center;
  border-radius: 14px;
  padding: 20px 14px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 36px;
}
.status-bar--muted {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #d9dde3;
  font-weight: 500;
}

.recommend-box {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 36px;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 16px 36px rgba(16, 24, 48, 0.18);
}
.recommend-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recommend-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(9, 14, 40, 0) 25%, rgba(8, 12, 38, 0.9) 100%);
}
.recommend-content {
  position: relative;
  padding: 20px;
  color: #fff;
}
.recommend-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #a9c3ff;
  margin: 0 0 6px;
}
.recommend-name {
  font-size: 21px;
  font-weight: 800;
  margin: 0 0 4px;
}
.recommend-tip {
  font-size: 13px;
  color: #dbe3fb;
  margin: 0;
}
</style>
