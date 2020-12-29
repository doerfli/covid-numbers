import Vue from 'vue'
import Vuex from 'vuex'
import cases from '@/store/cases'
import viewprops from '@/store/viewprops'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    cases: cases,
    viewProps: viewprops
  }
})
