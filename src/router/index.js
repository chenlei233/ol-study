import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: { path: '/1' },
  },
  {
    path: '/1',
    name: '3857',
    component: () => import(/* webpackChunkName: "about" */ '../views/epsg-3857.vue')
  },
  {
    path: '/2',
    name: '4326',
    component: () => import('../views/epsg-4326.vue')
  },
  {
    path: '/3',
    name: 'mouse-click',
    component: () => import('../views/mouse-click.vue')
  },
  {
    path: '/4',
    name: 'mouse-move',
    component: () => import('../views/mouse-move.vue')
  },
  {
    path: '/5',
    name: 'draw',
    component: () => import('../views/draw.vue')
  },
  {
    path: '/6',
    name: 'vector-layer',
    component: () => import('../views/vectorLayer.vue')
  },
  {
    path: '/7',
    name: 'wms',
    component: () => import('../views/wms.vue')
  },
  {
    path: '/9',
    name: 'index',
    component: () => import('../views/shp.vue')
  },
  {
    path: '/10',
    name: 'cover',
    component: () => import('../views/cover.vue')
  },
  {
    path: '/13',
    name: 'create-json',
    component: () => import('../views/create-json.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
