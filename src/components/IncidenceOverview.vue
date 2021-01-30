<template>
  <div>
    <div class="case w-full md:w-1/2 lg:w-1/3 mb-4">
      <div class="flex justify-between">
        <div class="">
          <H2 class="pl-2">
            {{ getCanton }}
          </H2>
        </div>
      </div>
      <BarChart class="barchart w-full h-80"
                v-bind:data="incidenceData"
                />
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import H2 from '@/components/base/H2.vue'
import DailyIncidence from '@/model/dailyIncidence'
import formatDate from '@/utils/format-date'

@Component({
  components: { H2, BarChart }
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
    // TODO make range configurable
    return inc.slice(-180).map((x: DailyIncidence) => {
      return {
        xValue: formatDate(x.date),
        y2Value: x.incidence
      } as DataPoint;
    });
  }
}
</script>

<style scoped>

</style>

