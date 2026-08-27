# 날씨 (Weather) Mockup — Vue 3 실습

같은 날씨 서비스를 실습 회차별로 고도화하는 과제입니다. 최종 제출 코드는 하나(`WeatherMockup.vue`)지만, 이 README는 **어떤 실습에서 어떤 요구사항을 구현했는지**를 회차별로 정리한 문서입니다.

---

## 실습 1: Weather Mockup (Vue Syntax)

기본 디렉티브(v-for, v-if, v-model, 이벤트)를 익히는 회차

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
  | `v-on:click` (`@click`)   | 초기화 버튼    | 클릭 시 검색어를 빈 문자열로 초기화                         |

---

## 실습 2: Weather Composition (Composition API)

Composition API의 반응형 상태/`computed`/`watch`·`watchEffect`를 익히는 회차

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
    console.log(`[watch] 선택 상태 변경: "${toLabel(oldCity)}" -> "${toLabel(newCity)}"`)
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
<p class="empty" v-if="filteredWeatherList.length === 0">조건에 맞는 도시가 없습니다.</p>
```

### 5. 본인만의 데이터, 반응형 상태 변수, Computed, Watcher

실습 1의 5번(본인만의 데이터 추가)을 실습 2 단계에서 **날씨 기반 관광지 추천 기능**으로 확장하고, 여기에 필요한 반응형 상태/computed/watcher를 같이 구성했습니다.

#### 5-1. 본인만의 데이터: 관광지 추천 데이터 (도시 10 × status 4 = 40개)

관광지 데이터를 만들기 전에 `status` 값을 **맑음 / 흐림 / 비 / 눈** 4가지로 확정했습니다. (기존에 있던 "구름"은 흐림·눈 등으로 재배치) 그리고 도시마다 4가지 날씨 상황에 맞는 관광지를 하나씩 매핑해 총 40개의 추천 데이터를 만들었습니다.

```js
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
  // ... city_02 ~ city_10 동일 구조
}
```

이 데이터를 바탕으로 만든 **`recommendedAttraction` computed**는 선택된 도시(`selectedCityInfo`) + 현재 날씨에 맞는 관광지를 뽑아서, 상태바 아래 추천 관광지 히어로 카드에 보여줍니다.

```js
const recommendedAttraction = computed(() => {
  if (!selectedCityInfo.value) return null
  const cityAttractions = attractionMap[selectedCityInfo.value.id]
  return cityAttractions ? cityAttractions[selectedCityInfo.value.status] : null
})
```

`상세보기` 버튼의 `window.alert`에도 추천 관광지가 있으면 한 줄을 자연스럽게 덧붙였습니다.

```js
function showDetail(city) {
  const attraction = attractionMap[city.id]?.[city.status]
  const attractionText = attraction ? ` 오늘 같은 날엔 [${attraction.name}] 어때요?` : ''
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.${attractionText}`)
}
```

#### 5-2. 본인만의 반응형 상태: `statusFilter` (날씨 필터)

지역별 날씨 현황 위 통계 칩(`☀️`/`🌥️`/`🌧️`/`❄️`)을 그냥 숫자만 보여주는 대신 **클릭 가능한 날씨 필터 버튼**으로 만들었습니다. 하나를 누르면 해당 날씨인 도시만 걸러서 보여주고 다시 누르면 전체 보기로 해제됩니다.

```js
const statusOrder = ['맑음', '흐림', '비', '눈']
const statusFilter = ref(null) // null = 전체 보기

function toggleStatusFilter(status) {
  statusFilter.value = statusFilter.value === status ? null : status
}
```

#### 5-3. 본인만의 Computed: `weatherStatusCounts` → `indoorRecommendedCount`

검색어만 반영한 목록(`searchFilteredList`)을 기준으로 맑음/흐림/비/눈 상태별 도시 수를 집계하고("지역 10개 중 어떤 날씨가 몇 곳인지" 통계), 여기서 비+눈 값을 더해 "실내 관광지 추천이 필요한 도시 수"로 재해석했습니다.

```js
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

// computed: 검색어만 반영한 목록(searchFilteredList) 기준으로 상태별 도시 수 집계
const weatherStatusCounts = computed(() => {
  const counts = { 맑음: 0, 흐림: 0, 비: 0, 눈: 0 }
  for (const city of searchFilteredList.value) counts[city.status] += 1
  return counts
})

// computed(파생): 실내 관광지 추천이 필요한 도시 수
const indoorRecommendedCount = computed(
  () => weatherStatusCounts.value['비'] + weatherStatusCounts.value['눈'],
)
```

> **버그 수정 노트**: 처음 구현에서는 `weatherStatusCounts`가 (검색어 + 날씨 필터까지 적용된) `filteredWeatherList`를 기준으로 집계해서, 칩 하나를 누르면 그 칩 자신을 제외한 나머지 통계가 전부 0으로 보이는 문제가 있었습니다. 통계 칩은 "필터 버튼"이면서 동시에 "필터링되지 않은 전체 통계"를 보여줘야 하는데, 자기 자신이 만든 필터링 결과를 다시 통계 내다 보니 자기참조 오류가 생긴 것입니다. `searchFilteredList`(검색어만 반영)를 별도로 두고 통계는 여기서 계산하도록 분리해서 해결했습니다.

#### 5-4. 본인만의 Watcher: `watch(indoorRecommendedCount, ...)`

검색어나 날씨 필터가 바뀌어 목록이 달라질 때마다, 실내 추천 도시 수가 어떻게 바뀌는지 콘솔로그로 작성합니다.

```js
watch(indoorRecommendedCount, (newCount, oldCount) => {
  console.log(`[watch] 실내 관광 추천이 필요한 도시 수 변경: ${oldCount} -> ${newCount}`)
})
```

화면에는 지역별 날씨 현황 제목 옆에 `☀️ 3 · 🌥️ 3 · 🌧️ 2 · ❄️ 2` 통계 칩이 있고 이 칩 자체가 필터 버튼입니다. 필터가 걸려 있으면 그 아래에 "OO인 도시만 보고 있어요 · 전체 보기" 안내가 뜨고, "지금 N곳은 비·눈이 와서 실내 관광지를 추천드려요." 안내는 필터/검색 결과에 맞춰 실시간으로 갱신됩니다.

### 상태바 노출 방식 변경

기존에는 도시를 선택하면 상태바에 `"OO"이 선택되었습니다.` 문구가 떴는데 바로 아래에 있는 추천 관광지 히어로 카드가 이미 어떤 도시가 선택됐는지 보여주기 때문에 문구가 중복이었습니다. 그래서 **아무것도 선택하지 않았을 때만** "카드를 클릭하거나 검색해 보세요." 안내를 보여주고, 도시를 선택하면 이 영역 자체가 사라지도록 바꿨습니다.

```html
<div class="status-bar status-bar--muted" v-if="!selectedCityInfo">
  카드를 클릭하거나 검색해 보세요.
</div>
```

---

## 관광지 이미지 자산 안내

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

---

## 실습 3: Weather Components (컴포넌트 분리)

기능 변경 없이 실습 1 + 실습 2 결과물(`WeatherMockup.vue` 단일 파일)을 여러 개의 Vue 컴포넌트로 분리하는 회차

### 1. 요구사항으로 지정된 4개 컴포넌트

#### `WeatherParent.vue` — 최상위(부모) 컴포넌트

- 모든 반응형 상태와 `computed`, `watch`/`watchEffect` 를 이 컴포넌트에 두었습니다.
- 자식 컴포넌트가 emit한 이벤트를 받아 상태를 갱신하는 핸들러(`updateSearchQuery`, `clearSearch`, `selectCity`, `showDetail`, `toggleStatusFilter`, `clearStatusFilter`)를 정의했습니다.
- 자식에게 필요한 파생 데이터는 부모가 미리 계산해서 props로 내려줍니다. 예를 들어 카드 하나하나에 필요한 관광지 정보는 `attractionOf(city)` 함수로 계산해 `WeatherCard`에 `attraction` prop으로 전달합니다. → **단방향 데이터 흐름**(부모 → 자식은 props, 자식 → 부모는 emit) 유지.

```html
<WeatherCard
  v-for="city in filteredWeatherList"
  :key="city.id"
  :city="city"
  :selected="!!selectedCityInfo && selectedCityInfo.id === city.id"
  :attraction="attractionOf(city)"
  @select-card="selectCity"
  @click-detail="showDetail"
/>
```

#### `BaseDashboardCard.vue` — 검색박스·리스트박스 공통 디자인

- 검색 패널과 목록 패널이 똑같이 쓰는 흰색 카드형 패널 디자인(`.panel`, 제목 영역 `h2`)만 담당합니다.
- 내용은 갖고 있지 않고, `<slot name="header">`(제목 영역)와 기본 `<slot />`(본문 영역) 두 개로 부모가 무엇을 넣을지 위임받습니다.
- `WeatherParent.vue`에서 검색 패널, 목록 패널을 두 번 재사용됩니다.

```html
<BaseDashboardCard>
  <template #header>도시 검색</template>
  <SearchBar ... />
</BaseDashboardCard>
```

#### `SearchBar.vue` — 검색 입력창

- **props**: `searchQuery` (부모의 검색어 상태를 그대로 전달받아 input에 표시)
- **emits**: `update-query`(입력할 때마다 새 값을 부모에 전달), `reset`(초기화 버튼 클릭)
- 실습 1에서 확인한 "IME 조합 중 글자가 어긋나는 문제"를 그대로 방지하기 위해, `v-model` 대신 `@input`에서 `event.target.value`를 그대로 emit하는 방식을 유지했습니다.

```js
function onInput(event) {
  emit('update-query', event.target.value)
}
```

#### `WeatherCard.vue` — 날씨 카드 한 장

- **props**: `city`(도시 객체 전체), `selected`(현재 선택된 카드인지 여부), `attraction`(이 도시의 현재 status에 맞는 추천 관광지)
- **emits**: `select-card`(카드 클릭 시 이 도시를 선택했음을 부모에 전달), `click-detail`(상세보기 버튼 클릭 시 부모에 알림)

```html
<div class="card" @click="emit('select-card', city)">
  ...
  <button class="detail-btn" @click.stop="emit('click-detail', city)">상세보기</button>
</div>
```

### 2. 본인이 추가로 분리한 컴포넌트

| 컴포넌트                    | 담당 UI                                                                                 | props                                                | emits             |
| --------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------- |
| `WeatherStatusFilter.vue`   | 지역별 날씨 현황 제목 옆 통계 칩(☀️/🌥️/🌧️/❄️) — 클릭 가능한 필터 버튼                   | `statusOrder`, `weatherStatusCounts`, `statusFilter` | `toggle-filter`   |
| `WeatherStatusHints.vue`    | "N곳은 비·눈이 와서 실내 관광지 추천" 안내 + "OO인 도시만 보고 있어요 · 전체 보기" 안내 | `indoorRecommendedCount`, `statusFilter`             | `clear-filter`    |
| `RecommendedAttraction.vue` | 선택 전 안내 문구(`status-bar--muted`) / 선택 후 추천 관광지 히어로 카드                | `selectedCityInfo`, `recommendedAttraction`          | (없음, 표시 전용) |

- `WeatherStatusFilter`는 `BaseDashboardCard`의 `#header` 슬롯 안(제목 옆)에 들어가고 `WeatherStatusHints`는 그 아래 본문 영역에 들어가서 원본의 "제목 옆 칩 + 칩 아래 안내 문구"라는 배치를 그대로 재현했습니다.
- `RecommendedAttraction`은 `selectedCityInfo`가 없으면 안내 문구를, 있으면 히어로 카드를 보여주는 로직을 그대로 캡슐화했습니다.

### 3. CSS 분리 (`<style scoped>`)

- 원본 `WeatherMockup.vue`의 CSS를 어느 컴포넌트의 마크업에서 쓰이는가 기준으로 그대로 잘라서 각 컴포넌트의 `<style scoped>`로 옮겼습니다. (예: `.search-row`, `.search-field`, `input[type='text']`, `.reset-btn`, `.search-hint` → `SearchBar.vue` / `.card`, `.card-thumb`, `.badge` 등 → `WeatherCard.vue`)
- 페이지 전역 레이아웃(`.page-bg`, `.hero-band`, `.content-area`)과 CSS 변수(`--ink`, `--accent`, `--panel-bg` 등)는 `WeatherParent.vue`에 남겼습니다.
  - Vue의 `scoped` 스타일은 "이 셀렉터가 이 컴포넌트 안에서만 매칭된다"는 제약일 뿐 CSS 커스텀 프로퍼티(변수)는 실제 DOM 트리를 따라 정상적으로 상속됩니다. 따라서 `WeatherParent.vue`의 `.page-bg`에서 정의한 `var(--ink)` 등은 실제 렌더링 시 자식 컴포넌트(`SearchBar`, `WeatherCard` 등) 안에서도 그대로 사용할 수 있었습니다.
- `.card-grid`, `.empty`(검색 결과 없음 안내)는 리스트 자체를 렌더링하는 마크업이 `WeatherParent.vue`의 템플릿에 남아 있어서 스타일도 그쪽에 함께 두었습니다.

### 4. 최종 파일 구조

```
src/
└── components/
    ├── WeatherParent.vue           # 상태·computed·watch·이벤트 핸들러 보유 (최상위)
    ├── BaseDashboardCard.vue       # 검색/목록 패널 공통 디자인 (slot 기반)
    ├── SearchBar.vue               # 도시 검색 입력창 (props/emits)
    ├── WeatherCard.vue             # 날씨 카드 1장 (props/emits)
    ├── WeatherStatusFilter.vue     # [본인 추가] 통계 칩 필터 버튼
    ├── WeatherStatusHints.vue      # [본인 추가] 실내 추천/필터 안내 문구
    └── RecommendedAttraction.vue   # [본인 추가] 선택 안내 + 추천 관광지 히어로 카드
```

### 5. 컴포넌트 트리 (부모 → 자식 관계)

```
WeatherParent
├── BaseDashboardCard (검색 패널)
│   └── SearchBar
├── RecommendedAttraction
└── BaseDashboardCard (목록 패널)
    ├── WeatherStatusFilter   (#header 슬롯)
    ├── WeatherStatusHints
    └── WeatherCard × N        (v-for)
```

---

## 실습 4: Weather Router (Vue Router 페이지 분리)

`WeatherParent.vue` 단일 화면이었던 실습 3 결과물을 Vue Router를 이용해 여러 페이지(View)로 쪼개고 URL로 이동할 수 있게 만드는 회차

### 1. Vue Router 설정: Lazy Loading + Catch-all Route

`src/router/index.js`에 라우트 5개를 정의했습니다.

```js
const routes = [
  { path: '/', name: 'home', component: () => import('../views/WeatherHomeView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/WeatherAboutView.vue') },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    // [본인 추가 view] 40개 관광지를 전부 모아 보여주는 갤러리 페이지
    path: '/attractions',
    name: 'attractions',
    component: () => import('../views/WeatherAttractionGalleryView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]
```

- **지연 로딩(Lazy Loading)**: `component`에 정적 `import` 대신 `() => import(...)` 형태의 동적 import를 썼습니다. 이 자체가 코드 스플리팅 포인트가 되어서, 해당 라우트에 처음 진입할 때만 관련 청크가 로드됩니다.
- **Catch-all Route**: 맨 마지막 라우트 `path: '/:pathMatch(.*)*'`는 위 4개 라우트 중 어디에도 매칭되지 않는 모든 경로를 잡아서 `NotFoundView`로 보냅니다. `:pathMatch(.*)*`을 사용했습니다.
- 그 외에 `scrollBehavior()`를 추가해서 라우트가 바뀔 때마다 항상 스크롤을 맨 위로 초기화하도록 했습니다.

### 2. `App.vue` — Navigation Bar + RouterView

```html
<div class="app-shell">
  <div class="nav-wrap">
    <nav class="nav-bar">
      <RouterLink to="/" class="brand">🌤 날씨 대시보드</RouterLink>
      <div class="nav-links">
        <RouterLink to="/" exact-active-class="active">대시보드</RouterLink>
        <RouterLink to="/attractions" active-class="active">관광지 모아보기</RouterLink>
        <RouterLink to="/about" active-class="active">서비스 소개</RouterLink>
      </div>
    </nav>
  </div>

  <RouterView />
</div>
```

- `<RouterLink>`로 대시보드/관광지 갤러리/서비스 소개 3개 메뉴를 연결하고, `<RouterView>`가 현재 라우트에 매칭된 View 컴포넌트를 그 자리에 렌더링합니다.

### 3. `WeatherHomeView.vue` — WeatherParent 대체, `/` 경로

실습 3의 `WeatherParent.vue` 로직(반응형 상태·computed·watch·이벤트 핸들러)을 그대로 옮겨왔습니다. 달라진 부분은 상세보기 버튼의 동작 하나입니다.

```js
import { useRouter } from 'vue-router'
const router = useRouter()

// 기존: window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
// 변경: Programmatic Navigation으로 상세 페이지 이동
function showDetail(city) {
  router.push('/weather/' + city.id)
}
```

`useRouter()`로 라우터 인스턴스를 가져와 `router.push()`를 호출하는 방식(Programmatic Navigation)으로 바꿨습니다. 또한, `mock/WeatherData.js`에서 `weatherList`, `attractionMap`을 import해서 쓰기 때문에 이 View 자체에는 더 이상 데이터 정의 코드가 없습니다.

### 4. `WeatherDetailView.vue` — 지역별 상세 기상관측 정보, `/weather/:cityId` 경로

```js
import { useRoute, useRouter } from 'vue-router'
import { findCityById, findAttraction } from '@/mock/WeatherData'

const route = useRoute()
const cityInfo = ref(null)

// Router 동적 경로 매칭(:cityId)을 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
onMounted(() => {
  cityInfo.value = findCityById(route.params.cityId)
})

// 상세 페이지에 머무른 채 :cityId만 바뀌는 경우(같은 컴포넌트 재사용)도 대응
watch(
  () => route.params.cityId,
  (newCityId) => {
    cityInfo.value = findCityById(newCityId)
  },
)
```

- `route.params.cityId`로 주소에 담긴 도시 코드를 읽어와서 `onMounted` 시점에 mock 데이터(`weatherList`)에서 해당 도시 객체를 찾아 선택합니다.
- 온도/습도/풍속/기상현황 등 상세 기상관측 정보 5개 항목을 하나의 `.panel` 박스 안에 정리해서 보여주고, 그 아래에 이 도시·날씨에 맞는 추천 관광지 카드를 `RecommendedAttraction.vue`(실습 3 컴포넌트)를 그대로 재사용해서 붙였습니다.
- 존재하지 않는 `cityId`로 접근한 경우(`cityInfo`가 `null`)에는 "해당 도시 정보를 찾을 수 없어요" 안내와 함께 대시보드로 돌아가는 버튼만 보여줍니다.
- 뒤로가기 버튼은 텍스트 화살표(`←`) 대신 재사용 가능하도록 분리한 `IconArrowLeft.vue`(SVG 컴포넌트)를 불러다 씁니다.

### 5. `WeatherAboutView.vue` — 서비스 소개, `/about` 경로

프로젝트에 대한 간단한 소개 문구와 기능 목록을 정적으로 작성하고, 하단에 "대시보드 홈으로 이동" 버튼을 배치해 `router.push('/')`로 메인 화면으로 돌아갈 수 있게 했습니다.

### 6. 본인 추가 View — `WeatherAttractionGalleryView.vue`, `/attractions` 경로

실습 1~3에서 만든 40개(도시 10 × status 4)의 관광지 데이터를 전부 한 번에 모아서 보여주는 갤러리 페이지입니다. 기존에는 선택한 도시 하나에 대한 관광지 1개만 보였다면 여기서는 관광지 자체가 주인공이 되도록 구성했습니다.

```js
// mock/WeatherData.js — attractionMap(도시 × status 중첩 객체)을
// 관광지 하나당 레코드 하나인 평탄화된 배열 40개로 변환
export const attractionGallery = Object.entries(attractionMap).flatMap(([cityId, byStatus]) => {
  const city = findCityById(cityId)
  return Object.entries(byStatus).map(([status, attraction]) => ({
    id: `${cityId}_${status}`,
    cityId,
    cityName: city ? city.name : cityId,
    status,
    ...attraction, // name, tip, image
  }))
})
```

카드 하나는 관광지 이름이 크게 나오고, 그 아래 "{지역} · {날씨}일 때 추천" 캡션과 tip 문구가 작게 붙는 순서로 배치했습니다. 실습 3에서 만든 `SearchBar.vue`를 재사용해서 관광지 이름/지역 이름으로 검색·필터링도 가능합니다.

### 7. 여러 View가 공유하는 데이터/유틸/컴포넌트 분리

View가 4개(+에러 페이지 1개)로 늘어나면서, Home에만 있던 데이터와 헬퍼 함수를 각 View가 각자 중복 정의하면 데이터가 어긋날 위험이 있어서 아래처럼 별도 모듈로 뽑아냈습니다.

| 파일                                     | 역할                                                                                                                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/mock/WeatherData.js`                | `weatherList`, `attractionMap`, `attractionGallery`(40개 평탄화 배열), `findCityById`, `findAttraction` — 데이터의 단일 출처(single source of truth)                                                        |
| `src/utils/WeatherHelpers.js`            | `statusIcon`, `statusAccentClass`, `attractionImageSrc`, `handleImageError` — 여러 컴포넌트/뷰에서 반복되던 헬퍼 함수 모음                                                                                  |
| `src/components/common/HeroBand.vue`     | Home, Gallery 뷰가 완전히 동일하게 쓰던 진한 남색 히어로 배너를 컴포넌트로 분리. `eyebrow`/`title`은 props, 부제(sub)는 슬롯으로 받아서 `attractionGallery.length` 같은 동적 값도 그대로 interpolation 가능 |
| `src/components/icons/IconArrowLeft.vue` | 뒤로가기 화살표 SVG. `stroke="currentColor"`라서 부모 버튼의 글자색을 그대로 따라감. 텍스트 화살표(`←`) 대신 여러 뒤로가기 버튼에서 공통으로 재사용                                                         |

### 8. 라우트 표

| path               | name             | component                          | 설명                                      |
| ------------------ | ---------------- | ---------------------------------- | ----------------------------------------- |
| `/`                | `home`           | `WeatherHomeView.vue`              | 메인 날씨 대시보드 (WeatherParent 대체)   |
| `/weather/:cityId` | `weather-detail` | `WeatherDetailView.vue`            | 도시별 상세 기상관측 + 추천 관광지 페이지 |
| `/attractions`     | `attractions`    | `WeatherAttractionGalleryView.vue` | [본인 추가] 관광지 40개 모아보기 갤러리   |
| `/about`           | `about`          | `WeatherAboutView.vue`             | 서비스 소개 정적 페이지                   |
| `/:pathMatch(.*)*` | `not-found`      | `NotFoundView.vue`                 | Catch-all Route (정의되지 않은 경로)      |

### 9. 최종 파일 구조

```
src/
├── main.js                              # 라우터 인스턴스 전역 주입 (.use(router))
├── App.vue                              # 내비게이션 바(RouterLink) + 메인 수문장(RouterView)
├── router/
│   └── index.js                         # 라우트 규칙(routes 배열) 정의 + Lazy Loading + Catch-all
├── mock/
│   └── WeatherData.js                   # weatherList / attractionMap / attractionGallery (단일 출처 제공)
├── utils/
│   └── WeatherHelpers.js                # statusIcon 등 여러 곳에서 쓰는 공용 헬퍼
├── components/
│   ├── common/
│   │   └── HeroBand.vue                 # Home/Gallery 공용 히어로 배너
│   ├── icons/
│   │   └── IconArrowLeft.vue            # 뒤로가기 SVG 아이콘
│   └── exercise/                        # 실습 3에서 분리한 부품 컴포넌트 (로직 변경 없이 재사용)
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── WeatherCard.vue
│       ├── WeatherStatusFilter.vue
│       ├── WeatherStatusHints.vue
│       └── RecommendedAttraction.vue
└── views/                               # 페이지 단위 컴포넌트 보관 폴더
    ├── WeatherHomeView.vue              # 메인 날씨 대시보드 화면
    ├── WeatherAboutView.vue             # 서비스 소개용 정적 페이지
    ├── WeatherDetailView.vue            # :cityId 패턴을 수신하는 동적 상세 페이지
    ├── WeatherAttractionGalleryView.vue # [본인 추가] 관광지 40개 모아보기
    └── NotFoundView.vue                 # 정의되지 않은 경로 접근 시 (Catch-all Route)
```

### 10. 페이지(View) 트리 (라우트 기준)

```
App (Navigation Bar + RouterView)
├── / → WeatherHomeView
│   ├── HeroBand
│   ├── BaseDashboardCard (검색 패널) → SearchBar
│   ├── RecommendedAttraction
│   └── BaseDashboardCard (목록 패널)
│       ├── WeatherStatusFilter
│       ├── WeatherStatusHints
│       └── WeatherCard × N → click-detail 시 router.push('/weather/' + id)
├── /weather/:cityId → WeatherDetailView
│   ├── IconArrowLeft + 뒤로가기 버튼
│   └── RecommendedAttraction (재사용)
├── /attractions → WeatherAttractionGalleryView   [본인 추가 view]
│   ├── HeroBand
│   └── BaseDashboardCard (검색 패널) → SearchBar
├── /about → WeatherAboutView
└── /:pathMatch(.*)* → NotFoundView
```
