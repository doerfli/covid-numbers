<template>
  <div class="case lg:w-1/3 md:w-1/2">
    <H4>{{ getCanton }}</H4>
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
import H4 from '@/components/base/H4.vue'

@Component({
  components: { H4, BarChart }
})
export default class Cases extends Vue {

  @Prop({ default: 28 })
  private daysToShow!: number;
  @Prop()
  private canton!: string;
  private cases: Array<DailyData> = new Array<DailyData>()

  get getCanton() {
    return this.canton;
  }

  get getCases(): Array<CantonData> {
    const t = this.$store.state.cases.cases;
    // console.log(t);
    return t.filter((x: CantonData) => { return x.canton == this.getCanton});
  }

  @Watch("getCases", { deep: true} )
  casesMapChanged(casesNew: Array<CantonData>, casesOld: Array<CantonData>) {
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
      // console.log(state.cases);
      // console.log(state.cases.has(canton));
    let last = 0;
    const t = cases.map((value: DailyData, idx: number, arr: DailyData[]) => {
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
    });
    return t.filter((v: DailyData | null) => v != null) as Array<DailyData>;
  }

  get newCases(): Array<DataPoint> {
    const all = this.cases;
    const newCases1 = this.calculateNewCases(all).slice(-this.daysToShow);
    // console.log(newCases1);
    return newCases1.map((x: DailyData) => {
      return {
        xValue: `${x.date.substr(8, 2)}.${x.date.substr(5, 2)}.`,
        yValue: x.newCases
      } as DataPoint
    });
  }

}
</script>

<style scoped>
  .case {

  }
  .barchart {
    /*width: 100%;*/
    /*height: calc(100vw * 0.6)*/
  }
</style>

