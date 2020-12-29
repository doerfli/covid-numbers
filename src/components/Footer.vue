<template>
  <div class="py-6">
    <i class="fab fa-github"></i> <Ref uri="https://github.com/doerfli/covid-numbers/">doerfli/covid-numbers</Ref>
    | <i class="fab fa-twitter"></i> <Ref uri="https://twitter.com/doerfli">@doerfli</Ref>
    | <i class="fas fa-database"></i> <Ref uri="https://github.com/openZH/covid_19">OpenZH/Covid19</Ref>
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

