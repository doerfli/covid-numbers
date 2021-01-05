import { Module } from 'vuex'
import superagent from 'superagent'
import parse from 'csv-parse/lib/sync'
import CantonData from '@/model/cantondata'
import RecordsProcessor from '@/store/recordsprocessor'
import DailyDataSet from '@/model/dailyDataSet'

// credit: Typescript documentation, src
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#index-types
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}

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
  getters: {
    // get data for a canton
    dataPerCanton: ((state) => (canton: string) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DailyDataSet>();
      }
      return cantonData[0].data;
    }),
    // TODO make this return another (generic) object instead if DailyData
    calculateDailyDiff: ((state, getters) => (canton: string, fieldName: any, averageWindowSize = 0): Array<DailyDataSet> => {
      let last = 0;
      let newCases = getters.dataPerCanton(canton).map((dataPoint: DailyDataSet, idx: number) => {
        const value = getProperty(dataPoint, fieldName);
        if (idx == 0) { // first datapoint
          last = value;
          return null;
        }
        if (value == 0) { // missing datapoint (delivered with value == 0)
          return {
            date: dataPoint.date,
            newCases: 0
          } as DailyDataSet;
        }
        const n = value - last;
        last = value;

        return {
          date: dataPoint.date,
          newCases: n
        } as DailyDataSet;
      }).filter((v: DailyDataSet | null) => v != null) as Array<DailyDataSet>;

      if (averageWindowSize > 0) {
        // calculate sliding window average
        newCases = newCases.map((value: DailyDataSet, idx: number, arr: DailyDataSet[]) => {
          let avg = null;

          // calculate from first valid position (averageSlidingWindow) up to the last - since last day data is never complete, this day is ignored
          if (idx >= averageWindowSize && idx < arr.length - 1) {
            avg = Math.round(
              arr.slice(idx - averageWindowSize + 1, idx + 1)
                .map((x) => x.newCases)
                .reduce((sum, current) => sum + current)
              / averageWindowSize
            );
          }

          return {
            date: value.date,
            newCases: value.newCases,
            newCasesAvg: avg
          } as DailyDataSet;
        });
      }

      // console.log(0);
      // console.log(newCases);
      return newCases;
    })
  }
};

export default casesModule;



