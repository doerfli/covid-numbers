interface DailyDataSet {
  date: string;
  confCases: number;
  confCasesChg: number;
  confCasesChgAvg: number;
  currHosp: number;
  currHospAvg: number;
  currIcu: number;
  currIcuAvg: number;
  deceased: number;
  deceasedChg: number;
  deceasedChgAvg: number;
}

export default DailyDataSet;
