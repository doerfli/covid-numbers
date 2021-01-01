<template>
  <div>
    <div @click="toggleCantonSelect"
         v-if="! showCantonSelect"
         class="text-blue-500 cursor-pointer text-sm pb-1">Show view options</div>
    <div @click="toggleCantonSelect"
         v-else
         class="text-blue-500 cursor-pointer text-sm pb-1">Hide view options</div>
    <Hideable :visible="showCantonSelect">
      <ViewOptions />
    </Hideable>
    <div class="flex flex-wrap mt-1">
      <Cases
        v-for="canton in selectedCantons"
        :key="canton.name"
        v-bind:canton="canton.name"
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
export default class Home extends Vue {

  private showCantonSelect = false;

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

  private toggleCantonSelect() {
    this.showCantonSelect = ! this.showCantonSelect;
  }

}
</script>

<style>

</style>
