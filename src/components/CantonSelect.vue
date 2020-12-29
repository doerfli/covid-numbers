<template>
  <div>
    <div class="flex flex-wrap bg-gray-800 p-2">
      <div class="py-2 pr-2">Cantons: </div>
      <div v-for="canton in cantons"
           :key="canton.name"
           class="pr-3 py-2"
           >
        <input type="checkbox" :checked="canton.show" @change="toggle(canton.name)" class="mr-0.5"/>
        {{ canton.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CantonConfig from '@/model/cantonconfig'

@Component({
  components: {}
})
export default class CantonSelect extends Vue {

  private get cantons(): CantonConfig[] {
    return this.$store.state.viewProps.cantons;
  }

  private toggle(canton: string) {
    this.$store.dispatch("viewProps/toggleCanton", { canton: canton });
  }

}
</script>

<style scoped>

</style>

