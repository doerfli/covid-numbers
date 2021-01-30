<template>
  <div>
    <div class="case w-2/3 mb-4">
      <div class="flex justify-between">
        <div class="">
          <H2 class="pl-2">
            {{ getCanton }}
          </H2>
        </div>
      </div>
      <AreaChart class="areachart w-full h-20"
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
export default class IncidenceOverview extends Vue {

  @Prop({ default: 'confCases'})
  private fieldToShow!: any;
  @Prop()
  private canton!: string;

  get getCanton() {
    return this.canton;
  }

  get incidenceData(): Array<DataPoint> {
    // console.log("incidenceData for " + this.getCanton);

    const inc = this.$store.getters["cases/incidence"](this.canton, this.fieldToShow) as Array<DailyIncidence>;
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

