import DataSetEntity from '@/model/dataSetEntity'
import VaccDataSet from '@/model/vaccDataSet'

interface CantonData {
  canton: string;
  data: Array<DataSetEntity>;
  vaccData: Array<VaccDataSet>;
}

export default CantonData;
