<template>
  <div class="pb-3 flex items-end">
    <div class="flex-initial w-1/6">{{ getCanton }}</div>
    <div class="flex-initial w-1/2 p-1">
      <AreaChart class="areachart w-full h-12"
                 v-bind:data="incidenceData"
      />
    </div>
  </div>
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
    return range.slice(0, range.length - 1).map((x: DailyIncidence) => {
      return {
        xValue: formatDate(x.date),
        yValue: x.incidence
      } as DataPoint;
    });
  }
}
</script>

<style scoped>

</style>

