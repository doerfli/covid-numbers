<template>
  <div class="footer">
    <div class="flex flex-wrap">
      <div class="entryfirst">
        <i class="fab fa-github"></i> <Ref uri="https://github.com/doerfli/covid-numbers/">doerfli/covid-numbers</Ref>
      </div>
      <div class="entry">
        <i class="fab fa-twitter"></i> <Ref uri="https://twitter.com/doerfli">@doerfli</Ref>
      </div>
      <div class="entrylast">
        <i class="fas fa-database"></i> <Ref uri="https://github.com/openZH/covid_19">OpenZH/Covid19</Ref>
      </div>
    </div>
    <div class="disclaimer">
      <span>Disclaimer</span>:
      All data shown on this page is based on the data provided by <Ref uri="https://github.com/openZH/">OpenZH</Ref>.
      Calculations are done to the best of my knowledge, but i do not guarantee correctness.
      <br/>
      If you find a mistake, I will be happy to fix it.
      Please bring it to my attention by raising an issue on the <Ref uri="https://github.com/doerfli/covid-numbers/">Github project</Ref> or contact me via <Ref uri="https://twitter.com/doerfli">Twitter</Ref>.
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Ref from '@/components/base/Ref.vue'

@Component({
  components: { Ref }
})
export default class Footer extends Vue {

}
</script>

<style scoped lang="scss">
  .footer {
    @apply py-6;

    .entry {
      @apply px-3;
      @apply border-solid;
      @apply border-r-2;
      @apply border-gray-700 dark:border-gray-200;
    }
    .entryfirst {
      @apply pr-3;
      @apply border-solid;
      @apply border-r-2;
      @apply border-gray-700 dark:border-gray-200;
    }
    .entrylast {
      @apply pl-3;
    }
    .disclaimer {
      @apply pt-2;
      @apply text-sm;
      > span {
        @apply text-pink-600 dark:text-pink-500 font-bold;
      }
    }
  }
</style>

