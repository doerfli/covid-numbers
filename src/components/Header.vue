<template>
  <div>
    <div class="flex-initial">
      <H1>Covid-19 Statistics Switzerland</H1>
    </div>
    <div :class="getClass('ConfirmedCases')">
      <router-link :to="{ name: 'ConfirmedCases' }">Confirmed cases</router-link>
    </div>
    <div :class="getClass('Trend')">
      <router-link :to="{ name: 'Trend' }">Incidence Trend</router-link>
    </div>
    <div :class="getClass('IncidenceOneWeek')">
      <router-link :to="{ name: 'IncidenceOneWeek' }">7-day Incidence</router-link>
    </div>
    <div :class="getClass('IncidenceTwoWeek')">
      <router-link :to="{ name: 'IncidenceTwoWeek' }">14-day Incidence</router-link>
    </div>
    <div :class="getClass('Hospitalized')">
      <router-link :to="{ name: 'Hospitalized' }">Hospitalized</router-link>
    </div>
    <div :class="getClass('Icu')">
      <router-link :to="{ name: 'Icu' }">Icu</router-link>
    </div>
    <div :class="getClass('Deceased')">
      <router-link :to="{ name: 'Deceased' }">Deceased</router-link>
    </div>
    <div :class="getClass('Vaccinations')">
      <router-link :to="{ name: 'Vaccinations' }">Vaccinations</router-link>
    </div>
    <span v-if="! isDetailsPage()">
      <div @click="toggleViewOptions"
           v-if="! showViewOptions"
           class="menuitem">
        <i class="fas fa-cog pr-1"></i>
        <i class="fas fa-chevron-down"></i>
        Show view options
      </div>
      <div @click="toggleViewOptions"
           v-else
           class="menuitem">
        <i class="fas fa-cog pr-1"></i>
        <i class="fas fa-chevron-up"></i>
        Hide view options
      </div>
    </span>
    <Hideable :visible="showViewOptions">
      <ViewOptions />
    </Hideable>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import H1 from '@/components/base/H1.vue'
import H2 from '@/components/base/H2.vue'
import Hideable from '@/components/base/Hideable.vue'
import ViewOptions from '@/components/ViewOptions.vue'

@Component({
  components: { ViewOptions, Hideable, H1, H2 }
})
export default class Header extends Vue {

  private showViewOptions = false;

  private toggleViewOptions() {
    this.showViewOptions = ! this.showViewOptions;
  }

  private getClass(routeName: string) {
    if (this.$route.name === routeName) {
      return "menuitem_active";
    } else {
      return "menuitem";
    }
  }

  private isDetailsPage() {
    return this.$route.name === "Details";
  }
}
</script>

<style lang="scss" scoped>
  .menuitem {
    @apply pb-1 pr-5 inline-block;
    @apply text-sm;
    @apply cursor-pointer;
    @apply text-indigo-700 hover:text-indigo-500 dark:text-blue-500 dark:hover:text-blue-300;
  }

  .menuitem_active {
    @apply pb-1 pr-5 inline-block;
    @apply text-sm font-semibold underline;
    @apply text-emerald-700 dark:text-teal-500;
  }
</style>

