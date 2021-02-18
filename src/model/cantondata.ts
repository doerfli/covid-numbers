import DailyDataSet from '@/model/dailyDataSet'
import VaccDataSet from '@/model/vaccDataSet'

interface CantonData {
  canton: string;
  data: Array<DailyDataSet>;
  vaccData: Array<VaccDataSet>;
}

export default CantonData;
