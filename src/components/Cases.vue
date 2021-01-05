<template>
  <div class="case w-full md:w-1/2 lg:w-1/3">
    <H2>{{ getCanton }}</H2>
    <BarChart class="barchart w-full h-80"
              v-bind:data="newCases" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DailyData from '@/model/dailydata'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import CantonData from '@/model/cantondata'
import H2 from '@/components/base/H2.vue'

@Component({
  components: { H2, BarChart }
})
export default class Cases extends Vue {

  @Prop({ default: 28 })
  private daysToShow!: number;
  @Prop({ default: 'confCases'})
  private fieldToShow!: string;
  @Prop()
  private canton!: string;
  @Prop({ default: false })
  private calculateAverage!: boolean;
  @Prop({ default: 7 })
  private averageSlidingWindow!: number;

  get getCanton() {
    return this.canton;
  }

  get getCases(): Array<CantonData> {
    const t = this.$store.state.cases.cases;
    // console.log(t);
    return t.filter((x: CantonData) => { return x.canton == this.getCanton});
  }

  @Watch("getCases", { deep: true} )
  casesMapChanged(casesNew: Array<CantonData>) {
    // console.log("casesMapChanged");
    // console.log(casesNew);
    if (casesNew.length == 0) {
      return;
    }
  }

  get newCases(): Array<DataPoint> {
    const newCases = this.$store.getters["cases/calculateDailyDiff"](this.canton, this.fieldToShow, this.averageSlidingWindow);
    // console.log(1111);
    // console.log(newCases);

    // limit to last x days and map to datapoints for display
    return newCases.slice(-this.daysToShow).map((x: DailyData) => {
      return {
        xValue: `${x.date.substr(8, 2)}.${x.date.substr(5, 2)}.`,
        yValue: x.newCases,
        y2Value: x.newCasesAvg
      } as DataPoint
    });
  }

}
</script>

<style scoped>
</style>

