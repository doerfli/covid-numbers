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
  @Prop()
  private canton!: string;
  @Prop({ default: false })
  private calculateAverage!: boolean;
  @Prop({ default: 7 })
  private averageSlidingWindow!: number;

  private cases: Array<DailyData> = new Array<DailyData>();

  private created() {
    // console.log("created");
    const cases = this.getCases;
    if (cases.length > 0) {
      this.cases = cases[0].data;
    }
  }

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
    this.cases = casesNew[0].data;
  }

  private calculateNewCases(cases: Array<DailyData>): Array<DailyData> {
    // console.log("newCases");
    // console.log(cases);
    let last = 0;
    let newCases = cases.map((value: DailyData, idx: number) => {
      if (idx == 0) {
        last = value.confCases;
        return null;
      }
      if (value.confCases == 0) {
        return {
          date: value.date,
          newCases: 0
        } as DailyData;
      }
      const n = value.confCases - last;
      last = value.confCases;

      return {
        date: value.date,
        newCases: n
      } as DailyData;
    }).filter((v: DailyData | null) => v != null) as Array<DailyData>;

    if (this.calculateAverage) {
      // calculate sliding window average
      newCases = newCases.map((value: DailyData, idx: number, arr: DailyData[]) => {
        let avg = null;

        // calculate from first valid position (averageSlidingWindow) up to the last - since last day data is never complete, this day is ignored
        if (idx >= this.averageSlidingWindow && idx < arr.length - 1) {
          avg = Math.round(
            arr.slice(idx - this.averageSlidingWindow + 1, idx + 1)
              .map((x) => x.newCases)
              .reduce((sum, current) => sum  + current)
            / this.averageSlidingWindow
          );
        }

        return {
          date: value.date,
          newCases: value.newCases,
          newCasesAvg: avg
        } as DailyData;
      });
    }

    return newCases;
  }

  get newCases(): Array<DataPoint> {
    const all = this.cases;
    const newCases = this.calculateNewCases(all);
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

