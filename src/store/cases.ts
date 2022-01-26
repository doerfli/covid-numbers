import { Module } from 'vuex'
import superagent from 'superagent'
import CantonData from '@/model/cantondata'
import RecordsProcessor from '@/utils/records-processor'
import DataSetEntity from '@/model/dataSetEntity'
import DailyDiff from '@/model/dailyDiff'
import DailyIncidence from '@/model/dailyIncidence'
import StaticData from '@/store/staticdata'
import Papa from 'papaparse'

function calculateAverageValue (newCases: Array<DailyDiff>, averageWindowSize: number) {
  return newCases.map((value: DailyDiff, idx: number, arr: DailyDiff[]) => {
    let avg = null

    // calculate from first valid position (averageSlidingWindow) up to the last - since last day data is never complete, this day is ignored
    if (idx >= averageWindowSize && idx < arr.length - 1) {
      avg = Math.round(
        arr.slice(idx - averageWindowSize + 1, idx + 1)
          .map((x) => x.value)
          .reduce((sum, current) => sum + current)
        / averageWindowSize
      )
    }

    return {
      date: value.date,
      fieldName: value.fieldName,
      value: value.value,
      avg: avg
    } as DailyDiff
  })
}

// eslint-disable-next-line
const casesModule: Module<any, any> = {
  namespaced: true,
  state: {
    cases: [] as CantonData[]
  },
  mutations: {
    saveRecords(state, payload) {
      // create array entry per canton
      const cases = new Array<CantonData>();
      payload.dataMap.forEach((data: DataSetEntity[], canton: string) => {
        cases.push({
          canton: canton,
          data: data
        } as CantonData)
      });

      // update cases
      state.cases = Object.freeze(cases);
      console.log("cases saved");
    }
  },
  actions: {
    async fetch({ commit }) {
      const url = "https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv";
      const response = await superagent.get(url)
      const parseResult = Papa.parse(response.text, {
        header: true,
        skipEmptyLines: true,
      });

      // filter ar data
      let dataset = parseResult.data.filter((row: any) => row.abbreviation_canton_and_fl !== "AR");

      // workaround - get ar data from foph
      const arUrl = "https://raw.githubusercontent.com/doerfli/foph-covid19-data/main/cases/cases_AR.csv";
      const arResponse = await superagent.get(arUrl)
      const arParseResult = Papa.parse(arResponse.text, {
        header: true,
        skipEmptyLines: true,
      });

      // merge with foph ar data
      dataset = dataset.concat(arParseResult.data);
      // and sort by date again
      dataset.sort((a: any, b: any) => {
        if ( a.date < b.date ){
          return -1;
        }
        if ( a.date > b.date ){
          return 1;
        }
        return 0;
      });

      // console.log(parseResult);
      const dataMap = new RecordsProcessor().process(dataset);
      commit("saveRecords", { dataMap });
    }
  },
  getters: {
    // get data for a canton
    dataPerCanton: ((state) => (canton: string) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DataSetEntity>();
      }
      return cantonData[0].data;
    }),
    incidence: ((state, getters) =>
      (canton: string,
        // eslint-disable-next-line
        fieldName: any = "confCases",
        windowSize = 7): Array<DailyIncidence> => {

      return getters.dataPerCanton(canton).map((dataPoint: DataSetEntity, idx: number, arr: Array<DataSetEntity>) => {
        let incidence = null;

        // calculate from first value data point up to second last day (current day data is rarely complete)
        if (idx > windowSize && idx < arr.length - 1) {
          let pop = StaticData.getPopulation(canton);
          if (canton === "CH") {
            pop = StaticData.getTotalPopulation();
          }
          const totalLastWindowSlice = arr.slice(idx - windowSize + 1, idx + 1)
            .map((x) => x.confCasesChg)
            .reduce((sum, current) => sum + current);
          incidence = totalLastWindowSlice / pop * 100000;
        }

        return {
          date: dataPoint.date,
          incidence: incidence
        } as DailyIncidence;
      });
    })
  }
};

export default casesModule;



