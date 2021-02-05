<template>
  <div class="p-1">
    <svg ref="chart" :id="chartId" class="chart"></svg>
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

  private xmargin = 40;
  private ymargin = 20;
  private eid = Math.floor(Math.random() * 10000);

  public $refs!: {
    chart: HTMLFormElement;
  };

  public mounted() {
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

    const min = dataPoints.length > 0
      ? (dataPoints.map((e) => Math.min(e.yValue ?? 0, e.y2Value ?? 0)).reduce((a, b) => Math.min(a, b))) * 1.01
      : 0;
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

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'xaxis')
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('class', 'xlabel')
      .attr('x', -14)
      .style('text-anchor', 'start')

    // paint x-axis labels
    let showEveryXthLabel = 7;
    if (dataPointsSize > 120) {
      showEveryXthLabel = showEveryXthLabel * 4;
    } else if (dataPointsSize > 60) {
      showEveryXthLabel = showEveryXthLabel * 2;
    }
    const labelOffset = dataPointsSize % showEveryXthLabel;
    const ticks = d3.selectAll(`#${this.chartId} .xaxis .tick`)
    ticks.each(function (_, i) {
      switch (i) {
        // case 0:
        case dataPointsSize - 1:
          // ignore
          break

        default:
          if ((i - labelOffset) % showEveryXthLabel != 0) {
            d3.select(this).remove()
          }
      }
    })

    // paint y-axis
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([min, max])
    chart.append('g')
      .call(d3.axisLeft(yScale)
        .scale(yScale)
        .tickSize(-width))

    if (dataPoints[0].yValue !== undefined) {
      // plot bars
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
        .on('mouseenter', this.barMouseEnter)
        .on('mouseleave', this.barMouseLeave)
    }

    if (dataPoints[0].y2Value !== undefined) {
      // plot line
      const line = d3.line<DataPoint>()
        .x((d) => (xScale(d.xValue) ?? 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.y2Value ?? 0))

      chart.append("path")
        .attr("class", "line2")
        .attr("d", line(dataPoints.filter((d) => d.y2Value != null)) ?? ""); // exlude empty datapoints
    }

    if (dataPoints[0].y3Value !== undefined) {
      // plot line
      const line = d3.line<DataPoint>()
        .x((d) => (xScale(d.xValue) ?? 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.y3Value ?? 0))

      chart.append("path")
        .attr("class", "line3")
        .attr("d", line(dataPoints.filter((d) => d.y3Value != null)) ?? ""); // exlude empty datapoints
    }

    if (dataPoints[0].y4Value !== undefined) {
      // plot line
      const line = d3.line<DataPoint>()
        .x((d) => (xScale(d.xValue) ?? 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.y4Value ?? 0))

      chart.append("path")
        .attr("class", "line4")
        .attr("d", line(dataPoints.filter((d) => d.y4Value != null)) ?? ""); // exlude empty datapoints
    }

    // cleanup
    /** remove line around chart */
    chart.selectAll('.domain').remove();

    chart.selectAll('text')
      .attr('class', 'chartText');
  }

  // eslint-disable-next-line
  private barMouseEnter(event: any, data: DataPoint) {
    this.$emit("bar-active", data);
    d3.select(event.target).attr('class', 'bar highlight')
  }

  // eslint-disable-next-line
  private barMouseLeave(event: any, data: DataPoint) {
    // this.$emit("bar-active", data);
    d3.select(event.target).attr('class', 'bar')
  }

  private static renderTooltipContent (s: DataPoint) {
    let tooltip = ''
    if (s.xValueDescr !== undefined) {
      tooltip += s.xValueDescr + ': ' + s.xValue + '\n'
    }
    if (s.yValueDescr !== undefined) {
      tooltip += s.yValueDescr + ': ' + s.yValue + '\n'
    }
    if (s.y2ValueDescr !== undefined) {
      tooltip += s.y2ValueDescr + ': ' + s.y2Value + '\n'
    }
    return tooltip
  }
}
</script>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;

    .bar {
      @apply fill-current text-emerald-400 dark:text-teal-400 opacity-90;

      title {
        @apply text-pink-500;
      }
    }

    .bar.highlight {
      @apply opacity-70;
    }

    .tick line {
      stroke: #aaa;
    }

    .line2 {
      @apply text-emerald-700 dark:text-teal-100;
      @apply stroke-current;
      @apply stroke-2;
      fill: none;
      stroke-dasharray: 5px;
    }

    .line3 {
      @apply text-indigo-700 dark:text-teal-100;
      @apply stroke-current;
      @apply stroke-2;
      fill: none;
      stroke-dasharray: 1px;
    }

    .line4 {
      @apply text-pink-700 dark:text-teal-100;
      @apply stroke-current;
      @apply stroke-2;
      fill: none;
      stroke-dasharray: 1px;
    }

    .chartText {
      @apply text-gray-700 dark:text-gray-300;
    }
  }
</style>

