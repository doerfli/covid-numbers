import Vue from 'vue'
import Vuex from 'vuex'
import cases from '@/store/cases'
import vacc from '@/store/vacc'
import viewprops from '@/store/viewprops'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cases: cases,
    viewProps: viewprops,
    vacc: vacc,
  }
})
