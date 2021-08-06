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
export default class StackedBarChart extends Vue {

  @Prop()
  private data!: Array<DataPoint>

  private leftMargin = 35;
  private topMargin = 12;
  private bottomMargin = 20;
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

  /* eslint-disable  @typescript-eslint/no-explicit-any */
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
    // console.log(`min: ${min} / max: ${max}`);

    // intialize chart
    const svg = d3.select(`#${this.chartId}`);
    const width = this.$refs.chart.clientWidth - 1.25 * this.leftMargin;
    const height = this.$refs.chart.clientHeight - this.bottomMargin - this.topMargin;
    const chart = svg.append('g')
      .attr('transform', `translate(${(this.leftMargin)}, ${this.topMargin})`);
    const margin = ({top: 0, right: 0, bottom: 0, left: 0});

    const series = d3.stack()
      .keys(["yValue", "y2Value", "y3Value"])(inputData as any);

    // console.log(series);

    const x = d3.scaleBand()
      .domain(inputData.map((d: DataPoint) => d.xValue))
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
      .range(["first", "second"]);

    // eslint-disable-next-line
    chart.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
        // .attr("fill", (d: any) => color(d[0]) as any)
        .attr("class", (d: any) => {
          // console.log(d);
          return cssClass(d.key) as any;
        })
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", (d: any) => x(d.data.xValue) as number)
        .attr("y", (d: any) => y(d[1]) as number)
        .attr("height", (d: any) => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

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
    });

    const firstDataPoint = inputData[0];
    const legend = svg.selectAll(".legend")
      .data([firstDataPoint.yValueDescr, firstDataPoint.y2ValueDescr])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + ( 40 + i * 120 )+ ", 0)"; });

    legend.append("rect")
      .attr("x", 4)
      .attr("width", 12)
      .attr("height", 12)
      .attr("class", (d: any) => cssClass(d) as any);

    legend.append("text")
      .attr("x", 4 + 12 + 4)
      .attr("y", 10)
      // .attr("dy", ".35em")
      .attr("class", "legendtext")
      .text(function(d: any) { return d;});
  }
  /* eslint-enable  @typescript-eslint/no-explicit-any */
}
</script>

<style lang="scss">
  .chart {
    width: 100%;
    height: 100%;

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

    .legend {
      .legendtext {
        @apply text-xs;
        @apply text-gray-700 dark:text-gray-300 fill-current;
      }
    }
  }
</style>

