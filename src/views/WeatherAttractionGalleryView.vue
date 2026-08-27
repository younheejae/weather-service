<script setup>
import { ref, computed } from 'vue'
import { attractionGallery } from '@/mock/WeatherData'
import { statusIcon } from '@/utils/Weatherhelpers'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import HeroBand from '@/components/exercise/HeroBand.vue'
import Lazyattractionthumb from '@/components/exercise/LazyAttractionThumb.vue'

// attractionMap(도시 × status)을 평탄화한 40개 관광지를 관광지가 주인공인 카드 그리드로 보여줌
// 지역/날씨는 관광지 이름 아래 부제(캡션)로만 붙음
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
          <!-- 실제로 스크롤돼서 화면에 보일 때만 Unsplash를 검색하는 지연 로딩 썸네일
               보이기 전까지는 기존 로컬/picsum 이미지가 그대로 보임 -->
          <Lazyattractionthumb
            class="gallery-thumb"
            :name="item.name"
            :city-name="item.cityName"
            :image-file-name="item.image"
            :alt="item.name"
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
  height: 150px;
  display: block;
  background: var(--panel-bg);
}
.gallery-body {
  padding: 14px 16px 16px;
}
.gallery-name {
  font-size: 15.5px;
  font-weight: 700;
  margin: 0 0 4px;
}
.gallery-caption {
  font-size: 12.5px;
  color: var(--accent);
  font-weight: 600;
  margin: 0 0 8px;
}
.gallery-tip {
  font-size: 13px;
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
