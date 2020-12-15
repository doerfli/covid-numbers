import {Module} from 'vuex';

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
  },
  mutations: {

  },
  actions: {
    async fetchZh({ commit }) {
      console.log("cases/fetchZh");
    }
  },
};

export default casesModule;

