<template>
  <div class="home">
    <BarChart id="chart"
      v-bind:data="casesZh" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import DailyData from '@/model/dailydata'
import * as d3 from "d3";
import BarChart from '@/components/charts/BarChart.vue'
import DataPoint from '@/model/datapoint'

@Component({
  components: {
    BarChart
  }
})
export default class Home extends Vue {

  public mounted() {
    console.log("Home.mounted");
    this.$store.dispatch("cases/fetchZh");
  }

  get casesZh(): Array<DailyData> {
    return this.$store.getters['cases/newCasesZh'].slice(-60).map((x: DailyData) => {
      return {
        xValue: x.date,
        yValue: x.newCases
      } as DataPoint
    });
  }

}
</script>

<style>
  #chart {
    height: 900px;
    width: 1300px;
  }
  .bar {
    fill: #4289b9;
  }
</style>
