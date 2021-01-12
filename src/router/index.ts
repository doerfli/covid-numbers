import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ConfirmedCases from '@/views/ConfirmedCases.vue'
import Hospitalized from '@/views/Hospitalized.vue'
import Icu from '@/views/Icu.vue'
import Deceased from '@/views/Deceased.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/confirmedcases',
    alias: '/',
    name: 'ConfirmedCases',
    component: ConfirmedCases
  },
  {
    path: '/hospitalized',
    name: 'Hospitalized',
    component: Hospitalized
  },
  {
    path: '/icu',
    name: 'Icu',
    component: Icu
  },
  {
    path: '/deceased',
    name: 'Deceased',
    component: Deceased
  },
]

const router = new VueRouter({
  routes
})

export default router
