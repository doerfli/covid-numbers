import { Module } from 'vuex'
import CantonConfig from '@/model/cantonconfig'

function persistCantonsToLocalStorage (cantons: string[]) {
  localStorage.setItem("selectedCantons", cantons.join(","));
}

function persistDaysToShowToLocalStorage (daysToShow: number) {
  localStorage.setItem("daysToShow", daysToShow.toString());
}


// eslint-disable-next-line
const viewpropsModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cantons: [] as CantonConfig[],
    daysToShow: 30
  },
  getters: {
  },
  mutations: {
    toggleCanton(state, payload) {
      state.cantons.filter((c: CantonConfig) => c.name === payload.canton).forEach((c: CantonConfig) => c.show = ! c.show);
      persistCantonsToLocalStorage(state.cantons.filter((c: CantonConfig) => c.show).map((c: CantonConfig) => c.name));
    },
    init(state) {
      const selectedCantons = localStorage.getItem("selectedCantons")?.split(",");
      state.cantons = [
        "CH", "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU",
        "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD",
        "VS", "ZG", "ZH"
      ].map((e) => {
        let show = true;
        if (selectedCantons != null && ! selectedCantons.includes(e)) {
          show = false;
        }
        return {
          name: e,
          show: show
        } as CantonConfig
      });
      state.daysToShow = Number.parseInt(localStorage.getItem("daysToShow") ?? "30");
    },
    setAll(state, payload) {
      state.cantons.forEach((c: CantonConfig) => c.show = payload.show);
      persistCantonsToLocalStorage(state.cantons.filter((c: CantonConfig) => c.show).map((c: CantonConfig) => c.name));
    },
    setDaysToShow(state, payload) {
      state.daysToShow = payload.daysToShow;
      persistDaysToShowToLocalStorage(state.daysToShow);
    }
  },
  actions: {
    toggleCanton({commit}, payload) {
      const canton = payload.canton;
      // console.log("toggle " + canton);
      commit("toggleCanton", { canton });
    },
    selectAll({commit}) {
      commit("setAll", { show: true} );
    },
    selectNone({commit}) {
      commit("setAll", { show: false} );
    },
    init({commit}) {
      commit("init");
    },
    setDaysToShow({commit}, payload) {
      commit("setDaysToShow", { daysToShow: payload.daysToShow });
    }
  },
};

export default viewpropsModule;
