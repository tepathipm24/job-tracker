import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApplicationListView from '../views/ApplicationListView.vue'
import ApplicationAddView from '../views/ApplicationAddView.vue'
import ApplicationEditView from '../views/ApplicationEditView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresNavbar: false }
    },
    {
      path: '/applications',
      name: 'applications',
      component: ApplicationListView,
      meta: { requiresNavbar: true }
    },
    {
      path: '/applications/add',
      name: 'application-add',
      component: ApplicationListView,
      meta: { requiresNavbar: true }
    },
    {
      path: '/applications/edit/:id',
      name: 'application-edit',
      component: ApplicationListView,
      meta: { requiresNavbar: true },
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
      meta: { requiresNavbar: true }
    }
  ]
})

export default router
