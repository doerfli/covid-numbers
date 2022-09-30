import DataSetEntity from '@/model/dataSetEntity'
import StaticData from '@/store/staticdata'
import getProperty from '@/utils/get-property'

export  default class RecordsProcessor {

  // eslint-disable-next-line
  public process(records: any[]): Map<string, DataSetEntity[]> {
    // canton -> Array<DailyData>
    const dataMap: Map<string, DataSetEntity[]> = this.initializedMap();
    // console.log(payload.records);
    const totalCh = new Array<DataSetEntity>();
    let currentDay: string = records[0].date;

    const beginTime = new Date().getTime();

    // loop over all records and store in DailyData structure by canton
    // eslint-disable-next-line
    records.forEach((val: any) => {
      // console.log(val);

      if (val.date < "2020-01-01") {
        return;
      }

      const canton = val.abbreviation_canton_and_fl;
      if (canton === '' || canton === "FL") {
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

    const afterRecordsProcessingTime = new Date().getTime();

    // set total ch data
    dataMap.set("CH", totalCh);

    this.calculateChgAndAverages(dataMap);

    const afterAvgCalculationTime = new Date().getTime();
    console.log(`records processing duration: ${afterRecordsProcessingTime - beginTime}ms`);
    console.log(`calculation of chg and avg duration: ${afterAvgCalculationTime - afterRecordsProcessingTime}ms`);
    console.log(`total calculation duration: ${afterAvgCalculationTime - beginTime}ms`);

    return dataMap;
  }

  private calculateChgAndAverages (dataMap: Map<string, DataSetEntity[]>) {
    dataMap.forEach((dataset) => {
      dataset.forEach((dailyData, i) => {
        if (i > 0) {
          dailyData.confCasesChg = dailyData.confCases - dataset[i - 1].confCases;
          dailyData.currHospChg = dailyData.currHosp - dataset[i - 1].currHosp;
          dailyData.currIcuChg = dailyData.currIcu - dataset[i - 1].currIcu;
          dailyData.deceasedChg = dailyData.deceased - dataset[i - 1].deceased;
        }
        if (i >= 6) {
          dailyData.confCasesChgAvg = this.calcAvg(dataset, i, "confCasesChg");
          dailyData.currHospAvg = this.calcAvg(dataset, i, "currHosp");
          dailyData.currHospChgAvg = this.calcAvg(dataset, i, "currHospChg");
          dailyData.currIcuAvg = this.calcAvg(dataset, i, "currIcu");
          dailyData.currIcuChgAvg = this.calcAvg(dataset, i, "currIcuChg");
          dailyData.deceasedChgAvg = this.calcAvg(dataset, i, "deceasedChg");
        }
      });
    })
  }

  private calcAvg(dataset: DataSetEntity[], i: number, fieldname: any, duration = 7) {
    return Math.round(
      dataset.slice(i - duration + 1, i + 1)
        .map((x) => getProperty(x, fieldname))
        .reduce((sum, current) => sum + current)
      / duration
    );
  }

  private initializedMap(): Map<string,Array<DataSetEntity>> {
    const map = new Map<string,Array<DataSetEntity>>();
    StaticData.getCantons().forEach((i) => map.set(i, new Array<DataSetEntity>()));
    return map;
  }

  // eslint-disable-next-line
  private static parseRecord (val: any): DataSetEntity {
    return {
      date: val.date,
      confCases: parseInt(val.ncumul_conf) || undefined,
      currHosp: parseInt(val.current_hosp) || undefined,
      currIcu: parseInt(val.current_icu) || undefined,
      deceased: parseInt(val.ncumul_deceased) || undefined
    } as DataSetEntity;
  }

  /**
   * adds missing entries and calculates totals for day across all cantons
   */
  private updateCurrentDayData (currentDay: string, recordDate: string, totalCh: DataSetEntity[], dataMap: Map<string, DataSetEntity[]>) {
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
  private completeDataMap (date: string, dataMap: Map<string, DataSetEntity[]>) {
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
            } as DataSetEntity)
          } else {
            const lastEntry = entries[entries.length - 1];
            // console.log(date + " " + canton + " - " + lastEntry.confCases);
              entries.push({
                date: date,
                confCases: lastEntry.confCases,
                currHosp: lastEntry.currHosp,
                currIcu: lastEntry.currIcu,
                deceased: lastEntry.deceased,
              } as DataSetEntity);

          }
        }
      });
  }

  /**
   * calculate total for this day across all cantons and push to totals array
   */
  private calculateTotal(currentDay: string, dataMap: Map<string, DataSetEntity[]>, totalCh: DataSetEntity[]) {
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
    } as DataSetEntity;
    // console.log(d);
    totalCh.push(d);
  }

}
