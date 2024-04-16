import { createRouter, createWebHistory } from 'vue-router'
import PartsView from '../views/PartsView.vue'
import SoonView from '../views/SoonView.vue'
import TeamView from '../views/TeamView.vue'
import RegistrationForm from '../views/RegistrationForm.vue'
import { auth } from '../firebase/firebaseConfig'

const routes = [
  {
    path: '/',
    name: 'PartsList',
    component: PartsView,
    props: (route) => ({ page: parseInt(route.query.page) || 1 }),
    meta: { transition: 'fade', requiresAuth: true },
  },
  {
    path: '/comingsoon',
    name: 'SoonView',
    component: SoonView,
    meta: { transition: 'fade', requiresAuth: true },
  },
  {
    path: '/account',
    name: 'team',
    component: TeamView,
    meta: { transition: 'fade', requiresAuth: true },
  },
  {
    path: '/registration',
    name: 'RegistrationForm',
    component: RegistrationForm,
    meta: { transition: 'fade' },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/registration' && auth.currentUser) {
    next('/')
    return
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !auth.currentUser) {
    next('/registration')
    return
  }

  next()
})

export default router