import { Module } from 'vuex'
import superagent from 'superagent'
import parse from 'csv-parse/lib/sync'
import DailyData from '@/model/dailydata'
import CantonData from '@/model/cantondata'

function initializedMap(): Map<string,Array<DailyData>> {
  const CANTONS = [
    "AG",
    "AI",
    "AR",
    "BE",
    "BL",
    "BS",
    "FR",
    "GE",
    "GL",
    "GR",
    "JU",
    "LU",
    "NE",
    "NW",
    "OW",
    "SG",
    "SH",
    "SO",
    "SZ",
    "TG",
    "TI",
    "UR",
    "VD",
    "VS",
    "ZG",
    "ZH",
    "FL",
    "CH"
  ]
  const map = new Map<string,Array<DailyData>>();
  CANTONS.forEach((i) => map.set(i, new Array<DailyData>()));
  return map;
}

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cases: [] as CantonData[]
  },
  mutations: {
    saveRecords(state, payload) {
      const dataMap = initializedMap();
      // console.log(payload.records);
      payload.records.forEach((val: any) => {
        // console.log(val);

        const canton = val.abbreviation_canton_and_fl;
        const date = val.date;
        const record = {
          date: date,
          confCases: parseInt(val.ncumul_conf) | 0,
          currHosp: parseInt(val.current_hosp) | 0,
          currIcu: parseInt(val.current_icu) | 0
        } as DailyData;

        const cantonData = dataMap.get(canton);
        if (dataMap.has(canton) && cantonData !== undefined) {
          cantonData.push(record);
        } else {
          console.log("undefined dataMap entry for " + canton);
        }

      });

      const cases = new Array<CantonData>();
      dataMap.forEach((data, canton) => {
        cases.push({
          canton: canton,
          data: data
        } as CantonData)
      });
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

