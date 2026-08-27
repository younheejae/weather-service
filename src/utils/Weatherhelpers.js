// WeatherCard, RecommendedAttraction, WeatherDetailView, GalleryView 등
// 여러 곳에서 반복해서 쓰이던 작은 헬퍼들을 한 곳으로 모음

const ICON_MAP = { 맑음: '☀️', 흐림: '🌥️', 비: '🌧️', 눈: '❄️' }
const ACCENT_MAP = {
  맑음: 'accent-sunny',
  흐림: 'accent-cloudy',
  비: 'accent-rainy',
  눈: 'accent-snowy',
}

export function statusIcon(status) {
  return ICON_MAP[status] ?? ''
}

export function statusAccentClass(status) {
  return ACCENT_MAP[status] ?? ''
}

export function attractionImageSrc(imageFileName) {
  return `/attractions/${imageFileName}`
}

// 이미지 로드 실패 시 picsum.photos placeholder로 자동 대체
// seed를 고정해서 같은 관광지는 새로고침해도 같은 이미지가 나오게함
export function handleImageError(event, seedText) {
  const seed = encodeURIComponent(seedText || 'weather-mockup')
  event.target.onerror = null // 무한 루프 방지
  event.target.src = `https://picsum.photos/seed/${seed}/640/420`
}
