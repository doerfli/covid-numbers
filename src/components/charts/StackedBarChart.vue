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

  private paintChart (inputData: Array<DataPoint>) {
    // console.log("inputData"); console.log(inputData);
    // clear existing contents
    d3.selectAll(`#${this.chartId} *`).remove();
    const dataPointsSize = inputData.length;

    // don't paint anything when no data is available
    if (dataPointsSize == 0) { return; }

    const min = 0;
    const max = inputData.length > 0
      ? (inputData.map((e) => (e.yValue ?? 0) + (e.y2Value ?? 0) + (e.y3Value ?? 0)).reduce((a, b) => Math.max(a, b))) * 1.01
      : 1;
    console.log(`min: ${min} / max: ${max}`);

    // intialize chart
    const svg = d3.select(`#${this.chartId}`);
    const width = this.$refs.chart.clientWidth - 1.25 * this.xmargin;
    const height = this.$refs.chart.clientHeight - this.ymargin;
    const chart = svg.append('g')
      .attr('transform', `translate(${(this.xmargin)}, 0)`);
    const margin = ({top: 0, right: 0, bottom: 0, left: 0});

    const series = d3.stack()
      .keys(["yValue", "y2Value", "y3Value"])(inputData as any);

    const x = d3.scaleBand()
      .domain(inputData.map((d: any) => d.xValue))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const xAxis = (g: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "xaxis")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g: any) => g.selectAll(".domain").remove());

    const y = d3.scaleLinear()
      .domain([min, max])
      .rangeRound([height - margin.bottom, margin.top]);

    const yAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call((g: any) => g.selectAll(".domain").remove());

    const cssClass = d3.scaleOrdinal()
      .domain(series.map((d: any) => d.key))
      .range(["first", "second", "third"]);

    chart.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
        // .attr("fill", (d: any) => color(d[0]) as any)
        .attr("class", (d: any) => cssClass(d[0]) as any)
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", (d: any, _) => x(d.data.xValue) as number)
        .attr("y", (d: any) => y(d[1]) as number)
        .attr("height", (d: any) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())

    chart.append("g")
      .call(xAxis);

    chart.append("g")
      .call(yAxis);

    // only show every 7th label
    const labelOffset = dataPointsSize % 7;
    const ticks = d3.selectAll(`#${this.chartId} .xaxis .tick`)
    ticks.each(function (_, i) {
      switch (i) {
        // case 0:
        case dataPointsSize - 1:
          // ignore
          break

        default:
          if ((i - labelOffset) % 7 != 0) {
            d3.select(this).remove()
          }
      }
    })
  }
}
</script>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;

    .bar {

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

    .first {
      @apply fill-current text-emerald-600 dark:text-teal-200;
    }

    .second {
      @apply fill-current text-emerald-400 dark:text-teal-400;
    }

    .third {
      @apply fill-current text-emerald-200 dark:text-teal-600;
    }

    .chartText {
      @apply text-gray-700 dark:text-gray-300;
    }
  }
</style>

