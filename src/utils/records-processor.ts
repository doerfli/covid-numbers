import DailyDataSet from '@/model/dailyDataSet'
import StaticData from '@/store/staticdata'

export  default class RecordsProcessor {

  // eslint-disable-next-line
  public process(records: any[]): Map<string, DailyDataSet[]> {
    // canton -> Array<DailyData>
    const dataMap: Map<string, DailyDataSet[]> = this.initializedMap();
    // console.log(payload.records);
    const totalCh = new Array<DailyDataSet>();
    let currentDay: string = records[0].date;

    // loop over all records and store in DailyData structure by canton
    // eslint-disable-next-line
    records.forEach((val: any) => {
      // console.log(val);

      const canton = val.abbreviation_canton_and_fl;
      if (canton === "FL") {
        return;
      }

      const record = RecordsProcessor.parseRecord(val);

      if (record.confCases === undefined) {
        record.confCases = dataMap.get(canton)?.slice(-1)[0]?.confCases ?? 0;
      }
      if (record.currHosp === undefined) {
        record.currHosp = dataMap.get(canton)?.slice(-1)[0]?.currHosp ?? 0;
      }
      if (record.currIcu === undefined) {
        record.currIcu = dataMap.get(canton)?.slice(-1)[0]?.currIcu ?? 0;
      }
      if (record.deceased === undefined) {
        record.deceased = dataMap.get(canton)?.slice(-1)[0]?.deceased ?? 0;
      }

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

  private initializedMap(): Map<string,Array<DailyDataSet>> {
    const map = new Map<string,Array<DailyDataSet>>();
    StaticData.getCantons().forEach((i) => map.set(i, new Array<DailyDataSet>()));
    return map;
  }

  // eslint-disable-next-line
  private static parseRecord (val: any): DailyDataSet {
    return {
      date: val.date,
      confCases: parseInt(val.ncumul_conf) || undefined,
      currHosp: parseInt(val.current_hosp) || undefined,
      currIcu: parseInt(val.current_icu) || undefined,
      deceased: parseInt(val.ncumul_deceased) || undefined
    } as DailyDataSet;
  }

  /**
   * adds missing entries and calculates totals for day across all cantons
   */
  private updateCurrentDayData (currentDay: string, recordDate: string, totalCh: DailyDataSet[], dataMap: Map<string, DailyDataSet[]>) {
    if (recordDate !== currentDay) {
      // console.log(data.date + " <- " + currentDay)
      this.completeDataMap(currentDay, dataMap);
      this.calculateTotal(currentDay, dataMap, totalCh);
      return recordDate;
    }

    return currentDay;
  }

  /**
   * check every canton has an entry, if not, copy last entry
   */
  private completeDataMap (date: string, dataMap: Map<string, DailyDataSet[]>) {
    StaticData.getCantons()
      .filter((canton) => {
        if (! dataMap.has(canton) ) return true;
        if ((dataMap.get(canton)?.length ?? 0) == 0) { return true; }
        if (dataMap.get(canton)?.slice(-1)[0].date !== date) { return true; }
      })
      .forEach((canton) => {
        const entries = dataMap.get(canton);
        if (entries !== undefined) {
          if (entries.length == 0) { // first entry missing
            entries.push({
              date: date,
              confCases: 0,
              currHosp: 0,
              currIcu: 0,
              deceased: 0,
            } as DailyDataSet)
          } else {
            const lastEntry = entries[entries.length - 1];
            // console.log(date + " " + canton + " - " + lastEntry.confCases);
              entries.push({
                date: date,
                confCases: lastEntry.confCases,
                currHosp: lastEntry.currHosp,
                currIcu: lastEntry.currIcu,
                deceased: lastEntry.deceased,
              } as DailyDataSet);

          }
        }
      });
  }

  /**
   * calculate total for this day across all cantons and push to totals array
   */
  private calculateTotal(currentDay: string, dataMap: Map<string, DailyDataSet[]>, totalCh: DailyDataSet[]) {
    let confCases = 0;
    let currHosp = 0;
    let currIcu = 0;
    let currDeceased = 0;

    StaticData.getCantons().forEach((canton) => {
      const data = dataMap.get(canton)?.slice(-1)[0];
      // console.log(canton);
      // console.log(data);
      confCases += data?.confCases ?? 0;
      currHosp += data?.currHosp ?? 0;
      currIcu += data?.currIcu ?? 0;
      currDeceased += data?.deceased ?? 0;
    });
    const d = {
      date: currentDay,
      confCases: confCases,
      currHosp: currHosp,
      currIcu: currIcu,
      deceased: currDeceased,
    } as DailyDataSet;
    // console.log(d);
    totalCh.push(d);
  }

}
