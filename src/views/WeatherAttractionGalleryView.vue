<script setup>
import { ref, computed } from 'vue'
import { attractionGallery } from '@/mock/Weatherdata'
import { attractionImageSrc, handleImageError, statusIcon } from '@/utils/Weatherhelpers'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import HeroBand from '@/components/exercise/HeroBand.vue'

// attractionMap(도시 × status)을 평탄화한 40개 관광지를 관광지가 주인공인 카드 그리드로 보여줌
// 지역/날씨는 관광지 이름 아래 부제(캡션)로만 붙는다
const searchQuery = ref('')

const filteredGallery = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return attractionGallery
  return attractionGallery.filter(
    (item) => item.name.includes(keyword) || item.cityName.includes(keyword),
  )
})

function clearSearch() {
  searchQuery.value = ''
}

function updateSearchQuery(value) {
  searchQuery.value = value
}
</script>

<template>
  <div class="page-bg">
    <HeroBand eyebrow="Attraction Gallery" title="날씨별 전국 관광지 모아보기">
      10개 도시의 다양한 관광지를 날씨별로 살펴보고, 오늘 날씨에 딱 맞는 여행지를 찾아보세요.
    </HeroBand>

    <div class="content-area">
      <BaseDashboardCard>
        <template #header>관광지·지역 검색</template>
        <SearchBar
          :search-query="searchQuery"
          placeholder="관광지 이름 또는 지역 이름으로 검색"
          @update-query="updateSearchQuery"
          @reset="clearSearch"
        />
      </BaseDashboardCard>

      <div class="gallery-grid">
        <div v-for="item in filteredGallery" :key="item.id" class="gallery-card">
          <img
            class="gallery-thumb"
            :src="attractionImageSrc(item.image)"
            :alt="item.name"
            @error="handleImageError($event, item.image)"
          />
          <div class="gallery-body">
            <p class="gallery-name">{{ item.name }}</p>
            <p class="gallery-caption">
              {{ item.cityName }} · {{ statusIcon(item.status) }} {{ item.status }}일 때 추천
            </p>
            <p class="gallery-tip">{{ item.tip }}</p>
          </div>
        </div>
      </div>

      <p class="empty" v-if="filteredGallery.length === 0">조건에 맞는 관광지가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

.page-bg {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eef1f6;

  --card-bg: #ffffff;
  --ink: #101830;
  --sub: #64708a;
  --accent: #1d427d;
  --accent-soft: #e7edfe;
  --btn-accent: #b8c0cb;
  --panel-bg: #ffffff;
  --panel-line: #e2e6f0;

  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.hero-band {
  width: 100%;
  background: radial-gradient(circle at 15% 0%, #1c2e66 0%, #101a3d 45%, #0b1330 100%);
}
.hero-inner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 108px 16px 40px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .hero-inner {
    max-width: 880px;
    padding: 124px 32px 44px;
  }
}
.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #cfe0ff;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  margin: 0 0 10px;
}
.hero-inner h1 {
  font-size: 25px;
  font-weight: 800;
  margin: 0 0 6px;
  color: #ffffff;
}
.hero-inner .sub {
  font-size: 14px;
  color: #b7c3e8;
  margin: 0;
}

.content-area {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px 60px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .content-area {
    max-width: 960px;
    padding: 32px 32px 90px;
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 1000px) {
  .gallery-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
.gallery-card {
  background: var(--card-bg);
  border: 1px solid var(--panel-line);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(16, 24, 48, 0.05);
}
.gallery-thumb {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--panel-bg);
}
.gallery-body {
  padding: 14px 16px 16px;
}
.gallery-name {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 12px;
}
.gallery-caption {
  font-size: 14px;
  color: var(--accent);
  font-weight: 600;
  margin: 0 0 10px;
}
.gallery-tip {
  font-size: 14px;
  color: var(--sub);
  margin: 0;
  line-height: 1.5;
}
.empty {
  text-align: center;
  color: var(--sub);
  font-size: 13px;
  padding: 24px 0 6px;
}
</style>
