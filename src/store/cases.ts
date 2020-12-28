import { Module } from 'vuex'
import superagent from 'superagent'
import parse from 'csv-parse/lib/sync'
import CantonData from '@/model/cantondata'
import RecordsProcessor from '@/store/recordsprocessor'

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cases: [] as CantonData[]
  },
  mutations: {
    saveRecords(state, payload) {
      const dataMap = new RecordsProcessor().process(payload.records);

      // create array entry per canton
      const cases = new Array<CantonData>();
      dataMap.forEach((data, canton) => {
        cases.push({
          canton: canton,
          data: data
        } as CantonData)
      });

      // update cases
      state.cases = cases;
      console.log("cases saved");
    }
  },
  actions: {
    async fetch({ commit }) {
      const url = "https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv";
      const response = await superagent.get(url)
      // console.log(response);
      const records = parse(response.text, {
        columns: true,
        skipEmptyLines: true,
        relaxColumnCountLess: true
      })
      // console.log(records);
      commit("saveRecords", { records });
    }
  },
};

export default casesModule;

