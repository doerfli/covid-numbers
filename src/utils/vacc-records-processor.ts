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

      if (val.date < "2020-01-01") {
        return;
      }

      const canton = val.canton;
      if (canton === "FL" || canton === "CHFL") {
        return;
      }

      const record = VaccRecordsProcessor.parseRecord(val);

      currentDay = this.updateCurrentDayData(currentDay, record.date, dataMap);

      const cantonData = dataMap.get(canton);
      if (dataMap.has(canton) && cantonData !== undefined) {
        const yesterdaysData = cantonData.slice(-1);
        if (yesterdaysData.length > 0) {
          record.atLeastOneDoseChg = record.atLeastOneDoseTotal - yesterdaysData[0].atLeastOneDoseTotal;
          record.fullyVaccinatedChg = record.fullyVaccinatedTotal - yesterdaysData[0].fullyVaccinatedTotal;
          record.firstBoosterVaccinatedChg = record.firstBoosterVaccinatedTotal - yesterdaysData[0].firstBoosterVaccinatedTotal;
        }
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

  private initializedMap(): Map<string,Array<VaccDataSet>> {
    const map = new Map<string,Array<VaccDataSet>>();
    StaticData.getCantonsWithCh().forEach((i) => map.set(i, new Array<VaccDataSet>()));
    return map;
  }

  // eslint-disable-next-line
  private static parseRecord (val: any): VaccDataSet {
    const atLeastOneDoseTotal = parseFloat(val.atLeastOneDoseTotal)
    const atLeastOneDosePer100 = parseFloat(val.atLeastOneDosePer100)
    const partiallyVaccTotal = parseFloat(val.partiallyVaccTotal)
    const partiallyVaccPer100 = parseFloat(val.partiallyVaccPer100)
    const fullyVaccinatedTotal = parseFloat(val.fullyVaccinatedTotal)
    const fullyVaccinatedPer100 = parseFloat(val.fullyVaccinatedPer100)
    const firstBoosterVaccinatedTotal = parseFloat(val.firstBoosterVaccinatedTotal)
    const firstBoosterVaccinatedPer100 = parseFloat(val.firstBoosterVaccinatedPer100)
    return {
      date: val.date,
      atLeastOneDoseTotal: atLeastOneDoseTotal || 0,
      atLeastOneDosePer100: atLeastOneDosePer100 || 0,
      atLeastOneDoseChg: 0,
      partiallyVaccTotal: partiallyVaccTotal || 0,
      partiallyVaccPer100: partiallyVaccPer100 || 0,
      partiallyVaccChg: 0,
      fullyVaccinatedTotal: fullyVaccinatedTotal || 0,
      fullyVaccinatedPer100: fullyVaccinatedPer100 || 0,
      fullyVaccinatedChg: 0,
      firstBoosterVaccinatedTotal: firstBoosterVaccinatedTotal || 0,
      firstBoosterVaccinatedPer100: firstBoosterVaccinatedPer100 || 0,
      firstBoosterVaccinatedChg: 0
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

}
