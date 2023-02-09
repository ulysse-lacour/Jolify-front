const routes = [
  {
    name: 'home',
    path: '/',
    component: 'pages/home/index.vue'
  },
  {
    name: 'soon',
    path: '/soon',
    component: 'pages/soon/index.vue'
  },
  {
    name: 'register',
    path: '/register',
    component: 'pages/register/index.vue'
  },
  {
    name: 'login',
    path: '/login',
    component: 'pages/login/index.vue'
  },
  {
    name: 'playlists',
    path: '/playlists',
    component: 'pages/playlists/index.vue'
  },
  {
    name: 'playlist',
    path: '/playlist/:playlist',
    component: 'pages/_playlist/index.vue'
  }
]

export default routes
