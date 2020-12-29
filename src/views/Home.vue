<template>
  <div>
    <CantonSelect />
    <div class="flex flex-wrap">
      <Cases
        v-for="canton in selectedCantons"
        :key="canton.name"
        v-bind:canton="canton.name"
      ></Cases>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarChart from '@/components/charts/BarChart.vue'
import Cases from '@/components/Cases.vue'
import Footer from '@/components/Footer.vue'
import CantonSelect from '@/components/CantonSelect.vue'
import CantonConfig from '@/model/cantonconfig'

@Component({
  components: {
    CantonSelect,
    Footer,
    Cases,
    BarChart
  }
})
export default class Home extends Vue {

  public mounted() {
    console.log("Home.mounted");
    this.$store.dispatch("viewProps/init");
    this.$store.dispatch("cases/fetch");
  }

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

  private get selectedCantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons.filter((c: CantonConfig) => c.show);
  }

}
</script>

<style>

</style>
