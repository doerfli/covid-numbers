<template>
  <div>
    <div class="flex-initial">
      <H1>Covid-19 Statistics Switzerland</H1>
    </div>
    <div :class="getClass('ConfirmedCases')">
      <router-link :to="{ name: 'ConfirmedCases' }">Confirmed cases</router-link>
    </div>
    <div :class="getClass('Hospitalized')">
      <router-link :to="{ name: 'Hospitalized' }">Hospitalized</router-link>
    </div>
<!--    <div class="menuitem inline-block">Deaths</div>-->
    <div @click="toggleCantonSelect"
         v-if="! showCantonSelect"
         class="menuitem">
      <i class="fas fa-cog pr-1"></i>
      <i class="fas fa-chevron-down"></i>
      Show view options
    </div>
    <div @click="toggleCantonSelect"
         v-else
         class="menuitem">
      <i class="fas fa-cog pr-1"></i>
      <i class="fas fa-chevron-up"></i>
      Hide view options
    </div>
    <Hideable :visible="showCantonSelect">
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

  private showCantonSelect = false;

  private toggleCantonSelect() {
    this.showCantonSelect = ! this.showCantonSelect;
  }

  private getClass(routeName: string) {
    if (this.$route.name === routeName) {
      return "menuitem_active";
    } else {
      return "menuitem";
    }

  }
}
</script>

<style lang="scss" scoped>
  .menuitem {
    @apply pb-1 pr-5 inline-block;
    @apply text-sm;
    @apply cursor-pointer;
    @apply text-indigo-700 dark:text-blue-500;
  }

  .menuitem_active {
    @apply pb-1 pr-5 inline-block;
    @apply text-sm;
    @apply text-emerald-700 dark:text-teal-500;
  }
</style>

