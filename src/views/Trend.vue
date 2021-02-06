<template>
  <div class="mt-2">
    <table class="table-auto">
      <thead>
        <tr>
          <th>Canton</th>
          <th>
            <span class="block lg:hidden">7d Inc</span>
            <span class="hidden lg:block">7-day Incidence</span>
          </th>
          <th>{{ startDate }} - {{ endDate }}</th>
          <th>
            Trend
            <i class="fas fa-info-circle fa-sm" v-on:click="toggleTrendInfo()" title="Click for more details on Trend calculation"></i>
          </th>
        </tr>
        <tr v-if="showTrendInfo">
          <td colspan="4">
            <div class="text-sm">
              The indicated trend is based on analysis of incidence and derived MACD data on the new case numbers.
              This analysis is based on the paper
              <Ref uri="https://www.cambridge.org/core/journals/disaster-medicine-and-public-health-preparedness/article/predicting-sarscov2-infection-trend-using-technical-analysis-indicators/6421416657454D2F816979DD885562A1#article">Predicting SARS-CoV-2 Infection Trend Using Technical Analysis Indicators</Ref>
              published by Cambridge University Press on July 17th 2020.
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr is="IncidenceMiniChart"
            v-for="(canton,idx) in cantons"
            :key="canton.short"
            :name="canton.name"
            :short-name="canton.short"
            :idx="idx"
            v-on:start-date="setStartDate"
            v-on:end-date="setEndDate"
            ></tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cases from '@/components/Cases.vue'
import StaticData from '@/store/staticdata'
import IncidenceMiniChart from '@/components/IncidenceMiniChart.vue'
import Ref from '@/components/base/Ref.vue'

@Component({
  components: { Ref, IncidenceMiniChart, IncidenceOverview: IncidenceMiniChart, Cases }
})
export default class Trend extends Vue {

  private startDate = "";
  private endDate = "";
  private showTrendInfo = false;

  private get cantons(): Array<any> {
    return StaticData.getCantonsFullWithCh();
  }

  private setStartDate(date: string) {
    this.startDate = date;
  }

  private setEndDate(date: string) {
    this.endDate = date;
  }

  private toggleTrendInfo() {
    this.showTrendInfo = ! this.showTrendInfo;
  }

}
</script>

<style scoped lang="scss">
  th {
    @apply p-1 lg:px-2;
    @apply text-left whitespace-nowrap;
    @apply text-emerald-800 dark:text-teal-100;
    @apply border-b-2 border-emerald-400 dark:border-teal-700;
  }
  th:nth-child(3) {
    @apply text-center;
  }
  // hack to have 15px space before tbody
  tbody:before {
    content: "@";
    @apply block;
    line-height: 0.3em;
    text-indent: -99999px;
  }
</style>

