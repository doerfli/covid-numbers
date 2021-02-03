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
      <span :title="`${formatPct(simpleMovingAverage)} in last 7 days`">
        <i :class="trendIconClass"></i>
      </span>

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

  get incidenceData(): Array<DataPoint> {
    // console.log("incidenceData for " + this.getCanton);

    const inc = this.$store.getters["cases/incidence"](this.shortName, this.fieldToShow) as Array<DailyIncidence>;
    const range = inc.slice(-180);

    // TODO make range configurable
    const data = range.slice(0, range.length - 1).map((x: DailyIncidence) => {
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

  get incidenceEma(): Array<number> {
    const data = this.incidenceData;
    if (this.incidenceData.length == 0) {
      return [];
    }

    // based upon https://www.investopedia.com/ask/answers/122314/what-exponential-moving-average-ema-formula-and-how-ema-calculated.asp
    const k = 2 / (7 + 1); // weight multiplier
    const emarr = [data[0].yValue];
    for (let i = 1; i < data.length; i++) {
      const ema = data[i].yValue * k + (emarr[i-1] * (1 - k));
      emarr.push(ema);
    }
    return emarr;
  }

  private emaChangedLastWeek(): number {
    const t = this.incidenceEma.length;
    const lastValue = this.incidenceEma[t-1]
    const oneWeekAgoValue = this.incidenceEma[t-8]
    return (lastValue - oneWeekAgoValue) / oneWeekAgoValue;
  }

  get latestValue(): number {
    if (this.incidenceData.length == 0) {
      return 0;
    }
    return this.incidenceData[this.incidenceData.length - 1].yValue;
  }

  get valueOneWeekAgo(): number {
    if (this.incidenceData.length == 0) {
      return 0;
    }
    return this.incidenceData[this.incidenceData.length - 8].yValue;
  }

  get simpleMovingAverage() {
    return (this.latestValue - this.valueOneWeekAgo) / this.valueOneWeekAgo;
  }

  get trendIconClass() {
    const chg = this.emaChangedLastWeek();
    // console.log("trendIconClass - chg " + chg);
    const cls = "fas fa-long-arrow-alt-right fa-2x ";
    if (chg < -0.1) {
      return cls + "transform rotate-45 text-emerald-600";
    } else if (chg < -0.01) {
      return cls + "transform rotate-12 text-emerald-400";
    } else if (chg > 0.1) {
      return cls + "transform -rotate-45 text-pink-600";
    } else if (chg > 0.01) {
      return cls + "transform -rotate-12 text-pink-300";
    }

    return cls + "text-emerald-300";
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

