<template>
  <div class="flex flex-wrap">
    <Cases
      v-for="canton in cantons"
      :key="canton"
      v-bind:canton="canton"
    ></Cases>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import BarChart from '@/components/charts/BarChart.vue'
import Cases from '@/components/Cases.vue'
import Footer from '@/components/Footer.vue'

@Component({
  components: {
    Footer,
    Cases,
    BarChart
  }
})
export default class Home extends Vue {

  public mounted() {
    console.log("Home.mounted");
    this.$store.dispatch("cases/fetch");
  }

  private get cantons() {
    return this.$store.state.viewProps.cantons;
  }

}
</script>

<style>

</style>
