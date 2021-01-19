<template>
  <div>
    <H2>Details for canton {{ getCanton }}</H2>

    <BarChart class="barchart w-full h-96"
              v-bind:data="displayData" />

    <CasesTable :canton="getCanton" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import H1 from '@/components/base/H1.vue'
import H2 from '@/components/base/H2.vue'
import CasesTable from '@/components/CasesTable.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DataPoint from '@/model/datapoint'
import DailyDiff from '@/model/dailyDiff'

@Component({
    components: { BarChart, CasesTable, H2, H1 }
  })
  export default class Details extends Vue {
    @Prop()
    private canton!: string;
    @Prop({ default: 7 })
    private windowSize!: number;

    private get getCanton() {
      return this.canton;
    }

    get displayData(): Array<DataPoint> {
      let data = null;
      data = this.$store.getters["cases/calculateDailyDiff"](this.canton, "confCases", this.windowSize) as Array<DailyDiff>;

      // console.log(1111);
      // console.log(data);

      const lastXDays = data.slice(-90);
      // console.log(lastXDays);

      // limit to last x days and map to datapoints for display
      return lastXDays.map((x: DailyDiff) => {
        return {
          xValue: Details.formatDate(x.date),
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

