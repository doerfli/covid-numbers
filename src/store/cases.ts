import { Module } from 'vuex'
import superagent from 'superagent'
import parse from 'csv-parse/lib/sync'
import DailyData from '@/model/dailydata'
import CantonData from '@/model/cantondata'

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

function initializedMap(): Map<string,Array<DailyData>> {
  const map = new Map<string,Array<DailyData>>();
  CANTONS.forEach((i) => map.set(i, new Array<DailyData>()));
  return map;
}

/**
 * check every canton has an entry, if not, copy last entry
 */
function completeDataMap (date: string, dataMap: Map<string, DailyData[]>) {
  CANTONS
    .filter((canton) => ! dataMap.has(canton) || ( dataMap.get(canton)?.length ?? 0) == 0 || dataMap.get(canton)?.slice(-1)[0].date !== date)
    .forEach((canton) => {
      const entries = dataMap.get(canton);
      if (entries !== undefined) {
        if (entries.length == 0) {
          entries.push({
            date: date,
            confCases: 0,
            currHosp: 0,
            currIcu: 0
          } as DailyData)
        } else {
          const lastEntry = entries.slice(-1)[0];
          entries.push(lastEntry);
        }
        dataMap.set(canton, entries);
      }
    });
}

/**
 * calculate total for this day across all cantons and push to totals array
 */
function calculateTotal(currentDay: string, dataMap: Map<string, DailyData[]>, totalCh: DailyData[]) {
  let confCases = 0;
  let currHosp = 0;
  let currIcu = 0;

  CANTONS.forEach((canton) => {
    const data = dataMap.get(canton)?.slice(-1)[0];
    confCases += data?.confCases ?? 0;
    currHosp += data?.currHosp ?? 0;
    currIcu += data?.currIcu ?? 0;
  });
  totalCh.push({
    date: currentDay,
    confCases: confCases,
    currHosp: currHosp,
    currIcu: currIcu
  } as DailyData);
}

/**
 * adds missing entries and calculates totals for day across all cantons
 */
function updateCurrentDayData (currentDay: string, data: DailyData, totalCh: DailyData[], dataMap: Map<string, DailyData[]>) {
  if (data.date !== currentDay) {
    console.log(data.date + " <- " + currentDay)
    completeDataMap(currentDay, dataMap);
    calculateTotal(currentDay, dataMap, totalCh);
    return data.date;
  }

  return currentDay;
}

function parseRecord (val: any) {
  return {
    date: val.date,
    confCases: parseInt(val.ncumul_conf) | 0,
    currHosp: parseInt(val.current_hosp) | 0,
    currIcu: parseInt(val.current_icu) | 0
  } as DailyData
}

const casesModule: Module<any, any> = {
  namespaced: true as true,
  state: {
    cases: [] as CantonData[]
  },
  mutations: {
    saveRecords(state, payload) {
      // canton -> Array<DailyData>
      const dataMap: Map<string, DailyData[]> = initializedMap();
      // console.log(payload.records);
      const totalCh = new Array<DailyData>();
      let currentDay: string = payload.records[0].date;

      // loop over all records and store in DailyData structure by canton
      payload.records.forEach((val: any) => {
        // console.log(val);

        const canton = val.abbreviation_canton_and_fl;
        const record = parseRecord(val);

        const cantonData = dataMap.get(canton);
        if (dataMap.has(canton) && cantonData !== undefined) {
          cantonData.push(record);
        } else {
          console.log("undefined dataMap entry for " + canton);
        }

        currentDay = updateCurrentDayData(currentDay, record, totalCh, dataMap);
      });

      // set total ch data
      dataMap.set("CH", totalCh);

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

