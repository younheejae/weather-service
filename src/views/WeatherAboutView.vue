<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
  router.push('/')
}
</script>

<template>
  <div class="page-bg">
    <div class="content-area">
      <div class="panel">
        <h2>서비스 소개</h2>
        <p class="lead">
          본 앱은 Vue 3 및 Vue Router 4 기반으로 제작된 실습용 가상 관광 대시보드 시스템입니다.
        </p>
        <ul class="feature-list">
          <li>
            <span class="dot">•</span>
            <span
              >components/exercise 폴더의 학습용 부품 컴포넌트(검색창, 날씨 카드 등) 재사용</span
            >
          </li>
          <li>
            <span class="dot">•</span>
            <span>Vue Router의 동적 경로(:cityId)를 이용한 새로고침 없는 상세 페이지 이동</span>
          </li>
          <li>
            <span class="dot">•</span>
            <span>도시 검색어와 날씨 상태 필터를 실시간으로 반영하는 대시보드 화면</span>
          </li>
          <li>
            <span class="dot">•</span>
            <span
              >Pinia 기반 전역 상태 관리 — 단위 설정(configStore), 최근 본 도시
              (recentlyViewedStore), 실시간 날씨/예보 캐시(weatherStore), 관광지 사진
              캐시(attractionImageStore)</span
            >
          </li>
          <li>
            <span class="dot">•</span>
            <span
              >OpenWeatherMap API 연동 — 좌표 기반 실시간 날씨 조회와 5일치 예보를 도시별로 캐싱해서
              표시</span
            >
          </li>
          <li>
            <span class="dot">•</span>
            <span
              >Unsplash Search Photos API 연동 — 관광지 이름 기반 실사진 표시, 카드 노출 방식에 따라
              즉시 로드/지연 로드(IntersectionObserver)를 구분 적용</span
            >
          </li>
          <li>
            <span class="dot">•</span>
            <span
              >PrimeVue(Skeleton)를 활용해 로딩 중에도 실제 콘텐츠와 동일한 레이아웃을 미리 보여주는
              로딩 UX</span
            >
          </li>
        </ul>
        <button class="cta-btn" @click="goToDashboard">대시보드 홈으로 이동</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

.page-bg {
  width: 100%;
  min-height: 100vh;
  background: #eef1f6;
  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: #101830;
  letter-spacing: -0.01em;
}
.content-area {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 118px 16px 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 900px) {
  .content-area {
    max-width: 880px;
    padding: 126px 32px 90px;
  }
}
.panel {
  border-radius: 22px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e2e6f0;
  box-shadow: 0 10px 24px rgba(16, 24, 48, 0.06);
}
.panel h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px;
}
.lead {
  font-size: 14px;
  color: #64708a;
  line-height: 1.6;
  margin: 0 0 18px;
}
.feature-list {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13.5px;
  color: #101830;
  background: #f5f7fb;
  padding: 10px 12px;
  border-radius: 10px;
  line-height: 1.55;
}
.dot {
  color: #1d427d;
  font-weight: 800;
}
.cta-btn {
  display: block;
  width: 100%;
  border: none;
  background: #1d427d;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
}
.cta-btn:hover {
  opacity: 0.92;
}
</style>
