import DailyData from '@/model/dailydata'

interface CantonData {
  canton: string;
  data: Array<DailyData>;
}

export default CantonData;
