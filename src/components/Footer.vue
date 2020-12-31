<template>
  <div class="py-6 flex flex-wrap">
    <div class="entry">
      <i class="fab fa-github"></i> <Ref uri="https://github.com/doerfli/covid-numbers/">doerfli/covid-numbers</Ref>
    </div>
    <div class="entry">
      <i class="fab fa-twitter"></i> <Ref uri="https://twitter.com/doerfli">@doerfli</Ref>
    </div>
    <div class="entrylast">
      <i class="fas fa-database"></i> <Ref uri="https://github.com/openZH/covid_19">OpenZH/Covid19</Ref>
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

<style scoped>
  .entry {
    @apply px-3;
    @apply border-solid;
    @apply border-r-2;
    @apply border-gray-200;
  }
  .entrylast {
    @apply px-3;
  }
</style>

