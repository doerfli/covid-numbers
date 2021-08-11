interface VaccDataSet {
  date: string;
  deliveredTotal: number;
  deliveredPer100: number;
  administeredTotal: number;
  administeredChg: number;
  administeredPer100: number;
  fullyVaccinatedTotal: number;
  fullyVaccinatedChg: number;
  fullyVaccinatedPer100: number;
  oneDoseVaccinatedTotal: number;
  oneDoseVaccinatedPer100: number;
}

export default VaccDataSet;
