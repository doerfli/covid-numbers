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
      <div>
        <span class="details_link text-xs">
          <router-link :to="detailsUrl()">
            <i class="fas fa-eye"></i> Show details
          </router-link>
        </span>
      </div>
    </div>
    <BarChart class="barchart w-full h-80"
              v-bind:data="displayData"
              v-on:bar-active="setHighlightDataPoint"
              v-if="isBarChart()"/>
    <LineChart class="barchart w-full h-80"
              v-bind:data="displayData"
              v-on:bar-active="setHighlightDataPoint"
              v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import LineChart from '@/components/charts/LineChart.vue'
import H2 from '@/components/base/H2.vue'
import DailyIncidence from '@/model/dailyIncidence'
import getProperty from '@/utils/get-property'
import DataSetEntity from '@/model/dataSetEntity'
import HighlightLine from '@/components/HighlightLine.vue'
import formatDate from '@/utils/format-date'
import ChartType from "@/model/chartType";

@Component({
  components: { HighlightLine, H2, BarChart, LineChart }
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
  @Prop({ default: 7 })
  private windowSize!: number;
  @Prop({ default: false })
  private showIncidence!: boolean;
  @Prop({ default: ChartType.Bar })
  private chartType!: ChartType;
  @Prop({ default: false })
  private showAverage!: boolean;
  @Prop({ default: false })
  private showPerWeek!: boolean;

  private highlightDataPoint: DataPoint = { } as DataPoint;

  get getCanton() {
    return this.canton;
  }

  get getName() {
    return this.name;
  }

  get displayData(): Array<DataPoint> {
    // console.log("displayData " + this.getCanton);

    if (this.showIncidence) {
      const inc = this.$store.getters["cases/incidence"](this.canton, this.fieldToShow, this.daysToShow, this.windowSize) as Array<DailyIncidence>;
      return inc.map((x: DailyIncidence) => {
        return {
          xValue: formatDate(x.date),
          y2Value: x.incidence
        } as DataPoint;
      });
    }

    const avgFieldName = this.fieldToShow + "Avg" as any;
    let dataset: Array<DataSetEntity>;
    if (this.daysToShow > 180 || this.showPerWeek ) {
      dataset = this.$store.getters["cases/dataPerCantonPerWeek"](this.canton, this.daysToShow) as Array<DataSetEntity>;
    } else {
      dataset = this.$store.getters["cases/dataPerCanton"](this.canton, this.daysToShow) as Array<DataSetEntity>;
    }

    // console.log(1111);
    // console.log(dataset);

    // map to datapoints for display
    const result = dataset.map((x: DataSetEntity, i: number) => {
      return this.mapToDataPoint(x, i, dataset, avgFieldName, this.showAverage);
    });

    // show second last day when initializing dataset
    this.highlightDataPoint = result[result.length - 2];

    return result;
  }

  private mapToDataPoint(x: DataSetEntity, i: number, dataset: Array<DataSetEntity>, avgFieldName: any, showAverage: boolean) {
    if (showAverage) {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: getProperty(x, this.fieldToShow),
        yValueDescr: "Count",
        y2Value: (i < dataset.length - 1) ? getProperty(x, avgFieldName) : null,
        y2ValueDescr: "Average",
      } as DataPoint;
    } else {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: getProperty(x, this.fieldToShow),
        yValueDescr: "Count",
      } as DataPoint;
    }
  }

  private detailsUrl() {
    return `/details/${this.canton}`;
  }

  private setHighlightDataPoint(data: DataPoint) {
    // console.log(data);
    this.highlightDataPoint = data;
    // console.log(this.highlightDataPoint);
  }

  private isBarChart() {
    return this.chartType === ChartType.Bar;
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

