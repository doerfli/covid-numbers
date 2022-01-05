<template>
  <tr class="case">
    <td>
      <span class="pl-2 block sm:hidden">
        {{ getCanton }}
      </span>
      <span class="pl-2 hidden sm:block">
        {{ getName }}
      </span>
    </td>
    <td class="">
      <HorizontalStackedBarChart class="barchart w-full h-20 mt-2"
                                 v-bind:data="vaccProgressData"
      />
    </td>
  </tr>
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
  components: { HorizontalStackedBarChart, H2, BarChart }
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
        yValue: x.firstBoosterVaccinatedPer100,
        yValueDescr: "With Booster",
        y2Value: x.fullyVaccinatedPer100,
        y2ValueDescr: "Fully vaccinated",
        y3Value: x.partiallyVaccPer100,
        y3ValueDescr: "Partially vaccinated",
        y4Value: 100,
        y4ValueDescr: "Not vaccinated",
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
        y2Value: (d.y2Value ?? 0) - (d.yValue ?? 0),
        y2ValueDescr: d.y2ValueDescr,
        y3Value: (d.y3Value ?? 0),
        y3ValueDescr: d.y3ValueDescr,
        y4Value: (d.y4Value ?? 0) - ((d.y3Value ?? 0) + (d.y2Value ?? 0)),
        y4ValueDescr: d.y4ValueDescr,
      } as DataPoint
    });

    // console.log(stacks);
    return stacks;
  }
}
</script>

<style scoped>

</style>

