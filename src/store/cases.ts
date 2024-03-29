import { Module } from 'vuex'
import superagent from 'superagent'
import CantonData from '@/model/cantondata'
import RecordsProcessor from '@/utils/records-processor'
import DataSetEntity from '@/model/dataSetEntity'
import DailyIncidence from '@/model/dailyIncidence'
import StaticData from '@/store/staticdata'
import Papa from 'papaparse'
import moment from "moment/moment";

function calculateWeekKey(date: moment.Moment, today: moment.Moment | null = null) {
  const weekday = date.weekday();
  let year = date.year();
  const month = date.month();
  let week = date.week();
  if (today != null) {
    if (weekday > today.weekday()) { // days in the week after threshold day (weekday of today) are added to next week
      week = date.add(1, "week").week();
    }
  }
  if (month == 0 && week >= 52) { // if date in january but week is 52 or 53, then week key belongs to last year
    year = date.add(-1, "week").year();
  }
  return year.toString() + "_" + week.toString();
}

function aggregateDataPerWeek(dataset: DataSetEntity[], calculateKey: (date: string) => string) {
  const x = dataset.reduce(function (weekMap: Map<string, DataSetEntity>, currentDay: DataSetEntity) {
    const weekKey = calculateKey(currentDay.date);
    if (weekMap.has(weekKey)) {
      const wk = weekMap.get(weekKey) as DataSetEntity;
      weekMap.set(weekKey, {
        date: wk.date,
        confCases: wk.confCases + currentDay.confCases,
        confCasesChg: wk.confCasesChg + currentDay.confCasesChg,
        confCasesChgAvg: wk.confCasesChgAvg + currentDay.confCasesChgAvg,
        currHosp: wk.currHosp + currentDay.currHosp,
        currHospChg: wk.currHospChg + currentDay.currHospChg,
        currHospAvg: wk.currHospAvg + currentDay.currHospAvg,
        currIcu: wk.currIcu + currentDay.currIcu,
        currIcuChg: wk.currIcuChg + currentDay.currIcuChg,
        currIcuAvg: wk.currIcuAvg + currentDay.currIcuAvg,
        deceased: wk.deceased + currentDay.deceased,
        deceasedChg: wk.deceasedChg + currentDay.deceasedChg,
        deceasedChgAvg: wk.deceasedChgAvg + currentDay.deceasedChgAvg,
      } as DataSetEntity);
    } else {
      weekMap.set(weekKey, {
        date: currentDay.date,
        confCases: currentDay.confCases,
        confCasesChg: currentDay.confCasesChg,
        confCasesChgAvg: currentDay.confCasesChgAvg,
        currHosp: currentDay.currHosp,
        currHospChg: currentDay.currHospChg,
        currHospAvg: currentDay.currHospAvg,
        currIcu: currentDay.currIcu,
        currIcuChg: currentDay.currIcuChg,
        currIcuAvg: currentDay.currIcuAvg,
        deceased: currentDay.deceased,
        deceasedChg: currentDay.deceasedChg,
        deceasedChgAvg: currentDay.deceasedChgAvg,
      } as DataSetEntity);
    }
    return weekMap;
  }, new Map()).values();
  return [...x];
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
      const url = "https://raw.githubusercontent.com/doerfli/foph-covid19-data/main/cases/cases_total.csv";
      const response = await superagent.get(url)
      const parseResult = Papa.parse(response.text, {
        header: true,
        skipEmptyLines: true,
      });

      // console.log(parseResult);
      const dataMap = new RecordsProcessor().process(parseResult.data);
      commit("saveRecords", { dataMap });
    }
  },
  getters: {
    // get data for a canton
    dataPerCanton: ((state) => (canton: string, numDays: number) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DataSetEntity>();
      }
      return cantonData[0].data.slice(-numDays);
    }),
    dataPerCantonPerWeek: ((state) => (canton: string, numDays: number) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DataSetEntity>();
      }
      const data = cantonData[0].data.slice(-numDays);
      return aggregateDataPerWeek(data, (date: string) => {
        const key = calculateWeekKey(moment(date, "YYYY-MM-DD"));
        console.log(`date: ${date} / key: ${key}`);
        return key;
      });
    }),
    dataPerCantonPerSevenDays: ((state) => (canton: string, numDays: number) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DataSetEntity>();
      }
      const data = cantonData[0].data.slice(-numDays);
      const today = moment();
      return aggregateDataPerWeek(data, (date: string) => {
        const key = calculateWeekKey(moment(date, "YYYY-MM-DD"), today);
        console.log(`date: ${date} / key: ${key}`);
        return key;
      });
    }),
    incidence: ((state, getters) =>
      (canton: string,
        // eslint-disable-next-line
        fieldName: any = "confCases",
        numDays: number,
        windowSize = 7): Array<DailyIncidence> => {

      return getters.dataPerCanton(canton, numDays).map((dataPoint: DataSetEntity, idx: number, arr: Array<DataSetEntity>) => {
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



