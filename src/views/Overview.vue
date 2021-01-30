<template>
  <div>
    <IncidenceOverview
      v-for="canton in cantons"
      :key="canton.name"
      :canton="canton.name"
    ></IncidenceOverview>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CantonConfig from '@/model/cantonconfig'
import Cases from '@/components/Cases.vue'
import IncidenceOverview from '@/components/IncidenceOverview.vue'

@Component({
  components: { IncidenceOverview, Cases }
})
export default class Overview extends Vue {

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

}
</script>

<style scoped>

</style>

