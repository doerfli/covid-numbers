interface VaccDataSet {
  date: string;
  atLeastOneDoseTotal: number;
  atLeastOneDosePer100: number;
  partiallyVaccTotal: number;
  partiallyVaccPer100: number;
  fullyVaccinatedTotal: number;
  fullyVaccinatedPer100: number;
}

export default VaccDataSet;
