<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { attractionImageSrc, handleImageError } from '@/utils/Weatherhelpers'
import { useAttractionImageStore } from '@/stores/attractionimagestore'

// 갤러리처럼 관광지가 40개씩 한 화면에 v-for로 쭉 나오는 경우 마운트되자마자
// 전부 Unsplash를 검색하면(WeatherCard/RecommendedAttraction과 달리) Demo 등급
// rate limit(시간당 50회)을 순식간에 다 써버림
// 그래서 실제로 스크롤돼서 화면에 보이는 카드만 IntersectionObserver로 감지해서 그때그때 검색
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  imageFileName: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
})

const attractionImageStore = useAttractionImageStore()
const imgRef = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        attractionImageStore.fetchImage(props.name)
        observer.disconnect() // 한 번 보였으면 이후엔 더 관찰할 필요 없음
      }
    },
    { rootMargin: '200px' }, // 화면에 딱 들어오기 전에 살짝 미리 로드 시작
  )
  if (imgRef.value) observer.observe(imgRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

// 캐시에 이미 있으면(다른 페이지에서 먼저 검색된 관광지 등) observer 여부와 무관하게 바로 반영됨
const attractionPhoto = computed(() => attractionImageStore.getImageByQuery(props.name))
const src = computed(() => attractionPhoto.value?.url ?? attractionImageSrc(props.imageFileName))
</script>

<template>
  <div class="lazy-thumb-wrap">
    <img
      ref="imgRef"
      class="lazy-thumb"
      :src="src"
      :alt="alt || name"
      @error="handleImageError($event, imageFileName)"
    />
  </div>
</template>

<style scoped>
.lazy-thumb-wrap {
  position: relative;
  overflow: hidden;
}
.lazy-thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.unsplash-credit {
  position: absolute;
  right: 6px;
  bottom: 6px;
  font-size: 10px;
  color: #ffffff;
  background: rgba(16, 24, 48, 0.55);
  padding: 2px 6px;
  border-radius: 999px;
  text-decoration: none;
}
.unsplash-credit:hover {
  background: rgba(16, 24, 48, 0.75);
}
</style>
