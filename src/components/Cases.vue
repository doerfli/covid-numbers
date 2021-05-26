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
import moment from "moment/moment";

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

    if (this.showIncidence) {
      const inc = this.$store.getters["cases/incidence"](this.canton, this.fieldToShow, this.windowSize) as Array<DailyIncidence>;
      return inc.slice(-this.daysToShow).map((x: DailyIncidence) => {
        return {
          xValue: formatDate(x.date),
          y2Value: x.incidence
        } as DataPoint;
      });
    }

    const data = this.$store.getters["cases/dataPerCanton"](this.canton) as Array<DailyDataSet>;

    // console.log(1111);
    // console.log(data);

    // console.log(dataset);
    const avgFieldName = this.fieldToShow + "Avg" as any;

    // limit to last x days
    let dataset = data.slice(-this.daysToShow);

    if (this.daysToShow > 180) {
      // aggregate per week
      dataset = this.aggregateDataPerWeek(dataset);
    }

    // map to datapoints for display
    const result = dataset.map((x: DailyDataSet, i: number) => {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: getProperty(x, this.fieldToShow),
        yValueDescr: "Count",
        y2Value: (i < dataset.length - 1) ? getProperty(x, avgFieldName) : null,
        y2ValueDescr: "Average",
      } as DataPoint;
    });

    // show second last day when initializing dataset
    this.highlightDataPoint = result[result.length - 2];

    return result;
  }

  private aggregateDataPerWeek(dataset: DailyDataSet[]) {
    const x = dataset.reduce(function (weekMap: Map<string, DailyDataSet>, currentDay: DailyDataSet) {
      const week = moment(currentDay.date, "YYYY-MM-DD").week().toString();
      if (weekMap.has(week)) {
        const wk = weekMap.get(week) as DailyDataSet;
        weekMap.set(week, {
          date: wk.date,
          confCases: wk.confCases + currentDay.confCases,
          confCasesChg: wk.confCasesChg + currentDay.confCasesChg,
          confCasesChgAvg: wk.confCasesChgAvg + currentDay.confCasesChgAvg,
          currHosp: wk.currHosp + currentDay.currHosp,
          currHospChg: wk.currHospChg + currentDay.currHospChg,
          currHospAvg: wk.currHospAvg + currentDay.currHospAvg,
          currIcu: wk.currIcu + currentDay.currIcu,
          currIcuChg: wk.currIcuChg + currentDay.currIcuChg,
          currIcuAvg: wk.currIcuAvg + currentDay.currIcuAvg,
          deceased: wk.deceased + currentDay.deceased,
          deceasedChg: wk.deceasedChg + currentDay.deceasedChg,
          deceasedChgAvg: wk.deceasedChgAvg + currentDay.deceasedChgAvg,
        } as DailyDataSet);
      } else {
        weekMap.set(week, {
          date: currentDay.date,
          confCases: currentDay.confCases,
          confCasesChg: currentDay.confCasesChg,
          confCasesChgAvg: currentDay.confCasesChgAvg,
          currHosp: currentDay.currHosp,
          currHospChg: currentDay.currHospChg,
          currHospAvg: currentDay.currHospAvg,
          currIcu: currentDay.currIcu,
          currIcuChg: currentDay.currIcuChg,
          currIcuAvg: currentDay.currIcuAvg,
          deceased: currentDay.deceased,
          deceasedChg: currentDay.deceasedChg,
          deceasedChgAvg: currentDay.deceasedChgAvg,
        } as DailyDataSet);
      }
      return weekMap;
    }, new Map()).values();
    return [...x];
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

