<template>
  <tr>
    <td>{{ getCanton }}</td>
    <td>{{ latestValue }}</td>
    <td class="pb-3">
      <AreaChart class="areachart w-full h-10"
                 v-bind:data="incidenceData"
      />
    </td>
  </tr>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import H2 from '@/components/base/H2.vue'
import DailyIncidence from '@/model/dailyIncidence'
import formatDate from '@/utils/format-date'
import AreaChart from '@/components/charts/AreaChart.vue'

@Component({
  components: { H2, AreaChart }
})
export default class IncidenceMiniChart extends Vue {

  @Prop({ default: 'confCases'})
  private fieldToShow!: any;
  @Prop()
  private name!: string;
  @Prop()
  private shortName!: string;

  get getCanton() {
    return this.name;
  }

  get incidenceData(): Array<DataPoint> {
    // console.log("incidenceData for " + this.getCanton);

    const inc = this.$store.getters["cases/incidence"](this.shortName, this.fieldToShow) as Array<DailyIncidence>;
    const range = inc.slice(-180);

    // TODO make range configurable
    const data = range.slice(0, range.length - 1).map((x: DailyIncidence) => {
      return {
        xValue: formatDate(x.date),
        yValue: x.incidence
      } as DataPoint;
    });

    if (data.length > 1) {
      this.$emit("start-date", data[0].xValue);
      this.$emit("end-date", data[data.length - 1].xValue);
    }

    return data;
  }

  get latestValue() {
    if (this.incidenceData.length == 0) {
      return "";
    }
    return this.incidenceData[this.incidenceData.length - 1].yValue.toFixed(0);
  }
}
</script>

<style scoped>
  td {
    @apply pr-3 pb-3;
    @apply align-bottom;
  }
  td:nth-child(2) {
    @apply text-right;
  }
</style>

