<template>
  <div>
    <div class="flex flex-wrap mt-1">
      <Cases
        v-for="canton in selectedCantons"
        :key="canton.nameShort"
        :canton="canton.nameShort"
        :name="canton.name"
        field-to-show="deceasedChg"
        :days-to-show="getDaysToShow"
        show-average="true"
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
import Alert from '@/components/base/Alert.vue'

@Component({
  components: {
    Alert,
    ViewOptions,
    Hideable,
    Footer,
    Cases,
    BarChart
  }
})
export default class Deceased extends Vue {

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
