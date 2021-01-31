<template>
  <svg ref="chart" :id="chartId" class="chart"></svg>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import * as d3 from 'd3'
import DataPoint from '@/model/datapoint'

@Component({
  components: {}
})
export default class AreaChart extends Vue {

  @Prop()
  private data!: Array<DataPoint>

  private xmargin = 0;
  private ymargin = 0;
  private eid = Math.floor(Math.random() * 10000);

  public $refs!: {
    chart: HTMLFormElement;
  };

  private mounted() {
    // console.log("BarChart.mounted");
    this.paintChart(this.data);
  }

  get chartId() {
    return `chart${this.eid}`;
  }

  @Watch('data')
  dataChanged(dataPoints: Array<DataPoint>) {
    // console.log("dataChanged");
    // console.log(dataPoints);
    this.paintChart(dataPoints)
  }

  private paintChart (dataPoints: Array<DataPoint>) {
    // clear existing contents
    d3.selectAll(`#${this.chartId} *`).remove();
    const dataPointsSize = dataPoints.length;

    // don't paint anything when no data is available
    if (dataPointsSize == 0) { return; }

    // TODO simplify
    const max = dataPoints.length > 0
      ? (dataPoints.map((e) => Math.max(e.yValue ?? 0, e.y2Value ?? 0)).reduce((a, b) => Math.max(a, b))) * 1.01
      : 1;
    // console.log(max);

    // intialize chart
    const svg = d3.select(`#${this.chartId}`);
    const width = this.$refs.chart.clientWidth - 1.25 * this.xmargin;
    const height = this.$refs.chart.clientHeight - this.ymargin;
    const chart = svg.append('g')
      .attr('transform', `translate(${(this.xmargin)}, 0)`);

    // paint x-axis
    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(dataPoints.map((s) => s.xValue))
      .padding(0.2)

    // paint y-axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, max])

    // plot area
    chart
      .append("path")
      .datum(dataPoints)
      .attr("class", "area")
      .attr("d",
        d3.area<DataPoint>()
          .x(function(d) { return xScale(d.xValue) ?? 0 })
          .y0(yScale(0))
          .y1(function(d) { return yScale(d.yValue ?? 0) })
      )

    // plot line
    const line = d3.line<DataPoint>()
      .x((d) => (xScale(d.xValue) ?? 0) )
      .y((d) => yScale(d.yValue ?? 0))

    chart.append("path")
      .attr("class", "contourLine")
      .attr("d", line(dataPoints) ?? "");
  }
}
</script>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;

    .area {
      @apply text-emerald-400 dark:text-teal-100;
      @apply fill-current opacity-60;
    }

    .contourLine {
      @apply text-emerald-700 dark:text-teal-300;
      @apply stroke-current;
      @apply stroke-2;
      fill: none;
    }
  }
</style>

