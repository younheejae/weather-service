import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 라우트 이동 시 항상 맨 위로 스크롤
    return { top: 0 }
  },
})

export default router
