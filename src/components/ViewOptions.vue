<template>
  <div class="bg-emerald-100 dark:bg-teal-900 p-3 rounded-md">
    <div class="flex flex-wrap">
      <div class="py-2 pr-2">Time range:</div>
      <div :class="getDaysToShowClass(30)"
           @click="setDaysToShow(30)">Last 30 days</div>
      <div :class="getDaysToShowClass(60)"
           @click="setDaysToShow(60)">Last 60 days</div>
      <div :class="getDaysToShowClass(90)"
           @click="setDaysToShow(90)">Last 90 days</div>
      <div :class="getDaysToShowClass(180)"
           @click="setDaysToShow(180)">Last 180 days</div>
      <div :class="getDaysToShowClass(365)"
           @click="setDaysToShow(365)">Last 365 days</div>
    </div>
    <div class="flex flex-wrap">
      <div class="py-2 pr-2">Cantons: </div>
      <div v-for="canton in cantons"
           :key="canton.nameShort"
           class="pr-3 py-2"
           >
        <Checkbox :text="canton.nameShort" :checked="canton.show" @change="toggle(canton.nameShort)"/>
      </div>
    </div>
    <div class="p-2 text-sm inline-block text-indigo-700 dark:text-blue-500" @click="selectAll()">Select all</div>
    <div class="p-2 text-sm inline-block text-indigo-700 dark:text-blue-500" @click="selectNone()">Select none</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CantonConfig from '@/model/cantonconfig'
import Checkbox from '@/components/base/Checkbox.vue'

@Component({
  components: { Checkbox }
})
export default class ViewOptions extends Vue {

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

  private toggle(canton: string) {
    this.$store.dispatch("viewProps/toggleCanton", { canton: canton });
  }

  private selectAll() {
    this.$store.dispatch("viewProps/selectAll");
  }

  private selectNone() {
    this.$store.dispatch("viewProps/selectNone");
  }

  private setDaysToShow(days: number) {
    this.$store.dispatch("viewProps/setDaysToShow", { daysToShow: days });
  }

  private getDaysToShowClass(days: number) {
    if (this.$store.state.viewProps.daysToShow === days) {
      return "itemSelected";
    } else {
      return "itemSelect";
    }
  }

}
</script>

<style scoped>
  .itemSelect {
    @apply py-2;
    @apply pr-3;
    @apply text-indigo-700 hover:text-indigo-500;
    @apply dark:text-blue-500 dark:hover:text-blue-300;
    @apply cursor-pointer;
  }
  .itemSelected {
    @apply py-2;
    @apply pr-3;
    @apply text-emerald-700;
    @apply dark:text-teal-500;
  }

  input[type="checkbox"] {
    @apply appearance-none;
  }

  input[type="checkbox"]:checked  {

  }
</style>

