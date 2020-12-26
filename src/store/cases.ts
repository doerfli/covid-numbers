import { Module } from 'vuex'
import superagent from 'superagent'
import parse from 'csv-parse/lib/sync'
import DailyData from '@/model/dailydata'
import CantonData from '@/model/cantondata'

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cases: [] as CantonData[]
  },
  // getters: {
  //   newCases: (state) => (canton: string) => {
  //     console.log("newCases");
  //     console.log(canton);
  //     // console.log(state.cases);
  //     // console.log(state.cases.has(canton));
  //     if (! state.cases.has(canton)) {
  //       return new Array<DailyData>();
  //     }
  //     return state.cases[canton].map((value: DailyData, idx: number, arr: DailyData[]) => {
  //       if (idx == 0) {
  //         return null;
  //       }
  //       const n = value.confCases - arr[idx - 1].confCases;
  //       return {
  //         date: value.date,
  //         newCases: n
  //       } as DailyData;
  //     }).filter((v: DailyData | null) => v != null);
  //   }
  // },
  mutations: {
    saveRecords(state, payload) {
      const data = payload.records.map((val: any) => {
        // console.log(val);
        return {
          date: val.date,
          confCases: parseInt(val.ncumul_conf) | 0,
          currHosp: parseInt(val.current_hosp) | 0,
          currIcu: parseInt(val.current_icu) | 0
        } as DailyData;
      });
      state.cases = state.cases.filter((x: CantonData) =>  { return x.canton !== payload.canton} );
      state.cases.push({
        canton: payload.canton,
        data: data
      } as CantonData);
      console.log("cases saved");
    }
  },
  actions: {
    async fetch({ commit }, payload) {
      const canton = payload.canton;
      const url = `https://raw.githubusercontent.com/openZH/covid_19/master/fallzahlen_kanton_total_csv_v2/COVID19_Fallzahlen_Kanton_${canton}_total.csv`
      const response = await superagent.get(url)
      // console.log(response);
      const records = parse(response.text, {
        columns: true,
        skipEmptyLines: true
      })
      // console.log(records);
      commit("saveRecords", { canton, records });
    }
  },
};

export default casesModule;

