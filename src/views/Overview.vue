<template>
  <div class="mt-2">
    <IncidenceOverview
      v-for="canton in cantons"
      :key="canton.short"
      :name="canton.name"
      :short-name="canton.short"
    ></IncidenceOverview>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cases from '@/components/Cases.vue'
import IncidenceOverview from '@/components/IncidenceOverview.vue'
import StaticData from '@/store/staticdata'

@Component({
  components: { IncidenceOverview, Cases }
})
export default class Overview extends Vue {

  private get cantons(): Array<any> {
    return StaticData.getCantonsFullWithCh();
  }

}
</script>

<style scoped>

</style>

