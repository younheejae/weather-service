<script setup></script>

<template>
  <div class="app-shell">
    <div class="nav-wrap">
      <nav class="nav-bar">
        <RouterLink to="/" class="brand">🌤 날씨 대시보드</RouterLink>

        <div class="nav-links">
          <RouterLink to="/" class="nav-link" exact-active-class="active">대시보드</RouterLink>
          <RouterLink to="/attractions" class="nav-link" active-class="active"
            >관광지 모아보기</RouterLink
          >
          <RouterLink to="/about" class="nav-link" active-class="active">서비스 소개</RouterLink>
        </div>
      </nav>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #eef1f6;
}

.nav-wrap {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 40;
  padding: 18px 16px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.nav-bar {
  pointer-events: auto;
}

.nav-bar {
  position: relative;
  width: 100%;
  max-width: 880px;
  display: flex;
  align-items: center;
  padding: 12px 22px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 30px rgba(16, 24, 48, 0.14);
}

.brand {
  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: #101830;
  font-weight: 800;
  font-size: 15px;
  text-decoration: none;
  white-space: nowrap;
}

.nav-links {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
}

.nav-link {
  font-family:
    'PretendardVariable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: #4a5372;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 999px;
  white-space: nowrap;
  transition:
    background 0.15s,
    color 0.15s;
}
.nav-link:hover {
  color: #101830;
}
.nav-link.active {
  color: #1b2f5b;
  font-weight: 800;
}

/* 화면이 좁아지면 중앙 절대배치 대신 자연스럽게 줄바꿈되도록 폴백 */
@media (max-width: 560px) {
  .nav-bar {
    flex-direction: column;
    align-items: flex-start;
    border-radius: 24px;
    gap: 10px;
  }
  .nav-links {
    position: static;
    transform: none;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
