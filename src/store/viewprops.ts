import { Module } from 'vuex'
import CantonConfig from '@/model/cantonconfig'
import StaticData from '@/store/staticdata'

function persistCantonsToLocalStorage (cantons: string[]) {
  localStorage.setItem("selectedCantons", cantons.join(","));
}

function persistDaysToShowToLocalStorage (daysToShow: number) {
  localStorage.setItem("daysToShow", daysToShow.toString());
}

function persistThemeToLocalStorage (theme: string) {
  localStorage.setItem("theme", theme);
}


// eslint-disable-next-line
const viewpropsModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cantons: [] as CantonConfig[],
    daysToShow: 30,
    theme: ""
  },
  getters: {
  },
  mutations: {
    toggleCanton(state, payload) {
      state.cantons.filter((c: CantonConfig) => c.nameShort === payload.canton).forEach((c: CantonConfig) => c.show = ! c.show);
      persistCantonsToLocalStorage(state.cantons.filter((c: CantonConfig) => c.show).map((c: CantonConfig) => c.nameShort));
    },
    init(state) {
      const selectedCantons = localStorage.getItem("selectedCantons")?.split(",");
      state.cantons = [{ short: "CH", name: "Switzerland", population: StaticData.getTotalPopulation() }].concat(StaticData.getCantonsFull())
        .map((e) => {
          let show = true;
          if (selectedCantons != null && ! selectedCantons.includes(e.short)) {
            show = false;
          }
          return {
            name: e.name,
            nameShort: e.short,
            show: show
          } as CantonConfig
        });
      state.daysToShow = Number.parseInt(localStorage.getItem("daysToShow") ?? "30");
      state.theme = localStorage.getItem("theme") ?? "light";
      if (state.theme === "dark") {
        document.querySelector('html')?.classList.add('dark');
      }
    },
    setAll(state, payload) {
      state.cantons.forEach((c: CantonConfig) => c.show = payload.show);
      persistCantonsToLocalStorage(state.cantons.filter((c: CantonConfig) => c.show).map((c: CantonConfig) => c.nameShort));
    },
    setDaysToShow(state, payload) {
      state.daysToShow = payload.daysToShow;
      persistDaysToShowToLocalStorage(state.daysToShow);
    },
    toggleTheme(state) {
      if (state.theme === "light") {
        state.theme = "dark";
        document.querySelector('html')?.classList.add('dark');
      } else {
        state.theme = "light";
        document.querySelector('html')?.classList.remove('dark');
      }
      persistThemeToLocalStorage(state.theme);
    },
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
    },
    toggleTheme({commit}) {
      commit("toggleTheme");
    },
  },
};

export default viewpropsModule;
