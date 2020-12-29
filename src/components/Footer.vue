<template>
  <div class="py-6">
    Data source: <Ref uri="https://github.com/openZH/covid_19">OpenZH/Covid19</Ref>
    | Twitter: <Ref uri="https://twitter.com/doerfli">@doerfli</Ref>
    | Github: <Ref uri="https://github.com/doerfli/covid-numbers/">doerfli/covid-numbers</Ref>
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

</style>

