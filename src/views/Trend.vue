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
          <th>Trend</th>
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

@Component({
  components: { IncidenceMiniChart, IncidenceOverview: IncidenceMiniChart, Cases }
})
export default class Trend extends Vue {

  private startDate = "";
  private endDate = "";

  private get cantons(): Array<any> {
    return StaticData.getCantonsFullWithCh();
  }

  private setStartDate(date: string) {
    this.startDate = date;
  }

  private setEndDate(date: string) {
    this.endDate = date;
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

