// API를 호출할 때 필요한 도시 식별 정보(id/이름/위경도)와 직접 큐레이션한 관광지 데이터(attractionMap)"만 남긴다

// 도시 식별 정보. id/name은 기존과 동일하게 유지해서 attractionMap의 키와 맞추고
// lat/lon은 OpenWeatherMap 좌표 기반 조회에 사용함
export const cityDefinitions = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'city_05', name: '대구', lat: 35.8714, lon: 128.6014 },
  { id: 'city_06', name: '대전', lat: 36.3504, lon: 127.3845 },
  { id: 'city_07', name: '광주', lat: 35.1595, lon: 126.8526 },
  { id: 'city_08', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'city_09', name: '제주', lat: 33.4996, lon: 126.5312 },
  { id: 'city_10', name: '강릉', lat: 37.7519, lon: 128.8761 },
]

// 관광지 추천 데이터: 도시(10) × status(4) = 40개
export const attractionMap = {
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

// 도시 코드로 도시 식별 정보를 찾는 헬퍼 (이름 표시 등, 실시간 날씨는 weatherStore 참고)
export function findCityById(cityId) {
  return cityDefinitions.find((city) => city.id === cityId) ?? null
}

// 도시 + status로 추천 관광지 하나를 찾는 헬퍼
export function findAttraction(cityId, status) {
  return attractionMap[cityId]?.[status] ?? null
}

// attractionMap(도시 × status 중첩 객체)을
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
