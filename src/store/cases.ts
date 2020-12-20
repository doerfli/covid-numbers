import {Module} from 'vuex';
import superagent from 'superagent';
import parse from 'csv-parse/lib/sync'
import DailyData from '@/model/dailydata'

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    casesZh: []
  },
  mutations: {
    saveRecords(state, payload) {
      state.casesZh = payload.records.map((val: any) => {
        // console.log(val);
        return {
          date: val.date,
          confCases: parseInt(val.ncumul_conf) | 0,
          currHosp: parseInt(val.current_hosp) | 0,
          currIcu: parseInt(val.current_icu) | 0
        } as DailyData;
      });
    }
  },
  actions: {
    async fetchZh({ commit }) {
      const response = await superagent.get("https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv_v2/COVID19_Fallzahlen_Kanton_ZH_total.csv")
      // console.log(response);
      const records = parse(response.text, {
        columns: true,
        skipEmptyLines: true
      })
      // console.log(records);
      commit("saveRecords", { records });
    }
  },
};

export default casesModule;

