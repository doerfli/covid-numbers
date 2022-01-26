import { Module } from 'vuex'
import superagent from 'superagent'
import CantonData from '@/model/cantondata'
import RecordsProcessor from '@/utils/records-processor'
import DataSetEntity from '@/model/dataSetEntity'
import DailyIncidence from '@/model/dailyIncidence'
import StaticData from '@/store/staticdata'
import Papa from 'papaparse'
import moment from "moment/moment";

function calculateWeekKey(date: moment.Moment, todayWeekday = -1) {
  const weekday = date.weekday();
  let year = date.year();
  const month = date.month();
  let week = date.week();
  if (todayWeekday > -1 && weekday > todayWeekday) {
    week = week + 1;
  }
  if (month == 0 && week >= 52) { // if date in january but week is 52 or 53, then week key belongs to last year
    year = year - 1;
  }
  return year.toString() + "_" + week.toString();
}

function aggregateDataPerWeek(dataset: DataSetEntity[]) {
  const x = dataset.reduce(function (weekMap: Map<string, DataSetEntity>, currentDay: DataSetEntity) {
    const weekKey = calculateWeekKey(moment(currentDay.date, "YYYY-MM-DD"));
    console.log(weekKey + " " + currentDay.date);
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

function aggregateDataPerSevenDays(dataset: DataSetEntity[]) {
  const todayWeekday = moment().weekday();
  const x = dataset.reduce(function (weekMap: Map<string, DataSetEntity>, currentDay: DataSetEntity) {
    const weekKey = calculateWeekKey(moment(currentDay.date, "YYYY-MM-DD"), todayWeekday);
    console.log(weekKey + " " + currentDay.date);
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
      return aggregateDataPerWeek(data);
    }),
    dataPerCantonPerSevenDays: ((state) => (canton: string, numDays: number) => {
      // console.log(canton);
      const cantonData = state.cases.filter((x: CantonData) => { return x.canton == canton});
      // console.log(cantonData);
      if (cantonData.length == 0) {
        return new Array<DataSetEntity>();
      }
      const data = cantonData[0].data.slice(-numDays);
      return aggregateDataPerSevenDays(data);
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



