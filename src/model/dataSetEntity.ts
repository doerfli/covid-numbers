interface DataSetEntity {
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
  currIcuChgAvg: number;
  deceased: number;
  deceasedChg: number;
  deceasedChgAvg: number;
}

export default DataSetEntity;
