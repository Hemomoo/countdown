import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/index.vue') },
  { path: '/edite', name: 'Edite', component: () => import('../views/edite.vue') }
]

export default createRouter({
  routes,
  history: createWebHashHistory()
})
