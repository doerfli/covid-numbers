<template>
  <div>
    <H2>Details for canton {{ getCanton }}</H2>

    <BarChart class="barchart w-full h-96 my-6"
              v-bind:data="displayData" />

    <BarChart class="barchart w-full h-96 my-6"
              v-bind:data="displayDataMacd" />

    <CasesTable :canton="getCanton" :rows-to-render="rowsToRender" />

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import H1 from '@/components/base/H1.vue'
import H2 from '@/components/base/H2.vue'
import CasesTable from '@/components/CasesTable.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DataPoint from '@/model/datapoint'
import DailyDataSet from '@/model/dailyDataSet'
import formatDate from '@/utils/format-date'
import { calculateEma, calculateMacd, calculateSignal } from '@/utils/macd'

@Component({
    components: { BarChart, CasesTable, H2, H1 }
  })
  export default class Details extends Vue {
    @Prop()
    private canton!: string;
    @Prop({ default: 7 })
    private windowSize!: number;
    private daysInChart = 180;
    private rowsToRender = 90;

    private mounted() {
      this.scroll();
    }

    private get getCanton() {
      return this.canton;
    }

    get dataset(): Array<DailyDataSet> {
      const d = this.$store.getters["cases/dataPerCanton"](this.canton) as Array<DailyDataSet>;
      return d.slice(-180);
    }

    get emaShort(): Array<number> {
      return calculateEma(this.dataset.map((d: DailyDataSet) => d.confCasesChg), 12);
    }

    get emaLong(): Array<number> {
      return calculateEma(this.dataset.map((d: DailyDataSet) => d.confCasesChg), 26);
    }

    get displayData(): Array<DataPoint> {
      const dataset = this.dataset;
      const emaShort = this.emaShort;
      const emaLong = this.emaLong;
      return dataset.map((x: DailyDataSet, i: number) => {
        return {
          xValue: formatDate(x.date),
          yValue: x.confCasesChg,
          y2Value: (i < dataset.length - 1) ? x.confCasesChgAvg : null,
          y3Value: (i < dataset.length - 1) ? emaShort[i] : null,
          y4Value: (i < dataset.length - 1) ? emaLong[i] : null
        } as DataPoint;
      });
    }

    get displayDataMacd(): Array<DataPoint> {
      const dataset = this.dataset;
      const macd = calculateMacd(this.emaShort, this.emaLong);
      const signal = calculateSignal(macd);
      const d = macd.map((m: number, i: number) => {
        return {
          xValue: formatDate(dataset[i].date),
          y2Value: m,
          y3Value: signal[i]
        } as DataPoint;
      });

      return d;
    }

    private static isScrolledIntoView(el: Element) {
      const rect = el.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;
      return elemTop < window.innerHeight && elemBottom >= 0;
    }

    private scroll () {
      window.onscroll = () => {
        const scrolledTo = document.querySelector('.footer')

        if (scrolledTo && Details.isScrolledIntoView(scrolledTo)) {
          console.log('scrolled');
          this.rowsToRender += 90;
        }
      }
    }

  }
</script>

<style scoped>

</style>

