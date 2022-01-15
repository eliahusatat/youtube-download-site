import VueRouter from 'vue-router'
const routes = [
  {
    path: '/youtube-home',
    name: 'youtube home',
    component: () => import('..\\pages\\youtube-home\\youtubeHome')
  },
  {
    path: '/youtube-search/:searchQuery?',
    name: 'youtube search',
    component: () => import('..\\pages\\youtube-search\\youtubeSearch')
  },
  {
    path: '/youtube-video/:videoId?',
    name: 'youtube video',
    component: () => import('..\\pages\\youtube-video\\youtubeVideo')
  },
  {
    path: '/',
    redirect: () => {
      return '/youtube-home'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  saveScrollPosition: true,
  routes
})

export default router
