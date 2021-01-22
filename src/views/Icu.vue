<template>
  <div>
    <div class="flex flex-wrap mt-1">
      <Cases
        v-for="canton in selectedCantons"
        :key="canton.name"
        :canton="canton.name"
        :days-to-show="getDaysToShow"
        field-to-show="currIcu"
        calculate-average="true"
      ></Cases>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarChart from '@/components/charts/BarChart.vue'
import Cases from '@/components/Cases.vue'
import Footer from '@/components/Footer.vue'
import CantonConfig from '@/model/cantonconfig'
import Hideable from '@/components/base/Hideable.vue'
import ViewOptions from '@/components/ViewOptions.vue'

@Component({
  components: {
    ViewOptions,
    Hideable,
    Footer,
    Cases,
    BarChart
  }
})
export default class Icu extends Vue {

  private get selectedCantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons.filter((c: CantonConfig) => c.show);
  }

  private get getDaysToShow() {
    return this.$store.state.viewProps.daysToShow;
  }

}
</script>

<style>

</style>
