<script setup>
// WeatherHomeView와 WeatherAttractionGalleryView에 완전히 동일한 마크업/CSS로
// 중복되어 있던 진한 남색 히어로 배너를 하나의 컴포넌트로 분리

defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="hero-band">
    <div class="hero-inner">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="sub">
        <slot />
      </p>
    </div>
  </div>
</template>

<style scoped>
.hero-band {
  width: 100%;
  background: radial-gradient(circle at 15% 0%, #1c2e66 0%, #101a3d 45%, #0b1330 100%);
}
.hero-inner {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 108px 16px 40px;
  box-sizing: border-box;
}
@media (min-width: 900px) {
  .hero-inner {
    max-width: 880px;
    padding: 124px 32px 44px;
  }
}

.eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #cfe0ff;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 10px;
  border-radius: 999px;
  margin: 0 0 20px;
}
.hero-inner h1 {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 14px;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.hero-inner .sub {
  font-size: 14px;
  color: #b7c3e8;
  margin: 0;
}
</style>
