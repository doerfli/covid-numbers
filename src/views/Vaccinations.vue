<template>
  <div>
    <div class="flex flex-wrap mt-1">
      <VaccinationBlock
        v-for="canton in selectedCantons"
        :key="canton.nameShort"
        :canton="canton.nameShort"
        :name="canton.name"
        field-to-show="confCasesChg"
        :days-to-show="getDaysToShow"
        calculate-average="true"
      ></VaccinationBlock>
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
import VaccinationBlock from '@/components/VaccinationBlock.vue'

@Component({
  components: {
    VaccinationBlock,
    ViewOptions,
    Hideable,
    Footer,
    Cases,
    BarChart
  }
})
export default class Vaccinations extends Vue {

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
