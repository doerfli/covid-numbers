<template>
  <div class="home">
    <Cases
      v-for="canton in cantons" :key="canton"
      v-bind:canton="canton"
    ></Cases>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarChart from '@/components/charts/BarChart.vue'
import Cases from '@/components/Cases.vue'

@Component({
  components: {
    Cases,
    BarChart
  }
})
export default class Home extends Vue {

  private CANTONS = [
    "AG",
    // "AI",
    // "AR",
    // "BE",
    // "BL",
    // "BS",
    // "FR",
    // "GE",
    // "GL",
    // "GR",
    // "JU",
    // "LU",
    // "NE",
    // "NW",
    // "OW",
    // "SG",
    // "SH",
    // "SO",
    // "SZ",
    // "TG",
    // "TI",
    // "UR",
    // "VD",
    // "VS",
    // "ZG",
    // "ZH"
  ]

  private get cantons() {
    return this.CANTONS;
  }

}
</script>

<style>

</style>
