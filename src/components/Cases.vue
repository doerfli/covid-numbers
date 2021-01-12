<template>
  <div class="case w-full md:w-1/2 lg:w-1/3">
    <H2>{{ getCanton }}</H2>
    <BarChart class="barchart w-full h-80"
              v-bind:data="displayData" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import CantonData from '@/model/cantondata'
import H2 from '@/components/base/H2.vue'
import DailyDiff from '@/model/dailyDiff'
import DailyIncidence from '@/model/dailyIncidence'

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
  private windowSize!: number;
  @Prop({ default: false })
  private showAbsoluteNumbers!: boolean;
  @Prop({ default: false })
  private showIncidence!: boolean;

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

  get displayData(): Array<DataPoint> {
    let data = null;

    if (this.showIncidence) {
      const inc = this.$store.getters["cases/incidence"](this.canton, this.fieldToShow, this.windowSize) as Array<DailyIncidence>;
      return inc.slice(-this.daysToShow).map((x: DailyIncidence) => {
        return {
          xValue: Cases.formatDate(x.date),
          y2Value: x.incidence
        } as DataPoint;
      });
    } else if (this.showAbsoluteNumbers) {
      data = this.$store.getters["cases/dailyValues"](this.canton, this.fieldToShow, this.windowSize) as Array<DailyDiff>;
    } else {
      data = this.$store.getters["cases/calculateDailyDiff"](this.canton, this.fieldToShow, this.windowSize) as Array<DailyDiff>;
    }

    // console.log(1111);
    // console.log(data);

    // limit to last x days and map to datapoints for display
    return data.slice(-this.daysToShow).map((x: DailyDiff) => {
      return {
        xValue: Cases.formatDate(x.date),
        yValue: x.value,
        y2Value: x.avg
      } as DataPoint;
    });
  }

  private static formatDate(date: string) {
    return `${date.substr(8, 2)}.${date.substr(5, 2)}.`
  }
}
</script>

<style scoped>
</style>

