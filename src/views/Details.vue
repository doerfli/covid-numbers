<template>
  <div>
    <H2>Data for {{ name }}</H2>

    <BarChart class="barchart w-full h-96 my-6"
              v-bind:data="displayData" />

    <BarChart class="barchart w-full h-96 mt-6 mb-3"
              v-bind:data="displayDataMacd"
              v-if="indicatorsShown"/>

    <div class="indicator_link" v-if="!indicatorsShown" v-on:click="toggleTrendIndicators">
      Show trend indicators in chart
    </div>
    <div v-else >
      <div class="indicator_info">
        The indicator lines in the upper diagram are the 7-day SMA (green dashed line), 3-day EMA (blue dotted line), 20-day EMA (red dotted line)
        and in the lower diagram the MACD (green dashed line) and the MACD Signal (blue dotted line).
        <p/>
        The calculation is based on the paper
        <Ref uri="https://www.cambridge.org/core/journals/disaster-medicine-and-public-health-preparedness/article/predicting-sarscov2-infection-trend-using-technical-analysis-indicators/6421416657454D2F816979DD885562A1#article">Predicting SARS-CoV-2 Infection Trend Using Technical Analysis Indicators</Ref>
        published by Cambridge University Press on July 17th 2020.
      </div>
      <div class="indicator_link" v-on:click="toggleTrendIndicators">Hide trend indicators in chart</div>
    </div>

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
import Ref from '@/components/base/Ref.vue'
import StaticData from '@/store/staticdata'

@Component({
    components: { Ref, BarChart, CasesTable, H2, H1 }
  })
  export default class Details extends Vue {
    @Prop()
    private shortName!: string;
    @Prop()
    private name = "";
    @Prop({ default: 7 })
    private windowSize!: number;
    private daysInChart = 180;
    private rowsToRender = 90;
    private indicatorsShown = false;

    private mounted() {
      this.scroll();
      this.name = StaticData.getCantonFull(this.getCanton).name;
    }

    private get getCanton() {
      return this.shortName;
    }

    get dataset(): Array<DailyDataSet> {
      const d = this.$store.getters["cases/dataPerCanton"](this.shortName) as Array<DailyDataSet>;
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
        if (!this.indicatorsShown) {
          return {
            xValue: formatDate(x.date),
            yValue: x.confCasesChg,
            y2Value: (i < dataset.length - 1) ? x.confCasesChgAvg : null,
          } as DataPoint;
        } else {
          return {
            xValue: formatDate(x.date),
            yValue: x.confCasesChg,
            y2Value: (i < dataset.length - 1) ? x.confCasesChgAvg : null,
            y3Value: (i >= 26 && i < dataset.length - 1) ? emaShort[i] : null,
            y4Value: (i >= 26 && i < dataset.length - 1) ? emaLong[i] : null
          } as DataPoint;
        }

      });
    }

    get displayDataMacd(): Array<DataPoint> {
      const dataset = this.dataset;
      const macd = calculateMacd(this.emaShort, this.emaLong);
      const signal = calculateSignal(macd);
      const d = macd.map((m: number, i: number) => {
        return {
          xValue: formatDate(dataset[i].date),
          y2Value: (i >= 26) ? m : null,
          y3Value: (i >= 35) ? signal[i] : null,
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

    private toggleTrendIndicators() {
      this.indicatorsShown = ! this.indicatorsShown;
    }

  }
</script>

<style scoped>
  .indicator_link {
    @apply text-sm;
    @apply cursor-pointer;
    @apply text-indigo-700 hover:text-indigo-500 dark:text-blue-500 dark:hover:text-blue-300;
    @apply mb-3;
  }
  .indicator_info {
    @apply text-sm;
    @apply mb-3;
  }
</style>

