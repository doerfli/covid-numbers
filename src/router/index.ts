import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ConfirmedCases from '@/views/ConfirmedCases.vue'
import Hospitalized from '@/views/Hospitalized.vue'
import Icu from '@/views/Icu.vue'
import Deceased from '@/views/Deceased.vue'
import IncidenceOneWeek from '@/views/IncidenceOneWeek.vue'
import IncidenceTwoWeek from '@/views/IncidenceTwoWeek.vue'

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
  {
    path: '/incidence-7-days',
    name: 'IncidenceOneWeek',
    component: IncidenceOneWeek
  },
  {
    path: '/incidence-14-days',
    name: 'IncidenceTwoWeek',
    component: IncidenceTwoWeek
  },
]

const router = new VueRouter({
  routes
})

export default router
