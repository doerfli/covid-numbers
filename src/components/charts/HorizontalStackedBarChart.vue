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
export default class HorizontalStackedBarChart extends Vue {

  @Prop()
  private data!: Array<DataPoint>

  private leftMargin = 35;
  private topMargin = 18;
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
    const max = 100;
    // console.log(`min: ${min} / max: ${max}`);

    // intialize chart
    const svg = d3.select(`#${this.chartId}`);
    const width = this.$refs.chart.clientWidth - 1.25 * this.leftMargin;
    const height = this.$refs.chart.clientHeight - this.bottomMargin - this.topMargin;
    const chart = svg.append('g')
      .attr('transform', `translate(${(this.leftMargin)}, ${this.topMargin})`);
    const margin = ({top: 0, right: 5, bottom: 16, left: 0});

    const series = d3.stack()
      .keys(["yValue", "y2Value", "y3Value", "y4Value"])(inputData as any);

    // console.log(series);

    const y = d3.scaleBand()
      .domain(inputData.map((d: DataPoint) => d.xValue))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    const yAxis = (g: any) => g
      .attr("transform", `translate(0,${width - margin.left})`)
      .attr("class", "yaxis")
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call((g: any) => g.selectAll(".domain").remove());

    const x = d3.scaleLinear()
      .domain([min, max])
      .rangeRound([margin.left, width - margin.right]);

    const xAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},${margin.bottom})`)
      .call(d3.axisBottom(x).ticks(null, "s"))
      .call((g: any) => g.selectAll(".domain").remove());

    const cssClass = d3.scaleOrdinal()
      .domain(series.map((d: any) => d.key))
      .range(["hfirst", "hsecond", "hthird", "hfourth"]);

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
        .attr("y", (d: any) => y(d.data.xValue) as number)
        .attr("x", (d: any) => x(d[0]) as number)
        .attr("width", (d: any) => {
          const t = x(d[1]) - x(d[0]) as number;
          // console.log(t);
          return t;
        })
        .attr("height", y.bandwidth());

    chart.append("g")
      .call(xAxis);

    chart.append("g")
      .call(yAxis);

    const firstDataPoint = inputData[0];
    const legend = svg.selectAll(".legend")
      .data([firstDataPoint.yValueDescr, firstDataPoint.y2ValueDescr, firstDataPoint.y3ValueDescr, firstDataPoint.y4ValueDescr])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + ( 31 + i * 150 )+ ", 2)"; });

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

    .hfirst {
      @apply fill-current text-emerald-600 dark:text-teal-200;
    }

    .hsecond {
      @apply fill-current text-emerald-400 dark:text-teal-400;
    }

    .hthird {
      @apply fill-current text-emerald-200 dark:text-teal-600;
    }

    .hfourth {
      @apply fill-current text-emerald-100 dark:text-teal-900;
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

