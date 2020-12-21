<template>
  <div class="home">
    Hello
    <svg ref="chart" id="chart"></svg>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import DailyData from '@/model/dailydata'
import * as d3 from "d3";

@Component({
  components: {
  }
})
export default class Home extends Vue {

  public mounted() {
    console.log("Home.mounted");
    this.$store.dispatch("cases/fetchZh");
  }

  get casesZh(): Array<DailyData> {
    return this.$store.state.cases.casesZh;
  }

  @Watch('casesZh')
  casesZhChanged(value: Array<DailyData>, oldValue: Array<DailyData>) {
    // console.log("casesZhChanged");
    // console.log(value);
    const cases = value.slice(value.length - 60);
    console.log(cases);

    const margin = 60;
    const width = 1500 - 2 * margin;
    const height = 800 - 2 * margin;

    const svg = d3.select('#chart');
    const chart = svg.append('g')
      .attr('transform', `translate(${margin}, ${margin})`);

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 65000]);
    chart.append('g')
      .call(d3.axisLeft(yScale));

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(cases.map((s) => s.date))
      .padding(0.2)

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart
      .selectAll()
      .data(cases)
      .enter()
      .append('rect')
      .attr('x', (s) => xScale(s.date) as (number | null))
      .attr('y', (s) => yScale(s.confCases))
      .attr('height', (s) => height - yScale(s.confCases))
      .attr('width', xScale.bandwidth())
  }

}
</script>

<style>
  #chart {
    height: 900px;
    width: 1500px;
  }
</style>
