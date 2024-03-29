<template>
  <tr :class="{
        'bg-gray-900': idx % 2 === 0 && isTheme('dark'),
        'bg-black': idx % 2 === 1 && isTheme('dark'),
        'bg-emerald-100': idx % 2 === 0 && isTheme('light'),
        'bg-white': idx % 2 === 1 && isTheme('light'),
    }">
    <td>
      <span class="block lg:hidden">{{ getCantonShort}}</span>
      <span class="hidden lg:block">{{ getCanton }}</span>
    </td>
    <td>{{ latestValue.toFixed(0) }}</td>
    <td class="pb-3">
      <AreaChart class="areachart w-full h-10"
                 v-bind:data="incidenceData"
      />
    </td>
    <td>
      <router-link :to="detailsUrl()">
        <span :title="`${formatPct(changeLastWeek)} in last 7 days`">
          <i :class="trendIconClass"></i>
        </span>
      </router-link>
    </td>
  </tr>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'
import H2 from '@/components/base/H2.vue'
import DailyIncidence from '@/model/dailyIncidence'
import formatDate from '@/utils/format-date'
import AreaChart from '@/components/charts/AreaChart.vue'
import { calculateEma, calculateMacd, calculateSignal, calculateTrend } from '@/utils/macd'
import Trend from '@/utils/trend'

@Component({
  components: { H2, AreaChart }
})
export default class IncidenceMiniChart extends Vue {

  @Prop({ default: 'confCases'})
  private fieldToShow!: any;
  @Prop()
  private name!: string;
  @Prop()
  private shortName!: string;
  @Prop()
  private idx!: number;

  get getCanton() {
    return this.name;
  }

  get getCantonShort() {
    return this.shortName;
  }

  get dataset(): Array<DailyIncidence> {
    const range = this.$store.getters["cases/incidence"](this.shortName, this.fieldToShow, 180) as Array<DailyIncidence>;

    // TODO make range configurable
    return range.slice(0, range.length - 1)
  }

  get incidenceData(): Array<DataPoint> {
    // console.log("incidenceData for " + this.getCanton);

    const data = this.dataset.map((x: DailyIncidence) => {
      return {
        xValue: formatDate(x.date),
        yValue: x.incidence
      } as DataPoint;
    });

    if (data.length > 1) {
      this.$emit("start-date", data[0].xValue);
      this.$emit("end-date", data[data.length - 1].xValue);
    }

    return data;
  }

  get latestValue(): number {
    if (this.incidenceData.length == 0) {
      return 0;
    }
    return this.incidenceData[this.incidenceData.length - 1].yValue;
  }

  get valueLastWeek(): number {
    if (this.incidenceData.length == 0) {
      return 0;
    }
    return this.incidenceData[this.incidenceData.length - 8].yValue;
  }

  get changeLastWeek() {
    return (this.latestValue - this.valueLastWeek) / this.valueLastWeek;
  }

  get emaShort(): Array<number> {
    return calculateEma(this.dataset.map((d: DailyIncidence) => d.incidence), 12);
  }

  get emaLong(): Array<number> {
    return calculateEma(this.dataset.map((d: DailyIncidence) => d.incidence), 26);
  }

  get trendIconClass() {
    const macd = calculateMacd(this.emaShort, this.emaLong);
    const signal = calculateSignal(macd);
    const trend = calculateTrend(macd, signal, 21);

    const cls = "fas fa-2x ";

    switch (trend) {
      case Trend.UP_UP:
        return cls + "fa-angle-double-up text-pink-500 dark:text-pink-300";
      case Trend.UP:
        return cls + "fa-angle-up text-pink-500 dark:text-pink-300";
      case Trend.DOWN:
        return cls + "fa-angle-down text-emerald-500 dark:text-emerald-300";
      case Trend.DOWN_DOWN:
        return cls + "fa-angle-double-down text-emerald-500 dark:text-emerald-300";
      default:
        return cls + "fa-angle-right text-gray-400";
    }
  }

  private formatPct(decNum: number, fractionDigits = 0): string {
    let pref = "";
    if (decNum > 0) {
      pref += "+";
    }
    return `${pref}${(decNum * 100).toFixed(fractionDigits)}%`;
  }

  private isTheme(theme: string) {
    return this.$store.state.viewProps.theme === theme;
  }

  private detailsUrl() {
    return `/details/${this.shortName}?showTrendIndicators=true`;
  }

}
</script>

<style scoped>
  td {
    @apply p-1 lg:px-2;
    @apply align-bottom;
  }
  td:nth-child(2) {
    @apply text-right;
  }
</style>

