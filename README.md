# 날씨 (Weather) Mockup — Vue 3 실습

같은 날씨 서비스를 실습 회차별로 점점 고도화하는 과제입니다. 최종 제출 코드는 하나(`WeatherMockup.vue`)지만, 이 README는 **어떤 실습에서 어떤 요구사항을 구현했는지**를 회차별로 정리한 문서입니다.

---

## 실습 1: Weather Mockup (Vue Syntax)

기본 디렉티브(v-for, v-if, v-model, 이벤트)를 익히는 회차입니다.

### 1. 배열 렌더링 (v-for)

- `weatherList`라는 `ref` 배열에 날씨 데이터를 담고 `v-for="city in ..."`로 카드를 반복 출력했습니다.
- 각 카드에는 `:key="city.id"`를 바인딩해 고유 id를 key로 사용했습니다.

### 2. 조건부 렌더링 (v-if)

- 기온이 25도 이상이면 `🔥 더움 (25도 이상)`, 25도 미만이면 `❄️ 선선함 (25도 미만)` 배지를 `v-if` / `v-else`로 분기해서 붙였습니다.

```html
<span v-if="city.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
<span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
```

### 3. 양방향 바인딩 및 한글 처리

- 도시 이름을 한글로 검색하는 input을 `v-model`로 구현했습니다.
- 앞뒤 공백(trim)은 input에서 직접 처리하지 않고, **필터링하는 시점(computed 내부)**에서만 처리했습니다. `v-model.trim`처럼 `input` 이벤트에서 DOM 값을 직접 덮어쓰는 방식은 한글(IME) 조합 입력과 충돌해 타이핑 중 글자가 어긋나는 문제가 있었기 때문입니다.

### 4. 이벤트 및 수식어

- 지역별 날씨 현황 카드를 클릭하면 상태바에 `"{도시}이 선택되었습니다."`가 표시됩니다.
- 카드 내부의 `[상세보기]` 버튼을 누르면 `@click.stop`으로 카드 클릭(선택) 이벤트로의 버블링을 막고, 해당 도시의 날씨 내용만 `window.alert`로 단독으로 띄웁니다.

```js
function showDetail(cityName, status) {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
```

```html
<button class="detail-btn" @click.stop="showDetail(city.name, city.status)">상세보기</button>
```

### 5. 본인만의 데이터 및 추가 구현

- **데이터 10개로 확장**: 서울, 수원, 부산, 인천, 대구, 대전, 광주, 울산, 제주, 강릉까지 총 10개 도시 데이터를 기본값으로 채워 넣었습니다.
- **name / temp / status 외 추가 필드**: `humidity`(습도), `windSpeed`(풍속), `icon`(날씨 아이콘)을 추가해 카드에 같이 표시했습니다.

  ```js
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 45, windSpeed: 2.1, icon: '☀️' }
  ```

- **추가로 사용한 디렉티브**

  | 디렉티브                  | 사용 위치      | 설명                                                        |
  | ------------------------- | -------------- | ----------------------------------------------------------- |
  | `v-show`                  | 검색 힌트 문구 | 검색어가 있을 때만 "검색 중인 도시: ○○" 문구를 노출         |
  | `v-bind:class` (`:class`) | 카드           | 선택된 카드에 `selected` 클래스를 동적으로 붙여 테두리 강조 |
  | `v-bind:title` (`:title`) | 카드           | 마우스를 올리면 툴팁이 뜨도록 속성 바인딩                   |
  | `v-on:click` (`@click`)   | 초기화 버튼    | 클릭 시 검색어를 빈 문자열로 초기화                         |

- **기타**: 검색어 초기화 버튼, `@media (min-width: 900px)` 반응형 레이아웃(넓은 화면에서 폭 확장 + 카드 2열 그리드)

---

## 실습 2: Weather Composition (Composition API)

Composition API의 반응형 상태/`computed`/`watch`·`watchEffect`를 익히는 회차입니다. 실습 1의 UI와 데이터를 그대로 이어받아, 아래 요구사항을 추가로 구현했습니다.

### 1. 반응형 상태 관리 (1일차 동일)

검색어(`searchQuery`), 선택된 도시(`selectedCityInfo`), 지역별 날씨 데이터 배열(`weatherList`)을 반응형 상태로 정의했습니다.

```js
const weatherList = ref([...])       // 지역별 날씨 데이터 배열
const searchQuery = ref('')          // 검색어
const selectedCityInfo = ref(null)   // 선택된 도시 "객체 전체" (null = 미선택)
```

> 실습 1에서는 `selectedCity`에 도시 **이름(문자열)**만 저장했지만, 실습 2에서는 `selectedCityInfo`에 도시 **객체 전체**를 저장하도록 바꿨습니다. (요구사항 명칭이 `selectedCityInfo`인 것도 이유지만, 객체를 들고 있으면 이후 다른 필드도 바로 참조할 수 있어 확장성이 좋습니다.)

### 2. 검색 도시 (computed 활용)

전체 날씨 리스트 중에서 사용자가 입력한 검색어가 도시 이름에 포함된 항목만 필터링해 `computed` 배열(`filteredWeatherList`)에 담았습니다.

```js
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})
```

### 3. 반응형 변수 변화 감시 (watch, watchEffect)

- **`selectedCityInfo` 감시 (`watch` 이용)**: 상태바 문구가 바뀔 때마다 콘솔로그를 작성합니다.

  ```js
  watch(selectedCityInfo, (newCity, oldCity) => {
    const toLabel = (city) =>
      city ? `"${city.name}"이 선택되었습니다.` : '카드를 클릭하거나 검색해 보세요.'
    console.log(`[watch] 상태바 문구 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
  })
  ```

- **`searchQuery` 감시 (`watchEffect` 이용)**: 도시 검색어를 타이핑할 때마다 변하는 `searchQuery`를 추적해 콘솔로그를 작성합니다.

  ```js
  watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
  })
  ```

### 4. 검색 결과 표시 (Template 영역)

`filteredWeatherList` computed 하나로 아래 3가지 케이스를 모두 처리했습니다.

- 검색어가 비었을 때 → 원본 데이터(`weatherList`) 그대로 출력
- 검색어와 일치하는 데이터가 있을 때 → 해당 데이터만 출력
- 검색어와 일치하는 데이터가 없을 때 → 안내 문구 출력

```html
<p class="empty" v-if="filteredWeatherList.length === 0">
  "{{ searchQuery }}" 검색 결과가 일치하는 도시가 없습니다.
</p>
```

### 5. 본인만의 반응형 상태 변수, Computed, Watcher

처음에는 "카드 선택 횟수", "더운 도시 개수", "즐겨찾기"처럼 서비스(날씨 → 관광지 추천) 목적과 크게 관련 없거나 부가 기능에 가까운 것들로 채웠는데, 최종적으로는 **지역별 날씨 현황 위 통계 칩을 그대로 클릭 가능한 날씨 필터로 활용**하는 방향으로 정리했습니다. 통계를 "보여주기"만 하는 게 아니라 "필터링에 실제로 쓰이는 상태"로 만든 것입니다.

| 종류            | 이름                                 | 설명                                                                                                                                |
| --------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 반응형 상태     | `statusFilter`                       | `☀️`/`🌥️`/`🌧️`/`❄️` 통계 칩 중 하나를 누르면 해당 날씨인 도시만 걸러서 봄. 다시 누르면 전체 보기로 해제                             |
| Computed        | `weatherStatusCounts`                | 현재 검색+필터 결과(`filteredWeatherList`) 안에서 맑음/흐림/비/눈 상태별 도시 수를 집계 — "지역 10개 중 어떤 날씨가 몇 곳인지" 통계 |
| Computed (파생) | `indoorRecommendedCount`             | `weatherStatusCounts`의 비+눈 값을 더해 "실내 관광지 추천이 필요한 도시 수"로 재해석 — 관광지 추천 기능과 직접 연결되는 지표        |
| Watcher         | `watch(indoorRecommendedCount, ...)` | 검색어나 날씨 필터가 바뀌어 목록이 달라질 때마다, 실내 추천 도시 수가 어떻게 바뀌는지 콘솔로그 작성                                 |

```js
// 반응형 상태: 날씨 필터 (통계 칩을 누르면 토글됨)
const statusFilter = ref(null) // null = 전체 보기

function toggleStatusFilter(status) {
  statusFilter.value = statusFilter.value === status ? null : status
}

// 검색어 + 날씨 필터를 함께 적용
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  return weatherList.value.filter((city) => {
    const matchesKeyword = !keyword || city.name.includes(keyword)
    const matchesStatus = !statusFilter.value || city.status === statusFilter.value
    return matchesKeyword && matchesStatus
  })
})

// computed: 상태별 도시 수 집계
const weatherStatusCounts = computed(() => {
  const counts = { 맑음: 0, 흐림: 0, 비: 0, 눈: 0 }
  for (const city of filteredWeatherList.value) counts[city.status] += 1
  return counts
})

// computed(파생): 실내 관광지 추천이 필요한 도시 수
const indoorRecommendedCount = computed(
  () => weatherStatusCounts.value['비'] + weatherStatusCounts.value['눈'],
)

// watcher: 검색/필터로 목록이 바뀌어 indoorRecommendedCount가 달라질 때마다 로그
watch(indoorRecommendedCount, (newCount, oldCount) => {
  console.log(`[watch] 실내 관광 추천이 필요한 도시 수 변경: ${oldCount} -> ${newCount}`)
})
```

화면에는 지역별 날씨 현황 제목 옆에 `☀️ 3 · 🌥️ 3 · 🌧️ 2 · ❄️ 2` 통계 칩이 있고, 이 칩 자체가 필터 버튼입니다. 필터가 걸려 있으면 그 아래에 "OO인 도시만 보고 있어요 · 전체 보기" 안내가 뜨고, `🏠 지금 N곳은 비·눈이 와서 실내 관광지를 추천드려요.` 안내는 필터/검색 결과에 맞춰 실시간으로 갱신됩니다.

### 상태바 노출 방식 변경

기존에는 도시를 선택하면 상태바에 `"OO"이 선택되었습니다.` 문구가 떴는데, 바로 아래에 있는 추천 관광지 히어로 카드가 이미 어떤 도시가 선택됐는지 보여주기 때문에 문구가 중복이었습니다. 그래서 **아무것도 선택하지 않았을 때만** "카드를 클릭하거나 검색해 보세요." 안내를 보여주고, 도시를 선택하면 이 영역 자체가 사라지도록 바꿨습니다.

```html
<div class="status-bar status-bar--muted" v-if="!selectedCityInfo">
  카드를 클릭하거나 검색해 보세요.
</div>
```

---

## 보너스: 날씨 기반 관광지 추천

지역(도시) 데이터와 날씨 데이터를 결합해서, 선택한 도시의 **현재 날씨에 맞는 관광지를 추천**하는 기능을 추가했습니다.

### status를 4종으로 확정

관광지 추천 데이터를 만들기 전에, `status` 값을 **맑음 / 흐림 / 비 / 눈** 4가지로 확정했습니다. (기존에 있던 "구름"은 흐림·눈 등으로 재배치)

### 관광지 데이터: 도시(10) × status(4) = 40개

도시마다 4가지 날씨 상황에 맞는 관광지를 하나씩 매핑해, 총 40개의 추천 데이터를 만들었습니다.

```js
const attractionMap = {
  city_01: {
    맑음: { name: '경복궁', tip: '맑은 날엔 근정전 앞마당이 사진 명소예요.' },
    흐림: { name: '국립중앙박물관', tip: '흐린 날엔 넓은 상설전시관을 여유롭게 둘러보세요.' },
    비: { name: '코엑스몰', tip: '비 오는 날엔 실내 쇼핑·전시 공간이 최고예요.' },
    눈: { name: '남산서울타워', tip: '눈 내린 밤 남산 야경이 정말 예뻐요.' },
  },
  // ... city_02 ~ city_10 동일 구조
}
```

### 구현 방식: 모달 팝업 대신 상태바 아래 상시 패널

`상세보기` 버튼은 요구사항대로 `window.alert`를 그대로 유지하되, 추천 관광지가 있으면 한 줄을 덧붙이도록 했습니다.

```js
function showDetail(city) {
  const attraction = attractionMap[city.id]?.[city.status]
  const attractionText = attraction ? ` 오늘 같은 날엔 [${attraction.name}] 어때요?` : ''
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.${attractionText}`)
}
```

이와 별개로, 카드를 클릭해 도시를 선택하면 **상태바 바로 아래에 추천 관광지 패널이 상시 노출**되도록 했습니다. `position: fixed` 오버레이를 쓰는 진짜 모달 팝업은 배경 클릭 닫기·z-index 관리 등이 추가로 필요해 지금 배운 디렉티브 범위를 넘어서기 때문에, 이번 단계에서는 `v-if` + `computed`만으로 구현 가능한 패널 방식을 선택했습니다. (모달은 이후 컴포넌트 분리/Teleport를 배우는 실습에서 업그레이드하기 좋은 지점입니다.)

```js
const recommendedAttraction = computed(() => {
  if (!selectedCityInfo.value) return null
  const cityAttractions = attractionMap[selectedCityInfo.value.id]
  return cityAttractions ? cityAttractions[selectedCityInfo.value.status] : null
})
```

```html
<div class="recommend-box" v-if="recommendedAttraction">
  <p class="recommend-title">
    📍 {{ selectedCityInfo.name }}이(가) 지금 <strong>{{ selectedCityInfo.status }}</strong>일 때
    추천 관광지
  </p>
  <p class="recommend-name">{{ recommendedAttraction.name }}</p>
  <p class="recommend-tip">{{ recommendedAttraction.tip }}</p>
</div>
```

---

## 디자인 리뉴얼 & 관광지 이미지

### 이미지 폴더 구조

관광지 이미지는 `public/attractions/` 폴더에 넣도록 설계했습니다. Vite 프로젝트에서 `public/` 폴더에 넣은 파일은 빌드 시 그대로 복사되고, 코드에서 `import` 없이 `/attractions/파일명.jpg`처럼 절대경로 문자열로 바로 참조할 수 있어서 40장 가까운 이미지를 다룰 때 가장 간단합니다.

```
public/
└── attractions/
    ├── city_01_sunny.jpg   # 서울 · 맑음
    ├── city_01_cloudy.jpg  # 서울 · 흐림
    ├── city_01_rainy.jpg   # 서울 · 비
    ├── city_01_snowy.jpg   # 서울 · 눈
    ├── city_02_sunny.jpg
    ├── ...
    └── city_10_snowy.jpg   # 총 10개 도시 × 4개 status = 40장
```

지금 각 도시에 지정된 status(예: 서울=맑음, 제주=비)에 해당하는 **10장만 넣어도** 화면에서 바로 보입니다. 나머지 30장은 이후 "날씨가 바뀌는" 기능을 만들 때를 대비해 데이터 구조만 미리 채워둔 것입니다.

### 이미지가 없을 때: 자동 placeholder

`public/attractions/`에 아직 파일을 넣지 않았어도 레이아웃이 깨지지 않도록, `<img>`의 `@error` 이벤트를 활용해 이미지 로드에 실패하면 자동으로 [picsum.photos](https://picsum.photos) placeholder 사진으로 대체되게 만들었습니다. 관광지 이름별로 항상 같은 seed를 사용해서, 같은 관광지는 새로고침해도 같은 placeholder 사진이 나옵니다.

```js
function handleImageError(event, seedText) {
  const seed = encodeURIComponent(seedText || 'weather-mockup')
  event.target.onerror = null // 무한 루프 방지
  event.target.src = `https://picsum.photos/seed/${seed}/640/420`
}
```

나중에 진짜 사진을 위 표의 파일명 그대로 `public/attractions/`에 넣기만 하면, **코드 수정 없이** 자동으로 실제 사진이 표시됩니다.

### 디자인 리뉴얼 포인트

- Pretendard 가변 폰트를 CDN으로 로드해 타이포그래피 정돈
- 상단에 히어로 헤더(`hero-header`)를 추가해 페이지 성격을 한눈에 전달
- 추천 관광지 영역을 배경 이미지 + 그라데이션 오버레이가 있는 **히어로 카드**로 재구성
- 지역별 날씨 카드에 관광지 썸네일(76×76) 추가, status별로 카드 왼쪽에 색상 강조선(맑음=주황, 흐림=회색, 비=파랑, 눈=하늘색)
- 그림자·라운드·hover 시 살짝 떠오르는 인터랙션 등 전반적인 톤앤매너를 다듬음

---

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 후 확인할 수 있습니다.

## 파일 구조

```
src/
└── components/
    └── exam/
        └── WeatherMockup.vue   # 날씨 Mockup 컴포넌트 (실습 1 + 실습 2 요구사항 통합)
```
