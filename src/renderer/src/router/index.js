import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/index.vue') },
  { path: '/edite', name: 'Edite', component: () => import('../views/edite.vue') },
  {path: '/picker', name: 'picker', component: () => import('../views/datePicker.vue')}

]

export default createRouter({
  routes,
  history: createWebHashHistory()
})
