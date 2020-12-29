import { Module } from 'vuex'
import CantonConfig from '@/model/cantonconfig'

const viewpropsModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cantons: [] as CantonConfig[]
  },
  getters: {
  },
  mutations: {
    toggleCanton(state, payload) {
      state.cantons.filter((c: CantonConfig) => c.name === payload.canton).forEach((c: CantonConfig) => c.show = ! c.show);
    },
    init(state) {
      state.cantons = [
        "CH", "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU",
        "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD",
        "VS", "ZG", "ZH"
      ].map((e) => { return {
        name: e,
        show: true
      } as CantonConfig });
    }
  },
  actions: {
    toggleCanton({commit}, payload) {
      const canton = payload.canton;
      // console.log("toggle " + canton);
      commit("toggleCanton", { canton });
    },
    init({commit}, payload) {
      commit("init");
    }
  },
};

export default viewpropsModule;
