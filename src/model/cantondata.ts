import DailyDataSet from '@/model/dailyDataSet'

interface CantonData {
  canton: string;
  data: Array<DailyDataSet>;
}

export default CantonData;
