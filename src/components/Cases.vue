<template>
  <div class="case w-full md:w-1/2 lg:w-1/3 mb-4">
    <div class="flex justify-between">
      <div class="">
        <H2 class="pl-2 inline-block block sm:hidden">
          {{ getCanton }}
        </H2>
        <H2 class="pl-2 inline-block hidden sm:block">
          {{ getName }}
        </H2>
      </div>
      <div class="">
        <span class="details_link text-xs">
          <router-link :to="detailsUrl()">
            <i class="fas fa-eye"></i> Show details
          </router-link>
        </span>
      </div>
    </div>
    <HighlightLine :highlight-data-point="highlightDataPoint" />
    <BarChart class="barchart w-full h-80"
              v-bind:data="displayData"
              v-on:bar-active="setHighlightDataPoint"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import H2 from '@/components/base/H2.vue'
import DailyIncidence from '@/model/dailyIncidence'
import getProperty from '@/utils/get-property'
import DailyDataSet from '@/model/dailyDataSet'
import HighlightLine from '@/components/HighlightLine.vue'
import formatDate from '@/utils/format-date'

@Component({
  components: { HighlightLine, H2, BarChart }
})
export default class Cases extends Vue {

  @Prop({ default: 28 })
  private daysToShow!: number;
  @Prop({ default: 'confCases'})
  private fieldToShow!: any;
  @Prop()
  private canton!: string;
  @Prop()
  private name!: string;
  @Prop({ default: false })
  private calculateAverage!: boolean;
  @Prop({ default: 7 })
  private windowSize!: number;
  @Prop({ default: false })
  private showIncidence!: boolean;
  private highlightDataPoint: DataPoint = { } as DataPoint;

  get getCanton() {
    return this.canton;
  }

  get getName() {
    return this.name;
  }

  get displayData(): Array<DataPoint> {
    // console.log("displayData " + this.getCanton);
    let data = null;

    if (this.showIncidence) {
      const inc = this.$store.getters["cases/incidence"](this.canton, this.fieldToShow, this.windowSize) as Array<DailyIncidence>;
      return inc.slice(-this.daysToShow).map((x: DailyIncidence) => {
        return {
          xValue: formatDate(x.date),
          y2Value: x.incidence
        } as DataPoint;
      });
    } else {
      data = this.$store.getters["cases/dataPerCanton"](this.canton) as Array<DailyDataSet>;
    }

    // console.log(1111);
    // console.log(data);

    const lastXDays = data.slice(-this.daysToShow);
    // console.log(lastXDays);
    const avgFieldName = this.fieldToShow + "Avg" as any;

    // limit to last x days and map to datapoints for display
    const result = lastXDays.map((x: DailyDataSet, i: number) => {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: getProperty(x, this.fieldToShow),
        yValueDescr: "Count",
        y2Value: (i < lastXDays.length - 1) ? getProperty(x, avgFieldName) : null,
        y2ValueDescr: "Average"
      } as DataPoint;
    });

    // show second last day when initializing dataset
    this.highlightDataPoint = result[result.length - 2];

    return result;
  }

  private detailsUrl() {
    return `/details/${this.canton}`;
  }

  private setHighlightDataPoint(data: DataPoint) {
    // console.log(data);
    this.highlightDataPoint = data;
    // console.log(this.highlightDataPoint);
  }



  // @Watch('highlightDataPoint')
  private dataPointHighlight() {
    console.log("w");
    if (this.highlightDataPoint !== undefined) {
      return this.highlightDataPoint;
    }
    if (this.displayData.length == 0) {
      return {
        xValue: "-",
        yValue: 0,
        y2Value: 0,
        xValueDescr: "",
        yValueDescr: "",
        y2ValueDescr: "",
      } as DataPoint;
    }

    return this.displayData[this.displayData.length - 1];
  }
}
</script>

<style scoped>
  .details_link {
    @apply px-2;
    @apply text-indigo-700 hover:text-indigo-500;
    @apply dark:text-blue-500 dark:hover:text-blue-300;
  }
</style>

