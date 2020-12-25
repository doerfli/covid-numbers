<template>
  <div>
    <svg ref="chart" class="chart"></svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import * as d3 from 'd3'
import DataPoint from '@/model/datapoint'

@Component({
  components: {}
})
export default class BarChart extends Vue {

  @Prop()
  private data!: Array<DataPoint>
  private margin = 60;

  public $refs!: {
    chart: HTMLFormElement;
  };

  public mounted() {
    console.log("BarChart.mounted");
  }

  @Watch('data')
  dataChanged(dataPoints: Array<DataPoint>, oldPoints: Array<DataPoint>) {
    console.log("dataChanged");
    console.log(dataPoints);

    const width = this.$refs.chart.clientWidth - 2 * this.margin;
    const height = this.$refs.chart.clientHeight - 2 * this.margin;
    const max = (dataPoints.map(e => e.yValue).reduce((a, b) => Math.max(a, b))) * 1.01;
    console.log(max);

    const svg = d3.select('.chart');
    const chart = svg.append('g')
      .attr('transform', `translate(${(this.margin)}, ${(this.margin)})`);

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, max]);
    chart.append('g')
      .call(d3.axisLeft(yScale)
        .scale(yScale)
        .tickSize(-width));

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(dataPoints.map((s) => s.xValue))
      .padding(0.2)

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("y", -5)
      .attr("x", 9)
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");

    chart
      .selectAll()
      .data(dataPoints)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (s) => xScale(s.xValue) as (number | null))
      .attr('y', (s) => yScale(s.yValue))
      .attr('height', (s) => height - yScale(s.yValue))
      .attr('width', xScale.bandwidth())
      // hover effect
      .on('mouseenter', function (actual, i) {
        d3.select(this).attr("opacity", 0.5)
      })
      .on("mouseleave", function (actual, i) {
        d3.select(this).attr("opacity", 1)
      });
  }
}
</script>

<style scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
  .bar {
    fill: #4289b9;
  }
</style>

