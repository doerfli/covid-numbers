<template>
  <div class="flex text-xs">
    <div class="flex-1">
      Date: {{ getHighlightDate }}
    </div>
    <div class="flex-1">
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

