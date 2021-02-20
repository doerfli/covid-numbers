import DailyDataSet from '@/model/dailyDataSet'
import StaticData from '@/store/staticdata'
import VaccDataSet from '@/model/vaccDataSet'

export  default class VaccRecordsProcessor {

  // eslint-disable-next-line
  public process(records: any[]): Map<string, VaccDataSet[]> {
    // canton -> Array<DailyData>
    const dataMap: Map<string, VaccDataSet[]> = this.initializedMap();
    // console.log(payload.records);
    let currentDay: string = records[0].date;

    const beginTime = new Date().getTime();

    // loop over all records and store in DailyData structure by canton
    // eslint-disable-next-line
    records.forEach((val: any) => {
      // console.log(val);

      const canton = val.canton;
      if (canton === "FL" || canton === "CHFL") {
        return;
      }

      const record = VaccRecordsProcessor.parseRecord(val);

      if (record.fullyVaccinatedTotal === undefined) {
        record.fullyVaccinatedTotal = dataMap.get(canton)?.slice(-1)[0]?.fullyVaccinatedTotal ?? 0;
      }
      if (record.fullyVaccinatedPer100 === undefined) {
        record.fullyVaccinatedPer100 = dataMap.get(canton)?.slice(-1)[0]?.fullyVaccinatedPer100 ?? 0;
      }

      currentDay = this.updateCurrentDayData(currentDay, record.date, dataMap);

      const cantonData = dataMap.get(canton);
      if (dataMap.has(canton) && cantonData !== undefined) {
        cantonData.push(record);
      } else {
        console.log("undefined dataMap entry for " + canton);
      }
    });

    currentDay = this.updateCurrentDayData(currentDay, "2100-01-01", dataMap);

    const afterRecordsProcessingTime = new Date().getTime();

    console.log(`vacc records processing duration: ${afterRecordsProcessingTime - beginTime}ms`);

    return dataMap;
  }

  // private calculateChgAndAverages (dataMap: Map<string, DailyDataSet[]>) {
  //   dataMap.forEach((dataset) => {
  //     dataset.forEach((dailyData, i) => {
  //       if (i > 0) {
  //         dailyData.confCasesChg = dailyData.confCases - dataset[i - 1].confCases;
  //         dailyData.currHospChg = dailyData.currHosp - dataset[i - 1].currHosp;
  //         dailyData.currIcuChg = dailyData.currIcu - dataset[i - 1].currIcu;
  //         dailyData.deceasedChg = dailyData.deceased - dataset[i - 1].deceased;
  //       }
  //       if (i >= 6) {
  //         dailyData.confCasesChgAvg = this.calcAvg(dataset, i, "confCasesChg");
  //         dailyData.currHospAvg = this.calcAvg(dataset, i, "currHosp");
  //         dailyData.currIcuAvg = this.calcAvg(dataset, i, "currIcu");
  //         dailyData.deceasedChgAvg = this.calcAvg(dataset, i, "deceasedChg");
  //       }
  //     });
  //   })
  // }

  // private calcAvg(dataset: DailyDataSet[], i: number, fieldname: any, duration = 7) {
  //   return Math.round(
  //     dataset.slice(i - duration + 1, i + 1)
  //       .map((x) => getProperty(x, fieldname))
  //       .reduce((sum, current) => sum + current)
  //     / duration
  //   );
  // }

  private initializedMap(): Map<string,Array<VaccDataSet>> {
    const map = new Map<string,Array<VaccDataSet>>();
    StaticData.getCantonsWithCh().forEach((i) => map.set(i, new Array<VaccDataSet>()));
    return map;
  }

  // eslint-disable-next-line
  private static parseRecord (val: any): VaccDataSet {
    return {
      date: val.date,
      deliveredTotal: parseFloat(val.deliveredTotal) || undefined,
      deliveredPer100: parseFloat(val.deliveredPer100) || undefined,
      administeredTotal: parseFloat(val.administeredTotal) || undefined,
      administeredPer100: parseFloat(val.administeredPer100) || undefined,
      fullyVaccinatedTotal: parseFloat(val.fullyVaccinatedTotal) || undefined,
      fullyVaccinatedPer100: parseFloat(val.fullyVaccinatedPer100) || undefined,
    } as VaccDataSet;
  }

  /**
   * adds missing entries and calculates totals for day across all cantons
   */
  private updateCurrentDayData (currentDay: string, recordDate: string, dataMap: Map<string, VaccDataSet[]>) {
    if (recordDate !== currentDay) {
      // console.log(data.date + " <- " + currentDay)
      // this.completeDataMap(currentDay, dataMap);
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



}
