<template>
  <div class="weather-mockup">
    <h1>🌦️ 날씨 (Mockup)</h1>

    <div class="panel panel-search">
      <h2>🔍 도시 검색</h2>
      <div class="search-row">
        <input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력 (한글)" />
        <!-- v-on(@click) 기본 디렉티브 예시: 검색어 초기화 -->
        <button class="reset-btn" @click="clearSearch">초기화</button>
      </div>
      <p class="search-hint" v-show="searchQuery">검색 중인 도시: {{ searchQuery }}</p>
    </div>

    <div class="status-bar" v-if="selectedCityInfo">
      "{{ selectedCityInfo.name }}"이 선택되었습니다.
      <span class="count-badge">(총 {{ selectionCount }}번 선택함)</span>
    </div>
    <div class="status-bar" v-else>카드를 클릭하거나 검색해 보세요.</div>

    <!-- 선택된 도시의 현재 날씨에 맞는 추천 관광지 -->
    <div class="recommend-box" v-if="recommendedAttraction">
      <p class="recommend-title">
        📍 {{ selectedCityInfo.name }}이(가) 지금 <strong>{{ selectedCityInfo.status }}</strong
        >일 때 추천 관광지
      </p>
      <p class="recommend-name">{{ recommendedAttraction.name }}</p>
      <p class="recommend-tip">{{ recommendedAttraction.tip }}</p>
    </div>

    <div class="panel panel-list">
      <h2>
        📍 지역별 날씨 현황
        <span class="hot-count">🔥 더움 {{ hotCityCount }}곳</span>
      </h2>

      <div class="card-grid">
        <div
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="card"
          :class="{ selected: selectedCityInfo && selectedCityInfo.id === city.id }"
          :title="`${city.name} 카드를 클릭하면 선택돼요`"
          @click="selectCity(city)"
        >
          <div class="card-top">
            <span class="card-title">{{ city.icon }} {{ city.name }} ({{ city.status }})</span>
            <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
          </div>

          <div class="meta">
            <span>현재 기온: {{ city.temp }}°C</span>
            <span>습도: {{ city.humidity }}%</span>
            <span>풍속: {{ city.windSpeed }}m/s</span>
          </div>

          <span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
        </div>
      </div>

      <!-- 검색어와 일치하는 데이터가 없을 때 안내 -->
      <p class="empty" v-if="filteredWeatherList.length === 0">
        "{{ searchQuery }}" 검색 결과가 일치하는 도시가 없습니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

/* =========================================================
 * 실습 1: 배열 렌더링(v-for)용 기본 데이터 10개
 *   name, temp, status 외에 humidity(습도), windSpeed(풍속), icon(아이콘) 추가
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
 *   같은 도시라도 날씨에 따라 다른 관광지를 추천하도록 구성
 * ========================================================= */
const attractionMap = {
  city_01: {
    맑음: { name: '경복궁', tip: '맑은 날엔 근정전 앞마당이 사진 명소예요.' },
    흐림: { name: '국립중앙박물관', tip: '흐린 날엔 넓은 상설전시관을 여유롭게 둘러보세요.' },
    비: { name: '코엑스몰', tip: '비 오는 날엔 실내 쇼핑·전시 공간이 최고예요.' },
    눈: { name: '남산서울타워', tip: '눈 내린 밤 남산 야경이 정말 예뻐요.' },
  },
  city_02: {
    맑음: { name: '수원화성', tip: '성곽 위를 걸으며 맑은 하늘을 즐겨보세요.' },
    흐림: { name: '행궁동 벽화마을', tip: '흐린 날 골목 산책하기 좋아요.' },
    비: { name: '갤러리아광교', tip: '비 오는 날엔 실내 쇼핑몰 나들이 추천이에요.' },
    눈: { name: '광교호수공원', tip: '눈 쌓인 호수 풍경이 아름다워요.' },
  },
  city_03: {
    맑음: { name: '해운대해수욕장', tip: '맑은 날 바다 산책하기 딱 좋아요.' },
    흐림: { name: '감천문화마을', tip: '흐린 날엔 알록달록 골목 구경을 추천해요.' },
    비: { name: '국립해양박물관', tip: '비 오는 날엔 실내 박물관이 좋아요.' },
    눈: { name: '태종대', tip: '부산에 눈이 오면 흔치 않은 설경을 만날 수 있어요.' },
  },
  city_04: {
    맑음: { name: '월미도', tip: '맑은 날 바닷바람 맞으며 산책하기 좋아요.' },
    흐림: { name: '인천차이나타운', tip: '흐린 날엔 골목 구경하며 짜장면 한 그릇 어때요.' },
    비: { name: '파라다이스시티', tip: '비 오는 날엔 실내에서 즐길 거리가 많아요.' },
    눈: { name: '송도센트럴파크', tip: '눈 내린 공원 풍경이 운치있어요.' },
  },
  city_05: {
    맑음: { name: '팔공산', tip: '맑은 날 등산하기 좋은 명산이에요.' },
    흐림: { name: '김광석다시그리기길', tip: '흐린 날 감성 가득한 골목길 산책을 추천해요.' },
    비: { name: '대구근대역사관', tip: '비 오는 날엔 역사관 관람이 딱이에요.' },
    눈: { name: '앞산공원', tip: '눈 덮인 산책로가 조용하고 예뻐요.' },
  },
  city_06: {
    맑음: { name: '대청호반', tip: '맑은 날 호수 둘레길 산책하기 좋아요.' },
    흐림: { name: '대전예술의전당', tip: '흐린 날엔 공연·전시 관람을 추천해요.' },
    비: { name: '국립중앙과학관', tip: '비 오는 날엔 아이와 함께 과학관 나들이 좋아요.' },
    눈: { name: '장태산자연휴양림', tip: '눈 쌓인 메타세쿼이아 숲이 절경이에요.' },
  },
  city_07: {
    맑음: { name: '무등산', tip: '맑은 날 정상에서 보는 풍경이 일품이에요.' },
    흐림: { name: '국립아시아문화전당', tip: '흐린 날엔 전시 관람하기 좋아요.' },
    비: { name: '광주비엔날레전시관', tip: '비 오는 날엔 미술관 나들이를 추천해요.' },
    눈: { name: '사직공원 전망대', tip: '눈 내린 시내 야경이 아름다워요.' },
  },
  city_08: {
    맑음: { name: '대왕암공원', tip: '맑은 날 바다 절경을 만끽하세요.' },
    흐림: { name: '태화강국가정원', tip: '흐린 날 강변 산책로 걷기 좋아요.' },
    비: { name: '울산대공원 실내식물원', tip: '비 오는 날엔 온실 나들이를 추천해요.' },
    눈: { name: '간절곶', tip: '눈 내린 해돋이 명소도 색다른 매력이 있어요.' },
  },
  city_09: {
    맑음: { name: '협재해수욕장', tip: '맑은 날 에메랄드빛 바다를 즐겨보세요.' },
    흐림: { name: '오설록티뮤지엄', tip: '흐린 날엔 차 한 잔과 함께 여유를 즐겨보세요.' },
    비: { name: '제주도립미술관', tip: '비 오는 날엔 실내 미술관이 딱이에요.' },
    눈: { name: '한라산 눈꽃산행', tip: '눈 덮인 한라산은 겨울에만 볼 수 있는 절경이에요.' },
  },
  city_10: {
    맑음: { name: '경포해변', tip: '맑은 날 해변 드라이브 코스로 최고예요.' },
    흐림: { name: '강릉커피거리', tip: '흐린 날엔 카페 투어하기 좋아요.' },
    비: { name: '강릉시립미술관', tip: '비 오는 날엔 미술관 관람을 추천해요.' },
    눈: { name: '대관령 눈꽃마을', tip: '겨울 강릉의 대표 설경 명소예요.' },
  },
}

/* =========================================================
 * 실습 2 - 1) 반응형 상태 관리
 *   검색어(searchQuery), 선택된 도시(selectedCityInfo)를 반응형 상태로 정의
 * ========================================================= */
const searchQuery = ref('')
const selectedCityInfo = ref(null) // 선택된 도시의 "객체 전체"를 담음 (null = 선택 안 함)

/* =========================================================
 * 실습 2 - 2) 검색 도시 (computed 활용)
 *   전체 날씨 리스트 중 searchQuery가 도시 이름에 포함된 항목만 필터링
 * ========================================================= */
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value // 검색어가 비었을 때는 원본 데이터 그대로
  return weatherList.value.filter((city) => city.name.includes(keyword))
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

// selectedCityInfo 감시 (watch 이용)
// -> 상태바 문구가 바뀔 때마다 콘솔로그 작성
watch(selectedCityInfo, (newCity, oldCity) => {
  const toLabel = (city) =>
    city ? `"${city.name}"이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
  console.log(`[watch] 상태바 문구 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
})

// searchQuery 감시 (watchEffect 이용)
// -> 도시 검색어를 타이핑할 때마다 변하는 searchQuery를 추적하여 콘솔로그 작성
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

/* =========================================================
 * 실습 2 - 5) 본인만의 반응형 상태 변수 / Computed / Watcher
 * ========================================================= */

// 본인만의 반응형 상태: 카드를 선택한 누적 횟수
const selectionCount = ref(0)

// 본인만의 computed: 현재 필터링된 목록 중 "더움(25도 이상)" 도시 개수
const hotCityCount = computed(
  () => filteredWeatherList.value.filter((city) => city.temp >= 25).length,
)

// 본인만의 watcher: hotCityCount가 바뀔 때마다(검색으로 목록이 달라질 때) 콘솔로그 작성
watch(hotCityCount, (newCount, oldCount) => {
  console.log(`[watch] 더움(25도 이상) 도시 개수 변경: ${oldCount} -> ${newCount}`)
})

/* =========================================================
 * 이벤트 핸들러
 * ========================================================= */

// 카드 클릭 시 선택된 도시 정보 갱신 + 선택 횟수 누적
function selectCity(city) {
  selectedCityInfo.value = city
  selectionCount.value += 1
}

// 검색어 초기화 (v-on 기본 사용 예시)
function clearSearch() {
  searchQuery.value = ''
}

// 상세보기 버튼: @click.stop 이벤트 수식어로 카드 클릭(selectCity)까지
// 같이 실행되는 버블링을 막고, alert만 단독으로 뜨게 함
// (추천 관광지가 있으면 알림 메시지에 한 줄 덧붙임)
function showDetail(city) {
  const attraction = attractionMap[city.id]?.[city.status]
  const attractionText = attraction ? ` 오늘 같은 날엔 [${attraction.name}] 어때요?` : ''
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.${attractionText}`)
}
</script>

<style scoped>
.weather-mockup {
  --bg-page: #ffffff;
  --card-bg: #ffffff;
  --ink: #1c2b3a;
  --sub: #5b6b7c;
  --line: #dbe6f0;
  --accent: #2f6fed;
  --hot: #e2543b;
  --cool: #2f8ae0;
  --radius: 20px;
  /* 파스텔 패널 색상 */
  --pastel-lavender: #ece8fb;
  --pastel-lavender-line: #d9d2f5;
  --pastel-mint: #e3f7ee;
  --pastel-mint-line: #cdefdd;

  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 16px 60px;
  background: var(--bg-page);
  font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: var(--ink);
}

/* 넓은 화면에서는 폭을 좀 더 여유 있게 */
@media (min-width: 900px) {
  .weather-mockup {
    max-width: 860px;
    padding: 40px 32px 80px;
  }
}
h1 {
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px;
}
.panel {
  border-radius: var(--radius);
  padding: 20px 20px;
  margin-bottom: 16px;
}
.panel-search {
  background: var(--pastel-lavender);
  border: 1px solid var(--pastel-lavender-line);
}
.panel-list {
  background: var(--pastel-mint);
  border: 1px solid var(--pastel-mint-line);
}
.panel h2 {
  font-size: 15px;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.hot-count {
  font-size: 12px;
  font-weight: 500;
  color: var(--hot);
}
.search-row {
  display: flex;
  gap: 8px;
}
input[type='text'] {
  flex: 1;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--pastel-lavender-line);
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  background: #ffffff;
}
input[type='text']:focus {
  border-color: var(--accent);
}
.reset-btn {
  border: none;
  background: #ffffff;
  color: var(--sub);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 13px;
  cursor: pointer;
}
.reset-btn:hover {
  background: #f4f1fd;
  color: var(--ink);
}
.search-hint {
  font-size: 13px;
  color: var(--sub);
  margin: 8px 0 0;
}
.status-bar {
  text-align: center;
  background: #e7f6ec;
  color: #1f7a3d;
  border: 1px solid #bfe6cb;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  margin-bottom: 16px;
}
.count-badge {
  color: #4c9767;
  font-size: 12px;
}
.recommend-box {
  background: #fff2e6;
  border: 1px solid #fcdcb8;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
}
.recommend-title {
  font-size: 13px;
  color: #935e1f;
  margin: 0 0 4px;
}
.recommend-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 4px;
}
.recommend-tip {
  font-size: 13px;
  color: var(--sub);
  margin: 0;
}
.card {
  background: var(--card-bg);
  border: 1px solid var(--pastel-mint-line);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}
@media (min-width: 900px) {
  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .card {
    margin-bottom: 0;
  }
}
.card:hover {
  box-shadow: 0 2px 10px rgba(47, 111, 237, 0.12);
}
.card.selected {
  border-color: var(--accent);
}
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.detail-btn {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
}
.detail-btn:hover {
  background: #f2f6fb;
}
.meta {
  font-size: 13px;
  color: var(--sub);
  margin: 6px 0 8px;
  display: flex;
  gap: 12px;
}
.badge {
  display: inline-block;
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 20px;
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
  padding: 20px 0;
}
</style>
