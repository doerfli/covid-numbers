import { Module } from 'vuex'

const viewpropsModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cantons: [
      "CH", "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL", "GR", "JU",
      "LU", "NE", "NW", "OW", "SG", "SH", "SO", "SZ", "TG", "TI", "UR", "VD",
      "VS", "ZG", "ZH"
    ]
  },
  mutations: {

  },
  actions: {

  },
};

export default viewpropsModule;
