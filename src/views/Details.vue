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
      const dataset = this.dataset;
      return this.calculateEma(dataset.map((d: DailyDataSet) => d.confCasesChg), 12);
    }

    get emaLong(): Array<number> {
      const dataset = this.dataset;
      return this.calculateEma(dataset.map((d: DailyDataSet) => d.confCasesChg), 26);
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
      const macd = this.macd;
      const signal = this.calculateEma(macd, 9);
      const d = macd.map((m: number, i: number) => {
        return {
          xValue: formatDate(dataset[i].date),
          y2Value: m,
          y3Value: signal[i]
        } as DataPoint;
      });
      console.log(d);
      return d;
    }

    get macd() {
      const emaShort = this.emaShort;
      const emaLong = this.emaLong;
      const macd = [];
      if (emaShort.length != emaLong.length) {
        throw "ema lengths don't match";
      }
      for (let i = 1; i < emaLong.length; i++) {
        macd.push(emaShort[i] - emaLong[i]);
      }
      return macd;
    }

    private calculateEma(data: Array<number>, length = 7): Array<number> {
      if (data.length == 0) {
        return [];
      }

      // based upon https://www.investopedia.com/ask/answers/122314/what-exponential-moving-average-ema-formula-and-how-ema-calculated.asp
      const k = 2 / (length + 1); // weight multiplier
      const emaArr = [0];
      for (let i = 1; i < data.length; i++) {
        if (i < length - 1) {
          emaArr.push(0);
        } else if ( i === length - 1 ) {
          emaArr.push(Math.round(
            data.slice(0, i + 1)
              .map((x) => x)
              .reduce((sum, current) => sum + current)
            / length));
        } else {
          const ema = data[i] * k + (emaArr[i-1] * (1 - k));
          emaArr.push(ema);
        }
      }
      return emaArr;
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

