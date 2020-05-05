import Vue from 'vue'
import VueRouter from 'vue-router'

import index from '../views/Index.vue'
import v2 from '../views/v2.vue'
import v3 from '../views/v3.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/v2',
    name: 'v2',
    component: v2
  },
  {
    path: '/v3',
    name: 'v3',
    component: v3
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
})

export default router
