<template>
  <div class="mt-2">
    <IncidenceMiniChart
      v-for="canton in cantons"
      :key="canton.short"
      :name="canton.name"
      :short-name="canton.short"
    ></IncidenceMiniChart>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cases from '@/components/Cases.vue'
import StaticData from '@/store/staticdata'
import IncidenceMiniChart from '@/components/IncidenceMiniChart.vue'

@Component({
  components: { IncidenceMiniChart, IncidenceOverview: IncidenceMiniChart, Cases }
})
export default class IncidenceOverview extends Vue {

  private get cantons(): Array<any> {
    return StaticData.getCantonsFullWithCh();
  }

}
</script>

<style scoped>

</style>

