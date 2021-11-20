interface DailyDataSet {
  date: string;
  confCases: number;
  confCasesChg: number;
  confCasesChgAvg: number;
  currHosp: number;
  currHospChg: number;
  currHospAvg: number;
  currHospChgAvg: number;
  currIcu: number;
  currIcuChg: number;
  currIcuAvg: number;
  deceased: number;
  deceasedChg: number;
  deceasedChgAvg: number;
}

export default DailyDataSet;
