<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherStatusFilter from './WeatherStatusFilter.vue'
import WeatherStatusHints from './WeatherStatusHints.vue'
import RecommendedAttraction from './RecommendedAttraction.vue'
import WeatherCard from './WeatherCard.vue'

// 배열 렌더링(v-for)용 기본 데이터 10개
// name, temp, status 외에 humidity(습도), windSpeed(풍속), icon(아이콘) 추가
// status는 맑음/흐림/비/눈 4종
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 45,
    windSpeed: 2.1,
    icon: '☀️',
  },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 78, windSpeed: 3.4, icon: '🌧️' },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '흐림',
    humidity: 60,
    windSpeed: 4.0,
    icon: '🌥️',
  },
  {
    id: 'city_04',
    name: '인천',
    temp: 23,
    status: '흐림',
    humidity: 66,
    windSpeed: 3.8,
    icon: '🌥️',
  },
  {
    id: 'city_05',
    name: '대구',
    temp: 30,
    status: '맑음',
    humidity: 38,
    windSpeed: 1.9,
    icon: '☀️',
  },
  {
    id: 'city_06',
    name: '대전',
    temp: 22,
    status: '흐림',
    humidity: 55,
    windSpeed: 2.6,
    icon: '🌥️',
  },
  {
    id: 'city_07',
    name: '광주',
    temp: 27,
    status: '맑음',
    humidity: 50,
    windSpeed: 2.3,
    icon: '☀️',
  },
  { id: 'city_08', name: '울산', temp: 25, status: '눈', humidity: 58, windSpeed: 3.1, icon: '❄️' },
  { id: 'city_09', name: '제주', temp: 29, status: '비', humidity: 82, windSpeed: 5.2, icon: '🌧️' },
  { id: 'city_10', name: '강릉', temp: 21, status: '눈', humidity: 70, windSpeed: 2.8, icon: '❄️' },
])

// 관광지 추천 데이터: 도시(10) × status(4) = 40개
// image는 public/attractions/ 안에 넣을 파일명 (없으면 자동 placeholder로 대체됨)
const attractionMap = {
  city_01: {
    맑음: {
      name: '경복궁',
      tip: '맑은 날엔 근정전 앞마당이 사진 명소예요.',
      image: 'city_01_sunny.jpg',
    },
    흐림: {
      name: '국립중앙박물관',
      tip: '흐린 날엔 넓은 상설전시관을 여유롭게 둘러보세요.',
      image: 'city_01_cloudy.jpg',
    },
    비: {
      name: '코엑스몰',
      tip: '비 오는 날엔 실내 쇼핑·전시 공간이 최고예요.',
      image: 'city_01_rainy.jpg',
    },
    눈: {
      name: '남산서울타워',
      tip: '눈 내린 밤 남산 야경이 정말 예뻐요.',
      image: 'city_01_snowy.jpg',
    },
  },
  city_02: {
    맑음: {
      name: '수원화성',
      tip: '성곽 위를 걸으며 맑은 하늘을 즐겨보세요.',
      image: 'city_02_sunny.jpg',
    },
    흐림: {
      name: '행궁동 벽화마을',
      tip: '흐린 날 골목 산책하기 좋아요.',
      image: 'city_02_cloudy.jpg',
    },
    비: {
      name: '갤러리아광교',
      tip: '비 오는 날엔 실내 쇼핑몰 나들이 추천이에요.',
      image: 'city_02_rainy.jpg',
    },
    눈: {
      name: '광교호수공원',
      tip: '눈 쌓인 호수 풍경이 아름다워요.',
      image: 'city_02_snowy.jpg',
    },
  },
  city_03: {
    맑음: {
      name: '해운대해수욕장',
      tip: '맑은 날 바다 산책하기 딱 좋아요.',
      image: 'city_03_sunny.jpg',
    },
    흐림: {
      name: '감천문화마을',
      tip: '흐린 날엔 알록달록 골목 구경을 추천해요.',
      image: 'city_03_cloudy.jpg',
    },
    비: {
      name: '국립해양박물관',
      tip: '비 오는 날엔 실내 박물관이 좋아요.',
      image: 'city_03_rainy.jpg',
    },
    눈: {
      name: '태종대',
      tip: '부산에 눈이 오면 흔치 않은 설경을 만날 수 있어요.',
      image: 'city_03_snowy.jpg',
    },
  },
  city_04: {
    맑음: {
      name: '월미도',
      tip: '맑은 날 바닷바람 맞으며 산책하기 좋아요.',
      image: 'city_04_sunny.jpg',
    },
    흐림: {
      name: '인천차이나타운',
      tip: '흐린 날엔 골목 구경하며 짜장면 한 그릇 어때요.',
      image: 'city_04_cloudy.jpg',
    },
    비: {
      name: '파라다이스시티',
      tip: '비 오는 날엔 실내에서 즐길 거리가 많아요.',
      image: 'city_04_rainy.jpg',
    },
    눈: {
      name: '송도센트럴파크',
      tip: '눈 내린 공원 풍경이 운치있어요.',
      image: 'city_04_snowy.jpg',
    },
  },
  city_05: {
    맑음: { name: '팔공산', tip: '맑은 날 등산하기 좋은 명산이에요.', image: 'city_05_sunny.jpg' },
    흐림: {
      name: '김광석다시그리기길',
      tip: '흐린 날 감성 가득한 골목길 산책을 추천해요.',
      image: 'city_05_cloudy.jpg',
    },
    비: {
      name: '대구근대역사관',
      tip: '비 오는 날엔 역사관 관람이 딱이에요.',
      image: 'city_05_rainy.jpg',
    },
    눈: { name: '앞산공원', tip: '눈 덮인 산책로가 조용하고 예뻐요.', image: 'city_05_snowy.jpg' },
  },
  city_06: {
    맑음: {
      name: '대청호반',
      tip: '맑은 날 호수 둘레길 산책하기 좋아요.',
      image: 'city_06_sunny.jpg',
    },
    흐림: {
      name: '대전예술의전당',
      tip: '흐린 날엔 공연·전시 관람을 추천해요.',
      image: 'city_06_cloudy.jpg',
    },
    비: {
      name: '국립중앙과학관',
      tip: '비 오는 날엔 아이와 함께 과학관 나들이 좋아요.',
      image: 'city_06_rainy.jpg',
    },
    눈: {
      name: '장태산자연휴양림',
      tip: '눈 쌓인 메타세쿼이아 숲이 절경이에요.',
      image: 'city_06_snowy.jpg',
    },
  },
  city_07: {
    맑음: {
      name: '무등산',
      tip: '맑은 날 정상에서 보는 풍경이 일품이에요.',
      image: 'city_07_sunny.jpg',
    },
    흐림: {
      name: '국립아시아문화전당',
      tip: '흐린 날엔 전시 관람하기 좋아요.',
      image: 'city_07_cloudy.jpg',
    },
    비: {
      name: '광주비엔날레전시관',
      tip: '비 오는 날엔 미술관 나들이를 추천해요.',
      image: 'city_07_rainy.jpg',
    },
    눈: {
      name: '사직공원 전망대',
      tip: '눈 내린 시내 야경이 아름다워요.',
      image: 'city_07_snowy.jpg',
    },
  },
  city_08: {
    맑음: {
      name: '대왕암공원',
      tip: '맑은 날 바다 절경을 만끽하세요.',
      image: 'city_08_sunny.jpg',
    },
    흐림: {
      name: '태화강국가정원',
      tip: '흐린 날 강변 산책로 걷기 좋아요.',
      image: 'city_08_cloudy.jpg',
    },
    비: {
      name: '울산대공원 실내식물원',
      tip: '비 오는 날엔 온실 나들이를 추천해요.',
      image: 'city_08_rainy.jpg',
    },
    눈: {
      name: '간절곶',
      tip: '눈 내린 해돋이 명소도 색다른 매력이 있어요.',
      image: 'city_08_snowy.jpg',
    },
  },
  city_09: {
    맑음: {
      name: '협재해수욕장',
      tip: '맑은 날 에메랄드빛 바다를 즐겨보세요.',
      image: 'city_09_sunny.jpg',
    },
    흐림: {
      name: '오설록티뮤지엄',
      tip: '흐린 날엔 차 한 잔과 함께 여유를 즐겨보세요.',
      image: 'city_09_cloudy.jpg',
    },
    비: {
      name: '제주도립미술관',
      tip: '비 오는 날엔 실내 미술관이 딱이에요.',
      image: 'city_09_rainy.jpg',
    },
    눈: {
      name: '한라산 눈꽃산행',
      tip: '눈 덮인 한라산은 겨울에만 볼 수 있는 절경이에요.',
      image: 'city_09_snowy.jpg',
    },
  },
  city_10: {
    맑음: {
      name: '경포해변',
      tip: '맑은 날 해변 드라이브 코스로 최고예요.',
      image: 'city_10_sunny.jpg',
    },
    흐림: {
      name: '강릉커피거리',
      tip: '흐린 날엔 카페 투어하기 좋아요.',
      image: 'city_10_cloudy.jpg',
    },
    비: {
      name: '강릉시립미술관',
      tip: '비 오는 날엔 미술관 관람을 추천해요.',
      image: 'city_10_rainy.jpg',
    },
    눈: {
      name: '대관령 눈꽃마을',
      tip: '겨울 강릉의 대표 설경 명소예요.',
      image: 'city_10_snowy.jpg',
    },
  },
}

// 반응형 상태 관리
const searchQuery = ref('')
const selectedCityInfo = ref(null) // 선택된 도시의 "객체 전체" (null = 선택 안 함)

const statusOrder = ['맑음', '흐림', '비', '눈']
const statusFilter = ref(null) // null = 전체 보기, 아니면 '맑음'/'흐림'/'비'/'눈' 중 하나

// computed
// 1) 검색어만 반영한 목록 (통계 칩 계산용 기준 — 필터 칩을 눌러도 이 목록은 줄어들지 않음)
const searchFilteredList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

// 2) 검색어 + 날씨 필터를 함께 적용한 목록 (카드 렌더링용)
const filteredWeatherList = computed(() =>
  searchFilteredList.value.filter(
    (city) => !statusFilter.value || city.status === statusFilter.value,
  ),
)

// 선택된 도시 + 현재 status에 맞는 추천 관광지 (없으면 null)
const recommendedAttraction = computed(() => {
  if (!selectedCityInfo.value) return null
  const cityAttractions = attractionMap[selectedCityInfo.value.id]
  return cityAttractions ? cityAttractions[selectedCityInfo.value.status] : null
})

// 검색어만 반영한 목록(searchFilteredList) 기준으로 상태별 도시 수 집계
const weatherStatusCounts = computed(() => {
  const counts = { 맑음: 0, 흐림: 0, 비: 0, 눈: 0 }
  for (const city of searchFilteredList.value) counts[city.status] += 1
  return counts
})

// weatherStatusCounts에서 파생된 2차 지표: 실내 관광지 추천이 필요한 도시 수
const indoorRecommendedCount = computed(
  () => weatherStatusCounts.value['비'] + weatherStatusCounts.value['눈'],
)

// watch / watchEffect
watch(selectedCityInfo, (newCity, oldCity) => {
  const toLabel = (city) =>
    city ? `"${city.name}"이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
  console.log(`[watch] 선택 상태 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(indoorRecommendedCount, (newCount, oldCount) => {
  console.log(`[watch] 실내 관광 추천이 필요한 도시 수 변경: ${oldCount} -> ${newCount}`)
})

// 이벤트 핸들러 (자식 컴포넌트가 emit 하는 이벤트를 여기서 받아 처리)
function updateSearchQuery(value) {
  searchQuery.value = value
}

function toggleStatusFilter(status) {
  statusFilter.value = statusFilter.value === status ? null : status
}

function clearStatusFilter() {
  statusFilter.value = null
}

function clearSearch() {
  searchQuery.value = ''
  statusFilter.value = null
}

function selectCity(city) {
  selectedCityInfo.value = city
}

function showDetail(city) {
  const attraction = attractionMap[city.id]?.[city.status]
  const attractionText = attraction ? ` 오늘 같은 날엔 [${attraction.name}] 어때요?` : ''
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.${attractionText}`)
}

// 카드 렌더링에 필요한 도시별 관광지 정보(attraction)를 미리 계산해 자식에게 넘겨준다
function attractionOf(city) {
  return attractionMap[city.id]?.[city.status] ?? null
}
</script>

<template>
  <div class="page-bg">
    <div class="hero-band">
      <div class="hero-inner">
        <p class="eyebrow">Weather Mockup</p>
        <h1>오늘, 어디로 떠나볼까요?</h1>
        <p class="sub">도시를 검색하거나 카드를 눌러 날씨와 추천 관광지를 확인해보세요.</p>
      </div>
    </div>

    <div class="content-area">
      <!-- 검색 패널: 공통 디자인은 BaseDashboardCard, 내용은 SearchBar -->
      <BaseDashboardCard>
        <template #header>도시 검색</template>
        <SearchBar
          :search-query="searchQuery"
          @update-query="updateSearchQuery"
          @reset="clearSearch"
        />
      </BaseDashboardCard>

      <!-- 선택 안내 문구 + 추천 관광지 히어로 카드 -->
      <RecommendedAttraction
        :selected-city-info="selectedCityInfo"
        :recommended-attraction="recommendedAttraction"
      />

      <!-- 목록 패널: 공통 디자인은 BaseDashboardCard, 내용은 필터 칩 + 날씨 카드 리스트 -->
      <BaseDashboardCard>
        <template #header>
          지역별 날씨 현황
          <WeatherStatusFilter
            :status-order="statusOrder"
            :weather-status-counts="weatherStatusCounts"
            :status-filter="statusFilter"
            @toggle-filter="toggleStatusFilter"
          />
        </template>

        <WeatherStatusHints
          :indoor-recommended-count="indoorRecommendedCount"
          :status-filter="statusFilter"
          @clear-filter="clearStatusFilter"
        />

        <div class="card-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            :selected="!!selectedCityInfo && selectedCityInfo.id === city.id"
            :attraction="attractionOf(city)"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </div>

        <p class="empty" v-if="filteredWeatherList.length === 0">조건에 맞는 도시가 없습니다.</p>
      </BaseDashboardCard>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

/* ---------- 배경 구조: 히어로만 남색, 나머지는 연한 회색 캔버스 ---------- */
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
  --line: #dbe3fb;
  --accent: #1d427d;
  --accent-soft: #e7edfe;
  --hot: #e06a4e;
  --cool: #1d427d;
  --btn-accent: #b8c0cb;

  --panel-bg: #ffffff;
  --panel-line: #e2e6f0;

  --accent-sunny: #ffe0c2;
  --accent-cloudy: #fff0b8;
  --accent-rainy: #d8efc5;
  --accent-snowy: #c9e8f5;

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
  padding: 40px 16px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .hero-inner {
    max-width: 880px;
    padding: 56px 32px 44px;
  }
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
    max-width: 880px;
    padding: 32px 32px 90px;
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
  font-size: 27px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.hero-inner .sub {
  font-size: 14px;
  color: #b7c3e8;
  margin: 0;
}

/* ---------- 날씨 카드 목록 컨테이너 (개별 카드 디자인은 WeatherCard.vue) ---------- */
.card-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 900px) {
  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
}
.empty {
  text-align: center;
  color: var(--sub);
  font-size: 13px;
  padding: 24px 0 6px;
}
</style>
