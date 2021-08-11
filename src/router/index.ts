import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ConfirmedCases from '@/views/ConfirmedCases.vue'
import Hospitalized from '@/views/Hospitalized.vue'
import Icu from '@/views/Icu.vue'
import Deceased from '@/views/Deceased.vue'
import IncidenceOneWeek from '@/views/IncidenceOneWeek.vue'
import IncidenceTwoWeek from '@/views/IncidenceTwoWeek.vue'
import Details from '@/views/Details.vue'
import Trend from '@/views/Trend.vue'
import NotFoundComponent from '@/components/NotFoundComponent.vue'
import Vaccinations from '@/views/Vaccinations.vue'
import VaccinationsChg from "@/views/VaccinationsChg.vue";

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
  {
    path: '/details/:canton',
    name: 'Details',
    component: Details,
    props: route => ({ shortName: route.params.canton, showTrendIndicators: route.query.showTrendIndicators })
  },
  {
    path: '/trend',
    name: 'Trend',
    component: Trend
  },
  {
    path: '/vaccinations',
    name: 'Vaccinations',
    component: Vaccinations
  },
  {
    path: '/vaccinations/chg',
    name: 'VaccinationsChg',
    component: VaccinationsChg
  },
  { path: '*',
    name: " NotFound",
    component: NotFoundComponent
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router
