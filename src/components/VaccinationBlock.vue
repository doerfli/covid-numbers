<template>
  <div class="case w-full md:w-1/2 lg:w-1/3 mb-4">
    <div class="flex justify-between">
      <H2 class="pl-2 inline-block block sm:hidden">
        {{ getCanton }}
      </H2>
      <H2 class="pl-2 inline-block hidden sm:block">
        {{ getName }}
      </H2>
    </div>
    <StackedBarChart class="barchart w-full h-80"
              v-bind:data="displayData"
              />
    <HorizontalStackedBarChart class="barchart w-full h-20 mt-2"
                               v-bind:data="vaccProgressData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import BarChart from '@/components/charts/BarChart.vue'
import H2 from '@/components/base/H2.vue'
import formatDate from '@/utils/format-date'
import VaccDataSet from '@/model/vaccDataSet'
import StackedBarChart from '@/components/charts/StackedBarChart.vue'
import HorizontalStackedBarChart from '@/components/charts/HorizontalStackedBarChart.vue'

@Component({
  components: { HorizontalStackedBarChart, StackedBarChart, H2, BarChart }
})
export default class VaccinationBlock extends Vue {

  @Prop({ default: 28 })
  private daysToShow!: number;
  @Prop()
  private canton!: string;
  @Prop()
  private name!: string;

  get getCanton() {
    return this.canton;
  }

  get getName() {
    return this.name;
  }

  get displayData(): Array<DataPoint> {
    // console.log("displayData " + this.getCanton);

    const data = this.$store.getters["vacc/dataPerCanton"](this.canton) as Array<VaccDataSet>;

    // console.log(1111);
    // console.log(data);

    // console.log(lastXDays);
    const lastXDays = data.slice(-this.daysToShow);

    // limit to last x days and map to datapoints for display
    const origData =  lastXDays.map((x: VaccDataSet, i: number) => {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: x.fullyVaccinatedTotal,
        yValueDescr: "Fully vaccinated",
        y2Value: x.administeredTotal,
        y2ValueDescr: "Administered",
        y3Value: x.deliveredTotal,
        y3ValueDescr: "Delivered",
      } as DataPoint;
    });

    // console.log(origData);

    // reformat data for stacked chart display
    const stacks = origData.map((d: DataPoint) => {
      return {
        xValue: d.xValue,
        xValueDescr: d.xValueDescr,
        yValue: d.yValue,
        yValueDescr: d.yValueDescr,
        y2Value: (d.y2Value ?? 0) - d.yValue,
        y2ValueDescr: d.y2ValueDescr,
        y3Value: (d.y3Value ?? 0) - (d.y2Value ?? 0),
        y3ValueDescr: d.y3ValueDescr,
      } as DataPoint
    });

    // console.log(stacks);
    return stacks;
  }

  get vaccProgressData(): Array<DataPoint> {
    // console.log("displayData " + this.getCanton);

    const data = this.$store.getters["vacc/dataPerCanton"](this.canton) as Array<VaccDataSet>;

    // console.log(1111);
    // console.log(data);

    // console.log(lastXDays);
    const lastDay = data.slice(-1);

    // limit to last x days and map to datapoints for display
    const origData =  lastDay.map((x: VaccDataSet, i: number) => {
      return {
        xValue: formatDate(x.date),
        xValueDescr: "Date",
        yValue: x.fullyVaccinatedPer100,
        yValueDescr: "Fully vaccinated",
        y2Value: x.oneDoseVaccinatedPer100,
        y2ValueDescr: "First dose rcvd",
        y3Value: 100,
        y3ValueDescr: "Remaining",
      } as DataPoint;
    });

    // console.log(origData);

    // reformat data for stacked chart display
    const stacks = origData.map((d: DataPoint) => {
      return {
        xValue: d.xValue,
        xValueDescr: d.xValueDescr,
        yValue: d.yValue,
        yValueDescr: d.yValueDescr,
        y2Value: (d.y2Value ?? 0),
        y2ValueDescr: d.y2ValueDescr,
        y3Value: (d.y3Value ?? 0) - ((d.y2Value ?? 0) + (d.yValue ?? 0)),
        y3ValueDescr: d.y3ValueDescr,
      } as DataPoint
    });

    console.log(stacks);
    return stacks;
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

