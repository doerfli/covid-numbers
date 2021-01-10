interface DailyDataSet {
  date: string;
  confCases: number;
  currHosp: number;
  currIcu: number;
  newCases: number;
  newCasesAvg: number;
  deceased: number;
  deceasedAvg: number;
}

export default DailyDataSet;
