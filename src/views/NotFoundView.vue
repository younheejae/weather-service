<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
  router.push('/')
}
</script>

<template>
  <div class="page-bg">
    <div class="not-found">
      <p class="emoji">🌤❓</p>
      <p class="title">페이지를 찾을 수 없습니다.</p>
      <p class="sub">요청하신 주소가 존재하지 않거나 아직 개발되지 않았어요.</p>
      <button class="cta-btn" @click="goToDashboard">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css');

.page-bg {
  width: 100%;
  min-height: 100vh;
  padding-top: 96px;
  box-sizing: border-box;
  background: #eef1f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
}
.not-found {
  text-align: center;
  padding: 40px;
}
.emoji {
  font-size: 40px;
  margin: 0 0 10px;
}
.title {
  font-size: 18px;
  font-weight: 800;
  color: #101830;
  margin: 0 0 6px;
}
.sub {
  font-size: 13.5px;
  color: #64708a;
  margin: 0 0 22px;
}
.cta-btn {
  border: none;
  background: #1d427d;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border-radius: 14px;
  padding: 12px 22px;
  cursor: pointer;
}
.cta-btn:hover {
  opacity: 0.92;
}
</style>
