import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Home
  {
    path: '/home',
    alias: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/Home.vue'),
    meta: {
      title: 'view.home',
      requiresAuth: true
    }
  },

  // Authentication
  {
    path: '/auth/:action',
    name: 'auth',
    component: () => import(/* webpackChunkName: 'auth' */ '../views/Auth.vue'),
    meta: {
      title: 'view.auth',
      requiresAuth: false
    }
  },
  { path: '/auth', redirect: '/auth/login' },
  { path: '/login', redirect: '/auth/login' },
  { path: '/register', redirect: '/auth/register' },

  // 404 Page Not Found
  {
    path: '/:catchAll(.*)',
    component: import(/* webpackChunkName: 'pageNotFound' */ '../views/PageNotFound.vue'),
    meta: {
      title: 'view.pageNotFound',
      requiresAuth: false
    }
  }
]

// Create router
export const router = createRouter({
  history: createWebHistory(),
  routes
})

// Redirect to login if not logged in
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (getAuth().currentUser) {
      next()
    } else {
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          next()
        } else {
          next({
            path: '/auth/login',
            query: { redirect: to.fullPath }
          })
        }
      })()
    }
  } else {
    next()
  }
})
