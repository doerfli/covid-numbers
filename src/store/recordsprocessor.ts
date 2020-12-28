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
    "FL"
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
      .filter((canton) => {
        if (! dataMap.has(canton) ) return true;
        if ((dataMap.get(canton)?.length ?? 0) == 0) { return true; }
        if (dataMap.get(canton)?.slice(-1)[0].date !== date) { return true; }
        if (dataMap.get(canton)?.slice(-1)[0].confCases === 0) { return true; }
      })
      .forEach((canton) => {
        const entries = dataMap.get(canton);
        if (entries !== undefined) {
          if (entries.length == 0) { // first entry missing
            entries.push({
              date: date,
              confCases: 0,
              currHosp: 0,
              currIcu: 0
            } as DailyData)
          } else {
            const lastEntry = entries[entries.length - 1];
            // console.log(date + " " + canton + " - " + lastEntry.confCases);
            if (entries.length > 2 && lastEntry.date === date) { // last entry is current day
              if (entries[entries.length - 1].date === date) { // and confCases == 0 (records contained 0 confCases entry instead of latest value) - duplicate latest value instead
                entries.pop();
                const dayBefore = entries[entries.length - 1];
                entries.push({
                  date: date,
                  confCases: dayBefore.confCases,
                  currHosp: dayBefore.currHosp,
                  currIcu: dayBefore.currIcu
                } as DailyData);
              }
            } else { // missing entry for this date (not contained in records) - copy latest one
              entries.push({
                date: date,
                confCases: lastEntry.confCases,
                currHosp: lastEntry.currHosp,
                currIcu: lastEntry.currIcu
              } as DailyData);
            }
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
      // console.log(canton);
      // console.log(data);
      confCases += data?.confCases ?? 0;
      currHosp += data?.currHosp ?? 0;
      currIcu += data?.currIcu ?? 0;
    });
    const d = {
      date: currentDay,
      confCases: confCases,
      currHosp: currHosp,
      currIcu: currIcu
    } as DailyData;
    // console.log(d);
    totalCh.push(d);
  }

  /**
   * adds missing entries and calculates totals for day across all cantons
   */
  private updateCurrentDayData (currentDay: string, recordDate: string, totalCh: DailyData[], dataMap: Map<string, DailyData[]>) {
    if (recordDate !== currentDay) {
      // console.log(data.date + " <- " + currentDay)
      this.completeDataMap(currentDay, dataMap);
      this.calculateTotal(currentDay, dataMap, totalCh);
      return recordDate;
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

      currentDay = this.updateCurrentDayData(currentDay, record.date, totalCh, dataMap);

      const cantonData = dataMap.get(canton);
      if (dataMap.has(canton) && cantonData !== undefined) {
        cantonData.push(record);
      } else {
        console.log("undefined dataMap entry for " + canton);
      }
    });

    currentDay = this.updateCurrentDayData(currentDay, "2100-01-01", totalCh, dataMap);

    // set total ch data
    dataMap.set("CH", totalCh);

    return dataMap;
  }

}
