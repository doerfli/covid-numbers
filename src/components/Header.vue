<template>
  <div>
    <div class="flex-initial">
      <H1>Covid-19 Statistics Switzerland</H1>
    </div>
    <div class="primary">
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
        <router-link :to="{ name: 'Vaccinations' }">Vaccination rate</router-link>
      </div>
      <div :class="getClass('VaccinationsChg')">
        <router-link :to="{ name: 'VaccinationsChg' }">Vaccinations per day</router-link>
      </div>
      <span v-if="! isDetailsPage()">
        <div @click="toggleViewOptions"
             v-if="! showViewOptions"
             class="menuitem viewoptions">
          Display view options
          <i class="fas fa-chevron-down"></i>
        </div>
        <div @click="toggleViewOptions"
             v-else
             class="menuitem viewoptions">
          Hide view options
          <i class="fas fa-chevron-up"></i>
        </div>
      </span>
      <Hideable :visible="showViewOptions">
        <ViewOptions />
      </Hideable>
    </div>
    <div class="secondary" v-if="isConfirmedCasesPage()">
      <div :class="getClass('ConfirmedCases')">
        <router-link :to="{ name: 'ConfirmedCases' }">Per day</router-link>
      </div>
      <div :class="getClass('ConfirmedCasesPerWeek')">
        <router-link :to="{ name: 'ConfirmedCasesPerWeek' }">Per Week</router-link>
      </div>
    </div>
    <div class="secondary" v-if="isHospitalizedPage()">
      <div :class="getClass('Hospitalized')">
        <router-link :to="{ name: 'Hospitalized' }">Absolute</router-link>
      </div>
      <div :class="getClass('HospitalizedChg')">
        <router-link :to="{ name: 'HospitalizedChg' }">Change per day</router-link>
      </div>
    </div>
    <div class="secondary" v-if="isIcuPage()">
      <div :class="getClass('Icu')">
        <router-link :to="{ name: 'Icu' }">Absolute</router-link>
      </div>
      <div :class="getClass('IcuChg')">
        <router-link :to="{ name: 'IcuChg' }">Change per day</router-link>
      </div>
    </div>
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

  private isConfirmedCasesPage() {
    return this.$route.name === "ConfirmedCases" || this.$route.name === "ConfirmedCasesPerWeek" ;
  }

  private isHospitalizedPage() {
    return this.$route.name === "Hospitalized" || this.$route.name === "HospitalizedChg" ;
  }

  private isIcuPage() {
    return this.$route.name === "Icu" || this.$route.name === "IcuChg" ;
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

  .viewoptions {
    @apply md:float-right md:pr-2;
  }

  .menuitem_active {
    @apply pb-1 pr-5 inline-block;
    @apply text-sm font-semibold underline;
    @apply text-emerald-700 dark:text-teal-500;
  }
</style>

