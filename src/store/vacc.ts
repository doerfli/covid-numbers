import { Module } from 'vuex'
import superagent from 'superagent'
import CantonData from '@/model/cantondata'
import Papa from 'papaparse'
import VaccDataSet from '@/model/vaccDataSet'
import VaccRecordsProcessor from '@/utils/vacc-records-processor'

// eslint-disable-next-line
const vaccModule: Module<any, any> = {
  namespaced: true,
  state: {
    vacc: [] as VaccDataSet[]
  },
  mutations: {
    saveRecords(state, payload) {
      // create array entry per canton
      const vacc = new Array<CantonData>();
      payload.dataMap.forEach((data: VaccDataSet[], canton: string) => {
        vacc.push({
          canton: canton,
          vaccData: data
        } as CantonData)
      });

      // update cases
      state.vacc = Object.freeze(vacc);
      console.log("vaccination data saved");
    }
  },
  actions: {
    async fetch({ commit }) {
      const url = "https://raw.githubusercontent.com/doerfli/foph-covid19-data/main/vacc_data/vacc_data2_total.csv";
      const response = await superagent.get(url)
      const parseResult = Papa.parse(response.text, {
        header: true,
        skipEmptyLines: true,
      });
      // console.log(parseResult);
      const dataMap = new VaccRecordsProcessor().process(parseResult.data);
      commit("saveRecords", { dataMap });
    }
  },
  getters: {
    // get data for a canton
    dataPerCanton: ((state) => (canton: string) => {
      // console.log(canton);
      const cantonData = state.vacc.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<VaccDataSet>();
      }
      return cantonData[0].vaccData;
    }),
  }
};

export default vaccModule;



