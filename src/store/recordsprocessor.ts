import DailyData from '@/model/dailydata'

export  default class RecordsProcessor {

  private CANTONS = [
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

  private initializedMap(): Map<string,Array<DailyData>> {
    const map = new Map<string,Array<DailyData>>();
    this.CANTONS.forEach((i) => map.set(i, new Array<DailyData>()));
    return map;
  }

  /**
   * check every canton has an entry, if not, copy last entry
   */
  private completeDataMap (date: string, dataMap: Map<string, DailyData[]>) {
    this.CANTONS
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
            const lastEntry = entries[entries.length - 1];
            entries.push({
              date: date,
              confCases: lastEntry.confCases,
              currHosp: lastEntry.currHosp,
              currIcu: lastEntry.currIcu
            } as DailyData);
          }
        }
      });
  }

  /**
   * calculate total for this day across all cantons and push to totals array
   */
  private calculateTotal(currentDay: string, dataMap: Map<string, DailyData[]>, totalCh: DailyData[]) {
    let confCases = 0;
    let currHosp = 0;
    let currIcu = 0;

    this.CANTONS.forEach((canton) => {
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
  private updateCurrentDayData (currentDay: string, data: DailyData, totalCh: DailyData[], dataMap: Map<string, DailyData[]>) {
    if (data.date !== currentDay) {
      // console.log(data.date + " <- " + currentDay)
      this.completeDataMap(currentDay, dataMap);
      this.calculateTotal(currentDay, dataMap, totalCh);
      return data.date;
    }

    return currentDay;
  }

  private static parseRecord (val: any) {
    return {
      date: val.date,
      confCases: parseInt(val.ncumul_conf) | 0,
      currHosp: parseInt(val.current_hosp) | 0,
      currIcu: parseInt(val.current_icu) | 0
    } as DailyData
  }

  public process(records: any[]): Map<string, DailyData[]> {
    // canton -> Array<DailyData>
    const dataMap: Map<string, DailyData[]> = this.initializedMap();
    // console.log(payload.records);
    const totalCh = new Array<DailyData>();
    let currentDay: string = records[0].date;

    // loop over all records and store in DailyData structure by canton
    records.forEach((val: any) => {
      // console.log(val);

      const canton = val.abbreviation_canton_and_fl;
      const record = RecordsProcessor.parseRecord(val);

      currentDay = this.updateCurrentDayData(currentDay, record, totalCh, dataMap);

      const cantonData = dataMap.get(canton);
      if (dataMap.has(canton) && cantonData !== undefined) {
        cantonData.push(record);
      } else {
        console.log("undefined dataMap entry for " + canton);
      }

    });

    // set total ch data
    dataMap.set("CH", totalCh);

    return dataMap;
  }

}
