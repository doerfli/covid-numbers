<template>
  <div class="text-xs grid grid-cols-2 justify-items-stretch px-4">
    <div class="">
      Date: {{ getHighlightDate }}
    </div>
    <div class="justify-self-end content-end">
      Cnt/Avg: {{ getHighlightCount }} / {{ getHighlightAvg }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataPoint from '@/model/datapoint'

@Component({
    components: {}
  })
  export default class HighlightLine extends Vue {
    @Prop()
    private highlightDataPoint: DataPoint | undefined;

    get getHighlightDate() {
      return this.highlightDataPoint?.xValue || "-";
    }

    get getHighlightCount() {
      return this.highlightDataPoint?.yValue || "-";
    }

    get getHighlightAvg() {
      return this.highlightDataPoint?.y2Value || "-";
    }
  }
</script>

<style scoped>

</style>

