<template>
  <div class="page-bg">
    <div class="weather-mockup">
      <header class="hero-header">
        <p class="eyebrow">Weather Mockup</p>
        <h1>오늘, 어디로 떠나볼까요?</h1>
        <p class="sub">도시를 검색하거나 카드를 눌러 날씨와 추천 관광지를 확인해보세요.</p>
      </header>

      <div class="panel panel-search">
        <h2>도시 검색</h2>
        <div class="search-row">
          <div class="search-field">
            <span class="search-icon">⌕</span>
            <input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력 (한글)" />
          </div>
          <!-- v-on(@click) 기본 디렉티브 예시: 검색어 초기화 -->
          <button class="reset-btn" @click="clearSearch">초기화</button>
        </div>
        <p class="search-hint" v-show="searchQuery">
          검색 중인 도시: <strong>{{ searchQuery }}</strong>
        </p>
      </div>

      <!-- 아무것도 선택하지 않았을 때만 안내 문구 노출. 선택하면 아래 추천 카드가 그 역할을 대신함 -->
      <div class="status-bar status-bar--muted" v-if="!selectedCityInfo">
        카드를 클릭하거나 검색해 보세요.
      </div>

      <!-- 선택된 도시의 현재 날씨에 맞는 추천 관광지 (히어로 카드) -->
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

      <div class="panel panel-list">
        <h2>
          지역별 날씨 현황
          <span class="stats-group">
            <button
              v-for="status in statusOrder"
              :key="status"
              type="button"
              class="stat-chip"
              :class="{ active: statusFilter === status }"
              @click="toggleStatusFilter(status)"
            >
              {{ statusIcon(status) }} {{ weatherStatusCounts[status] }}
            </button>
          </span>
        </h2>

        <!-- computed(weatherStatusCounts)에서 파생된 2차 지표: 실내 관광지 추천이 필요한 도시 수 -->
        <p class="indoor-hint" v-if="indoorRecommendedCount > 0">
          지금 <strong>{{ indoorRecommendedCount }}곳</strong>은 비·눈이 와서 실내 관광지를
          추천드려요.
        </p>

        <p class="filter-hint" v-if="statusFilter">
          {{ statusIcon(statusFilter) }} <strong>{{ statusFilter }}</strong
          >인 도시만 보고 있어요.
          <button type="button" class="filter-clear" @click="statusFilter = null">전체 보기</button>
        </p>

        <div class="card-grid">
          <div
            v-for="city in filteredWeatherList"
            :key="city.id"
            class="card"
            :class="[
              { selected: selectedCityInfo && selectedCityInfo.id === city.id },
              statusAccentClass(city.status),
            ]"
            :title="`${city.name} 카드를 클릭하면 선택돼요`"
            @click="selectCity(city)"
          >
            <img
              class="card-thumb"
              :src="attractionImageSrc(attractionMap[city.id][city.status].image)"
              :alt="attractionMap[city.id][city.status].name"
              @error="handleImageError($event, attractionMap[city.id][city.status].image)"
            />

            <div class="card-body">
              <div class="card-top">
                <span class="card-title">
                  {{ city.icon }} {{ city.name }}
                  <span class="card-status">{{ city.status }}</span>
                </span>
                <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
              </div>

              <div class="meta">
                <span
                  >온도: {{ city.temp }}°C · 습도: {{ city.humidity }}% · 풍속:
                  {{ city.windSpeed }}m/s</span
                >
              </div>

              <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
              <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
            </div>
          </div>
        </div>

        <!-- 검색어/필터와 일치하는 데이터가 없을 때 안내 -->
        <p class="empty" v-if="filteredWeatherList.length === 0">조건에 맞는 도시가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

/* =========================================================
 * 실습 1: 배열 렌더링(v-for)용 기본 데이터 10개
 *   name, temp, status 외에 humidity(습도), windSpeed(풍속), icon(아이콘) 추가
 *   status는 맑음/흐림/비/눈 4종으로 확정
 * ========================================================= */
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

/* =========================================================
 * 관광지 추천 데이터: 도시(10) × status(4) = 40개
 *   image는 public/attractions/ 안에 넣을 파일명 (없으면 자동 placeholder로 대체됨)
 * ========================================================= */
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

/* =========================================================
 * 실습 2 - 1) 반응형 상태 관리
 * ========================================================= */
const searchQuery = ref('')
const selectedCityInfo = ref(null) // 선택된 도시의 "객체 전체"를 담음 (null = 선택 안 함)

/* =========================================================
 * 실습 2 - 5) 본인만의 반응형 상태 변수
 *   지역별 날씨 현황 위 통계 칩을 눌러 날씨별로 목록을 필터링
 * ========================================================= */
const statusOrder = ['맑음', '흐림', '비', '눈']
const statusFilter = ref(null) // null = 전체 보기, 아니면 '맑음'/'흐림'/'비'/'눈' 중 하나

function toggleStatusFilter(status) {
  statusFilter.value = statusFilter.value === status ? null : status
}

function statusIcon(status) {
  const map = { 맑음: '☀️', 흐림: '🌥️', 비: '🌧️', 눈: '❄️' }
  return map[status] ?? ''
}

/* =========================================================
 * 실습 2 - 2) 검색 도시 (computed 활용)
 *   검색어 + 날씨 필터(statusFilter)를 함께 적용
 * ========================================================= */
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  return weatherList.value.filter((city) => {
    const matchesKeyword = !keyword || city.name.includes(keyword)
    const matchesStatus = !statusFilter.value || city.status === statusFilter.value
    return matchesKeyword && matchesStatus
  })
})

// 선택된 도시 + 현재 status에 맞는 추천 관광지 (없으면 null)
const recommendedAttraction = computed(() => {
  if (!selectedCityInfo.value) return null
  const cityAttractions = attractionMap[selectedCityInfo.value.id]
  return cityAttractions ? cityAttractions[selectedCityInfo.value.status] : null
})

/* =========================================================
 * 실습 2 - 3) 반응형 변수 변화 감시 (watch, watchEffect)
 * ========================================================= */
watch(selectedCityInfo, (newCity, oldCity) => {
  const toLabel = (city) =>
    city ? `"${city.name}"이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
  console.log(`[watch] 선택 상태 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

/* =========================================================
 * 실습 2 - 5) 본인만의 Computed / Watcher
 *   (서비스에 실제로 의미있는 지표로 구성)
 * ========================================================= */

// computed: 현재 검색+필터 결과(filteredWeatherList) 안에서 상태별 도시 수를 집계
// -> "지금 목록 안에서 맑음/흐림/비/눈이 각각 몇 곳인지" 통계
const weatherStatusCounts = computed(() => {
  const counts = { 맑음: 0, 흐림: 0, 비: 0, 눈: 0 }
  for (const city of filteredWeatherList.value) {
    counts[city.status] += 1
  }
  return counts
})

// computed(파생): weatherStatusCounts를 활용한 2차 지표
// -> 비/눈인 도시는 실내 관광지를 추천하므로, "실내 관광지 추천이 필요한 도시 수"로 재해석
const indoorRecommendedCount = computed(
  () => weatherStatusCounts.value['비'] + weatherStatusCounts.value['눈'],
)

// watcher: 검색어나 날씨 필터가 바뀌어 indoorRecommendedCount가 달라질 때마다 콘솔로그
watch(indoorRecommendedCount, (newCount, oldCount) => {
  console.log(`[watch] 실내 관광 추천이 필요한 도시 수 변경: ${oldCount} -> ${newCount}`)
})

/* =========================================================
 * 이벤트 핸들러
 * ========================================================= */
function selectCity(city) {
  selectedCityInfo.value = city
}

function clearSearch() {
  searchQuery.value = ''
  statusFilter.value = null
}

function showDetail(city) {
  const attraction = attractionMap[city.id]?.[city.status]
  const attractionText = attraction ? ` 오늘 같은 날엔 [${attraction.name}] 어때요?` : ''
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.${attractionText}`)
}

/* =========================================================
 * 이미지 관련 헬퍼
 * ========================================================= */
function attractionImageSrc(imageFileName) {
  return `/attractions/${imageFileName}`
}

function handleImageError(event, seedText) {
  const seed = encodeURIComponent(seedText || 'weather-mockup')
  event.target.onerror = null
  event.target.src = `https://picsum.photos/seed/${seed}/640/420`
}

function statusAccentClass(status) {
  const map = {
    맑음: 'accent-sunny',
    흐림: 'accent-cloudy',
    비: 'accent-rainy',
    눈: 'accent-snowy',
  }
  return map[status] ?? ''
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

/* ---------- 풀블리드 배경 래퍼 ---------- */
.page-bg {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: radial-gradient(
    circle at 15% 0%,
    rgba(75, 112, 184, 0.9) 0%,
    rgba(46, 71, 133, 0.6) 45%,
    rgba(30, 50, 104, 0.5) 100%
  );
}

.weather-mockup {
  --card-bg: #ffffff;
  --ink: #101830;
  --sub: #64708a;
  --line: #dbe3fb;
  --accent: #1d427d;
  --accent-soft: #e7edfe;
  --hot: #e06a4e;
  --cool: #1d427d;
  --btn-accent: #b8c0cb;

  --panel-bg: #f4f7ff;
  --panel-line: #e0e7fb;

  --accent-sunny: #ffe0c2;
  --accent-cloudy: #fff0b8;
  --accent-rainy: #d8efc5;
  --accent-snowy: #c9e8f5;

  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 16px 60px;
  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink);
  letter-spacing: -0.01em;
}

@media (min-width: 900px) {
  .weather-mockup {
    max-width: 880px;
    padding: 48px 32px 90px;
  }
}

/* ---------- 헤더 (네이비 배경 위에 직접 놓임) ---------- */
.hero-header {
  margin-bottom: 24px;
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
.hero-header h1 {
  font-size: 27px;
  font-weight: 800;
  margin: 0 0 6px;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.hero-header .sub {
  font-size: 14px;
  color: #b7c3e8;
  margin: 0;
}

/* ---------- 패널 공통 ---------- */
.panel {
  border-radius: 22px;
  padding: 22px;
  margin-bottom: 18px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-line);
  box-shadow: 0 14px 32px rgba(6, 10, 30, 0.28);
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
.indoor-hint {
  font-size: 14px;
  color: #315b91;
  background: #eaf5fc;
  border: 1px solid #b8d8ee;
  border-radius: 12px;
  padding: 14px 14px;
  margin: 0 0 10px;
}
.filter-hint {
  font-size: 14px;
  color: var(--sub);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-hint strong {
  color: var(--ink);
}
.filter-clear {
  border: 1px solid var(--btn-accent);
  background: #ffffff;
  color: var(--sub);
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  padding: 4px 10px;
  cursor: pointer;
}
.filter-clear:hover {
  background: var(--btn-accent);
  color: #fff;
}

/* ---------- 검색 ---------- */
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

/* ---------- 상태바 ---------- */
.status-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  text-align: center;
  border-radius: 14px;
  padding: 20px 14px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}
.status-bar--muted {
  background: rgba(255, 255, 255, 0.08);
  color: #c3cdec;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-weight: 500;
}

/* ---------- 추천 관광지 히어로 카드 ---------- */
.recommend-box {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 18px;
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 16px 36px rgba(6, 10, 30, 0.35);
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

/* ---------- 카드 (세로형, 큼직하게) ---------- */
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
.card {
  display: flex;
  flex-direction: column;
  background: var(--card-bg);
  border: 1px solid var(--panel-line);
  border-top: 5px solid var(--panel-line);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    border-color 0.15s,
    transform 0.1s;
}
.card:hover {
  box-shadow: 0 10px 26px rgba(6, 10, 30, 0.16);
  transform: translateY(-2px);
}
.card.selected {
  box-shadow: 0 10px 26px rgba(6, 10, 30, 0.16);
}
.card.selected.accent-sunny {
  box-shadow:
    0 0 0 2px var(--accent-sunny),
    0 10px 26px rgba(6, 10, 30, 0.16);
}
.card.selected.accent-cloudy {
  box-shadow:
    0 0 0 2px var(--accent-cloudy),
    0 10px 26px rgba(6, 10, 30, 0.16);
}
.card.selected.accent-rainy {
  box-shadow:
    0 0 0 2px var(--accent-rainy),
    0 10px 26px rgba(6, 10, 30, 0.16);
}
.card.selected.accent-snowy {
  box-shadow:
    0 0 0 2px var(--accent-snowy),
    0 10px 26px rgba(6, 10, 30, 0.16);
}
.accent-sunny {
  border-top-color: var(--accent-sunny);
}
.accent-cloudy {
  border-top-color: var(--accent-cloudy);
}
.accent-rainy {
  border-top-color: var(--accent-rainy);
}
.accent-snowy {
  border-top-color: var(--accent-snowy);
}

.card-thumb {
  width: 100%;
  height: 168px;
  object-fit: cover;
  background: var(--panel-bg);
}
.card-body {
  padding: 16px 18px 18px;
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.card-title {
  font-weight: 700;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.card-status {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--sub);
}
.detail-btn {
  flex-shrink: 0;
  border: 1px solid var(--panel-line);
  background: #fff;
  color: var(--ink);
  border-radius: 9px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.detail-btn:hover {
  background: var(--btn-accent);
  color: #fff;
  border-color: var(--btn-accent);
}
.meta {
  font-size: 13px;
  color: var(--sub);
  margin: 0 0 10px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 11px;
  border-radius: 999px;
  color: #fff;
}
.badge.hot {
  background: var(--hot);
}
.badge.cool {
  background: var(--cool);
}
.empty {
  text-align: center;
  color: var(--sub);
  font-size: 13px;
  padding: 24px 0 6px;
}
</style>
